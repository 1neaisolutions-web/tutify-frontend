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

export const SUBJECTS = [
  'Mathematics',
  'English',
  'Science',
  'Biology',
  'Physics',
  'Chemistry',
  'History',
  'Geography',
  'Computer Science',
] as const

export const GRADES = [
  'Grade 5',
  'Grade 6',
  'Grade 8',
  'Grade 10',
  'Year 7',
  'Year 9',
  'Year 11',
] as const
