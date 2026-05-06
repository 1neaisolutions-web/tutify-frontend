export type StatusFilterOption = { value: string; label: string }

/** Human-readable status filters for list pages (used when tab is “All”). */
export const QUIZ_STATUS_FILTER_OPTIONS: StatusFilterOption[] = [
  { value: '', label: 'Any status' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'archived', label: 'Archived' },
]

export const ASSIGNMENT_STATUS_FILTER_OPTIONS: StatusFilterOption[] = [
  { value: '', label: 'Any status' },
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'pending_review', label: 'Pending review' },
  { value: 'graded', label: 'Graded' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'archived', label: 'Archived' },
]

export const WORKSHEET_STATUS_FILTER_OPTIONS: StatusFilterOption[] = [
  { value: '', label: 'Any status' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
]

export const EXAM_STATUS_FILTER_OPTIONS: StatusFilterOption[] = [
  { value: '', label: 'Any status' },
  { value: 'draft', label: 'Draft' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
]

/** Overview activity kind filter — matches live activity feed `type` on Teacher Tools overview. */
export const OVERVIEW_ACTIVITY_STATUS_OPTIONS: StatusFilterOption[] = [
  { value: '', label: 'All activity types' },
  { value: 'created', label: 'Draft saves' },
  { value: 'published', label: 'Published & live' },
  { value: 'scheduled', label: 'Scheduled' },
]
