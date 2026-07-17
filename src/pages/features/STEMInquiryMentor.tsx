import { useCallback, useEffect, useState } from 'react'
import {
  Beaker,
  Target,
  Users,
  Sparkles,
  Download,
  RefreshCw,
  CheckCircle2,
  Circle,
  AlertCircle,
  Lightbulb,
  Layers,
  Brain,
  Compass,
  LineChart,
  Wand2,
  Settings,
  FlaskConical,
  Wrench,
  ClipboardCheck,
  Globe,
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
interface NGSSInvestigation {
  phenomenon: string
  performanceExpectation: string
  dci: string
  sep: string[]
  ccc: string[]
  investigationPlan: {
    question: string
    hypothesis: string
    materials: string[]
    procedure: string[]
    dataCollection: string
    analysis: string
  }
  assessment: {
    formative: string[]
    summative: string
  }
}

interface EngineeringChallenge {
  problem: string
  constraints: string[]
  criteria: string[]
  designCycle: {
    ask: string[]
    imagine: string[]
    plan: string[]
    create: string[]
    improve: string[]
  }
  realWorldContext: string
  ngssAlignment: string[]
}

interface InquiryGuidance {
  topic: string
  questions: {
    level: 'exploratory' | 'investigative' | 'evaluative'
    question: string
    guidance: string
  }[]
  hypothesisFramework: {
    template: string
    examples: string[]
  }
  experimentalDesign: {
    variables: string
    controls: string
    procedure: string
  }
  dataAnalysis: {
    methods: string[]
    tools: string[]
    interpretation: string
  }
}

const STEMInquiryMentor = () => {
  const { t } = useTranslation()
  const { toast } = useSnackbar()
  const { creditError, clearCreditError, captureApiError, runWithCredits } = useCapabilityCreditGate()
  const CHATBOT_SLUG = 'stem-inquiry-mentor'
  
  const { redirectTo, capability, siblings, category, tabId } = useCoachCapabilityRoute(CHATBOT_SLUG)

  const [activeTab, setActiveTab] = useState<'investigation' | 'engineering' | 'inquiry'>('investigation')
  const [gradeLevel, setGradeLevel] = useState('8')
  const [topic, setTopic] = useState('')
  const [subject, setSubject] = useState<'biology' | 'chemistry' | 'physics' | 'earth-science' | 'engineering'>('biology')
  const [isGenerating, setIsGenerating] = useState(false)
  const [ngssInvestigation, setNGSSInvestigation] = useState<NGSSInvestigation | null>(null)
  const [engineeringChallenge, setEngineeringChallenge] = useState<EngineeringChallenge | null>(null)
  const [inquiryGuidance, setInquiryGuidance] = useState<InquiryGuidance | null>(null)

  const STEM_CAP_TABS: Record<string, typeof activeTab> = {
    ngss_investigation: 'investigation',
    engineering_design: 'engineering',
    inquiry_guidance: 'inquiry',
  }

  const isCapabilityTab = useCallback((tab: string): tab is 'investigation' | 'engineering' | 'inquiry' => {
    return tab === 'investigation' || tab === 'engineering' || tab === 'inquiry'
  }, [])

  useEffect(() => {
    if (tabId && isCapabilityTab(tabId)) setActiveTab(tabId)
  }, [tabId, isCapabilityTab])

  const { conversationIdForActiveTab, pinFromResponse } = useChatbotHistorySession({
    slug: CHATBOT_SLUG,
    activeTab,
    capabilityKeyToTab: STEM_CAP_TABS,
    onRestore: async ({ tabKey, userContent, assistantContent, assistantMetadata }) => {
      const cap = assistantMetadata?.capability_key as string | undefined
      const valid = ['investigation', 'engineering', 'inquiry', 'data', 'assessment', 'alignment'] as const
      const tab =
        (valid as readonly string[]).includes(tabKey)
          ? (tabKey as typeof activeTab)
          : cap && STEM_CAP_TABS[cap]
            ? STEM_CAP_TABS[cap]
            : 'investigation'
      setActiveTab(tab)
      if (userContent) setTopic(userContent)
      try {
        const data = JSON.parse(assistantContent)
        setNGSSInvestigation(null)
        setEngineeringChallenge(null)
        setInquiryGuidance(null)
        if (tab === 'investigation') setNGSSInvestigation(data as NGSSInvestigation)
        if (tab === 'engineering') setEngineeringChallenge(data as EngineeringChallenge)
        if (tab === 'inquiry') setInquiryGuidance(data as InquiryGuidance)
      } catch {
        // keep restore silent
      }
    },
  })

  const handleNGSSInvestigation = async () => {
    if (!topic.trim()) {
      toast.error(t('sTEMInquiryMentor.pleaseEnterAPhenomenonOrTopic'))
      return
    }
    
    setIsGenerating(true)
    clearCreditError()
    
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(
        CHATBOT_SLUG,
        'ngss_investigation',
        {
          input: topic,
          input_type: 'text',
          parameters: {
            grade_level: gradeLevel,
            subject: subject,
          },
          conversation_id: conversationIdForActiveTab ?? undefined,
        }
      ))
      if (response == null) return
      
      setNGSSInvestigation(response.result as NGSSInvestigation)
      pinFromResponse(response.conversation_id)
      toast.success(t('sTEMInquiryMentor.ngssInvestigationGeneratedSuccessfully'))
    } catch (error: any) {
      if (captureApiError(error)) return
      console.error('Error generating NGSS investigation:', error)
      const errorMessage = resolveApiMessage(
        t,
        error?.detail || error?.message || 'Failed to generate investigation',
      )
      toast.error(errorMessage)
      
      if (error?.status === 403 || errorMessage.includes('Premium')) {
        toast.info(t('sTEMInquiryMentor.upgradeToPremiumToUseThisFeature'), { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const handleEngineeringChallenge = async () => {
    if (!topic.trim()) {
      toast.error(t('sTEMInquiryMentor.pleaseEnterAnEngineeringProblem'))
      return
    }
    
    setIsGenerating(true)
    clearCreditError()
    
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(
        CHATBOT_SLUG,
        'engineering_design',
        {
          input: topic,
          input_type: 'text',
          parameters: {
            grade_level: gradeLevel,
          },
          conversation_id: conversationIdForActiveTab ?? undefined,
        }
      ))
      if (response == null) return
      
      setEngineeringChallenge(response.result as EngineeringChallenge)
      pinFromResponse(response.conversation_id)
      toast.success(t('sTEMInquiryMentor.engineeringChallengeGeneratedSuccessfully'))
    } catch (error: any) {
      if (captureApiError(error)) return
      console.error('Error generating engineering challenge:', error)
      const errorMessage = resolveApiMessage(
        t,
        error?.detail || error?.message || 'Failed to generate challenge',
      )
      toast.error(errorMessage)
      
      if (error?.status === 403 || errorMessage.includes('Premium')) {
        toast.info(t('sTEMInquiryMentor.upgradeToPremiumToUseThisFeature'), { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const handleInquiryGuidance = async () => {
    if (!topic.trim()) {
      toast.error(t('sTEMInquiryMentor.pleaseEnterATopic'))
      return
    }
    
    setIsGenerating(true)
    clearCreditError()
    
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(
        CHATBOT_SLUG,
        'inquiry_guidance',
        {
          input: topic,
          input_type: 'text',
          parameters: {
            grade_level: gradeLevel,
          },
          conversation_id: conversationIdForActiveTab ?? undefined,
        }
      ))
      if (response == null) return
      
      setInquiryGuidance(response.result as InquiryGuidance)
      pinFromResponse(response.conversation_id)
      toast.success(t('sTEMInquiryMentor.inquiryGuidanceGeneratedSuccessfully'))
    } catch (error: any) {
      if (captureApiError(error)) return
      console.error('Error generating inquiry guidance:', error)
      const errorMessage = resolveApiMessage(
        t,
        error?.detail || error?.message || 'Failed to generate guidance',
      )
      toast.error(errorMessage)
      
      if (error?.status === 403 || errorMessage.includes('Premium')) {
        toast.info(t('sTEMInquiryMentor.upgradeToPremiumToUseThisFeature'), { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }



  const handleNewTask = () => {
    setTopic('')
    setNGSSInvestigation(null)
    setEngineeringChallenge(null)
    setInquiryGuidance(null)
  }

  if (redirectTo) return <CoachCapabilityRedirect to={redirectTo} />
  if (!capability) return <CoachCapabilityRedirect to={`/chatbots/${CHATBOT_SLUG}?cap=ngss_investigation`} />


  const workspaceBody = (
        <div className="space-y-6">
          {/* NGSS Investigations Tab */}
          {activeTab === 'investigation' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('sTEMInquiryMentor.subjectArea')}</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value as any)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="biology">{t('sTEMInquiryMentor.biology')}</option>
                      <option value="chemistry">{t('sTEMInquiryMentor.chemistry')}</option>
                      <option value="physics">{t('sTEMInquiryMentor.physics')}</option>
                      <option value="earth-science">{t('sTEMInquiryMentor.earthScience')}</option>
                      <option value="engineering">{t('sTEMInquiryMentor.engineering')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('sTEMInquiryMentor.gradeLevel')}</label>
                    <GradeSelect
                      variant="native"
                      value={gradeLevel}
                      onChange={setGradeLevel}
                      label=""
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('sTEMInquiryMentor.phenomenonOrTopic')}</label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder={t('sTEMInquiryMentor.eGWhyDoObjectsFloatHowDoPlantsGrow')}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <button
                    onClick={handleNGSSInvestigation}
                    disabled={!topic.trim() || isGenerating}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />{t('sTEMInquiryMentor.generating')}</>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />{t('sTEMInquiryMentor.generateInvestigation')}</>
                    )}
                  </button>
                </div>

                <div className="lg:col-span-2 space-y-4 max-h-[800px] overflow-y-auto">
                  {ngssInvestigation ? (
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-blue-600" />{t('sTEMInquiryMentor.phenomena')}</h3>
                        <p className="text-gray-700 text-lg font-medium">{ngssInvestigation.phenomenon ?? 'N/A'}</p>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-white p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Target className="h-5 w-5 text-indigo-600" />{t('sTEMInquiryMentor.ngssAlignment')}</h3>
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">{t('sTEMInquiryMentor.performanceExpectation')}</p>
                            <p className="text-sm font-mono text-gray-900 bg-gray-50 p-2 rounded">{ngssInvestigation.performanceExpectation ?? 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Disciplinary Core Idea (DCI)</p>
                            <p className="text-sm text-gray-700">{ngssInvestigation.dci ?? 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Science & Engineering Practices (SEP)</p>
                            <ul className="space-y-1">
                              {(ngssInvestigation.sep ?? []).map((practice, idx) => (
                                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <span>{practice}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Crosscutting Concepts (CCC)</p>
                            <ul className="space-y-1">
                              {(ngssInvestigation.ccc ?? []).map((concept, idx) => (
                                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                  <Layers className="h-4 w-4 text-cyan-600 mt-0.5 flex-shrink-0" />
                                  <span>{concept}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <FlaskConical className="h-5 w-5 text-green-600" />{t('sTEMInquiryMentor.investigationPlan')}</h3>
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">{t('sTEMInquiryMentor.researchQuestion')}</p>
                            <p className="text-sm text-gray-700 bg-white p-3 rounded border border-green-200">{ngssInvestigation.investigationPlan?.question ?? 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">{t('sTEMInquiryMentor.hypothesis')}</p>
                            <p className="text-sm text-gray-700 bg-white p-3 rounded border border-green-200">{ngssInvestigation.investigationPlan?.hypothesis ?? 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">{t('sTEMInquiryMentor.materials')}</p>
                            <ul className="space-y-1">
                              {(ngssInvestigation.investigationPlan?.materials ?? []).map((material, idx) => (
                                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2 bg-white p-2 rounded border border-green-200">
                                  <Circle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span>{material}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">{t('sTEMInquiryMentor.procedure')}</p>
                            <ol className="space-y-1">
                              {(ngssInvestigation.investigationPlan?.procedure ?? []).map((step, idx) => (
                                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2 bg-white p-2 rounded border border-green-200">
                                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-semibold">
                                    {idx + 1}
                                  </span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">{t('sTEMInquiryMentor.dataCollection')}</p>
                            <p className="text-sm text-gray-700 bg-white p-3 rounded border border-green-200">{ngssInvestigation.investigationPlan?.dataCollection ?? 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">{t('sTEMInquiryMentor.analysis')}</p>
                            <p className="text-sm text-gray-700 bg-white p-3 rounded border border-green-200">{ngssInvestigation.investigationPlan?.analysis ?? 'N/A'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <ClipboardCheck className="h-5 w-5 text-purple-600" />{t('sTEMInquiryMentor.assessment')}</h3>
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">{t('sTEMInquiryMentor.formativeAssessment')}</p>
                            <ul className="space-y-1">
                              {(ngssInvestigation.assessment?.formative ?? []).map((item, idx) => (
                                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">{t('sTEMInquiryMentor.summativeAssessment')}</p>
                            <p className="text-sm text-gray-700 bg-white p-3 rounded border border-purple-200">{ngssInvestigation.assessment?.summative ?? 'N/A'}</p>
                          </div>
                        </div>
                      </div>

                      <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                        <Download className="h-4 w-4" />{t('sTEMInquiryMentor.downloadInvestigationPlan')}</button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                      <FlaskConical className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm font-medium text-gray-600">{t('sTEMInquiryMentor.enterAPhenomenonOrTopicToGenerateAnNgssAligned')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Engineering Design Tab */}
          {activeTab === 'engineering' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('sTEMInquiryMentor.engineeringProblem')}</label>
                    <textarea
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder={t('sTEMInquiryMentor.eGDesignAWaterFiltrationSystemCreateABridge')}
                      rows={4}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('sTEMInquiryMentor.gradeLevel')}</label>
                    <GradeSelect
                      variant="native"
                      value={gradeLevel}
                      onChange={setGradeLevel}
                      label=""
                    />
                  </div>
                  <button
                    onClick={handleEngineeringChallenge}
                    disabled={!topic.trim() || isGenerating}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />{t('sTEMInquiryMentor.generating')}</>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />{t('sTEMInquiryMentor.generateChallenge')}</>
                    )}
                  </button>
                </div>

                <div className="lg:col-span-2 space-y-4 max-h-[800px] overflow-y-auto">
                  {engineeringChallenge ? (
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Wrench className="h-5 w-5 text-blue-600" />{t('sTEMInquiryMentor.engineeringProblem')}</h3>
                        <p className="text-gray-700 text-lg font-medium">{engineeringChallenge.problem ?? 'N/A'}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-xl border border-gray-200 bg-red-50 p-4">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-red-600" />{t('sTEMInquiryMentor.constraints')}</h4>
                          <ul className="space-y-1">
                            {(engineeringChallenge.constraints ?? []).map((constraint, idx) => (
                              <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="text-red-600 mt-0.5">•</span>
                                <span>{constraint}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-green-50 p-4">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Target className="h-4 w-4 text-green-600" />{t('sTEMInquiryMentor.successCriteria')}</h4>
                          <ul className="space-y-1">
                            {(engineeringChallenge.criteria ?? []).map((criterion, idx) => (
                              <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{criterion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-white p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Compass className="h-5 w-5 text-indigo-600" />{t('sTEMInquiryMentor.engineeringDesignCycle')}</h3>
                        <div className="space-y-4">
                          {Object.entries(engineeringChallenge.designCycle ?? {}).map(([stage, activities]) => (
                            <div key={stage} className="rounded-lg border-2 border-indigo-200 bg-indigo-50 p-4">
                              <h4 className="text-base font-bold text-gray-900 mb-3 capitalize flex items-center gap-2">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
                                  {stage === 'ask' ? '1' : stage === 'imagine' ? '2' : stage === 'plan' ? '3' : stage === 'create' ? '4' : '5'}
                                </span>
                                {stage}
                              </h4>
                              <ul className="space-y-1 ml-10">
                                {((activities as string[]) ?? []).map((activity, idx) => (
                                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                    <span className="text-indigo-600 mt-0.5">•</span>
                                    <span>{activity}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Globe className="h-5 w-5 text-teal-600" />{t('sTEMInquiryMentor.realWorldContext')}</h3>
                        <p className="text-gray-700">{engineeringChallenge.realWorldContext ?? 'N/A'}</p>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Target className="h-5 w-5 text-purple-600" />{t('sTEMInquiryMentor.ngssAlignment')}</h3>
                        <ul className="space-y-1">
                          {(engineeringChallenge.ngssAlignment ?? []).map((standard, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                              <span className="font-mono">{standard}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                        <Download className="h-4 w-4" />{t('sTEMInquiryMentor.downloadEngineeringChallenge')}</button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                      <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm font-medium text-gray-600">{t('sTEMInquiryMentor.enterAnEngineeringProblemToGenerateACompleteDesignChall')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Inquiry Guidance Tab */}
          {activeTab === 'inquiry' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('sTEMInquiryMentor.topic')}</label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder={t('sTEMInquiryMentor.eGPlantGrowthChemicalReactions')}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('sTEMInquiryMentor.gradeLevel')}</label>
                    <GradeSelect
                      variant="native"
                      value={gradeLevel}
                      onChange={setGradeLevel}
                      label=""
                    />
                  </div>
                  <button
                    onClick={handleInquiryGuidance}
                    disabled={!topic.trim() || isGenerating}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />{t('sTEMInquiryMentor.generating')}</>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />{t('sTEMInquiryMentor.generateGuidance')}</>
                    )}
                  </button>
                </div>

                <div className="lg:col-span-2 space-y-4 max-h-[800px] overflow-y-auto">
                  {inquiryGuidance ? (
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Brain className="h-5 w-5 text-blue-600" />{t('sTEMInquiryMentor.inquiryQuestions')}</h3>
                        <div className="space-y-4">
                          {(inquiryGuidance.questions ?? []).map((q, idx) => {
                            const levelColors = {
                              exploratory: 'bg-green-50 border-green-200',
                              investigative: 'bg-blue-50 border-blue-200',
                              evaluative: 'bg-purple-50 border-purple-200',
                            }
                            return (
                              <div key={idx} className={`rounded-lg border-2 p-4 ${levelColors[q.level]}`}>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="px-2 py-1 rounded text-xs font-semibold uppercase bg-white">
                                    {q.level}
                                  </span>
                                </div>
                                <p className="text-sm font-semibold text-gray-900 mb-2">{q.question}</p>
                                <p className="text-sm text-gray-700">{q.guidance}</p>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-white p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-amber-600" />{t('sTEMInquiryMentor.hypothesisFramework')}</h3>
                        <div className="space-y-3">
                          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">{t('sTEMInquiryMentor.template')}</p>
                            <p className="text-sm font-mono text-gray-900">{inquiryGuidance.hypothesisFramework?.template ?? 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">{t('sTEMInquiryMentor.examples')}</p>
                            <ul className="space-y-2">
                              {(inquiryGuidance.hypothesisFramework?.examples ?? []).map((example, idx) => (
                                <li key={idx} className="text-sm text-gray-700 bg-gray-50 p-3 rounded border border-gray-200">
                                  "{example}"
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <FlaskConical className="h-5 w-5 text-green-600" />{t('sTEMInquiryMentor.experimentalDesign')}</h3>
                        <div className="space-y-3">
                          <div className="bg-white rounded-lg p-4 border border-green-200">
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">{t('sTEMInquiryMentor.variables')}</p>
                            <p className="text-sm text-gray-700 whitespace-pre-line">{inquiryGuidance.experimentalDesign?.variables ?? 'N/A'}</p>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-green-200">
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">{t('sTEMInquiryMentor.controls')}</p>
                            <p className="text-sm text-gray-700 whitespace-pre-line">{inquiryGuidance.experimentalDesign?.controls ?? 'N/A'}</p>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-green-200">
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">{t('sTEMInquiryMentor.procedure')}</p>
                            <p className="text-sm text-gray-700 whitespace-pre-line">{inquiryGuidance.experimentalDesign?.procedure ?? 'N/A'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <LineChart className="h-5 w-5 text-indigo-600" />{t('sTEMInquiryMentor.dataAnalysis')}</h3>
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">{t('sTEMInquiryMentor.analysisMethods')}</p>
                            <ul className="space-y-1">
                              {(inquiryGuidance.dataAnalysis?.methods ?? []).map((method, idx) => (
                                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                                  <span>{method}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">{t('sTEMInquiryMentor.tools')}</p>
                            <ul className="space-y-1">
                              {(inquiryGuidance.dataAnalysis?.tools ?? []).map((tool, idx) => (
                                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                  <Wand2 className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                                  <span>{tool}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-indigo-200">
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">{t('sTEMInquiryMentor.interpretationGuidance')}</p>
                            <p className="text-sm text-gray-700">{inquiryGuidance.dataAnalysis?.interpretation ?? 'N/A'}</p>
                          </div>
                        </div>
                      </div>

                      <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                        <Download className="h-4 w-4" />{t('sTEMInquiryMentor.downloadInquiryGuide')}</button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                      <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm font-medium text-gray-600">{t('sTEMInquiryMentor.enterATopicToGenerateInquiryGuidanceWithQuestionsHypoth')}</p>
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
        onNewTask={handleNewTask}
      >
        {workspaceBody}
      </CoachWorkspaceShell>
    </div>
  )
}


export default STEMInquiryMentor



