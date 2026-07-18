#!/usr/bin/env node
/**
 * Add tabs (+ optional heroDescription) to en-US chatbot namespaces and wire TSX tab labels to t().
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const LOCALES_DIR = path.join(ROOT, 'src/locales')
const FEATURES_DIR = path.join(ROOT, 'src/pages/features')
const EN_PATH = path.join(LOCALES_DIR, 'en-US.json')

/** fileName -> { ns, tabs: { id: label }, heroDescription? } */
const CHATBOTS = {
  'GrammarWritingMentor.tsx': {
    ns: 'grammarWritingMentor',
    tabs: {
      grammar: 'Grammar Checker',
      feedback: 'Writing Feedback',
      peer: 'Peer Review Guide',
      lessons: 'Grammar Lessons',
      prompts: 'Writing Prompts',
      rubric: 'Rubric Builder',
    },
  },
  'LiteratureAnalysisExpert.tsx': {
    ns: 'literatureAnalysisExpert',
    tabs: {
      theme: 'Theme Analysis',
      character: 'Character Analysis',
      devices: 'Literary Devices',
      discussion: 'Discussion Prompts',
      compare: 'Text Comparison',
      essay: 'Essay Planning',
    },
  },
  'STEMInquiryMentor.tsx': {
    ns: 'sTEMInquiryMentor',
    tabs: {
      investigation: 'NGSS Investigations',
      engineering: 'Engineering Design',
      inquiry: 'Inquiry Guidance',
      data: 'Data & Modeling',
      assessment: 'Assessment Tools',
      alignment: 'NGSS Alignment',
    },
  },
  'ProblemSolvingCoach.tsx': {
    ns: 'problemSolvingCoach',
    tabs: {
      'word-problems': 'Word Problems',
      'real-world': 'Real-World Applications',
      strategies: 'Problem Strategies',
      reasoning: 'Reasoning Framework',
      practice: 'Practice Generator',
      assessment: 'Assessment Tools',
    },
  },
  'AdaptiveMathStrategist.tsx': {
    ns: 'adaptiveMathStrategist',
    tabs: {
      problems: 'Differentiated Problems',
      adaptive: 'Adaptive Learning Paths',
      concepts: 'Conceptual Understanding',
      intervention: 'Intervention Strategies',
      visual: 'Visual Representations',
      assessment: 'Assessment Tools',
    },
  },
  'AlgebraGeometryTutor.tsx': {
    ns: 'algebraGeometryTutor',
    tabs: {
      visual: 'Visual Explanations',
      proof: 'Proof Strategies',
      practice: 'Scaffolded Practice',
      interactive: 'Interactive Tools',
      assessment: 'Assessment',
      resources: 'Resources',
    },
  },
  'CodingProgrammingTutor.tsx': {
    ns: 'codingProgrammingTutor',
    tabs: {
      competition: 'Competition Analyzer',
      algorithm: 'Algorithm Tutor',
      debugging: 'Debugging Assistant',
      pbl: 'Project Planner',
      thinking: 'Computational Thinking',
      roadmap: 'Competition Roadmap',
      standards: 'Standards Alignment',
    },
  },
  'VisualArtsStudioAssistant.tsx': {
    ns: 'visualArtsStudioAssistant',
    tabs: {
      history: 'Art History Explorer',
      technique: 'Technique Guidance',
      portfolio: 'Portfolio Development',
      projects: 'Creative Projects',
      literacy: 'Visual Literacy',
      cultural: 'Cultural Connections',
      assessment: 'Assessment Builder',
      differentiation: 'Differentiation Tools',
    },
  },
  'BusinessStudiesMentor.tsx': {
    ns: 'businessStudiesMentor',
    heroDescription:
      'Advanced tools for teaching international business, entrepreneurship, economics, and financial literacy. Prepare students to compete globally and bring business opportunities to their country through comprehensive understanding of international standards, trade agreements, and cross-cultural business practices.',
    tabs: {
      standards: 'International Standards',
      entrepreneurship: 'Entrepreneurship',
      economics: 'Economics',
      financial: 'Financial Literacy',
      scenarios: 'Business Scenarios',
      trade: 'Trade Agreements',
      cultural: 'Cross-Cultural Guide',
      assessment: 'Assessment Tools',
    },
  },
  'CareerReadinessCoach.tsx': {
    ns: 'careerReadinessCoach',
    heroDescription:
      'Comprehensive career readiness tools aligned with international standards (NACE, CIFR, ACT, OECD). Help students build resumes, prepare for interviews, and develop professional skills for global careers.',
    tabs: {
      resume: 'Resume Builder',
      interview: 'Interview Prep',
      skills: 'Professional Skills',
      industry: 'Industry Insights',
      pathway: 'Career Pathways',
      linkedin: 'LinkedIn Guide',
      assessment: 'Skills Assessment',
      standards: 'Standards Alignment',
    },
  },
  'LabSafetyProtocolAdvisor.tsx': {
    ns: 'labSafetyProtocolAdvisor',
    heroDescription:
      'Comprehensive lab safety tools aligned with international standards (ISO/IEC 17025, OSHA, GHS, IAEA, IEC). Design safe experiments, assess risks, and ensure compliance in science laboratories.',
    tabs: {
      standards: 'Safety Standards',
      protocols: 'Safety Protocols',
      'risk-assessment': 'Risk Assessment',
      chemicals: 'Chemical Safety',
      equipment: 'Equipment Safety',
      emergency: 'Emergency Procedures',
      'experiment-design': 'Experiment Design',
      compliance: 'Compliance',
    },
  },
  'EnvironmentalScienceGuide.tsx': {
    ns: 'environmentalScienceGuide',
    heroDescription:
      'Comprehensive environmental science tools aligned with international standards (ISO 14001, ISO 14064, UN SDGs). Climate education, sustainability projects, and ecological systems understanding.',
    tabs: {
      climate: 'Climate Education',
      sustainability: 'Sustainability Projects',
      ecosystems: 'Ecological Systems',
      regional: 'Regional Analysis',
      standards: 'Standards',
      projects: 'Project Planner',
      assessment: 'Assessment Tools',
      'action-plan': 'Action Planning',
    },
  },
  'MusicPerformanceCoach.tsx': {
    ns: 'musicPerformanceCoach',
    heroDescription:
      'Comprehensive music education tools aligned with international standards (ISME, ISM, WIAE). Music theory, composition, performance techniques, and ensemble coordination.',
    tabs: {
      theory: 'Music Theory',
      composition: 'Composition',
      performance: 'Performance',
      ensemble: 'Ensemble',
      pedagogy: 'Pedagogy',
      games: 'Games',
      standards: 'Standards',
      resources: 'Resources',
    },
  },
  'DramaTheaterDirector.tsx': {
    ns: 'dramaTheaterDirector',
    heroDescription:
      'Comprehensive theater education tools aligned with international standards (ISTA, ITI, WIAE). Script analysis, character development, stage direction, and production planning.',
    tabs: {
      'script-analysis': 'Script Analysis',
      character: 'Character Development',
      'stage-direction': 'Stage Direction',
      production: 'Production Planning',
      'acting-methods': 'Acting Methods',
      'theater-styles': 'Theater Styles',
      standards: 'Standards',
      resources: 'Resources',
    },
  },
  'DigitalLiteracyAdvisor.tsx': {
    ns: 'digitalLiteracyAdvisor',
    heroDescription:
      'Comprehensive digital literacy education aligned with international standards (ISTE, UNESCO, DigComp, Common Sense Media). Digital citizenship, online safety, and media literacy.',
    tabs: {
      'digital-citizenship': 'Digital Citizenship',
      'online-safety': 'Online Safety',
      'media-literacy': 'Media Literacy',
      'technology-integration': 'Tech Integration',
      standards: 'Standards',
      resources: 'Resources',
    },
  },
  'AIMachineLearningEducator.tsx': {
    ns: 'aIMachineLearningEducator',
    heroDescription:
      'Comprehensive AI and ML education aligned with international standards (ISTE, CSTA, UNESCO, EU AI Act, IEEE). AI concepts, ethical AI discussions, and hands-on ML projects.',
    tabs: {
      'ai-concepts': 'AI Concepts',
      'ethical-ai': 'Ethical AI',
      'ml-projects': 'ML Projects',
      standards: 'Standards',
      resources: 'Resources',
    },
  },
  'MarketingBrandingStrategist.tsx': {
    ns: 'marketingBrandingStrategist',
    heroDescription:
      'Comprehensive marketing and branding education aligned with international standards (AMA, CIM, IAA, ESOMAR, GDPR). Marketing fundamentals, branding strategies, and digital marketing.',
    tabs: {
      'marketing-concepts': 'Marketing Concepts',
      branding: 'Branding',
      'digital-marketing': 'Digital Marketing',
      'market-research': 'Market Research',
      campaigns: 'Campaigns',
      standards: 'Standards',
      resources: 'Resources',
    },
  },
  'UNECAcademicDevelopment.tsx': {
    ns: 'uNECAcademicDevelopment',
    inlineTabs: true,
    tabs: {
      pedagogy: 'Pedagogical Values',
      syllabus: 'Syllabus Design',
      assessment: 'Assessment & Rubrics',
      digital: 'Digital & AI Tools',
      'student-centered': 'Student-Centered Methods',
      chat: 'Chat',
    },
  },
}

