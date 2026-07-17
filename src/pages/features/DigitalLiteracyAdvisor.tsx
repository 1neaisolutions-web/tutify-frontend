import { useCallback, useEffect, useState } from 'react'
import {
  Shield,
  AlertTriangle,
  BookOpen,
  Zap,
  CheckCircle,
  Sparkles,
  Download,
  RefreshCw,
  Lock,
  Globe,
  Eye,
  FileText,
  Users,
  Lightbulb,
  TrendingUp,
  Award,
  Target,
  Copy,
  ExternalLink,
  GraduationCap,
  Info,
  Lock as LockIcon,
  Search,
  MessageSquare,
  Video,
  Code,
  Gamepad2,
} from 'lucide-react'
import {
  getDigitalCitizenshipTopics,
  getOnlineSafetyTopics,
  DigitalCitizenshipStandard,
  OnlineSafetyGuideline,
  MediaLiteracyConcept,
  TechnologyIntegrationStrategy,
  DigitalCitizenshipLesson,
  DigitalSafetyPlan,
} from '../../utils/digitalLiteracyUtils'
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
import {
  mapDigitalCitizenshipLessonResult,
  mapDigitalStandardsToCitizenshipList,
  mapOnlineSafetyToGuidelines,
  mapOnlineSafetyToPlan,
  mapMediaLiteracyResult,
  mapTechIntegrationResult,
} from '../../utils/digitalLiteracyAdapters'

import { useTranslation } from 'react-i18next'
import { GradeBandSelect } from '@/components/shared/GradeBandSelect'
import { chatbotBandToApi } from '@/catalog/adapters/chatbotAdapters'
const CHATBOT_SLUG = 'digital-literacy-advisor'

type TabType = 'digital-citizenship' | 'online-safety' | 'media-literacy' | 'technology-integration' | 'standards' | 'resources'

const DigitalLiteracyAdvisor = () => {
  const { t } = useTranslation()
  const { toast } = useSnackbar()
  const { creditError, clearCreditError, captureApiError, runWithCredits } = useCapabilityCreditGate()
  const { redirectTo, capability, siblings, category, tabId } = useCoachCapabilityRoute(CHATBOT_SLUG)

  const [activeTab, setActiveTab] = useState<TabType>('digital-citizenship')
  const [gradeLevel, setGradeLevel] = useState('9-12')
  const [isGenerating, setIsGenerating] = useState(false)

  // Digital Citizenship State
  const [citizenshipStandards, setCitizenshipStandards] = useState<DigitalCitizenshipStandard[]>([])
  const [selectedStandard, setSelectedStandard] = useState<DigitalCitizenshipStandard | null>(null)
  const [lessonTopic, setLessonTopic] = useState('Digital Footprint')
  const [lessonDuration, setLessonDuration] = useState('45 minutes')
  const [generatedLesson, setGeneratedLesson] = useState<DigitalCitizenshipLesson | null>(null)

  // Online Safety State
  const [safetyGuidelines, setSafetyGuidelines] = useState<OnlineSafetyGuideline[]>([])
  const [selectedGuideline, setSelectedGuideline] = useState<OnlineSafetyGuideline | null>(null)
  const [safetyTopic, setSafetyTopic] = useState('Cyberbullying Prevention')
  const [generatedSafetyPlan, setGeneratedSafetyPlan] = useState<DigitalSafetyPlan | null>(null)

  // Media Literacy State
  const [mediaConcepts, setMediaConcepts] = useState<MediaLiteracyConcept[]>([])
  const [selectedConcept, setSelectedConcept] = useState<MediaLiteracyConcept | null>(null)

  // Technology Integration State
  const [integrationStrategies, setIntegrationStrategies] = useState<TechnologyIntegrationStrategy[]>([])
  const [selectedStrategy, setSelectedStrategy] = useState<TechnologyIntegrationStrategy | null>(null)

  const DIGITAL_CAP_TABS: Record<string, TabType> = {
    standards: 'standards',
    digital_citizenship: 'digital-citizenship',
    online_safety: 'online-safety',
    media_literacy: 'media-literacy',
    tech_integration: 'technology-integration',
  }

  const isCapabilityTab = useCallback((tab: string): tab is TabType => {
    return tab === 'digital-citizenship' || tab === 'online-safety' || tab === 'media-literacy' || tab === 'technology-integration' || tab === 'standards' || tab === 'resources'
  }, [])

  useEffect(() => {
    if (tabId && isCapabilityTab(tabId)) setActiveTab(tabId)
  }, [tabId, isCapabilityTab])

  const { conversationIdForActiveTab, pinFromResponse } = useChatbotHistorySession({
    slug: CHATBOT_SLUG,
    activeTab,
    capabilityKeyToTab: DIGITAL_CAP_TABS,
    onRestore: async ({ tabKey, userContent, assistantContent, assistantMetadata }) => {
      const cap = assistantMetadata?.capability_key as string | undefined
      const valid: TabType[] = [
        'digital-citizenship',
        'online-safety',
        'media-literacy',
        'technology-integration',
        'standards',
        'resources',
      ]
      const tab: TabType =
        valid.includes(tabKey as TabType)
          ? (tabKey as TabType)
          : cap && DIGITAL_CAP_TABS[cap]
            ? DIGITAL_CAP_TABS[cap]
            : 'digital-citizenship'
      setActiveTab(tab)
      try {
        const raw = JSON.parse(assistantContent) as Record<string, unknown>
        const u = userContent?.trim() ?? ''
        if (tab === 'standards' || cap === 'standards') {
          setCitizenshipStandards(mapDigitalStandardsToCitizenshipList(raw, gradeLevel))
        } else if (tab === 'digital-citizenship' || cap === 'digital_citizenship') {
          if (u) setLessonTopic(u)
          setGeneratedLesson(mapDigitalCitizenshipLessonResult(raw, gradeLevel))
        } else if (tab === 'online-safety' || cap === 'online_safety') {
          if (u && u !== 'General online safety overview') {
            setSafetyTopic(u)
            try {
              setGeneratedSafetyPlan(mapOnlineSafetyToPlan(raw, u, gradeLevel))
            } catch {
              setSafetyGuidelines(mapOnlineSafetyToGuidelines(raw, gradeLevel))
            }
          } else {
            setSafetyGuidelines(mapOnlineSafetyToGuidelines(raw, gradeLevel))
          }
        } else if (tab === 'media-literacy' || cap === 'media_literacy') {
          setMediaConcepts(mapMediaLiteracyResult(raw, gradeLevel))
        } else if (tab === 'technology-integration' || cap === 'tech_integration') {
          setIntegrationStrategies(mapTechIntegrationResult(raw, gradeLevel))
        }
      } catch {
        toast.error(t('digitalLiteracyAdvisor.couldNotRestoreSavedOutputFromHistory'))
      }
    },
  })

  const citizenshipTopics = getDigitalCitizenshipTopics()
  const safetyTopics = getOnlineSafetyTopics()

  // Load Digital Citizenship Standards
  const handleLoadStandards = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'standards', {
        input: ' ',
        input_type: 'text',
        parameters: {
          grade_level: chatbotBandToApi(gradeLevel),
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setCitizenshipStandards(mapDigitalStandardsToCitizenshipList(response.result, gradeLevel))
      pinFromResponse(response.conversation_id)
      toast.success(t('digitalLiteracyAdvisor.standardsLoaded'))
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to load standards'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info(t('digitalLiteracyAdvisor.upgradeToPremiumToUseThisFeature'), { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate Digital Citizenship Lesson
  const handleGenerateLesson = async () => {
    if (!lessonTopic.trim()) return
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'digital_citizenship', {
        input: lessonTopic.trim(),
        input_type: 'text',
        parameters: {
          grade_level: chatbotBandToApi(gradeLevel),
          lesson_topic: lessonTopic.trim(),
          duration: lessonDuration,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setGeneratedLesson(mapDigitalCitizenshipLessonResult(response.result, gradeLevel))
      pinFromResponse(response.conversation_id)
      toast.success(t('digitalLiteracyAdvisor.lessonGenerated'))
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to generate lesson'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info(t('digitalLiteracyAdvisor.upgradeToPremiumToUseThisFeature'), { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Load Online Safety Guidelines
  const handleLoadSafetyGuidelines = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'online_safety', {
        input: 'General online safety overview',
        input_type: 'text',
        parameters: {
          grade_level: chatbotBandToApi(gradeLevel),
          safety_topic: 'General online safety overview',
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setSafetyGuidelines(mapOnlineSafetyToGuidelines(response.result, gradeLevel))
      pinFromResponse(response.conversation_id)
      toast.success(t('digitalLiteracyAdvisor.safetyGuidelinesLoaded'))
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to load safety guidelines'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info(t('digitalLiteracyAdvisor.upgradeToPremiumToUseThisFeature'), { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate Safety Plan
  const handleGenerateSafetyPlan = async () => {
    if (!safetyTopic.trim()) return
    setIsGenerating(true)
    try {
      const topic = safetyTopic.trim()
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'online_safety', {
        input: topic,
        input_type: 'text',
        parameters: {
          grade_level: chatbotBandToApi(gradeLevel),
          safety_topic: topic,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setGeneratedSafetyPlan(mapOnlineSafetyToPlan(response.result, topic, gradeLevel))
      pinFromResponse(response.conversation_id)
      toast.success(t('digitalLiteracyAdvisor.safetyPlanGenerated'))
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to generate safety plan'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info(t('digitalLiteracyAdvisor.upgradeToPremiumToUseThisFeature'), { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Load Media Literacy Concepts
  const handleLoadMediaConcepts = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'media_literacy', {
        input: ' ',
        input_type: 'text',
        parameters: {
          grade_level: chatbotBandToApi(gradeLevel),
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setMediaConcepts(mapMediaLiteracyResult(response.result, gradeLevel))
      pinFromResponse(response.conversation_id)
      toast.success(t('digitalLiteracyAdvisor.mediaLiteracyContentLoaded'))
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to load media literacy concepts'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info(t('digitalLiteracyAdvisor.upgradeToPremiumToUseThisFeature'), { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Load Technology Integration Strategies
  const handleLoadStrategies = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'tech_integration', {
        input: ' ',
        input_type: 'text',
        parameters: {
          grade_level: chatbotBandToApi(gradeLevel),
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setIntegrationStrategies(mapTechIntegrationResult(response.result, gradeLevel))
      pinFromResponse(response.conversation_id)
      toast.success(t('digitalLiteracyAdvisor.integrationStrategiesLoaded'))
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to load strategies'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info(t('digitalLiteracyAdvisor.upgradeToPremiumToUseThisFeature'), { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }



  const handleNewTask = () => {
    setCitizenshipStandards([])
    setSelectedStandard(null)
    setGeneratedLesson(null)
    setSafetyGuidelines([])
    setSelectedGuideline(null)
    setGeneratedSafetyPlan(null)
    setMediaConcepts([])
    setSelectedConcept(null)
    setIntegrationStrategies([])
    setSelectedStrategy(null)
  }

  if (redirectTo) return <CoachCapabilityRedirect to={redirectTo} />
  if (!capability) return <CoachCapabilityRedirect to={`/chatbots/${CHATBOT_SLUG}?cap=digital_citizenship`} />


  const workspaceBody = (
        <div className="space-y-6">

            
                      {/* Quick Settings */}
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
                          <label className="text-sm font-medium text-gray-700">{t('digitalLiteracyAdvisor.gradeLevel')}</label>
                          <GradeBandSelect
                            variant="native"
                            value={gradeLevel}
                            onChange={setGradeLevel}
                            label=""
                            context="chatbotBand"
                            selectClassName="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-200"
                          />
                        </div>
                      </div>

          {activeTab === 'digital-citizenship' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="h-6 w-6 text-blue-600" />{t('digitalLiteracyAdvisor.digitalCitizenshipEducation')}</h2>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('digitalLiteracyAdvisor.lessonTopic')}</label>
                    <select
                      value={lessonTopic}
                      onChange={(e) => setLessonTopic(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {citizenshipTopics.map(topic => (
                        <option key={topic} value={topic}>{topic}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('digitalLiteracyAdvisor.duration')}</label>
                    <input
                      type="text"
                      value={lessonDuration}
                      onChange={(e) => setLessonDuration(e.target.value)}
                      placeholder={t('digitalLiteracyAdvisor.eG45Minutes')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button
                  onClick={handleGenerateLesson}
                  disabled={!lessonTopic.trim() || isGenerating}
                  className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />{t('digitalLiteracyAdvisor.generating')}</>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />{t('digitalLiteracyAdvisor.generateLessonPlan')}</>
                  )}
                </button>
              </div>

              {generatedLesson && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{generatedLesson.title}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          {generatedLesson.gradeLevel}
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          {generatedLesson.duration}
                        </span>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                      <Download className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('digitalLiteracyAdvisor.learningObjectives')}</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {generatedLesson.learningObjectives.map((obj, i) => (
                          <li key={i}>{obj}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">{t('digitalLiteracyAdvisor.activities')}</h4>
                      <div className="space-y-3">
                        {generatedLesson.activities.map((activity, idx) => (
                          <div key={idx} className="border-l-4 border-blue-500 pl-4">
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="font-semibold text-gray-900">{activity.activity}</h5>
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                                {activity.duration}
                              </span>
                            </div>
                            <p className="text-gray-700">{activity.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('digitalLiteracyAdvisor.assessment')}</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {generatedLesson.assessment.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('digitalLiteracyAdvisor.standardsAlignment')}</h4>
                      <div className="flex flex-wrap gap-2">
                        {generatedLesson.standardsAlignment.map((standard, i) => (
                          <span key={i} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                            {standard}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-indigo-600" />{t('digitalLiteracyAdvisor.internationalStandards')}</h3>
                <button
                  onClick={handleLoadStandards}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />{t('digitalLiteracyAdvisor.loading')}</>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />{t('digitalLiteracyAdvisor.loadInternationalStandards')}</>
                  )}
                </button>
              </div>

              {citizenshipStandards.length > 0 && (
                <div className="space-y-4">
                  {citizenshipStandards.map((standard, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm cursor-pointer hover:border-indigo-300 transition"
                      onClick={() => setSelectedStandard(selectedStandard?.id === standard.id ? null : standard)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900">{standard.name}</h3>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                              {standard.organization}
                            </span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                              {standard.region}
                            </span>
                          </div>
                        </div>
                        <Eye className="h-5 w-5 text-gray-400" />
                      </div>
                      <p className="text-gray-700">{standard.description}</p>

                      {selectedStandard?.id === standard.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">{t('digitalLiteracyAdvisor.keyComponents')}</h4>
                            <div className="flex flex-wrap gap-2">
                              {standard.keyComponents.map((component, i) => (
                                <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                  {component}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">{t('digitalLiteracyAdvisor.competencies')}</h4>
                            <div className="space-y-3">
                              {standard.competencies.map((competency, i) => (
                                <div key={i} className="border-l-4 border-indigo-500 pl-4">
                                  <h5 className="font-semibold text-gray-900">{competency.competency}</h5>
                                  <p className="text-sm text-gray-700 mt-1">{competency.description}</p>
                                  <div className="mt-2">
                                    <span className="text-xs font-medium text-gray-700">{t('digitalLiteracyAdvisor.indicators')}</span>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 mt-1">
                                      {competency.indicators.map((indicator, j) => (
                                        <li key={j}>{indicator}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Online Safety Tab */}
          {activeTab === 'online-safety' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="h-6 w-6 text-red-600" />{t('digitalLiteracyAdvisor.onlineSafetyGuidelines')}</h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('digitalLiteracyAdvisor.safetyTopic')}</label>
                  <select
                    value={safetyTopic}
                    onChange={(e) => setSafetyTopic(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    {safetyTopics.map(topic => (
                      <option key={topic} value={topic}>{topic}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleGenerateSafetyPlan}
                  disabled={!safetyTopic.trim() || isGenerating}
                  className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />{t('digitalLiteracyAdvisor.generating')}</>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />{t('digitalLiteracyAdvisor.generateSafetyPlan')}</>
                  )}
                </button>
              </div>

              {generatedSafetyPlan && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{generatedSafetyPlan.topic}</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('digitalLiteracyAdvisor.preventionStrategies')}</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {generatedSafetyPlan.preventionStrategies.map((strategy, i) => (
                          <li key={i}>{strategy}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('digitalLiteracyAdvisor.detectionMethods')}</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {generatedSafetyPlan.detectionMethods.map((method, i) => (
                          <li key={i}>{method}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('digitalLiteracyAdvisor.responseProtocol')}</h4>
                      <ol className="list-decimal list-inside space-y-1 text-gray-700">
                        {generatedSafetyPlan.responseProtocol.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('digitalLiteracyAdvisor.resources')}</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {generatedSafetyPlan.resources.map((resource, i) => (
                          <li key={i}>{resource}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />{t('digitalLiteracyAdvisor.comprehensiveSafetyGuidelines')}</h3>
                <button
                  onClick={handleLoadSafetyGuidelines}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 transition"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />{t('digitalLiteracyAdvisor.loading')}</>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />{t('digitalLiteracyAdvisor.loadSafetyGuidelines')}</>
                  )}
                </button>
              </div>

              {safetyGuidelines.length > 0 && (
                <div className="space-y-4">
                  {safetyGuidelines.map((guideline, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm cursor-pointer hover:border-orange-300 transition"
                      onClick={() => setSelectedGuideline(selectedGuideline?.id === guideline.id ? null : guideline)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900">{guideline.topic}</h3>
                        </div>
                        <Eye className="h-5 w-5 text-gray-400" />
                      </div>
                      <p className="text-gray-700">{guideline.description}</p>

                      {selectedGuideline?.id === guideline.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">{t('digitalLiteracyAdvisor.risks')}</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                              {guideline.risks.map((risk, i) => (
                                <li key={i}>{risk}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">{t('digitalLiteracyAdvisor.preventionStrategies')}</h4>
                              <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {guideline.preventionStrategies.map((strategy, i) => (
                                  <li key={i}>{strategy}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">{t('digitalLiteracyAdvisor.responseActions')}</h4>
                              <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {guideline.responseActions.map((action, i) => (
                                  <li key={i}>{action}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">{t('digitalLiteracyAdvisor.resources')}</h4>
                            <div className="flex flex-wrap gap-2">
                              {guideline.resources.map((resource, i) => (
                                <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                  {resource}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Media Literacy Tab */}
          {activeTab === 'media-literacy' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-purple-600" />{t('digitalLiteracyAdvisor.mediaLiteracyConcepts')}</h2>
                <button
                  onClick={handleLoadMediaConcepts}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 transition"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />{t('digitalLiteracyAdvisor.loading')}</>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />{t('digitalLiteracyAdvisor.loadMediaLiteracyConcepts')}</>
                  )}
                </button>
              </div>

              {mediaConcepts.length > 0 && (
                <div className="space-y-4">
                  {mediaConcepts.map((concept, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm cursor-pointer hover:border-purple-300 transition"
                      onClick={() => setSelectedConcept(selectedConcept?.id === concept.id ? null : concept)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900">{concept.concept}</h3>
                        </div>
                        <Eye className="h-5 w-5 text-gray-400" />
                      </div>
                      <p className="text-gray-700">{concept.description}</p>

                      {selectedConcept?.id === concept.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">{t('digitalLiteracyAdvisor.keySkills')}</h4>
                            <div className="flex flex-wrap gap-2">
                              {concept.keySkills.map((skill, i) => (
                                <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">{t('digitalLiteracyAdvisor.activities')}</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                              {concept.activities.map((activity, i) => (
                                <li key={i}>{activity}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">{t('digitalLiteracyAdvisor.realWorldExamples')}</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                              {concept.realWorldExamples.map((example, i) => (
                                <li key={i}>{example}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Technology Integration Tab */}
          {activeTab === 'technology-integration' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 border border-green-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="h-6 w-6 text-green-600" />{t('digitalLiteracyAdvisor.technologyIntegrationStrategies')}</h2>
                <button
                  onClick={handleLoadStrategies}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />{t('digitalLiteracyAdvisor.loading')}</>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />{t('digitalLiteracyAdvisor.loadIntegrationStrategies')}</>
                  )}
                </button>
              </div>

              {integrationStrategies.length > 0 && (
                <div className="space-y-4">
                  {integrationStrategies.map((strategy, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm cursor-pointer hover:border-green-300 transition"
                      onClick={() => setSelectedStrategy(selectedStrategy?.id === strategy.id ? null : strategy)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900">{strategy.strategy}</h3>
                          <div className="flex items-center gap-2 mt-2">
                            {strategy.gradeLevels.map((level, i) => (
                              <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                {level}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Eye className="h-5 w-5 text-gray-400" />
                      </div>
                      <p className="text-gray-700">{strategy.description}</p>

                      {selectedStrategy?.id === strategy.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">{t('digitalLiteracyAdvisor.tools')}</h4>
                            <div className="flex flex-wrap gap-2">
                              {strategy.tools.map((tool, i) => (
                                <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">{t('digitalLiteracyAdvisor.implementationSteps')}</h4>
                            <ol className="list-decimal list-inside space-y-1 text-gray-700">
                              {strategy.implementationSteps.map((step, i) => (
                                <li key={i}>{step}</li>
                              ))}
                            </ol>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">{t('digitalLiteracyAdvisor.benefits')}</h4>
                              <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {strategy.benefits.map((benefit, i) => (
                                  <li key={i}>{benefit}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">{t('digitalLiteracyAdvisor.bestPractices')}</h4>
                              <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {strategy.bestPractices.map((practice, i) => (
                                  <li key={i}>{practice}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Standards Tab */}
          {activeTab === 'standards' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-indigo-600" />{t('digitalLiteracyAdvisor.internationalDigitalLiteracyStandards')}</h2>
                <p className="text-gray-700 mb-4">{t('digitalLiteracyAdvisor.accessComprehensiveInternationalStandardsForDigitalLite')}</p>
                <button
                  onClick={handleLoadStandards}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />{t('digitalLiteracyAdvisor.loading')}</>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />{t('digitalLiteracyAdvisor.loadAllStandards')}</>
                  )}
                </button>
              </div>

              {citizenshipStandards.length > 0 && (
                <div className="space-y-4">
                  {citizenshipStandards.map((standard, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm cursor-pointer hover:border-indigo-300 transition"
                      onClick={() => setSelectedStandard(selectedStandard?.id === standard.id ? null : standard)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900">{standard.name}</h3>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                              {standard.organization}
                            </span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                              {standard.region}
                            </span>
                          </div>
                        </div>
                        <Eye className="h-5 w-5 text-gray-400" />
                      </div>
                      <p className="text-gray-700">{standard.description}</p>

                      {selectedStandard?.id === standard.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">{t('digitalLiteracyAdvisor.keyComponents')}</h4>
                            <div className="flex flex-wrap gap-2">
                              {standard.keyComponents.map((component, i) => (
                                <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                  {component}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">{t('digitalLiteracyAdvisor.competencies')}</h4>
                            <div className="space-y-3">
                              {standard.competencies.map((competency, i) => (
                                <div key={i} className="border-l-4 border-indigo-500 pl-4">
                                  <h5 className="font-semibold text-gray-900">{competency.competency}</h5>
                                  <p className="text-sm text-gray-700 mt-1">{competency.description}</p>
                                  <div className="mt-2">
                                    <span className="text-xs font-medium text-gray-700">{t('digitalLiteracyAdvisor.indicators')}</span>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 mt-1">
                                      {competency.indicators.map((indicator, j) => (
                                        <li key={j}>{indicator}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="h-6 w-6 text-gray-600" />{t('digitalLiteracyAdvisor.digitalLiteracyResources')}</h2>
                <p className="text-gray-600">{t('digitalLiteracyAdvisor.curatedResourcesForDigitalCitizenshipOnlineSafetyMediaL')}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />{t('digitalLiteracyAdvisor.digitalCitizenship')}</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-blue-600" />
                      <span>{t('digitalLiteracyAdvisor.isteDigitalCitizenResources')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-blue-600" />
                      <span>{t('digitalLiteracyAdvisor.commonSenseMediaCurriculum')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-blue-600" />
                      <span>{t('digitalLiteracyAdvisor.unescoMediaLiteracyFramework')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-blue-600" />
                      <span>{t('digitalLiteracyAdvisor.digcompFrameworkResources')}</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />{t('digitalLiteracyAdvisor.onlineSafety')}</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-red-600" />
                      <span>{t('digitalLiteracyAdvisor.stopbullyingGov')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-red-600" />
                      <span>{t('digitalLiteracyAdvisor.netsmartz')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-red-600" />
                      <span>{t('digitalLiteracyAdvisor.staysafeonlineOrg')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-red-600" />
                      <span>{t('digitalLiteracyAdvisor.fbiSafeOnlineSurfing')}</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-purple-600" />{t('digitalLiteracyAdvisor.mediaLiteracy')}</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-purple-600" />
                      <span>{t('digitalLiteracyAdvisor.newsLiteracyProject')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-purple-600" />
                      <span>{t('digitalLiteracyAdvisor.mediawise')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-purple-600" />
                      <span>{t('digitalLiteracyAdvisor.factcheckOrg')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-purple-600" />
                      <span>{t('digitalLiteracyAdvisor.snopesCom')}</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-green-600" />{t('digitalLiteracyAdvisor.technologyIntegration')}</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-green-600" />
                      <span>{t('digitalLiteracyAdvisor.isteTechnologyStandards')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-green-600" />
                      <span>{t('digitalLiteracyAdvisor.edtechIntegrationGuides')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-green-600" />
                      <span>{t('digitalLiteracyAdvisor.blendedLearningResources')}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-green-600" />
                      <span>{t('digitalLiteracyAdvisor.pblTechnologyTools')}</span>
                    </li>
                  </ul>
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


export default DigitalLiteracyAdvisor



