/**
 * complete-locales.mjs
 *
 * Fills every partial locale in src/locales/partials/ to match en-US.json fully.
 * Uses DeepL when DEEPL_API_KEY is set; falls back to MyMemory.
 * Merges: existing partial translations (kept as-is) + machine translation for gaps.
 * Outputs: complete files directly to src/locales/ (not partials/)
 *
 * Usage:
 *   node scripts/complete-locales.mjs                    # all locales
 *   node scripts/complete-locales.mjs zh-HK              # single locale
 *   node scripts/complete-locales.mjs zh-HK zh-CN ja-JP  # specific locales
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const LOCALES_DIR = path.join(ROOT, 'src', 'locales')
const PARTIALS_DIR = path.join(LOCALES_DIR, 'partials')
const EN_US = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'en-US.json'), 'utf8'))
const MANIFEST = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'locale-manifest.json'), 'utf8'))

const TARGET_ARGV = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const MERGE_ONLY = process.argv.includes('--merge-only')

const DEFAULT_TARGET_CODES =
  MANIFEST.partialLocales.length > 0
    ? MANIFEST.partialLocales
    : MANIFEST.fullLocales.filter((code) => code !== 'en-US')

const TARGET_CODES = TARGET_ARGV.length > 0 ? TARGET_ARGV : DEFAULT_TARGET_CODES

const DASHBOARD_BY_PREFIX = fs.existsSync(path.join(LOCALES_DIR, 'dashboard-by-prefix.json'))
  ? JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'dashboard-by-prefix.json'), 'utf8'))
  : {}

const SHELL_OVERRIDES = fs.existsSync(path.join(LOCALES_DIR, 'shell-critical-overrides.json'))
  ? JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'shell-critical-overrides.json'), 'utf8'))
  : {}

const MYMEMORY_LANG_MAP = {
  'zh-HK': 'zh-CN',
  'zh-TW': 'zh-CN',
  'zh-CN': 'zh-CN',
  'nb-NO': 'no',
  'fil-PH': 'tl',
  'tl-PH': 'tl',
  'sw-KE': 'sw',
  'ur-PK': 'ur',
  'hi-IN': 'hi',
  'pa-IN': 'pa',
  'bn-BD': 'bn',
  'bn-IN': 'bn',
  'ta-IN': 'ta',
  'te-IN': 'te',
  'mr-IN': 'mr',
  'gu-IN': 'gu',
  'kn-IN': 'kn',
  'ml-IN': 'ml',
}

const DEEPL_LANG_MAP = {
  'en-US': 'EN-US',
  'en-GB': 'EN-GB',
  'pt-BR': 'PT-BR',
  'pt-PT': 'PT-PT',
  'zh-CN': 'ZH-HANS',
  'zh-TW': 'ZH-HANT',
  'zh-HK': 'ZH-HANT',
  'nb-NO': 'NB',
}

const DEEPL_BATCH_SIZE = 50
const DEEPL_API_URL = process.env.DEEPL_API_KEY?.endsWith(':fx')
  ? 'https://api-free.deepl.com/v2/translate'
  : process.env.DEEPL_API_KEY
    ? 'https://api.deepl.com/v2/translate'
    : 'https://api-free.deepl.com/v2/translate'

function getMyMemoryLang(code) {
  if (MYMEMORY_LANG_MAP[code]) return MYMEMORY_LANG_MAP[code]
  return code.split('-')[0]
}

function getDeepLLang(code) {
  if (DEEPL_LANG_MAP[code]) return DEEPL_LANG_MAP[code]
  return code.split('-')[0].toUpperCase()
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function translateGoogle(text, targetLang) {
  if (!text || !String(text).trim()) return text
  if (/^[0-9\s\-_.]+$/.test(text)) return text

  const placeholders = []
  const sanitized = String(text).replace(/\{\{[^}]+\}\}/g, (match) => {
    placeholders.push(match)
    return `__PH${placeholders.length - 1}__`
  })

  const tl = getMyMemoryLang(targetLang)
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${tl}&dt=t&q=${encodeURIComponent(sanitized)}`

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const resp = await fetch(url)
      if (!resp.ok) {
        await sleep(500 * (attempt + 1))
        continue
      }
      const data = await resp.json()
      let translated = data?.[0]?.map((part) => part[0]).join('') ?? text
      placeholders.forEach((ph, i) => {
        translated = translated.replace(new RegExp(`__PH${i}__`, 'gi'), ph)
        translated = translated.replace(new RegExp(`__ PH${i} __`, 'gi'), ph)
      })
      return translated
    } catch {
      await sleep(500 * (attempt + 1))
    }
  }
  return null
}

async function translateMyMemory(text, targetLang) {
  if (!text || text.trim() === '') return text
  if (/^[0-9\s\-_.]+$/.test(text)) return text

  const placeholders = []
  const sanitized = text.replace(/\{\{[^}]+\}\}/g, (match) => {
    placeholders.push(match)
    return `__PH${placeholders.length - 1}__`
  })

  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(sanitized)}&langpair=en|${getMyMemoryLang(targetLang)}`

  try {
    const resp = await fetch(url)
    const data = await resp.json()

    if (data.responseStatus !== 200) {
      console.warn(`  ⚠ MyMemory error for "${text.substring(0, 30)}": ${data.responseStatus}`)
      return text
    }

    let translated = data.responseData.translatedText
    placeholders.forEach((ph, i) => {
      translated = translated.replace(new RegExp(`__ *PH${i} *__`, 'gi'), ph)
    })
    return translated
  } catch (err) {
    console.warn(`  ⚠ Translation API error: ${err.message}`)
    return text
  }
}

function protectPlaceholders(text) {
  const placeholders = []
  const sanitized = String(text).replace(/\{\{[^}]+\}\}/g, (match) => {
    placeholders.push(match)
    return `<keep>${match}</keep>`
  })
  return { sanitized, placeholders }
}

function restorePlaceholders(text) {
  return text.replace(/<keep>(.*?)<\/keep>/g, '$1')
}

async function translateDeepLBatch(texts, targetLang) {
  const apiKey = process.env.DEEPL_API_KEY
  if (!apiKey || texts.length === 0) return null

  const protectedTexts = texts.map((t) => protectPlaceholders(t))
  const deeplLang = getDeepLLang(targetLang)

  try {
    const resp = await fetch(DEEPL_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: protectedTexts.map((p) => p.sanitized),
        source_lang: 'EN',
        target_lang: deeplLang,
        tag_handling: 'xml',
        ignore_tags: ['keep'],
      }),
    })

    if (!resp.ok) {
      const errText = await resp.text()
      console.warn(`  ⚠ DeepL batch error (${resp.status}): ${errText.substring(0, 120)}`)
      return null
    }

    const data = await resp.json()
    return (data.translations ?? []).map((t) => restorePlaceholders(t.text ?? ''))
  } catch (err) {
    console.warn(`  ⚠ DeepL batch error: ${err.message}`)
    return null
  }
}

function deepMerge(base, override) {
  const out = { ...base }
  for (const [k, v] of Object.entries(override)) {
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      out[k] = deepMerge(
        base[k] && typeof base[k] === 'object' && !Array.isArray(base[k]) ? base[k] : {},
        v,
      )
    } else {
      out[k] = v
    }
  }
  return out
}

function unflatten(flat) {
  const out = {}
  for (const [keyPath, value] of Object.entries(flat)) {
    setNestedValue(out, keyPath, value)
  }
  return out
}

function flattenObject(obj, prefix = '') {
  const result = {}
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, fullKey))
    } else {
      result[fullKey] = value
    }
  }
  return result
}

function setNestedValue(obj, keyPath, value) {
  const keys = keyPath.split('.')
  let current = obj
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]] || typeof current[keys[i]] !== 'object') {
      current[keys[i]] = {}
    }
    current = current[keys[i]]
  }
  current[keys[keys.length - 1]] = value
}

function isUntranslatable(key, value) {
  const v = String(value)
  if (!v.trim()) return true
  if (/^[0-9,.\s%$€£]+$/.test(v)) return true
  if (/^https?:\/\//.test(v) || /@/.test(v)) return true
  const brandPatterns = ['Google', 'YouTube', 'Microsoft', 'Canvas', 'DeepL', 'OpenAI', 'Tutify']
  if (brandPatterns.some((b) => v === b)) return true
  if (key.includes('placeholder') && v.length < 3) return true
  return false
}

async function processLocale(code) {
  console.log(`\n🌍 Processing ${code}...`)

  const outputPath = path.join(LOCALES_DIR, `${code}.json`)
  const partialPath = path.join(PARTIALS_DIR, `${code}.json`)
  const prefix = code.split('-')[0]?.toLowerCase() ?? ''

  let existing = {}
  if (fs.existsSync(outputPath)) {
    existing = flattenObject(JSON.parse(fs.readFileSync(outputPath, 'utf8')))
    console.log(`  📂 Loaded existing ${code}.json (${Object.keys(existing).length} keys)`)
  } else if (fs.existsSync(partialPath)) {
    const partial = JSON.parse(fs.readFileSync(partialPath, 'utf8'))
    const merged = deepMerge(JSON.parse(JSON.stringify(EN_US)), partial)
    existing = flattenObject(merged)
    console.log(`  📂 Merged partial ${code}.json into en-US (${Object.keys(existing).length} keys)`)
  } else {
    existing = flattenObject(JSON.parse(JSON.stringify(EN_US)))
  }

  const enFlat = flattenObject(EN_US)

  const prefixDashboard = DASHBOARD_BY_PREFIX[prefix]
  if (prefixDashboard) {
    for (const [key, value] of Object.entries(prefixDashboard)) {
      if (value && value !== enFlat[key]) {
        existing[key] = value
      }
    }
    console.log(`  📂 Applied dashboard-by-prefix for "${prefix}"`)
  }

  const prefixShell = SHELL_OVERRIDES[prefix]
  if (prefixShell) {
    for (const [key, value] of Object.entries(prefixShell)) {
      if (value && value !== enFlat[key] && !String(value).includes('__ PH')) {
        existing[key] = value
      }
    }
    console.log(`  📂 Applied shell-critical-overrides for "${prefix}"`)
  }

  const totalKeys = Object.keys(enFlat).length
  const result = {}

  let translated = 0
  let kept = 0
  let skipped = 0

  const toTranslate = []

  for (const [key, enValue] of Object.entries(enFlat)) {
    if (existing[key] && existing[key] !== enValue) {
      setNestedValue(result, key, existing[key])
      kept++
      continue
    }

    if (isUntranslatable(key, enValue)) {
      setNestedValue(result, key, enValue)
      skipped++
      continue
    }

    if (MERGE_ONLY) {
      setNestedValue(result, key, enValue)
      skipped++
      continue
    }

    toTranslate.push({ key, enValue: String(enValue) })
  }

  if (MERGE_ONLY) {
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8')
    console.log(
      `  ✅ Written ${outputPath} (${totalKeys} keys: ${kept} kept, ${skipped} English placeholders)`,
    )
    return
  }

  if (process.env.DEEPL_API_KEY && toTranslate.length > 0) {
    for (let i = 0; i < toTranslate.length; i += DEEPL_BATCH_SIZE) {
      const batch = toTranslate.slice(i, i + DEEPL_BATCH_SIZE)
      const batchTexts = batch.map((b) => b.enValue)
      let translatedTexts = await translateDeepLBatch(batchTexts, code)

      if (!translatedTexts) {
        translatedTexts = []
        for (const text of batchTexts) {
          let t = await translateGoogle(text, code)
          if (!t) t = await translateMyMemory(text, code)
          translatedTexts.push(t ?? text)
          await sleep(100)
        }
      }

      batch.forEach((item, idx) => {
        setNestedValue(result, item.key, translatedTexts[idx] ?? item.enValue)
        translated++
      })

      if ((translated + kept + skipped) % 100 === 0 || i + DEEPL_BATCH_SIZE >= toTranslate.length) {
        console.log(
          `  ⏳ ${translated + kept + skipped}/${totalKeys} (${kept} kept, ${translated} translated, ${skipped} skipped)`,
        )
      }

      await sleep(200)
    }
  } else {
    for (const item of toTranslate) {
      let translatedValue = await translateGoogle(item.enValue, code)
      if (!translatedValue) translatedValue = await translateMyMemory(item.enValue, code)
      setNestedValue(result, item.key, translatedValue ?? item.enValue)
      translated++
      await sleep(100)

      if ((translated + kept + skipped) % 100 === 0) {
        console.log(
          `  ⏳ ${translated + kept + skipped}/${totalKeys} (${kept} kept, ${translated} translated, ${skipped} skipped)`,
        )
      }
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8')
  console.log(
    `  ✅ Written ${outputPath} (${totalKeys} keys: ${kept} kept, ${translated} translated, ${skipped} skipped)`,
  )
}

async function main() {
  console.log(`🚀 Starting locale completion for ${TARGET_CODES.length} locales`)
  console.log(`📖 Source: ${Object.keys(flattenObject(EN_US)).length} keys in en-US.json`)
  console.log(
    `🔑 DeepL: ${process.env.DEEPL_API_KEY ? 'Available (high quality, batched)' : 'Not set (using MyMemory)'}`,
  )

  for (const code of TARGET_CODES) {
    await processLocale(code)
  }

  console.log('\n✅ All locales completed!')
  console.log('Next steps:')
  console.log('  1. Review generated files in src/locales/')
  console.log('  2. Run: yarn dev — check browser console for [i18n] warnings')
  console.log('  3. Test zh-HK, ar-SA, ja-JP in browser')
}

main().catch(console.error)
