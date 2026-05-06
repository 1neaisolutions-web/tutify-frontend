import { expect, test } from '@playwright/test'

const USER_EMAIL = process.env.E2E_EMAIL || ''
const USER_PASSWORD = process.env.E2E_PASSWORD || ''

async function loginViaUI(page: import('@playwright/test').Page) {
  if (!USER_EMAIL || !USER_PASSWORD) {
    throw new Error('Missing E2E_EMAIL / E2E_PASSWORD env vars for UI login.')
  }

  await page.goto('/login')
  // CustomInput labels are not associated via htmlFor/id, so use stable input selectors.
  await page.locator('input[name="email"]').fill(USER_EMAIL)
  await page.locator('input[name="password"]').fill(USER_PASSWORD)
  await page.getByRole('button', { name: /^sign in$/i }).click()

  // Wait for redirect off /login (role-based redirect goes to /dashboard or similar).
  await expect(page).not.toHaveURL(/\/login$/)

  // Ensure auth is persisted before continuing, otherwise authenticated API calls may 401.
  await page.waitForFunction(() => {
    const raw = localStorage.getItem('persist:root')
    if (!raw) return false
    try {
      const parsed = JSON.parse(raw)
      const authRaw = parsed?.auth
      if (!authRaw) return false
      const auth = JSON.parse(authRaw)
      return Boolean(auth?.user?.token)
    } catch {
      return false
    }
  })
}

test.describe('YouTube Quiz Generator (E2E)', () => {
  test('loads once (no lesson-strategies loop) and can generate quiz', async ({ page }) => {
    await loginViaUI(page)

    const strategyCalls: string[] = []
    page.on('request', (req) => {
      const url = req.url()
      if (req.method() === 'GET' && url.includes('/api/v1/youtube-quiz/lesson-strategies')) {
        strategyCalls.push(url)
      }
    })

    await page.goto('/youtube-quiz')

    // Ensure lesson strategies request completes successfully (cards depend on it).
    await page.waitForResponse((res) => {
      return (
        res.url().includes('/api/v1/youtube-quiz/lesson-strategies') &&
        res.request().method() === 'GET' &&
        res.status() === 200
      )
    })

    // Give the page a moment to settle; we should not see repeated refetching.
    await page.waitForTimeout(2000)
    expect(strategyCalls.length).toBeLessThanOrEqual(2)

    // Apply a lesson strategy (assert UI wiring works).
    // Click a specific strategy card via data-testid (stable hook).
    const inquiryLaunch = page.getByTestId('lesson-strategy-card-inquiry_launch')
    await expect(inquiryLaunch).toBeVisible()
    await inquiryLaunch.scrollIntoViewIfNeeded()
    await inquiryLaunch.click()
    await page.getByRole('button', { name: /apply strategy to quiz/i }).click()
    await expect(page.getByText(/strategy applied:/i)).toBeVisible()

    // Reference video fills the form; user must click Generate (no auto-run).
    await page.getByText('Try with example videos').scrollIntoViewIfNeeded()
    const generateCalls: string[] = []
    page.on('request', (req) => {
      const url = req.url()
      if (req.method() === 'POST' && url.includes('/api/v1/youtube-quiz/generate')) {
        generateCalls.push(url)
      }
    })

    // Local backend may return 502 if LLM/provider isn't configured.
    // For a stable E2E UI flow test, mock the generate response with a valid payload.
    await page.route('**/api/v1/youtube-quiz/generate', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          title: 'Sample Video Quiz',
          summary: 'Generated summary',
          sections: [
            {
              heading: 'Key idea check',
              details: 'Core understanding checks',
              questions: [
                {
                  id: 'q1',
                  style: 'multiple_choice',
                  prompt: 'What is normalization?',
                  options: ['A', 'B', 'C', 'D'],
                  correct_option_index: 1,
                },
                {
                  id: 'q2',
                  style: 'quick_check',
                  prompt: '3NF removes transitive dependencies. True or false?',
                  expected_response_type: 'true_false',
                  answer: true,
                },
              ],
            },
          ],
        }),
      })
    })

    const examplesSection = page.locator('div.rounded-2xl', { hasText: 'Try with example videos' })
    await expect(examplesSection).toBeVisible()
    // Example video cards use the `group` class; target those buttons specifically.
    await examplesSection.locator('button.group').first().click()
    await expect(page.getByPlaceholder('https://www.youtube.com/watch?v=...')).not.toHaveValue('')

    const generateRequestPromise = page.waitForRequest((req) => {
      return req.method() === 'POST' && req.url().includes('/api/v1/youtube-quiz/generate')
    }, { timeout: 60_000 })
    await page.getByRole('button', { name: 'Generate quiz', exact: true }).click()
    const generateRequest = await generateRequestPromise

    await page.waitForResponse((res) => res.request() === generateRequest && res.status() === 200, {
      timeout: 60_000,
    })

    await expect(page).toHaveURL(/\/youtube-quiz\/results/, { timeout: 60_000 })
    expect(generateCalls.length).toBeGreaterThanOrEqual(1)

    // Results page basic assertions
    await expect(page.getByRole('button', { name: /back to generator/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /show answers/i })).toBeVisible()
  })

  test('results direct access shows guard message', async ({ page }) => {
    await loginViaUI(page)
    await page.goto('/youtube-quiz/results')
    await expect(page.getByText(/no quiz data found/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /go to quiz generator/i })).toBeVisible()
  })

  test('invalid YouTube URL blocks generation', async ({ page }) => {
    await loginViaUI(page)
    await page.goto('/youtube-quiz')

    await page.getByPlaceholder('https://www.youtube.com/watch?v=...').fill('https://example.com/not-youtube')
    await expect(page.getByText(/please paste a valid youtube/i)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Generate quiz', exact: true })).toBeDisabled()
  })
})

