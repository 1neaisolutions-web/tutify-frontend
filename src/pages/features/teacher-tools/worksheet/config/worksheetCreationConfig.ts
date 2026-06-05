import type { QuestionMixMode } from '../../demo/generationFromSources'
import { QUESTION_COUNT, randomGenerationDelay } from '../../quiz/config/quizCreationConfig'
import type { WorksheetBuildSubStepId } from './worksheetWizardSteps'

export interface WorksheetRagBuildValidation {
  ok: boolean
  errors: string[]
}

export type WorksheetRagBuildInput = {
  title: string
  generateWithoutSources: boolean
  selectedBookIds: string[]
  selectedTopics: string[]
  scopeRefinement: string
  mixMode: QuestionMixMode
  questionCount: number
  includeMcq: boolean
  includeFillBlank: boolean
  includeShort: boolean
  includeMatch: boolean
  countsByType: { mcq: number; fill_blank: number; short: number; match: number }
}

export function validateWorksheetBuildSubStep(
  stepId: WorksheetBuildSubStepId,
  input: WorksheetRagBuildInput,
): WorksheetRagBuildValidation {
  const errors: string[] = []

  switch (stepId) {
    case 'basics':
      if (!input.title.trim()) errors.push('Add a worksheet title.')
      break
    case 'sources':
      if (!input.generateWithoutSources) {
        if (input.selectedBookIds.length === 0) {
          errors.push('Select at least one approved catalog title — retrieval runs against these materials.')
        }
      }
      break
    case 'scope':
      if (!input.generateWithoutSources && input.selectedTopics.length === 0) {
        errors.push('Choose one or more topic strands derived from your selected materials.')
      }
      if (input.generateWithoutSources && !input.scopeRefinement.trim()) {
        errors.push('Add a topic focus in scope refinement when using topic-only mode.')
      }
      break
    case 'generation':
      if (input.mixMode === 'balanced') {
        if (!input.includeMcq && !input.includeFillBlank && !input.includeShort && !input.includeMatch) {
          errors.push('Select at least one item type for the worksheet.')
        }
        if (input.questionCount < QUESTION_COUNT.min || input.questionCount > QUESTION_COUNT.max) {
          errors.push(`Use between ${QUESTION_COUNT.min} and ${QUESTION_COUNT.max} questions.`)
        }
      } else {
        const { mcq, fill_blank, short, match } = input.countsByType
        if (mcq < 0 || fill_blank < 0 || short < 0 || match < 0) errors.push('Question counts cannot be negative.')
        const sum = mcq + fill_blank + short + match
        if (sum < QUESTION_COUNT.min || sum > QUESTION_COUNT.max) {
          errors.push(`Set a total between ${QUESTION_COUNT.min} and ${QUESTION_COUNT.max} items across types.`)
        }
        if (sum === 0) errors.push('Add at least one item in the per-type counts.')
      }
      break
    default:
      break
  }

  return { ok: errors.length === 0, errors }
}

/** Catalog scope + generation validation for Create Worksheet (demo UI). */
export function validateRagWorksheetBuild(input: WorksheetRagBuildInput): WorksheetRagBuildValidation {
  const errors: string[] = []
  for (const step of ['basics', 'sources', 'scope', 'generation'] as WorksheetBuildSubStepId[]) {
    const v = validateWorksheetBuildSubStep(step, input)
    errors.push(...v.errors)
  }
  return { ok: errors.length === 0, errors }
}

export { randomGenerationDelay }
