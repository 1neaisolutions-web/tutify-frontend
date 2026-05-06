import { useState, useRef } from 'react'
import { Upload, FileText, X, Loader2, CheckCircle2, BookOpen, FileCheck, Lightbulb } from 'lucide-react'
import { LongDocumentAnalysis } from '../../types/claude'
import { analyzeLongDocument } from '../../utils/claudeUtils'

interface LongDocumentAnalyzerProps {
  onAnalysisComplete: (analysis: LongDocumentAnalysis) => void
  onClose: () => void
}

const LongDocumentAnalyzer = ({ onAnalysisComplete, onClose }: LongDocumentAnalyzerProps) => {
  const [files, setFiles] = useState<File[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<LongDocumentAnalysis | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return

    const file = selectedFiles[0]
    setFiles([file])
    setIsAnalyzing(true)

    try {
      const result = await analyzeLongDocument(file)
      setAnalysis(result)
      onAnalysisComplete(result)
    } catch (error) {
      console.error('Analysis error:', error)
    } finally {
      setIsAnalyzing(false)
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
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Long Document Analyzer</h2>
              <p className="text-sm text-gray-600">Analyze textbooks, curricula, and research papers (200K context)</p>
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
                Drag and drop documents here, or click to browse
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supports PDF, DOC, DOCX, TXT (up to 200K tokens)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />
            </div>
          </div>

          {/* Analysis Results */}
          {isAnalyzing && (
            <div className="p-6 border-2 border-blue-200 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                <div>
                  <div className="font-semibold text-gray-900">Analyzing document...</div>
                  <div className="text-sm text-gray-600">Processing content with Claude's 200K context window</div>
                </div>
              </div>
            </div>
          )}

          {analysis && !isAnalyzing && (
            <div className="space-y-4">
              <div className="p-4 border-2 border-green-200 bg-green-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-gray-900">Analysis Complete</span>
                </div>
                <div className="text-sm text-gray-600">
                  Processed {analysis.tokenCount.toLocaleString()} tokens from {analysis.fileName}
                </div>
              </div>

              {/* Key Insights */}
              <div className="p-4 border border-gray-200 rounded-xl bg-white">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-blue-600" />
                  Key Insights
                </h3>
                <ul className="space-y-2">
                  {analysis.keyInsights.map((insight, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Standards Extracted */}
              {analysis.standardsExtracted.length > 0 && (
                <div className="p-4 border border-gray-200 rounded-xl bg-white">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-purple-600" />
                    Standards Extracted
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.standardsExtracted.map((standard, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold"
                      >
                        {standard}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Curriculum Info */}
              <div className="p-4 border border-gray-200 rounded-xl bg-white">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-green-600" />
                  Curriculum Information
                </h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500 mb-1">Subjects</div>
                    <div className="font-medium text-gray-900">
                      {analysis.curriculumInfo.subjects.join(', ')}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Grade Levels</div>
                    <div className="font-medium text-gray-900">
                      {analysis.curriculumInfo.gradeLevels.join(', ')}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Topics</div>
                    <div className="font-medium text-gray-900">
                      {analysis.curriculumInfo.topics.slice(0, 2).join(', ')}
                      {analysis.curriculumInfo.topics.length > 2 && '...'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 border border-gray-200 rounded-xl bg-white">
                <h3 className="font-semibold text-gray-900 mb-2">Summary</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{analysis.summary}</p>
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

export default LongDocumentAnalyzer

