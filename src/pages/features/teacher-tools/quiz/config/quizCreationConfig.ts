import type { QuestionMixMode, QuizDifficultyId } from '../../demo/generationFromSources'

export const QUIZ_CREATION_STEPS = ['Configure & generate', 'Review & publish'] as const

export const DIFFICULTY_OPTIONS: { id: QuizDifficultyId; label: string; hint: string }[] = [
  { id: 'foundation', label: 'Foundation', hint: 'Recall & straightforward application — shorter prompts, lower weighting.' },
  { id: 'standard', label: 'Standard', hint: 'Grade-level expectations — balanced challenge for most students.' },
  { id: 'challenge', label: 'Challenge', hint: 'Analysis & synthesis — best for extension and exam prep.' },
]

export const QUESTION_COUNT = { min: 3, max: 24, default: 10 }

/** Split a total across enabled types (used when switching balanced → per-type). */
export function distributeBalancedToTypeCounts(
  total: number,
  includeMcq: boolean,
  includeTf: boolean,
  includeShort: boolean
): { mcq: number; tf: number; short: number } {
  const order: Array<'mcq' | 'tf' | 'short'> = []
  if (includeMcq) order.push('mcq')
  if (includeTf) order.push('tf')
  if (includeShort) order.push('short')
  if (order.length === 0) return { mcq: 4, tf: 3, short: 3 }
  const n = order.length
  const base = Math.floor(total / n)
  const extra = total % n
  const out = { mcq: 0, tf: 0, short: 0 }
  for (let i = 0; i < n; i += 1) {
    const k = order[i]!
    out[k] = base + (i < extra ? 1 : 0)
  }
  return out
}


/** Fake delay range for “AI generation” demo (ms). */
export const GENERATION_DELAY_MS = { min: 1600, max: 2800 }

export function randomGenerationDelay(): number {
  const { min, max } = GENERATION_DELAY_MS
  return min + Math.floor(Math.random() * (max - min))
}

export interface BuildValidation {
  ok: boolean
  errors: string[]
}

export function validateQuizBuild(input: {
  title: string
  mixMode: QuestionMixMode
  includeMcq: boolean
  includeTf: boolean
  includeShort: boolean
  questionCount: number
  countsByType: { mcq: number; tf: number; short: number }
}): BuildValidation {
  const errors: string[] = []
  if (!input.title.trim()) errors.push('Add a quiz title.')

  if (input.mixMode === 'balanced') {
    if (!input.includeMcq && !input.includeTf && !input.includeShort) {
      errors.push('Select at least one question type.')
    }
    if (input.questionCount < QUESTION_COUNT.min || input.questionCount > QUESTION_COUNT.max) {
      errors.push(`Use between ${QUESTION_COUNT.min} and ${QUESTION_COUNT.max} questions.`)
    }
  } else {
    const { mcq, tf, short } = input.countsByType
    if (mcq < 0 || tf < 0 || short < 0) errors.push('Question counts cannot be negative.')
    const sum = mcq + tf + short
    if (sum < QUESTION_COUNT.min || sum > QUESTION_COUNT.max) {
      errors.push(`Set a total between ${QUESTION_COUNT.min} and ${QUESTION_COUNT.max} questions across types.`)
    }
    if (sum === 0) errors.push('Add at least one question in the per-type counts.')
  }

  return { ok: errors.length === 0, errors }
}

/** Validates catalog-first RAG quiz configuration (demo UI). */
export function validateRagQuizBuild(input: {
  title: string
  generateWithoutSources: boolean
  selectedBookIds: string[]
  selectedTopics: string[]
  scopeRefinement: string
  mixMode: QuestionMixMode
  includeMcq: boolean
  includeTf: boolean
  includeShort: boolean
  questionCount: number
  countsByType: { mcq: number; tf: number; short: number }
}): BuildValidation {
  const base = validateQuizBuild(input)
  const errors = [...base.errors]
  if (!input.generateWithoutSources && input.selectedBookIds.length === 0) {
    errors.push('Select at least one approved catalog title — retrieval runs against these materials first.')
  }
  if (!input.generateWithoutSources && input.selectedTopics.length === 0) {
    errors.push('Choose one or more scope topics derived from your selected materials.')
  }
  if (input.generateWithoutSources && !input.scopeRefinement.trim()) {
    errors.push('Add a topic focus in scope refinement when generating without sources.')
  }
  return { ok: errors.length === 0, errors }
}
