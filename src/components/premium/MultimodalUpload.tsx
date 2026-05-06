import { useState, useRef } from 'react'
import { Upload, Image, FileText, X, Loader2, Sparkles } from 'lucide-react'
import { MultimodalFile } from '../../types/premium'
import { processImage, processDocument, generatePreview, detectFileType } from '../../utils/multimodalProcessor'

interface MultimodalUploadProps {
  onFilesSelected: (files: MultimodalFile[]) => void
  onClose: () => void
}

const MultimodalUpload = ({ onFilesSelected, onClose }: MultimodalUploadProps) => {
  const [files, setFiles] = useState<MultimodalFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  const handleFileSelect = async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    setIsProcessing(true)
    const newFiles: MultimodalFile[] = []

    for (const file of Array.from(selectedFiles)) {
      const fileType = detectFileType(file)
      const preview = fileType === 'image' ? await generatePreview(file) : undefined

      const multimodalFile: MultimodalFile = {
        id: `file-${Date.now()}-${Math.random()}`,
        file,
        type: fileType,
        preview,
        processed: false,
      }

      newFiles.push(multimodalFile)

      // Process file
      if (fileType === 'image') {
        multimodalFile.analysis = await processImage(file)
        multimodalFile.processed = true
      } else if (fileType === 'document') {
        multimodalFile.analysis = await processDocument(file)
        multimodalFile.processed = true
      }
    }

    setFiles((prev) => [...prev, ...newFiles])
    setIsProcessing(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const handleApply = () => {
    onFilesSelected(files)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Multimodal Upload</h2>
              <p className="text-sm text-gray-600">Upload images or documents for AI analysis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drop Zone */}
        <div
          ref={dropZoneRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="m-4 p-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:border-purple-400 hover:bg-purple-50/50 transition cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-center">
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-semibold text-gray-700 mb-2">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supports images (JPG, PNG, GIF) and documents (PDF, DOC, DOCX)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>
        </div>

        {/* Files List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {files.length > 0 && (
            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition"
                >
                  <div className="flex items-start gap-4">
                    {file.preview ? (
                      <img
                        src={file.preview}
                        alt={file.file.name}
                        className="h-20 w-20 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="h-20 w-20 flex items-center justify-center bg-gray-100 rounded-lg">
                        {file.type === 'document' ? (
                          <FileText className="h-8 w-8 text-gray-400" />
                        ) : (
                          <Image className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{file.file.name}</p>
                          <p className="text-sm text-gray-500">
                            {(file.file.size / 1024).toFixed(2)} KB • {file.type}
                          </p>
                          {file.processed && file.analysis && (
                            <div className="mt-2 p-2 bg-purple-50 rounded text-xs text-purple-700">
                              {file.analysis}
                            </div>
                          )}
                          {!file.processed && (
                            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Processing...
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {files.length === 0 && !isProcessing && (
            <div className="text-center py-12 text-gray-500">
              <Upload className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No files selected</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={files.length === 0 || isProcessing}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add {files.length} File{files.length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  )
}

export default MultimodalUpload

