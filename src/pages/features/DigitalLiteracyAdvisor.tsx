import { useState } from 'react'
import {
  Shield,
  AlertTriangle,
  BookOpen,
  Zap,
  CheckCircle,
  Sparkles,
  Download,
  RefreshCw,
  Star,
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
  getGradeLevels,
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
import {
  mapDigitalCitizenshipLessonResult,
  mapDigitalStandardsToCitizenshipList,
  mapOnlineSafetyToGuidelines,
  mapOnlineSafetyToPlan,
  mapMediaLiteracyResult,
  mapTechIntegrationResult,
} from '../../utils/digitalLiteracyAdapters'

const CHATBOT_SLUG = 'digital-literacy-advisor'

type TabType = 'digital-citizenship' | 'online-safety' | 'media-literacy' | 'technology-integration' | 'standards' | 'resources'

const DigitalLiteracyAdvisor = () => {
  const { toast } = useSnackbar()
  const { creditError, clearCreditError, captureApiError, runWithCredits } = useCapabilityCreditGate()
  const [activeTab, setActiveTab] = useState<TabType>('digital-citizenship')
  const [gradeLevel, setGradeLevel] = useState('High School (9-12)')
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
        toast.error('Could not restore saved output from History.')
      }
    },
  })

  const gradeLevels = getGradeLevels()
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
          grade_level: gradeLevel,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setCitizenshipStandards(mapDigitalStandardsToCitizenshipList(response.result, gradeLevel))
      pinFromResponse(response.conversation_id)
      toast.success('Standards loaded')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to load standards'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
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
          grade_level: gradeLevel,
          lesson_topic: lessonTopic.trim(),
          duration: lessonDuration,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setGeneratedLesson(mapDigitalCitizenshipLessonResult(response.result, gradeLevel))
      pinFromResponse(response.conversation_id)
      toast.success('Lesson generated')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to generate lesson'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
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
          grade_level: gradeLevel,
          safety_topic: 'General online safety overview',
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setSafetyGuidelines(mapOnlineSafetyToGuidelines(response.result, gradeLevel))
      pinFromResponse(response.conversation_id)
      toast.success('Safety guidelines loaded')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to load safety guidelines'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
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
          grade_level: gradeLevel,
          safety_topic: topic,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setGeneratedSafetyPlan(mapOnlineSafetyToPlan(response.result, topic, gradeLevel))
      pinFromResponse(response.conversation_id)
      toast.success('Safety plan generated')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to generate safety plan'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
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
          grade_level: gradeLevel,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setMediaConcepts(mapMediaLiteracyResult(response.result, gradeLevel))
      pinFromResponse(response.conversation_id)
      toast.success('Media literacy content loaded')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to load media literacy concepts'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
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
          grade_level: gradeLevel,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setIntegrationStrategies(mapTechIntegrationResult(response.result, gradeLevel))
      pinFromResponse(response.conversation_id)
      toast.success('Integration strategies loaded')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to load strategies'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const tabs = [
    { id: 'digital-citizenship' as TabType, label: 'Digital Citizenship', icon: Users },
    { id: 'online-safety' as TabType, label: 'Online Safety', icon: Shield },
    { id: 'media-literacy' as TabType, label: 'Media Literacy', icon: BookOpen },
    { id: 'technology-integration' as TabType, label: 'Tech Integration', icon: Zap },
    { id: 'standards' as TabType, label: 'Standards', icon: CheckCircle },
    { id: 'resources' as TabType, label: 'Resources', icon: FileText },
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
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-3xl font-bold">Digital Literacy Advisor</h1>
                  <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    <Star className="h-3 w-3" /> 4.9★
                  </span>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    <Lock className="inline h-3 w-3 mr-1" /> Premium
                  </span>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    <Globe className="inline h-3 w-3 mr-1" /> International Standards
                  </span>
                </div>
                <p className="mt-2 text-blue-100">
                  Comprehensive digital literacy education aligned with international standards (ISTE, UNESCO, DigComp, Common Sense Media). 
                  Help students master digital citizenship, online safety, media literacy, and technology integration 
                  through evidence-based strategies and global best practices.
                </p>
              </div>
            </div>
            
            {/* Quick Settings */}
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <label className="text-sm font-medium">Grade Level:</label>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="bg-white/20 border border-white/30 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  {gradeLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="p-6">
          {/* Digital Citizenship Tab */}
          {activeTab === 'digital-citizenship' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="h-6 w-6 text-blue-600" />
                  Digital Citizenship Education
                </h2>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lesson Topic
                    </label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={lessonDuration}
                      onChange={(e) => setLessonDuration(e.target.value)}
                      placeholder="e.g., 45 minutes"
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
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Generate Lesson Plan
                    </>
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
                      <h4 className="font-semibold text-gray-900 mb-2">Learning Objectives</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {generatedLesson.learningObjectives.map((obj, i) => (
                          <li key={i}>{obj}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Activities</h4>
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
                      <h4 className="font-semibold text-gray-900 mb-2">Assessment</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {generatedLesson.assessment.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Standards Alignment</h4>
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
                  <CheckCircle className="h-5 w-5 text-indigo-600" />
                  International Standards
                </h3>
                <button
                  onClick={handleLoadStandards}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Load International Standards
                    </>
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
                            <h4 className="font-semibold text-gray-900 mb-2">Key Components</h4>
                            <div className="flex flex-wrap gap-2">
                              {standard.keyComponents.map((component, i) => (
                                <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                  {component}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Competencies</h4>
                            <div className="space-y-3">
                              {standard.competencies.map((competency, i) => (
                                <div key={i} className="border-l-4 border-indigo-500 pl-4">
                                  <h5 className="font-semibold text-gray-900">{competency.competency}</h5>
                                  <p className="text-sm text-gray-700 mt-1">{competency.description}</p>
                                  <div className="mt-2">
                                    <span className="text-xs font-medium text-gray-700">Indicators:</span>
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
                  <Shield className="h-6 w-6 text-red-600" />
                  Online Safety Guidelines
                </h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Safety Topic
                  </label>
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
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Generate Safety Plan
                    </>
                  )}
                </button>
              </div>

              {generatedSafetyPlan && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{generatedSafetyPlan.topic}</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Prevention Strategies</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {generatedSafetyPlan.preventionStrategies.map((strategy, i) => (
                          <li key={i}>{strategy}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Detection Methods</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {generatedSafetyPlan.detectionMethods.map((method, i) => (
                          <li key={i}>{method}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Response Protocol</h4>
                      <ol className="list-decimal list-inside space-y-1 text-gray-700">
                        {generatedSafetyPlan.responseProtocol.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Resources</h4>
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
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Comprehensive Safety Guidelines
                </h3>
                <button
                  onClick={handleLoadSafetyGuidelines}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 transition"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Load Safety Guidelines
                    </>
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
                            <h4 className="font-semibold text-gray-900 mb-2">Risks</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                              {guideline.risks.map((risk, i) => (
                                <li key={i}>{risk}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Prevention Strategies</h4>
                              <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {guideline.preventionStrategies.map((strategy, i) => (
                                  <li key={i}>{strategy}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Response Actions</h4>
                              <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {guideline.responseActions.map((action, i) => (
                                  <li key={i}>{action}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Resources</h4>
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
                  <BookOpen className="h-6 w-6 text-purple-600" />
                  Media Literacy Concepts
                </h2>
                <button
                  onClick={handleLoadMediaConcepts}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 transition"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Load Media Literacy Concepts
                    </>
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
                            <h4 className="font-semibold text-gray-900 mb-2">Key Skills</h4>
                            <div className="flex flex-wrap gap-2">
                              {concept.keySkills.map((skill, i) => (
                                <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Activities</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                              {concept.activities.map((activity, i) => (
                                <li key={i}>{activity}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Real-World Examples</h4>
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
                  <Zap className="h-6 w-6 text-green-600" />
                  Technology Integration Strategies
                </h2>
                <button
                  onClick={handleLoadStrategies}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Load Integration Strategies
                    </>
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
                            <h4 className="font-semibold text-gray-900 mb-2">Tools</h4>
                            <div className="flex flex-wrap gap-2">
                              {strategy.tools.map((tool, i) => (
                                <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Implementation Steps</h4>
                            <ol className="list-decimal list-inside space-y-1 text-gray-700">
                              {strategy.implementationSteps.map((step, i) => (
                                <li key={i}>{step}</li>
                              ))}
                            </ol>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Benefits</h4>
                              <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {strategy.benefits.map((benefit, i) => (
                                  <li key={i}>{benefit}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Best Practices</h4>
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
                  <CheckCircle className="h-6 w-6 text-indigo-600" />
                  International Digital Literacy Standards
                </h2>
                <p className="text-gray-700 mb-4">
                  Access comprehensive international standards for digital literacy education from leading organizations worldwide.
                </p>
                <button
                  onClick={handleLoadStandards}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Load All Standards
                    </>
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
                            <h4 className="font-semibold text-gray-900 mb-2">Key Components</h4>
                            <div className="flex flex-wrap gap-2">
                              {standard.keyComponents.map((component, i) => (
                                <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                  {component}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Competencies</h4>
                            <div className="space-y-3">
                              {standard.competencies.map((competency, i) => (
                                <div key={i} className="border-l-4 border-indigo-500 pl-4">
                                  <h5 className="font-semibold text-gray-900">{competency.competency}</h5>
                                  <p className="text-sm text-gray-700 mt-1">{competency.description}</p>
                                  <div className="mt-2">
                                    <span className="text-xs font-medium text-gray-700">Indicators:</span>
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
                  <FileText className="h-6 w-6 text-gray-600" />
                  Digital Literacy Resources
                </h2>
                <p className="text-gray-600">
                  Curated resources for digital citizenship, online safety, media literacy, and technology integration.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    Digital Citizenship
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-blue-600" />
                      <span>ISTE Digital Citizen Resources</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-blue-600" />
                      <span>Common Sense Media Curriculum</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-blue-600" />
                      <span>UNESCO Media Literacy Framework</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-blue-600" />
                      <span>DigComp Framework Resources</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Online Safety
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-red-600" />
                      <span>StopBullying.gov</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-red-600" />
                      <span>NetSmartz</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-red-600" />
                      <span>StaySafeOnline.org</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-red-600" />
                      <span>FBI Safe Online Surfing</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                    Media Literacy
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-purple-600" />
                      <span>News Literacy Project</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-purple-600" />
                      <span>MediaWise</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-purple-600" />
                      <span>FactCheck.org</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-purple-600" />
                      <span>Snopes.com</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-green-600" />
                    Technology Integration
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-green-600" />
                      <span>ISTE Technology Standards</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-green-600" />
                      <span>EdTech Integration Guides</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-green-600" />
                      <span>Blended Learning Resources</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-green-600" />
                      <span>PBL Technology Tools</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DigitalLiteracyAdvisor



