/**
 * Document Details Page
 */
import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, RefreshCw, CheckCircle, AlertTriangle, Layers } from 'lucide-react'
import {
  getDocument,
  retryDocumentProcessing,
  runQAValidation,
  publishDocument,
  Document,
  type DocumentStatus,
} from '../../api/contentIngestion'
import { ProcessingStatusCard } from '../../components/contentIngestion/ProcessingStatusCard'
import { QAValidationResults } from '../../components/contentIngestion/QAValidationResults'
import { useSnackbar } from '../../hooks/useSnackbar'

type ChunkingSummary = {
  chunks_total?: number
  chunk_size_tokens?: number
  chunk_overlap_tokens?: number
  chunk_profile?: string
  topic_scope_mode?: string
  primary_topic_label?: string
  chunks_topic_fallback_filled?: number
  catalog_toc_source?: string
}

function describeTopicScopeMode(mode: string | undefined): string {
  switch (mode) {
    case 'chapter_map':
      return 'Chapter map / PDF outline (table of contents)'
    case 'chapter_map_plus_page_bins':
      return 'TOC / outline + page windows for any gaps'
    case 'pdf_outline_only':
      return 'PDF bookmarks (outline) only'
    case 'pdf_outline_plus_page_bins':
      return 'PDF outline + page windows for gaps'
    case 'page_bins_only':
      return 'Page windows (no outline in PDF — strands by page range)'
    default:
      return mode ? String(mode) : '—'
  }
}

function humanizeChunkProfile(profile: string | undefined): string {
  if (!profile) return '—'
  if (profile === 'digital_profile') return 'Digital PDF (native text)'
  if (profile === 'ocr_profile') return 'Scanned / OCR pipeline'
  if (profile === 'ocr_profile_rechunk') return 'Scanned / OCR — finer chunks for coverage'
  return profile.replace(/_/g, ' ')
}

/** Same set as backend POST .../retry — lets user recover stuck pipelines (e.g. hung PDF open). */
const RETRYABLE_STATUSES = new Set([
  'failed',
])

