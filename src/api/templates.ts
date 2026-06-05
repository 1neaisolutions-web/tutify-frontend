import { apiRequest } from './client'
import {
  AlignmentResponse,
  EquivalentStandardsResponse,
  FrameworkResponse,
  PagedResponse,
  StandardItemResponse,
  TemplateExecuteResponse,
  TemplateListParams,
  TemplateResponse,
} from './types'

// Generate or retrieve session ID
function getSessionId(): string {
  let sessionId = localStorage.getItem('session_id')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('session_id', sessionId)
  }
  return sessionId
}

export const fetchTemplates = async (params: TemplateListParams, signal?: AbortSignal): Promise<PagedResponse<TemplateResponse>> => {
  console.log('[fetchTemplates] 🟢 START - Fetching templates from backend')
  
  const emptyResponse: PagedResponse<TemplateResponse> = {
    total: 0,
    page: 1,
    pageSize: 0,
    items: [],
  }
  
  const backendParams: Record<string, string | number | boolean> = {}
  if (params.subject) backendParams.subject = params.subject
  if (params.gradeBand) backendParams.grade_band = params.gradeBand
  if (params.q) backendParams.q = params.q  // Add search query
  if (params.is_hot !== undefined) backendParams.is_hot = params.is_hot  // Add hot filter
  if (params.is_favorite !== undefined) backendParams.is_favorite = params.is_favorite  // Add favorite filter
  
  try {
    console.log('[fetchTemplates] 📍 Calling API: /v1/templates with params:', backendParams)
    
    const sessionId = getSessionId()
    
    const templates = await apiRequest<any[]>(`/v1/templates`, {
      method: 'GET',
      query: backendParams,
      headers: {
        'X-Session-Id': sessionId,  // Add session ID header
      },
      signal,
    }).catch((err) => {
      console.error('[fetchTemplates] ❌ API Request failed:', err)
      console.error('[fetchTemplates] ❌ Error type:', err?.constructor?.name)
      console.error('[fetchTemplates] ❌ Error message:', err?.message)
      throw err
    })
    
    console.log('[fetchTemplates] 📦 Raw response:', templates)
    console.log('[fetchTemplates] 📦 Response type:', typeof templates, 'isArray:', Array.isArray(templates))
    
    if (!Array.isArray(templates)) {
      console.warn('[fetchTemplates] ⚠️ Response is not an array:', typeof templates, templates)
      return emptyResponse
    }
    
    if (templates.length === 0) {
      console.warn('[fetchTemplates] ⚠️ Empty array received from backend')
      return emptyResponse
    }
    
    console.log('[fetchTemplates] 🔄 Processing', templates.length, 'templates')
    
    const items = templates.map((t: any, index: number) => {
      console.log(`[fetchTemplates] Template ${index + 1}:`, {
        id: t.id,
        name: t.name,
        slug: t.slug,
        subject: t.subject_default,
      })
      
      return {
        id: String(t.id || ''),
        slug: t.slug || '',
        title: t.name || '',
        description: t.description || null,
        subject: t.subject_default || '',
        gradeBand: Array.isArray(t.grade_bands_supported) && t.grade_bands_supported.length > 0
          ? t.grade_bands_supported[0]
          : '',
        bloom: null,
        kind: null,
        inputSchema: null,
        canonicalOutcome: null,
        standards: [],
        is_hot: t.is_hot || false,  // Add hot flag
        is_favorite: t.is_favorite || false,  // Add favorite flag
        execution_count: t.execution_count || 0,  // Add execution count
        category: t.category || null,  // Add category for icon mapping
      }
    })
    
    console.log('[fetchTemplates] ✅ SUCCESS - Returning', items.length, 'templates to UI')
    console.log('[fetchTemplates] ✅ First template:', items[0])
    
    return {
      total: items.length,
      page: 1,
      pageSize: items.length,
      items,
    }
  } catch (error: any) {
    console.error('[fetchTemplates] ❌ ERROR:', error?.message || 'Unknown error')
    console.error('[fetchTemplates] ❌ Error details:', error)
    return emptyResponse
  }
}

/** Owner-scoped execution row for History → Open restore (`GET /v1/template-executions/{id}`). */
export interface TemplateExecutionPublic {
  id: string
  template_id: string
  template_slug: string
  template_version?: number | null
  input_data: Record<string, unknown>
  output_data?: Record<string, unknown> | null
  model_used?: string | null
  provider_used?: string | null
  created_at: string
  updated_at: string
}

export const fetchTemplateExecution = (executionId: string, signal?: AbortSignal) =>
  apiRequest<TemplateExecutionPublic>(`v1/template-executions/${executionId}`, {
    method: 'GET',
    signal,
  })

export const fetchTemplateDetail = (slug: string, signal?: AbortSignal) => {
  // Backend endpoint: GET /api/v1/templates/{slug}
  return apiRequest<any>(`/v1/templates/${slug}`, {
    method: 'GET',
    signal,
  }).then((detail) => {
    const promptDefinition = detail.latest_version?.prompt_definition || null
    const exemplarInput = promptDefinition?.exemplar_input || null
    const exemplarOutput = promptDefinition?.exemplar_output || null

    // Transform backend TemplateDetail to frontend TemplateResponse
    return {
      id: String(detail.id),
      slug: detail.slug,
      title: detail.name, // Backend uses 'name', frontend expects 'title'
      description: detail.description,
      subject: detail.subject_default || '',
      gradeBand: Array.isArray(detail.grade_bands_supported) && detail.grade_bands_supported.length > 0
        ? detail.grade_bands_supported[0]
        : '',
      bloom: null,
      kind: null,
      inputSchema: detail.latest_version?.input_schema || null,
      outputSchema: detail.latest_version?.output_schema || null,
      promptDefinition: promptDefinition,
      exemplarInput,
      exemplarOutput,
      renderSections: Array.isArray(detail.render_sections) ? detail.render_sections : null,
      canonicalOutcome: null,
      standards: [],
    } as TemplateResponse
  })
}

export const fetchFrameworks = (signal?: AbortSignal) => {
  return apiRequest<FrameworkResponse[]>('/standards/frameworks', { method: 'GET', signal })
}

export const fetchStandardItems = (
  frameworkCode: string,
  filters?: { subject?: string; grade?: string },
  signal?: AbortSignal,
) => {
  return apiRequest<StandardItemResponse[]>(`/standards/${frameworkCode}/items`, {
    method: 'GET',
    query: {
      subject: filters?.subject,
      grade: filters?.grade,
    },
    signal,
  })
}

export const fetchEquivalentStandards = (standardCode: string, signal?: AbortSignal) => {
  return apiRequest<EquivalentStandardsResponse>(`/standards/equivalents/${standardCode}`, {
    method: 'GET',
    signal,
  })
}

export const alignTemplatesByGoal = (goal: string) => {
  return apiRequest<AlignmentResponse>('/agents/templates/align/by-goal', {
    method: 'POST',
    body: { goal },
  })
}

export const alignTemplatesByCode = (standardCode: string) => {
  return apiRequest<AlignmentResponse>('/agents/templates/align/by-code', {
    method: 'POST',
    body: { standardCode },
  })
}

export const executeTemplate = (slug: string, data: Record<string, unknown>, regenerate: number = 0) => {
  // Backend endpoint: POST /api/v1/templates/{slug}/execute
  return apiRequest<TemplateExecuteResponse>(`/v1/templates/${slug}/execute`, {
    method: 'POST',
    query: { regenerate },
    body: { data },
  })
}

// Favorite functions
// Note: Auth token is automatically included by apiRequest if user is logged in
// Session ID is sent as fallback for unauthenticated users
export const toggleTemplateFavorite = async (templateId: string): Promise<{ is_favorite: boolean; message?: string }> => {
  const sessionId = getSessionId()
  
  return apiRequest<{ is_favorite: boolean; message: string }>(`/v1/templates/${templateId}/favorite/toggle`, {
    method: 'POST',
    headers: {
      'X-Session-Id': sessionId, // Always send session ID as fallback
    },
  })
}

export const addTemplateFavorite = async (templateId: string): Promise<void> => {
  const sessionId = getSessionId()
  
  await apiRequest(`/v1/templates/${templateId}/favorite`, {
    method: 'POST',
    headers: {
      'X-Session-Id': sessionId,
    },
  })
}

export const removeTemplateFavorite = async (templateId: string): Promise<void> => {
  const sessionId = getSessionId()
  
  await apiRequest(`/v1/templates/${templateId}/favorite`, {
    method: 'DELETE',
    headers: {
      'X-Session-Id': sessionId,
    },
  })
}