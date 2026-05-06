import { useState } from 'react'
import {
  Leaf,
  Globe,
  Droplets,
  TreePine,
  Wind,
  Sun,
  Recycle,
  BarChart3,
  Target,
  CheckCircle,
  Sparkles,
  Download,
  RefreshCw,
  CheckCircle2,
  Clock,
  Star,
  Lock,
  TrendingUp,
  Lightbulb,
  BookOpen,
  Zap,
  Copy,
  ExternalLink,
  GraduationCap,
  AlertCircle,
  MapPin,
  Flame,
  Users,
  FileText,
  Eye,
} from 'lucide-react'
import {
  getRegions,
  getProjectCategories,
  getEcosystemTypes,
  getGradeLevels,
  RegionalClimateImpact,
  SustainabilityProject,
  EcosystemInfo,
  EnvironmentalStandard,
  SustainabilityAssessment,
  ActionPlan,
} from '../../utils/environmentalUtils'
import * as chatbotApi from '../../api/chatbots'
import { useSnackbar } from '../../hooks/useSnackbar'
import { useCapabilityCreditGate } from '../../hooks/useCapabilityCreditGate'
import { useChatbotHistorySession } from '../../hooks/useChatbotHistorySession'
import NoCreditsCard from '../../components/NoCreditsCard'
import {
  mapRegionalClimateResult,
  mapSustainabilityProjectsResult,
  mapEcosystemResult,
  mapEnvironmentalStandardsResult,
  mapSustainabilityAssessmentResult,
  mapEnvironmentalActionPlanResult,
  projectCategoryUiToApi,
} from '../../utils/environmentalAdapters'

const CHATBOT_SLUG = 'environmental-science-guide'
const TEACHING_REGION = 'Global'

type TabType = 'climate' | 'sustainability' | 'ecosystems' | 'regional' | 'standards' | 'projects' | 'assessment' | 'action-plan'