export const DocumentDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [document, setDocument] = useState<Document | null>(null)
  const [qaResults, setQAResults] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const { toast } = useSnackbar()
  
  useEffect(() => {
    if (id) {
      loadDocument()
    }
  }, [id])
  
  const loadDocument = async () => {
    if (!id) return
    
    try {
      setLoading(true)
      const data = await getDocument(id)
      setDocument(data)
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to load document'
      toast.error(errorMessage)
      console.error('Error loading document:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStreamStatus = useCallback((s: DocumentStatus) => {
    setDocument((prev) => {
      if (!prev) return prev
      const rawTop = s.total_pages != null && !Number.isNaN(s.total_pages) ? s.total_pages : null
      const fromProgressTotal =
        s.progress != null &&
        typeof s.progress.total === 'number' &&
        s.progress.total > 0
          ? s.progress.total
          : null
      const fromProgressTp =
        s.progress != null &&
        s.progress.total_pages != null &&
        !Number.isNaN(s.progress.total_pages) &&
        s.progress.total_pages > 0
          ? s.progress.total_pages
          : null
      const tp = rawTop ?? fromProgressTotal ?? fromProgressTp ?? prev.total_pages
      return {
        ...prev,
        status: s.status,
        total_pages: tp,
      }
    })
  }, [])
  
  const handleRetry = async () => {
    if (!id) return
    
    try {
      setActionLoading(true)
      await retryDocumentProcessing(id)
      toast.success('Processing restarted from the beginning')
      loadDocument()
    } catch (error: any) {
      toast.error(error.message || 'Failed to retry processing')
    } finally {
      setActionLoading(false)
    }
  }
  
  const handleRunQA = async () => {
    if (!id) return
    
    try {
      setActionLoading(true)
      const results = await runQAValidation(id)
      setQAResults(results)
      toast.success('QA validation completed')
      loadDocument()
    } catch (error: any) {
      toast.error(error.message || 'Failed to run QA validation')
    } finally {
      setActionLoading(false)
    }
  }
  
  const handlePublish = async () => {
    if (!id) return
    
    try {
      setActionLoading(true)
      await publishDocument(id, false)
      toast.success('Document published successfully')
      loadDocument()
    } catch (error: any) {
      toast.error(error.message || 'Failed to publish document')
    } finally {
      setActionLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  if (!document) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-600">Document not found</p>
        </div>
      </div>
    )
  }
  
  const isProcessing = !['published', 'failed'].includes(document.status)
  const canPublish = document.status === 'qa_validation' || document.status === 'published'
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/admin/documents')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Documents</span>
        </button>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{document.filename}</h1>
              {document.title && (
                <p className="text-gray-600 mt-1">{document.title}</p>
              )}
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              document.status === 'published'
                ? 'bg-green-100 text-green-800'
                : document.status === 'failed'
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {document.status.replace('_', ' ').toUpperCase()}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">File Size:</span>{' '}
              <span className="font-medium">
                {document.file_size ? `${(document.file_size / 1024 / 1024).toFixed(2)} MB` : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Pages:</span>{' '}
              <span className="font-medium">{document.total_pages || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-600">Uploaded:</span>{' '}
              <span className="font-medium">
                {new Date(document.created_at).toLocaleString()}
              </span>
            </div>
            {document.processed_at && (
              <div>
                <span className="text-gray-600">Processed:</span>{' '}
                <span className="font-medium">
                  {new Date(document.processed_at).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {(() => {
            const cs = document.processing_metadata?.chunking_summary as ChunkingSummary | undefined
            if (!cs || (cs.chunks_total == null && !cs.chunk_profile)) return null
            return (
              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/80 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Layers className="h-4 w-4 text-indigo-600 shrink-0" aria-hidden />
                  Indexing snapshot
                </div>
                <p className="mt-1 text-xs text-slate-600">
                  Same pipeline for any textbook or board: chunk sizes adapt to digital vs scanned PDFs; topic
                  strands fall back to the document title when no chapter map is provided.
                </p>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  {cs.chunks_total != null && (
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Chunks stored</dt>
                      <dd className="font-semibold text-slate-900">{cs.chunks_total.toLocaleString()}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Chunking profile</dt>
                    <dd className="font-semibold text-slate-900">{humanizeChunkProfile(cs.chunk_profile)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Target size / overlap</dt>
                    <dd className="font-semibold text-slate-900">
                      {cs.chunk_size_tokens != null ? `${cs.chunk_size_tokens} tok` : '—'}
                      {cs.chunk_overlap_tokens != null ? ` · ${cs.chunk_overlap_tokens} tok overlap` : ''}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Topic strands</dt>
                    <dd className="font-semibold text-slate-900">{describeTopicScopeMode(cs.topic_scope_mode)}</dd>
                  </div>
                  {cs.catalog_toc_source ? (
                    <div className="sm:col-span-2">
                      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">TOC source</dt>
                      <dd className="mt-0.5 text-xs font-medium text-slate-700">
                        {cs.catalog_toc_source === 'pdf_outline_auto'
                          ? 'PDF bookmarks (outline)'
                          : cs.catalog_toc_source === 'docx_headings_auto'
                            ? 'Word Heading 1 sections'
                            : cs.catalog_toc_source === 'client_json'
                              ? 'Uploaded TOC (JSON)'
                              : cs.catalog_toc_source}
                      </dd>
                    </div>
                  ) : null}
                  {cs.primary_topic_label ? (
                    <div className="sm:col-span-2">
                      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Default strand label</dt>
                      <dd className="mt-0.5 font-medium text-slate-800">{cs.primary_topic_label}</dd>
                    </div>
                  ) : null}
                  {typeof cs.chunks_topic_fallback_filled === 'number' && cs.chunks_topic_fallback_filled > 0 ? (
                    <div className="sm:col-span-2 text-xs text-slate-600">
                      Auto-labeled {cs.chunks_topic_fallback_filled.toLocaleString()} chunk
                      {cs.chunks_topic_fallback_filled === 1 ? '' : 's'} without TOC mapping.
                    </div>
                  ) : null}
                </dl>
                {document.chapter_map && document.chapter_map.length > 0 ? (
                  <p className="mt-3 text-xs text-slate-600">
                    Chapter map: {document.chapter_map.length}{' '}
                    {document.chapter_map.length === 1 ? 'entry' : 'entries'} (used when page ranges match).
                  </p>
                ) : null}
              </div>
            )
          })()}
        </div>
        
        {isProcessing && (
          <div className="mb-6">
            <ProcessingStatusCard
              documentId={document.id}
              onComplete={loadDocument}
              onStreamStatus={handleStreamStatus}
              onError={(error) => {
                toast.error(`Processing error: ${error}`)
                loadDocument()
              }}
            />
          </div>
        )}
        
        {document.status === 'failed' && (
          <div
            className={`bg-white rounded-lg shadow p-6 mb-6 ${
              document.status === 'failed' ? '' : 'border border-amber-200 bg-amber-50/40'
            }`}
          >
            <div className="flex items-start space-x-3">
              <AlertTriangle
                className={`w-6 h-6 flex-shrink-0 ${
                  document.status === 'failed' ? 'text-red-600' : 'text-amber-600'
                }`}
              />
              <div className="flex-1">
                {document.status === 'failed' ? (
                  <>
                    <h3 className="font-semibold text-red-900 mb-2">Processing Failed</h3>
                    {document.error_message && (
                      <p className="text-red-700 mb-2">{document.error_message}</p>
                    )}
                    {document.remediation_hint && (
                      <p className="text-sm text-red-600 mb-4">
                        <strong>Hint:</strong> {document.remediation_hint}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <h3 className="font-semibold text-amber-900 mb-2">Processing stuck or very slow?</h3>
                    <p className="text-sm text-amber-900/90 mb-4">
                      If the step above has not moved for many minutes, restart from the beginning. Partial
                      progress for this document will be cleared and ingestion will run again.
                    </p>
                  </>
                )}
                <button
                  type="button"
                  onClick={handleRetry}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  <RefreshCw className="w-4 h-4 inline mr-2" />
                  Retry processing
                </button>
              </div>
            </div>
          </div>
        )}
        
        {document.status === 'qa_validation' && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">QA Validation</h3>
              <div className="space-x-3">
                <button
                  onClick={handleRunQA}
                  disabled={actionLoading}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Run QA
                </button>
                {qaResults && qaResults.qa_status === 'passed' && (
                  <button
                    onClick={handlePublish}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4 inline mr-2" />
                    Publish
                  </button>
                )}
              </div>
            </div>
            {qaResults && <QAValidationResults qaResults={qaResults} />}
          </div>
        )}
        
        {document.status === 'published' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-2 text-green-600 mb-4">
              <CheckCircle className="w-6 h-6" />
              <h3 className="text-lg font-semibold">Document Published</h3>
            </div>
            <p className="text-gray-600">
              This document is in your catalog for worksheets, quizzes, and other tools that retrieve from indexed
              chunks. Any board or language is supported as long as text extraction succeeded.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
