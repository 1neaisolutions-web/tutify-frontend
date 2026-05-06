import { randomGenerationDelay } from '../../quiz/config/quizCreationConfig'

export const ASSIGNMENT_CREATION_STEPS = ['Configure & generate', 'Review & publish'] as const

export const ASSIGNMENT_TOPIC_COUNT = { min: 1, max: 10, default: 3 }

export interface AssignmentRagBuildValidation {
  ok: boolean
  errors: string[]
}

/** Catalog-first validation for Create Assignment (demo UI). */
export function validateRagAssignmentBuild(input: {
  title: string
  generateWithoutSources: boolean
  selectedBookIds: string[]
  selectedTopics: string[]
  scopeRefinement: string
}): AssignmentRagBuildValidation {
  const errors: string[] = []
  if (!input.title.trim()) errors.push('Add an assignment title.')

  if (!input.generateWithoutSources) {
    if (input.selectedBookIds.length === 0) {
      errors.push('Select one approved catalog title — retrieval runs against this material first.')
    }
    if (input.selectedTopics.length === 0) {
      errors.push('Choose one or more topic strands derived from your selected material.')
    }
  }
  if (input.generateWithoutSources && !input.scopeRefinement.trim()) {
    errors.push('Add a topic focus in scope refinement when generating without sources.')
  }

  return { ok: errors.length === 0, errors }
}

export { randomGenerationDelay }
