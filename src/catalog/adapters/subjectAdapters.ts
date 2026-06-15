import { FALLBACK_SUBJECTS } from '../fallbacks'

export type SubjectContextKey = 'default' | 'teacherTools' | 'template'

export type SubjectOption = { value: string; label: string }

/** Keep in sync with metadata_data.SUBJECT_ALIASES */
const SUBJECT_ALIASES: Record<string, string> = {
  mathematics: 'math',
  math: 'math',
  english: 'ela',
  'english language arts': 'ela',
  science: 'science',
  biology: 'biology',
  physics: 'physics',
  chemistry: 'chemistry',
  history: 'history',
  geography: 'geography',
  'computer science': 'computer_science',
  'social studies': 'social_studies',
  arts: 'art',
  art: 'art',
  technology: 'computer_science',
  business: 'other',
  general: 'other',
  'physical education': 'pe',
}

/** Teacher-tools API label per canonical slug */
const TEACHER_TOOLS_LABELS: Record<string, string> = {
  math: 'Mathematics',
  science: 'Science',
  ela: 'English',
  biology: 'Biology',
  physics: 'Physics',
  chemistry: 'Chemistry',
  history: 'History',
  geography: 'Geography',
  computer_science: 'Computer Science',
}

/** AI template / planner API label per canonical slug */
const TEMPLATE_LABELS: Record<string, string> = {
  math: 'Math',
  science: 'Science',
  ela: 'English',
  art: 'Arts',
  computer_science: 'Technology',
  social_studies: 'General',
  history: 'General',
  geography: 'General',
  biology: 'Science',
  physics: 'Science',
  chemistry: 'Science',
  other: 'General',
}

const TEACHER_TOOLS_SLUGS = new Set(Object.keys(TEACHER_TOOLS_LABELS))
const TEMPLATE_SLUGS = new Set(Object.keys(TEMPLATE_LABELS))

const TEMPLATE_API_SLUGS = new Set(['english', 'math', 'science', 'social_studies', 'steam', 'other'])

/** Template execution API enum slug → catalog slug for SubjectSelect UI. */
export function templateSubjectValueForSelect(stored: string | null | undefined): string {
  if (!stored) return ''
  const key = stored.trim().toLowerCase()
  if (key === 'english') return 'ela'
  if (key === 'steam') return 'steam'
  const resolved = resolveSubjectValue(stored)
  if (resolved) return resolved
  if (TEMPLATE_API_SLUGS.has(key)) return key
  return stored.trim()
}

/** Catalog / UI slug → template execution API enum slug. */
export function templateSubjectToApi(canonical: string | null | undefined): string {
  if (!canonical) return ''
  const key = canonical.trim().toLowerCase()
  if (key === 'ela') return 'english'
  const passthrough: Record<string, string> = {
    math: 'math',
    science: 'science',
    social_studies: 'social_studies',
    steam: 'steam',
    other: 'other',
  }
  if (passthrough[key]) return passthrough[key]
  if (TEMPLATE_API_SLUGS.has(key)) return key
  return canonical.trim()
}

export function resolveSubjectValue(raw: string | null | undefined): string | null {
  if (raw == null || raw === '') return null
  const normalized = raw.trim().toLowerCase()
  if (SUBJECT_ALIASES[normalized]) return SUBJECT_ALIASES[normalized]
  const stripped = raw.trim()
  if (FALLBACK_SUBJECTS.some((s) => s.value === stripped)) return stripped
  for (const [slug, label] of Object.entries(TEACHER_TOOLS_LABELS)) {
    if (label.toLowerCase() === normalized) return slug
  }
  for (const [slug, label] of Object.entries(TEMPLATE_LABELS)) {
    if (label.toLowerCase() === normalized) return slug
  }
  const fromFallback = FALLBACK_SUBJECTS.find((s) => s.label.toLowerCase() === normalized)
  if (fromFallback) return fromFallback.value
  return null
}

export function subjectValueForSelect(stored: string | null | undefined): string {
  return resolveSubjectValue(stored) ?? stored?.trim() ?? ''
}

export function subjectToTeacherToolsLabel(canonical: string | null | undefined): string {
  const resolved = resolveSubjectValue(canonical) ?? canonical?.trim()
  if (resolved && TEACHER_TOOLS_LABELS[resolved]) return TEACHER_TOOLS_LABELS[resolved]
  return resolved ?? ''
}

export function subjectToTemplateLabel(canonical: string | null | undefined): string {
  const resolved = resolveSubjectValue(canonical) ?? canonical?.trim()
  if (resolved && TEMPLATE_LABELS[resolved]) return TEMPLATE_LABELS[resolved]
  return resolved ?? ''
}

export function subjectsMatch(
  filterCanonical: string | null | undefined,
  stored: string | null | undefined,
): boolean {
  if (!filterCanonical) return true
  const left = resolveSubjectValue(filterCanonical)
  const right = resolveSubjectValue(stored)
  if (left && right) return left === right
  if (left) {
    return subjectToTeacherToolsLabel(left).toLowerCase() === String(stored ?? '').trim().toLowerCase()
  }
  return String(filterCanonical).trim().toLowerCase() === String(stored ?? '').trim().toLowerCase()
}

export function getSubjectOptionsForContext(
  context: SubjectContextKey,
  reduxSubjects?: SubjectOption[],
): SubjectOption[] {
  const base = reduxSubjects && reduxSubjects.length > 0 ? reduxSubjects : [...FALLBACK_SUBJECTS]
  switch (context) {
    case 'teacherTools':
      return base.filter((s) => TEACHER_TOOLS_SLUGS.has(s.value))
    case 'template':
      return base
        .filter((s) => TEMPLATE_SLUGS.has(s.value))
        .map((s) => ({
          value: s.value,
          label: TEMPLATE_LABELS[s.value] ?? s.label,
        }))
    default:
      return base
  }
}
