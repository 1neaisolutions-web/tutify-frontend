/**
 * Test sustainability_design_challenge execute-stream from frontend.
 * Run: node scripts/test-sustainability-stream.mjs
 * Requires backend at VITE_API_BASE_URL (default http://localhost:8001).
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
let API_BASE = process.env.VITE_API_BASE_URL || 'http://localhost:8001'
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
const SLUG = 'sustainability_design_challenge'
const PAYLOAD = {
  data: {
    grade_level: '8',
    challenge_theme: 'Reduce Plastic Waste',
    duration: '2 weeks',
    bloom_level: 'create',
  },
}

async function run() {
  console.log('API base:', BASE)
  console.log('Template:', SLUG)
  console.log('Payload:', JSON.stringify(PAYLOAD, null, 2))
  console.log('')

  const res = await fetch(`${BASE}/v1/templates/${SLUG}/execute-stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
    body: JSON.stringify(PAYLOAD),
  })
  if (!res.ok) {
    console.error('Request failed:', res.status, await res.text())
    process.exit(1)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  const eventSequence = []  // e.g. ['meta', 'section_start challenge_title', 'section_content challenge_title', ...]
  const eventTypes = []
  const sectionLabels = []
  let sectionContentLengths = []
  let currentSectionLength = 0
  let fullText = ''
  let hasContentEvent = false
  let lastError = ''
  const openSections = new Set()

  function processBuffer() {
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''
    for (const line of lines) {
      const t = line.trimEnd().replace(/\r$/, '')
      if (!t.startsWith('data: ')) continue
      try {
        const event = JSON.parse(t.slice(6).trim())
        eventTypes.push(event.type)
        if (event.type === 'error') lastError = event.message || event.type
        if (event.type === 'content') hasContentEvent = true
        if (event.type === 'section_start') {
          if (event.section) openSections.add(event.section)
          if (event.label) sectionLabels.push(event.label)
          eventSequence.push(`section_start ${event.section || ''}`)
          if (currentSectionLength > 0) sectionContentLengths.push(currentSectionLength)
          currentSectionLength = 0
        } else if (event.type === 'section_content') {
          eventSequence.push(`section_content ${event.section || ''}`)
          currentSectionLength += (event.chunk || '').length
          if (typeof event.chunk === 'string') fullText += event.chunk
        } else if (event.type === 'section_end') {
          if (event.section) openSections.delete(event.section)
          eventSequence.push(`section_end ${event.section || ''}`)
        } else if (event.type === 'meta') {
          eventSequence.push('meta')
        } else if (event.type === 'done') {
          eventSequence.push('done')
        }
      } catch (_) {}
    }
  }

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (value) buffer += decoder.decode(value, { stream: true })
      processBuffer()
      if (done) break
    }
  } catch (err) {
    console.log('Stream ended:', err.message)
    processBuffer()
  }
  if (buffer.trim()) processBuffer()
  if (currentSectionLength > 0) sectionContentLengths.push(currentSectionLength)

  // Required verification: exact event sequence (meta -> section_start -> section_content* -> section_end -> ... -> done)
  console.log('--- Event sequence (required format) ---')
  eventSequence.forEach((line) => console.log(line))
  console.log('')

  const hasDone = eventSequence.includes('done')
  const hasMeta = eventSequence.includes('meta')
  const stillOpen = openSections.size
  const sectionStarts = eventSequence.filter((s) => s.startsWith('section_start ')).length
  const sectionEnds = eventSequence.filter((s) => s.startsWith('section_end ')).length
  const ok = hasMeta && hasDone && stillOpen === 0 && sectionStarts === sectionEnds
  if (!ok) {
    console.error('VALIDATION FAILED:')
    if (!hasMeta) console.error('- missing meta')
    if (!hasDone) console.error('- missing done')
    if (stillOpen > 0) console.error('- sections never closed:', [...openSections])
    if (sectionStarts !== sectionEnds) console.error('- section_start count', sectionStarts, '!= section_end count', sectionEnds)
    process.exit(1)
  }
  console.log('VALIDATION OK: meta present, done present, all sections closed, start/end counts match.')
  console.log('')

  console.log('--- Event types (count) ---')
  const typeCounts = {}
  eventTypes.forEach((t) => { typeCounts[t] = (typeCounts[t] || 0) + 1 })
  console.log(JSON.stringify(typeCounts, null, 2))
  console.log('--- Section labels (from section_start) ---')
  console.log(sectionLabels.length ? sectionLabels.join(' | ') : '(none)')
  console.log('--- Section content lengths ---')
  console.log(sectionContentLengths.length ? sectionContentLengths.join(', ') : '(none)')
  if (lastError) console.log('--- Error event message ---\n', lastError)
  console.log('--- Raw "content" events? ---')
  console.log(hasContentEvent ? 'YES (unexpected)' : 'NO (expected)')
  console.log('--- Full text preview (first 500 chars) ---')
  console.log(fullText.trim().slice(0, 500))
  const trimmed = fullText.trim()
  console.log('--- Full text has raw markers? ---')
  console.log(trimmed.includes('[[SECTION:') ? 'YES (unexpected)' : 'NO (expected)')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
