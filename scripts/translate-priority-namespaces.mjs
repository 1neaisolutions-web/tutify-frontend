/**
 * translate-priority-namespaces.mjs
 *
 * Translates keys in priority route namespaces where value still equals en-US.
 *
 * Usage:
 *   node scripts/translate-priority-namespaces.mjs zh-CN fr-FR
 *   node scripts/translate-priority-namespaces.mjs --all
 *   node scripts/translate-priority-namespaces.mjs --all --resume
 *   node scripts/translate-priority-namespaces.mjs --all --skip=zh-CN,de-DE
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const LOCALES_DIR = path.resolve(__dirname, '..', 'src', 'locales')
const EN_US_PATH = path.join(LOCALES_DIR, 'en-US.json')
const MANIFEST_PATH = path.join(LOCALES_DIR, 'locale-manifest.json')
const CHECKPOINT_PATH = process.env.I18N_CHECKPOINT_PATH
  ? path.resolve(process.env.I18N_CHECKPOINT_PATH)
  : path.join(LOCALES_DIR, '.translate-priority-checkpoint.json')

const CONCURRENCY = parseInt(process.env.I18N_MT_CONCURRENCY ?? '4', 10)

const EN_US = JSON.parse(fs.readFileSync(EN_US_PATH, 'utf8'))
const MANIFEST = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'))

const argv = process.argv.slice(2)
const ALL = argv.includes('--all')
const FIX_REMAINING = argv.includes('--fix-remaining')
const RESUME = argv.includes('--resume') || ALL
const skipArg = argv.find((a) => a.startsWith('--skip='))
const SKIP_CODES = new Set(
  skipArg ? skipArg.split('=')[1].split(',').map((s) => s.trim()).filter(Boolean) : [],
)

let TARGET_CODES = argv.filter((a) => !a.startsWith('--'))
if (ALL) {
  TARGET_CODES = (MANIFEST.fullLocales ?? []).filter((c) => c !== 'en-US' && !SKIP_CODES.has(c))
}

if (TARGET_CODES.length === 0) {
  console.error(
    'Usage: node scripts/translate-priority-namespaces.mjs [--all] [--resume] [--skip=zh-CN,de-DE] [locale ...]',
  )
  process.exit(1)
}

const PRIORITY_PREFIXES = [
  'nav.',
  'teacherTools.',
  'quiz.',
  'assignment.',
  'worksheet.',
  'exam.',
  'personalizationPage.',
  'login.',
  'signup.',
  'forgotPassword.',
  'resetPassword.',
  'verifyEmail.',
  'tenantSelection.',
  'layout.',
  'common.',
  'chatbotsPage.',
  'youtubeQuizPage.',
  'pixGenPage.',
  'reportingPage.',
  'profile.',
  'exploreUseCases.',
  'learningHubSections.',
  'professionalLearningHub.',
  'templatesLibrary.',
  'templateRunner.',
  'learningHubContent.',
  'literacyLabCoach.',
  'grammarWritingMentor.',
  'literatureAnalysisExpert.',
  'sTEMInquiryMentor.',
  'problemSolvingCoach.',
  'adaptiveMathStrategist.',
  'algebraGeometryTutor.',
  'advancedKnowledgeSkillsCoach.',
  'codingProgrammingTutor.',
  'visualArtsStudioAssistant.',
  'businessStudiesMentor.',
  'careerReadinessCoach.',
  'labSafetyProtocolAdvisor.',
  'environmentalScienceGuide.',
  'musicPerformanceCoach.',
  'dramaTheaterDirector.',
  'digitalLiteracyAdvisor.',
  'aIMachineLearningEducator.',
  'marketingBrandingStrategist.',
  'uNECAcademicDevelopment.',
  'generalTeachingAssistantChat.',
  'gPT4TeachingAssistantChat.',
  'claudeEducationProChat.',
  'geminiEducationSuiteChat.',
  'analyticsPage.',
  'history.',
  'historyPage.',
  'assessmentPage.',
  'contentPacksPage.',
  'contentPackDetailPage.',
  'content.pack.',
  'chatbot.',
  'table.',
  'status.',
  'settings.',
  'dashboard.',
  'error.',
  'languageDropdown.',
  'app.',
]

const NAV_FIXES = {
  'zh-CN': {
    'nav.exams': '考试',
    'nav.assignment': '作业',
    'nav.administration': '管理',
  },
  'zh-HK': {
    'nav.exams': '考試',
    'nav.assignment': '作業',
    'nav.administration': '管理',
  },
  'zh-TW': {
    'nav.exams': '考試',
    'nav.assignment': '作業',
    'nav.administration': '管理',
  },
}

/** Rephrase source English so MT returns non-cognate text (key-specific wins over value map). */
const KEY_REPHRASE = {
  'layout.roles.superAdmin': 'Chief administrator',
  'layout.roles.orgAdmin': 'Organization administrator',
  'layout.roles.schoolAdmin': 'School administrator',
  'layout.roles.institutionAdmin': 'Institution administrator',
  'worksheet.typeHeading.mcq': 'Multiple choice questions section',
  'worksheet.defaults.mcqOptions': 'Choice option A\nChoice option B\nChoice option C\nChoice option D',
  'worksheet.defaults.matchRight': 'First definition\nSecond definition',
  'nav.personalization': 'Personalized learning settings',
  'nav.administration': 'System administration area',
  'nav.teacherToolsAnalytics': 'Teacher analytics dashboard',
  'nav.analytics': 'Analytics dashboard',
  'settings.tabs.developer': 'Developer settings tab',
  'dashboard.dayStreak': 'Consecutive day streak',
  'dashboard.draftBacklog': 'Draft items backlog',
  'settings.general.timezone.label': 'User time zone setting',
}

