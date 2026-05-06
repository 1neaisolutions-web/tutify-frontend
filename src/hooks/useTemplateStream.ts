import { useState, useCallback, useRef, useEffect } from 'react'
import { flushSync } from 'react-dom'
import { useSelector } from 'react-redux'
import { StreamEvent, StreamedSection } from '../api/types'
import { API_URL } from '../config/api'
import { parseInsufficientCreditsFrom402Body } from '../utils/creditErrors'

/** Populated when POST execute-stream returns 402 before SSE opens */
export interface TemplateInsufficientCredits {
  reason?: string
  balance?: number
  required?: number
  message?: string
}

export interface StreamSectionSchema {
  key: string
  label: string
  type: string
}

export interface TemplateStreamOptions {
  /** Used when the stream cannot start or returns an error: show exemplar output */
  exemplarOutput?: Record<string, unknown> | null
  outputSchema?: Record<string, unknown> | null
  /** Invoked when the stream ends with `done` and the run was not a provider failure (credits charged server-side). */
  onSuccessfulCompletion?: () => void
}

interface UseTemplateStreamReturn {
  content: string
  formattedContent: string
  sections: StreamedSection[]
  sectionsSchema: StreamSectionSchema[]
  isStreaming: boolean
  completedSectionKeys: string[]
  error: string | null
  executionId: string | null
  /** Set when the LLM failed and exemplar output was shown (server or client fallback) */
  providerFailedNotice: string | null
  /** Set when the stream cannot start due to insufficient credits (HTTP 402). */
  insufficientCredits: TemplateInsufficientCredits | null
  startStream: (slug: string, data: Record<string, any>, options?: TemplateStreamOptions) => void
  stopStream: () => void
  reset: () => void
}

function exemplarValueToPlainText(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) {
    const allStrings = value.every((x) => typeof x === 'string')
    if (allStrings) return (value as string[]).map((s) => `- ${s}`).join('\n')
    return value.map((item) => (typeof item === 'string' ? `- ${item}` : `- ${JSON.stringify(item)}`)).join('\n\n')
  }
  if (typeof value === 'object') return JSON.stringify(value, null, 2)
  return String(value)
}

/**
 * Custom hook for handling template execution streaming via Server-Sent Events (SSE).
 *
 * Manages the streaming connection, accumulates chunks, and handles meta / section / done / error events.
 */


