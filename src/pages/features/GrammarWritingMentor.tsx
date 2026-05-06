import { useState } from 'react'
import {
  BookOpen,
  FileText,
  Sparkles,
  Download,
  RefreshCw,
  TrendingUp,
  Users,
  Target,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  MessageSquare,
  PenTool,
  BarChart3,
  BookMarked,
  GraduationCap,
  Award,
  Clock,
  Search,
  Filter,
  Star,
  Lock,
  Quote,
  Layers,
  Eye,
  Brain,
  Palette,
  Music,
  Zap,
  Compass,
  Edit,
  SpellCheck,
  FileCheck,
  ClipboardList,
  Wand2,
  ScrollText,
  FileEdit,
} from 'lucide-react'
import * as chatbotApi from '../../api/chatbots'
import { useSnackbar } from '../../hooks/useSnackbar'
import { useCapabilityCreditGate } from '../../hooks/useCapabilityCreditGate'
import { useChatbotHistorySession } from '../../hooks/useChatbotHistorySession'
import NoCreditsCard from '../../components/NoCreditsCard'

interface GrammarCheck {
  errors: {
    type: string
    original: string
    suggestion: string
    explanation: string
    severity: 'error' | 'warning' | 'suggestion'
  }[]
  score: number
  suggestions: string[]
}

interface WritingFeedback {
  strengths: string[]
  areasForImprovement: string[]
  suggestions: string[]
  rubricScore: {
    grammar: number
    organization: number
    style: number
    content: number
    conventions: number
  }
  styleAnalysis: {
    tone: string
    voice: string
    sentenceVariety: string
    wordChoice: string
  }
}

interface PeerReviewGuide {
  criteria: {
    category: string
    questions: string[]
    checklist: string[]
  }[]
  protocols: string[]
  sentenceStarters: {
    praise: string[]
    suggestion: string[]
    question: string[]
  }
}

interface GrammarLesson {
  topic: string
  explanation: string
  examples: {
    correct: string[]
    incorrect: string[]
  }
  practice: {
    question: string
    options: string[]
    correct: number
    explanation: string
  }[]
}

