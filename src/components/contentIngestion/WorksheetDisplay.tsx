/**
 * Worksheet Display Component with MathJax rendering, Print, Copy, Export, and Edit functionality
 */
import React, { useState, useRef } from 'react'
import { MathJax, MathJaxContext } from 'better-react-mathjax'
import { 
  Printer, 
  Copy, 
  Download, 
  Edit2, 
  Save, 
  X, 
  Plus, 
  Trash2,
  FileText,
  FileDown
} from 'lucide-react'
import { Worksheet, WorksheetQuestion, Citation } from '../../api/contentIngestion'
import { useSnackbar } from '../../hooks/useSnackbar'

interface WorksheetDisplayProps {
  worksheet: Worksheet
  showAnswers?: boolean
  onWorksheetUpdate?: (updatedWorksheet: Worksheet) => void
}

const mathJaxConfig = {
  loader: { load: ['[tex]/html'] },
  tex: {
    packages: { '[+]': ['html'] },
    inlineMath: [['$', '$']],
    displayMath: [['$$', '$$']],
  },
}

const getDifficultyBadge = (difficulty: string) => {
  const badges = {
    easy: { emoji: '🟢', color: 'text-green-700 bg-green-100', label: 'Easy' },
    medium: { emoji: '🟡', color: 'text-yellow-700 bg-yellow-100', label: 'Medium' },
    hard: { emoji: '🔴', color: 'text-red-700 bg-red-100', label: 'Hard' },
  }
  const badge = badges[difficulty as keyof typeof badges] || badges.medium
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
      {badge.emoji} {badge.label}
    </span>
  )
}