export const useTemplateStream = (): UseTemplateStreamReturn => {
  const [content, setContent] = useState<string>('')
  const [formattedContent, setFormattedContent] = useState<string>('')
  const [sections, setSections] = useState<StreamedSection[]>([])
  const [sectionsSchema, setSectionsSchema] = useState<StreamSectionSchema[]>([])
  const [isStreaming, setIsStreaming] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [executionId, setExecutionId] = useState<string | null>(null)
  const [providerFailedNotice, setProviderFailedNotice] = useState<string | null>(null)
  const [insufficientCredits, setInsufficientCredits] = useState<TemplateInsufficientCredits | null>(null)
  const authToken = useSelector((state: any) => state?.auth?.user?.token ?? null)

  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const streamOptionsRef = useRef<TemplateStreamOptions | null>(null)
  const formattedContentRef = useRef<string>('')
  const accumulatedContentRef = useRef<string>('')
  const inputDataRef = useRef<Record<string, any>>({})
  const previousFormattedRef = useRef<string>('')
  const sectionsRef = useRef<StreamedSection[]>([])
  const sectionsSchemaRef = useRef<StreamSectionSchema[]>([])
  const sectionMapRef = useRef<Record<string, number>>({})
  const completedSectionKeysRef = useRef<Set<string>>(new Set())
  const [completedSectionKeys, setCompletedSectionKeys] = useState<string[]>([])

  const stopStream = useCallback(() => {
    // Close the reader if it exists
    if (readerRef.current) {
      readerRef.current.cancel().catch(() => {
        // Ignore cancellation errors
      })
      readerRef.current = null
    }
    
    // Abort the fetch request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    
    setIsStreaming(false)
  }, [])

  const reset = useCallback(() => {
    stopStream()
    setContent('')
    setFormattedContent('')
    setSections([])
    setSectionsSchema([])
    completedSectionKeysRef.current = new Set()
    setCompletedSectionKeys([])
    formattedContentRef.current = ''
    previousFormattedRef.current = ''
    accumulatedContentRef.current = ''
    sectionsRef.current = []
    sectionsSchemaRef.current = []
    sectionMapRef.current = {}
    setError(null)
    setExecutionId(null)
    setProviderFailedNotice(null)
    setInsufficientCredits(null)
  }, [stopStream])

  const applyExemplarFallback = useCallback((failureMessage: string): boolean => {
    const opts = streamOptionsRef.current
    const ex = opts?.exemplarOutput
    if (!ex || typeof ex !== 'object' || Object.keys(ex).length === 0) {
      setError(failureMessage)
      setIsStreaming(false)
      return false
    }
    const properties = ((opts?.outputSchema as { properties?: Record<string, { title?: string }> })?.properties ||
      {}) as Record<string, { title?: string }>
    const keys = Object.keys(ex)
    const schema: StreamSectionSchema[] = keys.map((key) => ({
      key,
      label:
        properties[key]?.title ||
        key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      type: 'markdown',
    }))
    sectionsSchemaRef.current = schema
    flushSync(() => setSectionsSchema(schema))
    const nextSections: StreamedSection[] = keys.map((key) => ({
      key,
      label:
        properties[key]?.title ||
        key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      content: exemplarValueToPlainText((ex as Record<string, unknown>)[key]),
      type: 'markdown',
    }))
    sectionsRef.current = nextSections
    sectionMapRef.current = {}
    keys.forEach((k, i) => {
      sectionMapRef.current[k] = i
    })
    completedSectionKeysRef.current = new Set(keys)
    flushSync(() => {
      setSections(nextSections)
      setCompletedSectionKeys([...keys])
    })
    const fullText = nextSections
      .map((s) => (s.label ? `## ${s.label}\n\n${s.content || ''}` : s.content || ''))
      .join('\n\n')
    formattedContentRef.current = fullText
    flushSync(() => {
      setFormattedContent(fullText)
      setContent(fullText)
    })
    setError(null)
    setProviderFailedNotice(
      failureMessage.trim() ||
        'The AI provider could not complete this request. Below is the exemplar output from this template.',
    )
    setIsStreaming(false)
    return true
  }, [])

  const startStream = useCallback((slug: string, data: Record<string, any>, options?: TemplateStreamOptions) => {
    // Store input data for standards extraction BEFORE reset
    inputDataRef.current = data
    streamOptionsRef.current = options ?? null

    // Reset state
    reset()
    setIsStreaming(true)

    // Create abort controller for this request
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    // Build URL using centralized config
    const API_BASE_URL = API_URL.replace(/\/$/, '')
    const url = `${API_BASE_URL}/v1/templates/${slug}/execute-stream`

    // Start fetch request (include auth so backend can associate execution with user)
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    }
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`
    }
    fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ data }),
      signal: abortController.signal,
    })
      .then((response) => {
        if (!response.ok) {
          // Try to parse error response
          return response.text().then((errorText) => {
            const status = response.status
            if (status === 402) {
              const parsed = parseInsufficientCreditsFrom402Body(errorText)
              if (parsed) {
                setInsufficientCredits(parsed)
                setError(null)
                setIsStreaming(false)
                return
              }
              setInsufficientCredits({
                message: 'You do not have enough credits to run this template.',
              })
              setError(null)
              setIsStreaming(false)
              return
            }
            let errorMessage = `Stream failed: ${response.statusText}`
            try {
              const errorJson = JSON.parse(errorText)
              if (errorJson.detail) {
                if (typeof errorJson.detail === 'string') {
                  errorMessage = errorJson.detail
                } else if (errorJson.detail.message) {
                  errorMessage = errorJson.detail.message
                } else if (errorJson.detail.missing) {
                  errorMessage = `Missing required fields: ${errorJson.detail.missing.join(', ')}`
                } else if (Array.isArray(errorJson.detail)) {
                  // FastAPI 422: [{ loc, msg, type }, ...]
                  const parts = errorJson.detail.map(
                    (e: { msg?: string; loc?: unknown[] }) =>
                      (e && e.msg) || JSON.stringify(e),
                  )
                  errorMessage = parts.length ? parts.join('; ') : errorMessage
                }
              }
            } catch {
              errorMessage = errorText || errorMessage
            }
            // Validation, auth, not-found: show the real error — do NOT replace with static exemplar
            if (status >= 400 && status < 500) {
              setError(errorMessage)
              setIsStreaming(false)
              return
            }
            // 5xx / gateway: allow exemplar only as a last-resort preview when the template provides one
            if (applyExemplarFallback(`Provider error: ${errorMessage}`)) {
              return
            }
            throw new Error(errorMessage)
          })
        }

        if (!response.body) {
          if (applyExemplarFallback('No response body received from the AI provider.')) {
            return
          }
          throw new Error('No response body received')
        }

        // Get reader from response stream
        const reader = response.body.getReader()
        readerRef.current = reader
        const decoder = new TextDecoder()
        let buffer = ''

        // Read stream
        const readStream = (): Promise<void> => {
          return reader.read().then(({ done, value }) => {
            if (done) {
              setIsStreaming(false)
              return
            }

            // Decode chunk and add to buffer
            buffer += decoder.decode(value, { stream: true })
            
            // Process complete lines (SSE format: "data: {...}\n\n")
            const lines = buffer.split('\n')
            buffer = lines.pop() || '' // Keep incomplete line in buffer

            for (const line of lines) {
              const trimmedLine = line.trimEnd().replace(/\r$/, '') // Normalize CRLF / trailing \r
              if (trimmedLine.startsWith('data: ')) {
                let event: StreamEvent | null = null
                try {
                  const jsonStr = trimmedLine.slice(6).trim() // Remove 'data: ' prefix
                  event = JSON.parse(jsonStr)
                } catch (parseError) {
                  // CRITICAL: Don't stop on parse errors - just log and continue (like Activity line 446-448)
                  console.warn('Error parsing SSE event (continuing):', parseError, 'Line:', line.substring(0, 100))
                  // Continue to next line - don't break the stream
                  continue
                }

                if (!event) {
                  console.warn('Event is null after parsing')
                  continue
                }
                
                try {
                  switch (event.type) {
                    case 'meta':
                      if (event.sections && Array.isArray(event.sections)) {
                        const schema = event.sections
                        sectionsSchemaRef.current = schema
                        flushSync(() => setSectionsSchema(schema))
                      }
                      break

                    case 'section_start':
                      setIsStreaming(true)
                      if ('section' in event && 'label' in event) {
                        const schema = sectionsSchemaRef.current.find((s) => s.key === event.section)
                        const type = schema?.type || 'markdown'
                        const arr = sectionsRef.current
                        const existingIdx = arr.findIndex((s) => s.key === event.section)
                        const next =
                          existingIdx >= 0
                            ? arr.map((s, i) => (i === existingIdx ? { ...s, label: event.label } : s))
                            : [...arr, { key: event.section, label: event.label, content: '', type }]
                        sectionsRef.current = next
                        sectionMapRef.current[event.section] = existingIdx >= 0 ? existingIdx : next.length - 1
                        flushSync(() => setSections(next))
                      }
                      break

                    case 'section_content': {
                      let chunk = (event.chunk ?? event.content) as string | undefined
                      if (typeof chunk !== 'string') break
                      chunk = chunk.replace(/\[\[SECTION:[^\]]*\]\]/g, '')
                      if (!chunk) break
                      const sectionKey = event.section
                      const arr = sectionsRef.current
                      let idx = -1
                      if (sectionKey !== undefined && sectionKey !== null) {
                        idx = sectionMapRef.current[sectionKey] ?? arr.findIndex((s) => s.key === sectionKey)
                        if (idx < 0 && sectionsSchemaRef.current.length > 0) {
                          const schemaEntry = sectionsSchemaRef.current.find((s) => s.key === sectionKey)
                          if (schemaEntry) {
                            const newSec = { key: sectionKey, label: schemaEntry.label, content: chunk, type: schemaEntry.type || 'markdown' }
                            const next = [...arr, newSec]
                            sectionsRef.current = next
                            sectionMapRef.current[sectionKey] = next.length - 1
                            flushSync(() => setSections(next))
                            break
                          }
                          if (arr.length > 0) idx = arr.length - 1
                        }
                      }
                      if (idx < 0 && arr.length > 0) idx = arr.length - 1
                      if (idx >= 0 && idx < arr.length) {
                        const sec = arr[idx]
                        const isPlaceholder = (sec.content || '').trim() === 'Content unavailable.'
                        const newContent = isPlaceholder ? chunk : sec.content + chunk
                        const next = [...arr.slice(0, idx), { ...sec, content: newContent }, ...arr.slice(idx + 1)]
                        sectionsRef.current = next
                        if (sectionKey != null) sectionMapRef.current[sectionKey] = idx
                        flushSync(() => setSections(next))
                      }
                      break
                    }

                    case 'section_end': {
                      const key = event.section
                      if (key && !completedSectionKeysRef.current.has(key)) {
                        completedSectionKeysRef.current.add(key)
                        flushSync(() => setCompletedSectionKeys(Array.from(completedSectionKeysRef.current)))
                      }
                      break
                    }

                    case 'content':
                      setIsStreaming(true)
                      const newChunk = event.chunk
                      if (newChunk && typeof newChunk === 'string') {
                        accumulatedContentRef.current += newChunk
                        formattedContentRef.current = accumulatedContentRef.current
                        flushSync(() => {
                          setFormattedContent(accumulatedContentRef.current)
                          setContent(accumulatedContentRef.current)
                        })
                      }
                      break

                    case 'done': {
                      const doneEv = event as {
                        execution_id?: string | null
                        output_data?: Record<string, unknown>
                        provider_failed?: boolean
                        failure_message?: string
                      }
                      if (doneEv.provider_failed) {
                        setProviderFailedNotice(
                          typeof doneEv.failure_message === 'string' && doneEv.failure_message.trim()
                            ? doneEv.failure_message
                            : 'The AI provider could not complete this request. Below is the exemplar output from this template.',
                        )
                        setError(null)
                      } else {
                        setProviderFailedNotice(null)
                        try {
                          streamOptionsRef.current?.onSuccessfulCompletion?.()
                        } catch {
                          // optional callback
                        }
                      }
                      sectionsRef.current.forEach((sec) => completedSectionKeysRef.current.add(sec.key))
                      flushSync(() => setCompletedSectionKeys(Array.from(completedSectionKeysRef.current)))
                      const outputData = doneEv.output_data ?? event.output_data
                      if (outputData && typeof outputData === 'object' && sectionsRef.current.length > 0) {
                        const next = sectionsRef.current.map((sec) => {
                          const val = outputData[sec.key]
                          const text = typeof val === 'string' ? val.replace(/\[\[SECTION:[^\]]*\]\]/g, '') : sec.content
                          return { ...sec, content: text || sec.content }
                        })
                        sectionsRef.current = next
                        flushSync(() => setSections(next))
                      }
                      if (sectionsRef.current.length > 0) {
                        const fullText = sectionsRef.current
                          .map((s) => (s.label ? `## ${s.label}\n\n${(s.content || '').replace(/\[\[SECTION:[^\]]*\]\]/g, '')}` : (s.content || '').replace(/\[\[SECTION:[^\]]*\]\]/g, '')))
                          .join('\n\n')
                        formattedContentRef.current = fullText
                        setFormattedContent(fullText)
                        setContent(fullText)
                      } else if (accumulatedContentRef.current) {
                        const cleaned = accumulatedContentRef.current.replace(/\[\[SECTION:[^\]]*\]\]/g, '')
                        formattedContentRef.current = cleaned
                        setFormattedContent(cleaned)
                        setContent(cleaned)
                      }
                      setIsStreaming(false)
                      if (doneEv.execution_id) setExecutionId(doneEv.execution_id)
                      break
                    }

                    case 'error':
                      console.error('Stream error event:', event)
                      if (
                        applyExemplarFallback(event.message || 'Stream error occurred')
                      ) {
                        break
                      }
                      setError(event.message || 'Stream error occurred')
                      setIsStreaming(false)
                      break

                    default:
                      console.warn('Unknown event type:', (event as any).type)
                      break
                  }
                } catch (eventError) {
                  // CRITICAL: Never stop streaming on errors - always continue (like Activity/GPT)
                  // Log error but continue processing next chunks
                  console.warn('Error processing event (continuing):', eventError)
                  // Continue to next line - don't break the stream
                }
              }
            }
            
            // CRITICAL: Always continue reading next chunk, even if there were errors
            // This ensures streaming never stops, even on parse/extraction errors
            // Activity uses while(true) - we use recursive readStream() calls
            readStream().catch(err => {
              console.error('Error in readStream (continuing):', err)
              // Even on error, try to continue - don't stop streaming
              setIsStreaming(false)
            })
            return
          }).catch((err) => {
            // Handle read errors
            if (err.name === 'AbortError') {
              // Request was aborted, this is expected
              setIsStreaming(false)
              return
            }
            if (!applyExemplarFallback(err.message || 'Error reading stream')) {
              setError(err.message || 'Error reading stream')
              setIsStreaming(false)
            }
          })
        }

        // Start reading
        return readStream()
      })
      .catch((err) => {
        // Handle fetch errors
        if (err.name === 'AbortError') {
          // Request was aborted, this is expected
          setIsStreaming(false)
          return
        }
        if (!applyExemplarFallback(err.message || 'Failed to start stream')) {
          setError(err.message || 'Failed to start stream')
          setIsStreaming(false)
        }
      })
  }, [reset, authToken, applyExemplarFallback])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStream()
    }
  }, [stopStream])

  return {
    content,
    formattedContent,
    sections,
    sectionsSchema,
    isStreaming,
    completedSectionKeys,
    error,
    executionId,
    providerFailedNotice,
    insufficientCredits,
    startStream,
    stopStream,
    reset,
  }
}

