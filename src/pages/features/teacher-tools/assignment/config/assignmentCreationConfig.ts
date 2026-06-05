import { randomGenerationDelay } from '../../quiz/config/quizCreationConfig'
import type { AssignmentBuildSubStepId } from './assignmentWizardSteps'

export const ASSIGNMENT_CREATION_STEPS = ['Configure & generate', 'Review & publish'] as const

export type AssignmentRagBuildInput = {
  title: string
  generateWithoutSources: boolean
  selectedBookIds: string[]
  selectedTopics: string[]
  scopeRefinement: string
  topicCount?: number
}

export const ASSIGNMENT_TOPIC_COUNT = { min: 1, max: 10, default: 3 }

export interface AssignmentRagBuildValidation {
  ok: boolean
  errors: string[]
}

export function validateAssignmentBuildSubStep(
  stepId: AssignmentBuildSubStepId,
  input: AssignmentRagBuildInput,
): AssignmentRagBuildValidation {
  const errors: string[] = []

  switch (stepId) {
    case 'basics':
      if (!input.title.trim()) errors.push('Add an assignment title.')
      break
    case 'sources':
      if (!input.generateWithoutSources && input.selectedBookIds.length === 0) {
        errors.push('Select one approved catalog title — retrieval runs against this material first.')
      }
      break
    case 'scope':
      if (!input.generateWithoutSources && input.selectedTopics.length === 0) {
        errors.push('Choose one or more topic strands derived from your selected material.')
      }
      if (input.generateWithoutSources && !input.scopeRefinement.trim()) {
        errors.push('Add a topic focus in scope refinement when generating without sources.')
      }
      break
    case 'design': {
      const n = input.topicCount ?? 0
      if (n < ASSIGNMENT_TOPIC_COUNT.min || n > ASSIGNMENT_TOPIC_COUNT.max) {
        errors.push(`Set between ${ASSIGNMENT_TOPIC_COUNT.min} and ${ASSIGNMENT_TOPIC_COUNT.max} brief topics.`)
      }
      break
    }
    default:
      break
  }

  return { ok: errors.length === 0, errors }
}

/** Catalog-first validation for Create Assignment (demo UI). */
export function validateRagAssignmentBuild(input: AssignmentRagBuildInput): AssignmentRagBuildValidation {
  const errors: string[] = []
  for (const step of ['basics', 'sources', 'scope', 'design'] as AssignmentBuildSubStepId[]) {
    const v = validateAssignmentBuildSubStep(step, input)
    errors.push(...v.errors)
  }
  return { ok: errors.length === 0, errors }
}

export { randomGenerationDelay }
