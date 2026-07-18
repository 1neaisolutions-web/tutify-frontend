#!/usr/bin/env node
/**
 * validate-locales.mjs
 *
 * Checks every locale file in src/locales/ against en-US.json.
 * Reports: missing keys, untranslated values (same as English).
 * Exit code 1 if missing keys found — use in CI.
 *
 * Usage:
 *   node scripts/validate-locales.mjs
 *   node scripts/validate-locales.mjs --strict
 *   node scripts/validate-locales.mjs --strict --strict-locales=all
 *   node scripts/validate-locales.mjs --strict --strict-locales=de-DE,fr-FR
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const LOCALES_DIR = path.resolve(__dirname, '..', 'src', 'locales')
const MANIFEST_PATH = path.join(LOCALES_DIR, 'locale-manifest.json')
const EN_US = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'en-US.json'), 'utf8'))
const MANIFEST = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'))

const STRICT = process.argv.includes('--strict')
const strictLocalesArg = process.argv.find((a) => a.startsWith('--strict-locales='))?.split('=')[1]
const STRICT_ALL = strictLocalesArg === 'all'
const STRICT_LOCALES = STRICT_ALL
  ? (MANIFEST.fullLocales ?? []).filter((c) => c !== 'en-US')
  : strictLocalesArg
    ? strictLocalesArg.split(',').map((s) => s.trim()).filter(Boolean)
    : ['zh-CN', 'zh-HK', 'zh-TW']

const STRICT_PREFIXES = [
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
  'settings.',
  'dashboard.',
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
  'languageDropdown.',
  'app.',
]

const STRICT_MAX_UNTRANSLATED = parseInt(
  process.argv.find((a) => a.startsWith('--max-untranslated='))?.split('=')[1] ?? '0',
  10,
)

const SKIP_FILES = new Set([
  'locale-manifest.json',
  'dashboard-by-prefix.json',
  'shell-critical-overrides.json',
  '.translate-priority-checkpoint.json',
])

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

/** Skip keys that are identical format strings (placeholders + option letters). */
function isFormatOnlyString(value) {
  if (typeof value !== 'string') return false
  if (/^https?:\/\//.test(value.trim())) return true
  if (/Ref\.current|&&\s*\r?\n/.test(value)) return true
  const stripped = value.replace(/\{\{[^}]+\}\}/g, '').trim()
  if (!stripped) return true
  return /^[\s\W\dA-Za-z–—\-().,:;]+$/.test(stripped) && stripped.length <= 12
}

/** Priority keys that may legitimately match English (product names, slugs, standard codes). */
function isStrictExemptKey(key, value) {
  if (typeof value !== 'string') return false
  if (isFormatOnlyString(value)) return true
  if (/^CCSS\.|^UK_|^SAT\.|^NGSS\./.test(value)) return true
  if (/\.options\.[a-z0-9_]+$/.test(key) && /^[a-z0-9_]+$/.test(value)) return true
  if (/\.(pixgen|youtubeQuiz|pixGen)/i.test(key)) return true
  if (key.includes('integrations.') && key.endsWith('.name')) return true
  if (key === 'pixGenPage.aiMediaStudio' || key === 'app.studentName') return true
  if (/^templatesLibrary\./.test(key)) return true
  if (/^templatesLibrary\.ccss/.test(key)) return true
  if (/Placeholder$/.test(key) && /@|example\.com/i.test(value)) return true
  if (/rigorOptions\.|\.samples\./.test(key)) return true
  if (/^templatesLibrary\.catalog\.[a-z0-9-]+\.title$/.test(key) && value.length <= 80) return true
  if (/^templatesLibrary\.(sections|filters|tags|badges)\./.test(key)) return true
  if (/^history\.sourceTypes\./.test(key)) return true
  if (/^history\.dateRange\.custom$/.test(key)) return false
  if (
    /^aIMachineLearningEducator\./.test(key) &&
    /(IEEE|UNESCO|Google|TensorFlow|Colab|fast\.ai|Toolkit|League|Ethics|Standards)/i.test(value)
  ) {
    return true
  }
  if (/^adaptiveMathStrategist\.(inProgress|mastered)$/.test(key)) return true
  if (/^chatbot\.common\.premium$/.test(key)) return true
  if (/^nav\.(worksheet|youtubeQuiz|analytics|profile|teacherToolsAnalytics|student\.)/.test(key)) return true
  if (/professionalLearningHub\.|pixGenPage\.(styles|roadmapItems|prompts)\./.test(key)) return true
  if (/^templateRunner\.match$/.test(key)) return true
  if (/^literacyLabCoach\.(literacyLabCoach|aiPoweredChat|gradeLevelMatch)$/.test(key)) return true
  if (/^personalizationPage\.(performanceTracker|learningStreak|skillAreas\.)/.test(key)) return true
  if (/^reportingPage\.(visualAnalytics|exportAnalysis|reportType|samples)/.test(key)) return true
  return false
}

