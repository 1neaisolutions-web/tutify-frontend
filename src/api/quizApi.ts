import { apiRequest } from './client'

// ─── Types ────────────────────────────────────────────────────────────────────

export type QuizStatus = 'draft' | 'published' | 'scheduled' | 'archived'
export type QuestionType = 'mcq' | 'tf' | 'short'
export type DifficultyId = 'foundation' | 'standard' | 'challenge'

export interface QuizQuestionStub {
  id: string
  type: QuestionType
  prompt: string
  points: number
  options?: string[]
  responseLines?: number
  reviewBadges?: Record<string, string | null>
}

export interface QuizApiItem {
  id: string
  title: string
  subject: string
  grade: string
  classes: string[]
  questions: number
  totalMarks: number
  timeLimitMinutes: number
  status: QuizStatus
  assignedAt?: string | null
  dueAt?: string | null
  createdAt?: string | null
  updatedAt?: string | null
  submissionCount: number
  avgScore: number
  topic: string
  sourceBookIds: string[]
  scopeTopics: string[]
  scopeRefinement?: string | null
  sourceSummary?: string | null
  questionStubs: QuizQuestionStub[]
  studentInstructions?: string | null
  difficulty?: string | null
  shuffleQuestions?: boolean | null
  shuffleAnswers?: boolean | null
  negativeMarking?: boolean | null
  handoutLayout?: Record<string, unknown> | null
}

export interface QuizListResponse {
  total: number
  page: number
  page_size: number
  items: QuizApiItem[]
}

export interface QuizListParams {
  q?: string
  subject?: string
  grade?: string
  status?: string
  class_key?: string
  date_from?: string
  date_to?: string
  page?: number
  page_size?: number
}

export interface QuizCreatePayload {
  title: string
  subject: string
  grade: string
  classes: string[]
  timeLimitMinutes: number
  studentInstructions?: string
  teacherNotes?: string
  status?: QuizStatus
  sourceBookIds: string[]
  scopeTopics: string[]
  scopeRefinement?: string
  generateWithoutSources: boolean
  difficulty?: DifficultyId
  shuffleQuestions: boolean
  shuffleAnswers: boolean
  negativeMarking: boolean
  handoutLayout?: Record<string, unknown> | null
}

export interface QuizPatchPayload {
  title?: string
  subject?: string
  grade?: string
  classes?: string[]
  timeLimitMinutes?: number
  studentInstructions?: string
  teacherNotes?: string
  status?: QuizStatus
  assignedAt?: string | null
  dueAt?: string | null
  sourceBookIds?: string[]
  scopeTopics?: string[]
  scopeRefinement?: string
  generateWithoutSources?: boolean
  difficulty?: DifficultyId
  shuffleQuestions?: boolean
  shuffleAnswers?: boolean
  negativeMarking?: boolean
  handoutLayout?: Record<string, unknown> | null
}

export interface QuizGeneratePayload {
  questionCount: number
  mixMode: 'balanced' | 'custom'
  includeMcq: boolean
  includeTf: boolean
  includeShort: boolean
  countsByType?: { mcq: number; tf: number; short: number }
  difficulty?: DifficultyId
  teacherNotes?: string
}

export interface GenerateResponse {
  ok: boolean
  generation_run_id: string
  warnings: string[]
  quiz: QuizApiItem
}

export interface DuplicateResponse {
  ok: boolean
  id: string
}

export interface QuizQuestionCreatePayload {
  type: QuestionType
  prompt: string
  points?: number
  options?: string[]
  response_lines?: number
  reviewBadges?: Record<string, string | null>
}

export interface QuizQuestionPatchPayload {
  prompt?: string
  points?: number
  options?: string[]
  response_lines?: number
  reviewBadges?: Record<string, string | null>
}

export interface QuizReorderItem {
  id: string
  sort_order: number
}

// ─── API Functions ────────────────────────────────────────────────────────────

const BASE = '/v1/teacher-tools/quizzes'

