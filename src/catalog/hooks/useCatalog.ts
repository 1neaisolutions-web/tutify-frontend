import { useSelector } from 'react-redux'
import { FALLBACK_GRADES, FALLBACK_GRADE_BANDS, FALLBACK_SUBJECTS } from '../fallbacks'

type CatalogOption = { value: string; label: string }

export function useCatalog() {
  const profileContext = useSelector(
    (state: {
      profileContext?: {
        grades?: CatalogOption[]
        gradeBands?: CatalogOption[]
        subjects?: CatalogOption[]
        loading?: boolean
        error?: string | null
      }
    }) => state.profileContext,
  )

  const grades =
    profileContext?.grades && profileContext.grades.length > 0
      ? profileContext.grades
      : [...FALLBACK_GRADES]

  const gradeBands =
    profileContext?.gradeBands && profileContext.gradeBands.length > 0
      ? profileContext.gradeBands
      : [...FALLBACK_GRADE_BANDS]

  const subjects =
    profileContext?.subjects && profileContext.subjects.length > 0
      ? profileContext.subjects
      : [...FALLBACK_SUBJECTS]

  return {
    grades,
    gradeBands,
    subjects,
    loading: profileContext?.loading ?? false,
    error: profileContext?.error ?? null,
  }
}
