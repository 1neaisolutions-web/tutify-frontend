#!/usr/bin/env node
/**
 * Force-translate high-impact shell/nav/settings keys still identical to en-US.
 * Patches nested locale JSON in place (no full flatten/unflatten).
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const LOCALES_DIR = path.join(__dirname, '../src/locales')
const MANIFEST = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'locale-manifest.json'), 'utf8'))
const EN_US = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'en-US.json'), 'utf8'))

const FORCE_KEYS = [
  'layout.roles.superAdmin',
  'layout.roles.orgAdmin',
  'layout.roles.schoolAdmin',
  'layout.roles.institutionAdmin',
  'layout.roles.teacher',
  'layout.roles.student',
  'layout.roles.parent',
  'layout.signOut',
  'layout.signingOut',
  'layout.messages',
  'layout.notifications',
  'layout.activateCredits',
  'layout.credits',
  'settings.tabs.general',
  'settings.tabs.notifications',
  'settings.tabs.plan',
  'settings.tabs.integrations',
  'settings.tabs.developer',
  'settings.tabs.export',
  'settings.general.title',
  'settings.general.theme.system',
  'settings.general.theme.light',
  'settings.general.theme.dark',
  'settings.notifications.title',
  'nav.teacherToolsAnalytics',
  'nav.worksheet',
  'nav.administration',
  'nav.contentManagement',
  'nav.analytics',
  'nav.personalization',
  'nav.reporting',
  'nav.assessment',
  'nav.school',
  'nav.profile',
  'nav.history',
  'nav.useCases',
  'nav.student.copilot',
  'nav.student.timetable',
  'nav.student.gradeCalc',
  'nav.student.studyTime',
]

const SKIP_VALUE = /^(Google|Microsoft|Canvas|PixGen|YouTube|GitHub|OpenAI|Claude|Gemini|GPT|API|LMS|IEP|SAT|ACT|CCSS)/i

const MT_LANG = {
  'zh-CN': 'zh-CN', 'zh-HK': 'zh-TW', 'zh-TW': 'zh-TW', 'nb-NO': 'no',
  'tl-PH': 'fil', 'fil-PH': 'tl', 'sw-KE': 'sw', 'ur-PK': 'ur',
}

function getNested(obj, keyPath) {
  const parts = keyPath.split('.')
  let cur = obj
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') return undefined
    cur = cur[p]
  }
  return cur
}

function setNested(obj, keyPath, value) {
  const parts = keyPath.split('.')
  let cur = obj
  for (let i = 0; i < parts.length - 1; i++) {
    cur[parts[i]] = cur[parts[i]] ?? {}
    cur = cur[parts[i]]
  }
  cur[parts[parts.length - 1]] = value
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function translateGoogle(text, lang, attempt = 0) {
  const placeholders = []
  const sanitized = String(text).replace(/\{\{[^}]+\}\}/g, (m) => {
    const idx = placeholders.length
    placeholders.push(m)
    return `__PH${idx}__`
  })
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(lang)}&dt=t&q=${encodeURIComponent(sanitized)}`
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    let t = data[0]?.map((x) => x[0]).join('') ?? sanitized
    placeholders.forEach((ph, idx) => {
      t = t.replace(`__PH${idx}__`, ph)
    })
    return t
  } catch (err) {
    if (attempt < 3) {
      await sleep(600 * (attempt + 1))
      return translateGoogle(text, lang, attempt + 1)
    }
    return text
  }
}

async function translateLabel(text, lang, key = '') {
  const KEY_REPHRASE = {
    'layout.roles.superAdmin': 'Chief administrator',
    'layout.roles.orgAdmin': 'Organization administrator',
    'layout.roles.schoolAdmin': 'School administrator',
    'layout.roles.institutionAdmin': 'Institution administrator',
    'nav.administration': 'System administration area',
    'nav.teacherToolsAnalytics': 'Teacher analytics dashboard',
  }
  const sources = []
  if (KEY_REPHRASE[key]) sources.push(KEY_REPHRASE[key])
  if (text.trim() === 'Super Admin') sources.push('Chief administrator')
  sources.push(text)
  for (const src of [...new Set(sources)]) {
    const g = await translateGoogle(src, lang)
    if (g.trim() !== text.trim()) return g
  }
  return text
}

const codes = (MANIFEST.fullLocales ?? []).filter((c) => c !== 'en-US')
const only = process.argv.filter((a) => !a.startsWith('-') && a.includes('-'))
const targets = only.length ? only : codes

let total = 0

for (const code of targets) {
  const filePath = path.join(LOCALES_DIR, `${code}.json`)
  if (!fs.existsSync(filePath)) continue
  const locale = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const lang = MT_LANG[code] ?? code.split('-')[0]
  let n = 0

  for (const key of FORCE_KEYS) {
    const enVal = getNested(EN_US, key)
    const curVal = getNested(locale, key)
    if (typeof enVal !== 'string' || curVal !== enVal) continue
    if (SKIP_VALUE.test(enVal)) continue

    const translated = await translateLabel(enVal, lang, key)
    if (translated && translated.trim() !== enVal.trim()) {
      setNested(locale, key, translated)
      n++
    }
    await sleep(100)
  }

  if (n > 0) {
    fs.writeFileSync(filePath, JSON.stringify(locale, null, 2) + '\n', 'utf8')
    console.log(`✅ ${code}: ${n} shell keys updated`)
    total += n
  }
}

console.log(`Done. ${total} keys updated.`)
