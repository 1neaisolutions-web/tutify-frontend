import type { CatalogListParams } from '@/api/quizCatalog'
import { gradesMatch } from '@/catalog/adapters/gradeAdapters'
import { subjectsMatch } from '@/catalog/adapters/subjectAdapters'

export interface BuildCatalogListParamsInput {
  subject: string
  grade: string
  q?: string
  strict?: boolean
  includeNearMatches?: boolean
  page?: number
  page_size?: number
}

/**
 * Build query params for GET /v1/quiz/catalog.
 * UI wizard state uses canonical slugs (math, 8); backend normalizes matching.
 */
export function buildCatalogListParams(input: BuildCatalogListParamsInput): CatalogListParams {
  const params: CatalogListParams = {
    page: input.page ?? 1,
    page_size: input.page_size ?? 100,
    strict: input.strict ?? true,
    include_near_matches: input.includeNearMatches ?? false,
  }

  const subject = input.subject?.trim()
  const grade = input.grade?.trim()
  const q = input.q?.trim()

  if (subject) params.subject = subject
  if (grade) params.grade = grade
  if (q) params.q = q

  return params
}

/** Client-side check for out-of-filter badge (approximates backend semantic match). */
export function isBookInCatalogFilter(
  book: { subject: string | null; grades: string[] },
  subject: string,
  grade: string,
): boolean {
  if (!subjectsMatch(subject, book.subject)) return false
  if (!grade?.trim()) return true
  if (book.grades.length === 0) return false
  return book.grades.some((g) => gradesMatch(g, grade))
}
