import { apiRequest } from './client'

export type ExamStatus = 'draft' | 'scheduled' | 'completed' | 'archived'
export type DifficultyId = 'foundation' | 'standard' | 'challenge'

export interface ExamPaperConfigApi {
  objCount: number
  objMarksPer: number
  objOptions: 4 | 5
  objNegative: boolean
  shortCount: number
  shortMarksPer: number
  shortRule: 'all' | 'pickNM'
  shortN: number
  shortM: number
  longCount: number
  longMarksPer: number
  longSubparts: number
  longRule: 'all' | 'pickNM'
  longN: number
  longM: number
}

export interface ExamSectionApi {
  id: string
  sortOrder: number
  title: string
  marks: number
  description?: string | null
}

export interface ExamMcqApi {
  id: string
  sortOrder: number
  stem: string
  options: string[]
  marksPer: number
}

export interface ExamShortApi {
  id: string
  sortOrder: number
  stem: string
  marksPer: number
}

export interface ExamLongApi {
  id: string
  sortOrder: number
  stem: string
  subparts: string[]
  marksPer: number
}

export interface ExamApiItem {
  id: string
  title: string
  subject: string
  grade: string
  examType: string
  term: string
  internationalStandard: string
  durationMinutes: number
  totalMarks: number
  scheduleStart?: string | null
  scheduleEnd?: string | null
  classes: string[]
  status: ExamStatus
  completionPct: number
  sectionTargetCount: number
  sourceBookIds: string[]
  scopeTopics: string[]
  scopeRefinement?: string | null
  sourceSummary?: string | null
  generateWithoutSources: boolean
  paper: ExamPaperConfigApi
  sections: ExamSectionApi[]
  mcqs: ExamMcqApi[]
  shorts: ExamShortApi[]
  longs: ExamLongApi[]
  handoutLayout?: Record<string, unknown> | null
  studentInstructions?: string | null
  teacherNotes?: string | null
  createdAt: string
  updatedAt: string
}

export interface ExamListResponse {
  total: number
  page: number
  page_size: number
  items: ExamApiItem[]
}

export interface ExamListParams {
  q?: string
  subject?: string
  grade?: string
  status?: string
  class_key?: string
  date_from?: string
  date_to?: string
  exam_type?: string
  term?: string
  page?: number
  page_size?: number
}

export interface ExamCreatePayload {
  title: string
  subject: string
  grade: string
  examType: string
  term: string
  internationalStandard: string
  durationMinutes: number
  scheduleStart?: string | null
  scheduleEnd?: string | null
  classes: string[]
  status?: ExamStatus
  sectionTargetCount: number
  sourceBookIds: string[]
  scopeTopics: string[]
  scopeRefinement?: string
  generateWithoutSources: boolean
  paper: ExamPaperConfigApi
  handoutLayout?: Record<string, unknown> | null
  studentInstructions?: string
  teacherNotes?: string
}

export interface ExamPatchPayload {
  title?: string
  subject?: string
  grade?: string
  examType?: string
  term?: string
  internationalStandard?: string
  durationMinutes?: number
  scheduleStart?: string | null
  scheduleEnd?: string | null
  classes?: string[]
  status?: ExamStatus
  completionPct?: number
  sectionTargetCount?: number
  sourceBookIds?: string[]
  scopeTopics?: string[]
  scopeRefinement?: string
  generateWithoutSources?: boolean
  paper?: ExamPaperConfigApi
  handoutLayout?: Record<string, unknown> | null
  studentInstructions?: string
  teacherNotes?: string
}

export interface ExamGeneratePayload {
  difficulty?: DifficultyId
  teacherNotes?: string
  regenerateScope?: 'all' | 'mcq' | 'short' | 'long'
}

export interface ExamGenerateResponse {
  ok: boolean
  generation_run_id: string
  warnings: string[]
  exam: ExamApiItem
}

export interface DuplicateResponse {
  ok: boolean
  id: string
}

export interface ExamMcqCreatePayload {
  stem: string
  options: string[]
  marksPer?: number
}
export interface ExamMcqPatchPayload {
  stem?: string
  options?: string[]
  marksPer?: number
}
export interface ExamShortCreatePayload {
  stem: string
  marksPer?: number
}
export interface ExamShortPatchPayload {
  stem?: string
  marksPer?: number
}
export interface ExamLongCreatePayload {
  stem: string
  subparts: string[]
  marksPer?: number
}
export interface ExamLongPatchPayload {
  stem?: string
  subparts?: string[]
  marksPer?: number
}
export interface ExamQuestionReorderItem {
  id: string
  sort_order: number
}

const BASE = '/v1/teacher-tools/exams'

export function fetchExamList(params: ExamListParams = {}, signal?: AbortSignal): Promise<ExamListResponse> {
  const query: Record<string, string | number> = {}
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') query[k] = v as string | number
  }
  return apiRequest<ExamListResponse>(BASE, { query, signal })
}

