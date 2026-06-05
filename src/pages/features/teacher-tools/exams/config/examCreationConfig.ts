import type { ExamBuildSubStepId } from './examWizardSteps'
import type { ExamPaperConfig } from './examPaperConfig'
import { validateExamPaperFields } from './examPaperConfig'

export type ExamRagBuildInput = {
  title: string
  generateWithoutSources: boolean
  selectedBookIds: string[]
  selectedTopics: string[]
  scopeRefinement: string
  durationMinutes?: number
  sectionTargetCount?: number
  paper?: ExamPaperConfig
}

export function validateExamBuildSubStep(
  stepId: ExamBuildSubStepId,
  input: ExamRagBuildInput,
): { ok: boolean; errors: string[] } {
  const errors: string[] = []

  switch (stepId) {
    case 'basics':
      if (!input.title.trim()) errors.push('Exam title is required.')
      if (input.durationMinutes != null && (input.durationMinutes < 15 || input.durationMinutes > 360)) {
        errors.push('Duration must be between 15 and 360 minutes.')
      }
      break
    case 'sources':
      if (!input.generateWithoutSources && input.selectedBookIds.length === 0) {
        errors.push('Select at least one approved catalog title — retrieval runs against these materials first.')
      }
      break
    case 'scope':
      if (!input.generateWithoutSources && input.selectedTopics.length === 0) {
        errors.push('Choose one or more scope topics derived from your selected materials.')
      }
      if (input.generateWithoutSources && !input.scopeRefinement.trim()) {
        errors.push('Add a topic focus in scope refinement when generating without sources.')
      }
      break
    case 'paper_structure': {
      const n = input.sectionTargetCount ?? 0
      if (n < 1 || n > 12) errors.push('Set target section count between 1 and 12.')
      if (input.paper) {
        const pe = validateExamPaperFields(input.paper)
        errors.push(...Object.values(pe))
      }
      break
    }
    default:
      break
  }

  return { ok: errors.length === 0, errors }
}

/** RAG / scope validation for exam configure step (mirrors quiz / assignment patterns). */
export function validateRagExamBuild(input: ExamRagBuildInput): { ok: boolean; errors: string[] } {
  const errors: string[] = []
  for (const step of ['basics', 'sources', 'scope', 'paper_structure'] as ExamBuildSubStepId[]) {
    const v = validateExamBuildSubStep(step, input)
    errors.push(...v.errors)
  }
  return { ok: errors.length === 0, errors }
}
