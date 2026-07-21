export type PackStatus = 'scheduled' | 'generating' | 'ready' | 'failed' | 'completed'
export type PackSource = 'teacher-linked' | 'self-created'
export type PackSubject =
  | 'Algebra II'
  | 'Biology'
  | 'English II'
  | 'World History'
  | 'Math'
  | 'Science'
  | 'English'
  | 'History'

export interface FormulaItem {
  id: string
  name: string
  expression: string
  note?: string
}

export interface QuestionTypePrediction {
  id: string
  type: string
  weight: string
  tip: string
}

export interface WarmupMcq {
  id: string
  text: string
  options: string[]
  answerIndex: number
  explanation: string
}

export interface PackContent {
  topicSummary: string[]
  keyFormulas: FormulaItem[]
  predictedQuestionTypes: QuestionTypePrediction[]
  warmupMcqs: WarmupMcq[]
}

export interface PackProgress {
  sectionsViewed: string[]
  mcqAnswers: Record<string, number>
  mcqScore?: number
  markedDoneAt?: string
  readAt?: string
}

export interface NightBeforePack {
  id: string
  examId?: string | null
  title: string
  subject: PackSubject | string
  topics: string[]
  notes?: string
  source: PackSource
  status: PackStatus
  examAt: string
  estimatedMinutes: number
  readyAt?: string
  createdAt: string
  content: PackContent
  progress: PackProgress
  failureMessage?: string
}

export interface CreatePackInput {
  subject: PackSubject | string
  title: string
  examAt: string
  topics: string[]
  notes?: string
}
