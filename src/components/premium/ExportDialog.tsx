import { useState } from 'react'
import { Download, X, FileText, File, Code, Globe } from 'lucide-react'
import { ExportFormat } from '../../types/premium'
import { Message } from '../../pages/features/GeneralTeachingAssistantChat'
import { exportToMarkdown, exportToHTML, downloadExport } from '../../utils/premiumExportUtils'

interface ExportDialogProps {
  messages: Message[]
  onClose: () => void
}

const ExportDialog = ({ messages, onClose }: ExportDialogProps) => {
  const [format, setFormat] = useState<ExportFormat['type']>('pdf')
  const [includeMetadata, setIncludeMetadata] = useState(true)
  const [includeImages, setIncludeImages] = useState(true)
  const [formatting, setFormatting] = useState<ExportFormat['formatting']>('professional')

  const handleExport = () => {
    const exportOptions: ExportFormat = {
      type: format,
      includeMetadata,
      includeImages,
      formatting,
    }

    switch (format) {
      case 'markdown':
        const markdown = exportToMarkdown(messages, exportOptions)
        downloadExport(markdown, `gpt4-conversation-${Date.now()}.md`, 'text/markdown')
        break
      case 'html':
        const html = exportToHTML(messages, exportOptions)
        downloadExport(html, `gpt4-conversation-${Date.now()}.html`, 'text/html')
        break
      case 'pdf':
        // PDF export would use jsPDF in production
        const pdfContent = exportToMarkdown(messages, exportOptions)
        downloadExport(pdfContent, `gpt4-conversation-${Date.now()}.txt`, 'text/plain')
        break
      case 'word':
        // Word export would use docx library in production
        const wordContent = exportToMarkdown(messages, exportOptions)
        downloadExport(wordContent, `gpt4-conversation-${Date.now()}.txt`, 'text/plain')
        break
      case 'google-docs':
        // Google Docs export would use API in production
        alert('Google Docs export requires API integration')
        break
    }

    onClose()
  }

  const formatOptions = [
    { value: 'pdf', label: 'PDF', icon: FileText, description: 'Professional PDF document' },
    { value: 'word', label: 'Word Document', icon: File, description: 'Microsoft Word (.docx)' },
    { value: 'markdown', label: 'Markdown', icon: Code, description: 'Markdown format' },
    { value: 'html', label: 'HTML', icon: Globe, description: 'Web page format' },
    { value: 'google-docs', label: 'Google Docs', icon: FileText, description: 'Google Docs format' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-yellow-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600">
              <Download className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Export Conversation</h2>
              <p className="text-sm text-gray-600">{messages.length} messages</p>
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
        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Export Format</label>
            <div className="grid grid-cols-2 gap-3">
              {formatOptions.map((option) => {
                const Icon = option.icon
                return (
                  <button
                    key={option.value}
                    onClick={() => setFormat(option.value as ExportFormat['type'])}
                    className={`p-4 rounded-lg border-2 text-left transition ${
                      format === option.value
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`h-5 w-5 mt-0.5 ${format === option.value ? 'text-amber-600' : 'text-gray-400'}`} />
                      <div>
                        <div className="font-semibold text-gray-900">{option.label}</div>
                        <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">Export Options</label>
            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={includeMetadata}
                onChange={(e) => setIncludeMetadata(e.target.checked)}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500"
              />
              <div>
                <div className="font-medium text-gray-900">Include Metadata</div>
                <div className="text-xs text-gray-500">Timestamps, dates, and conversation info</div>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={includeImages}
                onChange={(e) => setIncludeImages(e.target.checked)}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500"
              />
              <div>
                <div className="font-medium text-gray-900">Include Images</div>
                <div className="text-xs text-gray-500">Embed uploaded images in export</div>
              </div>
            </label>
          </div>

          {/* Formatting */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Formatting Style</label>
            <div className="flex gap-3">
              {(['professional', 'simple', 'custom'] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => setFormatting(style)}
                  className={`px-4 py-2 rounded-lg border-2 transition ${
                    formatting === style
                      ? 'border-amber-500 bg-amber-50 text-amber-700 font-semibold'
                      : 'border-gray-200 text-gray-700 hover:border-amber-300'
                  }`}
                >
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition shadow-md flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExportDialog

