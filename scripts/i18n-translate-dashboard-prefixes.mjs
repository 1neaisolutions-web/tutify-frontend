#!/usr/bin/env node
/**
 * Translate dashboard.* keys for every dropdown language prefix.
 * Writes src/locales/dashboard-by-prefix.json (flat keys per prefix).
 * Resumable. Run: node scripts/i18n-translate-dashboard-prefixes.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const localesDir = path.join(__dirname, '../src/locales')
const outPath = path.join(localesDir, 'dashboard-by-prefix.json')

const PREFIX_TO_MYMEMORY = {
  zh: 'zh-CN',
  nb: 'no',
  he: 'he',
  fa: 'fa',
  pa: 'pa',
  tl: 'tl',
  cy: 'cy',
  ga: 'ga',
  sr: 'sr',
  uk: 'uk',
  el: 'el',
  sv: 'sv',
  da: 'da',
  fi: 'fi',
  cs: 'cs',
  sk: 'sk',
  hu: 'hu',
  ro: 'ro',
  bg: 'bg',
  hr: 'hr',
  th: 'th',
  vi: 'vi',
  id: 'id',
  ms: 'ms',
  bn: 'bn',
  ta: 'ta',
  te: 'te',
  mr: 'mr',
  gu: 'gu',
  kn: 'kn',
  ml: 'ml',
  sw: 'sw',
  af: 'af',
  am: 'am',
  az: 'az',
  be: 'be',
  ca: 'ca',
  et: 'et',
  eu: 'eu',
  gl: 'gl',
  hy: 'hy',
  is: 'is',
  ka: 'ka',
  kk: 'kk',
  km: 'km',
  lo: 'lo',
  lt: 'lt',
  lv: 'lv',
  mk: 'mk',
  mn: 'mn',
  my: 'my',
  ne: 'ne',
  si: 'si',
  sl: 'sl',
  sq: 'sq',
  uz: 'uz',
  zu: 'zu',
  mt: 'mt',
}

const PREFIX_FULL_LOCALE = {
  es: 'es-ES',
  fr: 'fr-FR',
  pt: 'pt-BR',
  de: 'de-DE',
}

const SHELL_FILES = {
  ur: 'ur-PK-shell.json',
  hi: 'hi-IN-shell.json',
  de: 'de-DE-shell.json',
  es: 'es-ES-shell.json',
  fr: 'fr-FR-shell.json',
  pt: 'pt-BR-shell.json',
}

const DROPDOWN_CODES = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'dropdown-language-codes.json'), 'utf8'),
)

function flatten(obj, prefix = '') {
  const out = {}
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(out, flatten(v, key))
    } else {
      out[key] = String(v)
    }
  }
  return out
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function translateText(text, targetLang) {
  if (!text.trim()) return text
  const protectedParts = []
  let work = text.replace(/\{\{[^}]+\}\}/g, (m) => {
    const id = `__PH${protectedParts.length}__`
    protectedParts.push(m)
    return id
  })
  const url = new URL('https://api.mymemory.translated.net/get')
  url.searchParams.set('q', work.slice(0, 450))
  url.searchParams.set('langpair', `en|${targetLang}`)
  url.searchParams.set('de', 'teacher-assistant@tutify.local')
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const res = await fetch(url)
      const data = await res.json()
      if (res.status === 429 || data.responseStatus === 429) {
        await sleep(4000 * (attempt + 1))
        continue
      }
      let translated = data.responseData?.translatedText ?? text
      for (let i = 0; i < protectedParts.length; i++) {
        translated = translated.replace(`__PH${i}__`, protectedParts[i])
      }
      return translated
    } catch {
      await sleep(2000)
    }
  }
  return text
}

const enUS = JSON.parse(fs.readFileSync(path.join(localesDir, 'en-US.json'), 'utf8'))
const enDashboardFlat = flatten(enUS.dashboard || {}, 'dashboard')

const allPrefixes = [
  ...new Set(DROPDOWN_CODES.map((c) => c.split('-')[0]).filter((p) => p !== 'en')),
]

const existing = fs.existsSync(outPath) ? JSON.parse(fs.readFileSync(outPath, 'utf8')) : {}

const criticalPath = path.join(localesDir, 'shell-critical-overrides.json')
if (fs.existsSync(criticalPath)) {
  const critical = JSON.parse(fs.readFileSync(criticalPath, 'utf8'))
  for (const [prefix, flat] of Object.entries(critical)) {
    if (!flat || typeof flat !== 'object') continue
    const dash = Object.fromEntries(
      Object.entries(flat).filter(([k]) => k.startsWith('dashboard.')),
    )
    if (Object.keys(dash).length > 0) {
      existing[prefix] = { ...(existing[prefix] || {}), ...dash }
    }
  }
}

function dashboardFromShellFile(file) {
  const p = path.join(localesDir, file)
  if (!fs.existsSync(p)) return null
  const data = JSON.parse(fs.readFileSync(p, 'utf8'))
  if (!data.dashboard) return null
  return flatten(data.dashboard, 'dashboard')
}

function dashboardFromFullLocale(locale) {
  const p = path.join(localesDir, `${locale}.json`)
  if (!fs.existsSync(p)) return null
  const data = JSON.parse(fs.readFileSync(p, 'utf8'))
  if (!data.dashboard) return null
  const flat = flatten(data.dashboard, 'dashboard')
  const translated = Object.entries(flat).filter(([k, v]) => v && v !== enDashboardFlat[k]).length
  if (translated < Object.keys(enDashboardFlat).length * 0.5) return null
  return flat
}

function isComplete(flat) {
  if (!flat) return false
  const translated = Object.entries(enDashboardFlat).filter(
    ([k, enVal]) => flat[k] && flat[k] !== enVal,
  ).length
  return translated >= Object.keys(enDashboardFlat).length - 2
}

const onlyPrefix = process.argv.find((a) => a.startsWith('--prefix='))?.split('=')[1]
const prefixes = onlyPrefix
  ? [onlyPrefix]
  : allPrefixes.filter((p) => !isComplete(existing[p]))

console.log(`Dashboard translations for ${prefixes.length} prefix(es)...`)

for (const prefix of prefixes) {
  if (isComplete(existing[prefix])) {
    console.log(`  skip ${prefix} (complete)`)
    continue
  }

  let flat = { ...(existing[prefix] || {}) }

  const fromShell = SHELL_FILES[prefix] ? dashboardFromShellFile(SHELL_FILES[prefix]) : null
  const fromFull = PREFIX_FULL_LOCALE[prefix]
    ? dashboardFromFullLocale(PREFIX_FULL_LOCALE[prefix])
    : null

  if (fromShell) {
    flat = { ...flat, ...fromShell }
    console.log(`  ${prefix}: from shell file`)
  } else if (fromFull) {
    flat = { ...flat, ...fromFull }
    console.log(`  ${prefix}: from full locale`)
  }

  if (isComplete(flat)) {
    existing[prefix] = flat
    fs.writeFileSync(outPath, JSON.stringify(existing, null, 2) + '\n', 'utf8')
    continue
  }

  const target = PREFIX_TO_MYMEMORY[prefix] ?? prefix
  console.log(`  ${prefix} → ${target} (translating)`)
  let n = 0
  for (const [key, enValue] of Object.entries(enDashboardFlat)) {
    if (flat[key] && flat[key] !== enValue) {
      n++
      continue
    }
    flat[key] = await translateText(enValue, target)
    n++
    if (n % 5 === 0) {
      existing[prefix] = flat
      fs.writeFileSync(outPath, JSON.stringify(existing, null, 2) + '\n', 'utf8')
    }
    await sleep(280)
  }
  existing[prefix] = flat
  fs.writeFileSync(outPath, JSON.stringify(existing, null, 2) + '\n', 'utf8')
  console.log(`  done ${prefix}`)
}

console.log('Wrote', outPath)

if (process.argv.includes('--no-rebuild')) {
  process.exit(0)
}

await import('./i18n-build-shell-locales.mjs')
await import('./i18n-build-all-partials.mjs')
