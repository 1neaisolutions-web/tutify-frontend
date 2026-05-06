/**
 * Processing Status Card - Real-time status display with progress bar
 */
import React, { useEffect, useRef, useState } from 'react'
import { useDocumentStatusStream } from '../../hooks/useDocumentStatusStream'
import type { DocumentStatus } from '../../api/contentIngestion'
import { StepIndicator } from './StepIndicator'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

interface ProcessingStatusCardProps {
  documentId: string
  onComplete?: () => void
  onError?: (error: string) => void
  /** Fired on each SSE payload; use to sync document header fields (total_pages, etc.) */
  onStreamStatus?: (status: DocumentStatus) => void
}

const PROCESSING_STEPS = [
  { name: 'uploaded', label: 'Uploaded' },
  { name: 'text_extracting', label: 'Extracting Text' },
  { name: 'ocr_running', label: 'Processing OCR (async)' },
  { name: 'normalizing', label: 'Normalizing' },
  { name: 'chunking', label: 'Chunking' },
  { name: 'embedding', label: 'Generating Embeddings' },
  { name: 'indexing', label: 'Indexing' },
  { name: 'qa_validation', label: 'QA Validation' },
  { name: 'published', label: 'Published' },
]

const TERMINAL_STATUSES = new Set(['published', 'failed'])

