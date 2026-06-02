#!/usr/bin/env node
/**
 * Generates src/locales/partials/{code}.json for every dropdown language
 * by translating the UI shell template from English.
 *
 * Usage: node scripts/i18n-generate-all-partials.mjs
 * Requires network (Google Translate).
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { translate } from '@vitalets/google-translate-api'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const localesDir = path.join(__dirname, '../src/locales')
const partialsDir = path.join(localesDir, 'partials')

const FULL_LOCALE_CODES = new Set(['en-US', 'es-ES', 'fr-FR', 'pt-BR', 'de-DE'])
const PREFIX_TO_FULL = {
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  pt: 'pt-BR',
  de: 'de-DE',
}

/** All dropdown languages — keep in sync with languageData.ts FALLBACK_LANGUAGE_LIST */
const DROPDOWN_CODES = [
  'en-US', 'en-GB', 'en-AU', 'en-CA',
  'es-ES', 'es-MX', 'es-AR', 'es-CO',
  'fr-FR', 'fr-CA', 'fr-BE',
  'pt-BR', 'pt-PT',
  'de-DE', 'de-AT', 'de-CH',
  'zh-CN', 'zh-TW', 'zh-HK',
  'ja-JP', 'ko-KR',
  'ar-SA', 'ar-EG', 'ar-AE',
  'hi-IN', 'ru-RU', 'it-IT', 'nl-NL', 'nl-BE', 'pl-PL', 'tr-TR',
  'sv-SE', 'da-DK', 'nb-NO', 'fi-FI', 'el-GR', 'cs-CZ', 'sk-SK',
  'hu-HU', 'ro-RO', 'bg-BG', 'hr-HR', 'uk-UA', 'he-IL', 'th-TH',
  'vi-VN', 'id-ID', 'ms-MY', 'fa-IR', 'ur-PK', 'bn-BD', 'bn-IN',
  'ta-IN', 'te-IN', 'mr-IN', 'gu-IN', 'kn-IN', 'ml-IN', 'pa-IN',
  'sw-KE', 'af-ZA', 'am-ET', 'az-AZ', 'be-BY', 'ca-ES', 'et-EE',
  'eu-ES', 'gl-ES', 'hy-AM', 'is-IS', 'ka-GE', 'kk-KZ', 'km-KH',
  'lo-LA', 'lt-LT', 'lv-LV', 'mk-MK', 'mn-MN', 'my-MM', 'ne-NP',
  'si-LK', 'sl-SI', 'sq-AL', 'sr-RS', 'tl-PH', 'uz-UZ', 'zu-ZA',
  'cy-GB', 'mt-MT', 'ga-IE',
]

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

function needsPartial(code) {
  if (FULL_LOCALE_CODES.has(code)) return false
  const lang = code.split('-')[0]
  if (PREFIX_TO_FULL[lang] && PREFIX_TO_FULL[lang] !== code) {
    // variant uses full locale of same prefix (e.g. es-MX -> es-ES)
    if (FULL_LOCALE_CODES.has(PREFIX_TO_FULL[lang])) return false
  }
  return true
}

function googleLang(code) {
  const [lang, region] = code.split('-')
  if (lang === 'zh') {
    if (code === 'zh-TW' || code === 'zh-HK') return 'zh-TW'
    return 'zh-CN'
  }
  if (lang === 'pt' && code === 'pt-BR') return 'pt'
  if (lang === 'nb') return 'no'
  if (lang === 'fil' || code === 'tl-PH') return 'tl'
  return lang
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function translateText(text, to) {
  if (!text.trim()) return text
  // Preserve i18n interpolation tokens
  const tokens = []
  let masked = text.replace(/\{\{[^}]+\}\}/g, (m) => {
    tokens.push(m)
    return `__TK${tokens.length - 1}__`
  })
  try {
    const res = await translate(masked, { to, from: 'en' })
    let out = res.text
    tokens.forEach((tok, i) => {
      out = out.replace(`__TK${i}__`, tok).replace(`__ tk ${i} __`, tok)
    })
    return out
  } catch (err) {
    console.warn(`  translate failed (${to}): ${text.slice(0, 40)}… — ${err.message}`)
    return text
  }
}

async function main() {
  const shellTemplate = JSON.parse(
    fs.readFileSync(path.join(localesDir, 'ur-PK-shell.json'), 'utf8'),
  )
  const enUS = JSON.parse(fs.readFileSync(path.join(localesDir, 'en-US.json'), 'utf8'))
  const shellFlatEn = flatten(shellTemplate)
  const enFlat = flatten(enUS)
  const keys = Object.keys(shellFlatEn)
  const sourceStrings = keys.map((k) => enFlat[k] ?? shellFlatEn[k])

  fs.mkdirSync(partialsDir, { recursive: true })

  const toGenerate = DROPDOWN_CODES.filter(needsPartial)
  console.log(`Generating ${toGenerate.length} partial locale files…`)

  const manifest = {
    partialLocales: toGenerate,
    fullLocales: [...FULL_LOCALE_CODES],
    prefixToFull: PREFIX_TO_FULL,
    generatedAt: new Date().toISOString(),
  }

  for (const code of toGenerate) {
    const outPath = path.join(partialsDir, `${code}.json`)
    if (fs.existsSync(outPath)) {
      console.log(`Skip ${code} (exists)`)
      continue
    }
    const to = googleLang(code)
    console.log(`Translating ${code} (google: ${to})…`)
    const translated = {}
    for (let i = 0; i < keys.length; i++) {
      translated[keys[i]] = await translateText(sourceStrings[i], to)
      if (i % 8 === 7) await sleep(120)
    }
    await sleep(200)
    fs.writeFileSync(outPath, JSON.stringify(unflatten(translated), null, 2) + '\n', 'utf8')
    console.log(`  Wrote ${code}.json`)
  }

  fs.writeFileSync(
    path.join(localesDir, 'locale-manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n',
    'utf8',
  )
  console.log('Done.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
