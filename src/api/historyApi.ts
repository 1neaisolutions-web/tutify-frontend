import { apiRequest } from './client'

export type HistorySourceType =
  | 'quiz'
  | 'assignment'
  | 'worksheet'
  | 'exam'
  | 'chatbot_conversation'
  | 'pixgen_generation'
  | 'youtube_quiz'
  | 'template_execution'

export type PerformanceHint = 'effective' | 'needs_improvement'

export interface HistoryItem {
  id: string
  sourceType: HistorySourceType
  title: string
  subject: string | null
  grade: string | null
  status: string | null
  pinned: boolean
  performanceHint: PerformanceHint | null
  usageCount: number
  lastUsedAt: string | null
  createdAt: string
  updatedAt: string
  meta: Record<string, unknown>
}

export interface HistoryListParams {
  sourceTypes?: HistorySourceType[]
  q?: string
  dateFrom?: string
  dateTo?: string
  pinnedOnly?: boolean
  page?: number
  pageSize?: number
}

export interface HistoryListResponse {
  total: number
  page: number
  pageSize: number
  items: HistoryItem[]
}

export interface HistoryStatsResponse {
  total: number
  thisWeek: number
  pinned: number
  bySourceType: Record<string, number>
}

export interface PinToggleRequest {
  sourceType: HistorySourceType
  sourceId: string
  pinned: boolean
}

export interface FeedbackUpsertRequest {
  sourceType: HistorySourceType
  sourceId: string
  hint: PerformanceHint
  note?: string | null
}

export interface QuotaUsage {
  sourceType: HistorySourceType
  used: number
  limit: number
  warningLevel: 'ok' | 'warning' | 'full'
}

export interface HistoryQuotaResponse {
  tier: string
  perTypeLimit: number
  totalLimit: number
  totalUsed: number
  usage: QuotaUsage[]
}

function mapItem(raw: any): HistoryItem {
  return {
    id: String(raw.id),
    sourceType: raw.source_type,
    title: raw.title,
    subject: raw.subject ?? null,
    grade: raw.grade ?? null,
    status: raw.status ?? null,
    pinned: Boolean(raw.pinned),
    performanceHint: raw.performance_hint ?? null,
    usageCount: Number(raw.usage_count ?? 0),
    lastUsedAt: raw.last_used_at ?? null,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    meta: raw.meta ?? {},
  }
}

export async function listHistory(params: HistoryListParams): Promise<HistoryListResponse> {
  const raw = await apiRequest<any>('/v1/history', {
    query: {
      source_types: params.sourceTypes,
      q: params.q,
      date_from: params.dateFrom,
      date_to: params.dateTo,
      pinned_only: params.pinnedOnly,
      page: params.page ?? 1,
      page_size: params.pageSize ?? 20,
    } as any,
  })

  return {
    total: Number(raw.total ?? 0),
    page: Number(raw.page ?? 1),
    pageSize: Number(raw.page_size ?? raw.pageSize ?? 20),
    items: Array.isArray(raw.items) ? raw.items.map(mapItem) : [],
  }
}

export async function getHistoryStats(): Promise<HistoryStatsResponse> {
  const raw = await apiRequest<any>('/v1/history/stats')
  return {
    total: Number(raw.total ?? 0),
    thisWeek: Number(raw.this_week ?? 0),
    pinned: Number(raw.pinned ?? 0),
    bySourceType: raw.by_source_type ?? {},
  }
}

export async function togglePin(req: PinToggleRequest): Promise<void> {
  await apiRequest('/v1/history/pins', {
    method: 'POST',
    body: {
      source_type: req.sourceType,
      source_id: req.sourceId,
      pinned: req.pinned,
    },
  })
}

export async function upsertFeedback(req: FeedbackUpsertRequest): Promise<void> {
  await apiRequest('/v1/history/feedback', {
    method: 'PUT',
    body: {
      source_type: req.sourceType,
      source_id: req.sourceId,
      hint: req.hint,
      note: req.note ?? null,
    },
  })
}

export async function fetchHistoryQuota(): Promise<HistoryQuotaResponse> {
  const raw = await apiRequest<any>('/v1/history/quota')
  return {
    tier: raw.tier,
    perTypeLimit: Number(raw.per_type_limit ?? 0),
    totalLimit: Number(raw.total_limit ?? 0),
    totalUsed: Number(raw.total_used ?? 0),
    usage: Array.isArray(raw.usage)
      ? raw.usage.map((u: any) => ({
          sourceType: u.source_type,
          used: Number(u.used ?? 0),
          limit: Number(u.limit ?? 0),
          warningLevel: u.warning_level,
        }))
      : [],
  }
}

export interface ClearHistoryRequest {
  sourceTypes?: HistorySourceType[]
  q?: string
  dateFrom?: string
  dateTo?: string
  keepPinned: boolean
}

export async function clearHistory(req: ClearHistoryRequest): Promise<{ deletedCount: number }> {
  const raw = await apiRequest<any>('/v1/history/clear', {
    method: 'POST',
    body: {
      source_types: req.sourceTypes,
      q: req.q,
      date_from: req.dateFrom,
      date_to: req.dateTo,
      keep_pinned: req.keepPinned,
    },
  })
  return { deletedCount: Number(raw.deleted_count ?? 0) }
}

