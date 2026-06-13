import { useState } from 'react'
import {
  Calculator,
  Target,
  TrendingUp,
  Users,
  Sparkles,
  Download,
  RefreshCw,
  CheckCircle2,
  Circle,
  AlertCircle,
  Lightbulb,
  BarChart3,
  Award,
  Clock,
  Star,
  Lock,
  Layers,
  Brain,
  Zap,
  Compass,
  Puzzle,
  LineChart,
  PieChart,
  Grid3x3,
  Shapes,
  BookOpen,
  FileText,
  Eye,
  Wand2,
  Settings,
  Filter,
  GraduationCap,
  Code,
  Ruler,
  Triangle,
  Square,
  PlayCircle,
  Globe,
  MessageSquare,
  Search,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  ClipboardCheck,
} from 'lucide-react'

import * as chatbotApi from '../../api/chatbots'
import { useSnackbar } from '../../hooks/useSnackbar'
import { useCapabilityCreditGate } from '../../hooks/useCapabilityCreditGate'
import { useChatbotHistorySession } from '../../hooks/useChatbotHistorySession'
import NoCreditsCard from '../../components/NoCreditsCard'
import { resolveApiMessage } from '../../i18n/resolveApiMessage'
import {
  mapWordProblemsResult,
  mapRealWorldApplicationResult,
  mapProblemStrategiesResult,
  mapReasoningFrameworkResult,
  type WordProblemUI,
  type RealWorldApplicationUI,
  type ProblemSolvingStrategyUI,
  type ReasoningFrameworkUI,
} from '../../utils/problemSolvingAdapters'

import { useTranslation } from 'react-i18next'

const CHATBOT_SLUG = 'problem-solving-coach'

type TabId = 'word-problems' | 'real-world' | 'strategies' | 'reasoning' | 'practice' | 'assessment'

const PSC_CAP_TABS: Record<string, TabId> = {
  word_problems: 'word-problems',
  real_world_application: 'real-world',
  problem_strategies: 'strategies',
  reasoning_framework: 'reasoning',
}