const REPHRASE_FOR_MT = {
  'Super Admin': 'Chief administrator',
  'Institution Admin': 'Institution administrator',
  'MULTIPLE CHOICE': 'Multiple choice questions section',
  'Personalization': 'Personalized learning settings',
  'Administration': 'System administration area',
  'Analytics': 'Analytics dashboard',
  'Developer': 'Developer settings',
  'Day streak': 'Consecutive day streak',
  'Draft backlog': 'Draft items backlog',
  'Time zone': 'User time zone setting',
  'Worksheet': 'Practice worksheet document',
  'Profile': 'User profile page',
  'Archive': 'Archive items',
  'Duplicate': 'Duplicate item',
  'Draft': 'Draft item',
  'Print': 'Print document',
  'Demo Mode': 'Demonstration mode',
  'Available': 'Integration available',
}

/** Google Translate target language codes (aligned with complete-locales.mjs). */
const LOCALE_TO_MT_LANG = {
  'zh-CN': 'zh-CN',
  'zh-HK': 'zh-TW',
  'zh-TW': 'zh-TW',
  'nb-NO': 'no',
  'fil-PH': 'tl',
  'tl-PH': 'fil',
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

const MYMEMORY_LANG = {
  'tl-PH': 'tl',
  'fil-PH': 'tl',
  'nb-NO': 'no',
  'zh-CN': 'zh-CN',
  'zh-HK': 'zh-TW',
  'zh-TW': 'zh-TW',
}

function myMemoryLang(localeCode, mtLang) {
  return MYMEMORY_LANG[localeCode] ?? mtLang
}

function mtLangFor(code) {
  if (LOCALE_TO_MT_LANG[code]) return LOCALE_TO_MT_LANG[code]
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

function unflattenObject(flat) {
  const result = {}
  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split('.')
    let cur = result
    for (let i = 0; i < parts.length - 1; i++) {
      cur[parts[i]] = cur[parts[i]] ?? {}
      cur = cur[parts[i]]
    }
    cur[parts[parts.length - 1]] = value
  }
  return result
}

function loadCheckpoint() {
  if (!RESUME || !fs.existsSync(CHECKPOINT_PATH)) return new Set()
  try {
    const data = JSON.parse(fs.readFileSync(CHECKPOINT_PATH, 'utf8'))
    return new Set(Array.isArray(data.completed) ? data.completed : [])
  } catch {
    return new Set()
  }
}

function saveCheckpoint(completed) {
  fs.writeFileSync(
    CHECKPOINT_PATH,
    JSON.stringify({ completed: [...completed], updatedAt: new Date().toISOString() }, null, 2) + '\n',
    'utf8',
  )
}

async function translateMyMemory(text, targetLang, localeCode) {
  if (text.trim().length < 8) return text
  const lang = myMemoryLang(localeCode, targetLang)
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.slice(0, 450))}&langpair=en|${lang}&de=teacher-assistant@tutify.local`
  try {
    const res = await fetch(url)
    const data = await res.json()
    if (data.responseStatus !== 200) return text
    const t = data.responseData?.translatedText ?? text
    if (/MYMEMORY WARNING/i.test(t)) return text
    return t
  } catch {
    return text
  }
}

async function translateGoogle(text, targetLang, attempt = 0) {
  if (!text || !String(text).trim()) return text
  if (/^[0-9\s\-_.]+$/.test(text)) return text

  const placeholders = []
  const sanitized = String(text).replace(/\{\{[^}]+\}\}/g, (match) => {
    const idx = placeholders.length
    placeholders.push(match)
    return `__PH${idx}__`
  })

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(sanitized)}`
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Google translate HTTP ${res.status}`)
    const data = await res.json()
    let translated = data[0]?.map((x) => x[0]).join('') ?? sanitized
    placeholders.forEach((ph, idx) => {
      translated = translated.replace(`__PH${idx}__`, ph)
    })
    return translated
  } catch (err) {
    if (attempt < 4) {
      await sleep(800 * (attempt + 1))
      return translateGoogle(text, targetLang, attempt + 1)
    }
    throw err
  }
}

async function translatePriority(text, targetLang, localeCode, key = '') {
  const sources = []
  if (KEY_REPHRASE[key]) sources.push(KEY_REPHRASE[key])
  if (REPHRASE_FOR_MT[text.trim()]) sources.push(REPHRASE_FOR_MT[text.trim()])
  sources.push(text)

  const uniqueSources = [...new Set(sources)]

  for (const src of uniqueSources) {
    const google = await translateGoogle(src, targetLang)
    if (google && google.trim() && google.trim() !== text.trim()) return google
  }

  if (text.includes('\n')) {
    const lines = text.split('\n')
    const translated = []
    let changed = false
    for (const line of lines) {
      const alt = REPHRASE_FOR_MT[line.trim()] ?? line
      const google = await translateGoogle(alt, targetLang)
      if (google && google.trim() !== line.trim()) changed = true
      translated.push(google?.trim() ? google : line)
      await sleep(80)
    }
    if (changed) return translated.join('\n')
  }

  if (text.trim().length < 8) return text
  await sleep(250)
  const mm = await translateMyMemory(text, targetLang, localeCode)
  if (mm && mm.trim() && mm.trim() !== text.trim()) return mm
  return text
}

const enFlat = flattenObject(EN_US)
const priorityKeys = Object.keys(enFlat).filter((k) =>
  PRIORITY_PREFIXES.some((p) => k.startsWith(p)),
)

console.log(`Priority keys to check: ${priorityKeys.length}`)
console.log(`Target locales: ${TARGET_CODES.length}${FIX_REMAINING ? ' (fix remaining English)' : RESUME ? ' (resume on)' : ''}`)

const completed = loadCheckpoint()

for (const code of TARGET_CODES) {
  if (completed.has(code)) {
    console.log(`⏭ ${code}: already completed (checkpoint)`)
    continue
  }

  const filePath = path.join(LOCALES_DIR, `${code}.json`)
  if (!fs.existsSync(filePath)) {
    console.warn(`Skip ${code}: file not found`)
    continue
  }

  const locale = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const flat = flattenObject(locale)
  const navFixes = NAV_FIXES[code] ?? {}
  let translated = 0
  let fixed = 0
  const lang = mtLangFor(code)
  const pending = []

  for (const key of priorityKeys) {
    if (navFixes[key]) {
      flat[key] = navFixes[key]
      fixed++
      continue
    }

    const enVal = enFlat[key]
    const curVal = flat[key]
    if (curVal === undefined || curVal !== enVal) continue
    if (typeof enVal !== 'string' || enVal.length <= 2) continue
    if (/<g id=|<\/g>/.test(curVal)) {
      flat[key] = enVal.replace(/<[^>]+>/g, '').trim() || curVal
      fixed++
      continue
    }

    pending.push({ key, enVal })
  }

  const writeLocale = () => {
    fs.writeFileSync(filePath, JSON.stringify(unflattenObject(flat), null, 2) + '\n', 'utf8')
  }

  for (let i = 0; i < pending.length; i += CONCURRENCY) {
    const batch = pending.slice(i, i + CONCURRENCY)
    await Promise.all(
      batch.map(async ({ key, enVal }) => {
        try {
          flat[key] = await translatePriority(enVal, lang, code, key)
          translated++
        } catch (err) {
          console.warn(`  ${code} ${key}: ${err.message}`)
        }
      }),
    )
    if (translated > 0 && translated % 100 === 0) {
      writeLocale()
      console.log(`  ${code}: ${translated} translated...`)
    }
    if (i > 0 && i % (CONCURRENCY * 10) === 0) await sleep(120)
  }

  writeLocale()
  console.log(`✅ ${code}: ${translated} translated, ${fixed} nav/HTML fixes`)

  completed.add(code)
  saveCheckpoint(completed)
}

if (ALL && completed.size >= TARGET_CODES.filter((c) => !SKIP_CODES.has(c)).length) {
  if (fs.existsSync(CHECKPOINT_PATH)) fs.unlinkSync(CHECKPOINT_PATH)
  console.log('Checkpoint cleared — all locales done.')
}

console.log('Done.')
