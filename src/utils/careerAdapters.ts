/**
 * Adapters: map backend capability JSON to frontend Career Readiness UI types.
 */
import type {
  ResumeFormat,
  InterviewQuestion,
  NACECompetency,
  IndustryInsight,
  CareerPathway,
  LinkedInOptimization,
  SkillsAssessment,
} from './careerUtils'

function ensureArray<T = string>(v: unknown): T[] {
  if (Array.isArray(v)) return v as T[]
  return []
}

function ensureString(v: unknown, fallback = ''): string {
  if (typeof v === 'string') return v
  return fallback
}

function ensureObject(v: unknown): Record<string, unknown> {
  if (v && typeof v === 'object' && !Array.isArray(v)) return v as Record<string, unknown>
  return {}
}

/** Backend: formatName, formatDescription, sectionOrder, keyDifferences, personalInformationIncluded, bestFor, exampleStructure, atsOptimizationTips */
export function mapResumeFormatResponseToUI(
  result: Record<string, unknown>,
  formatName: string
): ResumeFormat {
  const ex = ensureObject(result.exampleStructure)
  const prof = ensureArray(ex.professionalSummary)
  const exp = ensureArray(ex.experience)
  return {
    id: formatName.toLowerCase().replace(/\s+/g, '-'),
    name: ensureString(result.formatName) || formatName,
    region: ensureString(result.region, 'Global'),
    description: ensureString(result.formatDescription),
    sections: ensureArray(result.sectionOrder),
    order: ensureArray(result.sectionOrder),
    length: ensureString(result.length, '1-2 pages'),
    photo: false,
    personalInfo: ensureArray(result.personalInformationIncluded),
    keyDifferences: ensureArray(result.keyDifferences),
    bestFor: ensureArray(result.bestFor),
    exampleStructure: [
      { section: 'Professional Summary', content: prof },
      { section: 'Experience', content: exp },
    ],
  }
}

/** Backend: questions[] with questionTitle, culturalContext, answerFramework, answerComponents, exampleSentenceStructure, commonMistakes, tips */
export function mapInterviewPrepResponseToUI(
  result: Record<string, unknown>,
  category: string
): InterviewQuestion[] {
  const questions = ensureArray<Record<string, unknown>>(result.questions)
  return questions.map((q, i) => {
    const suggested = ensureObject(q.suggestedAnswer) || ensureObject(q)
    const points = ensureArray(suggested.answerComponents) || ensureArray(q.answerComponents)
    return {
      id: `q-${i}`,
      question: ensureString(q.questionTitle),
      category,
      difficulty: 'intermediate',
      culturalContext: ensureString(q.culturalContext),
      suggestedAnswer: {
        framework: ensureString(q.answerFramework) || ensureString(suggested.framework),
        points,
        example: ensureString(q.exampleSentenceStructure) || ensureString(suggested.exampleSentenceStructure) || ensureString(suggested.example),
      },
      commonMistakes: ensureArray(q.commonMistakes),
      tips: ensureArray(q.tips),
    }
  })
}

/** Backend: competencies[] with competencyTitle, description, order, keyPoints */
export function mapNACECompetenciesResponseToUI(
  result: Record<string, unknown>
): NACECompetency[] {
  const competencies = ensureArray<Record<string, unknown>>(result.competencies)
  return competencies.map((c, i) => ({
    id: ensureString(c.competencyTitle).toLowerCase().replace(/\s+/g, '-') || `comp-${i}`,
    name: ensureString(c.competencyTitle),
    description: ensureString(c.description),
    proficiencyLevels: [],
    developmentActivities: ensureArray(c.keyPoints),
    evidenceExamples: [],
    assessmentCriteria: ensureArray(c.keyPoints),
  }))
}

const GROWTH_TRENDS: IndustryInsight['growthTrend'][] = ['high', 'moderate', 'stable', 'declining']

/** Backend: industryLabel, globalOpportunities, requiredSkills, certifications, salaryRanges, careerPathways, geographicHotspots, futureOutlook */
export function mapIndustryInsightsResponseToUI(
  result: Record<string, unknown>,
  industry: string
): IndustryInsight {
  const salary = ensureObject(result.salaryRanges)
  const pathways = ensureObject(result.careerPathways)
  const entry = ensureArray(pathways.entry)
  const progression = ensureArray(pathways.progression)
  const senior = ensureArray(pathways.senior)
  const rawGrowth = ensureString(result.growthTrend).toLowerCase()
  const growthTrend = GROWTH_TRENDS.includes(rawGrowth as IndustryInsight['growthTrend']) ? rawGrowth as IndustryInsight['growthTrend'] : 'moderate'
  return {
    industry: ensureString(result.industryLabel) || industry,
    growthTrend,
    globalOpportunities: ensureArray(result.globalOpportunities),
    requiredSkills: ensureArray(result.requiredSkills),
    certifications: ensureArray(result.certifications),
    salaryRange: {
      entry: ensureString(salary.entryLevel),
      mid: ensureString(salary.midLevel),
      senior: ensureString(salary.senior),
    },
    careerPathways: {
      entry: entry.length ? entry as string[] : [ensureString(pathways.entry)],
      progression: progression.length ? progression as string[] : [ensureString(pathways.progression)],
      senior: senior.length ? senior as string[] : [ensureString(pathways.senior)],
    },
    geographicHotspots: ensureArray(result.geographicHotspots),
    futureOutlook: ensureArray(result.futureOutlook),
  }
}

