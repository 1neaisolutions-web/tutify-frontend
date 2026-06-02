/** Extract candidate UI strings — does not modify source files. */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const featuresDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/pages/features')
const SKIP = new Set(['LearningHubLegacyRedirect.tsx'])

function shouldSkip(s) {
  if (!s || s.length < 3 || s.length > 300) return true
  if (!/[a-zA-Z]{2}/.test(s)) return true
  if (/^https?:\/\//.test(s)) return true
  if (/^[a-z]+(-[a-z0-9]+)+$/.test(s) && !s.includes(' ')) return true
  if (/^(bg-|text-|flex|grid|px-|from-|to-|hover:)/.test(s)) return true
  if (/^\d/.test(s)) return true
  return false
}

const out = {}
for (const file of fs.readdirSync(featuresDir).filter((f) => f.endsWith('.tsx') && !SKIP.has(f)).sort()) {
  const src = fs.readFileSync(path.join(featuresDir, file), 'utf8')
  const set = new Set()
  for (const re of [
    /toast\.\w+\(\s*['"]([^'"]+)['"]/g,
    /placeholder=["']([^"']+)["']/g,
    />\s*([^<{][^<]{2,200}?)\s*</g,
  ]) {
    let m
    while ((m = re.exec(src))) {
      const s = m[1].trim()
      if (!shouldSkip(s)) set.add(s)
    }
  }
  out[file] = [...set].sort()
}
fs.writeFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'features-strings-extract.json'), JSON.stringify(out, null, 2))
console.log('files', Object.keys(out).length)
