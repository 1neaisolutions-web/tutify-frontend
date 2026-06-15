import { FALLBACK_GRADES } from '../fallbacks'
import { resolveGradeValue } from './gradeAdapters'

export type GradeOption = { value: string; label: string }

/** Template seed enum string → canonical slug (K, 1…12). */
export function resolveTemplateOrdinalGrade(
  raw: string | number | null | undefined,
): string | null {
  return resolveGradeValue(raw)
}

export function isTemplateOrdinalGradeEnum(options: string[]): boolean {
  if (!options.length) return false
  return options.every((opt) => resolveTemplateOrdinalGrade(opt) !== null)
}

export function templateGradeLevelValueForSelect(
  stored: string | number | null | undefined,
  _schemaOptions?: string[],
): string {
  return resolveTemplateOrdinalGrade(stored) ?? ''
}

export function templateGradeLevelToApi(
  slug: string | null | undefined,
  schemaOptions: string[],
): string {
  if (!slug?.trim()) return ''
  const canonical = resolveTemplateOrdinalGrade(slug)
  if (!canonical) return ''
  const match = schemaOptions.find((opt) => resolveTemplateOrdinalGrade(opt) === canonical)
  return match ?? ''
}

export function gradeOptionsForTemplateEnum(
  schemaOptions: string[],
  reduxGrades?: GradeOption[],
): GradeOption[] {
  const base =
    reduxGrades && reduxGrades.length > 0 ? reduxGrades : [...FALLBACK_GRADES]
  const labelBySlug = new Map(base.map((g) => [g.value, g.label]))

  return schemaOptions
    .map((opt) => {
      const slug = resolveTemplateOrdinalGrade(opt)
      if (!slug) return null
      return {
        value: slug,
        label: labelBySlug.get(slug) ?? opt,
      }
    })
    .filter((g): g is GradeOption => g !== null)
}

export function isTemplateGradeLevelField(field: {
  name: string
  type: string
  options?: string[]
}): boolean {
  return (
    field.name === 'grade_level' &&
    field.type === 'select' &&
    !!field.options?.length &&
    isTemplateOrdinalGradeEnum(field.options)
  )
}
