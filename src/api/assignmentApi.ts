import { apiRequest } from './client'
import type { AssignmentBriefTopicStub } from '../pages/features/teacher-tools/demo/generationFromSources'

export type AssignmentApiStatus =
  | 'draft'
  | 'active'
  | 'pending_review'
  | 'graded'
  | 'archived'

export type DifficultyId = 'foundation' | 'standard' | 'challenge'

export interface AssignmentApiItem {
  id: string
  title: string
  subject: string
  grade: string
  classes: string[]
  type: string
  dueAt?: string | null
  createdAt?: string | null
  updatedAt?: string | null
  assignedCount: number
  submitted: number
  pending: number
  graded: number
  status: AssignmentApiStatus
  topic: string
  sourceSummary?: string | null
  briefTopics: AssignmentBriefTopicStub[]
  studentInstructions?: string | null
  handoutLayout?: Record<string, unknown> | null
  sourceBookIds: string[]
  scopeTopics: string[]
  scopeRefinement?: string | null
  generateWithoutSources: boolean
  rigorProfile: string
  teacherNotes?: string | null
  difficulty?: string | null
}

export interface AssignmentListResponse {
  total: number
  page: number
  page_size: number
  items: AssignmentApiItem[]
}

export interface AssignmentListParams {
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

export interface AssignmentCreatePayload {
  title: string
  subject: string
  grade: string
  classes: string[]
  type: string
  rigorProfile: string
  dueAt?: string | null
  assignedAt?: string | null
  studentInstructions?: string
  teacherNotes?: string
  status?: AssignmentApiStatus
  sourceBookIds: string[]
  scopeTopics: string[]
  scopeRefinement?: string
  generateWithoutSources: boolean
  difficulty?: DifficultyId
  briefTopics?: AssignmentBriefTopicStub[]
  handoutLayout?: Record<string, unknown> | null
}

export interface AssignmentPatchPayload {
  title?: string
  subject?: string
  grade?: string
  classes?: string[]
  type?: string
  rigorProfile?: string
  dueAt?: string | null
  assignedAt?: string | null
  studentInstructions?: string
  teacherNotes?: string
  status?: AssignmentApiStatus
  sourceBookIds?: string[]
  scopeTopics?: string[]
  scopeRefinement?: string
  generateWithoutSources?: boolean
  difficulty?: DifficultyId
  briefTopics?: AssignmentBriefTopicStub[]
  handoutLayout?: Record<string, unknown> | null
}

export interface AssignmentGeneratePayload {
  topicCount: number
  difficulty?: DifficultyId
  teacherNotes?: string
  rigorProfile?: string
}

export interface AssignmentGenerateResponse {
  ok: boolean
  generation_run_id: string
  warnings: string[]
  assignment: AssignmentApiItem
}

export interface AssignmentDuplicateResponse {
  ok: boolean
  id: string
}

export interface RegeneratedTopicResponse {
  ok: boolean
  topic: AssignmentBriefTopicStub
  warnings: string[]
}

export interface RegeneratedLineResponse {
  ok: boolean
  lineId: string
  text: string
  warnings: string[]
}

const BASE = '/v1/teacher-tools/assignments'

function normalizeDueAt(iso: string | null | undefined): string {
  if (!iso) return ''
  if (iso.length >= 10 && iso[4] === '-' && iso[7] === '-') return iso.slice(0, 10)
  return iso
}

/** Normalize list/detail item dates for date inputs (YYYY-MM-DD). */
export function normalizeAssignmentApiItem(item: AssignmentApiItem): AssignmentApiItem {
  return { ...item, dueAt: normalizeDueAt(item.dueAt ?? undefined) || null }
}

export function fetchAssignmentList(
  params: AssignmentListParams = {},
  signal?: AbortSignal,
): Promise<AssignmentListResponse> {
  const query: Record<string, string | number> = {}
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') query[k] = v as string | number
  }
  return apiRequest<AssignmentListResponse>(BASE, { query, signal }).then((res) => ({
    ...res,
    items: res.items.map(normalizeAssignmentApiItem),
  }))
}

export function fetchAssignment(id: string, signal?: AbortSignal): Promise<AssignmentApiItem> {
  return apiRequest<AssignmentApiItem>(`${BASE}/${id}`, { signal }).then(normalizeAssignmentApiItem)
}

export function createAssignment(payload: AssignmentCreatePayload): Promise<AssignmentApiItem> {
  return apiRequest<AssignmentApiItem>(BASE, { method: 'POST', body: payload }).then(normalizeAssignmentApiItem)
}

export function patchAssignment(id: string, patch: AssignmentPatchPayload): Promise<AssignmentApiItem> {
  return apiRequest<AssignmentApiItem>(`${BASE}/${id}`, { method: 'PATCH', body: patch }).then(
    normalizeAssignmentApiItem,
  )
}

export function deleteAssignment(id: string): Promise<void> {
  return apiRequest<void>(`${BASE}/${id}`, { method: 'DELETE' })
}

export function duplicateAssignment(id: string): Promise<AssignmentDuplicateResponse> {
  return apiRequest<AssignmentDuplicateResponse>(`${BASE}/${id}/duplicate`, { method: 'POST' })
}

export function generateAssignment(
  id: string,
  payload: AssignmentGeneratePayload,
  idempotencyKey: string,
): Promise<AssignmentGenerateResponse> {
  return apiRequest<AssignmentGenerateResponse>(`${BASE}/${id}/generate`, {
    method: 'POST',
    body: payload,
    headers: { 'Idempotency-Key': idempotencyKey },
  }).then((res) => ({
    ...res,
    assignment: normalizeAssignmentApiItem(res.assignment),
  }))
}

export function regenerateTopic(
  assignmentId: string,
  topicId: string,
  topicTitle: string,
): Promise<RegeneratedTopicResponse> {
  return apiRequest<RegeneratedTopicResponse>(`${BASE}/${assignmentId}/topics/regenerate`, {
    method: 'POST',
    body: { topicId, topicTitle },
  })
}

export function regenerateLine(
  assignmentId: string,
  topicId: string,
  topicTitle: string,
  lineIndex: number,
): Promise<RegeneratedLineResponse> {
  return apiRequest<RegeneratedLineResponse>(`${BASE}/${assignmentId}/lines/regenerate`, {
    method: 'POST',
    body: { topicId, topicTitle, lineIndex },
  })
}