const EnvironmentalScienceGuide = () => {
  const { toast } = useSnackbar()
  const { creditError, clearCreditError, captureApiError, runWithCredits } = useCapabilityCreditGate()
  const [activeTab, setActiveTab] = useState<TabType>('climate')
  const [gradeLevel, setGradeLevel] = useState('High School (9-12)')
  const [selectedRegion, setSelectedRegion] = useState('Temperate')
  const [isGenerating, setIsGenerating] = useState(false)

  // Climate Education State
  const [climateRegion, setClimateRegion] = useState('Temperate')
  const [climateImpact, setClimateImpact] = useState<RegionalClimateImpact | null>(null)

  // Sustainability Projects State
  const [projectCategory, setProjectCategory] = useState('energy')
  const [sustainabilityProjects, setSustainabilityProjects] = useState<SustainabilityProject[]>([])
  const [selectedProject, setSelectedProject] = useState<SustainabilityProject | null>(null)

  // Ecosystems State
  const [ecosystemType, setEcosystemType] = useState('Tropical Rainforest')
  const [ecosystemInfo, setEcosystemInfo] = useState<EcosystemInfo | null>(null)

  // Regional Analysis State
  const [regionalAnalysis, setRegionalAnalysis] = useState<RegionalClimateImpact | null>(null)

  // Standards State
  const [environmentalStandards, setEnvironmentalStandards] = useState<EnvironmentalStandard[]>([])
  const [selectedStandard, setSelectedStandard] = useState<EnvironmentalStandard | null>(null)

  // Assessment State
  const [assessmentCategory, setAssessmentCategory] = useState('Carbon Footprint')
  const [sustainabilityAssessment, setSustainabilityAssessment] = useState<SustainabilityAssessment | null>(null)

  // Action Plan State
  const [actionGoal, setActionGoal] = useState('')
  const [actionTimeframe, setActionTimeframe] = useState('3 months')
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null)

  const ENV_CAP_TABS: Record<string, TabType> = {
    global_climate_education: 'climate',
    sustainability_projects: 'sustainability',
    ecological_systems: 'ecosystems',
    regional_climate_analysis: 'regional',
    environmental_standards: 'standards',
    sustainability_assessment_tools: 'assessment',
    environmental_action_planning: 'action-plan',
  }

  const { conversationIdForActiveTab, pinFromResponse } = useChatbotHistorySession({
    slug: CHATBOT_SLUG,
    activeTab,
    capabilityKeyToTab: ENV_CAP_TABS,
    onRestore: async ({ tabKey, userContent, assistantContent, assistantMetadata }) => {
      const cap = assistantMetadata?.capability_key as string | undefined
      const valid: TabType[] = ['climate', 'sustainability', 'ecosystems', 'regional', 'standards', 'projects', 'assessment', 'action-plan']
      const tab: TabType =
        valid.includes(tabKey as TabType)
          ? (tabKey as TabType)
          : cap && ENV_CAP_TABS[cap]
            ? ENV_CAP_TABS[cap]
            : 'climate'
      setActiveTab(tab)
      const u = userContent?.trim() ?? ''
      try {
        const raw = JSON.parse(assistantContent) as Record<string, unknown>
        setClimateImpact(null)
        setSustainabilityProjects([])
        setEcosystemInfo(null)
        setRegionalAnalysis(null)
        setEnvironmentalStandards([])
        setSustainabilityAssessment(null)
        setActionPlan(null)
        if (tab === 'climate') setClimateImpact(mapRegionalClimateResult(raw))
        else if (tab === 'sustainability') setSustainabilityProjects(mapSustainabilityProjectsResult(raw))
        else if (tab === 'ecosystems') setEcosystemInfo(mapEcosystemResult(raw))
        else if (tab === 'regional') setRegionalAnalysis(mapRegionalClimateResult(raw))
        else if (tab === 'standards') setEnvironmentalStandards(mapEnvironmentalStandardsResult(raw))
        else if (tab === 'assessment') setSustainabilityAssessment(mapSustainabilityAssessmentResult(raw))
        else if (tab === 'action-plan') {
          if (u) setActionGoal(u)
          setActionPlan(mapEnvironmentalActionPlanResult(raw))
        }
      } catch {
        toast.error('Could not restore saved output from History.')
      }
    },
  })

  const regions = getRegions()
  const projectCategories = getProjectCategories()
  const ecosystemTypes = getEcosystemTypes()
  const gradeLevels = getGradeLevels()

  // Load Climate Impact
  const handleLoadClimateImpact = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'global_climate_education', {
        input: ' ',
        input_type: 'text',
        parameters: {
          grade_level: gradeLevel,
          region: TEACHING_REGION,
          select_region: climateRegion,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setClimateImpact(mapRegionalClimateResult(response.result))
      pinFromResponse(response.conversation_id)
      toast.success('Climate impact loaded')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to load climate data'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Load Sustainability Projects
  const handleLoadProjects = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'sustainability_projects', {
        input: ' ',
        input_type: 'text',
        parameters: {
          grade_level: gradeLevel,
          region: TEACHING_REGION,
          project_category: projectCategoryUiToApi(projectCategory),
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setSustainabilityProjects(mapSustainabilityProjectsResult(response.result))
      pinFromResponse(response.conversation_id)
      toast.success('Projects loaded')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to load projects'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Load Ecosystem Info
  const handleLoadEcosystemInfo = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'ecological_systems', {
        input: ' ',
        input_type: 'text',
        parameters: {
          grade_level: gradeLevel,
          region: TEACHING_REGION,
          ecosystem_type: ecosystemType,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setEcosystemInfo(mapEcosystemResult(response.result))
      pinFromResponse(response.conversation_id)
      toast.success('Ecosystem profile loaded')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to load ecosystem info'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Load Regional Analysis
  const handleLoadRegionalAnalysis = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'regional_climate_analysis', {
        input: ' ',
        input_type: 'text',
        parameters: {
          grade_level: gradeLevel,
          region: TEACHING_REGION,
          select_region: selectedRegion,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setRegionalAnalysis(mapRegionalClimateResult(response.result))
      pinFromResponse(response.conversation_id)
      toast.success('Regional analysis loaded')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to load regional analysis'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Load Environmental Standards
  const handleLoadStandards = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'environmental_standards', {
        input: ' ',
        input_type: 'text',
        parameters: {
          grade_level: gradeLevel,
          region: selectedRegion,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setEnvironmentalStandards(mapEnvironmentalStandardsResult(response.result))
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

  // Generate Assessment
  const handleGenerateAssessment = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'sustainability_assessment_tools', {
        input: ' ',
        input_type: 'text',
        parameters: {
          grade_level: gradeLevel,
          region: TEACHING_REGION,
          assessment_category: assessmentCategory,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setSustainabilityAssessment(mapSustainabilityAssessmentResult(response.result))
      pinFromResponse(response.conversation_id)
      toast.success('Assessment generated')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to generate assessment'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate Action Plan
  const handleGenerateActionPlan = async () => {
    if (!actionGoal.trim()) return
    setIsGenerating(true)
    try {
      const goal = actionGoal.trim()
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'environmental_action_planning', {
        input: goal,
        input_type: 'text',
        parameters: {
          grade_level: gradeLevel,
          region: TEACHING_REGION,
          action_goal: goal,
          timeframe: actionTimeframe,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setActionPlan(mapEnvironmentalActionPlanResult(response.result))
      pinFromResponse(response.conversation_id)
      toast.success('Action plan generated')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to generate action plan'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const tabs = [
    { id: 'climate' as TabType, label: 'Climate Education', icon: Sun },
    { id: 'sustainability' as TabType, label: 'Sustainability Projects', icon: Recycle },
    { id: 'ecosystems' as TabType, label: 'Ecological Systems', icon: TreePine },
    { id: 'regional' as TabType, label: 'Regional Analysis', icon: MapPin },
    { id: 'standards' as TabType, label: 'Standards', icon: CheckCircle },
    { id: 'projects' as TabType, label: 'Project Planner', icon: Lightbulb },
    { id: 'assessment' as TabType, label: 'Assessment Tools', icon: BarChart3 },
    { id: 'action-plan' as TabType, label: 'Action Planning', icon: Target },
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
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Leaf className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-3xl font-bold">Environmental Science Guide</h1>
                  <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    <Star className="h-3 w-3" /> 4.9★
                  </span>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    <Lock className="inline h-3 w-3 mr-1" /> Premium
                  </span>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    <Globe className="inline h-3 w-3 mr-1" /> Global Focus
                  </span>
                </div>
                <p className="mt-2 text-green-100">
                  Comprehensive environmental science tools aligned with international standards (ISO 14001, ISO 14064, UN SDGs). 
                  Help students understand climate change, sustainability, and ecological systems through global perspectives, 
                  regional analysis, and hands-on projects. Prepare students to address environmental challenges worldwide.
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
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <label className="text-sm font-medium">Region:</label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="bg-white/20 border border-white/30 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
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
                      ? 'border-green-600 text-green-600 bg-green-50'
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
          {/* Climate Education Tab */}
          {activeTab === 'climate' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Sun className="h-6 w-6 text-yellow-600" />
                  Global Climate Education
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Region
                    </label>
                    <select
                      value={climateRegion}
                      onChange={(e) => setClimateRegion(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    >
                      {regions.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleLoadClimateImpact}
                      disabled={isGenerating}
                      className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 disabled:opacity-50 transition"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-5 w-5 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />
                          Explore Climate Impact
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {climateImpact && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{climateImpact.region}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                          {climateImpact.climateZone}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          climateImpact.vulnerabilityLevel === 'critical' ? 'bg-red-100 text-red-700' :
                          climateImpact.vulnerabilityLevel === 'high' ? 'bg-orange-100 text-orange-700' :
                          climateImpact.vulnerabilityLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {climateImpact.vulnerabilityLevel.toUpperCase()} Vulnerability
                        </span>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                      <Download className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Climate Impacts</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {climateImpact.keyImpacts.map((impact, i) => (
                          <li key={i}>{impact}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Temperature Trends</h4>
                        <p className="text-gray-700">{climateImpact.temperatureTrends}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Precipitation Changes</h4>
                        <p className="text-gray-700">{climateImpact.precipitationChanges}</p>
                      </div>
                    </div>

                    {climateImpact.seaLevelRise && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Sea Level Rise</h4>
                        <p className="text-gray-700">{climateImpact.seaLevelRise}</p>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Extreme Events</h4>
                      <div className="flex flex-wrap gap-2">
                        {climateImpact.extremeEvents.map((event, i) => (
                          <span key={i} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            {event}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Case Studies</h4>
                      <div className="space-y-3">
                        {climateImpact.caseStudies.map((study, idx) => (
                          <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="font-semibold text-gray-900 mb-1">{study.title}</h5>
                            <p className="text-sm text-gray-700 mb-2">{study.description}</p>
                            <div>
                              <span className="text-xs font-medium text-gray-700">Impacts:</span>
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 mt-1">
                                {study.impacts.map((impact, i) => (
                                  <li key={i}>{impact}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Adaptation Strategies</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {climateImpact.adaptationStrategies.map((strategy, i) => (
                          <li key={i}>{strategy}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sustainability Projects Tab */}
          {activeTab === 'sustainability' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Recycle className="h-6 w-6 text-green-600" />
                  Sustainability Projects Library
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Category
                    </label>
                    <select
                      value={projectCategory}
                      onChange={(e) => setProjectCategory(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      {projectCategories.map(cat => (
                        <option key={cat.toLowerCase()} value={cat.toLowerCase()}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleLoadProjects}
                      disabled={isGenerating}
                      className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-5 w-5 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />
                          Load Projects
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {sustainabilityProjects.length > 0 && (
                <div className="space-y-4">
                  {sustainabilityProjects.map((project, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm cursor-pointer hover:border-green-300 transition"
                      onClick={() => setSelectedProject(selectedProject?.id === project.id ? null : project)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                              {project.category}
                            </span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                              {project.duration}
                            </span>
                          </div>
                        </div>
                        <Eye className="h-5 w-5 text-gray-400" />
                      </div>

                      {selectedProject?.id === project.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Objectives</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                              {project.objectives.map((obj, i) => (
                                <li key={i}>{obj}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Materials</h4>
                            <div className="flex flex-wrap gap-2">
                              {project.materials.map((material, i) => (
                                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                  {material}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Steps</h4>
                            <div className="space-y-2">
                              {project.steps.map((step, i) => (
                                <div key={i} className="flex gap-3 p-2 bg-gray-50 rounded">
                                  <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">
                                    {i + 1}
                                  </span>
                                  <span className="text-gray-700">{step}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Standards Alignment</h4>
                            <div className="flex flex-wrap gap-2">
                              {project.standardsAlignment.map((standard, i) => (
                                <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                  {standard}
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

          {/* Ecosystems Tab */}
          {activeTab === 'ecosystems' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TreePine className="h-6 w-6 text-teal-600" />
                  Ecological Systems Understanding
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ecosystem Type
                    </label>
                    <select
                      value={ecosystemType}
                      onChange={(e) => setEcosystemType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    >
                      {ecosystemTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleLoadEcosystemInfo}
                      disabled={isGenerating}
                      className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 transition"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-5 w-5 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />
                          Explore Ecosystem
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {ecosystemInfo && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{ecosystemInfo.type}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-semibold">
                          {ecosystemInfo.category}
                        </span>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                      <Download className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-700">{ecosystemInfo.description}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {ecosystemInfo.keyFeatures.map((feature, i) => (
                          <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Abiotic Factors</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {ecosystemInfo.abioticFactors.map((factor, i) => (
                            <li key={i}>{factor}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Biotic Factors</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {ecosystemInfo.bioticFactors.map((factor, i) => (
                            <li key={i}>{factor}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Energy Flow</h4>
                      <div className="space-y-2">
                        {ecosystemInfo.energyFlow.map((flow, i) => (
                          <div key={i} className="flex gap-2 items-center p-2 bg-gray-50 rounded">
                            <span className="text-gray-700">{flow}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Threats</h4>
                      <div className="flex flex-wrap gap-2">
                        {ecosystemInfo.threats.map((threat, i) => (
                          <span key={i} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            {threat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Conservation</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {ecosystemInfo.conservation.map((action, i) => (
                          <li key={i}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Regional Analysis Tab */}
          {activeTab === 'regional' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-blue-600" />
                  Regional Climate Analysis
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Region
                    </label>
                    <select
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {regions.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleLoadRegionalAnalysis}
                      disabled={isGenerating}
                      className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-5 w-5 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />
                          Analyze Region
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {regionalAnalysis && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{regionalAnalysis.region}</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Impacts</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {regionalAnalysis.keyImpacts.map((impact, i) => (
                          <li key={i}>{impact}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Case Studies</h4>
                      <div className="space-y-3">
                        {regionalAnalysis.caseStudies.map((study, i) => (
                          <div key={i} className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="font-semibold text-gray-900">{study.title}</h5>
                            <p className="text-sm text-gray-700 mt-1">{study.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Standards Tab */}
          {activeTab === 'standards' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                  International Environmental Standards
                </h2>
                <button
                  onClick={handleLoadStandards}
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
                      Load Standards
                    </>
                  )}
                </button>
              </div>

              {environmentalStandards.length > 0 && (
                <div className="space-y-4">
                  {environmentalStandards.map((standard, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm cursor-pointer hover:border-purple-300 transition"
                      onClick={() => setSelectedStandard(selectedStandard?.id === standard.id ? null : standard)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900">{standard.name}</h3>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                              {standard.organization}
                            </span>
                          </div>
                        </div>
                        <Eye className="h-5 w-5 text-gray-400" />
                      </div>
                      <p className="text-gray-600">{standard.description}</p>

                      {selectedStandard?.id === standard.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Key Principles</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                              {standard.keyPrinciples.map((principle, i) => (
                                <li key={i}>{principle}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Educational Relevance</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                              {standard.educationalRelevance.map((relevance, i) => (
                                <li key={i}>{relevance}</li>
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

          {/* Project Planner Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-emerald-600" />
                  Project-Based Learning Planner
                </h2>
                <p className="text-gray-600">
                  Use the Sustainability Projects Library tab to browse project templates, then customize 
                  them here for your specific classroom needs.
                </p>
              </div>
            </div>
          )}

          {/* Assessment Tools Tab */}
          {activeTab === 'assessment' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-cyan-600" />
                  Sustainability Assessment Tools
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assessment Category
                    </label>
                    <select
                      value={assessmentCategory}
                      onChange={(e) => setAssessmentCategory(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    >
                      <option>Carbon Footprint</option>
                      <option>Water Footprint</option>
                      <option>Waste Audit</option>
                      <option>Energy Audit</option>
                      <option>Biodiversity Assessment</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleGenerateAssessment}
                      disabled={isGenerating}
                      className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 disabled:opacity-50 transition"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-5 w-5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />
                          Generate Assessment
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {sustainabilityAssessment && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{sustainabilityAssessment.category}</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Recommendations</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {sustainabilityAssessment.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Action Items</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {sustainabilityAssessment.actionItems.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Planning Tab */}
          {activeTab === 'action-plan' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="h-6 w-6 text-indigo-600" />
                  Action Planning & Advocacy
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Action Goal
                    </label>
                    <input
                      type="text"
                      value={actionGoal}
                      onChange={(e) => setActionGoal(e.target.value)}
                      placeholder="e.g., Reduce school carbon footprint by 20%"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timeframe
                    </label>
                    <select
                      value={actionTimeframe}
                      onChange={(e) => setActionTimeframe(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option>1 month</option>
                      <option>3 months</option>
                      <option>6 months</option>
                      <option>1 year</option>
                    </select>
                  </div>
                  <button
                    onClick={handleGenerateActionPlan}
                    disabled={!actionGoal.trim() || isGenerating}
                    className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5" />
                        Generate Action Plan
                      </>
                    )}
                  </button>
                </div>
              </div>

              {actionPlan && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{actionPlan.goal}</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Objectives</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {actionPlan.objectives.map((obj, i) => (
                          <li key={i}>{obj}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Actions</h4>
                      <div className="space-y-2">
                        {actionPlan.actions.map((action, i) => (
                          <div key={i} className="border-l-4 border-indigo-500 pl-4">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-gray-900">{action.action}</span>
                              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">
                                {action.deadline}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">Responsible: {action.responsible}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Success Metrics</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {actionPlan.successMetrics.map((metric, i) => (
                          <li key={i}>{metric}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EnvironmentalScienceGuide

