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
} from 'lucide-react'
import * as chatbotApi from '../../api/chatbots'
import { useSnackbar } from '../../hooks/useSnackbar'
import { useCapabilityCreditGate } from '../../hooks/useCapabilityCreditGate'
import { useChatbotHistorySession } from '../../hooks/useChatbotHistorySession'
import NoCreditsCard from '../../components/NoCreditsCard'

import { useTranslation } from 'react-i18next'
import { resolveApiMessage } from '../../i18n/resolveApiMessage'
interface TextAnalysis {
  readingLevel: string
  complexity: string
  wordCount: number
  sentenceCount: number
  avgWordsPerSentence: number
  vocabularyLevel: string
  gradeLevel: string
  readabilityScore: number
}

interface GuidedReadingStrategy {
  beforeReading: string[]
  duringReading: string[]
  afterReading: string[]
  vocabulary: string[]
  comprehensionQuestions: {
    literal: string[]
    inferential: string[]
    evaluative: string[]
  }
}

interface WritingFeedback {
  strengths: string[]
  areasForImprovement: string[]
  suggestions: string[]
  rubricScore: {
    content: number
    organization: number
    language: number
    conventions: number
  }
}

const LiteracyLabCoach = () => {
  const { t } = useTranslation()
  const { toast } = useSnackbar()
  const { creditError, clearCreditError, captureApiError, runWithCredits } = useCapabilityCreditGate()
  const CHATBOT_SLUG = 'literacy-lab-coach'
  
  const [activeTab, setActiveTab] = useState<'analyze' | 'guided' | 'writing' | 'prompts' | 'vocabulary'>('analyze')
  const [textInput, setTextInput] = useState('')
  const [gradeLevel, setGradeLevel] = useState('5')
  const [subject, setSubject] = useState('English')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<TextAnalysis | null>(null)
  const [guidedReading, setGuidedReading] = useState<GuidedReadingStrategy | null>(null)
  const [writingFeedback, setWritingFeedback] = useState<WritingFeedback | null>(null)

  const LITERACY_CAP_TABS: Record<string, 'analyze' | 'guided' | 'writing'> = {
    text_complexity: 'analyze',
    guided_reading: 'guided',
    writing_feedback: 'writing',
  }

  const { conversationIdForActiveTab, pinFromResponse } = useChatbotHistorySession({
    slug: CHATBOT_SLUG,
    activeTab,
    capabilityKeyToTab: LITERACY_CAP_TABS,
    onRestore: async ({ tabKey, userContent, assistantContent, assistantMetadata }) => {
      const cap = assistantMetadata?.capability_key as string | undefined
      const tab: 'analyze' | 'guided' | 'writing' =
        tabKey === 'analyze' || tabKey === 'guided' || tabKey === 'writing'
          ? tabKey
          : cap && LITERACY_CAP_TABS[cap]
            ? LITERACY_CAP_TABS[cap]
            : 'analyze'
      setActiveTab(tab)
      if (userContent) setTextInput(userContent)
      try {
        const data = JSON.parse(assistantContent)
        setAnalysis(null)
        setGuidedReading(null)
        setWritingFeedback(null)
        if (tab === 'analyze') setAnalysis(data as TextAnalysis)
        else if (tab === 'guided') setGuidedReading(data as GuidedReadingStrategy)
        else setWritingFeedback(data as WritingFeedback)
      } catch {
        toast.info(t('literacyLabCoach.couldNotRestoreSavedOutputFromHistory'))
      }
    },
  })

  const handleTextAnalysis = async () => {
    if (!textInput.trim()) {
      toast.error(t('literacyLabCoach.pleaseEnterTextToAnalyze'))
      return
    }
    
    setIsAnalyzing(true)
    clearCreditError()
    
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(
        CHATBOT_SLUG,
        'text_complexity',
        {
          input: textInput,
          input_type: 'text',
          parameters: {
            grade_level: gradeLevel,
            subject: subject,
          },
          conversation_id: conversationIdForActiveTab ?? undefined,
        }
      ))
      if (response == null) return
      
      // Response should match TextAnalysis interface
      setAnalysis(response.result as TextAnalysis)
      pinFromResponse(response.conversation_id)
      toast.success(t('literacyLabCoach.textAnalysisCompleted'))
    } catch (error: any) {
      if (captureApiError(error)) return
      console.error('Error analyzing text:', error)
      const errorMessage = resolveApiMessage(
        t,
        error?.detail || error?.message || 'Failed to analyze text',
      )
      toast.error(errorMessage)
      
      // Show upgrade message if premium required
      if (error?.status === 403 || errorMessage.includes('Premium')) {
        toast.info(t('literacyLabCoach.upgradeToPremiumToUseThisFeature'), { duration: 5000 })
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generateGuidedReading = async () => {
    if (!textInput.trim()) {
      toast.error(t('literacyLabCoach.pleaseEnterTextForGuidedReading'))
      return
    }
    
    setIsAnalyzing(true)
    clearCreditError()
    
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(
        CHATBOT_SLUG,
        'guided_reading',
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
      
      setGuidedReading(response.result as GuidedReadingStrategy)
      pinFromResponse(response.conversation_id)
      toast.success(t('literacyLabCoach.guidedReadingStrategiesGenerated'))
    } catch (error: any) {
      if (captureApiError(error)) return
      console.error('Error generating guided reading:', error)
      const errorMessage = resolveApiMessage(
        t,
        error?.detail || error?.message || 'Failed to generate guided reading',
      )
      toast.error(errorMessage)
      
      if (error?.status === 403 || errorMessage.includes('Premium')) {
        toast.info(t('literacyLabCoach.upgradeToPremiumToUseThisFeature'), { duration: 5000 })
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generateWritingFeedback = async () => {
    if (!textInput.trim()) {
      toast.error(t('literacyLabCoach.pleaseEnterWritingSampleForFeedback'))
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
          },
          conversation_id: conversationIdForActiveTab ?? undefined,
        }
      ))
      if (response == null) return
      
      setWritingFeedback(response.result as WritingFeedback)
      pinFromResponse(response.conversation_id)
      toast.success(t('literacyLabCoach.writingFeedbackGenerated'))
    } catch (error: any) {
      if (captureApiError(error)) return
      console.error('Error generating feedback:', error)
      const errorMessage = resolveApiMessage(
        t,
        error?.detail || error?.message || 'Failed to generate writing feedback',
      )
      toast.error(errorMessage)
      
      if (error?.status === 403 || errorMessage.includes('Premium')) {
        toast.info(t('literacyLabCoach.upgradeToPremiumToUseThisFeature'), { duration: 5000 })
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  const tabs = [
    { id: 'analyze', label: t('literacyLabCoach.tabs.analyze'), icon: FileText },
    { id: 'guided', label: t('literacyLabCoach.tabs.guided'), icon: BookOpen },
    { id: 'writing', label: t('literacyLabCoach.tabs.writing'), icon: PenTool },
    { id: 'prompts', label: t('literacyLabCoach.tabs.prompts'), icon: Lightbulb },
    { id: 'vocabulary', label: t('literacyLabCoach.tabs.vocabulary'), icon: BookMarked },
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
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">{t('literacyLabCoach.literacyLabCoach')}</h1>
                  <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    <Star className="h-3 w-3" /> 4.9★
                  </span>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    <Lock className="inline h-3 w-3 mr-1" />{t('literacyLabCoach.premium')}</span>
                </div>
                <p className="mt-2 text-blue-100">{t('literacyLabCoach.comprehensiveLiteracySupportWithTextComplexityAnalysisG')}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
                <Target className="h-4 w-4" />
                <span>{t('literacyLabCoach.textComplexityAnalysis')}</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
                <Users className="h-4 w-4" />
                <span>{t('literacyLabCoach.guidedReadingStrategies')}</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
                <PenTool className="h-4 w-4" />
                <span>{t('literacyLabCoach.writingFeedbackRubrics')}</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
                <TrendingUp className="h-4 w-4" />
                <span>{t('literacyLabCoach.progressTracking')}</span>
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
              <p className="text-sm font-medium text-gray-600">{t('literacyLabCoach.textsAnalyzed')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">247</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <FileText className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('literacyLabCoach.studentsSupported')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">1,234</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('literacyLabCoach.avgReadingLevel')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{t('literacyLabCoach.grade52')}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('literacyLabCoach.writingScore')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">3.8/5</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
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
                      ? 'border-blue-600 text-blue-600'
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
          {/* Text Analysis Tab */}
          {activeTab === 'analyze' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('literacyLabCoach.gradeLevel')}</label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                        <option key={grade} value={grade}>
                          {t('common.gradeOption', { grade })}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('literacyLabCoach.pasteOrTypeTextForAnalysis')}</label>
                    <textarea
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder={t('literacyLabCoach.enterTheTextYouWantToAnalyzeForReadingLevel')}
                      rows={12}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        {textInput.split(/\s+/).filter(w => w.length > 0).length} words
                      </p>
                      <button
                        onClick={handleTextAnalysis}
                        disabled={!textInput.trim() || isAnalyzing}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isAnalyzing ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />{t('literacyLabCoach.analyzing')}</>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" />{t('literacyLabCoach.analyzeText')}</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {analysis ? (
                    <div className="space-y-4">
                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-blue-600" />{t('literacyLabCoach.textComplexityAnalysis')}</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="rounded-lg bg-white p-4 border border-gray-200">
                            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">{t('literacyLabCoach.readingLevel')}</p>
                            <p className="text-xl font-bold text-gray-900 mt-1">{analysis.readingLevel ?? 'N/A'}</p>
                          </div>
                          <div className="rounded-lg bg-white p-4 border border-gray-200">
                            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">{t('literacyLabCoach.complexity')}</p>
                            <p className="text-xl font-bold text-gray-900 mt-1">{analysis.complexity ?? 'N/A'}</p>
                          </div>
                          <div className="rounded-lg bg-white p-4 border border-gray-200">
                            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">{t('literacyLabCoach.wordCount')}</p>
                            <p className="text-xl font-bold text-gray-900 mt-1">{analysis.wordCount?.toLocaleString() ?? 0}</p>
                          </div>
                          <div className="rounded-lg bg-white p-4 border border-gray-200">
                            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">{t('literacyLabCoach.sentences')}</p>
                            <p className="text-xl font-bold text-gray-900 mt-1">{analysis.sentenceCount ?? 0}</p>
                          </div>
                          <div className="rounded-lg bg-white p-4 border border-gray-200">
                            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">{t('literacyLabCoach.avgWordsSentence')}</p>
                            <p className="text-xl font-bold text-gray-900 mt-1">{analysis.avgWordsPerSentence ?? 0}</p>
                          </div>
                          <div className="rounded-lg bg-white p-4 border border-gray-200">
                            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">{t('literacyLabCoach.readabilityScore')}</p>
                            <p className="text-xl font-bold text-gray-900 mt-1">{analysis.readabilityScore ?? 0}/100</p>
                          </div>
                        </div>
                        <div className="mt-4 rounded-lg bg-white p-4 border border-gray-200">
                          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">{t('literacyLabCoach.gradeLevelMatch')}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-600 rounded-full"
                                style={{ width: `${((parseInt(analysis.gradeLevel || '5') || 5) / 12) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-gray-900">{analysis.gradeLevel ?? 'N/A'}</span>
                          </div>
                        </div>
                        <div className="mt-4 rounded-lg bg-white p-4 border border-gray-200">
                          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">{t('literacyLabCoach.vocabularyLevel')}</p>
                          <p className="text-lg font-semibold text-gray-900">{analysis.vocabularyLevel ?? 'N/A'}</p>
                        </div>
                      </div>
                      <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                        <Download className="h-4 w-4" />{t('literacyLabCoach.downloadAnalysisReport')}</button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm font-medium text-gray-600">{t('literacyLabCoach.enterTextAndClickAnalyzeTextToSeeDetailedComplexity')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Guided Reading Tab */}
          {activeTab === 'guided' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('literacyLabCoach.gradeLevel')}</label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                        <option key={grade} value={grade}>
                          {t('common.gradeOption', { grade })}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('literacyLabCoach.textForGuidedReading')}</label>
                    <textarea
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder={t('literacyLabCoach.enterTheTextYouWantToCreateGuidedReadingStrategies')}
                      rows={12}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                    <button
                      onClick={generateGuidedReading}
                      disabled={!textInput.trim() || isAnalyzing}
                      className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />{t('literacyLabCoach.generating')}</>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />{t('literacyLabCoach.generateGuidedReadingPlan')}</>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {guidedReading ? (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-green-600" />{t('literacyLabCoach.beforeReading')}</h3>
                        <ul className="space-y-2">
                          {(guidedReading.beforeReading || []).map((strategy, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{strategy}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <MessageSquare className="h-5 w-5 text-blue-600" />{t('literacyLabCoach.duringReading')}</h3>
                        <ul className="space-y-2">
                          {(guidedReading.duringReading || []).map((strategy, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span>{strategy}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Target className="h-5 w-5 text-purple-600" />{t('literacyLabCoach.afterReading')}</h3>
                        <ul className="space-y-2">
                          {(guidedReading.afterReading || []).map((strategy, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                              <span>{strategy}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <BookMarked className="h-5 w-5 text-amber-600" />{t('literacyLabCoach.keyVocabulary')}</h3>
                        <ul className="space-y-2">
                          {(guidedReading.vocabulary || []).map((word, idx) => (
                            <li key={idx} className="text-sm text-gray-700">
                              <span className="font-semibold text-gray-900">{word.split(' - ')[0]}</span>
                              {word.includes(' - ') && (
                                <span className="text-gray-600"> - {word.split(' - ')[1]}</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-white p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-indigo-600" />{t('literacyLabCoach.comprehensionQuestions')}</h3>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">{t('literacyLabCoach.literalQuestions')}</p>
                            <ul className="space-y-1">
                              {(guidedReading.comprehensionQuestions?.literal || []).map((q, idx) => (
                                <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                  <span className="text-indigo-600 mt-0.5">•</span>
                                  <span>{q}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">{t('literacyLabCoach.inferentialQuestions')}</p>
                            <ul className="space-y-1">
                              {(guidedReading.comprehensionQuestions?.inferential || []).map((q, idx) => (
                                <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                  <span className="text-indigo-600 mt-0.5">•</span>
                                  <span>{q}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">{t('literacyLabCoach.evaluativeQuestions')}</p>
                            <ul className="space-y-1">
                              {(guidedReading.comprehensionQuestions?.evaluative || []).map((q, idx) => (
                                <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                  <span className="text-indigo-600 mt-0.5">•</span>
                                  <span>{q}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                        <Download className="h-4 w-4" />{t('literacyLabCoach.downloadGuidedReadingPlan')}</button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm font-medium text-gray-600">{t('literacyLabCoach.enterTextAndGenerateAComprehensiveGuidedReadingStrategy')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Writing Feedback Tab */}
          {activeTab === 'writing' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('literacyLabCoach.gradeLevel')}</label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                        <option key={grade} value={grade}>
                          {t('common.gradeOption', { grade })}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('literacyLabCoach.studentWritingSample')}</label>
                    <textarea
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder={t('literacyLabCoach.pasteStudentWritingSample')}
                      rows={12}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                    <button
                      onClick={generateWritingFeedback}
                      disabled={!textInput.trim() || isAnalyzing}
                      className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />{t('literacyLabCoach.analyzing')}</>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />{t('literacyLabCoach.generateWritingFeedback')}</>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {writingFeedback ? (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />{t('literacyLabCoach.strengths')}</h3>
                        <ul className="space-y-2">
                          {(writingFeedback.strengths || []).map((strength, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-amber-600" />{t('literacyLabCoach.areasForImprovement')}</h3>
                        <ul className="space-y-2">
                          {(writingFeedback.areasForImprovement || []).map((area, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                              <span>{area}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-blue-600" />{t('literacyLabCoach.suggestions')}</h3>
                        <ul className="space-y-2">
                          {(writingFeedback.suggestions || []).map((suggestion, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-white p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Award className="h-5 w-5 text-purple-600" />{t('literacyLabCoach.rubricScore')}</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700">{t('literacyLabCoach.content')}</span>
                              <span className="text-sm font-bold text-gray-900">
                                {writingFeedback.rubricScore?.content ?? 0}/5
                              </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-full"
                                style={{ width: `${((writingFeedback.rubricScore?.content ?? 0) / 5) * 100}%` }}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700">{t('literacyLabCoach.organization')}</span>
                              <span className="text-sm font-bold text-gray-900">
                                {writingFeedback.rubricScore?.organization ?? 0}/5
                              </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-600 rounded-full"
                                style={{ width: `${((writingFeedback.rubricScore?.organization ?? 0) / 5) * 100}%` }}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700">{t('literacyLabCoach.language')}</span>
                              <span className="text-sm font-bold text-gray-900">
                                {writingFeedback.rubricScore?.language ?? 0}/5
                              </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-purple-600 rounded-full"
                                style={{ width: `${((writingFeedback.rubricScore?.language ?? 0) / 5) * 100}%` }}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700">{t('literacyLabCoach.conventions')}</span>
                              <span className="text-sm font-bold text-gray-900">
                                {writingFeedback.rubricScore?.conventions ?? 0}/5
                              </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-600 rounded-full"
                                style={{ width: `${((writingFeedback.rubricScore?.conventions ?? 0) / 5) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className="text-base font-semibold text-gray-900">{t('literacyLabCoach.overallScore')}</span>
                            <span className="text-2xl font-bold text-gray-900">
                              {(
                                ((writingFeedback.rubricScore?.content ?? 0) +
                                  (writingFeedback.rubricScore?.organization ?? 0) +
                                  (writingFeedback.rubricScore?.language ?? 0) +
                                  (writingFeedback.rubricScore?.conventions ?? 0)) /
                                4
                              ).toFixed(1)}
                              /5
                            </span>
                          </div>
                        </div>
                      </div>

                      <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                        <Download className="h-4 w-4" />{t('literacyLabCoach.downloadFeedbackReport')}</button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                      <PenTool className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm font-medium text-gray-600">{t('literacyLabCoach.pasteStudentWritingAndGetDetailedFeedbackWithRubricScor')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Writing Prompts Tab */}
          {activeTab === 'prompts' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-indigo-600" />{t('literacyLabCoach.writingPromptGenerator')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('literacyLabCoach.gradeLevel')}</label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                        <option key={grade} value={grade}>
                          {t('common.gradeOption', { grade })}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('literacyLabCoach.promptType')}</label>
                    <select className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100">
                      <option>{t('literacyLabCoach.narrative')}</option>
                      <option>{t('literacyLabCoach.persuasive')}</option>
                      <option>{t('literacyLabCoach.expository')}</option>
                      <option>{t('literacyLabCoach.descriptive')}</option>
                      <option>{t('literacyLabCoach.creative')}</option>
                    </select>
                  </div>
                </div>
                <button className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 flex items-center justify-center gap-2">
                  <Sparkles className="h-4 w-4" />{t('literacyLabCoach.generateWritingPrompts')}</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(
                  [
                    { id: 'timeMachine', typeKey: 'literacyLabCoach.narrative' },
                    { id: 'schoolUniform', typeKey: 'literacyLabCoach.persuasive' },
                    { id: 'favoriteSeason', typeKey: 'literacyLabCoach.descriptive' },
                  ] as const
                ).map((sample, idx) => (
                  <div key={idx} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                        {t(sample.typeKey)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {t('common.gradeOption', { grade: t(`literacyLabCoach.samples.${sample.id}.grade`) })}
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{t(`literacyLabCoach.samples.${sample.id}.title`)}</h4>
                    <p className="text-sm text-gray-600 mb-4">{t(`literacyLabCoach.samples.${sample.id}.prompt`)}</p>
                    <div className="flex gap-2">
                      <button className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">{t('literacyLabCoach.usePrompt')}</button>
                      <button className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vocabulary Builder Tab */}
          {activeTab === 'vocabulary' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BookMarked className="h-6 w-6 text-emerald-600" />{t('literacyLabCoach.vocabularyBuilder')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('literacyLabCoach.gradeLevel')}</label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                        <option key={grade} value={grade}>
                          {t('common.gradeOption', { grade })}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('literacyLabCoach.topicTheme')}</label>
                    <input
                      type="text"
                      placeholder={t('literacyLabCoach.eGScienceHistoryLiterature')}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
                <button className="w-full rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 flex items-center justify-center gap-2">
                  <Sparkles className="h-4 w-4" />{t('literacyLabCoach.generateVocabularyList')}</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { word: 'Photosynthesis', definition: 'The process by which plants convert sunlight into energy', example: 'Plants use photosynthesis to make food.' },
                  { word: 'Ecosystem', definition: 'A community of living organisms and their environment', example: 'The forest is a complex ecosystem.' },
                  { word: 'Adaptation', definition: 'A change that helps an organism survive in its environment', example: 'A camel\'s hump is an adaptation for desert life.' },
                ].map((vocab, idx) => (
                  <div key={idx} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-lg font-bold text-gray-900">{vocab.word}</h4>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Star className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{vocab.definition}</p>
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs font-medium text-gray-500 mb-1">{t('literacyLabCoach.example')}</p>
                      <p className="text-sm text-gray-700 italic">"{vocab.example}"</p>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">{t('literacyLabCoach.practice')}</button>
                      <button className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">{t('literacyLabCoach.quiz')}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Features Section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('literacyLabCoach.additionalPremiumFeatures')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-4">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('literacyLabCoach.progressTracking')}</h3>
            <p className="text-sm text-gray-600">{t('literacyLabCoach.monitorStudentReadingAndWritingProgressOverTimeWithDeta')}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('literacyLabCoach.differentiationTools')}</h3>
            <p className="text-sm text-gray-600">{t('literacyLabCoach.automaticallyGenerateDifferentiatedActivitiesForStudent')}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 mb-4">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('literacyLabCoach.standardsAlignment')}</h3>
            <p className="text-sm text-gray-600">{t('literacyLabCoach.allActivitiesAndAssessmentsAlignWithCommonCoreAndState')}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 mb-4">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('literacyLabCoach.timeSavingTemplates')}</h3>
            <p className="text-sm text-gray-600">{t('literacyLabCoach.accessReadyToUseLessonPlansRubricsAndActivityTemplates')}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-cyan-50 to-blue-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600 mb-4">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('literacyLabCoach.aiPoweredChat')}</h3>
            <p className="text-sm text-gray-600">{t('literacyLabCoach.getInstantAnswersToLiteracyQuestionsAndReceivePersonali')}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 mb-4">
              <Download className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('literacyLabCoach.exportShare')}</h3>
            <p className="text-sm text-gray-600">{t('literacyLabCoach.exportReportsLessonPlansAndAssessmentsInMultipleFormats')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiteracyLabCoach



