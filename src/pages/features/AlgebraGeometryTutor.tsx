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
  Circle as CircleIcon,
  Hexagon,
  PlayCircle,
  Pause,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
  PenTool,
  Eraser,
} from 'lucide-react'
import * as chatbotApi from '../../api/chatbots'
import { useSnackbar } from '../../hooks/useSnackbar'
import { useCapabilityCreditGate } from '../../hooks/useCapabilityCreditGate'
import { useChatbotHistorySession } from '../../hooks/useChatbotHistorySession'
import NoCreditsCard from '../../components/NoCreditsCard'
import { resolveApiMessage } from '../../i18n/resolveApiMessage'
import {
  type VisualExplanationUI as VisualExplanation,
  type ProofStrategyUI as ProofStrategy,
  type ScaffoldedPracticeUI as ScaffoldedPractice,
  mapVisualExplanationResult,
  mapProofStrategyResult,
  mapScaffoldedPracticeResult,
  restoreVisualPayload,
  restoreProofPayload,
  restorePracticePayload,
  isUiVisualPayload,
  isUiProofPayload,
  isUiPracticePayload,
} from '../../utils/algebraGeometryAdapters'

import { useTranslation } from 'react-i18next'

interface GeometryVisual {
  type: string
  description: string
  interactive: boolean
  elements: string[]
}

type TutorTab = 'visual' | 'proof' | 'practice' | 'interactive' | 'assessment' | 'resources'

function inferTabFromPayload(parsed: Record<string, unknown>): TutorTab | null {
  if (isUiVisualPayload(parsed) || 'visuals' in parsed || 'workedExample' in parsed) return 'visual'
  if (isUiProofPayload(parsed) || 'outlineSteps' in parsed || 'strategyOverview' in parsed) return 'proof'
  if (isUiPracticePayload(parsed) || (Array.isArray(parsed.problems) && parsed.problems.length > 0)) return 'practice'
  return null
}

const ALGEBRA_GEOMETRY_CAP_TABS: Record<string, TutorTab> = {
  visual_explanation: 'visual',
  proof_strategies: 'proof',
  scaffolded_practice: 'practice',
}

type ProofTypeOption = ProofStrategy['proofType']

