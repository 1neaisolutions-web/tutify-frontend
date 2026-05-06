import type {
  ArtMovement,
  TechniqueGuide,
  PortfolioAssessment,
  CreativeProject,
  VisualLiteracyAnalysis,
  CulturalConnection,
  AssessmentRubric,
} from './visualArtsUtils'
import { ensureArray, ensureRecord, ensureString, slugId } from './adapterHelpers'

export function mapArtHistoryResult(result: Record<string, unknown>): ArtMovement {
  const artworks = ensureArray<Record<string, unknown>>(result.notableArtworks)
  return {
    id: slugId(ensureString(result.name)),
    name: ensureString(result.name),
    period: ensureString(result.period),
    region: ensureString(result.region),
    description: ensureString(result.description),
    keyArtists: ensureArray(result.keyArtists),
    characteristics: ensureArray(result.characteristics),
    culturalContext: ensureString(result.culturalContext),
    relatedMovements: ensureArray(result.relatedMovements),
    notableArtworks: artworks.map((a) => ({
      title: ensureString(a.title),
      artist: ensureString(a.artist),
      year: ensureString(a.year),
      description: ensureString(a.description),
    })),
  }
}

export function mapArtTechniqueResult(result: Record<string, unknown>): TechniqueGuide {
  const stepsRaw = ensureArray<Record<string, unknown>>(result.steps)
  return {
    name: ensureString(result.name),
    category: ensureString(result.category, 'Technique'),
    difficulty: (ensureString(result.difficulty, 'intermediate') as TechniqueGuide['difficulty']) || 'intermediate',
    materials: ensureArray(result.materials),
    tools: ensureArray(result.tools),
    steps: stepsRaw.map((st) => ({
      step: typeof st.step === 'number' ? st.step : Number(st.step) || 0,
      title: ensureString(st.title),
      description: ensureString(st.description),
      tips: ensureArray(st.tips),
      safetyNotes: ensureArray(st.safetyNotes),
    })),
    commonMistakes: ensureArray(result.commonMistakes),
    variations: ensureArray(result.variations),
    culturalExamples: ensureArray(result.culturalExamples),
  }
}

export function mapPortfolioDevelopmentResult(result: Record<string, unknown>): PortfolioAssessment {
  const crit = ensureArray<Record<string, unknown>>(result.criteria)
  return {
    criteria: crit.map((c) => ({
      category: ensureString(c.category),
      description: ensureString(c.description),
      points: typeof c.points === 'number' ? c.points : Number(c.points) || 0,
      indicators: ensureArray(c.indicators),
    })),
    reflectionPrompts: ensureArray(result.reflectionPrompts),
    documentationTips: ensureArray(result.documentationTips),
    presentationGuidelines: ensureArray(result.presentationGuidelines),
  }
}

export function mapCreativeProjectResult(result: Record<string, unknown>, mediaLabel: string): CreativeProject {
  const materials = ensureRecord(result.materials)
  const stepsRaw = ensureArray<Record<string, unknown>>(result.steps)
  const diff = ensureRecord(result.differentiation)
  return {
    title: ensureString(result.title),
    gradeLevel: ensureString(result.gradeLevel),
    duration: ensureString(result.duration),
    media: [mediaLabel],
    learningObjectives: ensureArray(result.learningObjectives),
    materials: {
      required: ensureArray(materials.required),
      optional: ensureArray(materials.optional),
      budget: ensureString(materials.budget, '—'),
    },
    steps: stepsRaw.map((s) => ({
      phase: ensureString(s.phase),
      activities: ensureArray(s.activities),
      duration: ensureString(s.duration, '—'),
    })),
    differentiation: {
      beginner: ensureArray(diff.beginner),
      intermediate: ensureArray(diff.intermediate),
      advanced: ensureArray(diff.advanced),
    },
    assessmentCriteria: [],
    culturalConnections: ensureArray(result.culturalConnections),
    crossCurricular: ensureArray(result.crossCurricular),
  }
}

export function mapVisualLiteracyResult(result: Record<string, unknown>): VisualLiteracyAnalysis {
  const artwork = ensureRecord(result.artwork)
  const formal = ensureRecord(result.formalElements)
  const pod = ensureRecord(result.principlesOfDesign)
  const ctx = ensureRecord(result.contextualAnalysis)
  const cq = ensureRecord(result.criticalQuestions)
  const fe = (key: string) => ensureArray<string>((formal as Record<string, unknown>)[key])
  return {
    artwork: {
      title: ensureString(artwork.title),
      artist: ensureString(artwork.artist),
      period: ensureString(artwork.period),
      culture: ensureString(artwork.culture),
    },
    formalElements: {
      line: fe('line'),
      shape: fe('shape'),
      color: fe('color'),
      texture: fe('texture'),
      space: fe('space'),
      form: [],
    },
    principlesOfDesign: {
      balance: ensureString(pod.balance),
      contrast: ensureString(pod.contrast),
      emphasis: ensureString(pod.emphasis),
      movement: ensureString(pod.movement),
      pattern: ensureString(pod.pattern, '—'),
      rhythm: ensureString(pod.rhythm),
      unity: ensureString(pod.unity),
    },
    contextualAnalysis: {
      historical: ensureString(ctx.historical),
      cultural: ensureString(ctx.social, ensureString(ctx.historical)),
      social: ensureString(ctx.social),
      personal: ensureString(ctx.personal, '—'),
    },
    criticalQuestions: {
      describe: ensureArray(cq.observational),
      analyze: ensureArray(cq.creative),
      interpret: ensureArray(cq.interpretive),
      evaluate: ensureArray(cq.evaluative),
    },
  }
}

export function mapCulturalConnectionsResult(result: Record<string, unknown>): CulturalConnection {
  return {
    artwork: ensureString(result.artwork),
    culture: ensureString(result.culture),
    region: ensureString(result.region),
    themes: ensureArray(result.themes),
    techniques: ensureArray(result.techniques),
    contemporaryRelevance: ensureArray(result.contemporaryRelevance),
    crossCulturalInfluences: ensureArray(result.crossCulturalInfluences),
    teachingStrategies: ensureArray(result.teachingStrategies),
  }
}

export function mapArtAssessmentRubricResult(result: Record<string, unknown>): AssessmentRubric {
  const crit = ensureArray<Record<string, unknown>>(result.criteria)
  return {
    title: ensureString(result.title, 'Assessment rubric'),
    totalPoints: typeof result.totalPoints === 'number' ? result.totalPoints : Number(result.totalPoints) || 0,
    criteria: crit.map((c) => ({
      category: ensureString(c.category),
      excellent: ensureString(c.excellent),
      proficient: ensureString(c.proficient),
      developing: ensureString(c.developing),
      beginning: ensureString(c.beginning),
      points: typeof c.points === 'number' ? c.points : Number(c.points) || 0,
    })),
    standards: ensureArray(result.standards),
  }
}
