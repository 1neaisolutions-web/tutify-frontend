/**
 * Applies teacher-tools i18n: merges locale namespaces and patches .tsx files.
 * Run from tutify-frontend: node scripts/apply-teacher-tools-i18n.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const ttRoot = path.join(root, 'src/pages/features/teacher-tools')
const localesDir = path.join(root, 'src/locales')

// ── Locale namespaces (en) ──────────────────────────────────────────────────
const en = JSON.parse(fs.readFileSync(path.join(__dirname, 'teacher-tools-en.json'), 'utf8'))

function deepClone(o) {
  return JSON.parse(JSON.stringify(o))
}

/** @type {Record<string, Record<string, unknown>>} */
const localeOverrides = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'teacher-tools-translations.json'), 'utf8'),
)

function mergeLocale(locale, base) {
  const overrides = localeOverrides[locale] || {}
  const out = deepClone(base)
  for (const [ns, content] of Object.entries(overrides)) {
    out[ns] = deepMerge(out[ns] || {}, content)
  }
  return out
}

function deepMerge(a, b) {
  const out = { ...a }
  for (const [k, v] of Object.entries(b)) {
    if (v && typeof v === 'object' && !Array.isArray(v) && typeof a[k] === 'object') {
      out[k] = deepMerge(a[k], v)
    } else {
      out[k] = v
    }
  }
  return out
}

for (const locale of ['en-US', 'es-ES', 'fr-FR', 'pt-BR', 'de-DE']) {
  const filePath = path.join(localesDir, `${locale}.json`)
  const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const data = locale === 'en-US' ? en : mergeLocale(locale, en)
  for (const [ns, content] of Object.entries(data)) {
    existing[ns] = deepMerge(existing[ns] || {}, content)
  }
  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2) + '\n')
  console.log('Merged locales:', locale)
}

// ── TSX patches ─────────────────────────────────────────────────────────────
/** @type {Record<string, Array<[string, string]>>} */
const filePatches = JSON.parse(fs.readFileSync(path.join(__dirname, 'teacher-tools-patches.json'), 'utf8'))

function walkTsx(dir, acc = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f)
    if (fs.statSync(p).isDirectory()) walkTsx(p, acc)
    else if (f.endsWith('.tsx')) acc.push(p)
  }
  return acc
}

function ensureImport(content) {
  if (content.includes("from 'react-i18next'")) return content
  const lines = content.split('\n')
  let lastImport = -1
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('import ')) lastImport = i
  }
  if (lastImport >= 0) {
    lines.splice(lastImport + 1, 0, "import { useTranslation } from 'react-i18next'")
  } else {
    lines.unshift("import { useTranslation } from 'react-i18next'")
  }
  return lines.join('\n')
}

function ensureHook(content, hookMarker) {
  if (content.includes('const { t } = useTranslation()')) return content
  const idx = content.indexOf(hookMarker)
  if (idx === -1) return content
  const insertAt = content.indexOf('\n', idx) + 1
  return content.slice(0, insertAt) + '  const { t } = useTranslation()\n' + content.slice(insertAt)
}

let modifiedCount = 0
for (const [rel, patches] of Object.entries(filePatches)) {
  const filePath = path.join(ttRoot, rel)
  if (!fs.existsSync(filePath)) {
    console.warn('Missing:', rel)
    continue
  }
  let content = fs.readFileSync(filePath, 'utf8')
  const original = content
  const needsI18n = patches.length > 0 || content.match(/"[A-Za-z][^"]{2,}"/)
  if (patches.import !== false && needsI18n) {
    content = ensureImport(content)
  }
  if (patches.hookAfter) {
    content = ensureHook(content, patches.hookAfter)
  }
  for (const [from, to] of patches.replacements || patches) {
    if (Array.isArray(from)) {
      // handled above
    }
  }
  const replacements = Array.isArray(patches) ? patches : patches.replacements || []
  for (const [from, to] of replacements) {
    if (content.includes(from)) {
      content = content.split(from).join(to)
    }
  }
  if (content !== original) {
    fs.writeFileSync(filePath, content)
    modifiedCount++
    console.log('Patched:', rel)
  }
}

console.log('Modified', modifiedCount, 'tsx files')
