/**
 * Hook for streaming document processing status via SSE
 */
import { useState, useCallback, useRef, useEffect } from 'react'
import {
  streamDocumentStatus,
  DocumentStatus,
  type StreamDocumentStatusOptions,
} from '../api/contentIngestion'

interface UseDocumentStatusStreamReturn {
  status: DocumentStatus | null
  isStreaming: boolean
  error: string | null
  /** True once HTTP 200 + body; helps distinguish slow TLS from hung stream */
  httpConnected: boolean
  startStream: (documentId: string, options?: DocumentStatusStreamOptions) => void
  stopStream: () => void
  reset: () => void
}

/**
 * Custom hook for handling document status streaming via Server-Sent Events (SSE)
 * 
 * This hook manages the streaming connection, receives status updates,
 * and handles completion and error states.
 */
const MAX_STREAM_RETRIES = 2
const RETRY_DELAY_MS = 2000

export type DocumentStatusStreamOptions = {
  onStatusUpdate?: (status: DocumentStatus) => void
}

export const useDocumentStatusStream = (): UseDocumentStatusStreamReturn => {
  const [status, setStatus] = useState<DocumentStatus | null>(null)
  const [isStreaming, setIsStreaming] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [httpConnected, setHttpConnected] = useState(false)
  
  const cleanupRef = useRef<(() => void) | null>(null)
  const retryCountRef = useRef(0)
  const terminalReceivedRef = useRef(false)
  const streamOptionsRef = useRef<DocumentStatusStreamOptions>({})
  
  const stopStream = useCallback(() => {
    if (cleanupRef.current) {
      cleanupRef.current()
      cleanupRef.current = null
    }
    setIsStreaming(false)
  }, [])
  
  const reset = useCallback(() => {
    stopStream()
    setStatus(null)
    setError(null)
    setHttpConnected(false)
  }, [stopStream])
  
  const startStream = useCallback((documentId: string, options?: DocumentStatusStreamOptions) => {
    reset()
    streamOptionsRef.current = options ?? {}
    terminalReceivedRef.current = false
    setIsStreaming(true)

    const onStatusUpdate = (statusUpdate: DocumentStatus) => {
      retryCountRef.current = 0
      setStatus(statusUpdate)
      setError(null)
      streamOptionsRef.current.onStatusUpdate?.(statusUpdate)
      if (statusUpdate.status === 'published' || statusUpdate.status === 'failed') {
        terminalReceivedRef.current = true
        setIsStreaming(false)
      }
    }

    const onStreamError = (streamError: Error) => {
      // If the document already reached a terminal state, this is a spurious close event — ignore it.
      if (terminalReceivedRef.current) {
        setIsStreaming(false)
        return
      }
      setHttpConnected(false)
      if (retryCountRef.current < MAX_STREAM_RETRIES) {
        retryCountRef.current += 1
        if (cleanupRef.current) {
          cleanupRef.current()
          cleanupRef.current = null
        }
        setTimeout(() => {
          const sseOpts: StreamDocumentStatusOptions = {
            onHttpOk: () => setHttpConnected(true),
          }
          const cleanup = streamDocumentStatus(
            documentId,
            onStatusUpdate,
            onStreamError,
            () => setIsStreaming(false),
            sseOpts
          )
          cleanupRef.current = cleanup
        }, RETRY_DELAY_MS)
      } else {
        retryCountRef.current = 0
        setError(streamError.message)
        setIsStreaming(false)
      }
    }

    const sseOpts: StreamDocumentStatusOptions = {
      onHttpOk: () => setHttpConnected(true),
    }

    const cleanup = streamDocumentStatus(
      documentId,
      onStatusUpdate,
      onStreamError,
      () => setIsStreaming(false),
      sseOpts
    )
    cleanupRef.current = cleanup
  }, [reset])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStream()
    }
  }, [stopStream])
  
  return {
    status,
    isStreaming,
    error,
    httpConnected,
    startStream,
    stopStream,
    reset,
  }
}
