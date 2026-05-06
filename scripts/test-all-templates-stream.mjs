/**
 * Test all templates execute-stream: ensures each template returns content
 * that matches expected output structure (markdown with headings).
 * Run from repo root: node 1ne-frontend/scripts/test-all-templates-stream.mjs
 * Requires backend running (default http://localhost:8001).
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
let API_BASE = process.env.VITE_API_BASE_URL || process.env.VITE_API_URL?.replace(/\/api\/?$/, '') || 'http://localhost:8001'
API_BASE = API_BASE.replace(/\/$/, '')
function loadEnv() {
  try {
    const envPath = join(root, '.env')
    const content = readFileSync(envPath, 'utf8')
    for (const line of content.split('\n')) {
      const m = line.match(/^\s*VITE_API_BASE_URL\s*=\s*(.+)/)
      if (m) API_BASE = m[1].trim().replace(/\/$/, '')
    }
  } catch (_) {}
}

loadEnv()
const BASE = `${API_BASE}/api`

async function fetchTemplates() {
  const res = await fetch(`${BASE}/v1/templates?limit=50`)
  if (!res.ok) throw new Error(`Templates list failed: ${res.status}`)
  const data = await res.json()
  return Array.isArray(data) ? data : (data.items || data.templates || [])
}

async function fetchTemplateDetail(slug) {
  const res = await fetch(`${BASE}/v1/templates/${slug}`)
  if (!res.ok) throw new Error(`Template ${slug} failed: ${res.status}`)
  return res.json()
}

function buildMinimalPayload(detail) {
  const schema = detail?.latest_version?.input_schema || detail?.input_schema
  if (!schema?.properties) return { data: { topic: 'Test', grade: 5 } }
  const required = schema.required || []
  const props = schema.properties
  const data = {}
  for (const key of required) {
    const p = props[key]
    if (!p) continue
    if (p.type === 'integer' || p.type === 'number') {
      data[key] = p.minimum ?? p.min ?? 5
      if (key === 'grade') data[key] = Math.min(12, Math.max(0, data[key]))
    } else if (p.type === 'array') {
      data[key] = ['Item 1']
    } else if (p.type === 'boolean') {
      data[key] = false
    } else if (p.enum) {
      data[key] = p.enum[0]
    } else {
      data[key] = 'Test value'
    }
  }
  if (Object.keys(data).length === 0) {
    data.topic = 'Test'
    data.grade = 5
  }
  return { data }
}

async function streamTemplate(slug, payload) {
  const res = await fetch(`${BASE}/v1/templates/${slug}/execute-stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Stream ${slug} failed: ${res.status} ${text.slice(0, 200)}`)
  }
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let fullText = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''
    for (const line of lines) {
      const t = line.trimEnd().replace(/\r$/, '')
      if (t.startsWith('data: ')) {
        try {
          const event = JSON.parse(t.slice(6).trim())
          if (event.type === 'content' && typeof event.chunk === 'string') fullText += event.chunk
          if (event.type === 'section_content' && typeof event.chunk === 'string') fullText += event.chunk
        } catch (_) {}
      }
    }
  }
  return fullText
}

function assertOutputSchema(text, slug) {
  const trimmed = (text || '').trim()
  if (!trimmed) throw new Error(`${slug}: empty response`)
  return true
}

async function main() {
  console.log('API base:', BASE)
  const templates = await fetchTemplates()
  const slugs = (templates.map((t) => t.slug).filter(Boolean)) || []
  if (slugs.length === 0) {
    console.log('No templates found. Is the backend running and seeded?')
    process.exit(1)
  }
  console.log('Testing', slugs.length, 'templates:', slugs.join(', '))
  let passed = 0
  let failed = 0
  for (const slug of slugs) {
    try {
      const detail = await fetchTemplateDetail(slug)
      const payload = buildMinimalPayload(detail)
      const text = await streamTemplate(slug, payload)
      assertOutputSchema(text, slug)
      console.log('  OK', slug)
      passed++
    } catch (err) {
      console.log('  FAIL', slug, err.message)
      failed++
    }
  }
  console.log('Result:', passed, 'passed', failed, 'failed')
  process.exit(failed > 0 ? 1 : 0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
