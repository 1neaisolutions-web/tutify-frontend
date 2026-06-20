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
  near_matches?: CatalogBookCard[]
}

export interface CatalogListParams {
  subject?: string
  grade?: string
  curriculum?: string
  q?: string
  strict?: boolean
  include_near_matches?: boolean
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
  per_document?: Array<{
    document_id: string
    document_title: string
    chunk_count: number
    topics_matched: number
  }>
}

export interface TopicNode {
  id: string
  topic_key: string
  display_title: string
  level: number
  chunk_count: number
  start_page?: number | null
  end_page?: number | null
  children: TopicNode[]
}

export interface DocumentStructure {
  document_id: string
  document_title: string
  total_chunks: number
  topic_tree: TopicNode[]
  has_page_bin_fallbacks: boolean
}

export interface PackStructure {
  pack_id: string
  pack_name: string
  subject: string | null
  grade: string | null
  documents: DocumentStructure[]
}

export interface CatalogStructureResponse {
  packs: PackStructure[]
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
  const query: Record<string, string | number | boolean> = {}
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === '') continue
    query[key] = value as string | number | boolean
  }

  return apiRequest<CatalogListResponse>('/v1/quiz/catalog', { query, signal })
}

export async function fetchCatalogStructure(
  packIds: string[],
  signal?: AbortSignal,
): Promise<CatalogStructureResponse> {
  return apiRequest<CatalogStructureResponse>('/v1/quiz/catalog/structure', {
    method: 'POST',
    body: { pack_ids: packIds },
    signal,
  })
}

/**
 * Fetch aggregated topic labels for the given content-pack IDs.
 * @deprecated Prefer fetchCatalogStructure for hierarchical topic trees.
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
  topicIds: string[],
  topics: string[],
  refinement: string | undefined,
  includeSubTopics: boolean,
  signal?: AbortSignal,
): Promise<ScopePreviewResponse> {
  return apiRequest<ScopePreviewResponse>('/v1/quiz/catalog/scope-preview', {
    method: 'POST',
    body: {
      pack_ids: packIds,
      topic_ids: topicIds,
      topics,
      ...(refinement ? { refinement } : {}),
      include_sub_topics: includeSubTopics,
    },
    signal,
  })
}
