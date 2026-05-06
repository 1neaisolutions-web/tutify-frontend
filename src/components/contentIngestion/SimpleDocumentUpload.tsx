/**
 * Simple Document Upload Component with Streaming Progress
 * Single form for pack metadata + file upload with real-time progress
 */
import React, { useState } from 'react'
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { uploadDocumentStream, UploadProgressEvent } from '../../api/contentIngestion'
import { TocJsonOptionalSection } from './TocJsonOptionalSection'
import { parseChapterMapFromJson } from './tocChapterMapParse'
import { useSnackbar } from '../../hooks/useSnackbar'
import { useNavigate } from 'react-router-dom'

interface SimpleDocumentUploadProps {
  existingPackId?: string
  onSuccess?: (documentId: string, packId: string) => void
  onCancel?: () => void
}

export const SimpleDocumentUpload = ({
  existingPackId,
  onSuccess,
  onCancel,
}: SimpleDocumentUploadProps) => {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  
  // Pack fields (only shown if no existingPackId)
  const [packName, setPackName] = useState('')
  const [packDescription, setPackDescription] = useState('')
  const [packSubject, setPackSubject] = useState('')
  const [packGrade, setPackGrade] = useState('')
  const [packCurriculum, setPackCurriculum] = useState('')
  
  const [tocJsonText, setTocJsonText] = useState('')
  const [forceOcr, setForceOcr] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState<UploadProgressEvent | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useSnackbar()
  const navigate = useNavigate()
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }
  
  const handleProgress = (event: UploadProgressEvent) => {
    setProgress(event)
    
    if (event.type === 'error') {
      setError(event.message)
      setUploading(false)
      toast.error(event.message)
    } else if (event.type === 'success') {
      setUploading(false)
      toast.success('Document uploaded successfully! Processing started...')
      if (onSuccess && event.document_id && event.pack_id) {
        onSuccess(event.document_id, event.pack_id)
      }
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!existingPackId && !packName) {
      setError('Pack name is required')
      return
    }
    
    if (!file) {
      setError('Please select a file')
      return
    }

    const tocParsed = parseChapterMapFromJson(tocJsonText)
    if (!tocParsed.ok) {
      setError(tocParsed.message)
      return
    }
    const chapterMap = tocParsed.empty ? undefined : tocParsed.chapters

    setUploading(true)
    setError(null)
    setProgress({ type: 'progress', step: 'starting', message: 'Starting upload...', percentage: 0 })
    
    try {
      const result = await uploadDocumentStream(
        {
          pack_id: existingPackId,
          pack_name: existingPackId ? undefined : packName,
          pack_description: existingPackId ? undefined : packDescription,
          pack_subject: existingPackId ? undefined : packSubject,
          pack_grade: existingPackId ? undefined : packGrade,
          pack_curriculum: existingPackId ? undefined : packCurriculum,
          file,
          title: title || undefined,
          author: author || undefined,
          chapter_map: chapterMap,
          force_ocr: forceOcr,
        },
        handleProgress
      )
      
      // Success handled in handleProgress
    } catch (err: any) {
      setError(err.message || 'Upload failed')
      setUploading(false)
      toast.error(err.message || 'Upload failed')
    }
  }
  
  const getStepIcon = (step?: string) => {
    if (progress?.type === 'error') return <AlertCircle className="w-5 h-5 text-red-600" />
    if (progress?.type === 'success') return <CheckCircle className="w-5 h-5 text-green-600" />
    if (uploading) return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
    return null
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Pack Metadata (only if creating new pack) */}
      {!existingPackId && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-4">Content Pack Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pack Name *
              </label>
              <input
                type="text"
                value={packName}
                onChange={(e) => setPackName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Grade 10 Mathematics"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={packDescription}
                onChange={(e) => setPackDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows={2}
                placeholder="Brief description of the content pack"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={packSubject}
                  onChange={(e) => setPackSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Mathematics"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade
                </label>
                <input
                  type="text"
                  value={packGrade}
                  onChange={(e) => setPackGrade(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Grade 10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Curriculum
              </label>
              <input
                type="text"
                value={packCurriculum}
                onChange={(e) => setPackCurriculum(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Cambridge, IB, CCSS"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Document File *
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors">
          <div className="space-y-1 text-center w-full">
            {file ? (
              <div className="flex items-center justify-center space-x-2">
                <FileText className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-600">{file.name}</span>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-red-600 hover:text-red-700"
                  disabled={uploading}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 justify-center">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept=".pdf,.docx,.jpg,.jpeg,.png,.tiff"
                      disabled={uploading}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF, DOCX, or images up to 50MB</p>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Document Metadata */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Document Title (optional)
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Document title"
          disabled={uploading}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Author (optional)
        </label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Author name"
          disabled={uploading}
        />
      </div>

      <TocJsonOptionalSection value={tocJsonText} onChange={setTocJsonText} disabled={uploading} />
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="force_ocr"
          checked={forceOcr}
          onChange={(e) => setForceOcr(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          disabled={uploading}
        />
        <label htmlFor="force_ocr" className="ml-2 block text-sm text-gray-700">
          Force OCR (even for digital PDFs)
        </label>
      </div>
      
      {/* Progress Indicator */}
      {uploading && progress && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-2">
            {getStepIcon(progress.step)}
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{progress.message}</p>
              {progress.percentage !== undefined && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{progress.percentage}%</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      {/* Success Message */}
      {progress?.type === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <p className="text-sm text-green-600">{progress.message}</p>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={uploading}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={uploading || !file || (!existingPackId && !packName)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span>Upload Document</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}
