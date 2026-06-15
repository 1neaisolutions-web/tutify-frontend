import { useState } from 'react'
import {
  Palette,
  Brush,
  Image as ImageIcon,
  Globe,
  Award,
  Layers,
  Eye,
  Sparkles,
  Download,
  RefreshCw,
  CheckCircle2,
  Clock,
  Star,
  Lock,
  BookOpen,
  FileText,
  FileCheck,
  Target,
  Lightbulb,
  Users,
  TrendingUp,
  BarChart3,
  Copy,
  ExternalLink,
  GraduationCap,
  Heart,
  Zap,
} from 'lucide-react'
import {
  getAvailableArtMovements,
  getMediaTypes,
  getCulturalRegions,
  ArtMovement,
  TechniqueGuide,
  PortfolioAssessment,
  CreativeProject,
  VisualLiteracyAnalysis,
  CulturalConnection,
  AssessmentRubric,
} from '../../utils/visualArtsUtils'
import * as chatbotApi from '../../api/chatbots'
import { useSnackbar } from '../../hooks/useSnackbar'
import { useCapabilityCreditGate } from '../../hooks/useCapabilityCreditGate'
import { useChatbotHistorySession } from '../../hooks/useChatbotHistorySession'
import NoCreditsCard from '../../components/NoCreditsCard'
import {
  mapArtHistoryResult,
  mapArtTechniqueResult,
  mapPortfolioDevelopmentResult,
  mapCreativeProjectResult,
  mapVisualLiteracyResult,
  mapCulturalConnectionsResult,
  mapArtAssessmentRubricResult,
} from '../../utils/visualArtsAdapters'

import { useTranslation } from 'react-i18next'
import { GradeBandSelect } from '@/components/shared/GradeBandSelect'
import { bandToApi } from '@/catalog/adapters/gradeBandAdapters'
const CHATBOT_SLUG = 'visual-arts-studio-assistant'

type TabType = 'history' | 'technique' | 'portfolio' | 'projects' | 'literacy' | 'cultural' | 'assessment' | 'differentiation'

const VisualArtsStudioAssistant = () => {
  const { t } = useTranslation()
  const { toast } = useSnackbar()
  const { creditError, clearCreditError, captureApiError, runWithCredits } = useCapabilityCreditGate()
  const [activeTab, setActiveTab] = useState<TabType>('history')
  const [gradeLevel, setGradeLevel] = useState('6-8')
  const [mediaType, setMediaType] = useState('Mixed Media')
  const [culturalRegion, setCulturalRegion] = useState('Global')
  const [isGenerating, setIsGenerating] = useState(false)

  // Art History State
  const [selectedMovement, setSelectedMovement] = useState('Renaissance')
  const [artMovement, setArtMovement] = useState<ArtMovement | null>(null)

  // Technique Guidance State
  const [selectedTechnique, setSelectedTechnique] = useState('Watercolor Painting')
  const [techniqueGuide, setTechniqueGuide] = useState<TechniqueGuide | null>(null)

  // Portfolio Development State
  const [portfolioType, setPortfolioType] = useState('General Portfolio')
  const [portfolioAssessment, setPortfolioAssessment] = useState<PortfolioAssessment | null>(null)

  // Creative Projects State
  const [projectTheme, setProjectTheme] = useState('Identity Collage')
  const [projectDuration, setProjectDuration] = useState('3-4 weeks')
  const [creativeProject, setCreativeProject] = useState<CreativeProject | null>(null)

  // Visual Literacy State
  const [artworkTitle, setArtworkTitle] = useState('')
  const [artistName, setArtistName] = useState('')
  const [visualAnalysis, setVisualAnalysis] = useState<VisualLiteracyAnalysis | null>(null)

  // Cultural Connections State
  const [connectionArtwork, setConnectionArtwork] = useState('')
  const [connectionTheme, setConnectionTheme] = useState('Identity')
  const [culturalConnection, setCulturalConnection] = useState<CulturalConnection | null>(null)

  // Assessment State
  const [assessmentProjectType, setAssessmentProjectType] = useState('Mixed Media Project')
  const [assessmentRubric, setAssessmentRubric] = useState<AssessmentRubric | null>(null)

  const VISUAL_CAP_TABS: Record<string, TabType> = {
    art_history_explorer: 'history',
    art_technique_guidance: 'technique',
    portfolio_development: 'portfolio',
    creative_project_generator: 'projects',
    visual_literacy_analysis: 'literacy',
    cultural_connections: 'cultural',
    art_assessment_builder: 'assessment',
  }

  const { conversationIdForActiveTab, pinFromResponse } = useChatbotHistorySession({
    slug: CHATBOT_SLUG,
    activeTab,
    capabilityKeyToTab: VISUAL_CAP_TABS,
    onRestore: async ({ tabKey, userContent, assistantContent, assistantMetadata }) => {
      const cap = assistantMetadata?.capability_key as string | undefined
      const valid: TabType[] = ['history', 'technique', 'portfolio', 'projects', 'literacy', 'cultural', 'assessment', 'differentiation']
      const tab: TabType =
        valid.includes(tabKey as TabType)
          ? (tabKey as TabType)
          : cap && VISUAL_CAP_TABS[cap]
            ? VISUAL_CAP_TABS[cap]
            : 'history'
      setActiveTab(tab)
      const u = userContent?.trim() ?? ''
      try {
        const raw = JSON.parse(assistantContent) as Record<string, unknown>
        setArtMovement(null)
        setTechniqueGuide(null)
        setPortfolioAssessment(null)
        setCreativeProject(null)
        setVisualAnalysis(null)
        setCulturalConnection(null)
        setAssessmentRubric(null)
        if (tab === 'history') setArtMovement(mapArtHistoryResult(raw))
        else if (tab === 'technique') setTechniqueGuide(mapArtTechniqueResult(raw))
        else if (tab === 'portfolio') setPortfolioAssessment(mapPortfolioDevelopmentResult(raw))
        else if (tab === 'projects') setCreativeProject(mapCreativeProjectResult(raw, mediaType))
        else if (tab === 'literacy') {
          if (u) setArtworkTitle(u)
          setVisualAnalysis(mapVisualLiteracyResult(raw))
        } else if (tab === 'cultural') {
          if (u) setConnectionArtwork(u)
          setCulturalConnection(mapCulturalConnectionsResult(raw))
        } else if (tab === 'assessment') setAssessmentRubric(mapArtAssessmentRubricResult(raw))
      } catch {
        toast.error(t('visualArtsStudioAssistant.couldNotRestoreSavedOutputFromHistory'))
      }
    },
  })

  const artMovements = getAvailableArtMovements()
  const mediaTypes = getMediaTypes()
  const culturalRegions = getCulturalRegions()

  // Art History Explorer
  const handleExploreMovement = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'art_history_explorer', {
        input: ' ',
        input_type: 'text',
        parameters: {
          grade_level: bandToApi(gradeLevel, 'visualArts'),
          media: mediaType,
          cultural_region: culturalRegion,
          select_art_movement: selectedMovement,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setArtMovement(mapArtHistoryResult(response.result))
      pinFromResponse(response.conversation_id)
      toast.success(t('visualArtsStudioAssistant.artMovementProfileLoaded'))
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to load art movement'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info(t('visualArtsStudioAssistant.upgradeToPremiumToUseThisFeature'), { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Technique Guidance
  const handleGetTechnique = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'art_technique_guidance', {
        input: ' ',
        input_type: 'text',
        parameters: {
          grade_level: bandToApi(gradeLevel, 'visualArts'),
          media: mediaType,
          cultural_region: culturalRegion,
          select_technique: selectedTechnique,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setTechniqueGuide(mapArtTechniqueResult(response.result))
      pinFromResponse(response.conversation_id)
      toast.success(t('visualArtsStudioAssistant.techniqueGuideLoaded'))
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to load technique guide'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info(t('visualArtsStudioAssistant.upgradeToPremiumToUseThisFeature'), { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Portfolio Assessment
  const handleGeneratePortfolioAssessment = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'portfolio_development', {
        input: ' ',
        input_type: 'text',
        parameters: {
          grade_level: bandToApi(gradeLevel, 'visualArts'),
          media: mediaType,
          cultural_region: culturalRegion,
          portfolio_type: portfolioType,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setPortfolioAssessment(mapPortfolioDevelopmentResult(response.result))
      pinFromResponse(response.conversation_id)
      toast.success(t('visualArtsStudioAssistant.portfolioGuidanceGenerated'))
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to generate portfolio assessment'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info(t('visualArtsStudioAssistant.upgradeToPremiumToUseThisFeature'), { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Creative Project Generator
  const handleGenerateProject = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'creative_project_generator', {
        input: ' ',
        input_type: 'text',
        parameters: {
          grade_level: bandToApi(gradeLevel, 'visualArts'),
          media: mediaType,
          cultural_region: culturalRegion,
          project_theme: projectTheme,
          duration: projectDuration,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setCreativeProject(mapCreativeProjectResult(response.result, mediaType))
      pinFromResponse(response.conversation_id)
      toast.success(t('visualArtsStudioAssistant.creativeProjectGenerated'))
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to generate project'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info(t('visualArtsStudioAssistant.upgradeToPremiumToUseThisFeature'), { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Visual Literacy Analysis
  const handleAnalyzeArtwork = async () => {
    if (!artworkTitle.trim() || !artistName.trim()) return
    setIsGenerating(true)
    try {
      const title = artworkTitle.trim()
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'visual_literacy_analysis', {
        input: title,
        input_type: 'text',
        parameters: {
          grade_level: bandToApi(gradeLevel, 'visualArts'),
          media: mediaType,
          cultural_region: culturalRegion,
          artwork_title: title,
          artist_name: artistName.trim(),
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setVisualAnalysis(mapVisualLiteracyResult(response.result))
      pinFromResponse(response.conversation_id)
      toast.success(t('visualArtsStudioAssistant.visualAnalysisGenerated'))
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to analyze artwork'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info(t('visualArtsStudioAssistant.upgradeToPremiumToUseThisFeature'), { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Cultural Connections
  const handleFindConnections = async () => {
    if (!connectionArtwork.trim()) return
    setIsGenerating(true)
    try {
      const artwork = connectionArtwork.trim()
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'cultural_connections', {
        input: artwork,
        input_type: 'text',
        parameters: {
          grade_level: bandToApi(gradeLevel, 'visualArts'),
          media: mediaType,
          cultural_region: culturalRegion,
          artwork_or_theme: artwork,
          theme_focus: connectionTheme,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setCulturalConnection(mapCulturalConnectionsResult(response.result))
      pinFromResponse(response.conversation_id)
      toast.success(t('visualArtsStudioAssistant.culturalConnectionsGenerated'))
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to find connections'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info(t('visualArtsStudioAssistant.upgradeToPremiumToUseThisFeature'), { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Assessment Rubric
  const handleGenerateRubric = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'art_assessment_builder', {
        input: ' ',
        input_type: 'text',
        parameters: {
          grade_level: bandToApi(gradeLevel, 'visualArts'),
          media: mediaType,
          cultural_region: culturalRegion,
          project_type: assessmentProjectType,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setAssessmentRubric(mapArtAssessmentRubricResult(response.result))
      pinFromResponse(response.conversation_id)
      toast.success(t('visualArtsStudioAssistant.rubricGenerated'))
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to generate rubric'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info(t('visualArtsStudioAssistant.upgradeToPremiumToUseThisFeature'), { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const tabs = [
    { id: 'history' as TabType, label: t('visualArtsStudioAssistant.tabs.history'), icon: BookOpen },
    { id: 'technique' as TabType, label: t('visualArtsStudioAssistant.tabs.technique'), icon: Brush },
    { id: 'portfolio' as TabType, label: t('visualArtsStudioAssistant.tabs.portfolio'), icon: Award },
    { id: 'projects' as TabType, label: t('visualArtsStudioAssistant.tabs.projects'), icon: Lightbulb },
    { id: 'literacy' as TabType, label: t('visualArtsStudioAssistant.tabs.literacy'), icon: Eye },
    { id: 'cultural' as TabType, label: t('visualArtsStudioAssistant.tabs.cultural'), icon: Globe },
    { id: 'assessment' as TabType, label: t('visualArtsStudioAssistant.tabs.assessment'), icon: FileCheck },
    { id: 'differentiation' as TabType, label: t('visualArtsStudioAssistant.tabs.differentiation'), icon: Users },
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
      <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Palette className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-3xl font-bold">{t('visualArtsStudioAssistant.visualArtsStudioAssistant')}</h1>
                  <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    <Star className="h-3 w-3" /> 4.9★
                  </span>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    <Lock className="inline h-3 w-3 mr-1" />{t('visualArtsStudioAssistant.premium')}</span>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    <Globe className="inline h-3 w-3 mr-1" />{t('visualArtsStudioAssistant.globalPerspective')}</span>
                </div>
                <p className="mt-2 text-pink-100">{t('visualArtsStudioAssistant.transformYourClassroomIntoADynamicStudioBlendArtisticFu')}</p>
              </div>
            </div>
            
            {/* Quick Settings */}
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <GradeBandSelect
                  variant="native"
                  value={gradeLevel}
                  onChange={setGradeLevel}
                  label={t('visualArtsStudioAssistant.gradeLevel')}
                  context="visualArts"
                  selectClassName="bg-white/20 border border-white/30 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  className="flex items-center gap-2 [&_span]:text-sm [&_span]:font-medium [&_span]:text-white"
                />
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <label className="text-sm font-medium">{t('visualArtsStudioAssistant.media')}</label>
                <select
                  value={mediaType}
                  onChange={(e) => setMediaType(e.target.value)}
                  className="bg-white/20 border border-white/30 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  {mediaTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <label className="text-sm font-medium">{t('visualArtsStudioAssistant.culturalRegion')}</label>
                <select
                  value={culturalRegion}
                  onChange={(e) => setCulturalRegion(e.target.value)}
                  className="bg-white/20 border border-white/30 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  {culturalRegions.map(region => (
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
                      ? 'border-pink-600 text-pink-600 bg-pink-50'
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
          {/* Art History Explorer Tab */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                  Art History Explorer (Global Perspective)
                </h2>
                <p className="text-gray-600 mb-4">{t('visualArtsStudioAssistant.exploreArtMovementsFromAroundTheWorldDiscoverCulturalCo')}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('visualArtsStudioAssistant.selectArtMovement')}</label>
                    <select
                      value={selectedMovement}
                      onChange={(e) => setSelectedMovement(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      {artMovements.map(movement => (
                        <option key={movement} value={movement}>{movement}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleExploreMovement}
                      disabled={isGenerating}
                      className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 transition"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-5 w-5 animate-spin" />{t('visualArtsStudioAssistant.exploring')}</>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />{t('visualArtsStudioAssistant.exploreMovement')}</>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {artMovement && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{artMovement.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                          {artMovement.period}
                        </span>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                          {artMovement.region}
                        </span>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                      <Download className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('visualArtsStudioAssistant.description')}</h4>
                      <p className="text-gray-700">{artMovement.description}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('visualArtsStudioAssistant.culturalContext')}</h4>
                      <p className="text-gray-700">{artMovement.culturalContext}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{t('visualArtsStudioAssistant.keyArtists')}</h4>
                        <div className="flex flex-wrap gap-2">
                          {artMovement.keyArtists.map((artist, i) => (
                            <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              {artist}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{t('visualArtsStudioAssistant.characteristics')}</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {artMovement.characteristics.map((char, i) => (
                            <li key={i}>{char}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('visualArtsStudioAssistant.notableArtworks')}</h4>
                      <div className="space-y-2">
                        {artMovement.notableArtworks.map((artwork, i) => (
                          <div key={i} className="bg-gray-50 p-3 rounded-lg">
                            <div className="font-semibold text-gray-900">{artwork.title}</div>
                            <div className="text-sm text-gray-600">{artwork.artist}, {artwork.year}</div>
                            <div className="text-sm text-gray-700 mt-1">{artwork.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('visualArtsStudioAssistant.relatedMovements')}</h4>
                      <div className="flex flex-wrap gap-2">
                        {artMovement.relatedMovements.map((movement, i) => (
                          <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            {movement}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Technique Guidance Tab */}
          {activeTab === 'technique' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Brush className="h-6 w-6 text-blue-600" />{t('visualArtsStudioAssistant.studioTechniqueGuidance')}</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('visualArtsStudioAssistant.selectTechnique')}</label>
                    <select
                      value={selectedTechnique}
                      onChange={(e) => setSelectedTechnique(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option>{t('visualArtsStudioAssistant.watercolorPainting')}</option>
                      <option>{t('visualArtsStudioAssistant.charcoalDrawing')}</option>
                      <option>{t('visualArtsStudioAssistant.acrylicPainting')}</option>
                      <option>{t('visualArtsStudioAssistant.oilPainting')}</option>
                      <option>{t('visualArtsStudioAssistant.printmaking')}</option>
                      <option>{t('visualArtsStudioAssistant.ceramics')}</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleGetTechnique}
                      disabled={isGenerating}
                      className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-5 w-5 animate-spin" />{t('visualArtsStudioAssistant.loading')}</>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />{t('visualArtsStudioAssistant.getGuide')}</>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {techniqueGuide && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{techniqueGuide.name}</h3>
                      <p className="text-gray-600 mt-1">{techniqueGuide.category}</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      {techniqueGuide.difficulty}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{t('visualArtsStudioAssistant.materials')}</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {techniqueGuide.materials.map((material, i) => (
                            <li key={i}>{material}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{t('visualArtsStudioAssistant.tools')}</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {techniqueGuide.tools.map((tool, i) => (
                            <li key={i}>{tool}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">{t('visualArtsStudioAssistant.stepByStepProcess')}</h4>
                      <div className="space-y-4">
                        {techniqueGuide.steps.map((step, i) => (
                          <div key={i} className="border-l-4 border-blue-500 pl-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold">
                                {step.step}
                              </span>
                              <h5 className="font-semibold text-gray-900">{step.title}</h5>
                            </div>
                            <p className="text-gray-700 mb-2">{step.description}</p>
                            <div>
                              <span className="text-sm font-medium text-gray-700">{t('visualArtsStudioAssistant.tips')}</span>
                              <ul className="list-disc list-inside ml-4 text-sm text-gray-600">
                                {step.tips.map((tip, j) => (
                                  <li key={j}>{tip}</li>
                                ))}
                              </ul>
                            </div>
                            {step.safetyNotes && step.safetyNotes.length > 0 && (
                              <div className="mt-2">
                                <span className="text-sm font-medium text-red-700">{t('visualArtsStudioAssistant.safetyNotes')}</span>
                                <ul className="list-disc list-inside ml-4 text-sm text-red-600">
                                  {step.safetyNotes.map((note, j) => (
                                    <li key={j}>{note}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{t('visualArtsStudioAssistant.commonMistakes')}</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {techniqueGuide.commonMistakes.map((mistake, i) => (
                            <li key={i}>{mistake}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{t('visualArtsStudioAssistant.variations')}</h4>
                        <div className="flex flex-wrap gap-2">
                          {techniqueGuide.variations.map((variation, i) => (
                            <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              {variation}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('visualArtsStudioAssistant.culturalExamples')}</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {techniqueGuide.culturalExamples.map((example, i) => (
                          <li key={i}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Portfolio Development Tab */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="h-6 w-6 text-amber-600" />{t('visualArtsStudioAssistant.portfolioDevelopmentAssistant')}</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('visualArtsStudioAssistant.portfolioType')}</label>
                    <select
                      value={portfolioType}
                      onChange={(e) => setPortfolioType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    >
                      <option>{t('visualArtsStudioAssistant.generalPortfolio')}</option>
                      <option>{t('visualArtsStudioAssistant.apStudioArtPortfolio')}</option>
                      <option>{t('visualArtsStudioAssistant.collegeApplicationPortfolio')}</option>
                      <option>{t('visualArtsStudioAssistant.exhibitionPortfolio')}</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleGeneratePortfolioAssessment}
                      disabled={isGenerating}
                      className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 disabled:opacity-50 transition"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-5 w-5 animate-spin" />{t('visualArtsStudioAssistant.generating')}</>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />{t('visualArtsStudioAssistant.generateAssessment')}</>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {portfolioAssessment && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('visualArtsStudioAssistant.portfolioAssessmentCriteria')}</h3>
                  
                  <div className="space-y-4">
                    {portfolioAssessment.criteria.map((criterion, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-gray-900">{criterion.category}</h4>
                          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                            {criterion.points} points
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{criterion.description}</p>
                        <div>
                          <span className="text-sm font-medium text-gray-700">{t('visualArtsStudioAssistant.indicators')}</span>
                          <ul className="list-disc list-inside ml-4 text-sm text-gray-600">
                            {criterion.indicators.map((indicator, i) => (
                              <li key={i}>{indicator}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('visualArtsStudioAssistant.reflectionPrompts')}</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {portfolioAssessment.reflectionPrompts.map((prompt, i) => (
                          <li key={i}>{prompt}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('visualArtsStudioAssistant.documentationTips')}</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {portfolioAssessment.documentationTips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{t('visualArtsStudioAssistant.presentationGuidelines')}</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {portfolioAssessment.presentationGuidelines.map((guideline, i) => (
                        <li key={i}>{guideline}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Creative Projects Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-green-600" />{t('visualArtsStudioAssistant.creativeProjectGenerator')}</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('visualArtsStudioAssistant.projectTheme')}</label>
                    <select
                      value={projectTheme}
                      onChange={(e) => setProjectTheme(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option>{t('visualArtsStudioAssistant.identityCollage')}</option>
                      <option>{t('visualArtsStudioAssistant.naturePrintmaking')}</option>
                      <option>{t('visualArtsStudioAssistant.culturalPortraits')}</option>
                      <option>{t('visualArtsStudioAssistant.environmentalArt')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('visualArtsStudioAssistant.duration')}</label>
                    <select
                      value={projectDuration}
                      onChange={(e) => setProjectDuration(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option>{t('visualArtsStudioAssistant.k3Weeks')}</option>
                      <option>{t('visualArtsStudioAssistant.k4Weeks')}</option>
                      <option>{t('visualArtsStudioAssistant.k6Weeks')}</option>
                      <option>{t('visualArtsStudioAssistant.k8Weeks')}</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleGenerateProject}
                      disabled={isGenerating}
                      className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-5 w-5 animate-spin" />{t('visualArtsStudioAssistant.generating')}</>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />{t('visualArtsStudioAssistant.generateProject')}</>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {creativeProject && (
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{creativeProject.title}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            {creativeProject.gradeLevel}
                          </span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            {creativeProject.duration}
                          </span>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <Download className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{t('visualArtsStudioAssistant.learningObjectives')}</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {creativeProject.learningObjectives.map((obj, i) => (
                            <li key={i}>{obj}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">{t('visualArtsStudioAssistant.requiredMaterials')}</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {creativeProject.materials.required.map((material, i) => (
                              <li key={i}>{material}</li>
                            ))}
                          </ul>
                          <div className="mt-2 text-sm text-gray-600">
                            Budget: {creativeProject.materials.budget}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">{t('visualArtsStudioAssistant.optionalMaterials')}</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {creativeProject.materials.optional.map((material, i) => (
                              <li key={i}>{material}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">{t('visualArtsStudioAssistant.projectPhases')}</h4>
                        <div className="space-y-4">
                          {creativeProject.steps.map((phase, idx) => (
                            <div key={idx} className="border-l-4 border-green-500 pl-4">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-semibold text-gray-900">{phase.phase}</h5>
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                  {phase.duration}
                                </span>
                              </div>
                              <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {phase.activities.map((activity, i) => (
                                  <li key={i}>{activity}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">{t('visualArtsStudioAssistant.beginner')}</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            {creativeProject.differentiation.beginner.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">{t('visualArtsStudioAssistant.intermediate')}</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            {creativeProject.differentiation.intermediate.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">{t('visualArtsStudioAssistant.advanced')}</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            {creativeProject.differentiation.advanced.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">{t('visualArtsStudioAssistant.culturalConnections')}</h4>
                          <div className="flex flex-wrap gap-2">
                            {creativeProject.culturalConnections.map((connection, i) => (
                              <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                {connection}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">{t('visualArtsStudioAssistant.crossCurricular')}</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {creativeProject.crossCurricular.map((subject, i) => (
                              <li key={i}>{subject}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Visual Literacy Tab */}
          {activeTab === 'literacy' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Eye className="h-6 w-6 text-indigo-600" />{t('visualArtsStudioAssistant.visualLiteracyAnalyzer')}</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('visualArtsStudioAssistant.artworkTitle')}</label>
                    <input
                      type="text"
                      value={artworkTitle}
                      onChange={(e) => setArtworkTitle(e.target.value)}
                      placeholder={t('visualArtsStudioAssistant.enterArtworkTitle')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('visualArtsStudioAssistant.artistName')}</label>
                    <input
                      type="text"
                      value={artistName}
                      onChange={(e) => setArtistName(e.target.value)}
                      placeholder={t('visualArtsStudioAssistant.enterArtistName')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <button
                  onClick={handleAnalyzeArtwork}
                  disabled={!artworkTitle.trim() || !artistName.trim() || isGenerating}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />{t('visualArtsStudioAssistant.analyzing')}</>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />{t('visualArtsStudioAssistant.analyzeArtwork')}</>
                  )}
                </button>
              </div>

              {visualAnalysis && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">{visualAnalysis.artwork.title}</h3>
                    <p className="text-gray-600">{visualAnalysis.artwork.artist} • {visualAnalysis.artwork.period} • {visualAnalysis.artwork.culture}</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">{t('visualArtsStudioAssistant.formalElements')}</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {Object.entries(visualAnalysis.formalElements).map(([element, descriptions]) => (
                          <div key={element} className="border border-gray-200 rounded-lg p-3">
                            <h5 className="font-medium text-gray-900 capitalize mb-2">{element}</h5>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                              {descriptions.map((desc, i) => (
                                <li key={i}>{desc}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">{t('visualArtsStudioAssistant.principlesOfDesign')}</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {Object.entries(visualAnalysis.principlesOfDesign).map(([principle, description]) => (
                          <div key={principle} className="border border-gray-200 rounded-lg p-3">
                            <h5 className="font-medium text-gray-900 capitalize mb-1">{principle}</h5>
                            <p className="text-sm text-gray-700">{description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">{t('visualArtsStudioAssistant.contextualAnalysis')}</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {Object.entries(visualAnalysis.contextualAnalysis).map(([context, analysis]) => (
                          <div key={context} className="border border-gray-200 rounded-lg p-3">
                            <h5 className="font-medium text-gray-900 capitalize mb-1">{context}</h5>
                            <p className="text-sm text-gray-700">{analysis}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">{t('visualArtsStudioAssistant.criticalThinkingQuestions')}</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {Object.entries(visualAnalysis.criticalQuestions).map(([level, questions]) => (
                          <div key={level} className="border border-gray-200 rounded-lg p-3">
                            <h5 className="font-medium text-gray-900 capitalize mb-2">{level}</h5>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                              {questions.map((q, i) => (
                                <li key={i}>{q}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cultural Connections Tab */}
          {activeTab === 'cultural' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-6 border border-pink-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Globe className="h-6 w-6 text-pink-600" />{t('visualArtsStudioAssistant.culturalConnectionsGlobalPerspectives')}</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('visualArtsStudioAssistant.artworkTheme')}</label>
                    <input
                      type="text"
                      value={connectionArtwork}
                      onChange={(e) => setConnectionArtwork(e.target.value)}
                      placeholder={t('visualArtsStudioAssistant.enterArtworkOrTheme')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('visualArtsStudioAssistant.themeFocus')}</label>
                    <select
                      value={connectionTheme}
                      onChange={(e) => setConnectionTheme(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    >
                      <option>{t('visualArtsStudioAssistant.identity')}</option>
                      <option>{t('visualArtsStudioAssistant.heritage')}</option>
                      <option>{t('visualArtsStudioAssistant.socialJustice')}</option>
                      <option>{t('visualArtsStudioAssistant.environment')}</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleFindConnections}
                  disabled={!connectionArtwork.trim() || isGenerating}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-2 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 disabled:opacity-50 transition"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />{t('visualArtsStudioAssistant.findingConnections')}</>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />{t('visualArtsStudioAssistant.findConnections')}</>
                  )}
                </button>
              </div>

              {culturalConnection && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{culturalConnection.artwork}</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-semibold">
                        {culturalConnection.culture}
                      </span>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                        {culturalConnection.region}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('visualArtsStudioAssistant.themes')}</h4>
                      <div className="flex flex-wrap gap-2">
                        {culturalConnection.themes.map((theme, i) => (
                          <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                            {theme}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{t('visualArtsStudioAssistant.techniques')}</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {culturalConnection.techniques.map((tech, i) => (
                            <li key={i}>{tech}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{t('visualArtsStudioAssistant.contemporaryRelevance')}</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {culturalConnection.contemporaryRelevance.map((rel, i) => (
                            <li key={i}>{rel}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('visualArtsStudioAssistant.crossCulturalInfluences')}</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {culturalConnection.crossCulturalInfluences.map((influence, i) => (
                          <li key={i}>{influence}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('visualArtsStudioAssistant.teachingStrategies')}</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {culturalConnection.teachingStrategies.map((strategy, i) => (
                          <li key={i}>{strategy}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Assessment Builder Tab */}
          {activeTab === 'assessment' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="h-6 w-6 text-teal-600" />{t('visualArtsStudioAssistant.assessmentRubricsBuilder')}</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('visualArtsStudioAssistant.projectType')}</label>
                    <select
                      value={assessmentProjectType}
                      onChange={(e) => setAssessmentProjectType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    >
                      <option>{t('visualArtsStudioAssistant.mixedMediaProject')}</option>
                      <option>{t('visualArtsStudioAssistant.portfolioAssessment')}</option>
                      <option>{t('visualArtsStudioAssistant.studioProject')}</option>
                      <option>{t('visualArtsStudioAssistant.researchProject')}</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleGenerateRubric}
                      disabled={isGenerating}
                      className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 transition"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-5 w-5 animate-spin" />{t('visualArtsStudioAssistant.generating')}</>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />{t('visualArtsStudioAssistant.generateRubric')}</>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {assessmentRubric && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">{assessmentRubric.title}</h3>
                    <div className="text-right">
                      <span className="text-sm text-gray-500">{t('visualArtsStudioAssistant.totalPoints')}</span>
                      <p className="text-2xl font-bold text-teal-600">{assessmentRubric.totalPoints}</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-900">{t('visualArtsStudioAssistant.category')}</th>
                          <th className="border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-900">{t('visualArtsStudioAssistant.excellent')}</th>
                          <th className="border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-900">{t('visualArtsStudioAssistant.proficient')}</th>
                          <th className="border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-900">{t('visualArtsStudioAssistant.developing')}</th>
                          <th className="border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-900">{t('visualArtsStudioAssistant.beginning')}</th>
                          <th className="border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-900">{t('visualArtsStudioAssistant.points')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assessmentRubric.criteria.map((criterion, idx) => (
                          <tr key={idx}>
                            <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">{criterion.category}</td>
                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">{criterion.excellent}</td>
                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">{criterion.proficient}</td>
                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">{criterion.developing}</td>
                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">{criterion.beginning}</td>
                            <td className="border border-gray-200 px-4 py-3 text-center font-semibold text-gray-900">{criterion.points}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-2">{t('visualArtsStudioAssistant.standardsAlignment')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {assessmentRubric.standards.map((standard, i) => (
                        <span key={i} className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                          {standard}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Differentiation Tools Tab */}
          {activeTab === 'differentiation' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-6 border border-violet-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="h-6 w-6 text-violet-600" />{t('visualArtsStudioAssistant.differentiationInclusionTools')}</h2>
                <p className="text-gray-600">{t('visualArtsStudioAssistant.toolsAndStrategiesToMakeVisualArtsEducationAccessibleAn')}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-violet-600" />{t('visualArtsStudioAssistant.skillLevelDifferentiation')}</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('visualArtsStudioAssistant.beginnerAdaptations')}</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>{t('visualArtsStudioAssistant.simplifiedTechniquesAndMaterials')}</li>
                        <li>{t('visualArtsStudioAssistant.stepByStepGuidedInstruction')}</li>
                        <li>{t('visualArtsStudioAssistant.preCutMaterialsAndTemplates')}</li>
                        <li>{t('visualArtsStudioAssistant.visualDemonstrationsAndExamples')}</li>
                        <li>{t('visualArtsStudioAssistant.extendedTimeForCompletion')}</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('visualArtsStudioAssistant.advancedExtensions')}</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>{t('visualArtsStudioAssistant.complexMultiMediaProjects')}</li>
                        <li>{t('visualArtsStudioAssistant.independentResearchAndExploration')}</li>
                        <li>{t('visualArtsStudioAssistant.curatorialAndExhibitionOpportunities')}</li>
                        <li>{t('visualArtsStudioAssistant.mentorshipAndPeerTeaching')}</li>
                        <li>{t('visualArtsStudioAssistant.portfolioDevelopmentFocus')}</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-violet-600" />{t('visualArtsStudioAssistant.inclusiveStrategies')}</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('visualArtsStudioAssistant.universalDesignForLearning')}</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>{t('visualArtsStudioAssistant.multipleMeansOfRepresentation')}</li>
                        <li>{t('visualArtsStudioAssistant.multipleMeansOfEngagement')}</li>
                        <li>{t('visualArtsStudioAssistant.multipleMeansOfExpression')}</li>
                        <li>{t('visualArtsStudioAssistant.flexibleMaterialsAndTools')}</li>
                        <li>{t('visualArtsStudioAssistant.accessibleWorkspaceDesign')}</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('visualArtsStudioAssistant.culturalResponsiveness')}</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>{t('visualArtsStudioAssistant.diverseArtistRepresentation')}</li>
                        <li>{t('visualArtsStudioAssistant.culturalContextIntegration')}</li>
                        <li>{t('visualArtsStudioAssistant.multilingualVocabularySupport')}</li>
                        <li>{t('visualArtsStudioAssistant.respectfulCulturalExploration')}</li>
                        <li>{t('visualArtsStudioAssistant.studentVoiceAndChoice')}</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-violet-600" />{t('visualArtsStudioAssistant.alternativeAssessments')}</h3>
                  <div className="space-y-4">
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>{t('visualArtsStudioAssistant.processPortfoliosOverProduct')}</li>
                      <li>{t('visualArtsStudioAssistant.verbalAndWrittenReflections')}</li>
                      <li>{t('visualArtsStudioAssistant.peerAndSelfAssessments')}</li>
                      <li>{t('visualArtsStudioAssistant.digitalDocumentationOptions')}</li>
                      <li>{t('visualArtsStudioAssistant.adaptiveRubricsAndCriteria')}</li>
                      <li>{t('visualArtsStudioAssistant.multipleDemonstrationMethods')}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-violet-600" />{t('visualArtsStudioAssistant.accommodationIdeas')}</h3>
                  <div className="space-y-4">
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>{t('visualArtsStudioAssistant.adaptiveToolsAndMaterials')}</li>
                      <li>{t('visualArtsStudioAssistant.modifiedWorkspaceArrangements')}</li>
                      <li>{t('visualArtsStudioAssistant.assistiveTechnologyIntegration')}</li>
                      <li>{t('visualArtsStudioAssistant.visualAndTactileSupports')}</li>
                      <li>{t('visualArtsStudioAssistant.extendedTimeAndBreaks')}</li>
                      <li>{t('visualArtsStudioAssistant.collaborativeWorkOptions')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VisualArtsStudioAssistant

