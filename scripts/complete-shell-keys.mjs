/**
 * complete-shell-keys.mjs
 *
 * Translates critical shell/nav/settings keys for every locale where value still matches English.
 * Uses Google Translate (unofficial) — no API key required.
 *
 * Usage: node scripts/complete-shell-keys.mjs [locale codes...]
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const LOCALES_DIR = path.join(__dirname, '../src/locales')
const EN_US = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'en-US.json'), 'utf8'))
const MANIFEST = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'locale-manifest.json'), 'utf8'))

const TARGET_CODES = process.argv.slice(2).length > 0 ? process.argv.slice(2) : MANIFEST.fullLocales

const CRITICAL_KEYS = [
  'app.name',
  'app.studentName',
  'nav.dashboard',
  'nav.teacherTools',
  'nav.teacherToolsOverview',
  'nav.quiz',
  'nav.assignment',
  'nav.worksheet',
  'nav.exams',
  'nav.templates',
  'nav.learningHub',
  'nav.settings',
  'nav.profile',
  'nav.history',
  'nav.signOut',
  'settings.tabs.general',
  'settings.tabs.notifications',
  'settings.tabs.plan',
  'settings.tabs.integrations',
  'settings.tabs.developer',
  'settings.tabs.export',
  'settings.general.title',
  'settings.general.language.label',
  'layout.activateCredits',
  'layout.signOut',
  'layout.signingOut',
  'languageDropdown.placeholder',
  'languageDropdown.searchPlaceholder',
  'common.loading',
  'common.cancel',
  'common.save',
  'common.delete',
  'common.search',
  'common.back',
]

const GOOGLE_LANG_MAP = {
  'zh-CN': 'zh-CN',
  'zh-TW': 'zh-TW',
  'zh-HK': 'zh-TW',
  'nb-NO': 'no',
  'fil-PH': 'tl',
  'tl-PH': 'tl',
  'he-IL': 'iw',
  'jw': 'jw',
}

function getGoogleLang(code) {
  if (GOOGLE_LANG_MAP[code]) return GOOGLE_LANG_MAP[code]
  return code.split('-')[0]
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

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

async function googleTranslate(text, targetLang) {
  if (!text || !String(text).trim()) return text

  const placeholders = []
  const sanitized = String(text).replace(/\{\{[^}]+\}\}/g, (match) => {
    placeholders.push(match)
    return `__PH${placeholders.length - 1}__`
  })

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${getGoogleLang(targetLang)}&dt=t&q=${encodeURIComponent(sanitized)}`

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const resp = await fetch(url)
      if (!resp.ok) {
        await sleep(1000 * (attempt + 1))
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
      await sleep(1000 * (attempt + 1))
    }
  }
  return text
}

async function processLocale(code) {
  if (code === 'en-US') return

  const filePath = path.join(LOCALES_DIR, `${code}.json`)
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠ Missing ${code}.json — skip`)
    return
  }

  const locale = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const enFlat = flattenObject(EN_US)
  let translated = 0

  for (const key of CRITICAL_KEYS) {
    const enValue = enFlat[key]
    if (enValue === undefined) continue

    const current = flattenObject(locale)[key]
    if (current !== undefined && current !== enValue && !String(current).includes('__ PH')) {
      continue
    }

    const result = await googleTranslate(String(enValue), code)
    if (result && result !== enValue) {
      setNestedValue(locale, key, result)
      translated++
    }
    await sleep(150)
  }

  fs.writeFileSync(filePath, JSON.stringify(locale, null, 2), 'utf8')
  console.log(`  ✅ ${code}: ${translated} shell keys translated`)
}

async function main() {
  console.log(`🔑 Translating shell keys for ${TARGET_CODES.length} locales`)
  for (const code of TARGET_CODES) {
    console.log(`\n🌍 ${code}`)
    await processLocale(code)
  }
  console.log('\n✅ Shell key translation complete')
}

main().catch(console.error)
