import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ttRoot = path.join(__dirname, '../src/pages/features/teacher-tools')
const localesDir = path.join(__dirname, '../src/locales')

function walk(d, acc = []) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f)
    if (fs.statSync(p).isDirectory()) walk(p, acc)
    else if (f.endsWith('.tsx')) acc.push(p)
  }
  return acc
}

function ensureImport(c) {
  if (c.includes("from 'react-i18next'")) return c
  const firstImport = c.indexOf('import ')
  if (firstImport === -1) return "import { useTranslation } from 'react-i18next'\n" + c
  const end = c.indexOf('\n', firstImport)
  return c.slice(0, end + 1) + "import { useTranslation } from 'react-i18next'\n" + c.slice(end + 1)
}

function ensureHook(c) {
  if (c.includes('const { t } = useTranslation()')) return c
  const patterns = [
    /export default function \w+\([^)]*\) \{/,
    /export function \w+\([^)]*\) \{/,
    /function \w+\([^)]*\) \{/,
  ]
  for (const pat of patterns) {
    const m = c.match(pat)
    if (m) {
      const pos = c.indexOf(m[0]) + m[0].length
      const nl = c.indexOf('\n', pos)
      const indent = c.slice(nl + 1).match(/^(\s*)/)?.[1] ?? '  '
      return c.slice(0, nl + 1) + `${indent}const { t } = useTranslation()\n` + c.slice(nl + 1)
    }
  }
  return c
}

// Load EN namespace from file if exists, else minimal
const enPath = path.join(__dirname, 'teacher-tools-en.json')
const en = fs.existsSync(enPath)
  ? JSON.parse(fs.readFileSync(enPath, 'utf8'))
  : { teacherTools: { tryAgain: 'Try again' } }

const trPath = path.join(__dirname, 'teacher-tools-translations.json')
const translations = fs.existsSync(trPath)
  ? JSON.parse(fs.readFileSync(trPath, 'utf8'))
  : {}

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
  const data =
    locale === 'en-US' ? en : deepMerge(JSON.parse(JSON.stringify(en)), translations[locale] || {})
  for (const [ns, content] of Object.entries(data)) {
    existing[ns] = deepMerge(existing[ns] || {}, content)
  }
  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2) + '\n')
  console.log('Locale merged:', locale)
}

const patchesPath = path.join(__dirname, 'teacher-tools-patches.json')
if (!fs.existsSync(patchesPath)) {
  console.log('No patches file — locale only')
  process.exit(0)
}

const filePatches = JSON.parse(fs.readFileSync(patchesPath, 'utf8'))
let modified = 0

for (const [rel, cfg] of Object.entries(filePatches)) {
  const fp = path.join(ttRoot, rel.replace(/\//g, path.sep))
  if (!fs.existsSync(fp)) {
    console.warn('Skip missing', rel)
    continue
  }
  let c = fs.readFileSync(fp, 'utf8')
  const orig = c
  for (const [from, to] of cfg.replacements || []) {
    if (c.includes(from)) c = c.split(from).join(to)
  }
  if (cfg.addI18n !== false && (cfg.replacements?.length || cfg.force)) {
    c = ensureImport(c)
    c = ensureHook(c)
  }
  if (c !== orig) {
    fs.writeFileSync(fp, c)
    modified++
    console.log('Patched', rel)
  }
}

console.log('Total tsx modified:', modified)
