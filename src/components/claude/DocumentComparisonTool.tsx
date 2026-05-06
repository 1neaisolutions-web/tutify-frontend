import { useState, useRef } from 'react'
import { FileText, Upload, X, Loader2, CheckCircle2, GitCompare } from 'lucide-react'
import { DocumentComparison } from '../../types/claude'
import { synthesizeDocuments } from '../../utils/claudeUtils'

interface DocumentComparisonToolProps {
  onComparisonComplete: (comparison: DocumentComparison) => void
  onClose: () => void
}

const DocumentComparisonTool = ({ onComparisonComplete, onClose }: DocumentComparisonToolProps) => {
  const [files, setFiles] = useState<File[]>([])
  const [isComparing, setIsComparing] = useState(false)
  const [comparison, setComparison] = useState<DocumentComparison | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const fileArray = Array.from(selectedFiles)
    setFiles(fileArray)
    setIsComparing(true)

    try {
      // Simulate comparison
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const fileNames = fileArray.map((f) => f.name)
      const synthesis = synthesizeDocuments(fileNames)

      const result: DocumentComparison = {
        documents: fileNames,
        similarities: [
          'Common standards and learning objectives',
          'Shared pedagogical approaches',
          'Similar assessment strategies',
        ],
        differences: [
          'Different grade level focus',
          'Varying depth of content coverage',
          'Different cultural perspectives',
        ],
        standardsComparison: {
          common: ['RL.1', 'RL.2', 'OA.1'],
          unique: ['RL.3', 'OA.2'],
        },
        synthesis,
      }

      setComparison(result)
      onComparisonComplete(result)
    } catch (error) {
      console.error('Comparison error:', error)
    } finally {
      setIsComparing(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <GitCompare className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Document Comparison Tool</h2>
              <p className="text-sm text-gray-600">Compare multiple curriculum documents</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="mb-6 p-8 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50/50 hover:bg-blue-50 transition cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-center">
              <Upload className="h-12 w-12 mx-auto mb-4 text-blue-500" />
              <p className="text-lg font-semibold text-gray-700 mb-2">
                Drag and drop multiple documents here, or click to browse
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Upload 2 or more documents to compare (PDF, DOC, DOCX, TXT)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => handleFileSelect(e.target.files)}
                multiple
                className="hidden"
              />
            </div>
          </div>

          {/* Files List */}
          {files.length > 0 && (
            <div className="mb-6 space-y-2">
              <h3 className="font-semibold text-gray-900">Documents Selected ({files.length})</h3>
              {files.map((file, idx) => (
                <div key={idx} className="p-3 border border-gray-200 rounded-lg bg-white flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{file.name}</div>
                    <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Comparison Results */}
          {isComparing && (
            <div className="p-6 border-2 border-blue-200 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                <div>
                  <div className="font-semibold text-gray-900">Comparing documents...</div>
                  <div className="text-sm text-gray-600">Analyzing similarities and differences</div>
                </div>
              </div>
            </div>
          )}

          {comparison && !isComparing && (
            <div className="space-y-6">
              {/* Similarities */}
              <div className="p-5 border-2 border-green-200 bg-green-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Similarities
                </h3>
                <ul className="space-y-2">
                  {comparison.similarities.map((similarity, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      <span>{similarity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Differences */}
              <div className="p-5 border-2 border-amber-200 bg-amber-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <GitCompare className="h-5 w-5 text-amber-600" />
                  Differences
                </h3>
                <ul className="space-y-2">
                  {comparison.differences.map((difference, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-amber-600">•</span>
                      <span>{difference}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Standards Comparison */}
              <div className="p-5 border border-gray-200 rounded-xl bg-white">
                <h3 className="font-semibold text-gray-900 mb-3">Standards Comparison</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-semibold text-gray-700 mb-2">Common Standards</div>
                    <div className="flex flex-wrap gap-2">
                      {comparison.standardsComparison.common.map((std, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold"
                        >
                          {std}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-700 mb-2">Unique Standards</div>
                    <div className="flex flex-wrap gap-2">
                      {comparison.standardsComparison.unique.map((std, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold"
                        >
                          {std}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Synthesis */}
              <div className="p-5 border border-gray-200 rounded-xl bg-white">
                <h3 className="font-semibold text-gray-900 mb-3">Synthesis Report</h3>
                <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                  {comparison.synthesis}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default DocumentComparisonTool



