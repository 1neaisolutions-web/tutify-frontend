import { useCallback, useEffect, useState } from 'react'
import {
  BookOpen,
  RefreshCw,
  Users,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  PenTool,
  Award,
  SpellCheck,
  FileCheck,
  Download,
  Sparkles,
  Palette,
  MessageSquare,
  BarChart3,
  Target,
  BookMarked,
} from 'lucide-react'
import * as chatbotApi from '../../api/chatbots'
import { useSnackbar } from '../../hooks/useSnackbar'
import { useCapabilityCreditGate } from '../../hooks/useCapabilityCreditGate'
import { useChatbotHistorySession } from '../../hooks/useChatbotHistorySession'
import NoCreditsCard from '../../components/NoCreditsCard'
import { CoachWorkspaceShell } from './ai-coach/CoachWorkspaceShell'
import {
  CoachCapabilityRedirect,
  useCoachCapabilityRoute,
} from './ai-coach/useCoachCapabilityRoute'
import { resolveApiMessage } from '../../i18n/resolveApiMessage'

import { useTranslation } from 'react-i18next'
import { GradeSelect } from '@/components/shared/GradeSelect'
import { gradeLevelToChatbotApi } from '@/catalog/adapters/chatbotAdapters'
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
  const { t } = useTranslation()
  const { toast } = useSnackbar()
  const { creditError, clearCreditError, captureApiError, runWithCredits } = useCapabilityCreditGate()
  const CHATBOT_SLUG = 'grammar-writing-mentor'
  const { redirectTo, capability, siblings, category, tabId } = useCoachCapabilityRoute(CHATBOT_SLUG)

  type GrammarTab = 'grammar' | 'feedback' | 'peer' | 'lessons'
  const [activeTab, setActiveTab] = useState<GrammarTab>('grammar')
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

  const GRAMMAR_CAPABILITY_TABS: Record<string, GrammarTab> = {
    grammar_check: 'grammar',
    writing_feedback: 'feedback',
    peer_review_guide: 'peer',
    grammar_lesson: 'lessons',
  }

  const isGrammarTab = useCallback((tab: string): tab is GrammarTab => {
    return tab === 'grammar' || tab === 'feedback' || tab === 'peer' || tab === 'lessons'
  }, [])

  useEffect(() => {
    if (tabId && isGrammarTab(tabId)) setActiveTab(tabId)
  }, [tabId, isGrammarTab])

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
        toast.info(t('grammarWritingMentor.couldNotRestoreSavedOutputFromHistory'))
      }
    },
  })

  const handleGrammarCheck = async () => {
    if (!textInput.trim()) {
      toast.error(t('grammarWritingMentor.pleaseEnterTextToCheck'))
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
            grade_level: gradeLevelToChatbotApi(gradeLevel),
          },
          conversation_id: conversationIdForActiveTab ?? undefined,
        }
      ))
      if (response == null) return
      
      setGrammarCheck(response.result as GrammarCheck)
      pinFromResponse(response.conversation_id)
      toast.success(t('grammarWritingMentor.grammarCheckCompleted'))
    } catch (error: any) {
      if (captureApiError(error)) return
      console.error('Error checking grammar:', error)
      const errorMessage = resolveApiMessage(
        t,
        error?.detail || error?.message || 'Failed to check grammar',
      )
      toast.error(errorMessage)
      
      if (error?.status === 403 || error?.response?.status === 403 || errorMessage.includes('Premium')) {
        toast.info(t('grammarWritingMentor.upgradeToPremiumToUseThisFeature'), { duration: 5000 })
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleWritingFeedback = async () => {
    if (!textInput.trim()) {
      toast.error(t('grammarWritingMentor.pleaseEnterWritingSampleForFeedback'))
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
            grade_level: gradeLevelToChatbotApi(gradeLevel),
            writing_type: writingType,
          },
          conversation_id: conversationIdForActiveTab ?? undefined,
        }
      ))
      if (response == null) return
      
      setWritingFeedback(response.result as WritingFeedback)
      pinFromResponse(response.conversation_id)
      toast.success(t('grammarWritingMentor.writingFeedbackGenerated'))
    } catch (error: any) {
      if (captureApiError(error)) return
      console.error('Error generating feedback:', error)
      const errorMessage = resolveApiMessage(
        t,
        error?.detail || error?.message || 'Failed to generate writing feedback',
      )
      toast.error(errorMessage)
      
      if (error?.status === 403 || error?.response?.status === 403 || errorMessage.includes('Premium')) {
        toast.info(t('grammarWritingMentor.upgradeToPremiumToUseThisFeature'), { duration: 5000 })
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
            grade_level: gradeLevelToChatbotApi(gradeLevel),
          },
          conversation_id: conversationIdForActiveTab ?? undefined,
        }
      ))
      if (response == null) return
      
      setPeerReviewGuide(response.result as PeerReviewGuide)
      setHasGeneratedPeerGuide(true)
      pinFromResponse(response.conversation_id)
      toast.success(t('grammarWritingMentor.peerReviewGuideGenerated'))
    } catch (error: any) {
      if (captureApiError(error)) return
      console.error('Error generating peer review guide:', error)
      const errorMessage = resolveApiMessage(
        t,
        error?.detail || error?.message || 'Failed to generate peer review guide',
      )
      toast.error(errorMessage)
      
      if (error?.status === 403 || error?.response?.status === 403 || errorMessage.includes('Premium')) {
        toast.info(t('grammarWritingMentor.upgradeToPremiumToUseThisFeature'), { duration: 5000 })
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
            grade_level: gradeLevelToChatbotApi(gradeLevel),
          },
          conversation_id: conversationIdForActiveTab ?? undefined,
        }
      ))
      if (response == null) return
      
      setGrammarLesson(response.result as GrammarLesson)
      setHasGeneratedLesson(true)
      pinFromResponse(response.conversation_id)
      toast.success(t('grammarWritingMentor.grammarLessonGenerated'))
    } catch (error: any) {
      if (captureApiError(error)) return
      console.error('Error generating grammar lesson:', error)
      const errorMessage = resolveApiMessage(
        t,
        error?.detail || error?.message || 'Failed to generate grammar lesson',
      )
      toast.error(errorMessage)
      
      if (error?.status === 403 || error?.response?.status === 403 || errorMessage.includes('Premium')) {
        toast.info(t('grammarWritingMentor.upgradeToPremiumToUseThisFeature'), { duration: 5000 })
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleNewTask = () => {
    setTextInput('')
    setGrammarCheck(null)
    setWritingFeedback(null)
    setPeerReviewGuide(null)
    setGrammarLesson(null)
    setHasGeneratedPeerGuide(false)
    setHasGeneratedLesson(false)
  }

  if (redirectTo) return <CoachCapabilityRedirect to={redirectTo} />
  if (!capability) return <CoachCapabilityRedirect to={`/chatbots/${CHATBOT_SLUG}?cap=grammar_check`} />

  const workspaceBody = (
        <div className="space-y-6">
          {/* Grammar Checker Tab */}
          {activeTab === 'grammar' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('grammarWritingMentor.gradeLevel')}</label>
                    <GradeSelect
                      variant="native"
                      value={gradeLevel}
                      onChange={setGradeLevel}
                      label=""
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('grammarWritingMentor.pasteStudentWriting')}</label>
                    <textarea
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder={t('grammarWritingMentor.pasteStudentWritingHereForGrammarCheckingAndSuggestions')}
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
                            <RefreshCw className="h-4 w-4 animate-spin" />{t('grammarWritingMentor.checking')}</>
                        ) : (
                          <>
                            <SpellCheck className="h-4 w-4" />{t('grammarWritingMentor.checkGrammar')}</>
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
                            <SpellCheck className="h-5 w-5 text-emerald-600" />{t('grammarWritingMentor.grammarScore')}</h3>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-emerald-600">{grammarCheck.score}%</p>
                            <p className="text-xs text-gray-600">{t('grammarWritingMentor.overallQuality')}</p>
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
                          <Lightbulb className="h-5 w-5 text-blue-600" />{t('grammarWritingMentor.generalSuggestions')}</h3>
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
                        <Download className="h-4 w-4" />{t('grammarWritingMentor.downloadGrammarReport')}</button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                      <SpellCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm font-medium text-gray-600">{t('grammarWritingMentor.pasteStudentWritingAndClickCheckGrammarToIdentifyErrors')}</p>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('grammarWritingMentor.gradeLevel')}</label>
                    <GradeSelect
                      variant="native"
                      value={gradeLevel}
                      onChange={setGradeLevel}
                      label=""
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('grammarWritingMentor.writingType')}</label>
                    <select
                      value={writingType}
                      onChange={(e) => setWritingType(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    >
                      <option value="narrative">{t('grammarWritingMentor.narrative')}</option>
                      <option value="persuasive">{t('grammarWritingMentor.persuasive')}</option>
                      <option value="expository">{t('grammarWritingMentor.expository')}</option>
                      <option value="descriptive">{t('grammarWritingMentor.descriptive')}</option>
                      <option value="creative">{t('grammarWritingMentor.creative')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('grammarWritingMentor.studentWritingSample')}</label>
                    <textarea
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder={t('grammarWritingMentor.pasteStudentWritingForComprehensiveFeedback')}
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
                          <RefreshCw className="h-4 w-4 animate-spin" />{t('grammarWritingMentor.analyzing')}</>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />{t('grammarWritingMentor.generateFeedback')}</>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-4 max-h-[800px] overflow-y-auto">
                  {writingFeedback ? (
                    <div className="space-y-4">
                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />{t('grammarWritingMentor.strengths')}</h3>
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
                          <AlertCircle className="h-5 w-5 text-amber-600" />{t('grammarWritingMentor.areasForImprovement')}</h3>
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
                          <Lightbulb className="h-5 w-5 text-blue-600" />{t('grammarWritingMentor.suggestions')}</h3>
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
                          <Award className="h-5 w-5 text-purple-600" />{t('grammarWritingMentor.rubricScore')}</h3>
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
                            <span className="text-base font-semibold text-gray-900">{t('grammarWritingMentor.overallScore')}</span>
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
                          <Palette className="h-5 w-5 text-purple-600" />{t('grammarWritingMentor.styleAnalysis')}</h3>
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
                        <Download className="h-4 w-4" />{t('grammarWritingMentor.downloadFeedbackReport')}</button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                      <FileCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm font-medium text-gray-600">{t('grammarWritingMentor.pasteStudentWritingAndGetComprehensiveFeedbackWithRubri')}</p>
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
                      <Users className="h-6 w-6 text-indigo-600" />{t('grammarWritingMentor.peerReviewGuideGenerator')}</h3>
                    <p className="text-sm text-gray-600">{t('grammarWritingMentor.createComprehensivePeerReviewGuidesWithCriteriaProtocol')}</p>
                  </div>
                  <button
                    onClick={handlePeerReviewGuide}
                    disabled={isAnalyzing}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />{t('grammarWritingMentor.generating')}</>
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
                          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">{t('grammarWritingMentor.questionsToConsider')}</p>
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
                          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">{t('grammarWritingMentor.checklist')}</p>
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
                      <h4 className="text-lg font-bold text-gray-900 mb-4">{t('grammarWritingMentor.peerReviewProtocols')}</h4>
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
                      <h4 className="text-lg font-bold text-gray-900 mb-4">{t('grammarWritingMentor.sentenceStarters')}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">{t('grammarWritingMentor.praise')}</p>
                          <ul className="space-y-1">
                            {peerReviewGuide.sentenceStarters.praise.map((starter, idx) => (
                              <li key={idx} className="text-sm text-gray-700 bg-green-50 rounded-lg p-2 border border-green-200">
                                "{starter}"
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">{t('grammarWritingMentor.suggestion')}</p>
                          <ul className="space-y-1">
                            {peerReviewGuide.sentenceStarters.suggestion.map((starter, idx) => (
                              <li key={idx} className="text-sm text-gray-700 bg-amber-50 rounded-lg p-2 border border-amber-200">
                                "{starter}"
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">{t('grammarWritingMentor.question')}</p>
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
                      <Download className="h-4 w-4" />{t('grammarWritingMentor.downloadPeerReviewGuide')}</button>
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
                      <BookOpen className="h-6 w-6 text-blue-600" />{t('grammarWritingMentor.interactiveGrammarLessons')}</h3>
                    <p className="text-sm text-gray-600">{t('grammarWritingMentor.accessComprehensiveGrammarLessonsWithExplanationsExampl')}</p>
                  </div>
                  <button
                    onClick={handleGrammarLesson}
                    disabled={isAnalyzing}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />{t('grammarWritingMentor.generating')}</>
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
                        <p className="text-sm font-semibold text-green-700 mb-2">{t('grammarWritingMentor.correctExamples')}</p>
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
                        <p className="text-sm font-semibold text-red-700 mb-2">{t('grammarWritingMentor.incorrectExamples')}</p>
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
                      <h5 className="text-lg font-semibold text-gray-900 mb-4">{t('grammarWritingMentor.practiceExercises')}</h5>
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
                              <p className="text-xs font-semibold text-blue-700 mb-1">{t('grammarWritingMentor.explanation')}</p>
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

        </div>
  )

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
      <CoachWorkspaceShell
        capability={capability}
        siblings={siblings}
        categoryKey={category?.key}
        categoryLabel={category?.label}
        onNewTask={handleNewTask}
      >
        {workspaceBody}
      </CoachWorkspaceShell>
    </div>
  )
}

export default GrammarWritingMentor



