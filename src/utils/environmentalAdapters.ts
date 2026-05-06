import type {
  RegionalClimateImpact,
  SustainabilityProject,
  EcosystemInfo,
  EnvironmentalStandard,
  SustainabilityAssessment,
  ActionPlan,
} from './environmentalUtils'
import { ensureArray, ensureString } from './adapterHelpers'

export function mapRegionalClimateResult(result: Record<string, unknown>): RegionalClimateImpact {
  const caseStudies = ensureArray<Record<string, unknown>>(result.caseStudies).map((c) => ({
    title: ensureString(c.title),
    description: ensureString(c.description),
    impacts: ensureArray(c.impacts),
  }))
  return {
    region: ensureString(result.region),
    climateZone: ensureString(result.climateZone),
    keyImpacts: ensureArray(result.keyImpacts),
    temperatureTrends: ensureString(result.temperatureTrends),
    precipitationChanges: ensureString(result.precipitationChanges),
    extremeEvents: ensureArray(result.extremeEvents),
    seaLevelRise: result.seaLevelRise != null ? ensureString(result.seaLevelRise) : undefined,
    caseStudies,
    adaptationStrategies: ensureArray(result.adaptationStrategies),
    vulnerabilityLevel: (ensureString(result.vulnerabilityLevel, 'medium') as RegionalClimateImpact['vulnerabilityLevel']) || 'medium',
  }
}

export function mapSustainabilityProjectsResult(result: Record<string, unknown>): SustainabilityProject[] {
  const projects = ensureArray<Record<string, unknown>>(result.projects)
  return projects.map((p) => ({
    id: ensureString(p.id, 'project'),
    title: ensureString(p.title),
    category: (ensureString(p.category, 'energy') as SustainabilityProject['category']) || 'energy',
    gradeLevel: ensureString(p.gradeLevel),
    duration: ensureString(p.duration),
    objectives: ensureArray(p.objectives),
    materials: ensureArray(p.materials),
    steps: ensureArray(p.steps),
    expectedOutcomes: ensureArray(p.expectedOutcomes),
    standardsAlignment: ensureArray(p.standardsAlignment),
    assessmentCriteria: ensureArray(p.assessmentCriteria),
    extensions: ensureArray(p.extensions),
  }))
}

export function mapEcosystemResult(result: Record<string, unknown>): EcosystemInfo {
  return {
    type: ensureString(result.type),
    category: (ensureString(result.category, 'terrestrial') as EcosystemInfo['category']) || 'terrestrial',
    description: ensureString(result.description),
    keyFeatures: ensureArray(result.keyFeatures),
    abioticFactors: ensureArray(result.abioticFactors),
    bioticFactors: ensureArray(result.bioticFactors),
    energyFlow: ensureArray(result.energyFlow),
    nutrientCycles: ensureArray(result.nutrientCycles),
    threats: ensureArray(result.threats),
    conservation: ensureArray(result.conservation),
    examples: ensureArray(result.examples),
  }
}

export function mapEnvironmentalStandardsResult(result: Record<string, unknown>): EnvironmentalStandard[] {
  const standards = ensureArray<Record<string, unknown>>(result.standards)
  return standards.map((s) => ({
    id: ensureString(s.id, 'std'),
    name: ensureString(s.name),
    organization: ensureString(s.organization),
    description: ensureString(s.description),
    keyPrinciples: ensureArray(s.keyPrinciples),
    applicationAreas: ensureArray(s.applicationAreas),
    complianceRequirements: ensureArray(s.complianceRequirements),
    benefits: ensureArray(s.benefits),
    educationalRelevance: ensureArray(s.educationalRelevance),
  }))
}

export function mapSustainabilityAssessmentResult(result: Record<string, unknown>): SustainabilityAssessment {
  return {
    category: ensureString(result.category),
    currentValue: typeof result.currentValue === 'number' ? result.currentValue : Number(result.currentValue) || 0,
    targetValue: typeof result.targetValue === 'number' ? result.targetValue : Number(result.targetValue) || 0,
    unit: ensureString(result.unit),
    impact: (ensureString(result.impact, 'medium') as SustainabilityAssessment['impact']) || 'medium',
    recommendations: ensureArray(result.recommendations),
    actionItems: ensureArray(result.actionItems),
  }
}

export function mapEnvironmentalActionPlanResult(result: Record<string, unknown>): ActionPlan {
  const actionsRaw = ensureArray<Record<string, unknown>>(result.actions)
  return {
    goal: ensureString(result.goal),
    timeframe: ensureString(result.timeframe),
    objectives: ensureArray(result.objectives),
    actions: actionsRaw.map((a) => ({
      action: ensureString(a.action),
      responsible: ensureString(a.responsible),
      deadline: ensureString(a.deadline),
      resources: ensureArray(a.resources),
    })),
    successMetrics: ensureArray(result.successMetrics),
    challenges: ensureArray(result.challenges),
    solutions: ensureArray(result.solutions),
  }
}

export function projectCategoryUiToApi(label: string): string {
  return label.toLowerCase()
}
