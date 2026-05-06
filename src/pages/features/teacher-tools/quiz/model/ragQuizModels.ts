/**
 * Frontend contracts for wiring the quiz builder to a retrieval-grounded generator.
 * Replace demo hooks with API calls that accept these shapes.
 */

export interface QuizBasicsPayload {
  title: string
  subject: string
  grade: string
  studentInstructions: string
}

export interface QuizSourceSelectionPayload {
  /** Approved catalog edition IDs */
  bookIds: string[]
}

export interface QuizScopePayload {
  /** Topic strands resolved from catalog metadata for the selected books */
  topics: string[]
  /** Optional natural-language retrieval / generation hint */
  refinement?: string
}

export interface QuizGenerationSettingsPayload {
  questionCount: number
  mixMode: 'balanced' | 'custom'
  countsByType?: { mcq: number; tf: number; short: number }
  includeMcq: boolean
  includeTf: boolean
  includeShort: boolean
  difficulty: 'foundation' | 'standard' | 'challenge'
  teacherNotes?: string
  timeLimitMinutes: number
  shuffleQuestions: boolean
  shuffleAnswers: boolean
  negativeMarking: boolean
}

/** Assembled client payload for `POST /api/v1/.../quiz/generate` (future). */
export interface QuizRagGenerationJobPayload {
  basics: QuizBasicsPayload
  sources: QuizSourceSelectionPayload
  scope: QuizScopePayload
  generation: QuizGenerationSettingsPayload
}