const GrammarWritingMentor = () => {
  const { toast } = useSnackbar()
  const { creditError, clearCreditError, captureApiError, runWithCredits } = useCapabilityCreditGate()
  const CHATBOT_SLUG = 'grammar-writing-mentor'
  
  const [activeTab, setActiveTab] = useState<'grammar' | 'feedback' | 'peer' | 'lessons' | 'prompts' | 'rubric'>('grammar')
  const [textInput, setTextInput] = useState('')
  const [gradeLevel, setGradeLevel] = useState('7')
  const [writingType, setWritingType] = useState('narrative')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [grammarCheck, setGrammarCheck] = useState<GrammarCheck | null>(null)
  const [writingFeedback, setWritingFeedback] = useState<WritingFeedback | null>(null)
  const [peerReviewGuide, setPeerReviewGuide] = useState<PeerReviewGuide | null>(null)
  const [grammarLesson, setGrammarLesson] = useState<GrammarLesson | null>(null)
  const [hasGeneratedPeerGuide, setHasGeneratedPeerGuide] = useState(false)
  const [hasGeneratedLesson, setHasGeneratedLesson] = useState(false)

  const GRAMMAR_CAPABILITY_TABS: Record<string, 'grammar' | 'feedback' | 'peer' | 'lessons'> = {
    grammar_check: 'grammar',
    writing_feedback: 'feedback',
    peer_review_guide: 'peer',
    grammar_lesson: 'lessons',
  }

  const { conversationIdForActiveTab, pinFromResponse } = useChatbotHistorySession({
    slug: CHATBOT_SLUG,
    activeTab,
    capabilityKeyToTab: GRAMMAR_CAPABILITY_TABS,
    onRestore: async ({ tabKey, userContent, assistantContent, assistantMetadata }) => {
      const cap = assistantMetadata?.capability_key as string | undefined
      const tab: 'grammar' | 'feedback' | 'peer' | 'lessons' =
        tabKey === 'grammar' || tabKey === 'feedback' || tabKey === 'peer' || tabKey === 'lessons'
          ? tabKey
          : cap && GRAMMAR_CAPABILITY_TABS[cap]
            ? GRAMMAR_CAPABILITY_TABS[cap]
            : 'grammar'
      setActiveTab(tab)
      if (userContent) setTextInput(userContent)
      try {
        const data = JSON.parse(assistantContent)
        setGrammarCheck(null)
        setWritingFeedback(null)
        setPeerReviewGuide(null)
        setGrammarLesson(null)
        setHasGeneratedPeerGuide(false)
        setHasGeneratedLesson(false)
        if (tab === 'grammar') {
          setGrammarCheck(data as GrammarCheck)
        } else if (tab === 'feedback') {
          setWritingFeedback(data as WritingFeedback)
        } else if (tab === 'peer') {
          setPeerReviewGuide(data as PeerReviewGuide)
          setHasGeneratedPeerGuide(true)
        } else if (tab === 'lessons') {
          setGrammarLesson(data as GrammarLesson)
          setHasGeneratedLesson(true)
        }
      } catch {
        toast.info('Could not restore saved output from History.')
      }
    },
  })

  // Helper function to extract error message from various error formats
  const extractErrorMessage = (error: any, defaultMessage: string): string => {
    if (typeof error === 'string') {
      return error
    }
    
    // Handle Pydantic validation errors (array format)
    const extractFromDetail = (detail: any): string | null => {
      if (Array.isArray(detail)) {
        const firstError = detail[0]
        return firstError?.msg || firstError?.message || `Validation error: ${firstError?.type || 'unknown'}`
      } else if (typeof detail === 'string') {
        return detail
      }
      return null
    }
    
    if (error?.detail) {
      const msg = extractFromDetail(error.detail)
      if (msg) return msg
    }
    
    if (error?.response?.data?.detail) {
      const msg = extractFromDetail(error.response.data.detail)
      if (msg) return msg
    }
    
    if (error?.data?.detail) {
      const msg = extractFromDetail(error.data.detail)
      if (msg) return msg
    }
    
    if (error?.message) {
      return typeof error.message === 'string' ? error.message : JSON.stringify(error.message)
    }
    
    if (error?.response?.data?.message) {
      return typeof error.response.data.message === 'string' ? error.response.data.message : JSON.stringify(error.response.data.message)
    }
    
    return defaultMessage
  }

  const handleGrammarCheck = async () => {
    if (!textInput.trim()) {
      toast.error('Please enter text to check')
      return
    }
    
    setIsAnalyzing(true)
    clearCreditError()
    
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(
        CHATBOT_SLUG,
        'grammar_check',
        {
          input: textInput,
          input_type: 'text',
          parameters: {
            grade_level: gradeLevel,
          },
          conversation_id: conversationIdForActiveTab ?? undefined,
        }
      ))
      if (response == null) return
      
      setGrammarCheck(response.result as GrammarCheck)
      pinFromResponse(response.conversation_id)
      toast.success('Grammar check completed')
    } catch (error: any) {
      if (captureApiError(error)) return
      console.error('Error checking grammar:', error)
      const errorMessage = extractErrorMessage(error, 'Failed to check grammar')
      toast.error(errorMessage)
      
      if (error?.status === 403 || error?.response?.status === 403 || errorMessage.includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleWritingFeedback = async () => {
    if (!textInput.trim()) {
      toast.error('Please enter writing sample for feedback')
      return
    }
    
    setIsAnalyzing(true)
    clearCreditError()
    
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(
        CHATBOT_SLUG,
        'writing_feedback',
        {
          input: textInput,
          input_type: 'text',
          parameters: {
            grade_level: gradeLevel,
            writing_type: writingType,
          },
          conversation_id: conversationIdForActiveTab ?? undefined,
        }
      ))
      if (response == null) return
      
      setWritingFeedback(response.result as WritingFeedback)
      pinFromResponse(response.conversation_id)
      toast.success('Writing feedback generated')
    } catch (error: any) {
      if (captureApiError(error)) return
      console.error('Error generating feedback:', error)
      const errorMessage = extractErrorMessage(error, 'Failed to generate writing feedback')
      toast.error(errorMessage)
      
      if (error?.status === 403 || error?.response?.status === 403 || errorMessage.includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handlePeerReviewGuide = async () => {
    setIsAnalyzing(true)
    clearCreditError()
    
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(
        CHATBOT_SLUG,
        'peer_review_guide',
        {
          input: 'Generate peer review guide',
          input_type: 'text',
          parameters: {
            grade_level: gradeLevel,
          },
          conversation_id: conversationIdForActiveTab ?? undefined,
        }
      ))
      if (response == null) return
      
      setPeerReviewGuide(response.result as PeerReviewGuide)
      setHasGeneratedPeerGuide(true)
      pinFromResponse(response.conversation_id)
      toast.success('Peer review guide generated')
    } catch (error: any) {
      if (captureApiError(error)) return
      console.error('Error generating peer review guide:', error)
      const errorMessage = extractErrorMessage(error, 'Failed to generate peer review guide')
      toast.error(errorMessage)
      
      if (error?.status === 403 || error?.response?.status === 403 || errorMessage.includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleGrammarLesson = async () => {
    setIsAnalyzing(true)
    clearCreditError()
    
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(
        CHATBOT_SLUG,
        'grammar_lesson',
        {
          input: 'Generate grammar lesson',
          input_type: 'text',
          parameters: {
            grade_level: gradeLevel,
          },
          conversation_id: conversationIdForActiveTab ?? undefined,
        }
      ))
      if (response == null) return
      
      setGrammarLesson(response.result as GrammarLesson)
      setHasGeneratedLesson(true)
      pinFromResponse(response.conversation_id)
      toast.success('Grammar lesson generated')
    } catch (error: any) {
      if (captureApiError(error)) return
      console.error('Error generating grammar lesson:', error)
      const errorMessage = extractErrorMessage(error, 'Failed to generate grammar lesson')
      toast.error(errorMessage)
      
      if (error?.status === 403 || error?.response?.status === 403 || errorMessage.includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  const tabs = [
    { id: 'grammar', label: 'Grammar Checker', icon: SpellCheck },
    { id: 'feedback', label: 'Writing Feedback', icon: FileCheck },
    { id: 'peer', label: 'Peer Review Guide', icon: Users },
    { id: 'lessons', label: 'Grammar Lessons', icon: BookOpen },
    { id: 'prompts', label: 'Writing Prompts', icon: Lightbulb },
    { id: 'rubric', label: 'Rubric Builder', icon: ClipboardList },
  ]

  return (
    <div className="space-y-6">
      {creditError && (
        <NoCreditsCard
          reason={creditError.reason}
          balance={creditError.balance}
          required={creditError.required}
          onActivated={clearCreditError}
        />
      )}
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <PenTool className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">Grammar & Writing Mentor</h1>
                  <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    <Star className="h-3 w-3" /> 4.8★
                  </span>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    <Lock className="inline h-3 w-3 mr-1" /> Premium
                  </span>
                </div>
                <p className="mt-2 text-emerald-100">
                  Comprehensive grammar instruction, writing workshop facilitation, peer review guidance, 
                  and rubric generation for effective writing instruction.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
                <SpellCheck className="h-4 w-4" />
                <span>Grammar Checking</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
                <FileCheck className="h-4 w-4" />
                <span>Writing Feedback</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
                <Users className="h-4 w-4" />
                <span>Peer Review Tools</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
                <BookOpen className="h-4 w-4" />
                <span>Grammar Lessons</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Texts Reviewed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">1,456</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <FileText className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Grammar Errors Fixed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">8,234</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
              <SpellCheck className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Students Supported</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">2,345</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Writing Score</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">4.2/5</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Award className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-emerald-600 text-emerald-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="p-6">
          {/* Grammar Checker Tab */}
          {activeTab === 'grammar' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade Level
                    </label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    >
                      {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                        <option key={grade} value={grade}>
                          Grade {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Paste Student Writing
                    </label>
                    <textarea
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Paste student writing here for grammar checking and suggestions..."
                      rows={14}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        {textInput.split(/\s+/).filter(w => w.length > 0).length} words
                      </p>
                      <button
                        onClick={handleGrammarCheck}
                        disabled={!textInput.trim() || isAnalyzing}
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isAnalyzing ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Checking...
                          </>
                        ) : (
                          <>
                            <SpellCheck className="h-4 w-4" />
                            Check Grammar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 max-h-[800px] overflow-y-auto">
                  {grammarCheck ? (
                    <div className="space-y-4">
                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <SpellCheck className="h-5 w-5 text-emerald-600" />
                            Grammar Score
                          </h3>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-emerald-600">{grammarCheck.score}%</p>
                            <p className="text-xs text-gray-600">Overall Quality</p>
                          </div>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full transition-all"
                            style={{ width: `${grammarCheck.score}%` }}
                          />
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-white p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-amber-600" />
                          Issues Found ({grammarCheck.errors.length})
                        </h3>
                        <div className="space-y-4">
                          {grammarCheck.errors.map((error, idx) => (
                            <div
                              key={idx}
                              className={`rounded-xl p-4 border-l-4 ${
                                error.severity === 'error'
                                  ? 'bg-red-50 border-red-400'
                                  : error.severity === 'warning'
                                  ? 'bg-amber-50 border-amber-400'
                                  : 'bg-blue-50 border-blue-400'
                              }`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <span className={`text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded ${
                                  error.severity === 'error'
                                    ? 'bg-red-100 text-red-700'
                                    : error.severity === 'warning'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {error.type}
                                </span>
                                <span className={`text-xs font-semibold ${
                                  error.severity === 'error'
                                    ? 'text-red-700'
                                    : error.severity === 'warning'
                                    ? 'text-amber-700'
                                    : 'text-blue-700'
                                }`}>
                                  {error.severity === 'error' ? 'Error' : error.severity === 'warning' ? 'Warning' : 'Suggestion'}
                                </span>
                              </div>
                              <div className="mb-2">
                                <p className="text-sm text-gray-600 mb-1">
                                  <span className="line-through text-red-600">{error.original}</span>
                                </p>
                                <p className="text-sm font-semibold text-gray-900">
                                  <span className="text-emerald-600">→</span> {error.suggestion}
                                </p>
                              </div>
                              <p className="text-xs text-gray-600 mt-2">{error.explanation}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-blue-600" />
                          General Suggestions
                        </h3>
                        <ul className="space-y-2">
                          {grammarCheck.suggestions.map((suggestion, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                        <Download className="h-4 w-4" />
                        Download Grammar Report
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                      <SpellCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm font-medium text-gray-600">
                        Paste student writing and click "Check Grammar" to identify errors and get suggestions
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Writing Feedback Tab */}
          {activeTab === 'feedback' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade Level
                    </label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    >
                      {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                        <option key={grade} value={grade}>
                          Grade {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Writing Type
                    </label>
                    <select
                      value={writingType}
                      onChange={(e) => setWritingType(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    >
                      <option value="narrative">Narrative</option>
                      <option value="persuasive">Persuasive</option>
                      <option value="expository">Expository</option>
                      <option value="descriptive">Descriptive</option>
                      <option value="creative">Creative</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student Writing Sample
                    </label>
                    <textarea
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Paste student writing for comprehensive feedback..."
                      rows={12}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    />
                    <button
                      onClick={handleWritingFeedback}
                      disabled={!textInput.trim() || isAnalyzing}
                      className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Generate Feedback
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-4 max-h-[800px] overflow-y-auto">
                  {writingFeedback ? (
                    <div className="space-y-4">
                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          Strengths
                        </h3>
                        <ul className="space-y-2">
                          {writingFeedback.strengths.map((strength, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-amber-600" />
                          Areas for Improvement
                        </h3>
                        <ul className="space-y-2">
                          {writingFeedback.areasForImprovement.map((area, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                              <span>{area}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-blue-600" />
                          Suggestions
                        </h3>
                        <ul className="space-y-2">
                          {writingFeedback.suggestions.map((suggestion, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-white p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Award className="h-5 w-5 text-purple-600" />
                          Rubric Score
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                          {Object.entries(writingFeedback.rubricScore).map(([category, score]) => (
                            <div key={category} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700 capitalize">{category}</span>
                                <span className="text-sm font-bold text-gray-900">{score}/5</span>
                              </div>
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-emerald-600 rounded-full transition-all"
                                  style={{ width: `${(score / 5) * 100}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className="text-base font-semibold text-gray-900">Overall Score</span>
                            <span className="text-2xl font-bold text-gray-900">
                              {(
                                Object.values(writingFeedback.rubricScore).reduce((a, b) => a + b, 0) /
                                Object.values(writingFeedback.rubricScore).length
                              ).toFixed(1)}
                              /5
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Palette className="h-5 w-5 text-purple-600" />
                          Style Analysis
                        </h3>
                        <div className="space-y-3">
                          {Object.entries(writingFeedback.styleAnalysis).map(([aspect, analysis]) => (
                            <div key={aspect} className="bg-white rounded-lg p-3 border border-purple-200">
                              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 capitalize">
                                {aspect.replace(/([A-Z])/g, ' $1').trim()}
                              </p>
                              <p className="text-sm text-gray-700">{analysis}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                        <Download className="h-4 w-4" />
                        Download Feedback Report
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                      <FileCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm font-medium text-gray-600">
                        Paste student writing and get comprehensive feedback with rubric scoring
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Peer Review Guide Tab */}
          {activeTab === 'peer' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Users className="h-6 w-6 text-indigo-600" />
                      Peer Review Guide Generator
                    </h3>
                    <p className="text-sm text-gray-600">
                      Create comprehensive peer review guides with criteria, protocols, and sentence starters.
                    </p>
                  </div>
                  <button
                    onClick={handlePeerReviewGuide}
                    disabled={isAnalyzing}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        {hasGeneratedPeerGuide ? 'Regenerate Guide' : 'Generate Guide'}
                      </>
                    )}
                  </button>
                </div>

                {peerReviewGuide && (
                  <div className="space-y-6 max-h-[800px] overflow-y-auto">
                    {peerReviewGuide.criteria.map((criterion, idx) => (
                      <div key={idx} className="bg-white rounded-xl p-6 border border-indigo-200">
                        <h4 className="text-lg font-bold text-gray-900 mb-4">{criterion.category}</h4>
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Questions to Consider:</p>
                          <ul className="space-y-1">
                            {criterion.questions.map((q, qIdx) => (
                              <li key={qIdx} className="text-sm text-gray-700 flex items-start gap-2">
                                <MessageSquare className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                                <span>{q}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Checklist:</p>
                          <ul className="space-y-1">
                            {criterion.checklist.map((item, itemIdx) => (
                              <li key={itemIdx} className="text-sm text-gray-700 flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}

                    <div className="bg-white rounded-xl p-6 border border-indigo-200">
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Peer Review Protocols</h4>
                      <ul className="space-y-2">
                        {peerReviewGuide.protocols.map((protocol, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-semibold">
                              {idx + 1}
                            </span>
                            <span>{protocol}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-indigo-200">
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Sentence Starters</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">Praise:</p>
                          <ul className="space-y-1">
                            {peerReviewGuide.sentenceStarters.praise.map((starter, idx) => (
                              <li key={idx} className="text-sm text-gray-700 bg-green-50 rounded-lg p-2 border border-green-200">
                                "{starter}"
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">Suggestion:</p>
                          <ul className="space-y-1">
                            {peerReviewGuide.sentenceStarters.suggestion.map((starter, idx) => (
                              <li key={idx} className="text-sm text-gray-700 bg-amber-50 rounded-lg p-2 border border-amber-200">
                                "{starter}"
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">Question:</p>
                          <ul className="space-y-1">
                            {peerReviewGuide.sentenceStarters.question.map((starter, idx) => (
                              <li key={idx} className="text-sm text-gray-700 bg-blue-50 rounded-lg p-2 border border-blue-200">
                                "{starter}"
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                      <Download className="h-4 w-4" />
                      Download Peer Review Guide
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Grammar Lessons Tab */}
          {activeTab === 'lessons' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                      Interactive Grammar Lessons
                    </h3>
                    <p className="text-sm text-gray-600">
                      Access comprehensive grammar lessons with explanations, examples, and practice exercises.
                    </p>
                  </div>
                  <button
                    onClick={handleGrammarLesson}
                    disabled={isAnalyzing}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        {hasGeneratedLesson ? 'Generate New Lesson' : 'Generate Lesson'}
                      </>
                    )}
                  </button>
                </div>

                {grammarLesson && (
                  <div className="space-y-6 bg-white rounded-xl p-6 border border-blue-200">
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900 mb-3">{grammarLesson.topic}</h4>
                      <p className="text-gray-700 leading-relaxed">{grammarLesson.explanation}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-lg bg-green-50 p-4 border border-green-200">
                        <p className="text-sm font-semibold text-green-700 mb-2">✓ Correct Examples:</p>
                        <ul className="space-y-1">
                          {grammarLesson.examples.correct.map((ex, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{ex}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                        <p className="text-sm font-semibold text-red-700 mb-2">✗ Incorrect Examples:</p>
                        <ul className="space-y-1">
                          {grammarLesson.examples.incorrect.map((ex, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                              <span>{ex}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">Practice Exercises</h5>
                      <div className="space-y-4">
                        {grammarLesson.practice.map((exercise, idx) => (
                          <div key={idx} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <p className="text-sm font-semibold text-gray-900 mb-3">{exercise.question}</p>
                            <div className="space-y-2">
                              {exercise.options.map((option, optIdx) => (
                                <button
                                  key={optIdx}
                                  className="w-full text-left p-3 rounded-lg border-2 border-gray-200 bg-white hover:border-blue-300 transition"
                                >
                                  <span className="text-sm text-gray-700">{String.fromCharCode(65 + optIdx)}. {option}</span>
                                </button>
                              ))}
                            </div>
                            <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                              <p className="text-xs font-semibold text-blue-700 mb-1">Explanation:</p>
                              <p className="text-sm text-blue-800">{exercise.explanation}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Writing Prompts Tab */}
          {activeTab === 'prompts' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-purple-600" />
                  Writing Prompt Generator
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                    >
                      {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                        <option key={grade} value={grade}>
                          Grade {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prompt Type</label>
                    <select className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100">
                      <option>Narrative</option>
                      <option>Persuasive</option>
                      <option>Expository</option>
                      <option>Descriptive</option>
                      <option>Creative</option>
                    </select>
                  </div>
                </div>
                <button className="w-full rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700 flex items-center justify-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Generate Writing Prompts
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    title: 'A Day in the Life',
                    prompt: 'Write a narrative about a day in the life of an object (like a pencil, a book, or a shoe). What adventures does it have?',
                    type: 'Narrative',
                    grade: '3-5',
                  },
                  {
                    title: 'School Uniform Debate',
                    prompt: 'Write a persuasive essay arguing for or against school uniforms. Use evidence and examples to support your position.',
                    type: 'Persuasive',
                    grade: '6-8',
                  },
                  {
                    title: 'My Favorite Place',
                    prompt: 'Describe your favorite place using all five senses. What do you see, hear, smell, taste, and feel there?',
                    type: 'Descriptive',
                    grade: '3-5',
                  },
                ].map((prompt, idx) => (
                  <div key={idx} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                        {prompt.type}
                      </span>
                      <span className="text-xs text-gray-500">Grade {prompt.grade}</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{prompt.title}</h4>
                    <p className="text-sm text-gray-600 mb-4">{prompt.prompt}</p>
                    <div className="flex gap-2">
                      <button className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                        Use Prompt
                      </button>
                      <button className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rubric Builder Tab */}
          {activeTab === 'rubric' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-teal-50 to-emerald-50 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ClipboardList className="h-6 w-6 text-teal-600" />
                  Rubric Builder
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Create comprehensive writing rubrics tailored to your grade level and writing type.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                    >
                      {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                        <option key={grade} value={grade}>
                          Grade {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Writing Type</label>
                    <select
                      value={writingType}
                      onChange={(e) => setWritingType(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                    >
                      <option value="narrative">Narrative</option>
                      <option value="persuasive">Persuasive</option>
                      <option value="expository">Expository</option>
                      <option value="descriptive">Descriptive</option>
                      <option value="creative">Creative</option>
                    </select>
                  </div>
                  <button className="w-full rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-700 flex items-center justify-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Generate Rubric
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Features Section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Additional Premium Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 mb-4">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress Tracking</h3>
            <p className="text-sm text-gray-600">
              Monitor student writing progress over time with detailed analytics and improvement reports.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-600 mb-4">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Standards Alignment</h3>
            <p className="text-sm text-gray-600">
              All tools align with Common Core ELA writing standards and state-specific curriculum requirements.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-cyan-50 to-blue-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600 mb-4">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Chat</h3>
            <p className="text-sm text-gray-600">
              Get instant answers to grammar and writing questions with personalized teaching recommendations.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-4">
              <Download className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Export & Share</h3>
            <p className="text-sm text-gray-600">
              Export feedback reports, rubrics, and lesson plans in multiple formats for easy sharing.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Differentiation Tools</h3>
            <p className="text-sm text-gray-600">
              Automatically generate differentiated writing activities for students at various skill levels.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 mb-4">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Time-Saving Templates</h3>
            <p className="text-sm text-gray-600">
              Access ready-to-use rubrics, peer review guides, and grammar lesson templates.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GrammarWritingMentor