const AlgebraGeometryTutor = () => {
  const { t } = useTranslation()
  const { toast } = useSnackbar()
  const { creditError, clearCreditError, captureApiError, runWithCredits } = useCapabilityCreditGate()
  const CHATBOT_SLUG = 'algebra-geometry-tutor'
  const [activeTab, setActiveTab] = useState<TutorTab>('visual')
  const [gradeLevel, setGradeLevel] = useState('9')
  const [topic, setTopic] = useState('')
  const [subject, setSubject] = useState<'algebra' | 'geometry'>('algebra')
  const [proofType, setProofType] = useState<ProofTypeOption>('direct')
  const [isGenerating, setIsGenerating] = useState(false)
  const [visualExplanation, setVisualExplanation] = useState<VisualExplanation | null>(null)
  const [proofStrategy, setProofStrategy] = useState<ProofStrategy | null>(null)
  const [scaffoldedPractice, setScaffoldedPractice] = useState<ScaffoldedPractice | null>(null)

  const { conversationIdForActiveTab, pinFromResponse } = useChatbotHistorySession({
    slug: CHATBOT_SLUG,
    activeTab,
    capabilityKeyToTab: ALGEBRA_GEOMETRY_CAP_TABS,
    detectTabFromMetadata: (m) => {
      const tab = (m?.tab ?? m?.Tab) as string | undefined
      if (tab === 'visual' || tab === 'proof' || tab === 'practice') return tab
      return null
    },
    onRestore: async ({ tabKey, userContent, assistantContent, assistantMetadata }) => {
      try {
        if (!assistantContent?.trim()) {
          toast.info(t('algebraGeometryTutor.thisHistoryEntryHasNoSavedOutputToRestore'))
          return
        }
        const meta = assistantMetadata || {}
        const cap = meta.capability_key as string | undefined
        let tab: TutorTab =
          tabKey === 'visual' || tabKey === 'proof' || tabKey === 'practice'
            ? (tabKey as TutorTab)
            : cap && ALGEBRA_GEOMETRY_CAP_TABS[cap]
              ? ALGEBRA_GEOMETRY_CAP_TABS[cap]
              : 'visual'

        const params = (meta.parameters as Record<string, unknown> | undefined) ?? {}
        const subj = (params.subject ?? meta.subject) as string | undefined
        if (subj === 'algebra' || subj === 'geometry') {
          setSubject(subj)
        } else if (typeof subj === 'string' && subj.toLowerCase().startsWith('geom')) {
          setSubject('geometry')
        } else if (typeof subj === 'string' && subj.toLowerCase().startsWith('alg')) {
          setSubject('algebra')
        }

        const gl = params.grade_level ?? params.gradeLevel ?? meta.grade_level ?? meta.gradeLevel
        if (typeof gl === 'string' || typeof gl === 'number') {
          const g = String(gl).replace(/\D/g, '')
          if (g) setGradeLevel(g)
        }

        const pt = params.proof_type ?? params.proofType
        if (typeof pt === 'string' && pt.trim()) {
          setProofType(pt.toLowerCase().includes('contradiction') ? 'contradiction'
            : pt.toLowerCase().includes('induction') ? 'induction'
            : pt.toLowerCase().includes('construction') ? 'construction'
            : pt.toLowerCase().includes('indirect') ? 'indirect'
            : 'direct')
        }

        if (userContent) {
          setTopic(userContent)
        }

        let parsed: Record<string, unknown>
        try {
          parsed = JSON.parse(assistantContent) as Record<string, unknown>
        } catch {
          toast.info(t('algebraGeometryTutor.couldNotLoadThisConversationFromHistory'))
          return
        }

        const tabRaw = (meta.tab ?? meta.Tab) as string | undefined
        const inferred = inferTabFromPayload(parsed)
        if (!tabRaw && !cap && inferred) {
          tab = inferred
        }
        setActiveTab(tab)

        setVisualExplanation(null)
        setProofStrategy(null)
        setScaffoldedPractice(null)

        if (tab === 'visual') {
          setVisualExplanation(restoreVisualPayload(parsed))
        } else if (tab === 'proof') {
          setProofStrategy(restoreProofPayload(parsed))
        } else if (tab === 'practice') {
          setScaffoldedPractice(restorePracticePayload(parsed))
        }
      } catch {
        toast.info(t('algebraGeometryTutor.couldNotLoadThisConversationFromHistory'))
      }
    },
  })

  const subjectLabel = subject === 'algebra' ? 'Algebra' : 'Geometry'

  const handleVisualExplanation = async () => {
    if (!topic.trim()) return
    setIsGenerating(true)
    clearCreditError()

    try {
      const topicConcept = topic.trim()
      const response = await runWithCredits(chatbotApi.executeCapability(
        CHATBOT_SLUG,
        'visual_explanation',
        {
          input: topicConcept,
          input_type: 'text',
          parameters: {
            subject: subjectLabel,
            topic_concept: topicConcept,
            grade_level: gradeLevel,
          },
          conversation_id: conversationIdForActiveTab ?? undefined,
        },
      ))
      if (response == null) return

      setVisualExplanation(mapVisualExplanationResult(response.result as Record<string, unknown>))
      pinFromResponse(response.conversation_id)
    } catch (error: unknown) {
      if (captureApiError(error)) return
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = resolveApiMessage(t, err?.detail || err?.message || 'Failed to generate visual explanation')
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info(t('algebraGeometryTutor.premium'), { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const handleProofStrategy = async () => {
    if (!topic.trim()) return
    setIsGenerating(true)
    clearCreditError()

    try {
      const statement = topic.trim()
      const response = await runWithCredits(chatbotApi.executeCapability(
        CHATBOT_SLUG,
        'proof_strategies',
        {
          input: statement,
          input_type: 'text',
          parameters: {
            subject: subjectLabel,
            theorem_statement: statement,
            proof_type: proofType,
          },
          conversation_id: conversationIdForActiveTab ?? undefined,
        },
      ))
      if (response == null) return

      setProofStrategy(mapProofStrategyResult(response.result as Record<string, unknown>))
      pinFromResponse(response.conversation_id)
    } catch (error: unknown) {
      if (captureApiError(error)) return
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = resolveApiMessage(t, err?.detail || err?.message || 'Failed to generate proof strategy')
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info(t('algebraGeometryTutor.premium'), { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const handleScaffoldedPractice = async () => {
    if (!topic.trim()) return
    setIsGenerating(true)
    clearCreditError()

    try {
      const practiceTopic = topic.trim()
      const response = await runWithCredits(chatbotApi.executeCapability(
        CHATBOT_SLUG,
        'scaffolded_practice',
        {
          input: practiceTopic,
          input_type: 'text',
          parameters: {
            subject: subjectLabel,
            topic: practiceTopic,
            grade_level: gradeLevel,
          },
          conversation_id: conversationIdForActiveTab ?? undefined,
        },
      ))
      if (response == null) return

      setScaffoldedPractice(mapScaffoldedPracticeResult(response.result as Record<string, unknown>))
      pinFromResponse(response.conversation_id)
    } catch (error: unknown) {
      if (captureApiError(error)) return
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = resolveApiMessage(t, err?.detail || err?.message || 'Failed to generate practice problems')
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info(t('algebraGeometryTutor.premium'), { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const tabs = [
    { id: 'visual', label: t('algebraGeometryTutor.tabs.visual'), icon: Eye },
    { id: 'proof', label: t('algebraGeometryTutor.tabs.proof'), icon: Brain },
    { id: 'practice', label: t('algebraGeometryTutor.tabs.practice'), icon: Layers },
    { id: 'interactive', label: t('algebraGeometryTutor.tabs.interactive'), icon: PlayCircle },
    { id: 'assessment', label: t('algebraGeometryTutor.tabs.assessment'), icon: FileText },
    { id: 'resources', label: t('algebraGeometryTutor.tabs.resources'), icon: BookOpen },
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
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Calculator className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">{t('algebraGeometryTutor.algebraGeometryTutor')}</h1>
                  <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    <Star className="h-3 w-3" /> 4.7★
                  </span>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    <Lock className="inline h-3 w-3 mr-1" />{t('algebraGeometryTutor.premium')}</span>
                </div>
                <p className="mt-2 text-indigo-100">{t('algebraGeometryTutor.advancedMathematicsSupportWithVisualExplanationsProofSt')}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
                <Eye className="h-4 w-4" />
                <span>{t('algebraGeometryTutor.visualExplanations')}</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
                <Brain className="h-4 w-4" />
                <span>{t('algebraGeometryTutor.proofStrategies')}</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
                <Layers className="h-4 w-4" />
                <span>{t('algebraGeometryTutor.scaffoldedPractice')}</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm">
                <PlayCircle className="h-4 w-4" />
                <span>{t('algebraGeometryTutor.interactiveTools')}</span>
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
              <p className="text-sm font-medium text-gray-600">{t('algebraGeometryTutor.visualsCreated')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">2,847</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <Eye className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('algebraGeometryTutor.proofsExplained')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">1,234</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <Brain className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('algebraGeometryTutor.studentsSupported')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">3,456</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('algebraGeometryTutor.masteryRate')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">91%</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
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
                      ? 'border-indigo-600 text-indigo-600'
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
          {/* Visual Explanations Tab */}
          {activeTab === 'visual' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('algebraGeometryTutor.subject')}</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value as 'algebra' | 'geometry')}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    >
                      <option value="algebra">{t('algebraGeometryTutor.algebra')}</option>
                      <option value="geometry">{t('algebraGeometryTutor.geometry')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('algebraGeometryTutor.topicConcept')}</label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder={subject === 'algebra' ? 'e.g., Linear Equations, Quadratic Functions' : 'e.g., Pythagorean Theorem, Similar Triangles'}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('algebraGeometryTutor.gradeLevel')}</label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    >
                      {[6, 7, 8, 9, 10, 11, 12].map((grade) => (
                        <option key={grade} value={grade}>
                          {t('common.gradeOption', { grade })}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleVisualExplanation}
                    disabled={!topic.trim() || isGenerating}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />{t('algebraGeometryTutor.generating')}</>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />{t('algebraGeometryTutor.generateVisualExplanation')}</>
                    )}
                  </button>
                </div>

                <div className="lg:col-span-2 space-y-4 max-h-[800px] overflow-y-auto">
                  {visualExplanation ? (
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Eye className="h-5 w-5 text-indigo-600" />
                          {visualExplanation.concept}
                        </h3>
                        <p className="text-gray-700 leading-relaxed mb-4">{visualExplanation.explanation}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-medium capitalize">
                            {visualExplanation.visualType}
                          </span>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-white p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('algebraGeometryTutor.stepByStepVisualGuide')}</h3>
                        <div className="space-y-4">
                          {visualExplanation.steps.map((step, idx) => (
                            <div key={idx} className="rounded-lg border-2 border-indigo-200 bg-indigo-50 p-5">
                              <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                                  {step.step}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-gray-900 mb-2">{step.description}</p>
                                  <div className="bg-white rounded-lg p-3 border border-indigo-200">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <Eye className="h-4 w-4 text-indigo-600" />
                                      <span className="italic">{step.visual}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <PlayCircle className="h-5 w-5 text-purple-600" />{t('algebraGeometryTutor.interactiveElements')}</h3>
                        <ul className="space-y-2">
                          {visualExplanation.interactiveElements.map((element, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 bg-white rounded-lg p-3 border border-purple-200">
                              <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                              <span>{element}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                          <PlayCircle className="h-4 w-4" />{t('algebraGeometryTutor.launchInteractive')}</button>
                        <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                          <Download className="h-4 w-4" />{t('algebraGeometryTutor.downloadVisual')}</button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                      <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm font-medium text-gray-600">{t('algebraGeometryTutor.enterATopicAndGenerateVisualExplanationsWithStepBy')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Proof Strategies Tab */}
          {activeTab === 'proof' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('algebraGeometryTutor.subject')}</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value as 'algebra' | 'geometry')}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    >
                      <option value="algebra">{t('algebraGeometryTutor.algebra')}</option>
                      <option value="geometry">{t('algebraGeometryTutor.geometry')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('algebraGeometryTutor.theoremStatementToProve')}</label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder={t('algebraGeometryTutor.eGPythagoreanTheoremAngleSumTheorem')}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('algebraGeometryTutor.proofType')}</label>
                    <select
                      value={proofType}
                      onChange={(e) => setProofType(e.target.value as ProofTypeOption)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    >
                      <option value="direct">{t('algebraGeometryTutor.directProof')}</option>
                      <option value="indirect">{t('algebraGeometryTutor.indirectProof')}</option>
                      <option value="contradiction">{t('algebraGeometryTutor.proofByContradiction')}</option>
                      <option value="induction">{t('algebraGeometryTutor.proofByInduction')}</option>
                      <option value="construction">{t('algebraGeometryTutor.proofByConstruction')}</option>
                    </select>
                  </div>
                  <button
                    onClick={handleProofStrategy}
                    disabled={!topic.trim() || isGenerating}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />{t('algebraGeometryTutor.generating')}</>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />{t('algebraGeometryTutor.generateProofStrategy')}</>
                    )}
                  </button>
                </div>

                <div className="lg:col-span-2 space-y-4 max-h-[800px] overflow-y-auto">
                  {proofStrategy ? (
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Brain className="h-5 w-5 text-indigo-600" />
                          {proofStrategy.theorem}
                        </h3>
                        <div className="mb-3">
                          <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold capitalize">
                            {proofStrategy.proofType} Proof
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{proofStrategy.strategy}</p>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-white p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('algebraGeometryTutor.proofSteps')}</h3>
                        <div className="space-y-4">
                          {proofStrategy.steps.map((step, idx) => (
                            <div key={idx} className="rounded-lg border-2 border-indigo-200 bg-indigo-50 p-5">
                              <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                                  {step.step}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-gray-900 mb-2">{step.statement}</p>
                                  <div className="bg-white rounded-lg p-3 border border-indigo-200 mb-2">
                                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">{t('algebraGeometryTutor.justification')}</p>
                                    <p className="text-sm text-gray-700">{step.justification}</p>
                                  </div>
                                  {step.visual && (
                                    <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
                                      <p className="text-xs text-blue-700 italic">{step.visual}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Lightbulb className="h-5 w-5 text-green-600" />{t('algebraGeometryTutor.helpfulHints')}</h3>
                          <ul className="space-y-2">
                            {proofStrategy.hints.map((hint, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{hint}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-amber-600" />{t('algebraGeometryTutor.commonMistakes')}</h3>
                          <ul className="space-y-2">
                            {proofStrategy.commonMistakes.map((mistake, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                <span>{mistake}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                        <Download className="h-4 w-4" />{t('algebraGeometryTutor.downloadProofGuide')}</button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                      <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm font-medium text-gray-600">{t('algebraGeometryTutor.enterATheoremOrStatementToGenerateProofStrategiesWith')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Scaffolded Practice Tab */}
          {activeTab === 'practice' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('algebraGeometryTutor.subject')}</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value as 'algebra' | 'geometry')}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    >
                      <option value="algebra">{t('algebraGeometryTutor.algebra')}</option>
                      <option value="geometry">{t('algebraGeometryTutor.geometry')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('algebraGeometryTutor.topic')}</label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder={t('algebraGeometryTutor.eGQuadraticEquationsTriangleCongruence')}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('algebraGeometryTutor.gradeLevel')}</label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    >
                      {[6, 7, 8, 9, 10, 11, 12].map((grade) => (
                        <option key={grade} value={grade}>
                          {t('common.gradeOption', { grade })}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleScaffoldedPractice}
                    disabled={!topic.trim() || isGenerating}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />{t('algebraGeometryTutor.generating')}</>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />{t('algebraGeometryTutor.generatePracticeProblems')}</>
                    )}
                  </button>
                </div>

                <div className="lg:col-span-2 space-y-4 max-h-[800px] overflow-y-auto">
                  {scaffoldedPractice ? (
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <Layers className="h-5 w-5 text-indigo-600" />
                          {scaffoldedPractice.topic}
                        </h3>
                        <p className="text-sm text-gray-600">{t('algebraGeometryTutor.scaffoldedPracticeFromFoundationToAdvancedLevels')}</p>
                      </div>

                      {scaffoldedPractice.levels.map((level, levelIdx) => {
                        const levelColors = {
                          1: 'bg-blue-50 border-blue-200',
                          2: 'bg-green-50 border-green-200',
                          3: 'bg-purple-50 border-purple-200',
                        }
                        const levelLabels = {
                          1: 'Foundation',
                          2: 'Intermediate',
                          3: 'Advanced',
                        }

                        return (
                          <div key={levelIdx} className={`rounded-2xl border-2 p-6 ${levelColors[level.level as keyof typeof levelColors]}`}>
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-base font-bold text-gray-900">Level {level.level}: {level.name}</h4>
                              <span className="px-3 py-1 rounded-full bg-white text-xs font-semibold">
                                {level.problems.length} problems
                              </span>
                            </div>
                            <div className="space-y-4">
                              {level.problems.map((problem) => (
                                <div key={problem.id} className="bg-white rounded-xl p-5 border border-gray-200">
                                  <div className="mb-3">
                                    <p className="text-sm font-semibold text-gray-900 mb-2">{t('algebraGeometryTutor.problem')}</p>
                                    <p className="text-gray-700">{problem.question}</p>
                                  </div>
                                  <div className="mb-3">
                                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">{t('algebraGeometryTutor.hints')}</p>
                                    <ul className="space-y-1">
                                      {problem.hints.map((hint, hintIdx) => (
                                        <li key={hintIdx} className="text-sm text-gray-600 flex items-start gap-2">
                                          <Lightbulb className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                          <span>{hint}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <details className="mt-3">
                                    <summary className="text-sm font-semibold text-indigo-600 cursor-pointer hover:text-indigo-700">{t('algebraGeometryTutor.showSolution')}</summary>
                                    <div className="mt-2 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                                      <p className="text-sm font-semibold text-gray-900 mb-1">{t('algebraGeometryTutor.solution')}</p>
                                      <p className="text-sm text-gray-700 mb-2">{problem.solution}</p>
                                      <p className="text-sm font-semibold text-gray-900 mb-1">{t('algebraGeometryTutor.explanation')}</p>
                                      <p className="text-sm text-gray-700">{problem.explanation}</p>
                                    </div>
                                  </details>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })}

                      <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                        <Download className="h-4 w-4" />{t('algebraGeometryTutor.downloadPracticeSet')}</button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                      <Layers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm font-medium text-gray-600">{t('algebraGeometryTutor.enterATopicToGenerateScaffoldedPracticeProblemsFromFoun')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Interactive Tools Tab */}
          {activeTab === 'interactive' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <PlayCircle className="h-6 w-6 text-blue-600" />{t('algebraGeometryTutor.interactiveLearningTools')}</h3>
                <p className="text-sm text-gray-600 mb-6">{t('algebraGeometryTutor.accessInteractiveToolsForAlgebraAndGeometryVisualizatio')}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'Graphing Calculator', icon: LineChart, color: 'blue', description: 'Plot functions, analyze graphs' },
                    { name: 'Geometry Builder', icon: Triangle, color: 'green', description: 'Construct and manipulate shapes' },
                    { name: 'Coordinate Plane', icon: Grid3x3, color: 'purple', description: 'Interactive coordinate system' },
                    { name: 'Function Explorer', icon: TrendingUp, color: 'pink', description: 'Explore function transformations' },
                    { name: 'Proof Builder', icon: Brain, color: 'indigo', description: 'Step-by-step proof construction' },
                    { name: '3D Geometry Viewer', icon: Shapes, color: 'teal', description: 'Visualize 3D shapes and solids' },
                  ].map((tool, idx) => (
                    <div key={idx} className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-md transition">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-${tool.color}-100 text-${tool.color}-600 mb-4`}>
                        <tool.icon className="h-6 w-6" />
                      </div>
                      <h4 className="text-base font-semibold text-gray-900 mb-2">{tool.name}</h4>
                      <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
                      <button className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">{t('algebraGeometryTutor.launchTool')}</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Assessment Tab */}
          {activeTab === 'assessment' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="h-6 w-6 text-indigo-600" />{t('algebraGeometryTutor.assessmentTools')}</h3>
                <p className="text-sm text-gray-600 mb-6">{t('algebraGeometryTutor.createComprehensiveAssessmentsAlignedWithLearningObject')}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { type: 'Concept Check', icon: Target, description: 'Quick understanding assessment', color: 'blue' },
                    { type: 'Proof Assessment', icon: Brain, description: 'Evaluate proof-writing skills', color: 'purple' },
                    { type: 'Problem Solving', icon: Puzzle, description: 'Multi-step problem assessment', color: 'green' },
                    { type: 'Visual Reasoning', icon: Eye, description: 'Assess geometric visualization', color: 'pink' },
                  ].map((assessment, idx) => (
                    <div key={idx} className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-md transition">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-${assessment.color}-100 text-${assessment.color}-600 mb-3`}>
                        <assessment.icon className="h-5 w-5" />
                      </div>
                      <h4 className="text-base font-semibold text-gray-900 mb-2">{assessment.type}</h4>
                      <p className="text-sm text-gray-600 mb-4">{assessment.description}</p>
                      <button className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">{t('algebraGeometryTutor.createAssessment')}</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-teal-600" />{t('algebraGeometryTutor.learningResources')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title: 'Video Tutorials', count: '245', icon: PlayCircle },
                    { title: 'Practice Worksheets', count: '189', icon: FileText },
                    { title: 'Proof Templates', count: '67', icon: Brain },
                    { title: 'Visual Guides', count: '134', icon: Eye },
                  ].map((resource, idx) => (
                    <div key={idx} className="rounded-xl border border-gray-200 bg-white p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
                          <resource.icon className="h-6 w-6" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900">{resource.count}</span>
                      </div>
                      <h4 className="text-base font-semibold text-gray-900 mb-2">{resource.title}</h4>
                      <button className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">{t('algebraGeometryTutor.browseResources')}</button>
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
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('algebraGeometryTutor.advancedAiPoweredFeatures')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 mb-4">
              <Eye className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('algebraGeometryTutor.dynamicVisualizations')}</h3>
            <p className="text-sm text-gray-600">{t('algebraGeometryTutor.interactiveGraphsDiagramsAnd3dModelsThatRespondToUser')}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 mb-4">
              <Brain className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('algebraGeometryTutor.intelligentProofAssistance')}</h3>
            <p className="text-sm text-gray-600">{t('algebraGeometryTutor.aiPoweredHintsAndSuggestionsToGuideStudentsThroughCompl')}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-pink-50 to-rose-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 text-pink-600 mb-4">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('algebraGeometryTutor.adaptiveScaffolding')}</h3>
            <p className="text-sm text-gray-600">{t('algebraGeometryTutor.problemsAutomaticallyAdjustDifficultyBasedOnStudentPerf')}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-4">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('algebraGeometryTutor.realTimeFeedback')}</h3>
            <p className="text-sm text-gray-600">{t('algebraGeometryTutor.instantFeedbackOnSolutionsWithDetailedExplanationsAndAl')}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-cyan-50 to-teal-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600 mb-4">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('algebraGeometryTutor.standardsAlignment')}</h3>
            <p className="text-sm text-gray-600">{t('algebraGeometryTutor.allContentAlignedWithCommonCoreStateStandardsAndInterna')}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-teal-50 to-green-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-600 mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('algebraGeometryTutor.personalizedLearning')}</h3>
            <p className="text-sm text-gray-600">{t('algebraGeometryTutor.customizedLearningPathsBasedOnIndividualStudentStrength')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlgebraGeometryTutor



