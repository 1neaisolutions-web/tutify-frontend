#!/usr/bin/env node
/**
 * Audits specialized chatbot page components for tab/i18n wiring.
 *
 * Usage: node scripts/audit-chatbot-i18n.mjs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FEATURES = path.resolve(__dirname, '..', 'src', 'pages', 'features')
const EN_US = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '..', 'src', 'locales', 'en-US.json'), 'utf8'),
)

/** route slug → { file, namespace } */
const CHATBOTS = [
  { file: 'GeneralTeachingAssistantChat.tsx', namespace: 'generalTeachingAssistantChat' },
  { file: 'GPT4TeachingAssistantChat.tsx', namespace: 'gPT4TeachingAssistantChat' },
  { file: 'ClaudeEducationProChat.tsx', namespace: 'claudeEducationProChat' },
  { file: 'GeminiEducationSuiteChat.tsx', namespace: 'geminiEducationSuiteChat' },
  { file: 'CodingProgrammingTutor.tsx', namespace: 'codingProgrammingTutor' },
  { file: 'VisualArtsStudioAssistant.tsx', namespace: 'visualArtsStudioAssistant' },
  { file: 'BusinessStudiesMentor.tsx', namespace: 'businessStudiesMentor' },
  { file: 'CareerReadinessCoach.tsx', namespace: 'careerReadinessCoach' },
  { file: 'LabSafetyProtocolAdvisor.tsx', namespace: 'labSafetyProtocolAdvisor' },
  { file: 'EnvironmentalScienceGuide.tsx', namespace: 'environmentalScienceGuide' },
  { file: 'MusicPerformanceCoach.tsx', namespace: 'musicPerformanceCoach' },
  { file: 'DramaTheaterDirector.tsx', namespace: 'dramaTheaterDirector' },
  { file: 'DigitalLiteracyAdvisor.tsx', namespace: 'digitalLiteracyAdvisor' },
  { file: 'AIMachineLearningEducator.tsx', namespace: 'aIMachineLearningEducator' },
  { file: 'MarketingBrandingStrategist.tsx', namespace: 'marketingBrandingStrategist' },
  { file: 'LiteracyLabCoach.tsx', namespace: 'literacyLabCoach' },
  { file: 'LiteratureAnalysisExpert.tsx', namespace: 'literatureAnalysisExpert' },
  { file: 'GrammarWritingMentor.tsx', namespace: 'grammarWritingMentor' },
  { file: 'AdvancedKnowledgeSkillsCoach.tsx', namespace: 'advancedKnowledgeSkillsCoach' },
  { file: 'UNECAcademicDevelopment.tsx', namespace: 'uNECAcademicDevelopment' },
  { file: 'AdaptiveMathStrategist.tsx', namespace: 'adaptiveMathStrategist' },
  { file: 'AlgebraGeometryTutor.tsx', namespace: 'algebraGeometryTutor' },
  { file: 'STEMInquiryMentor.tsx', namespace: 'sTEMInquiryMentor' },
  { file: 'ProblemSolvingCoach.tsx', namespace: 'problemSolvingCoach' },
]

function getNested(obj, keyPath) {
  return keyPath.split('.').reduce((o, k) => (o && typeof o === 'object' ? o[k] : undefined), obj)
}

let errors = 0

for (const { file, namespace } of CHATBOTS) {
  const filePath = path.join(FEATURES, file)
  if (!fs.existsSync(filePath)) {
    console.error(`MISSING FILE: ${file}`)
    errors++
    continue
  }
  const src = fs.readFileSync(filePath, 'utf8')

  if (!src.includes('useTranslation')) {
    console.error(`${file}: missing useTranslation()`)
    errors++
  }

  if (!src.includes(`'${namespace}.`) && !src.includes(`"${namespace}.`)) {
    console.error(`${file}: no t('${namespace}.*') keys found`)
    errors++
  }

  if (!src.match(/\breturn\s*\(/)) {
    console.error(`${file}: no JSX return (component may not render)`)
    errors++
  }

  const tabsBlock = getNested(EN_US, `${namespace}.tabs`)
  if (tabsBlock && typeof tabsBlock === 'object') {
    for (const tabId of Object.keys(tabsBlock)) {
      const key = `${namespace}.tabs.${tabId}`
      if (!src.includes(key) && !src.includes(`tabs.${tabId}`)) {
        console.warn(`WARN ${file}: en-US has ${key} but source may not reference it`)
      }
    }
  }
}

const hubPath = path.join(FEATURES, 'SpecializedChatbots.tsx')
if (fs.existsSync(hubPath)) {
  const hub = fs.readFileSync(hubPath, 'utf8')
  if (!hub.includes('chatbotsPage.')) {
    console.error('SpecializedChatbots.tsx: missing chatbotsPage keys')
    errors++
  }
}

if (errors > 0) {
  console.error(`\n❌ ${errors} chatbot audit error(s)`)
  process.exit(1)
}
console.log(`✅ Chatbot i18n audit passed (${CHATBOTS.length} components)`)
