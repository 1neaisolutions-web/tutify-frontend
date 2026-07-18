#!/usr/bin/env node
/**
 * Translate UI shell strings per language prefix via MyMemory (free, no API key).
 * Writes src/locales/shell-critical-overrides.json (flat keys per prefix).
 * Resumable — skips prefixes already in output file.
 *
 * Usage: node scripts/i18n-translate-shell-prefixes.mjs [--prefix=he]
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const localesDir = path.join(__dirname, '../src/locales')
const outPath = path.join(localesDir, 'shell-critical-overrides.json')

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

const SKIP_PREFIXES = new Set(['en'])

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

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function translateText(text, targetLang) {
  if (!text.trim()) return text
  // Preserve placeholders and brand names
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
      if (res.status === 429) {
        await sleep(5000 * (attempt + 1))
        continue
      }
      const data = await res.json()
      if (data.responseStatus === 429) {
        await sleep(5000 * (attempt + 1))
        continue
      }
      let translated = data.responseData?.translatedText ?? text
      for (let i = 0; i < protectedParts.length; i++) {
        translated = translated.replace(`__PH${i}__`, protectedParts[i])
        translated = translated.replace(`{{${i}}}`, protectedParts[i])
      }
      return translated
    } catch {
      await sleep(2000)
    }
  }
  return text
}

const shellTemplate = JSON.parse(fs.readFileSync(path.join(localesDir, 'ur-PK-shell.json'), 'utf8'))
const enUS = JSON.parse(fs.readFileSync(path.join(localesDir, 'en-US.json'), 'utf8'))
const enShellFlat = flatten(deepPick(enUS, shellTemplate))

const PRIORITY_PREFIXES = [
  'ar', 'ru', 'ja', 'ko', 'it', 'nl', 'pl', 'tr', 'bn', 'fa', 'vi', 'id', 'th', 'uk', 'el',
  'sv', 'da', 'nb', 'fi', 'cs', 'sk', 'hu', 'ro', 'bg', 'hr', 'ms', 'ta', 'te', 'mr', 'gu',
  'kn', 'ml', 'pa', 'sw', 'af', 'he',
]

const allPrefixes = [
  ...new Set(
    DROPDOWN_CODES.map((c) => c.split('-')[0]).filter((p) => !SKIP_PREFIXES.has(p)),
  ),
]

const onlyPrefix = process.argv.find((a) => a.startsWith('--prefix='))?.split('=')[1]

const existing = fs.existsSync(outPath)
  ? JSON.parse(fs.readFileSync(outPath, 'utf8'))
  : {}

// Seed zh from existing partial if available
const zhPartialPath = path.join(localesDir, 'partials', 'zh-CN.json')
if (fs.existsSync(zhPartialPath) && !existing.zh) {
  existing.zh = flatten(JSON.parse(fs.readFileSync(zhPartialPath, 'utf8')))
  fs.writeFileSync(outPath, JSON.stringify(existing, null, 2) + '\n')
}

function isPrefixComplete(prefix) {
  const entry = existing[prefix]
  if (!entry) return false
  const translated = Object.entries(entry).filter(
    ([key, val]) => val && val !== enShellFlat[key],
  ).length
  return translated >= Object.keys(enShellFlat).length - 10
}

const orderedPrefixes = onlyPrefix
  ? [onlyPrefix]
  : [
      ...PRIORITY_PREFIXES.filter((p) => allPrefixes.includes(p) && !isPrefixComplete(p)),
      ...allPrefixes.filter((p) => !PRIORITY_PREFIXES.includes(p) && !isPrefixComplete(p)),
    ]

console.log(`Translating shell for ${orderedPrefixes.length} prefix(es)...`)

for (const prefix of orderedPrefixes) {
  const target = PREFIX_TO_MYMEMORY[prefix] ?? prefix
  console.log(`  ${prefix} → ${target}`)
  const flat = { ...(existing[prefix] ?? {}) }
  let done = 0
  for (const [key, enValue] of Object.entries(enShellFlat)) {
    if (flat[key] && flat[key] !== enValue) {
      done++
      continue
    }
    flat[key] = await translateText(enValue, target)
    done++
    if (done % 10 === 0) {
      fs.writeFileSync(outPath, JSON.stringify({ ...existing, [prefix]: flat }, null, 2) + '\n')
      console.log(`    ${prefix}: ${done}/${Object.keys(enShellFlat).length}`)
    }
    await sleep(350)
  }
  existing[prefix] = flat
  fs.writeFileSync(outPath, JSON.stringify(existing, null, 2) + '\n')
  console.log(`  done ${prefix}`)
}

console.log('Wrote', outPath)

// Rebuild partial locale JSON files after translation updates
const buildPartials = path.join(__dirname, 'i18n-build-all-partials.mjs')
await import(buildPartials)