/** List quizzes with optional filters. */
export function fetchQuizList(
  params: QuizListParams = {},
  signal?: AbortSignal,
): Promise<QuizListResponse> {
  const query: Record<string, string | number> = {}
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') query[k] = v as string | number
  }
  return apiRequest<QuizListResponse>(BASE, { query, signal })
}

/** Get a single quiz with all question stubs. */
export function fetchQuiz(id: string, signal?: AbortSignal): Promise<QuizApiItem> {
  return apiRequest<QuizApiItem>(`${BASE}/${id}`, { signal })
}

/** Create a quiz shell (no questions yet). */
export function createQuiz(payload: QuizCreatePayload): Promise<QuizApiItem> {
  return apiRequest<QuizApiItem>(BASE, { method: 'POST', body: payload })
}

/** Partial update a quiz (status, handoutLayout, scope fields, etc.). */
export function patchQuiz(id: string, patch: QuizPatchPayload): Promise<QuizApiItem> {
  return apiRequest<QuizApiItem>(`${BASE}/${id}`, { method: 'PATCH', body: patch })
}

/** Hard-delete a quiz and all its questions. */
export function deleteQuiz(id: string): Promise<void> {
  return apiRequest<void>(`${BASE}/${id}`, { method: 'DELETE' })
}

/** Duplicate a quiz (deep copy with questions). Returns new quiz id. */
export function duplicateQuiz(id: string): Promise<DuplicateResponse> {
  return apiRequest<DuplicateResponse>(`${BASE}/${id}/duplicate`, { method: 'POST' })
}

/**
 * Generate (or re-generate) questions for an existing quiz using LLM + RAG.
 * Pass a stable idempotencyKey (uuidv4) per attempt to prevent duplicate LLM calls.
 */
export function generateQuiz(
  id: string,
  payload: QuizGeneratePayload,
  idempotencyKey: string,
): Promise<GenerateResponse> {
  return apiRequest<GenerateResponse>(`${BASE}/${id}/generate`, {
    method: 'POST',
    body: payload,
    headers: { 'Idempotency-Key': idempotencyKey },
  })
}

// ─── Per-question operations ──────────────────────────────────────────────────

/** Add a question manually. Returns full updated QuizApiItem. */
export function addQuestion(quizId: string, q: QuizQuestionCreatePayload): Promise<QuizApiItem> {
  return apiRequest<QuizApiItem>(`${BASE}/${quizId}/questions`, {
    method: 'POST',
    body: q,
  })
}

/** Edit a single question. Returns full updated QuizApiItem. */
export function patchQuestion(
  quizId: string,
  questionId: string,
  patch: QuizQuestionPatchPayload,
): Promise<QuizApiItem> {
  return apiRequest<QuizApiItem>(`${BASE}/${quizId}/questions/${questionId}`, {
    method: 'PATCH',
    body: patch,
  })
}

/** Delete a single question (minimum 1 required). Returns full updated QuizApiItem. */
export function deleteQuestion(quizId: string, questionId: string): Promise<QuizApiItem> {
  return apiRequest<QuizApiItem>(`${BASE}/${quizId}/questions/${questionId}`, {
    method: 'DELETE',
  })
}

/**
 * Reorder questions. Pass the full new order as [{id, sort_order}].
 * Returns full updated QuizApiItem.
 */
export function reorderQuestions(quizId: string, order: QuizReorderItem[]): Promise<QuizApiItem> {
  return apiRequest<QuizApiItem>(`${BASE}/${quizId}/questions/reorder`, {
    method: 'PATCH',
    body: { order },
  })
}

/** Re-generate a single question (keeps same type, uses quiz's stored RAG scope). */
export function regenerateQuestion(quizId: string, questionId: string): Promise<QuizApiItem> {
  return apiRequest<QuizApiItem>(`${BASE}/${quizId}/questions/${questionId}/regenerate`, {
    method: 'POST',
  })
}

