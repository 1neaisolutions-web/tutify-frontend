/**
 * Document Upload Form Component
 */
import React, { useState, useEffect } from 'react'
import { Upload, FileText, X } from 'lucide-react'
import { uploadDocument, ContentPack, DocumentUploadRequest } from '../../api/contentIngestion'
import { TocJsonOptionalSection } from './TocJsonOptionalSection'
import { parseChapterMapFromJson } from './tocChapterMapParse'

interface DocumentUploadFormProps {
  packs: ContentPack[]
  onUploadSuccess: (document: any) => void
  onCancel?: () => void
  defaultPackId?: string
}

export const DocumentUploadForm = ({
  packs,
  onUploadSuccess,
  onCancel,
  defaultPackId,
}: DocumentUploadFormProps) => {
  const [selectedPack, setSelectedPack] = useState<string>(defaultPackId || '')
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [tocJsonText, setTocJsonText] = useState('')
  const [forceOcr, setForceOcr] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Update selected pack when defaultPackId changes
  useEffect(() => {
    if (defaultPackId && !selectedPack) {
      setSelectedPack(defaultPackId)
    }
  }, [defaultPackId, selectedPack])
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedPack) {
      setError('Please select a content pack')
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
    
    try {
      const request: DocumentUploadRequest = {
        pack_id: selectedPack,
        file,
        title: title || undefined,
        author: author || undefined,
        chapter_map: chapterMap,
        force_ocr: forceOcr,
      }
      
      const document = await uploadDocument(request)
      onUploadSuccess(document)
    } catch (err: any) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content Pack *
        </label>
        <select
          value={selectedPack}
          onChange={(e) => setSelectedPack(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Select a pack...</option>
          {(packs || []).map((pack) => (
            <option key={pack.id} value={pack.id}>
              {pack.name} {pack.subject ? `- ${pack.subject}` : ''}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Document File *
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors">
          <div className="space-y-1 text-center">
            {file ? (
              <div className="flex items-center justify-center space-x-2">
                <FileText className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-600">{file.name}</span>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept=".pdf,.docx,.jpg,.jpeg,.png,.tiff"
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
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title (optional)
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Document title"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Author name"
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
        />
        <label htmlFor="force_ocr" className="ml-2 block text-sm text-gray-700">
          Force OCR (even for digital PDFs)
        </label>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={uploading || !selectedPack || !file}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Uploading...' : 'Upload Document'}
        </button>
      </div>
    </form>
  )
}
