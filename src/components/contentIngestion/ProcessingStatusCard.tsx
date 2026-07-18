/**
 * Processing Status Card - Real-time status display with progress bar
 */
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDocumentStatusStream } from '../../hooks/useDocumentStatusStream'
import type { DocumentStatus } from '../../api/contentIngestion'
import { StepIndicator } from './StepIndicator'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

interface ProcessingStatusCardProps {
  documentId: string
  onComplete?: () => void
  onError?: (error: string) => void
  onStreamStatus?: (status: DocumentStatus) => void
}

const STEP_NAME_TO_KEY: Record<string, string> = {
  uploaded: 'uploaded',
  text_extracting: 'textExtracting',
  ocr_running: 'ocrRunning',
  normalizing: 'normalizing',
  chunking: 'chunking',
  embedding: 'embedding',
  indexing: 'indexing',
  qa_validation: 'qaValidation',
  published: 'published',
}

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
  const { t } = useTranslation()

  const processingSteps = useMemo(
    () =>
      Object.entries(STEP_NAME_TO_KEY).map(([name, key]) => ({
        name,
        label: t(`content.processing.steps.${key}`),
      })),
    [t]
  )

  const { status, error, httpConnected, startStream, stopStream } =
    useDocumentStatusStream()

  const onErrorRef = useRef(onError)
  onErrorRef.current = onError
  const onStreamStatusRef = useRef(onStreamStatus)
  onStreamStatusRef.current = onStreamStatus

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

  useEffect(() => {
    if (!documentId) return
    startStream(documentId, {
      onStatusUpdate: (s) => onStreamStatusRef.current?.(s),
    })
    return () => stopStream()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId, startStream, stopStream])

  useEffect(() => {
    if (!status) return
    if (status.status === 'published') {
      onComplete?.()
    } else if (status.status === 'failed') {
      onErrorRef.current?.(status.error_message || t('content.processing.failed.defaultMessage'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status?.status, onComplete, t])

  if (!status && !error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-700 font-medium">
              {httpConnected
                ? t('content.processing.connecting.connected')
                : t('content.processing.connecting.pending')}
            </span>
          </div>
          <p className="text-xs text-gray-500 text-center max-w-md px-4">
            {t('content.processing.connecting.help')}
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
            <p className="font-semibold">{t('content.processing.error.title')}</p>
            <p className="text-sm text-gray-600 mt-1">{error}</p>
            <p className="text-sm text-gray-500 mt-2">
              {t('content.processing.error.help')}
            </p>
            <button
              type="button"
              onClick={() =>
                startStream(documentId, { onStatusUpdate: (s) => onStreamStatusRef.current?.(s) })
              }
              className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              {t('common.retry')}
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

  const totalPages = status?.total_pages ?? 0
  const pagesRead = status?.pages_processed ?? 0
  const showExtractionPages = isExtractionPhase && totalPages > 0

  const showVectorCounts =
    isVectorPhase && progress && progress.total > 0 && progress.completed > 0

  const stepKey = STEP_NAME_TO_KEY[currentStatus]
  const activeStepLabel =
    progress?.step ||
    (stepKey ? t(`content.processing.steps.${stepKey}`) : currentStatus.replace(/_/g, ' '))

  const steps = processingSteps.map((step) => {
    const stepIndex = processingSteps.findIndex((s) => s.name === step.name)
    const currentIndex = processingSteps.findIndex((s) => s.name === currentStatus)

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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('content.processing.title')}</h3>

        {status?.status === 'published' ? (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">{t('content.processing.published')}</span>
          </div>
        ) : status?.status === 'failed' ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-900">{t('content.processing.failed.title')}</p>
                {status.error_message && (
                  <p className="text-sm text-red-700 mt-1">{status.error_message}</p>
                )}
                {status.remediation_hint && (
                  <p className="text-sm text-red-600 mt-2">
                    <strong>{t('content.processing.failed.hintLabel')}</strong> {status.remediation_hint}
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
            <span className="text-sm font-medium text-gray-700">{t('content.processing.progress.label')}</span>
            <span className="text-sm text-gray-600">{progress.percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, progress.percentage))}%` }}
            />
          </div>

          {showExtractionPages ? (
            <div className="mt-1.5 text-xs text-gray-600 font-medium">
              {pagesRead === 0 ? (
                <span>
                  {t('content.processing.pages.opening', { totalPages })}
                </span>
              ) : (
                <span>
                  {t('content.processing.pages.read', { read: pagesRead, total: totalPages })}
                  {elapsedSecs >= 15 && pagesRead < totalPages && (
                    <span className="text-gray-400 font-normal ml-1">
                      {t('content.processing.pages.slowHint')}
                    </span>
                  )}
                </span>
              )}
            </div>
          ) : showVectorCounts ? (
            <p className="text-xs text-gray-600 mt-1.5 font-medium">
              {currentStatus === 'indexing'
                ? t('content.processing.vectors.stored', {
                    completed: progress.completed,
                    total: progress.total,
                  })
                : t('content.processing.chunks.count', {
                    completed: progress.completed,
                    total: progress.total,
                  })}
            </p>
          ) : null}
        </div>
      )}

      <StepIndicator steps={steps} currentStep={currentStatus} />
    </div>
  )
}
