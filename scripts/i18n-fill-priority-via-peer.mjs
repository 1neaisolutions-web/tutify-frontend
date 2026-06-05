/**
 * Fill priority keys still identical to en-US by translating from a peer locale
 * (e.g. es-ES → tl-PH) when direct en→target MT returns unchanged English.
 *
 * Usage: node scripts/i18n-fill-priority-via-peer.mjs tl-PH es-ES
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const LOCALES_DIR = path.join(__dirname, '../src/locales')

const PRIORITY_PREFIXES = [
  'nav.', 'teacherTools.', 'quiz.', 'assignment.', 'worksheet.', 'exam.',
  'personalizationPage.', 'login.', 'signup.', 'forgotPassword.', 'resetPassword.',
  'verifyEmail.', 'tenantSelection.', 'layout.', 'common.', 'chatbotsPage.',
  'youtubeQuizPage.', 'pixGenPage.', 'reportingPage.', 'profile.', 'exploreUseCases.',
  'learningHubSections.', 'professionalLearningHub.', 'templatesLibrary.',
  'templateRunner.', 'learningHubContent.', 'literacyLabCoach.', 'grammarWritingMentor.',
  'literatureAnalysisExpert.', 'sTEMInquiryMentor.', 'problemSolvingCoach.',
  'adaptiveMathStrategist.', 'algebraGeometryTutor.', 'codingProgrammingTutor.',
  'visualArtsStudioAssistant.', 'businessStudiesMentor.', 'careerReadinessCoach.',
  'labSafetyProtocolAdvisor.', 'environmentalScienceGuide.', 'musicPerformanceCoach.',
  'dramaTheaterDirector.', 'digitalLiteracyAdvisor.', 'aIMachineLearningEducator.',
  'marketingBrandingStrategist.', 'uNECAcademicDevelopment.', 'generalTeachingAssistantChat.',
  'gPT4TeachingAssistantChat.', 'claudeEducationProChat.', 'geminiEducationSuiteChat.',
  'analyticsPage.', 'history.', 'historyPage.', 'assessmentPage.', 'contentPacksPage.',
  'contentPackDetailPage.', 'content.pack.', 'chatbot.', 'table.', 'status.',
  'settings.', 'dashboard.', 'languageDropdown.', 'app.',
]

const MT_LANG = {
  'tl-PH': 'tl', 'my-MM': 'my', 'es-ES': 'es', 'hi-IN': 'hi',
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

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function translateGoogle(text, sourceLang, targetLang) {
  if (!text?.trim()) return text
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sourceLang)}&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(text.slice(0, 4000))}`
  const res = await fetch(url)
  if (!res.ok) return text
  const data = await res.json()
  return data[0]?.map((x) => x[0]).join('') ?? text
}

const [targetCode, peerCode] = process.argv.slice(2)
if (!targetCode || !peerCode) {
  console.error('Usage: node scripts/i18n-fill-priority-via-peer.mjs <target> <peer>')
  process.exit(1)
}

const enFlat = flattenObject(JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'en-US.json'), 'utf8')))
const peerFlat = flattenObject(JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, `${peerCode}.json`), 'utf8')))
const targetPath = path.join(LOCALES_DIR, `${targetCode}.json`)
const targetFlat = flattenObject(JSON.parse(fs.readFileSync(targetPath, 'utf8')))

const targetLang = MT_LANG[targetCode] ?? targetCode.split('-')[0]
const peerLang = MT_LANG[peerCode] ?? peerCode.split('-')[0]

const pending = Object.keys(enFlat).filter((key) => {
  if (!PRIORITY_PREFIXES.some((p) => key.startsWith(p))) return false
  const en = enFlat[key]
  if (typeof en !== 'string' || en.length <= 3) return false
  if (targetFlat[key] !== en) return false
  const peer = peerFlat[key]
  if (peer === undefined || peer === en) return false
  return true
})

console.log(`${targetCode}: ${pending.length} keys to fill via ${peerCode} (${peerLang}→${targetLang})`)

let filled = 0
for (let i = 0; i < pending.length; i++) {
  const key = pending[i]
  const peerText = peerFlat[key]
  try {
    const translated = await translateGoogle(peerText, peerLang, targetLang)
    if (translated?.trim() && translated.trim() !== enFlat[key].trim()) {
      targetFlat[key] = translated
      filled++
    }
  } catch (err) {
    console.warn(`  ${key}: ${err.message}`)
  }
  if (i > 0 && i % 50 === 0) {
    fs.writeFileSync(targetPath, JSON.stringify(unflattenObject(targetFlat), null, 2) + '\n', 'utf8')
    console.log(`  ${filled} filled (${i}/${pending.length})...`)
    await sleep(200)
  }
  await sleep(100)
}

fs.writeFileSync(targetPath, JSON.stringify(unflattenObject(targetFlat), null, 2) + '\n', 'utf8')
console.log(`✅ ${targetCode}: ${filled} keys filled via ${peerCode}`)
