export type ToolType = 'quiz' | 'assignment' | 'worksheet' | 'exam'

export type ContentStatus =
  | 'draft'
  | 'published'
  | 'scheduled'
  | 'active'
  | 'overdue'
  | 'pending_review'
  | 'graded'
  | 'archived'
  | 'completed'
  | 'missing'

export type SubmissionStatus =
  | 'not_started'
  | 'submitted'
  | 'late_submitted'
  | 'under_review'
  | 'graded'
  | 'missing'
  | 'in_progress'
  | 'auto_submitted'
  | 'missed'

export interface DemoStudent {
  id: string
  name: string
  classKey: string
}

export interface DemoClass {
  key: string
  label: string
  grade: string
  subject: string
}