const en = JSON.parse(fs.readFileSync(EN_PATH, 'utf8'))
let enUpdated = 0

for (const cfg of Object.values(CHATBOTS)) {
  if (!en[cfg.ns]) {
    console.warn(`Skip ${cfg.ns}: namespace missing in en-US.json`)
    continue
  }
  en[cfg.ns].tabs = { ...(en[cfg.ns].tabs || {}), ...cfg.tabs }
  enUpdated++
  if (cfg.heroDescription) {
    en[cfg.ns].heroDescription = cfg.heroDescription
  }
}

fs.writeFileSync(EN_PATH, JSON.stringify(en, null, 2) + '\n', 'utf8')
console.log(`Updated en-US.json: ${enUpdated} chatbot namespaces with tabs`)

let tsxPatched = 0

for (const [fileName, cfg] of Object.entries(CHATBOTS)) {
  const filePath = path.join(FEATURES_DIR, fileName)
  if (!fs.existsSync(filePath)) continue
  let src = fs.readFileSync(filePath, 'utf8')
  const ns = cfg.ns
  let changed = false

  for (const [tabId, label] of Object.entries(cfg.tabs)) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const idPattern = tabId.includes('-') ? `'${tabId}'` : tabId
    const re = new RegExp(
      `(\\{\\s*id:\\s*${idPattern.replace(/'/g, '')}|'${tabId.replace(/'/g, "\\'")}'[^}]*id:\\s*'${tabId}'[^}]*|id:\\s*'${tabId}'[^}]*),\\s*label:\\s*'${escaped}'`,
    )
    const replacement = `$1, label: t('${ns}.tabs.${tabId}')`
    if (re.test(src)) {
      src = src.replace(re, replacement)
      changed = true
    } else {
      const re2 = new RegExp(`label:\\s*'${escaped}'`)
      if (re2.test(src)) {
        src = src.replace(re2, `label: t('${ns}.tabs.${tabId}')`)
        changed = true
      }
    }
  }

  if (cfg.heroDescription) {
    const heroRe =
      /<p className="mt-2 text-[a-z0-9-]+">\s*[\s\S]*?<\/p>\s*(?=\s*<\/div>\s*<\/div>\s*\n\s*\{\/\* Quick)/m
    const heroReplacement = `<p className="mt-2 text-blue-100">{t('${ns}.heroDescription')}</p>`
    if (heroRe.test(src) && !src.includes(`${ns}.heroDescription`)) {
      src = src.replace(heroRe, heroReplacement + '\n              ')
      changed = true
    }
    const heroRe2 =
      /<p className="mt-2 text-[a-z0-9-]+">\s*Comprehensive[\s\S]*?<\/p>/m
    if (heroRe2.test(src) && !src.includes(`${ns}.heroDescription`)) {
      src = src.replace(heroRe2, `<p className="mt-2 text-blue-100">{t('${ns}.heroDescription')}</p>`)
      changed = true
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, src, 'utf8')
    tsxPatched++
    console.log(`Patched ${fileName}`)
  } else {
    console.warn(`No TSX changes for ${fileName}`)
  }
}

console.log(`Done. ${tsxPatched} TSX files patched.`)