/** Backend: entryLevelRequirements, careerProgression, seniorLevel, alternativePaths, internationalOpportunities */
export function mapCareerPathwayResponseToUI(
  result: Record<string, unknown>,
  career: string,
  industry: string
): CareerPathway {
  const entry = ensureObject(result.entryLevelRequirements)
  const prog = ensureObject(result.careerProgression)
  const mid = ensureObject(prog.midLevel)
  const sen = ensureObject(prog.senior)
  const seniorLevel = ensureObject(result.seniorLevel)
  return {
    career,
    industry,
    entryLevel: {
      education: ensureArray(entry.education),
      skills: ensureArray(entry.skills),
      certifications: [],
      experience: [],
    },
    progression: [
      {
        level: 'Mid-Level',
        years: ensureString(mid.timeframe),
        skills: ensureArray(mid.skills),
        responsibilities: ensureArray(mid.responsibilities),
      },
      {
        level: 'Senior',
        years: ensureString(sen.timeframe),
        skills: ensureArray(sen.skills),
        responsibilities: ensureArray(sen.responsibilities),
      },
    ],
    seniorLevel: {
      roles: ensureArray(seniorLevel.roles),
      requirements: ensureArray(seniorLevel.requirements),
      compensation: ensureString(seniorLevel.compensation),
    },
    alternativePaths: ensureArray(result.alternativePaths),
    internationalOpportunities: ensureArray(result.internationalOpportunities),
  }
}

/** Backend: linkedInGuideDescription, headline, summary, experience, skillsAndEndorsements, keywordStrategy, networkingTips, contentStrategy, commonMistakesToAvoid */
export function mapLinkedInGuideResponseToUI(
  result: Record<string, unknown>
): LinkedInOptimization {
  const headline = ensureObject(result.headline)
  const summary = ensureObject(result.summary)
  const experience = ensureObject(result.experience)
  const keywordStrategy = ensureObject(result.keywordStrategy)
  const sections = [
    { section: 'Headline', importance: 'Critical', bestPractices: ensureArray(headline.bestPractices), examples: ensureArray(headline.examples) },
    { section: 'Summary', importance: 'High', bestPractices: ensureArray(summary.bestPractices), examples: ensureArray(summary.examples) },
    { section: 'Experience', importance: 'Critical', bestPractices: ensureArray(experience.bestPractices), examples: ensureArray(experience.examples) },
    { section: 'Skills & Endorsements', importance: 'High', bestPractices: ensureArray(result.skillsAndEndorsements?.bestPractices ?? (result.skillsAndEndorsements as Record<string, unknown>)?.bestPractices), examples: [] },
  ]
  return {
    profileSections: sections,
    keywordStrategy: ensureArray(keywordStrategy.bestPractices).concat(ensureArray(keywordStrategy.keywordCategories)),
    networkingTips: ensureArray(result.networkingTips?.bestPractices ?? (result.networkingTips as Record<string, unknown>)?.bestPractices),
    contentStrategy: ensureArray(result.contentStrategy?.bestPractices ?? (result.contentStrategy as Record<string, unknown>)?.bestPractices),
    commonMistakes: ensureArray(result.commonMistakesToAvoid),
  }
}

/** Backend: competency, currentLevel, targetLevel, gapAnalysis, developmentPlan, evidenceNeeded */
export function mapSkillsAssessmentResponseToUI(
  result: Record<string, unknown>,
  competency: string,
  currentLevel: string,
  targetLevel: string
): SkillsAssessment {
  const plan = ensureArray<Record<string, unknown>>(result.developmentPlan)
  return {
    competency: ensureString(result.competency) || competency,
    currentLevel: ensureString(result.currentLevel) || currentLevel,
    targetLevel: ensureString(result.targetLevel) || targetLevel,
    gapAnalysis: ensureArray(result.gapAnalysis),
    developmentPlan: plan.map((p) => ({
      activity: ensureString(p.activity),
      timeline: ensureString(p.timeline),
      resources: ensureArray(p.resources),
    })),
    evidenceNeeded: ensureArray(result.evidenceNeeded),
  }
}
