/**
 * Adapters: map backend capability JSON (executeCapability result) to frontend UI types.
 * Backend uses snake_case; UI types use camelCase. Do not change UI types or structure.
 */
import type {
  InternationalBusinessStandard,
  EntrepreneurshipFramework,
  EconomicConcept,
  FinancialLiteracyModule,
  BusinessScenario,
  TradeAgreement,
  CrossCulturalBusinessGuide,
} from './businessUtils'

function ensureArray<T = string>(v: unknown): T[] {
  if (Array.isArray(v)) return v as T[]
  return []
}

function ensureString(v: unknown, fallback = ''): string {
  if (typeof v === 'string') return v
  return fallback
}

/** Backend: description, key_principles, application_areas, compliance_requirements, benefits, case_studies */
export function mapInternationalStandardsResponseToUI(
  result: Record<string, unknown>,
  standardName: string,
  region?: string
): InternationalBusinessStandard {
  const caseStudies = ensureArray<{ company_name?: string; description?: string }>(result.case_studies)
  return {
    id: standardName.toLowerCase().replace(/\s+/g, '-'),
    name: standardName,
    organization: ensureString(result.organization, 'International'),
    region: ensureString(result.region, region ?? 'Global'),
    description: ensureString(result.description),
    keyPrinciples: ensureArray(result.key_principles),
    applicationAreas: ensureArray(result.application_areas),
    complianceRequirements: ensureArray(result.compliance_requirements),
    benefits: ensureArray(result.benefits),
    caseStudies: caseStudies.map((c) => ({
      company: ensureString(c.company_name),
      scenario: ensureString(c.description),
      outcome: ensureString(c.description),
    })),
  }
}

/** Backend: stages[] with stageName, purpose, activities, skillsDeveloped, internationalConsiderations, challenges, successFactors */
export function mapEntrepreneurshipFrameworkResponseToUI(
  result: Record<string, unknown>
): EntrepreneurshipFramework[] {
  const stages = ensureArray<Record<string, unknown>>(result.stages)
  return stages.map((s) => ({
    stage: ensureString(s.stageName),
    description: ensureString(s.purpose),
    activities: ensureArray(s.activities),
    skills: ensureArray(s.skillsDeveloped),
    resources: [],
    challenges: ensureArray(s.challenges),
    successFactors: ensureArray(s.successFactors),
    internationalConsiderations: ensureArray(s.internationalConsiderations),
  }))
}

/** Backend: title, category, description, keyTerms, realWorldExamples, internationalImplications, teachingStrategies, caseStudies */
export function mapEconomicConceptResponseToUI(
  result: Record<string, unknown>
): EconomicConcept {
  return {
    name: ensureString(result.title),
    category: ensureString(result.category),
    description: ensureString(result.description),
    keyTerms: ensureArray(result.keyTerms),
    realWorldExamples: ensureArray(result.realWorldExamples),
    internationalImplications: ensureArray(result.internationalImplications),
    teachingStrategies: ensureArray(result.teachingStrategies),
    caseStudies: ensureArray(result.caseStudies),
  }
}

/** Backend: learningObjectives, keyConcepts, activities, internationalPerspectives, assessment */
export function mapFinancialLiteracyModuleResponseToUI(
  result: Record<string, unknown>,
  topic: string,
  gradeLevel: string
): FinancialLiteracyModule {
  return {
    topic,
    gradeLevel,
    learningObjectives: ensureArray(result.learningObjectives),
    keyConcepts: ensureArray(result.keyConcepts),
    activities: ensureArray(result.activities),
    realWorldApplications: [],
    internationalPerspectives: ensureArray(result.internationalPerspectives),
    assessment: ensureArray(result.assessment),
  }
}

/** Backend: scenario, learningObjectives, keyQuestions, resources, expectedOutcomes, internationalElements */
export function mapBusinessScenarioResponseToUI(
  result: Record<string, unknown>,
  scenarioType: string,
  industry: string,
  region: string
): BusinessScenario {
  return {
    title: scenarioType,
    type: 'case-study',
    difficulty: 'intermediate',
    industry,
    region,
    scenario: ensureString(result.scenario),
    objectives: ensureArray(result.learningObjectives),
    questions: ensureArray(result.keyQuestions),
    resources: ensureArray(result.resources),
    expectedOutcomes: ensureArray(result.expectedOutcomes),
    internationalElements: ensureArray(result.internationalElements),
  }
}

/** Backend: description, agreements[] with agreementName, type, participantCount, participatingCountries, keyProvisions, benefits, challenges, impact, teachingPoints */
export function mapTradeAgreementsResponseToUI(
  result: Record<string, unknown>
): TradeAgreement[] {
  const agreements = ensureArray<Record<string, unknown>>(result.agreements)
  return agreements.map((a) => ({
    name: ensureString(a.agreementName),
    countries: ensureArray(a.participatingCountries),
    type: ensureString(a.type),
    keyProvisions: ensureArray(a.keyProvisions),
    benefits: ensureArray(a.benefits),
    challenges: ensureArray(a.challenges),
    impact: ensureArray(a.impact),
    teachingPoints: ensureArray(a.teachingPoints),
  }))
}

/** Backend: guideTitle, businessPractices, communicationStyles, culturalConsiderations, commonMistakes, caseExamples, negotiationApproaches, successStrategies */
export function mapCrossCulturalGuideResponseToUI(
  result: Record<string, unknown>,
  region: string
): CrossCulturalBusinessGuide {
  return {
    region: ensureString(result.guideTitle) || region,
    businessPractices: ensureArray(result.businessPractices),
    communicationStyles: ensureArray(result.communicationStyles),
    negotiationApproaches: ensureArray(result.negotiationApproaches),
    culturalConsiderations: ensureArray(result.culturalConsiderations),
    commonMistakes: ensureArray(result.commonMistakes),
    successStrategies: ensureArray(result.successStrategies),
    caseExamples: ensureArray(result.caseExamples),
  }
}