const ProblemSolvingCoach = () => {
  const { t } = useTranslation()
  const { toast } = useSnackbar()
  const { creditError, clearCreditError, runWithCredits } = useCapabilityCreditGate()
  const [activeTab, setActiveTab] = useState<TabId>('word-problems')
  const [gradeLevel, setGradeLevel] = useState('5')
  const [topic, setTopic] = useState('')
  const [problemInput, setProblemInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [wordProblem, setWordProblem] = useState<WordProblemUI | null>(null)
  const [realWorldApp, setRealWorldApp] = useState<RealWorldApplicationUI | null>(null)
  const [strategies, setStrategies] = useState<ProblemSolvingStrategyUI[] | null>(null)
  const [reasoningFramework, setReasoningFramework] = useState<ReasoningFrameworkUI | null>(null)

  const { conversationIdForActiveTab, pinFromResponse } = useChatbotHistorySession({
    slug: CHATBOT_SLUG,
    activeTab,
    capabilityKeyToTab: PSC_CAP_TABS,
    onRestore: async ({ tabKey, userContent, assistantContent, assistantMetadata }) => {
      const cap = assistantMetadata?.capability_key as string | undefined
      const tab: TabId =
        tabKey === 'word-problems' || tabKey === 'real-world' || tabKey === 'strategies' || tabKey === 'reasoning'
          ? tabKey
          : cap && PSC_CAP_TABS[cap]
            ? PSC_CAP_TABS[cap]
            : 'word-problems'
      setActiveTab(tab)
      if (userContent?.trim()) {
        if (tab === 'word-problems' && userContent.length > 80) {
          setProblemInput(userContent.trim())
        } else {
          setTopic(userContent.trim())
        }
      }
      try {
        const raw = JSON.parse(assistantContent) as Record<string, unknown>
        setWordProblem(null)
        setRealWorldApp(null)
        setStrategies(null)
        setReasoningFramework(null)
        if (tab === 'word-problems') setWordProblem(mapWordProblemsResult(raw))
        else if (tab === 'real-world') setRealWorldApp(mapRealWorldApplicationResult(raw))
        else if (tab === 'strategies') setStrategies(mapProblemStrategiesResult(raw))
        else setReasoningFramework(mapReasoningFrameworkResult(raw))
      } catch {
        toast.error(t('problemSolvingCoach.couldNotRestoreSavedOutputFromHistory'))
      }
    },
  })

  const handleApiError = (error: unknown, fallbackKey: string) => {
    const err = error as { detail?: string; message?: string; status?: number }
    const msg = resolveApiMessage(t, err?.detail || err?.message || t(fallbackKey))
    toast.error(msg)
    if (err?.status === 403 || String(msg).includes('Premium')) {
      toast.info(t('problemSolvingCoach.upgradeToPremiumToUseThisFeature'), { duration: 5000 })
    }
  }

  const handleWordProblem = async () => {
    if (!topic.trim() && !problemInput.trim()) return
    setIsGenerating(true)
    try {
      const pasted = problemInput.trim()
      const mathTopic = topic.trim()
      const response = await runWithCredits(
        chatbotApi.executeCapability(CHATBOT_SLUG, 'word_problems', {
          input: pasted || mathTopic || ' ',
          input_type: 'text',
          parameters: {
            grade_level: String(gradeLevel),
            ...(mathTopic ? { math_topic: mathTopic } : {}),
            ...(pasted ? { word_problem: pasted } : {}),
          },
          conversation_id: conversationIdForActiveTab ?? undefined,
        }),
      )
      if (response == null) return
      setWordProblem(mapWordProblemsResult(response.result))
      pinFromResponse(response.conversation_id)
      toast.success(t('problemSolvingCoach.wordProblemGenerated'))
    } catch (error: unknown) {
      handleApiError(error, 'problemSolvingCoach.errors.wordProblemFailed')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRealWorldApplication = async () => {
    if (!topic.trim()) return
    setIsGenerating(true)
    try {
      const scenarioTopic = topic.trim()
      const response = await runWithCredits(
        chatbotApi.executeCapability(CHATBOT_SLUG, 'real_world_application', {
          input: scenarioTopic,
          input_type: 'text',
          parameters: {
            grade_level: String(gradeLevel),
            scenario_topic: scenarioTopic,
          },
          conversation_id: conversationIdForActiveTab ?? undefined,
        }),
      )
      if (response == null) return
      setRealWorldApp(mapRealWorldApplicationResult(response.result))
      pinFromResponse(response.conversation_id)
      toast.success(t('problemSolvingCoach.realWorldApplicationGenerated'))
    } catch (error: unknown) {
      handleApiError(error, 'problemSolvingCoach.errors.realWorldFailed')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleStrategies = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(
        chatbotApi.executeCapability(CHATBOT_SLUG, 'problem_strategies', {
          input: ' ',
          input_type: 'text',
          parameters: {},
          conversation_id: conversationIdForActiveTab ?? undefined,
        }),
      )
      if (response == null) return
      setStrategies(mapProblemStrategiesResult(response.result))
      pinFromResponse(response.conversation_id)
      toast.success(t('problemSolvingCoach.strategiesLoaded'))
    } catch (error: unknown) {
      handleApiError(error, 'problemSolvingCoach.errors.strategiesFailed')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleReasoningFramework = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(
        chatbotApi.executeCapability(CHATBOT_SLUG, 'reasoning_framework', {
          input: ' ',
          input_type: 'text',
          parameters: {},
          conversation_id: conversationIdForActiveTab ?? undefined,
        }),
      )
      if (response == null) return
      setReasoningFramework(mapReasoningFrameworkResult(response.result))
      pinFromResponse(response.conversation_id)
      toast.success(t('problemSolvingCoach.reasoningFrameworkLoaded'))
    } catch (error: unknown) {
      handleApiError(error, 'problemSolvingCoach.errors.reasoningFailed')
    } finally {
      setIsGenerating(false)
    }
  }

  const tabs = [
    { id: 'word-problems', label: t('problemSolvingCoach.tabs.word-problems'), icon: Puzzle },
    { id: 'real-world', label: t('problemSolvingCoach.tabs.real-world'), icon: Globe },
    { id: 'strategies', label: t('problemSolvingCoach.tabs.strategies'), icon: Lightbulb },
    { id: 'reasoning', label: t('problemSolvingCoach.tabs.reasoning'), icon: Brain },
    { id: 'practice', label: t('problemSolvingCoach.tabs.practice'), icon: Target },
    { id: 'assessment', label: t('problemSolvingCoach.tabs.assessment'), icon: FileText },
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
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Puzzle className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">{t('problemSolvingCoach.problemSolvingCoach')}</h1>
                  <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    <Star className="h-3 w-3" /> 4.8★
                  </span>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    <Lock className="inline h-3 w-3 mr-1" />{t('problemSolvingCoach.premium')}</span>
                </div>
                <p className="mt-2 text-orange-100">{t('problemSolvingCoach.realWorldMathApplicationsWordProblemStrategiesAndMathem')}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
                <Globe className="h-4 w-4" />
                <span>{t('problemSolvingCoach.realWorldMath')}</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
                <Puzzle className="h-4 w-4" />
                <span>{t('problemSolvingCoach.wordProblemStrategies')}</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
                <Brain className="h-4 w-4" />
                <span>{t('problemSolvingCoach.mathematicalReasoning')}</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
                <Lightbulb className="h-4 w-4" />
                <span>{t('problemSolvingCoach.stepByStepGuidance')}</span>
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
              <p className="text-sm font-medium text-gray-600">{t('problemSolvingCoach.problemsSolved')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">2,456</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <Puzzle className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('problemSolvingCoach.studentsSupported')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">3,234</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('problemSolvingCoach.successRate')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">89%</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">
              <Award className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('problemSolvingCoach.strategiesTaught')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">15</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <Lightbulb className="h-6 w-6" />
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
                      ? 'border-orange-600 text-orange-600'
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
          {/* Word Problems Tab */}
          {activeTab === 'word-problems' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('problemSolvingCoach.gradeLevel')}</label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                        <option key={grade} value={grade}>
                          {t('common.gradeOption', { grade })}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Math Topic (Optional)
                    </label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder={t('problemSolvingCoach.eGAdditionFractionsAlgebra')}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('problemSolvingCoach.pasteWordProblemOrGenerate')}</label>
                    <textarea
                      value={problemInput}
                      onChange={(e) => setProblemInput(e.target.value)}
                      placeholder={t('problemSolvingCoach.pasteAWordProblemHereOrLeaveBlankToGenerate')}
                      rows={8}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                  <button
                    onClick={handleWordProblem}
                    disabled={(!topic.trim() && !problemInput.trim()) || isGenerating}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />{t('problemSolvingCoach.analyzing')}</>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />{t('problemSolvingCoach.analyzeProblem')}</>
                    )}
                  </button>
                </div>

                <div className="lg:col-span-2 space-y-4 max-h-[800px] overflow-y-auto">
                  {wordProblem ? (
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-orange-50 to-amber-50 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
                              {wordProblem.context}
                            </span>
                            <span className="ml-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                              Grade {wordProblem.gradeLevel}
                            </span>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                            {wordProblem.mathTopic}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('problemSolvingCoach.problem')}</h3>
                        <p className="text-gray-700 text-base leading-relaxed bg-white p-4 rounded-lg border border-orange-200">
                          {wordProblem.problem}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-white p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <ArrowRight className="h-5 w-5 text-orange-600" />{t('problemSolvingCoach.stepByStepSolution')}</h3>
                        <div className="space-y-4">
                          {wordProblem.solution.steps.map((step, idx) => (
                            <div key={idx} className="rounded-lg border-2 border-orange-200 bg-orange-50 p-5">
                              <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">
                                  {step.step}
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-sm font-semibold text-gray-900 mb-2">{step.action}</h4>
                                  <div className="bg-white rounded-lg p-3 border border-orange-200 mb-2">
                                    <p className="text-sm font-mono text-gray-700 whitespace-pre-line">{step.calculation}</p>
                                  </div>
                                  <p className="text-sm text-gray-600">{step.explanation}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 p-4 rounded-lg bg-green-50 border-2 border-green-300">
                          <p className="text-sm font-semibold text-green-800 mb-1">{t('problemSolvingCoach.finalAnswer')}</p>
                          <p className="text-base font-bold text-green-900">{wordProblem.solution.finalAnswer}</p>
                          <p className="text-xs text-green-700 mt-2">{wordProblem.solution.check}</p>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-blue-600" />{t('problemSolvingCoach.problemSolvingStrategies')}</h3>
                        <ul className="space-y-2">
                          {wordProblem.strategies.map((strategy, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span>{strategy}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Puzzle className="h-5 w-5 text-purple-600" />{t('problemSolvingCoach.similarPracticeProblems')}</h3>
                        <ul className="space-y-2">
                          {wordProblem.similarProblems.map((problem, idx) => (
                            <li key={idx} className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-purple-200">
                              {problem}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                        <Download className="h-4 w-4" />{t('problemSolvingCoach.downloadProblemAnalysis')}</button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                      <Puzzle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm font-medium text-gray-600">{t('problemSolvingCoach.pasteAWordProblemOrEnterATopicToGet')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Real-World Applications Tab */}
          {activeTab === 'real-world' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('problemSolvingCoach.gradeLevel')}</label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                        <option key={grade} value={grade}>
                          {t('common.gradeOption', { grade })}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('problemSolvingCoach.realWorldScenarioOrTopic')}</label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder={t('problemSolvingCoach.eGBudgetingCookingSportsShopping')}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                  <button
                    onClick={handleRealWorldApplication}
                    disabled={!topic.trim() || isGenerating}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />{t('problemSolvingCoach.generating')}</>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />{t('problemSolvingCoach.generateApplication')}</>
                    )}
                  </button>
                </div>

                <div className="lg:col-span-2 space-y-4 max-h-[800px] overflow-y-auto">
                  {realWorldApp ? (
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-orange-50 to-amber-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Globe className="h-5 w-5 text-orange-600" />
                          {realWorldApp.scenario}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {realWorldApp.mathConcepts.map((concept, idx) => (
                            <span key={idx} className="px-3 py-1 rounded-full bg-white text-orange-700 text-xs font-semibold border border-orange-200">
                              {concept}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-white p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('problemSolvingCoach.problem')}</h3>
                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
                          {realWorldApp.problem}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />{t('problemSolvingCoach.solution')}</h3>
                        <p className="text-gray-700 whitespace-pre-line bg-white p-4 rounded-lg border border-green-200">
                          {realWorldApp.solution}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <ArrowRight className="h-5 w-5 text-blue-600" />{t('problemSolvingCoach.extensionProblems')}</h3>
                        <ul className="space-y-2">
                          {realWorldApp.extensions.map((extension, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2 bg-white p-3 rounded-lg border border-blue-200">
                              <Puzzle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span>{extension}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-purple-600" />{t('problemSolvingCoach.realWorldConnections')}</h3>
                        <ul className="space-y-2">
                          {realWorldApp.connections.map((connection, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                              <span>{connection}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                        <Download className="h-4 w-4" />{t('problemSolvingCoach.downloadRealWorldApplication')}</button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                      <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm font-medium text-gray-600">{t('problemSolvingCoach.enterARealWorldScenarioOrTopicToGenerateMath')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Problem Strategies Tab */}
          {activeTab === 'strategies' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Lightbulb className="h-6 w-6 text-blue-600" />{t('problemSolvingCoach.problemSolvingStrategiesLibrary')}</h3>
                    <p className="text-sm text-gray-600">{t('problemSolvingCoach.comprehensiveStrategiesToHelpStudentsApproachAndSolveWo')}</p>
                  </div>
                  <button
                    onClick={handleStrategies}
                    disabled={isGenerating}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />{t('problemSolvingCoach.loading')}</>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />{t('problemSolvingCoach.loadStrategies')}</>
                    )}
                  </button>
                </div>

                {strategies && (
                  <div className="space-y-6">
                    {strategies.map((strategy, idx) => (
                      <div key={idx} className="bg-white rounded-xl p-6 border-2 border-blue-200">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-gray-900 mb-2">{strategy.strategy}</h4>
                            <p className="text-gray-700 mb-3">{strategy.description}</p>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                              <HelpCircle className="h-3 w-3" />
                              When to use: {strategy.whenToUse}
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">{t('problemSolvingCoach.steps')}</p>
                          <ol className="space-y-2">
                            {strategy.steps.map((step, stepIdx) => (
                              <li key={stepIdx} className="flex items-start gap-3 text-sm text-gray-700">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                                  {stepIdx + 1}
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">{t('problemSolvingCoach.example')}</p>
                          <div className="mb-2">
                            <p className="text-sm font-semibold text-gray-900 mb-1">{t('problemSolvingCoach.problem')}</p>
                            <p className="text-sm text-gray-700">{strategy.example.problem}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 mb-1">{t('problemSolvingCoach.application')}</p>
                            <p className="text-sm text-gray-700">{strategy.example.application}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reasoning Framework Tab */}
          {activeTab === 'reasoning' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Brain className="h-6 w-6 text-indigo-600" />{t('problemSolvingCoach.mathematicalReasoningFramework')}</h3>
                    <p className="text-sm text-gray-600">{t('problemSolvingCoach.aSystematicApproachToDevelopingMathematicalReasoningAnd')}</p>
                  </div>
                  <button
                    onClick={handleReasoningFramework}
                    disabled={isGenerating}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />{t('problemSolvingCoach.loading')}</>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />{t('problemSolvingCoach.loadFramework')}</>
                    )}
                  </button>
                </div>

                {reasoningFramework && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6 border-2 border-indigo-200">
                      <h4 className="text-xl font-bold text-gray-900 mb-4">{reasoningFramework.framework}</h4>
                      <div className="space-y-4">
                        {reasoningFramework.steps.map((step, idx) => (
                          <div key={idx} className="rounded-lg border-2 border-indigo-200 bg-indigo-50 p-5">
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                                {step.step}
                              </div>
                              <div className="flex-1">
                                <h5 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                  <HelpCircle className="h-4 w-4 text-indigo-600" />
                                  {step.question}
                                </h5>
                                <p className="text-sm text-gray-700 bg-white p-3 rounded border border-indigo-200">
                                  {step.guidance}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border-2 border-indigo-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-indigo-600" />{t('problemSolvingCoach.exampleApplications')}</h4>
                      <div className="space-y-3">
                        {reasoningFramework.examples.map((example, idx) => (
                          <div key={idx} className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                            <p className="text-sm text-gray-700 whitespace-pre-line">{example}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Practice Generator Tab */}
          {activeTab === 'practice' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="h-6 w-6 text-green-600" />{t('problemSolvingCoach.practiceProblemGenerator')}</h3>
                <p className="text-sm text-gray-600 mb-6">{t('problemSolvingCoach.generateCustomizedWordProblemsAndPracticeSetsBasedOnGra')}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('problemSolvingCoach.gradeLevel')}</label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                        <option key={grade} value={grade}>
                          {t('common.gradeOption', { grade })}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('problemSolvingCoach.mathTopic')}</label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder={t('problemSolvingCoach.eGFractionsPercentagesAlgebra')}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('problemSolvingCoach.numberOfProblems')}</label>
                    <select className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100">
                      <option>{t('problemSolvingCoach.kProblems')}</option>
                      <option>{t('problemSolvingCoach.k0Problems')}</option>
                      <option>{t('problemSolvingCoach.k5Problems')}</option>
                      <option>{t('problemSolvingCoach.k0Problems2')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('problemSolvingCoach.difficultyLevel')}</label>
                    <select className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100">
                      <option>{t('problemSolvingCoach.mixed')}</option>
                      <option>{t('problemSolvingCoach.easy')}</option>
                      <option>{t('problemSolvingCoach.medium')}</option>
                      <option>{t('problemSolvingCoach.hard')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('problemSolvingCoach.contextType')}</label>
                    <select className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100">
                      <option>{t('problemSolvingCoach.mixedRealWorld')}</option>
                      <option>{t('problemSolvingCoach.moneyShopping')}</option>
                      <option>{t('problemSolvingCoach.timeScheduling')}</option>
                      <option>{t('problemSolvingCoach.measurement')}</option>
                      <option>{t('problemSolvingCoach.sportsGames')}</option>
                    </select>
                  </div>
                </div>
                <button className="w-full rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 flex items-center justify-center gap-2">
                  <Sparkles className="h-4 w-4" />{t('problemSolvingCoach.generatePracticeSet')}</button>
              </div>
            </div>
          )}

          {/* Assessment Tab */}
          {activeTab === 'assessment' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="h-6 w-6 text-purple-600" />{t('problemSolvingCoach.assessmentTools')}</h3>
                <p className="text-sm text-gray-600 mb-6">{t('problemSolvingCoach.createAssessmentsToEvaluateProblemSolvingSkillsAndMathe')}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { type: 'Problem-Solving Rubric', icon: ClipboardCheck, description: 'Assess solution process and reasoning', color: 'purple' },
                    { type: 'Word Problem Quiz', icon: Puzzle, description: 'Generate quiz with multiple word problems', color: 'pink' },
                    { type: 'Reasoning Assessment', icon: Brain, description: 'Evaluate mathematical reasoning skills', color: 'indigo' },
                    { type: 'Strategy Application', icon: Lightbulb, description: 'Test ability to apply problem-solving strategies', color: 'blue' },
                  ].map((assessment, idx) => (
                    <div key={idx} className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-md transition">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-${assessment.color}-100 text-${assessment.color}-600 mb-3`}>
                        <assessment.icon className="h-5 w-5" />
                      </div>
                      <h4 className="text-base font-semibold text-gray-900 mb-2">{assessment.type}</h4>
                      <p className="text-sm text-gray-600 mb-4">{assessment.description}</p>
                      <button className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">{t('problemSolvingCoach.createAssessment')}</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Features Section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('problemSolvingCoach.advancedAiPoweredFeatures')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-orange-50 to-amber-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 mb-4">
              <Globe className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('problemSolvingCoach.realWorldContext')}</h3>
            <p className="text-sm text-gray-600">{t('problemSolvingCoach.connectMathToEverydaySituationsShoppingCookingSportsTra')}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 mb-4">
              <Puzzle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('problemSolvingCoach.wordProblemAnalysis')}</h3>
            <p className="text-sm text-gray-600">{t('problemSolvingCoach.breakDownComplexWordProblemsIntoManageableStepsWithClea')}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-yellow-50 to-green-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600 mb-4">
              <Brain className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('problemSolvingCoach.reasoningDevelopment')}</h3>
            <p className="text-sm text-gray-600">{t('problemSolvingCoach.buildCriticalThinkingAndMathematicalReasoningThroughGui')}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 mb-4">
              <Lightbulb className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('problemSolvingCoach.strategyLibrary')}</h3>
            <p className="text-sm text-gray-600">{t('problemSolvingCoach.accessComprehensiveProblemSolvingStrategiesWithExamples')}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-emerald-50 to-blue-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 mb-4">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('problemSolvingCoach.practiceGenerator')}</h3>
            <p className="text-sm text-gray-600">{t('problemSolvingCoach.generateUnlimitedPracticeProblemsTailoredToGradeLevelAn')}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-4">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('problemSolvingCoach.progressTracking')}</h3>
            <p className="text-sm text-gray-600">{t('problemSolvingCoach.monitorStudentProgressInProblemSolvingSkillsAndIdentify')}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-cyan-50 to-indigo-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600 mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('problemSolvingCoach.differentiation')}</h3>
            <p className="text-sm text-gray-600">{t('problemSolvingCoach.automaticallyAdaptProblemsForDifferentSkillLevelsAndLea')}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 mb-4">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('problemSolvingCoach.standardsAlignment')}</h3>
            <p className="text-sm text-gray-600">{t('problemSolvingCoach.allContentAlignedWithCommonCoreMathStandardsAndState')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProblemSolvingCoach



