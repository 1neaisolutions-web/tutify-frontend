import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Download,
  Share2,
  Eye,
  EyeOff,
  BookOpen,
  MessageSquare,
  Lightbulb,
  CheckCircle2,
  FileText,
} from 'lucide-react'
import { useSnackbar } from '../../hooks/useSnackbar'
import { getYouTubeQuizGeneration, YouTubeQuizQuestion, YouTubeQuizSection } from '../../api/youtubeQuiz'

interface QuizPreview {
  title: string
  summary: string
  sections: YouTubeQuizSection[]
}

const QuizResults = () => {
  const { toast } = useSnackbar()
  const location = useLocation()
  const navigate = useNavigate()
  const [showAnswers, setShowAnswers] = useState(false)
  const [isWorksheetExporting, setIsWorksheetExporting] = useState(false)
  const [quizData, setQuizData] = useState<QuizPreview | null>(
    (location.state?.quizData as QuizPreview | null) ?? null,
  )
  const [loadingRestore, setLoadingRestore] = useState(() => {
    const fromState = location.state?.quizData as QuizPreview | null
    const gid = new URLSearchParams(location.search).get('generation')
    return !fromState && !!gid
  })

  useEffect(() => {
    const fromState = location.state?.quizData as QuizPreview | null
    if (fromState) {
      setQuizData(fromState)
      setLoadingRestore(false)
      return
    }
    const gid = new URLSearchParams(location.search).get('generation')
    if (!gid) {
      setLoadingRestore(false)
      return
    }
    let cancelled = false
    setLoadingRestore(true)
    getYouTubeQuizGeneration(gid)
      .then((raw) => {
        if (cancelled) return
        setQuizData({
          title: raw.title,
          summary: raw.summary,
          sections: raw.sections,
        })
      })
      .catch(() => {
        if (!cancelled) setQuizData(null)
      })
      .finally(() => {
        if (!cancelled) setLoadingRestore(false)
      })
    return () => {
      cancelled = true
    }
  }, [location.search, location.key])

  if (loadingRestore) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-gray-600">Loading quiz…</p>
      </div>
    )
  }

  if (!quizData) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No quiz data found. Please generate a quiz first.</p>
          <button
            onClick={() => navigate('/youtube-quiz')}
            className="mt-4 rounded-full bg-red-500 px-6 py-2 text-sm font-semibold text-white hover:bg-red-400"
          >
            Go to Quiz Generator
          </button>
        </div>
      </div>
    )
  }

  const sectionIcons = {
    'Key idea check': BookOpen,
    'Application & transfer': Lightbulb,
    'Discussion launcher': MessageSquare,
  }

  const formatQuizForSharing = (data: QuizPreview, includeAnswers: boolean) => {
    const lines: string[] = [data.title, data.summary, '']
    data.sections.forEach((section, sectionIndex) => {
      lines.push(`${sectionIndex + 1}. ${section.heading}`)
      lines.push(section.details)
      section.questions.forEach((question, questionIndex) => {
        lines.push(`  ${questionIndex + 1}) ${question.prompt}`)
        if (question.style === 'multiple_choice' && question.options) {
          question.options.forEach((option, optionIndex) => {
            const optionLabel = String.fromCharCode(65 + optionIndex)
            lines.push(`     ${optionLabel}. ${option}`)
          })
          if (includeAnswers && typeof question.correct_option_index === 'number') {
            lines.push(`     Answer: ${String.fromCharCode(65 + question.correct_option_index)}`)
          }
        }
        if (includeAnswers) {
          if (question.style === 'quick_check' && question.answer !== undefined) {
            lines.push(`     Answer: ${String(question.answer)}`)
          }
          if ((question.style === 'higher_order' || question.style === 'discussion_prompt') && question.sample_answer) {
            lines.push(`     Sample answer: ${question.sample_answer}`)
          }
        }
      })
      lines.push('')
    })
    return lines.join('\n')
  }

  const handleShare = async () => {
    const shareText = formatQuizForSharing(quizData, showAnswers)
    try {
      if (navigator.share) {
        await navigator.share({
          title: quizData.title,
          text: shareText,
        })
        toast.success('Quiz shared successfully.')
        return
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText)
        toast.success('Quiz copied to clipboard.')
        return
      }
      toast.warning('Sharing is not supported on this browser.')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to share quiz.'
      toast.error(errorMessage)
    }
  }

  const handleExportPdf = () => {
    try {
      window.print()
      toast.success('Print dialog opened for PDF export.')
    } catch {
      toast.error('Unable to open print dialog for export.')
    }
  }

  const getAnswerText = (question: YouTubeQuizQuestion) => {
    if (question.style === 'multiple_choice') {
      if (
        !question.options ||
        typeof question.correct_option_index !== 'number' ||
        !question.options[question.correct_option_index]
      ) {
        return 'Answer unavailable'
      }
      return question.options[question.correct_option_index]
    }
    if (question.style === 'quick_check') {
      return question.answer !== undefined ? String(question.answer) : 'Answer unavailable'
    }
    const longAnswerParts: string[] = []
    if (question.sample_answer) {
      longAnswerParts.push(`Sample answer: ${question.sample_answer}`)
    }
    if (question.rubric_points && question.rubric_points.length > 0) {
      longAnswerParts.push(`Rubric points: ${question.rubric_points.join('; ')}`)
    }
    return longAnswerParts.join(' | ') || 'Answer guidance unavailable'
  }

  const handleExportWorksheet = () => {
    try {
      setIsWorksheetExporting(true)
      setTimeout(() => {
        window.print()
        toast.success('Worksheet print layout opened.')
        setTimeout(() => setIsWorksheetExporting(false), 100)
      }, 50)
    } catch {
      setIsWorksheetExporting(false)
      toast.error('Unable to open worksheet export.')
    }
  }

  const renderQuestion = (question: YouTubeQuizQuestion) => {
    if (question.style === 'multiple_choice') {
      return (
        <div className="mt-3 space-y-2">
          {question.options?.map((option, optionIdx) => {
            const isCorrect = showAnswers && optionIdx === question.correct_option_index
            return (
              <div
                key={`${question.id}-${optionIdx}`}
                className={`rounded-lg border px-3 py-2 text-sm ${
                  isCorrect ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-gray-200 bg-white text-gray-700'
                }`}
              >
                <span className="font-semibold mr-2">{String.fromCharCode(65 + optionIdx)}.</span>
                {option}
                {isCorrect && <CheckCircle2 className="ml-2 inline h-4 w-4" />}
              </div>
            )
          })}
        </div>
      )
    }

    if (question.style === 'quick_check') {
      return (
        <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-700">
          <p>
            <span className="font-semibold">Response type:</span> {question.expected_response_type || 'short_phrase'}
          </p>
          {showAnswers && (
            <p className="mt-1 text-emerald-700">
              <span className="font-semibold">Answer:</span> {String(question.answer)}
            </p>
          )}
        </div>
      )
    }

    return (
      <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-700">
        <p className="text-gray-600">Long response prompt.</p>
        {showAnswers && question.sample_answer && (
          <p className="mt-2">
            <span className="font-semibold text-gray-900">Sample answer:</span> {question.sample_answer}
          </p>
        )}
        {showAnswers && question.rubric_points && question.rubric_points.length > 0 && (
          <ul className="mt-2 list-disc pl-5 text-gray-700">
            {question.rubric_points.map((point, idx) => (
              <li key={`${question.id}-rubric-${idx}`}>{point}</li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  return (
    <div className={`space-y-8 print:space-y-4 ${isWorksheetExporting ? 'worksheet-export' : ''}`}>
      <style>
        {`@media print {
          .print-hide { display: none !important; }
          .print-page-break { page-break-inside: avoid; }
          .print-only { display: none !important; }
          .worksheet-export .print-standard { display: none !important; }
          .worksheet-export .print-only { display: block !important; }
          .worksheet-page-break { page-break-before: always; }
        }`}
      </style>
      {/* Toolbar: actions separated from title so layout reads left→right clearly */}
      <header className="print-hide space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => navigate('/youtube-quiz')}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:border-gray-300 hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
            Back to Generator
          </button>

          <div
            className="flex flex-wrap items-center gap-2 sm:justify-end"
            role="toolbar"
            aria-label="Quiz actions"
          >
            <button
              type="button"
              onClick={() => setShowAnswers((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50"
            >
              {showAnswers ? <EyeOff className="h-4 w-4 shrink-0" aria-hidden /> : <Eye className="h-4 w-4 shrink-0" aria-hidden />}
              {showAnswers ? 'Hide answers' : 'Show answers'}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50"
            >
              <Share2 className="h-4 w-4 shrink-0" aria-hidden />
              Share
            </button>
            <button
              type="button"
              onClick={handleExportPdf}
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:border-red-200 hover:bg-red-50"
            >
              <Download className="h-4 w-4 shrink-0" aria-hidden />
              Export PDF
            </button>
            <button
              type="button"
              onClick={handleExportWorksheet}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50"
            >
              <FileText className="h-4 w-4 shrink-0" aria-hidden />
              Generate worksheet
            </button>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <h1 className="text-xl font-semibold leading-snug text-gray-900 sm:text-2xl">{quizData.title}</h1>
          <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-600 line-clamp-3 sm:line-clamp-2">
            {quizData.summary}
          </p>
        </div>
      </header>

      {/* Quiz Sections */}
      <div className="space-y-6 print-standard">
        {quizData.sections.map((section, sectionIdx) => {
          const Icon = sectionIcons[section.heading as keyof typeof sectionIcons] || BookOpen
          return (
            <div key={sectionIdx} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm print-page-break">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-gray-900">{section.heading}</h2>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
                      {section.questions.length} questions
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{section.details}</p>
                  <div className="mt-4 space-y-3">
                    {section.questions.map((question, qIdx) => (
                      <div
                        key={question.id || qIdx}
                        className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4"
                      >
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-semibold text-red-600">
                          {qIdx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{question.prompt}</p>
                          {renderQuestion(question)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="print-only rounded-3xl border border-gray-200 bg-white p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">{quizData.title}</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-700">
            <p>Name: ________________________</p>
            <p>Date: ________________________</p>
          </div>
        </div>
        <ol className="space-y-4 text-sm text-gray-800">
          {quizData.sections.flatMap((section) => section.questions).map((question, idx) => (
            <li key={`worksheet-student-${question.id}-${idx}`}>
              <p className="font-medium">{question.prompt}</p>
              {question.style === 'multiple_choice' && question.options && (
                <ul className="mt-2 list-disc pl-5">
                  {question.options.map((option, optionIdx) => (
                    <li key={`worksheet-option-${question.id}-${optionIdx}`}>{option}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </div>

      <div className="print-only worksheet-page-break rounded-3xl border border-gray-200 bg-white p-6">
        <h2 className="text-2xl font-semibold text-gray-900">{quizData.title} - Teacher answer key</h2>
        <ol className="mt-4 space-y-3 text-sm text-gray-800">
          {quizData.sections.flatMap((section) => section.questions).map((question, idx) => (
            <li key={`worksheet-answer-${question.id}-${idx}`}>
              <p className="font-semibold">{idx + 1}. {getAnswerText(question)}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Action Footer */}
      <div className="rounded-3xl border border-gray-200 bg-gradient-to-r from-red-50 to-orange-50 p-6 print-hide print-standard">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Next steps</h3>
            <p className="mt-1 text-sm text-gray-600">
              Start a new quiz or save this one to your library. Use the toolbar above anytime for print, share, or answer
              key.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/youtube-quiz')}
              className="rounded-full border-2 border-red-500 bg-white px-6 py-2 text-sm font-semibold text-red-500 hover:bg-red-50"
            >
              Generate Another
            </button>
            <button className="rounded-full bg-red-500 px-6 py-2 text-sm font-semibold text-white hover:bg-red-400">
              Save to Library
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizResults


