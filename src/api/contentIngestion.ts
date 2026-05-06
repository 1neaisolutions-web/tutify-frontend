/**
 * Content Ingestion API client
 */
import { apiRequest, buildUrl, getAuthToken, ApiError } from './client'
import { API_BASE_URL } from '../config/api'

export interface ContentPack {
  id: string
  name: string
  description: string | null
  subject: string | null
  grade: string | null
  curriculum: string | null
  metadata: Record<string, any> | null
  is_active: boolean
  created_at: string
  updated_at: string
  document_count?: number
}

export interface ContentPackCreate {
  name: string
  description?: string | null
  subject?: string | null
  grade?: string | null
  curriculum?: string | null
  metadata?: Record<string, any> | null
}

export interface Document {
  id: string
  pack_id: string
  filename: string
  file_path: string
  file_size: number | null
  mime_type: string | null
  source_type: string
  status: string
  error_code: string | null
  error_message: string | null
  remediation_hint: string | null
  processing_metadata: Record<string, any> | null
  chapter_map: Array<{
    id: string
    title: string
    level: number
    parent_id: string | null
    start_page_pdf: number
    end_page_pdf: number
    keywords: string[]
  }> | null
  title: string | null
  author: string | null
  total_pages: number | null
  document_hash: string | null
  version_label: string | null
  created_at: string
  updated_at: string
  processed_at: string | null
}

export interface DocumentUploadRequest {
  pack_id?: string  // Optional - if not provided, will create pack
  file: File
  title?: string
  author?: string
  chapter_map?: Array<{
    id: string
    title: string
    level: number
    parent_id: string | null
    start_page_pdf: number
    end_page_pdf: number
    keywords: string[]
  }>
  force_ocr?: boolean
  // Pack creation fields (used when pack_id is not provided)
  pack_name?: string
  pack_description?: string
  pack_subject?: string
  pack_grade?: string
  pack_curriculum?: string
}

export interface UploadProgressEvent {
  type: 'progress' | 'success' | 'error'
  step?: string
  message: string
  percentage?: number
  document_id?: string
  pack_id?: string
}

export interface DocumentStatus {
  document_id: string
  status: string
  progress: {
    step: string
    completed: number
    total: number
    percentage: number
    estimated_time_remaining?: string
    /** Echo from backend; page phases mirror completed/total */
    pages_processed?: number
    total_pages?: number
  } | null
  steps_completed: string[]
  current_step: string | null
  error_code: string | null
  error_message: string | null
  remediation_hint: string | null
  /** Denormalized from stream for header refresh */
  total_pages?: number | null
  pages_processed?: number | null
}

export interface WorksheetQuestion {
  id: string
  type: 'mcq' | 'short_answer' | 'long_answer'
  question: string
  options?: string[] // For MCQ: ["A) option1", "B) option2", ...]
  correct_answer: string // For MCQ: "A" | "B" | "C" | "D", for short_answer: answer text
  explanation?: string
  points: number
  difficulty: 'easy' | 'medium' | 'hard'
  math_content: boolean // true if question contains LaTeX math
}

export interface Citation {
  chunk_id: string
  document_id: string
  page_range: string // e.g., "73-84" or "73"
}

export interface Worksheet {
  id: string
  pack_id: string
  topic_id?: string
  topic_text?: string
  grade?: string
  subject?: string
  questions: WorksheetQuestion[]
  answer_key: Record<string, string> // { [questionId]: answer }
  marking_scheme: Record<string, {
    points: number
    criteria: string
  }>
  citations?: Citation[]
  created_at: string
  
  // Optional metadata
  chapter_page_range?: string // e.g., "73-84"
  relevance_avg_sim?: number // 0.0-1.0 relevance score
  relevance_keyword_hits?: number // Keyword match count
  
  // Difficulty metadata (only if difficulty was requested)
  final_difficulty_used?: 'easy' | 'medium' | 'hard'
  attempts_count?: number
  attempts?: number // Alias for attempts_count
  
  // Debug fields (only if X-Debug: 1 header sent)
  validator_report_per_attempt?: string[]
  validator_reports?: string[] // Alias
  warnings?: string[]
}

export interface WorksheetGenerateRequest {
  pack_id: string
  topic_id?: string
  topic_text?: string
  grade?: string
  subject?: string
  
  // Difficulty - use ONE of the following:
  difficulty?: 'easy' | 'medium' | 'hard' // Single difficulty (100% this level)
  difficulty_mix?: { // OR: Difficulty distribution (must sum to 1.0)
    easy?: number
    medium?: number
    hard?: number
  }
  
  num_questions?: number // Default: 10, Range: 1-20
  question_types?: string[] // Default: ["mcq", "short_answer"], Options: "mcq", "short_answer", "long_answer"
  
  force_regenerate?: boolean // Default: false - Skip cache, generate fresh
  skip_cache_write?: boolean // Default: false - Don't save to cache
  regenerate_key?: string // Optional: Key to avoid duplicate questions
}

export interface WorksheetGenerateResponse extends Worksheet {
  // Response includes headers that we'll capture separately
  _cacheStatus?: 'hit' | 'miss' // From X-Worksheet-Cache header
  _requestId?: string // From X-Request-Id header
}

// Content Pack API
export async function fetchContentPacks(params?: {
  skip?: number
  limit?: number
  is_active?: boolean
}): Promise<ContentPack[]> {
  return apiRequest<ContentPack[]>('v1/admin/content-packs', {
    query: params,
  })
}

export async function createContentPack(data: ContentPackCreate): Promise<ContentPack> {
  return apiRequest<ContentPack>('v1/admin/content-packs', {
    method: 'POST',
    body: data,
  })
}

export async function getContentPack(packId: string): Promise<ContentPack> {
  return apiRequest<ContentPack>(`v1/admin/content-packs/${packId}`)
}

export async function updateContentPack(packId: string, data: ContentPackCreate): Promise<ContentPack> {
  return apiRequest<ContentPack>(`v1/admin/content-packs/${packId}`, {
    method: 'PUT',
    body: data,
  })
}

export async function deleteContentPack(packId: string): Promise<void> {
  return apiRequest<void>(`v1/admin/content-packs/${packId}`, {
    method: 'DELETE',
  })
}

// Document API - Streaming upload with progress
export async function uploadDocumentStream(
  data: DocumentUploadRequest,
  onProgress: (event: UploadProgressEvent) => void
): Promise<{ document_id: string; pack_id: string }> {
  const formData = new FormData()
  
  // Pack fields
  if (data.pack_id) {
    formData.append('pack_id', data.pack_id)
  } else {
    // Create new pack
    if (data.pack_name) formData.append('pack_name', data.pack_name)
    if (data.pack_description) formData.append('pack_description', data.pack_description)
    if (data.pack_subject) formData.append('pack_subject', data.pack_subject)
    if (data.pack_grade) formData.append('pack_grade', data.pack_grade)
    if (data.pack_curriculum) formData.append('pack_curriculum', data.pack_curriculum)
  }
  
  // Document fields
  formData.append('file', data.file)
  if (data.title) formData.append('title', data.title)
  if (data.author) formData.append('author', data.author)
  if (data.chapter_map) {
    formData.append('chapter_map', JSON.stringify(data.chapter_map))
  }
  if (data.force_ocr) {
    formData.append('force_ocr', 'true')
  }
  
  const url = buildUrl('v1/admin/documents/upload-stream')
  const token = getAuthToken()
  
  // Add timeout for upload (large textbooks can take longer to start streaming)
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    controller.abort()
  }, 15 * 60 * 1000) // 15 minutes
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }))
      throw new Error(error.detail || `Upload failed: ${response.statusText}`)
    }
    
    // Read streaming response
    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    
    if (!reader) {
      throw new Error('Response body is not readable')
    }
    
    let result: { document_id: string; pack_id: string } | null = null
    let lastActivityTime = Date.now()
    const STREAM_TIMEOUT = 5 * 60 * 1000 // 5 minutes for stream inactivity
    
    while (true) {
      // Check for stream timeout
      if (Date.now() - lastActivityTime > STREAM_TIMEOUT) {
        throw new Error('Upload stream timed out - no activity for 60 seconds')
      }
      
      const { done, value } = await reader.read()
      if (done) break
      
      lastActivityTime = Date.now() // Update activity time
      
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''  // Keep incomplete line in buffer
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const event: UploadProgressEvent = JSON.parse(line.slice(6))
            onProgress(event)
            
            if (event.type === 'success') {
              result = {
                document_id: event.document_id!,
                pack_id: event.pack_id!,
              }
            } else if (event.type === 'error') {
              throw new Error(event.message)
            }
          } catch (e) {
            console.error('Error parsing SSE event:', e)
            // Don't break on parse errors, continue reading
          }
        }
      }
    }
    
    if (!result) {
      throw new Error('Upload completed but no result received')
    }
    
    return result
  } catch (error: any) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      throw new Error('Upload request timed out after 15 minutes')
    }
    throw error
  }
}

// Legacy non-streaming upload (kept for backward compatibility)
export async function uploadDocument(data: DocumentUploadRequest): Promise<Document> {
  const formData = new FormData()
  if (data.pack_id) {
    formData.append('pack_id', data.pack_id)
  }
  formData.append('file', data.file)
  
  if (data.title) formData.append('title', data.title)
  if (data.author) formData.append('author', data.author)
  if (data.chapter_map) {
    formData.append('chapter_map', JSON.stringify(data.chapter_map))
  }
  if (data.force_ocr) {
    formData.append('force_ocr', 'true')
  }
  
  const url = buildUrl('v1/admin/documents')
  
  const token = getAuthToken()
  const headers: HeadersInit = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }))
    throw new Error(error.detail || `Upload failed: ${response.statusText}`)
  }
  
  return response.json()
}

export async function fetchDocuments(params?: {
  pack_id?: string
  status?: string
  skip?: number
  limit?: number
}): Promise<Document[]> {
  return apiRequest<Document[]>('v1/admin/documents', {
    query: params,
  })
}

export async function getDocument(documentId: string): Promise<Document> {
  return apiRequest<Document>(`v1/admin/documents/${documentId}`)
}

export async function deleteDocument(documentId: string): Promise<void> {
  return apiRequest<void>(`v1/admin/documents/${documentId}`, {
    method: 'DELETE',
  })
}

export async function retryDocumentProcessing(documentId: string): Promise<Document> {
  return apiRequest<Document>(`v1/admin/documents/${documentId}/retry`, {
    method: 'POST',
  })
}

export async function runQAValidation(documentId: string): Promise<any> {
  return apiRequest(`v1/admin/documents/${documentId}/qa/run`, {
    method: 'POST',
  })
}

export async function publishDocument(
  documentId: string,
  override_qa?: boolean,
  override_reason?: string
): Promise<Document> {
  return apiRequest<Document>(`v1/admin/documents/${documentId}/publish`, {
    method: 'POST',
    body: {
      override_qa,
      override_reason,
    },
  })
}

/** Optional callbacks for document status SSE (fetch + stream lifecycle). */
export type StreamDocumentStatusOptions = {
  /** HTTP 200 received with a readable body */
  onHttpOk?: () => void
  /** First `data:` JSON payload parsed successfully */
  onFirstPayload?: () => void
}

const SSE_FETCH_TIMEOUT_MS = 45_000
const SSE_STALL_AFTER_MS = 180_000

// SSE Status Stream (using fetch with ReadableStream for custom headers)
export function streamDocumentStatus(
  documentId: string,
  onStatusUpdate: (status: DocumentStatus) => void,
  onError?: (error: Error) => void,
  onComplete?: () => void,
  streamOptions?: StreamDocumentStatusOptions
): () => void {
  const url = buildUrl(`v1/admin/documents/${documentId}/status/stream`)
  
  const token = getAuthToken()
  const headers: HeadersInit = {
    Accept: 'text/event-stream',
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  
  const abortController = new AbortController()
  let buffer = ''
  let isClosed = false
  let firstPayloadSeen = false
  
  const processStream = async () => {
    let stallTimer: ReturnType<typeof setInterval> | null = null
    let lastActivity = Date.now()
    try {
      const fetchTimer = setTimeout(() => {
        abortController.abort()
      }, SSE_FETCH_TIMEOUT_MS)

      const response = await fetch(url, {
        method: 'GET',
        headers,
        signal: abortController.signal,
      })
      clearTimeout(fetchTimer)
      lastActivity = Date.now()

      if (!response.ok) {
        let detail = response.statusText
        try {
          const t = await response.text()
          if (t) detail = `${detail}: ${t.slice(0, 200)}`
        } catch {
          /* ignore */
        }
        throw new Error(`SSE stream failed (${response.status}): ${detail}`)
      }

      const ct = response.headers.get('content-type') || ''
      if (ct && !/event-stream/i.test(ct)) {
        console.warn('[streamDocumentStatus] Content-Type is not text/event-stream:', ct)
      }

      if (!response.body) {
        throw new Error('No response body received')
      }

      streamOptions?.onHttpOk?.()

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      stallTimer = setInterval(() => {
        if (isClosed) return
        if (Date.now() - lastActivity > SSE_STALL_AFTER_MS) {
          abortController.abort()
          if (onError && !isClosed) {
            onError(
              new Error(
                'Status stream stalled (no data for several minutes). Check network, API URL (VITE_API_BASE_URL / VITE_USE_LOCAL), and backend logs.'
              )
            )
          }
        }
      }, 10_000)

      while (true) {
        if (isClosed) break

        const { done, value } = await reader.read()
        lastActivity = Date.now()

        if (done) {
          if (!isClosed && onComplete) onComplete()
          break
        }

        buffer += decoder.decode(value, { stream: true })

        if (!firstPayloadSeen && buffer.length > 400 && /<!DOCTYPE|<html[\s>]/i.test(buffer)) {
          throw new Error(
            'Received HTML instead of an event stream. The API URL may point at the frontend or a proxy without /api. Set VITE_USE_LOCAL=true or VITE_API_BASE_URL to your FastAPI origin.'
          )
        }

        const lines = buffer.split(/\r?\n/)
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || trimmed.startsWith(':')) {
            continue
          }
          const dataMatch = trimmed.match(/^data:\s*(.*)$/i)
          if (!dataMatch) {
            continue
          }
          const jsonStr = dataMatch[1].trim()
          if (!jsonStr) continue
          try {
            const raw = JSON.parse(jsonStr) as Record<string, unknown>
            if (raw.type === 'heartbeat') {
              continue
            }
            const pRaw =
              raw.progress != null && typeof raw.progress === 'object'
                ? (raw.progress as Record<string, unknown>)
                : null
            const progress = pRaw
              ? {
                  step: String(pRaw.step ?? raw.current_step ?? raw.status ?? ''),
                  completed: Number(pRaw.completed ?? 0),
                  total: Number(pRaw.total ?? 0),
                  percentage: Number(pRaw.percentage ?? 0),
                  estimated_time_remaining: pRaw.estimated_time_remaining as string | undefined,
                  pages_processed:
                    pRaw.pages_processed != null ? Number(pRaw.pages_processed) : undefined,
                  total_pages: pRaw.total_pages != null ? Number(pRaw.total_pages) : undefined,
                }
              : null
            const status: DocumentStatus = {
              document_id: String(raw.document_id ?? ''),
              status: String(raw.status ?? 'uploaded'),
              progress,
              steps_completed: Array.isArray(raw.steps_completed) ? raw.steps_completed as string[] : [],
              current_step: raw.current_step != null ? String(raw.current_step) : null,
              error_code: raw.error_code != null ? String(raw.error_code) : null,
              error_message: raw.error_message != null ? String(raw.error_message) : null,
              remediation_hint: raw.remediation_hint != null ? String(raw.remediation_hint) : null,
              total_pages: raw.total_pages != null ? Number(raw.total_pages) : null,
              pages_processed: raw.pages_processed != null ? Number(raw.pages_processed) : null,
            }
            if (!firstPayloadSeen) {
              firstPayloadSeen = true
              streamOptions?.onFirstPayload?.()
            }
            onStatusUpdate(status)
            if (status.status === 'published' || status.status === 'failed') {
              if (onComplete) onComplete()
              isClosed = true
              return
            }
          } catch (error) {
            console.error('Error parsing status update:', error)
            if (onError) onError(error as Error)
          }
        }
      }
    } catch (error: unknown) {
      if (isClosed) return
      const err = error as { name?: string; message?: string }
      if (err.name === 'AbortError') {
        if (!firstPayloadSeen && onError) {
          onError(
            new Error(
              'Timed out waiting for the status stream (no response in time). Confirm the backend is running, CORS allows your origin, and VITE_API_BASE_URL / VITE_USE_LOCAL points at FastAPI (not the Vite dev page).'
            )
          )
        }
        return
      }
      console.error('SSE stream error:', error)
      if (onError) {
        onError(error instanceof Error ? error : new Error(String(error)))
      }
    } finally {
      if (stallTimer) clearInterval(stallTimer)
    }
  }
  
  processStream()
  
  return () => {
    isClosed = true
    abortController.abort()
  }
}

