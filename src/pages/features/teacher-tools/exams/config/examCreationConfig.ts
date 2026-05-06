/** RAG / scope validation for exam configure step (mirrors quiz / assignment patterns). */
export function validateRagExamBuild(input: {
  title: string
  generateWithoutSources: boolean
  selectedBookIds: string[]
  selectedTopics: string[]
  scopeRefinement: string
}): { ok: boolean; errors: string[] } {
  const errors: string[] = []
  if (!input.title.trim()) errors.push('Exam title is required.')
  if (input.generateWithoutSources) {
    if (!input.scopeRefinement.trim()) {
      errors.push('Add a topic focus in scope refinement when generating without sources.')
    }
  } else {
    if (input.selectedBookIds.length === 0) {
      errors.push('Select at least one approved catalog title — retrieval runs against these materials first.')
    }
    if (input.selectedTopics.length === 0) {
      errors.push('Choose one or more scope topics derived from your selected materials.')
    }
  }
  return { ok: errors.length === 0, errors }
}
