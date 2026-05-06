import { apiRequest } from './client'

export type WorksheetStatus = 'draft' | 'published' | 'archived'
export type WorksheetBlockType = 'mcq' | 'fill_blank' | 'short' | 'match'
export type OutputFormat = 'printable_pdf' | 'interactive_digital' | 'both'
export type DifficultyId = 'foundation' | 'standard' | 'challenge'

export interface WorksheetBlockApi {
  id: string
  type: WorksheetBlockType
  prompt?: string | null
  points: number
  options?: string[] | null
  answer?: string | null
  sampleAnswer?: string | null
  responseLines?: number | null
  left?: string[] | null
  right?: string[] | null
}

export interface WorksheetSessionApi {
  id: string
  sortOrder: number
  title: string
  blocks: WorksheetBlockApi[]
}

export interface WorksheetApiItem {
  id: string
  title: string
  subject: string
  grade: string
  outputFormat: OutputFormat
  classes: string[]
  status: WorksheetStatus
  assignedAt?: string | null
  dueAt?: string | null
  sessions: WorksheetSessionApi[]
  sessionsCount: number
  blocksCount: number
  submissionCount: number
  avgScore: number
  topic: string
  sourceBookIds: string[]
  scopeTopics: string[]
  scopeRefinement?: string | null
  sourceSummary?: string | null
  difficulty?: string | null
  handoutLayout?: Record<string, unknown> | null
  studentInstructions?: string | null
  teacherNotes?: string | null
  generateWithoutSources?: boolean
  createdAt: string
  updatedAt: string
}

export interface WorksheetListResponse {
  total: number
  page: number
  page_size: number
  items: WorksheetApiItem[]
}

export interface WorksheetListParams {
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

export interface WorksheetCreatePayload {
  title: string
  subject: string
  grade: string
  outputFormat: OutputFormat
  classes: string[]
  studentInstructions?: string
  teacherNotes?: string
  status?: WorksheetStatus
  sourceBookIds: string[]
  scopeTopics: string[]
  scopeRefinement?: string
  generateWithoutSources: boolean
  difficulty?: DifficultyId
  handoutLayout?: Record<string, unknown> | null
}

export interface WorksheetPatchPayload {
  title?: string
  subject?: string
  grade?: string
  outputFormat?: OutputFormat
  classes?: string[]
  studentInstructions?: string
  teacherNotes?: string
  status?: WorksheetStatus
  assignedAt?: string | null
  dueAt?: string | null
  sourceBookIds?: string[]
  scopeTopics?: string[]
  scopeRefinement?: string
  generateWithoutSources?: boolean
  difficulty?: DifficultyId
  handoutLayout?: Record<string, unknown> | null
}

export interface WorksheetGeneratePayload {
  questionCount: number
  mixMode: 'balanced' | 'custom'
  includeMcq: boolean
  includeFillBlank: boolean
  includeShort: boolean
  includeMatch: boolean
  countsByType?: { mcq: number; fill_blank: number; short: number; match: number }
  difficulty?: DifficultyId
  teacherNotes?: string
}

export interface WorksheetGenerateResponse {
  ok: boolean
  generation_run_id: string
  warnings: string[]
  worksheet: WorksheetApiItem
}

export interface DuplicateResponse {
  ok: boolean
  id: string
}

export interface WorksheetSessionCreatePayload {
  title: string
}

export interface WorksheetSessionPatchPayload {
  title?: string
  sort_order?: number
}

export interface WorksheetBlockCreatePayload {
  type: WorksheetBlockType
  prompt?: string | null
  points?: number
  options?: string[]
  answer?: string
  sampleAnswer?: string
  responseLines?: number
  left?: string[]
  right?: string[]
}

export interface WorksheetBlockPatchPayload {
  prompt?: string | null
  points?: number
  options?: string[]
  answer?: string
  sampleAnswer?: string
  responseLines?: number
  left?: string[]
  right?: string[]
}

export interface SessionReorderItem {
  id: string
  sort_order: number
}

export interface BlockReorderItem {
  id: string
  sort_order: number
}

const BASE = '/v1/teacher-tools/worksheets'

export function fetchWorksheetList(
  params: WorksheetListParams = {},
  signal?: AbortSignal,
): Promise<WorksheetListResponse> {
  const query: Record<string, string | number> = {}
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') query[k] = v as string | number
  }
  return apiRequest<WorksheetListResponse>(BASE, { query, signal })
}