const enFlat = flattenObject(EN_US)
const enKeys = Object.keys(enFlat)

const localeFiles = fs.readdirSync(LOCALES_DIR).filter(
  (f) =>
    f.endsWith('.json') &&
    !SKIP_FILES.has(f) &&
    !f.endsWith('-shell.json'),
)

let totalErrors = 0
const report = []

for (const file of localeFiles) {
  const code = file.replace('.json', '')
  if (code === 'en-US') continue
  if (STRICT && !STRICT_LOCALES.includes(code)) continue

  const locale = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, file), 'utf8'))
  const flat = flattenObject(locale)

  const missing = enKeys.filter((k) => flat[k] === undefined)
  const untranslated = enKeys
    .filter((k) => flat[k] !== undefined && flat[k] === enFlat[k])
    .filter((k) => typeof enFlat[k] === 'string' && enFlat[k].length > 3)
    .filter((k) => !isFormatOnlyString(enFlat[k]))

  const strictUntranslated = untranslated.filter(
    (k) => STRICT_PREFIXES.some((p) => k.startsWith(p)) && !isStrictExemptKey(k, enFlat[k]),
  )

  totalErrors += missing.length

  report.push({
    code,
    file,
    total: enKeys.length,
    present: enKeys.length - missing.length,
    missing: missing.length,
    untranslated: untranslated.length,
    strictUntranslated: strictUntranslated.length,
    strictExamples: strictUntranslated.slice(0, 8),
    coverage: Math.round(((enKeys.length - missing.length) / enKeys.length) * 100),
    missingKeys: missing.slice(0, 10),
  })
}

report.sort((a, b) => a.coverage - b.coverage)

console.log('\n📊 Locale Coverage Report')
console.log('='.repeat(80))
if (STRICT) {
  console.log(
    `Strict mode: checking ${STRICT_LOCALES.length} locale(s)${STRICT_ALL ? ' (all fullLocales)' : ''}`,
  )
}

let strictFailures = 0

for (const r of report) {
  const status = r.coverage === 100 ? '✅' : r.coverage >= 90 ? '⚠️ ' : '❌'
  const strictNote =
    STRICT && r.strictUntranslated > 0 ? `, ${r.strictUntranslated} priority untranslated` : ''
  console.log(
    `${status} ${r.code.padEnd(10)} ${String(r.coverage + '%').padStart(5)} coverage  (${r.present}/${r.total} keys, ${r.untranslated} untranslated${strictNote})`,
  )
  if (r.missing > 0 && r.coverage < 90) {
    console.log(`   Missing examples: ${r.missingKeys.slice(0, 5).join(', ')}`)
  }
  if (STRICT && r.strictUntranslated > STRICT_MAX_UNTRANSLATED) {
    strictFailures++
    console.log(`   Priority untranslated examples: ${r.strictExamples.join(', ')}`)
  }
}

console.log('='.repeat(80))
console.log(`Total missing keys across all locales: ${totalErrors}`)

if (STRICT) {
  console.log(`Strict mode: priority namespace untranslated failures: ${strictFailures}`)
}

if (totalErrors > 0) {
  console.log('\n❌ Validation failed. Run: npm run i18n:merge-all to fix.')
  process.exit(1)
}

if (STRICT && strictFailures > 0) {
  console.log(
    `\n❌ Strict validation failed (${strictFailures} locales exceed ${STRICT_MAX_UNTRANSLATED} untranslated priority keys).`,
  )
  console.log('Run: npm run i18n:translate-priority-all')
  process.exit(1)
}

console.log('\n✅ All locale files complete. No missing keys.')
if (STRICT) console.log('✅ Strict priority namespace check passed.')
