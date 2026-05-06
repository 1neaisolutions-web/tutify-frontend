import { apiRequest } from './client'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CatalogBookCard {
  id: string
  title: string
  authors: string | null
  publisher: string | null
  subject: string | null
  grade: string | null
  curriculum: string | null
  indexed_sections: number
  document_count: number
  grades: string[]
}

export interface CatalogListResponse {
  total: number
  page: number
  page_size: number
  items: CatalogBookCard[]
}

export interface CatalogListParams {
  subject?: string
  grade?: string
  curriculum?: string
  q?: string
  page?: number
  page_size?: number
}

export interface TopicsResponse {
  topics: Array<{ label: string; count: number }>
  pack_count: number
}

export interface ScopePreviewResponse {
  sources_count: number
  topics_count: number
  estimated_segments: number
  matched_pack_ids: string[]
}

// ---------------------------------------------------------------------------
// Adapter (keeps existing UI backward-compatible)
// ---------------------------------------------------------------------------

export interface AdaptedBook {
  id: string
  title: string
  authors: string
  publisher: string
  indexedSections: number
  documentCount: number
  /** Pack-level subject metadata (for display; quiz subject/grade are separate). */
  subject: string | null
  curriculum: string | null
  grades: string[]
}

export function adaptCatalogBook(card: CatalogBookCard): AdaptedBook {
  return {
    id: card.id,
    title: card.title,
    authors: card.authors ?? '',
    publisher: card.publisher ?? '',
    indexedSections: card.indexed_sections,
    documentCount: card.document_count,
    subject: card.subject ?? null,
    curriculum: card.curriculum ?? null,
    grades: card.grades.length > 0 ? card.grades : card.grade ? [card.grade] : [],
  }
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

/**
 * Fetch a paginated list of catalog books, optionally filtered by subject,
 * grade, curriculum, or free-text query.
 */
export async function fetchCatalog(
  params: CatalogListParams,
  signal?: AbortSignal,
): Promise<CatalogListResponse> {
  // Strip keys whose value is undefined or an empty string so the backend
  // doesn't receive spurious empty query params.
  const query: Record<string, string | number> = {}
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      query[key] = value as string | number
    }
  }

  return apiRequest<CatalogListResponse>('/v1/quiz/catalog', { query, signal })
}

/**
 * Fetch aggregated topic labels for the given content-pack IDs.
 */
export async function fetchTopicsForPacks(
  packIds: string[],
  signal?: AbortSignal,
): Promise<TopicsResponse> {
  return apiRequest<TopicsResponse>('/v1/quiz/catalog/topics', {
    method: 'POST',
    body: { pack_ids: packIds },
    signal,
  })
}

/**
 * Fetch a scope preview (estimated segment count, matched packs, etc.) for
 * the given selection of packs, topics, and optional refinement text.
 */
export async function fetchScopePreview(
  packIds: string[],
  topics: string[],
  refinement: string | undefined,
  signal?: AbortSignal,
): Promise<ScopePreviewResponse> {
  return apiRequest<ScopePreviewResponse>('/v1/quiz/catalog/scope-preview', {
    method: 'POST',
    body: {
      pack_ids: packIds,
      topics,
      ...(refinement ? { refinement } : {}),
    },
    signal,
  })
}
