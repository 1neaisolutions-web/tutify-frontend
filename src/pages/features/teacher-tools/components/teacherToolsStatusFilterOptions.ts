export type StatusFilterOption = { value: string; labelKey: string }

/** Human-readable status filters for list pages (used when tab is “All”). */
export const QUIZ_STATUS_FILTER_OPTIONS: StatusFilterOption[] = [
  { value: '', labelKey: 'teacherTools.anyStatus' },
  { value: 'draft', labelKey: 'teacherTools.tabDraft' },
  { value: 'published', labelKey: 'teacherTools.tabPublished' },
  { value: 'scheduled', labelKey: 'teacherTools.tabScheduled' },
  { value: 'archived', labelKey: 'teacherTools.tabArchived' },
]

export const ASSIGNMENT_STATUS_FILTER_OPTIONS: StatusFilterOption[] = [
  { value: '', labelKey: 'teacherTools.anyStatus' },
  { value: 'draft', labelKey: 'teacherTools.tabDraft' },
  { value: 'active', labelKey: 'teacherTools.tabActive' },
  { value: 'pending_review', labelKey: 'teacherTools.tabPendingReview' },
  { value: 'graded', labelKey: 'teacherTools.tabGraded' },
  { value: 'overdue', labelKey: 'teacherTools.tabOverdue' },
  { value: 'archived', labelKey: 'teacherTools.tabArchived' },
]

export const WORKSHEET_STATUS_FILTER_OPTIONS: StatusFilterOption[] = [
  { value: '', labelKey: 'teacherTools.anyStatus' },
  { value: 'draft', labelKey: 'teacherTools.tabDraft' },
  { value: 'published', labelKey: 'teacherTools.tabPublished' },
  { value: 'archived', labelKey: 'teacherTools.tabArchived' },
]

export const EXAM_STATUS_FILTER_OPTIONS: StatusFilterOption[] = [
  { value: '', labelKey: 'teacherTools.anyStatus' },
  { value: 'draft', labelKey: 'teacherTools.tabDraft' },
  { value: 'scheduled', labelKey: 'teacherTools.tabScheduled' },
  { value: 'completed', labelKey: 'teacherTools.tabCompleted' },
  { value: 'archived', labelKey: 'teacherTools.tabArchived' },
]

/** Overview activity kind filter — matches live activity feed `type` on Teacher Tools overview. */
export const OVERVIEW_ACTIVITY_STATUS_OPTIONS: StatusFilterOption[] = [
  { value: '', labelKey: 'teacherTools.overview.allActivityTypes' },
  { value: 'created', labelKey: 'teacherTools.overview.filterDraftSaves' },
  { value: 'published', labelKey: 'teacherTools.overview.filterPublishedLive' },
  { value: 'scheduled', labelKey: 'teacherTools.overview.filterScheduled' },
]