// Worksheet API
export interface WorksheetGenerateOptions {
  timeout?: number // Default: 120000 (120 seconds)
  debug?: boolean // Include X-Debug: 1 header
  signal?: AbortSignal // For request cancellation
}

export async function generateWorksheet(
  data: WorksheetGenerateRequest,
  options?: WorksheetGenerateOptions
): Promise<WorksheetGenerateResponse> {
  const timeout = options?.timeout ?? 120000 // 120 seconds default (backend timeout is 180s)
  
  // Build headers for custom headers (like X-Debug)
  const customHeaders: Record<string, string> = {}
  if (options?.debug) {
    customHeaders['X-Debug'] = '1'
  }
  
  try {
    // Use apiRequest which handles authentication, token refresh, and error handling
    // We need to intercept the response to extract headers, so we'll use a custom fetch approach
    // but with proper auth handling from client.ts
    
    // Get auth token using the exported function from client.ts
    const token = getAuthToken()
    
    if (!token) {
      console.error('[generateWorksheet] ❌ No auth token found! User must be logged in.')
      throw new Error('Authentication required. Please log in to generate worksheets.')
    }
    
    // Build headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...customHeaders,
    }
    
    // Create AbortController for timeout handling
    // If signal is provided, use it; otherwise create a new controller
    const controller = options?.signal ? null : new AbortController()
    const signal = options?.signal || controller!.signal
    const timeoutId = timeout > 0 && controller ? setTimeout(() => controller.abort(), timeout) : null
    
    try {
      // buildUrl uses API_BASE_URL which already includes /api
      // So 'v1/worksheets/generate' becomes: http://127.0.0.1:8000/api/v1/worksheets/generate
      const url = buildUrl('v1/worksheets/generate')
      
      // Verify URL construction
      // API_BASE_URL from config/api.ts is the base URL without /api
      // buildUrl in client.ts uses API_URL which includes /api
      // So the final URL should be: http://127.0.0.1:8000/api/v1/worksheets/generate
      console.log('[generateWorksheet] 🔍 URL Debug:', {
        API_BASE_URL_from_config: API_BASE_URL,
        built_url: url,
        expected_pattern: 'http://127.0.0.1:8000/api/v1/worksheets/generate'
      })
      
      // Log request details for debugging
      console.log('[generateWorksheet] 🔵 Request URL:', url)
      console.log('[generateWorksheet] 🔵 Request headers:', { ...headers, Authorization: token ? 'Bearer ***' : 'None' })
      console.log('[generateWorksheet] 🔵 Request body:', JSON.stringify(data, null, 2))
      console.log('[generateWorksheet] 🔵 Has auth token:', !!token)
      
      let response: Response
      try {
        // Use fetch with explicit CORS mode
      // Don't use credentials: 'include' as it can cause CORS issues
      // We're sending the token in Authorization header, so credentials aren't needed
        response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(data),
          signal: signal,
          mode: 'cors', // Explicitly set CORS mode
          // credentials: 'omit' is default, which is fine since we use Authorization header
        })
      } catch (fetchError: any) {
        // Enhanced error handling for "Failed to fetch"
        console.error('[generateWorksheet] ❌ Fetch error:', fetchError)
        console.error('[generateWorksheet] ❌ Error name:', fetchError.name)
        console.error('[generateWorksheet] ❌ Error message:', fetchError.message)
        
        if (fetchError.name === 'AbortError') {
          throw new Error('Generation timed out. Please try again with fewer questions.')
        }
        
        // Check for network errors
        if (fetchError.message?.includes('Failed to fetch') || 
            fetchError.message?.includes('NetworkError') ||
            fetchError.message?.includes('Network request failed') ||
            fetchError.name === 'TypeError') {
          
          // This is typically a CORS preflight failure
          const errorMsg = `Network error: Unable to connect to backend.

This is usually a CORS (Cross-Origin Resource Sharing) issue.

Troubleshooting steps:
1. ✅ Backend is running (verified: http://127.0.0.1:8000/health)
2. ❌ Check browser console (F12) → Network tab → Look for OPTIONS request
3. ❌ If OPTIONS request fails → CORS preflight is blocked
4. ❌ Check backend CORS configuration allows: http://localhost:5173

Current URL: ${url}
Backend: http://127.0.0.1:8000
Frontend: http://localhost:5173

Quick fix: Make sure backend ENVIRONMENT=dev (allows all origins)`
          throw new Error(errorMsg)
        }
        
        throw fetchError
      }
      
      console.log('[generateWorksheet] 📥 Response status:', response.status, response.statusText)
      
      if (timeoutId) clearTimeout(timeoutId)
      
      // Extract headers
      const cacheStatus = response.headers.get('X-Worksheet-Cache') as 'hit' | 'miss' | null
      const requestId = response.headers.get('X-Request-Id')
      
      if (!response.ok) {
        let errorMessage = 'Failed to generate worksheet'
        let errorDetail: any = null
        
        try {
          const errorData = await response.json()
          errorMessage = errorData.detail?.message || errorData.detail || errorMessage
          errorDetail = errorData.detail
        } catch {
          // If response is not JSON, try to get text
          try {
            const text = await response.text()
            errorMessage = text || response.statusText || errorMessage
          } catch {
            errorMessage = response.statusText || errorMessage
          }
        }
        
        console.error('[generateWorksheet] ❌ Request failed:', {
          status: response.status,
          statusText: response.statusText,
          errorMessage,
          errorDetail
        })
        
        // Handle specific error codes
        if (response.status === 500) {
          // Internal Server Error - backend issue
          console.error('[generateWorksheet] ❌ 500 Internal Server Error - Backend issue!')
          throw new Error(`Backend error (500): ${errorMessage || 'Internal server error. Check backend logs for details.'}`)
        } else if (response.status === 422) {
          // Topic not found or validation failed
          throw new Error(errorMessage || 'Topic not found in this content pack. Please try a different topic.')
        } else if (response.status === 504) {
          // Gateway timeout
          throw new Error(errorMessage || 'Generation timed out. Please try again with fewer questions.')
        } else if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.')
        } else if (response.status === 403) {
          throw new Error('Access denied. Please check your permissions.')
        } else if (response.status === 404) {
          throw new Error('Worksheet or content pack not found.')
        } else if (response.status === 400) {
          throw new Error(errorMessage || 'Invalid request parameters.')
        } else if (response.status === 402) {
          const msg =
            typeof errorDetail === 'object' && errorDetail !== null && 'message' in errorDetail
              ? String((errorDetail as { message?: string }).message)
              : errorMessage
          throw new ApiError(402, msg, { detail: errorDetail })
        }
        
        throw new Error(`Error ${response.status}: ${errorMessage}`)
      }
      
      const worksheet = await response.json() as Worksheet
      
      // Attach metadata from headers
      return {
        ...worksheet,
        _cacheStatus: cacheStatus || undefined,
        _requestId: requestId || undefined,
      }
    } catch (error: any) {
      if (timeoutId) clearTimeout(timeoutId)
      
      if (error.name === 'AbortError') {
        throw new Error('Generation timed out. Please try again with fewer questions.')
      }
      
      throw error
    }
  } catch (error: any) {
    // Re-throw with better error messages
    if (error.message) {
      throw error
    }
    throw new Error('Failed to generate worksheet. Please try again.')
  }
}


export async function getWorksheet(worksheetId: string): Promise<Worksheet> {
  return apiRequest<Worksheet>(`v1/worksheets/${worksheetId}`)
}