export function fetchExam(id: string, signal?: AbortSignal): Promise<ExamApiItem> {
  return apiRequest<ExamApiItem>(`${BASE}/${id}`, { signal })
}

export function createExam(payload: ExamCreatePayload): Promise<ExamApiItem> {
  return apiRequest<ExamApiItem>(BASE, { method: 'POST', body: payload })
}

export function patchExam(id: string, patch: ExamPatchPayload): Promise<ExamApiItem> {
  return apiRequest<ExamApiItem>(`${BASE}/${id}`, { method: 'PATCH', body: patch })
}

export function deleteExam(id: string): Promise<void> {
  return apiRequest<void>(`${BASE}/${id}`, { method: 'DELETE' })
}

export function duplicateExam(id: string): Promise<DuplicateResponse> {
  return apiRequest<DuplicateResponse>(`${BASE}/${id}/duplicate`, { method: 'POST' })
}

export function generateExam(
  id: string,
  payload: ExamGeneratePayload,
  idempotencyKey: string,
): Promise<ExamGenerateResponse> {
  return apiRequest<ExamGenerateResponse>(`${BASE}/${id}/generate`, {
    method: 'POST',
    body: payload,
    headers: { 'Idempotency-Key': idempotencyKey },
  })
}

export function addMcq(examId: string, q: ExamMcqCreatePayload): Promise<ExamApiItem> {
  return apiRequest<ExamApiItem>(`${BASE}/${examId}/questions/mcq`, { method: 'POST', body: q })
}

export function patchMcq(examId: string, qid: string, patch: ExamMcqPatchPayload): Promise<ExamApiItem> {
  return apiRequest<ExamApiItem>(`${BASE}/${examId}/questions/mcq/${qid}`, { method: 'PATCH', body: patch })
}

export function deleteMcq(examId: string, qid: string): Promise<ExamApiItem> {
  return apiRequest<ExamApiItem>(`${BASE}/${examId}/questions/mcq/${qid}`, { method: 'DELETE' })
}

export function reorderMcqs(examId: string, order: ExamQuestionReorderItem[]): Promise<ExamApiItem> {
  return apiRequest<ExamApiItem>(`${BASE}/${examId}/questions/mcq/reorder`, {
    method: 'PATCH',
    body: { order },
  })
}

export function addShort(examId: string, q: ExamShortCreatePayload): Promise<ExamApiItem> {
  return apiRequest<ExamApiItem>(`${BASE}/${examId}/questions/short`, { method: 'POST', body: q })
}

export function patchShort(examId: string, qid: string, patch: ExamShortPatchPayload): Promise<ExamApiItem> {
  return apiRequest<ExamApiItem>(`${BASE}/${examId}/questions/short/${qid}`, { method: 'PATCH', body: patch })
}

export function deleteShort(examId: string, qid: string): Promise<ExamApiItem> {
  return apiRequest<ExamApiItem>(`${BASE}/${examId}/questions/short/${qid}`, { method: 'DELETE' })
}

export function reorderShorts(examId: string, order: ExamQuestionReorderItem[]): Promise<ExamApiItem> {
  return apiRequest<ExamApiItem>(`${BASE}/${examId}/questions/short/reorder`, {
    method: 'PATCH',
    body: { order },
  })
}

export function addLong(examId: string, q: ExamLongCreatePayload): Promise<ExamApiItem> {
  return apiRequest<ExamApiItem>(`${BASE}/${examId}/questions/long`, { method: 'POST', body: q })
}

export function patchLong(examId: string, qid: string, patch: ExamLongPatchPayload): Promise<ExamApiItem> {
  return apiRequest<ExamApiItem>(`${BASE}/${examId}/questions/long/${qid}`, { method: 'PATCH', body: patch })
}

export function deleteLong(examId: string, qid: string): Promise<ExamApiItem> {
  return apiRequest<ExamApiItem>(`${BASE}/${examId}/questions/long/${qid}`, { method: 'DELETE' })
}

export function reorderLongs(examId: string, order: ExamQuestionReorderItem[]): Promise<ExamApiItem> {
  return apiRequest<ExamApiItem>(`${BASE}/${examId}/questions/long/reorder`, {
    method: 'PATCH',
    body: { order },
  })
}

export function regenerateMcqApi(examId: string, qid: string): Promise<ExamApiItem> {
  return apiRequest<ExamApiItem>(`${BASE}/${examId}/questions/mcq/${qid}/regenerate`, { method: 'POST' })
}

export function regenerateShortApi(examId: string, qid: string): Promise<ExamApiItem> {
  return apiRequest<ExamApiItem>(`${BASE}/${examId}/questions/short/${qid}/regenerate`, { method: 'POST' })
}

export function regenerateLongApi(examId: string, qid: string): Promise<ExamApiItem> {
  return apiRequest<ExamApiItem>(`${BASE}/${examId}/questions/long/${qid}/regenerate`, { method: 'POST' })
}
