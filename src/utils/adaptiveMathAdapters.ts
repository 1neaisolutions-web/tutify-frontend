/**
 * Map adaptive-math-strategist capability JSON to AdaptiveMathStrategist.tsx UI types.
 */
import { ensureArray, ensureString } from './adapterHelpers'

export interface ProblemSetUI {
  problems: {
    id: number
    question: string
    difficulty: 'emerging' | 'on-level' | 'advanced'
    solution: string
    steps: string[]
    visualAid?: string
    realWorldContext?: string
  }[]
  learningObjective: string
  standard: string
}

export interface AdaptivePathUI {
  studentLevel: string
  currentTopic: string
  recommendedPath: {
    step: number
    activity: string
    duration: string
    resources: string[]
  }[]
  masteryCheckpoints: {
    checkpoint: string
    status: 'not-started' | 'in-progress' | 'mastered'
  }[]
}

export interface ConceptualUnderstandingUI {
  concept: string
  explanation: string
  visualRepresentations: {
    type: string
    description: string
    example: string
  }[]
  commonMisconceptions: {
    misconception: string
    correction: string
    strategy: string
  }[]
  realWorldConnections: string[]
}

export interface InterventionStrategyUI {
  area: string
  diagnostic: string
  strategies: {
    strategy: string
    description: string
    activities: string[]
  }[]
  progressMonitoring: string[]
}

function normDifficulty(raw: string): ProblemSetUI['problems'][0]['difficulty'] {
  const x = raw.toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-')
  if (x === 'emerging') return 'emerging'
  if (x === 'advanced') return 'advanced'
  return 'on-level'
}

function normMasteryStatus(raw: string): AdaptivePathUI['masteryCheckpoints'][0]['status'] {
  const x = raw.toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-')
  if (x === 'in-progress' || x === 'inprogress') return 'in-progress'
  if (x === 'mastered') return 'mastered'
  return 'not-started'
}

function getVal(obj: Record<string, unknown>, ...keys: string[]): unknown {
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null) return obj[k]
  }
  return undefined
}

export function mapDifferentiatedProblemsResult(result: Record<string, unknown>): ProblemSetUI {
  const problemsRaw = ensureArray<Record<string, unknown>>(result.problems)
  const learningObjective = ensureString(
    getVal(result, 'learningObjective', 'learning_objective')
  )
  const standard = ensureString(result.standard)

  const problems = problemsRaw.map((p, idx) => ({
    id: typeof p.id === 'number' ? p.id : Number(p.id) || idx + 1,
    question: ensureString(p.question),
    difficulty: normDifficulty(ensureString(p.difficulty, 'on-level')),
    solution: ensureString(p.solution),
    steps: ensureArray(p.steps),
    visualAid: ensureString(getVal(p, 'visualAid', 'visual_aid')) || undefined,
    realWorldContext: ensureString(getVal(p, 'realWorldContext', 'real_world_context')) || undefined,
  }))

  return { learningObjective, standard, problems }
}

export function mapAdaptiveLearningPathResult(result: Record<string, unknown>): AdaptivePathUI {
  const pathRaw = ensureArray<Record<string, unknown>>(
    result.recommendedPath ?? result.recommended_path
  )
  const checkRaw = ensureArray<Record<string, unknown>>(
    result.masteryCheckpoints ?? result.mastery_checkpoints
  )

  return {
    studentLevel: ensureString(getVal(result, 'studentLevel', 'student_level')),
    currentTopic: ensureString(getVal(result, 'currentTopic', 'current_topic')),
    recommendedPath: pathRaw.map((s) => ({
      step: typeof s.step === 'number' ? s.step : Number(s.step) || 0,
      activity: ensureString(s.activity),
      duration: ensureString(s.duration),
      resources: ensureArray(s.resources),
    })),
    masteryCheckpoints: checkRaw.map((c) => ({
      checkpoint: ensureString(c.checkpoint),
      status: normMasteryStatus(ensureString(c.status, 'not-started')),
    })),
  }
}

export function mapConceptualLearningResult(result: Record<string, unknown>): ConceptualUnderstandingUI {
  const visuals = ensureArray<Record<string, unknown>>(
    result.visualRepresentations ?? result.visual_representations
  )
  const misconceptions = ensureArray<Record<string, unknown>>(
    result.commonMisconceptions ?? result.common_misconceptions
  )

  return {
    concept: ensureString(result.concept),
    explanation: ensureString(result.explanation),
    visualRepresentations: visuals.map((v) => ({
      type: ensureString(v.type),
      description: ensureString(v.description),
      example: ensureString(v.example),
    })),
    commonMisconceptions: misconceptions.map((m) => ({
      misconception: ensureString(m.misconception),
      correction: ensureString(m.correction),
      strategy: ensureString(m.strategy),
    })),
    realWorldConnections: ensureArray(result.realWorldConnections ?? result.real_world_connections),
  }
}

export function mapInterventionStrategiesResult(result: Record<string, unknown>): InterventionStrategyUI {
  const strategiesRaw = ensureArray<Record<string, unknown>>(result.strategies)

  return {
    area: ensureString(result.area),
    diagnostic: ensureString(result.diagnostic),
    strategies: strategiesRaw.map((s) => ({
      strategy: ensureString(s.strategy),
      description: ensureString(s.description),
      activities: ensureArray(s.activities),
    })),
    progressMonitoring: ensureArray(result.progressMonitoring ?? result.progress_monitoring),
  }
}

export function parseProblemCountOption(label: string): number {
  const m = label.match(/^(\d+)/)
  return m ? Math.min(12, Math.max(1, parseInt(m[1], 10))) : 3
}
