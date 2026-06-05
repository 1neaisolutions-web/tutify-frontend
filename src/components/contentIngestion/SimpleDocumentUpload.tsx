/**
 * Simple Document Upload Component with Streaming Progress
 */
import React, { useState } from 'react'
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { uploadDocumentStream, UploadProgressEvent } from '../../api/contentIngestion'
import { TocJsonOptionalSection } from './TocJsonOptionalSection'
import { parseChapterMapFromJson } from './tocChapterMapParse'
import { useSnackbar } from '../../hooks/useSnackbar'

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
  const { t } = useTranslation()
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
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
      toast.success(t('content.upload.success'))
      if (onSuccess && event.document_id && event.pack_id) {
        onSuccess(event.document_id, event.pack_id)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!existingPackId && !packName) {
      setError(t('content.upload.validation.packNameRequired'))
      return
    }

    if (!file) {
      setError(t('content.upload.validation.selectFile'))
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
    setProgress({ type: 'progress', step: 'starting', message: t('content.upload.progress.starting'), percentage: 0 })

    try {
      await uploadDocumentStream(
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
    } catch (err: any) {
      const msg = err.message || t('content.upload.validation.failed')
      setError(msg)
      setUploading(false)
      toast.error(msg)
    }
  }

  const getStepIcon = () => {
    if (progress?.type === 'error') return <AlertCircle className="w-5 h-5 text-red-600" />
    if (progress?.type === 'success') return <CheckCircle className="w-5 h-5 text-green-600" />
    if (uploading) return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
    return null
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!existingPackId && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-4">{t('content.upload.pack.sectionTitle')}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('content.upload.pack.name')} *
              </label>
              <input
                type="text"
                value={packName}
                onChange={(e) => setPackName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('content.upload.pack.placeholders.name')}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('content.upload.pack.description')}
              </label>
              <textarea
                value={packDescription}
                onChange={(e) => setPackDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows={2}
                placeholder={t('content.upload.pack.placeholders.description')}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('content.upload.pack.subject')}
                </label>
                <input
                  type="text"
                  value={packSubject}
                  onChange={(e) => setPackSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t('content.upload.pack.placeholders.subject')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('content.upload.pack.grade')}
                </label>
                <input
                  type="text"
                  value={packGrade}
                  onChange={(e) => setPackGrade(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t('content.upload.pack.placeholders.grade')}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('content.upload.pack.curriculum')}
              </label>
              <input
                type="text"
                value={packCurriculum}
                onChange={(e) => setPackCurriculum(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('content.upload.pack.placeholders.curriculum')}
              />
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('content.upload.file.label')} *
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
                    <span>{t('content.upload.file.upload')}</span>
                    <input
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept=".pdf,.docx,.jpg,.jpeg,.png,.tiff"
                      disabled={uploading}
                    />
                  </label>
                  <p className="pl-1">{t('content.upload.file.dragDrop')}</p>
                </div>
                <p className="text-xs text-gray-500">{t('content.upload.file.formats')}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('content.upload.meta.title')}
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder={t('content.upload.meta.titlePlaceholder')}
          disabled={uploading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('content.upload.meta.author')}
        </label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder={t('content.upload.meta.authorPlaceholder')}
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
          {t('content.upload.forceOcr')}
        </label>
      </div>

      {uploading && progress && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-2">
            {getStepIcon()}
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

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {progress?.type === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <p className="text-sm text-green-600">{progress.message}</p>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={uploading}
          >
            {t('common.cancel')}
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
              <span>{t('content.upload.actions.uploading')}</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span>{t('content.upload.actions.uploadDocument')}</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}
