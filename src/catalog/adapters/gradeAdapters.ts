/**
 * Client-side grade adapters.
 * Keep GRADE_ALIASES in sync with tutify_backend metadata_data.GRADE_ALIASES
 */

const GRADE_ALIASES: Record<string, string> = {
  'year 1': '1',
  'year 2': '2',
  'year 3': '3',
  'year 4': '4',
  'year 5': '5',
  'year 6': '6',
  'year 7': '7',
  'year 8': '8',
  'year 9': '9',
  'year 10': '10',
  'year 11': '11',
  'year 12': '12',
  'grade 1': '1',
  'grade 2': '2',
  'grade 3': '3',
  'grade 4': '4',
  'grade 5': '5',
  'grade 6': '6',
  'grade 7': '7',
  'grade 8': '8',
  'grade 9': '9',
  'grade 10': '10',
  'grade 11': '11',
  'grade 12': '12',
  'grade k': 'K',
  '0': 'K',
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  '10': '10',
  '11': '11',
  '12': '12',
  kindergarten: 'K',
  k: 'K',
  kinder: 'K',
  '1st grade': '1',
  '2nd grade': '2',
  '3rd grade': '3',
  '4th grade': '4',
  '5th grade': '5',
  '6th grade': '6',
  '7th grade': '7',
  '8th grade': '8',
  '9th grade': '9',
  '10th grade': '10',
  '11th grade': '11',
  '12th grade': '12',
}

const NUMERIC_MAP: Record<string, number> = {
  K: 0,
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  '11': 11,
  '12': 12,
}

const LABEL_MAP: Record<string, string> = {
  K: 'Kindergarten',
  '1': 'Grade 1',
  '2': 'Grade 2',
  '3': 'Grade 3',
  '4': 'Grade 4',
  '5': 'Grade 5',
  '6': 'Grade 6',
  '7': 'Grade 7',
  '8': 'Grade 8',
  '9': 'Grade 9',
  '10': 'Grade 10',
  '11': 'Grade 11',
  '12': 'Grade 12',
}

export function resolveGradeValue(raw: string | number | null | undefined): string | null {
  if (raw == null) return null
  const normalized = String(raw).trim().toLowerCase()
  const fromAlias = GRADE_ALIASES[normalized]
  if (fromAlias) return fromAlias
  const stripped = String(raw).trim()
  if (stripped.toUpperCase() === 'K') return 'K'
  if (stripped in LABEL_MAP) return stripped
  return null
}

export function gradeToNumeric(raw: string | number | null | undefined): number | undefined {
  const canonical = resolveGradeValue(raw)
  if (canonical === null) return undefined
  return NUMERIC_MAP[canonical]
}

export function gradeToLabel(raw: string | number | null | undefined): string {
  const canonical = resolveGradeValue(raw)
  if (!canonical) return String(raw ?? '')
  return LABEL_MAP[canonical] ?? String(raw)
}

export function formatGradeDisplay(stored: string | number | null | undefined): string {
  return gradeToLabel(stored)
}

export function gradesMatch(
  stored: string | number | null | undefined,
  filter: string | number | null | undefined,
): boolean {
  if (filter == null || filter === '') return true
  if (stored == null || stored === '') return false
  const a = resolveGradeValue(stored)
  const b = resolveGradeValue(filter)
  if (a && b) return a === b
  return String(stored).trim().toLowerCase() === String(filter).trim().toLowerCase()
}

export function gradeValueForSelect(stored: string | number | null | undefined): string {
  return resolveGradeValue(stored) ?? ''
}
