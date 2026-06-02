#!/usr/bin/env node
/**
 * Build partial locale files for every dropdown language.
 * - Full locales (en/es/fr/pt/de): variants map to full bundle, no partial file
 * - hi, ur: use existing *-shell.json merged with en-US
 * - All other prefixes: en-US shell + CRITICAL_OVERRIDES per language prefix
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const localesDir = path.join(__dirname, '../src/locales')
const partialsDir = path.join(localesDir, 'partials')

const FULL_LOCALES = ['en-US', 'es-ES', 'fr-FR', 'pt-BR', 'de-DE']
const SHELL_MERGED = ['hi-IN', 'ur-PK']
const PREFIX_FULL = { en: 'en-US', es: 'es-ES', fr: 'fr-FR', pt: 'pt-BR', de: 'de-DE' }

const DROPDOWN_CODES = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'dropdown-language-codes.json'), 'utf8'),
)

function flatten(obj, prefix = '') {
  const out = {}
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) Object.assign(out, flatten(v, key))
    else out[key] = String(v)
  }
  return out
}

function unflatten(flat) {
  const out = {}
  for (const [keyPath, value] of Object.entries(flat)) {
    const parts = keyPath.split('.')
    let cur = out
    for (let i = 0; i < parts.length - 1; i++) {
      const p = parts[i]
      if (!cur[p] || typeof cur[p] !== 'object') cur[p] = {}
      cur = cur[p]
    }
    cur[parts[parts.length - 1]] = value
  }
  return out
}

function deepPick(en, template) {
  if (template === null || typeof template !== 'object' || Array.isArray(template)) {
    return en
  }
  const out = {}
  for (const key of Object.keys(template)) {
    if (en && typeof en === 'object' && key in en) {
      out[key] = deepPick(en[key], template[key])
    }
  }
  return out
}

function needsPartial(code) {
  if (FULL_LOCALES.includes(code)) return false
  if (SHELL_MERGED.includes(code)) return false
  const lang = code.split('-')[0]
  if (PREFIX_FULL[lang] && PREFIX_FULL[lang] !== code) return false
  return true
}

const shellTemplate = JSON.parse(fs.readFileSync(path.join(localesDir, 'ur-PK-shell.json'), 'utf8'))
const enUS = JSON.parse(fs.readFileSync(path.join(localesDir, 'en-US.json'), 'utf8'))
const enDashboardFlat = flatten(enUS.dashboard || {}, 'dashboard')
const baseShellFlat = flatten(deepPick(enUS, shellTemplate))

const CRITICAL_OVERRIDES = (() => {
  const overridesPath = path.join(localesDir, 'shell-critical-overrides.json')
  const loaded = fs.existsSync(overridesPath)
    ? JSON.parse(fs.readFileSync(overridesPath, 'utf8'))
    : {}
  const zhPartialPath = path.join(partialsDir, 'zh-CN.json')
  if (fs.existsSync(zhPartialPath) && !loaded.zh) {
    loaded.zh = flatten(JSON.parse(fs.readFileSync(zhPartialPath, 'utf8')))
  }
  return loaded
})()

const dashboardByPrefixPath = path.join(localesDir, 'dashboard-by-prefix.json')
const dashboardByPrefix = fs.existsSync(dashboardByPrefixPath)
  ? JSON.parse(fs.readFileSync(dashboardByPrefixPath, 'utf8'))
  : {}

const customShells = {
  hi: JSON.parse(fs.readFileSync(path.join(localesDir, 'hi-IN-shell.json'), 'utf8')),
  ur: JSON.parse(fs.readFileSync(path.join(localesDir, 'ur-PK-shell.json'), 'utf8')),
  de: JSON.parse(fs.readFileSync(path.join(localesDir, 'de-DE-shell.json'), 'utf8')),
}

function shellForPrefix(prefix) {
  if (customShells[prefix]) return customShells[prefix]
  const critical = CRITICAL_OVERRIDES[prefix] || {}
  const criticalNoDash = Object.fromEntries(
    Object.entries(critical).filter(([k]) => !k.startsWith('dashboard.')),
  )
  const dashFlat = dashboardByPrefix[prefix] || {}
  const flat = {
    ...baseShellFlat,
    ...criticalNoDash,
    ...dashFlat,
  }
  for (const [key, enVal] of Object.entries(enDashboardFlat)) {
    if (!flat[key]) flat[key] = enVal
  }
  return unflatten(flat)
}

fs.mkdirSync(partialsDir, { recursive: true })

const partialLocales = []
for (const code of DROPDOWN_CODES) {
  if (!needsPartial(code)) continue
  const prefix = code.split('-')[0]
  const shell = shellForPrefix(prefix)
  fs.writeFileSync(path.join(partialsDir, `${code}.json`), JSON.stringify(shell, null, 2) + '\n', 'utf8')
  partialLocales.push(code)
}

const manifest = {
  partialLocales,
  fullLocales: FULL_LOCALES,
  prefixToFull: PREFIX_FULL,
  generatedAt: new Date().toISOString(),
}
fs.writeFileSync(path.join(localesDir, 'locale-manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8')
console.log(`Built ${partialLocales.length} partial locale files.`)