function formatElapsed(secs: number): string {
  if (secs < 60) return `${secs}s`
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}m ${s}s`
}

export const ProcessingStatusCard = ({
  documentId,
  onComplete,
  onError,
  onStreamStatus,
}: ProcessingStatusCardProps) => {
  const { status, isStreaming, error, httpConnected, startStream, stopStream } =
    useDocumentStatusStream()

  // Stable refs for parent callbacks — prevents the stream from restarting every time
  // the parent renders with a new function reference.
  const onErrorRef = useRef(onError)
  onErrorRef.current = onError
  const onStreamStatusRef = useRef(onStreamStatus)
  onStreamStatusRef.current = onStreamStatus

  // Elapsed-time counter: resets when the pipeline step changes
  const [elapsedSecs, setElapsedSecs] = useState(0)
  const stepStartRef = useRef<number | null>(null)
  const prevStepRef = useRef<string | null>(null)

  useEffect(() => {
    const currentStep = status?.status
    if (!currentStep || TERMINAL_STATUSES.has(currentStep)) {
      setElapsedSecs(0)
      stepStartRef.current = null
      return
    }
    if (currentStep !== prevStepRef.current) {
      prevStepRef.current = currentStep
      stepStartRef.current = Date.now()
      setElapsedSecs(0)
    }
    const interval = setInterval(() => {
      if (stepStartRef.current !== null) {
        setElapsedSecs(Math.floor((Date.now() - stepStartRef.current) / 1000))
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [status?.status])

  // Start / stop the SSE stream — only re-runs when documentId / stable callbacks change.
  // onStreamStatus / onError are intentionally NOT in deps; their current values are read
  // via refs at call time so parent re-renders don't restart the stream.
  useEffect(() => {
    if (!documentId) return
    startStream(documentId, {
      onStatusUpdate: (s) => onStreamStatusRef.current?.(s),
    })
    return () => stopStream()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId, startStream, stopStream])

  // Notify parent when processing reaches terminal states
  useEffect(() => {
    if (!status) return
    if (status.status === 'published') {
      onComplete?.()
    } else if (status.status === 'failed') {
      onErrorRef.current?.(status.error_message || 'Processing failed')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status?.status, onComplete])

  if (!status && !error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-700 font-medium">
              {httpConnected
                ? 'Connected — waiting for first status update…'
                : 'Connecting to status stream…'}
            </span>
          </div>
          <p className="text-xs text-gray-500 text-center max-w-md px-4">
            If this stays on &quot;Connecting&quot;, the browser never reached your API (wrong URL, CORS, or
            backend down). If it says &quot;Connected&quot; but never updates, open DevTools → Network →
            find <code className="bg-gray-100 px-1 rounded">status/stream</code> and confirm{' '}
            <code className="bg-gray-100 px-1 rounded">VITE_USE_LOCAL</code> /{' '}
            <code className="bg-gray-100 px-1 rounded">VITE_API_BASE_URL</code> point at your FastAPI host.
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start space-x-3 text-red-600">
          <XCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold">Connection Error</p>
            <p className="text-sm text-gray-600 mt-1">{error}</p>
            <p className="text-sm text-gray-500 mt-2">
              The backend may still be starting up. Click Retry, or check DevTools → Network for details.
            </p>
            <button
              type="button"
              onClick={() =>
                startStream(documentId, { onStatusUpdate: (s) => onStreamStatusRef.current?.(s) })
              }
              className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentStatus = status?.status || 'uploaded'
  const progress = status?.progress

  const isExtractionPhase =
    currentStatus === 'text_extracting' || currentStatus === 'ocr_running'
  const isVectorPhase =
    currentStatus === 'embedding' ||
    currentStatus === 'indexing' ||
    currentStatus === 'qa_validation'

  // Show page counter once we know total_pages (even before first page is read)
  const totalPages = status?.total_pages ?? 0
  const pagesRead = status?.pages_processed ?? 0
  const showExtractionPages = isExtractionPhase && totalPages > 0

  // Show chunk/vector counter for later pipeline stages
  const showVectorCounts =
    isVectorPhase && progress && progress.total > 0 && progress.completed > 0

  // Friendly active-step label (derive from raw status name if no progress.step)
  const activeStepLabel =
    progress?.step ||
    currentStatus.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())

  const steps = PROCESSING_STEPS.map((step) => {
    const stepIndex = PROCESSING_STEPS.findIndex((s) => s.name === step.name)
    const currentIndex = PROCESSING_STEPS.findIndex((s) => s.name === currentStatus)

    let stepStatus: 'pending' | 'in_progress' | 'completed' | 'failed' = 'pending'
    if (currentStatus === 'failed' && stepIndex <= currentIndex) {
      stepStatus = 'failed'
    } else if (stepIndex < currentIndex) {
      stepStatus = 'completed'
    } else if (stepIndex === currentIndex) {
      stepStatus = 'in_progress'
    }

    return { ...step, status: stepStatus }
  })

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Status</h3>

        {status?.status === 'published' ? (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Document Published Successfully!</span>
          </div>
        ) : status?.status === 'failed' ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-900">Processing Failed</p>
                {status.error_message && (
                  <p className="text-sm text-red-700 mt-1">{status.error_message}</p>
                )}
                {status.remediation_hint && (
                  <p className="text-sm text-red-600 mt-2">
                    <strong>Hint:</strong> {status.remediation_hint}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-blue-600 flex-wrap">
            <Loader2 className="w-5 h-5 animate-spin flex-shrink-0" />
            <span className="font-medium">{activeStepLabel}</span>
            {elapsedSecs > 0 && (
              <span className="text-xs text-gray-400 font-normal">
                ({formatElapsed(elapsedSecs)})
              </span>
            )}
          </div>
        )}
      </div>

      {progress && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-600">{progress.percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, progress.percentage))}%` }}
            />
          </div>

          {/* Extraction page counter — shows as soon as the backend knows total_pages */}
          {showExtractionPages ? (
            <div className="mt-1.5 text-xs text-gray-600 font-medium">
              {pagesRead === 0 ? (
                <span>
                  Opening PDF — <strong>{totalPages}</strong> pages detected, reading now…
                </span>
              ) : (
                <span>
                  Pages read: <strong>{pagesRead}</strong> / <strong>{totalPages}</strong>
                  {elapsedSecs >= 15 && pagesRead < totalPages && (
                    <span className="text-gray-400 font-normal ml-1">
                      — large books take several minutes, still running
                    </span>
                  )}
                </span>
              )}
            </div>
          ) : showVectorCounts ? (
            <p className="text-xs text-gray-600 mt-1.5 font-medium">
              {currentStatus === 'indexing'
                ? `Vectors stored: ${progress.completed} / ${progress.total}`
                : `Chunks: ${progress.completed} / ${progress.total}`}
            </p>
          ) : null}
        </div>
      )}

      <StepIndicator steps={steps} currentStep={currentStatus} />
    </div>
  )
}