export function fetchWorksheet(id: string, signal?: AbortSignal): Promise<WorksheetApiItem> {
  return apiRequest<WorksheetApiItem>(`${BASE}/${id}`, { signal })
}

export function createWorksheet(payload: WorksheetCreatePayload): Promise<WorksheetApiItem> {
  return apiRequest<WorksheetApiItem>(BASE, { method: 'POST', body: payload })
}

export function patchWorksheet(id: string, patch: WorksheetPatchPayload): Promise<WorksheetApiItem> {
  return apiRequest<WorksheetApiItem>(`${BASE}/${id}`, { method: 'PATCH', body: patch })
}

export function deleteWorksheet(id: string): Promise<void> {
  return apiRequest<void>(`${BASE}/${id}`, { method: 'DELETE' })
}

export function duplicateWorksheet(id: string): Promise<DuplicateResponse> {
  return apiRequest<DuplicateResponse>(`${BASE}/${id}/duplicate`, { method: 'POST' })
}

export function generateWorksheet(
  id: string,
  payload: WorksheetGeneratePayload,
  idempotencyKey: string,
): Promise<WorksheetGenerateResponse> {
  return apiRequest<WorksheetGenerateResponse>(`${BASE}/${id}/generate`, {
    method: 'POST',
    body: payload,
    headers: { 'Idempotency-Key': idempotencyKey },
  })
}

export function addWorksheetSession(worksheetId: string, payload: WorksheetSessionCreatePayload): Promise<WorksheetApiItem> {
  return apiRequest<WorksheetApiItem>(`${BASE}/${worksheetId}/sessions`, { method: 'POST', body: payload })
}

export function patchWorksheetSession(
  worksheetId: string,
  sessionId: string,
  patch: WorksheetSessionPatchPayload,
): Promise<WorksheetApiItem> {
  return apiRequest<WorksheetApiItem>(`${BASE}/${worksheetId}/sessions/${sessionId}`, {
    method: 'PATCH',
    body: patch,
  })
}

export function deleteWorksheetSession(worksheetId: string, sessionId: string): Promise<WorksheetApiItem> {
  return apiRequest<WorksheetApiItem>(`${BASE}/${worksheetId}/sessions/${sessionId}`, { method: 'DELETE' })
}

export function reorderWorksheetSessions(worksheetId: string, order: SessionReorderItem[]): Promise<WorksheetApiItem> {
  return apiRequest<WorksheetApiItem>(`${BASE}/${worksheetId}/sessions/reorder`, {
    method: 'PATCH',
    body: { order },
  })
}

export function addWorksheetBlock(
  worksheetId: string,
  sessionId: string,
  block: WorksheetBlockCreatePayload,
): Promise<WorksheetApiItem> {
  return apiRequest<WorksheetApiItem>(`${BASE}/${worksheetId}/sessions/${sessionId}/blocks`, {
    method: 'POST',
    body: block,
  })
}

export function patchWorksheetBlock(
  worksheetId: string,
  sessionId: string,
  blockId: string,
  patch: WorksheetBlockPatchPayload,
): Promise<WorksheetApiItem> {
  return apiRequest<WorksheetApiItem>(`${BASE}/${worksheetId}/sessions/${sessionId}/blocks/${blockId}`, {
    method: 'PATCH',
    body: patch,
  })
}

export function deleteWorksheetBlock(
  worksheetId: string,
  sessionId: string,
  blockId: string,
): Promise<WorksheetApiItem> {
  return apiRequest<WorksheetApiItem>(`${BASE}/${worksheetId}/sessions/${sessionId}/blocks/${blockId}`, {
    method: 'DELETE',
  })
}

export function reorderWorksheetBlocks(
  worksheetId: string,
  sessionId: string,
  order: BlockReorderItem[],
): Promise<WorksheetApiItem> {
  return apiRequest<WorksheetApiItem>(`${BASE}/${worksheetId}/sessions/${sessionId}/blocks/reorder`, {
    method: 'PATCH',
    body: { order },
  })
}

export function regenerateWorksheetBlock(
  worksheetId: string,
  sessionId: string,
  blockId: string,
): Promise<WorksheetApiItem> {
  return apiRequest<WorksheetApiItem>(
    `${BASE}/${worksheetId}/sessions/${sessionId}/blocks/${blockId}/regenerate`,
    { method: 'POST' },
  )
}
