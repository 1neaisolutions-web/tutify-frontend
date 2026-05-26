export type TemplateSort = 'title' | '-title' | 'created' | '-created'

export interface TemplateStandardRef {
  framework_code: string
  standard_code: string
  title: string
}

export interface TemplateResponse {
  id: string
  slug: string
  title: string
  description: string | null
  subject: string
  gradeBand: string
  bloom: string | null
  kind: string | null
  estimatedMinutes?: number | null
  popularity?: number | null
  tags?: string[]
  inputSchema?: Record<string, unknown> | null
  outputSchema?: Record<string, unknown> | null
  promptDefinition?: Record<string, unknown> | null
  exemplarInput?: Record<string, unknown> | null
  exemplarOutput?: Record<string, unknown> | null
  renderSections?: Array<{ key: string; label: string; type?: string }> | null
  canonicalOutcome: string | null
  standards: TemplateStandardRef[]
  is_hot?: boolean
  is_favorite?: boolean
  execution_count?: number
  category?: string | null  // Template category for icon mapping
}

export interface PagedResponse<T> {
  total: number
  page: number
  pageSize: number
  items: T[]
}

export interface FrameworkResponse {
  code: string
  name: string
  jurisdiction?: string | null
  description?: string | null
}

export interface StandardItemResponse {
  code: string
  frameworkCode: string
  title: string
  description?: string | null
  subject: string
  gradeBand: string
  bloom?: string | null
  kind?: string | null
}

export interface EquivalentStandardsResponse {
  canonicalSlug: string
  canonicalTitle: string
  canonicalDescription?: string | null
  sourceStandard: StandardItemResponse
  equivalents: StandardItemResponse[]
}

export interface AlignmentEquivalentResponse {
  frameworkCode: string
  standardCode: string
  title: string
  subject?: string | null
  gradeBand?: string | null
}

export interface AlignmentResponse {
  canonicalSlug: string
  canonicalTitle?: string | null
  canonicalDescription?: string | null
  why: string
  equivalents: AlignmentEquivalentResponse[]
}

export interface TemplateListParams {
  q?: string
  subject?: string
  gradeBand?: string
  bloom?: string
  kind?: string
  framework?: string
  standardCode?: string
  page?: number
  pageSize?: number
  sort?: TemplateSort
  is_hot?: boolean
  is_favorite?: boolean
}

export interface TemplateExecuteRequest {
  data: Record<string, unknown>
}

export interface TemplateExecutionResult {
  preview: string
  data: Record<string, unknown>
  alignment?: AlignmentResponse | null
  professionalOutput?: Record<string, string> | null
}

export interface TemplateExecuteResponse {
  template: TemplateResponse
  result: TemplateExecutionResult
}

// Schema-driven section (from meta.sections)
export interface StreamSectionSchema {
  key: string
  label: string
  type: string
}

// Streaming Event Types
export interface StreamMetaEvent {
  type: 'meta'
  template_slug?: string
  template?: string
  template_name?: string
  timestamp?: number
  sections?: StreamSectionSchema[]
}

export interface StreamContentEvent {
  type: 'content'
  chunk: string
  template_slug: string
}

export interface StreamSectionStartEvent {
  type: 'section_start'
  section: string
  label: string
  template_slug: string
}

export interface StreamSectionContentEvent {
  type: 'section_content'
  section?: string
  chunk?: string
  content?: string
  template_slug?: string
}

export interface StreamSectionEndEvent {
  type: 'section_end'
  section: string
  template_slug?: string
}

export interface StreamDoneEvent {
  type: 'done'
  execution_id?: string | null
  template_slug: string
  output_data?: Record<string, unknown>
  /** When true, content was filled from template exemplar because the LLM failed */
  provider_failed?: boolean
  failure_message?: string
}

export interface StreamErrorEvent {
  type: 'error'
  message: string
  template_slug: string
}

export type StreamEvent =
  | StreamMetaEvent
  | StreamContentEvent
  | StreamSectionStartEvent
  | StreamSectionContentEvent
  | StreamSectionEndEvent
  | StreamDoneEvent
  | StreamErrorEvent

export interface StreamedSection {
  key: string
  label: string
  content: string
  type?: string
}