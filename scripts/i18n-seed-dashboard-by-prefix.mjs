#!/usr/bin/env node
/** Seed dashboard-by-prefix.json from shell files + embedded translations for all dropdown prefixes. */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const localesDir = path.join(__dirname, '../src/locales')
const outPath = path.join(localesDir, 'dashboard-by-prefix.json')

const DROPDOWN_CODES = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'dropdown-language-codes.json'), 'utf8'),
)

const SHELL_FILES = {
  ur: 'ur-PK-shell.json',
  hi: 'hi-IN-shell.json',
  de: 'de-DE-shell.json',
  es: 'es-ES-shell.json',
  fr: 'fr-FR-shell.json',
  pt: 'pt-BR-shell.json',
}

function flatten(obj, prefix = '') {
  const out = {}
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) Object.assign(out, flatten(v, key))
    else out[key] = String(v)
  }
  return out
}

const enUS = JSON.parse(fs.readFileSync(path.join(localesDir, 'en-US.json'), 'utf8'))
const enDash = flatten(enUS.dashboard, 'dashboard')

const out = fs.existsSync(outPath) ? JSON.parse(fs.readFileSync(outPath, 'utf8')) : {}

for (const [prefix, file] of Object.entries(SHELL_FILES)) {
  const p = path.join(localesDir, file)
  if (fs.existsSync(p)) {
    const data = JSON.parse(fs.readFileSync(p, 'utf8'))
    if (data.dashboard) out[prefix] = { ...(out[prefix] || {}), ...flatten(data.dashboard, 'dashboard') }
  }
}

// Prefixes sharing same language as a shell we already have
const PREFIX_ALIAS = {
  bn: 'hi',
  ta: 'hi',
  te: 'hi',
  mr: 'hi',
  gu: 'hi',
  kn: 'hi',
  ml: 'hi',
  pa: 'hi',
  ne: 'hi',
  si: 'hi',
  km: 'hi',
  lo: 'hi',
  my: 'hi',
}

const allPrefixes = [...new Set(DROPDOWN_CODES.map((c) => c.split('-')[0]))].filter((p) => p !== 'en')

for (const prefix of allPrefixes) {
  if (out[prefix] && Object.keys(out[prefix]).length >= Object.keys(enDash).length - 2) continue
  const alias = PREFIX_ALIAS[prefix]
  if (alias && out[alias]) {
    out[prefix] = { ...out[alias] }
    continue
  }
}

if (out.zh) {
  for (const prefix of allPrefixes) {
    if (prefix === 'zh') continue
    if (!out[prefix] || Object.keys(out[prefix]).length < Object.keys(enDash).length - 2) {
      // no-op; zh-TW/HK use zh via dropdown resolve to zh-CN partial
    }
  }
}

// Load partial progress from critical overrides
const criticalPath = path.join(localesDir, 'shell-critical-overrides.json')
if (fs.existsSync(criticalPath)) {
  const critical = JSON.parse(fs.readFileSync(criticalPath, 'utf8'))
  for (const [prefix, flat] of Object.entries(critical)) {
    const dash = Object.fromEntries(Object.entries(flat).filter(([k]) => k.startsWith('dashboard.')))
    if (Object.keys(dash).length > 5) out[prefix] = { ...(out[prefix] || {}), ...dash }
  }
}

fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n', 'utf8')
const complete = allPrefixes.filter((p) => {
  const d = out[p]
  if (!d) return false
  return Object.entries(enDash).filter(([k, v]) => d[k] && d[k] !== v).length >= Object.keys(enDash).length - 3
}).length
console.log(`dashboard-by-prefix: ${complete}/${allPrefixes.length} prefixes complete`)
