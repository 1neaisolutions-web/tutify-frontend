import { useCallback, useEffect, useState } from 'react'
import {
  BookOpen,
  FileText,
  Sparkles,
  Download,
  RefreshCw,
  Users,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  PenTool,
  Award,
  BarChart3,
  MessageSquare,
  BookMarked,
  Target,
  Palette,
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

import { useTranslation } from 'react-i18next'
import { GradeSelect } from '@/components/shared/GradeSelect'
import { gradeLevelToChatbotApi } from '@/catalog/adapters/chatbotAdapters'
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

type LiteracyTab = 'analyze' | 'guided' | 'writing'

const LiteracyLabCoach = () => {
  const { t } = useTranslation()
  const { toast } = useSnackbar()
  const { creditError, clearCreditError, captureApiError, runWithCredits } = useCapabilityCreditGate()
  const CHATBOT_SLUG = 'literacy-lab-coach'
  const { redirectTo, capability, siblings, category, tabId } = useCoachCapabilityRoute(CHATBOT_SLUG)

  const [activeTab, setActiveTab] = useState<LiteracyTab>('analyze')
  const [textInput, setTextInput] = useState('')
  const [gradeLevel, setGradeLevel] = useState('5')
  const [subject, setSubject] = useState('English')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<TextAnalysis | null>(null)
  const [guidedReading, setGuidedReading] = useState<GuidedReadingStrategy | null>(null)
  const [writingFeedback, setWritingFeedback] = useState<WritingFeedback | null>(null)

  const LITERACY_CAP_TABS: Record<string, LiteracyTab> = {
    text_complexity: 'analyze',
    guided_reading: 'guided',
    writing_feedback: 'writing',
  }

  const isLiteracyTab = useCallback((tab: string): tab is LiteracyTab => {
    return tab === 'analyze' || tab === 'guided' || tab === 'writing'
  }, [])

  useEffect(() => {
    if (tabId && isLiteracyTab(tabId)) setActiveTab(tabId)
  }, [tabId, isLiteracyTab])

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
            grade_level: gradeLevelToChatbotApi(gradeLevel),
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
            grade_level: gradeLevelToChatbotApi(gradeLevel),
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
            grade_level: gradeLevelToChatbotApi(gradeLevel),
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

  const downloadTextFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleDownloadAnalysisReport = () => {
    if (!analysis) return
    const lines = [
      'Text Complexity Analysis',
      '',
      `Reading level: ${analysis.readingLevel ?? 'N/A'}`,
      `Complexity: ${analysis.complexity ?? 'N/A'}`,
      `Word count: ${analysis.wordCount ?? 0}`,
      `Sentence count: ${analysis.sentenceCount ?? 0}`,
      `Avg words per sentence: ${analysis.avgWordsPerSentence ?? 0}`,
      `Readability score: ${analysis.readabilityScore ?? 0}/100`,
      `Grade level match: ${analysis.gradeLevel ?? 'N/A'}`,
      `Vocabulary level: ${analysis.vocabularyLevel ?? 'N/A'}`,
    ]
    downloadTextFile('text-complexity-analysis.txt', lines.join('\n'))
  }

  const handleDownloadGuidedReadingPlan = () => {
    if (!guidedReading) return
    const lines = [
      'Guided Reading Plan',
      '',
      'Before Reading:',
      ...(guidedReading.beforeReading || []).map((s) => `- ${s}`),
      '',
      'During Reading:',
      ...(guidedReading.duringReading || []).map((s) => `- ${s}`),
      '',
      'After Reading:',
      ...(guidedReading.afterReading || []).map((s) => `- ${s}`),
      '',
      'Key Vocabulary:',
      ...(guidedReading.vocabulary || []).map((s) => `- ${s}`),
      '',
      'Comprehension Questions (Literal):',
      ...(guidedReading.comprehensionQuestions?.literal || []).map((s) => `- ${s}`),
      '',
      'Comprehension Questions (Inferential):',
      ...(guidedReading.comprehensionQuestions?.inferential || []).map((s) => `- ${s}`),
      '',
      'Comprehension Questions (Evaluative):',
      ...(guidedReading.comprehensionQuestions?.evaluative || []).map((s) => `- ${s}`),
    ]
    downloadTextFile('guided-reading-plan.txt', lines.join('\n'))
  }

  const handleDownloadFeedbackReport = () => {
    if (!writingFeedback) return
    const rubric = writingFeedback.rubricScore
    const overall = rubric
      ? ((rubric.content + rubric.organization + rubric.language + rubric.conventions) / 4).toFixed(1)
      : 'N/A'
    const lines = [
      'Writing Feedback Report',
      '',
      'Strengths:',
      ...(writingFeedback.strengths || []).map((s) => `- ${s}`),
      '',
      'Areas for Improvement:',
      ...(writingFeedback.areasForImprovement || []).map((s) => `- ${s}`),
      '',
      'Suggestions:',
      ...(writingFeedback.suggestions || []).map((s) => `- ${s}`),
      '',
      `Rubric Score — Content: ${rubric?.content ?? 0}/5, Organization: ${rubric?.organization ?? 0}/5, Language: ${rubric?.language ?? 0}/5, Conventions: ${rubric?.conventions ?? 0}/5`,
      `Overall: ${overall}/5`,
    ]
    downloadTextFile('writing-feedback-report.txt', lines.join('\n'))
  }

  const handleShellDownload = () => {
    if (activeTab === 'analyze') handleDownloadAnalysisReport()
    else if (activeTab === 'guided') handleDownloadGuidedReadingPlan()
    else handleDownloadFeedbackReport()
  }

  const handleShellCopy = async () => {
    let text = ''
    if (activeTab === 'analyze' && analysis) text = JSON.stringify(analysis, null, 2)
    if (activeTab === 'guided' && guidedReading) text = JSON.stringify(guidedReading, null, 2)
    if (activeTab === 'writing' && writingFeedback) text = JSON.stringify(writingFeedback, null, 2)
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      toast.success(t('literacyLabCoach.copied', { defaultValue: 'Copied to clipboard' }))
    } catch {
      toast.error(t('literacyLabCoach.copyFailed', { defaultValue: 'Could not copy' }))
    }
  }

  const handleNewTask = () => {
    setTextInput('')
    setAnalysis(null)
    setGuidedReading(null)
    setWritingFeedback(null)
  }

  const hasResult =
    (activeTab === 'analyze' && Boolean(analysis)) ||
    (activeTab === 'guided' && Boolean(guidedReading)) ||
    (activeTab === 'writing' && Boolean(writingFeedback))

  if (redirectTo) return <CoachCapabilityRedirect to={redirectTo} />
  if (!capability) return <CoachCapabilityRedirect to={`/chatbots/${CHATBOT_SLUG}?cap=text_complexity`} />

  const workspaceBody = (
        <div className="space-y-6">
          {activeTab === 'analyze' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('literacyLabCoach.gradeLevel')}</label>
                    <GradeSelect
                      variant="native"
                      value={gradeLevel}
                      onChange={setGradeLevel}
                      label=""
                    />
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
                      <button
                        onClick={handleDownloadAnalysisReport}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                      >
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
                    <GradeSelect
                      variant="native"
                      value={gradeLevel}
                      onChange={setGradeLevel}
                      label=""
                    />
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

                      <button
                        onClick={handleDownloadGuidedReadingPlan}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                      >
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
                    <GradeSelect
                      variant="native"
                      value={gradeLevel}
                      onChange={setGradeLevel}
                      label=""
                    />
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

                      <button
                        onClick={handleDownloadFeedbackReport}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                      >
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
        hasResult={hasResult}
        onCopy={handleShellCopy}
        onDownload={handleShellDownload}
        onNewTask={handleNewTask}
      >
        {workspaceBody}
      </CoachWorkspaceShell>
    </div>
  )
}

export default LiteracyLabCoach