export const WorksheetDisplay = ({ 
  worksheet: initialWorksheet, 
  showAnswers = false,
  onWorksheetUpdate 
}: WorksheetDisplayProps) => {
  const [worksheet, setWorksheet] = useState<Worksheet>(initialWorksheet)
  const [isEditing, setIsEditing] = useState(false)
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null)
  const [editingField, setEditingField] = useState<string | null>(null)
  const worksheetRef = useRef<HTMLDivElement>(null)
  const { toast } = useSnackbar()

  // Update worksheet when prop changes
  React.useEffect(() => {
    setWorksheet(initialWorksheet)
  }, [initialWorksheet])

  if (!worksheet) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">No worksheet data available</p>
      </div>
    )
  }

  // Print functionality - Opens clean print view
  const handlePrint = () => {
    if (!worksheetRef.current) return

    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600')
    if (!printWindow) {
      // Fallback to regular print if popup blocked
      window.print()
      return
    }

    // Clone the worksheet content
    const printContent = worksheetRef.current.cloneNode(true) as HTMLElement
    
    // Remove all no-print elements
    const noPrintElements = printContent.querySelectorAll('.no-print, .action-bar, .edit-controls, .print-hide, button, [class*="lucide"], svg')
    noPrintElements.forEach(el => el.remove())

    // Create clean HTML document
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Worksheet - ${worksheet.topic_text || worksheet.id}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
              padding: 40px;
              background: white;
              color: black;
              line-height: 1.6;
            }
            .worksheet-header {
              border-bottom: 2px solid #000;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .worksheet-header h1 {
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .worksheet-header p {
              font-size: 16px;
              color: #333;
              margin-bottom: 5px;
            }
            .question-item {
              page-break-inside: avoid;
              margin-bottom: 25px;
              padding: 15px;
              border: 1px solid #ddd;
              border-radius: 4px;
            }
            .question-number {
              font-weight: bold;
              font-size: 16px;
              margin-bottom: 10px;
            }
            .question-text {
              font-size: 15px;
              margin-bottom: 15px;
            }
            .options-list {
              margin-left: 20px;
            }
            .option-item {
              padding: 8px;
              margin-bottom: 8px;
              background: #f9fafb;
              border: 1px solid #e5e7eb;
            }
            .answer-section {
              margin-top: 15px;
              padding: 15px;
              background: #f0f9ff;
              border: 1px solid #bfdbfe;
              border-radius: 4px;
            }
            .answer-section p {
              margin-bottom: 8px;
            }
            @media print {
              body {
                padding: 20px;
              }
              .question-item {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="worksheet-header">
            <h1>Worksheet</h1>
            ${worksheet.topic_text ? `<p><strong>Topic:</strong> ${worksheet.topic_text}</p>` : ''}
            ${worksheet.grade && worksheet.subject ? `<p><strong>Grade:</strong> ${worksheet.grade} • <strong>Subject:</strong> ${worksheet.subject}</p>` : ''}
            ${worksheet.created_at ? `<p><strong>Date:</strong> ${new Date(worksheet.created_at).toLocaleDateString()}</p>` : ''}
          </div>
          ${printContent.innerHTML}
        </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()

    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.focus()
      printWindow.print()
      // Close window after printing (optional)
      // printWindow.close()
    }, 250)
  }

  // Copy to clipboard functionality
  const handleCopy = async () => {
    if (!worksheetRef.current) return

    const printContent = worksheetRef.current.cloneNode(true) as HTMLElement
    
    // Remove action buttons from print content
    const actionButtons = printContent.querySelectorAll('.no-print')
    actionButtons.forEach(btn => btn.remove())

    // Get text content
    const textContent = printContent.innerText || printContent.textContent || ''
    
    try {
      await navigator.clipboard.writeText(textContent)
      toast.success('Worksheet copied to clipboard!')
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = textContent
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        toast.success('Worksheet copied to clipboard!')
      } catch (err) {
        toast.error('Failed to copy worksheet')
      }
      document.body.removeChild(textArea)
    }
  }

  // Export as text file
  const handleExportText = () => {
    if (!worksheetRef.current) return

    const printContent = worksheetRef.current.cloneNode(true) as HTMLElement
    const actionButtons = printContent.querySelectorAll('.no-print')
    actionButtons.forEach(btn => btn.remove())

    const textContent = printContent.innerText || printContent.textContent || ''
    const blob = new Blob([textContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `worksheet-${worksheet.id || 'export'}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Worksheet exported as text file!')
  }

  // Export as PDF (using browser print to PDF)
  const handleExportPDF = () => {
    const originalTitle = document.title
    document.title = `Worksheet-${worksheet.id || 'export'}`
    window.print()
    setTimeout(() => {
      document.title = originalTitle
    }, 1000)
  }

  // Edit functionality
  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    setIsEditing(false)
    setEditingQuestionId(null)
    setEditingField(null)
    if (onWorksheetUpdate) {
      onWorksheetUpdate(worksheet)
    }
    toast.success('Worksheet saved!')
  }

  const handleCancel = () => {
    setWorksheet(initialWorksheet)
    setIsEditing(false)
    setEditingQuestionId(null)
    setEditingField(null)
    toast.info('Changes cancelled')
  }

  const updateQuestion = (questionId: string, field: keyof WorksheetQuestion, value: any) => {
    setWorksheet(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, [field]: value } : q
      )
    }))
  }

  const updateQuestionOption = (questionId: string, optionIndex: number, value: string) => {
    setWorksheet(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.id === questionId && q.options) {
          const newOptions = [...q.options]
          newOptions[optionIndex] = value
          return { ...q, options: newOptions }
        }
        return q
      })
    }))
  }

  const addNewQuestion = () => {
    const newQuestion: WorksheetQuestion = {
      id: `new-${Date.now()}`,
      question: 'New question text',
      type: 'short_answer',
      difficulty: 'medium',
      points: 1,
      correct_answer: '',
      options: [],
      math_content: false,
    }
    setWorksheet(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
      answer_key: {
        ...prev.answer_key,
        [newQuestion.id]: '',
      },
      marking_scheme: {
        ...prev.marking_scheme,
        [newQuestion.id]: {
          points: 1,
          criteria: '',
        },
      },
    }))
    setEditingQuestionId(newQuestion.id)
    setEditingField('question')
    toast.success('New question added!')
  }

  const deleteQuestion = (questionId: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setWorksheet(prev => {
        const newAnswerKey = { ...prev.answer_key }
        const newMarkingScheme = { ...prev.marking_scheme }
        delete newAnswerKey[questionId]
        delete newMarkingScheme[questionId]
        return {
          ...prev,
          questions: prev.questions.filter(q => q.id !== questionId),
          answer_key: newAnswerKey,
          marking_scheme: newMarkingScheme,
        }
      })
      toast.success('Question deleted!')
    }
  }

  const addOption = (questionId: string) => {
    setWorksheet(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.id === questionId) {
          const currentOptions = q.options || []
          const letter = String.fromCharCode(65 + currentOptions.length)
          return {
            ...q,
            options: [...currentOptions, `${letter}) New option`],
          }
        }
        return q
      })
    }))
  }

  const removeOption = (questionId: string, optionIndex: number) => {
    setWorksheet(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.id === questionId && q.options) {
          return {
            ...q,
            options: q.options.filter((_, idx) => idx !== optionIndex),
          }
        }
        return q
      })
    }))
  }

  return (
    <>
      {/* Print Styles - Comprehensive print formatting */}
      <style>{`
        @media print {
          /* Hide all action buttons and edit controls */
          .no-print,
          button:not(.print-button),
          .action-bar,
          .edit-controls,
          .print-hide,
          [class*="lucide"],
          svg {
            display: none !important;
            visibility: hidden !important;
          }

          /* Show print-only elements */
          .print-only {
            display: block !important;
            visibility: visible !important;
          }

          /* Worksheet container styling */
          .worksheet-print-container {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            background: white !important;
            box-shadow: none !important;
            border: none !important;
          }

          /* Question formatting */
          .question-item {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin-bottom: 20px !important;
            padding: 15px !important;
            border: 1px solid #e5e7eb !important;
            border-radius: 4px !important;
          }

          /* Remove all interactive elements */
          input[type="text"],
          input[type="number"],
          textarea,
          select {
            border: none !important;
            background: transparent !important;
            padding: 0 !important;
            appearance: none !important;
            -webkit-appearance: none !important;
          }

          /* Ensure proper spacing */
          .space-y-6 > * {
            margin-bottom: 20px !important;
          }

          /* Print-friendly colors */
          * {
            color: black !important;
            background: white !important;
          }

          /* Keep answer sections visible but styled for print */
          .bg-blue-50 {
            background: #f0f9ff !important;
            border: 1px solid #bfdbfe !important;
          }

          .text-blue-700,
          .text-blue-900 {
            color: #1e40af !important;
          }

          /* MCQ options styling */
          .bg-gray-50,
          .bg-green-100 {
            background: #f9fafb !important;
            border: 1px solid #e5e7eb !important;
          }

          /* Remove hover effects */
          .hover\\:shadow-md,
          .hover\\:bg-gray-50,
          .hover\\:bg-blue-50 {
            box-shadow: none !important;
            background: inherit !important;
          }

          /* Page break handling */
          .print-break {
            page-break-after: always !important;
          }

          .no-page-break {
            page-break-inside: avoid !important;
          }

          /* Header styling for print */
          h2 {
            font-size: 24px !important;
            margin-bottom: 10px !important;
            color: black !important;
          }

          /* Ensure proper line spacing */
          p {
            line-height: 1.6 !important;
            margin-bottom: 10px !important;
          }
        }
      `}</style>

      <MathJaxContext config={mathJaxConfig}>
        <div className="bg-white rounded-lg shadow p-6 space-y-6 worksheet-print-container worksheet-content" ref={worksheetRef}>
          {/* Print-Only Header */}
          <div className="print-only hidden print:block border-b pb-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Worksheet</h1>
            {worksheet.topic_text && (
              <p className="text-lg text-gray-700 mb-1">Topic: {worksheet.topic_text}</p>
            )}
            {worksheet.grade && worksheet.subject && (
              <p className="text-base text-gray-600">
                {worksheet.grade} • {worksheet.subject}
              </p>
            )}
            {worksheet.created_at && (
              <p className="text-sm text-gray-500 mt-2">
                Generated: {new Date(worksheet.created_at).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between border-b pb-4 no-print action-bar print-hide">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Worksheet</h2>
              {worksheet.topic_text && (
                <p className="text-gray-600 mt-1">Topic: {worksheet.topic_text}</p>
              )}
              {worksheet.grade && worksheet.subject && (
                <p className="text-sm text-gray-500 mt-1">
                  {worksheet.grade} • {worksheet.subject}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <>
                  <button
                    onClick={handleCopy}
                    className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                  <button
                    onClick={handleExportText}
                    className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    title="Export as text"
                  >
                    <FileText className="w-4 h-4" />
                    Export Text
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    title="Export as PDF"
                  >
                    <FileDown className="w-4 h-4" />
                    Export PDF
                  </button>
                  <button
                    onClick={handlePrint}
                    className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    title="Print worksheet"
                  >
                    <Printer className="w-4 h-4" />
                    Print
                  </button>
                  <button
                    onClick={handleEdit}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                    title="Edit worksheet"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Add New Question Button (Edit Mode) */}
          {isEditing && (
            <div className="no-print print-hide">
              <button
                onClick={addNewQuestion}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Question
              </button>
            </div>
          )}

          {/* Questions */}
          <div className="space-y-6">
            {(worksheet.questions || []).map((question, index) => {
              const isEditingThisQuestion = isEditing && editingQuestionId === question.id
              
              return (
                <div key={question.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow question-item">
                  <div className="flex items-start space-x-3">
                    <span className="font-semibold text-gray-700 min-w-[2rem]">{index + 1}.</span>
                    <div className="flex-1">
                      {/* Question Text */}
                      <div className="mb-2">
                        {isEditing && editingField === 'question' && editingQuestionId === question.id ? (
                          <textarea
                            value={question.question}
                            onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                            onBlur={() => setEditingField(null)}
                            className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            autoFocus
                          />
                        ) : (
                          <div 
                            className="flex items-start justify-between group"
                            onDoubleClick={() => {
                              if (isEditing) {
                                setEditingQuestionId(question.id)
                                setEditingField('question')
                              }
                            }}
                          >
                            <div className="flex-1">
                              {question.math_content ? (
                                <MathJax inline dynamic>
                                  <p className="text-gray-900">{question.question}</p>
                                </MathJax>
                              ) : (
                                <p className="text-gray-900">{question.question}</p>
                              )}
                            </div>
                            {isEditing && (
                              <button
                                onClick={() => {
                                  setEditingQuestionId(question.id)
                                  setEditingField('question')
                                }}
                                className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-800"
                                title="Click to edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* MCQ Options */}
                      {question.type === 'mcq' && question.options && (
                        <div className="mt-3 space-y-2">
                          {question.options.map((option, optIndex) => {
                            const letterMatch = option.match(/^([A-D])\)/)
                            const letter = letterMatch ? letterMatch[1] : String.fromCharCode(65 + optIndex)
                            const isCorrect = showAnswers && question.correct_answer === letter
                            const isEditingOption = isEditing && editingField === `option-${optIndex}` && editingQuestionId === question.id
                            
                            return (
                              <div
                                key={optIndex}
                                className={`p-2 rounded transition-colors flex items-center gap-2 ${
                                  isCorrect
                                    ? 'bg-green-100 border-2 border-green-300'
                                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                                }`}
                              >
                                {isEditingOption ? (
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => updateQuestionOption(question.id, optIndex, e.target.value)}
                                    onBlur={() => setEditingField(null)}
                                    className="flex-1 px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    autoFocus
                                  />
                                ) : (
                                  <>
                                    <span className={isCorrect ? 'text-green-800 font-medium flex-1' : 'text-gray-700 flex-1'}>
                                      {option}
                                    </span>
                                    {isEditing && (
                                      <div className="flex gap-1">
                                        <button
                                          onClick={() => {
                                            setEditingQuestionId(question.id)
                                            setEditingField(`option-${optIndex}`)
                                          }}
                                          className="text-blue-600 hover:text-blue-800"
                                          title="Edit option"
                                        >
                                          <Edit2 className="w-3 h-3" />
                                        </button>
                                        {question.options && question.options.length > 2 && (
                                          <button
                                            onClick={() => removeOption(question.id, optIndex)}
                                            className="text-red-600 hover:text-red-800"
                                            title="Remove option"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        )}
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            )
                          })}
                          {isEditing && (
                            <button
                              onClick={() => addOption(question.id)}
                              className="mt-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-300 rounded hover:bg-blue-50 flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              Add Option
                            </button>
                          )}
                        </div>
                      )}

                      {/* Answer Section */}
                      {showAnswers && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm font-semibold text-blue-900 mb-1">Answer:</p>
                          {isEditing && editingField === 'answer' && editingQuestionId === question.id ? (
                            <input
                              type="text"
                              value={question.correct_answer}
                              onChange={(e) => updateQuestion(question.id, 'correct_answer', e.target.value)}
                              onBlur={() => setEditingField(null)}
                              className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              autoFocus
                            />
                          ) : (
                            <div 
                              className="flex items-center gap-2 group"
                              onDoubleClick={() => {
                                if (isEditing) {
                                  setEditingQuestionId(question.id)
                                  setEditingField('answer')
                                }
                              }}
                            >
                              {question.math_content ? (
                                <MathJax inline dynamic>
                                  <p className="text-blue-700 font-medium flex-1">{question.correct_answer}</p>
                                </MathJax>
                              ) : (
                                <p className="text-blue-700 font-medium flex-1">{question.correct_answer}</p>
                              )}
                              {isEditing && (
                                <button
                                  onClick={() => {
                                    setEditingQuestionId(question.id)
                                    setEditingField('answer')
                                  }}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-800"
                                  title="Click to edit"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          )}
                          {question.explanation && (
                            <div className="mt-2">
                              {isEditing && editingField === 'explanation' && editingQuestionId === question.id ? (
                                <textarea
                                  value={question.explanation || ''}
                                  onChange={(e) => updateQuestion(question.id, 'explanation', e.target.value)}
                                  onBlur={() => setEditingField(null)}
                                  className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  rows={2}
                                  autoFocus
                                />
                              ) : (
                                <div 
                                  className="flex items-start gap-2 group"
                                  onDoubleClick={() => {
                                    if (isEditing) {
                                      setEditingQuestionId(question.id)
                                      setEditingField('explanation')
                                    }
                                  }}
                                >
                                  <p className="text-sm text-blue-600 flex-1">{question.explanation}</p>
                                  {isEditing && (
                                    <button
                                      onClick={() => {
                                        setEditingQuestionId(question.id)
                                        setEditingField('explanation')
                                      }}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-800"
                                      title="Click to edit"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Edit Controls */}
                      {isEditing && (
                        <div className="mt-3 flex items-center gap-2 no-print edit-controls print-hide">
                          <select
                            value={question.type}
                            onChange={(e) => updateQuestion(question.id, 'type', e.target.value)}
                            className="px-2 py-1 text-sm border border-gray-300 rounded"
                          >
                            <option value="mcq">MCQ</option>
                            <option value="short_answer">Short Answer</option>
                            <option value="long_answer">Long Answer</option>
                          </select>
                          <select
                            value={question.difficulty}
                            onChange={(e) => updateQuestion(question.id, 'difficulty', e.target.value)}
                            className="px-2 py-1 text-sm border border-gray-300 rounded"
                          >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                          </select>
                          <input
                            type="number"
                            value={question.points}
                            onChange={(e) => updateQuestion(question.id, 'points', parseInt(e.target.value) || 1)}
                            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                            min="1"
                            placeholder="Points"
                          />
                          <button
                            onClick={() => deleteQuestion(question.id)}
                            className="px-2 py-1 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded hover:bg-red-50 flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Marking Scheme (Answers Mode) */}
          {showAnswers && worksheet.marking_scheme && (
            <div className="border-t pt-4 mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Marking Scheme</h3>
              <div className="space-y-2">
                {Object.entries(worksheet.marking_scheme || {}).map(([questionId, scheme]: [string, any]) => (
                  <div key={questionId} className="text-sm p-2 bg-gray-50 rounded">
                    <span className="font-medium">Q{questionId}:</span>{' '}
                    <span className="text-gray-700">{scheme.points} points</span>
                    {scheme.criteria && (
                      <p className="text-gray-600 mt-1 ml-4 text-xs">{scheme.criteria}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {worksheet.warnings && worksheet.warnings.length > 0 && (
            <div className="border-t pt-4 mt-6">
              <h3 className="font-semibold text-yellow-900 mb-2">Warnings</h3>
              <div className="space-y-1">
                {worksheet.warnings.map((warning, idx) => (
                  <p key={idx} className="text-sm text-yellow-700">{warning}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </MathJaxContext>
    </>
  )
}
