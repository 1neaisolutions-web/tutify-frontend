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

const CHATBOT_SLUG = 'visual-arts-studio-assistant'

type TabType = 'history' | 'technique' | 'portfolio' | 'projects' | 'literacy' | 'cultural' | 'assessment' | 'differentiation'

const VisualArtsStudioAssistant = () => {
  const { toast } = useSnackbar()
  const { creditError, clearCreditError, captureApiError, runWithCredits } = useCapabilityCreditGate()
  const [activeTab, setActiveTab] = useState<TabType>('history')
  const [gradeLevel, setGradeLevel] = useState('6-12')
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
        toast.error('Could not restore saved output from History.')
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
          grade_level: gradeLevel,
          media: mediaType,
          cultural_region: culturalRegion,
          select_art_movement: selectedMovement,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setArtMovement(mapArtHistoryResult(response.result))
      pinFromResponse(response.conversation_id)
      toast.success('Art movement profile loaded')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to load art movement'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
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
          grade_level: gradeLevel,
          media: mediaType,
          cultural_region: culturalRegion,
          select_technique: selectedTechnique,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setTechniqueGuide(mapArtTechniqueResult(response.result))
      pinFromResponse(response.conversation_id)
      toast.success('Technique guide loaded')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to load technique guide'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
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
          grade_level: gradeLevel,
          media: mediaType,
          cultural_region: culturalRegion,
          portfolio_type: portfolioType,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setPortfolioAssessment(mapPortfolioDevelopmentResult(response.result))
      pinFromResponse(response.conversation_id)
      toast.success('Portfolio guidance generated')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to generate portfolio assessment'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
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
          grade_level: gradeLevel,
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
      toast.success('Creative project generated')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to generate project'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
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
          grade_level: gradeLevel,
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
      toast.success('Visual analysis generated')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to analyze artwork'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
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
          grade_level: gradeLevel,
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
      toast.success('Cultural connections generated')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to find connections'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
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
          grade_level: gradeLevel,
          media: mediaType,
          cultural_region: culturalRegion,
          project_type: assessmentProjectType,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setAssessmentRubric(mapArtAssessmentRubricResult(response.result))
      pinFromResponse(response.conversation_id)
      toast.success('Rubric generated')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to generate rubric'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const tabs = [
    { id: 'history' as TabType, label: 'Art History Explorer', icon: BookOpen },
    { id: 'technique' as TabType, label: 'Technique Guidance', icon: Brush },
    { id: 'portfolio' as TabType, label: 'Portfolio Development', icon: Award },
    { id: 'projects' as TabType, label: 'Creative Projects', icon: Lightbulb },
    { id: 'literacy' as TabType, label: 'Visual Literacy', icon: Eye },
    { id: 'cultural' as TabType, label: 'Cultural Connections', icon: Globe },
    { id: 'assessment' as TabType, label: 'Assessment Builder', icon: FileCheck },
    { id: 'differentiation' as TabType, label: 'Differentiation Tools', icon: Users },
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
                  <h1 className="text-3xl font-bold">Visual Arts Studio Assistant</h1>
                  <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    <Star className="h-3 w-3" /> 4.9★
                  </span>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    <Lock className="inline h-3 w-3 mr-1" /> Premium
                  </span>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    <Globe className="inline h-3 w-3 mr-1" /> Global Perspective
                  </span>
                </div>
                <p className="mt-2 text-pink-100">
                  Transform your classroom into a dynamic studio. Blend artistic fundamentals with critical thinking, 
                  cultural awareness, and inclusive differentiation. Support art history, visual literacy, studio techniques, 
                  and portfolio development with a global perspective.
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
                  <option value="K-5">K-5</option>
                  <option value="6-8">6-8</option>
                  <option value="9-12">9-12</option>
                </select>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <label className="text-sm font-medium">Media:</label>
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
                <label className="text-sm font-medium">Cultural Region:</label>
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
                <p className="text-gray-600 mb-4">
                  Explore art movements from around the world. Discover cultural contexts, key artists, 
                  and artistic connections across time and place.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Art Movement
                    </label>
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
                          <RefreshCw className="h-5 w-5 animate-spin" />
                          Exploring...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />
                          Explore Movement
                        </>
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
                      <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-700">{artMovement.description}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Cultural Context</h4>
                      <p className="text-gray-700">{artMovement.culturalContext}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Key Artists</h4>
                        <div className="flex flex-wrap gap-2">
                          {artMovement.keyArtists.map((artist, i) => (
                            <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              {artist}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Characteristics</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {artMovement.characteristics.map((char, i) => (
                            <li key={i}>{char}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Notable Artworks</h4>
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
                      <h4 className="font-semibold text-gray-900 mb-2">Related Movements</h4>
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
                  <Brush className="h-6 w-6 text-blue-600" />
                  Studio Technique Guidance
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Technique
                    </label>
                    <select
                      value={selectedTechnique}
                      onChange={(e) => setSelectedTechnique(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Watercolor Painting</option>
                      <option>Charcoal Drawing</option>
                      <option>Acrylic Painting</option>
                      <option>Oil Painting</option>
                      <option>Printmaking</option>
                      <option>Ceramics</option>
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
                          <RefreshCw className="h-5 w-5 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />
                          Get Guide
                        </>
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
                        <h4 className="font-semibold text-gray-900 mb-2">Materials</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {techniqueGuide.materials.map((material, i) => (
                            <li key={i}>{material}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Tools</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {techniqueGuide.tools.map((tool, i) => (
                            <li key={i}>{tool}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Step-by-Step Process</h4>
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
                              <span className="text-sm font-medium text-gray-700">Tips:</span>
                              <ul className="list-disc list-inside ml-4 text-sm text-gray-600">
                                {step.tips.map((tip, j) => (
                                  <li key={j}>{tip}</li>
                                ))}
                              </ul>
                            </div>
                            {step.safetyNotes && step.safetyNotes.length > 0 && (
                              <div className="mt-2">
                                <span className="text-sm font-medium text-red-700">Safety Notes:</span>
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
                        <h4 className="font-semibold text-gray-900 mb-2">Common Mistakes</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {techniqueGuide.commonMistakes.map((mistake, i) => (
                            <li key={i}>{mistake}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Variations</h4>
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
                      <h4 className="font-semibold text-gray-900 mb-2">Cultural Examples</h4>
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
                  <Award className="h-6 w-6 text-amber-600" />
                  Portfolio Development Assistant
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Portfolio Type
                    </label>
                    <select
                      value={portfolioType}
                      onChange={(e) => setPortfolioType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    >
                      <option>General Portfolio</option>
                      <option>AP Studio Art Portfolio</option>
                      <option>College Application Portfolio</option>
                      <option>Exhibition Portfolio</option>
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

              {portfolioAssessment && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Portfolio Assessment Criteria</h3>
                  
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
                          <span className="text-sm font-medium text-gray-700">Indicators:</span>
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
                      <h4 className="font-semibold text-gray-900 mb-2">Reflection Prompts</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {portfolioAssessment.reflectionPrompts.map((prompt, i) => (
                          <li key={i}>{prompt}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Documentation Tips</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {portfolioAssessment.documentationTips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Presentation Guidelines</h4>
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
                  <Lightbulb className="h-6 w-6 text-green-600" />
                  Creative Project Generator
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Theme
                    </label>
                    <select
                      value={projectTheme}
                      onChange={(e) => setProjectTheme(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option>Identity Collage</option>
                      <option>Nature Printmaking</option>
                      <option>Cultural Portraits</option>
                      <option>Environmental Art</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <select
                      value={projectDuration}
                      onChange={(e) => setProjectDuration(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option>2-3 weeks</option>
                      <option>3-4 weeks</option>
                      <option>4-6 weeks</option>
                      <option>6-8 weeks</option>
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
                          <RefreshCw className="h-5 w-5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />
                          Generate Project
                        </>
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
                        <h4 className="font-semibold text-gray-900 mb-2">Learning Objectives</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {creativeProject.learningObjectives.map((obj, i) => (
                            <li key={i}>{obj}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Required Materials</h4>
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
                          <h4 className="font-semibold text-gray-900 mb-2">Optional Materials</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {creativeProject.materials.optional.map((material, i) => (
                              <li key={i}>{material}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Project Phases</h4>
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
                          <h4 className="font-semibold text-gray-900 mb-2">Beginner</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            {creativeProject.differentiation.beginner.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Intermediate</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            {creativeProject.differentiation.intermediate.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Advanced</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            {creativeProject.differentiation.advanced.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Cultural Connections</h4>
                          <div className="flex flex-wrap gap-2">
                            {creativeProject.culturalConnections.map((connection, i) => (
                              <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                {connection}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Cross-Curricular</h4>
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
                  <Eye className="h-6 w-6 text-indigo-600" />
                  Visual Literacy Analyzer
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Artwork Title
                    </label>
                    <input
                      type="text"
                      value={artworkTitle}
                      onChange={(e) => setArtworkTitle(e.target.value)}
                      placeholder="Enter artwork title..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Artist Name
                    </label>
                    <input
                      type="text"
                      value={artistName}
                      onChange={(e) => setArtistName(e.target.value)}
                      placeholder="Enter artist name..."
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
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Analyze Artwork
                    </>
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
                      <h4 className="font-semibold text-gray-900 mb-3">Formal Elements</h4>
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
                      <h4 className="font-semibold text-gray-900 mb-3">Principles of Design</h4>
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
                      <h4 className="font-semibold text-gray-900 mb-3">Contextual Analysis</h4>
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
                      <h4 className="font-semibold text-gray-900 mb-3">Critical Thinking Questions</h4>
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
                  <Globe className="h-6 w-6 text-pink-600" />
                  Cultural Connections & Global Perspectives
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Artwork/Theme
                    </label>
                    <input
                      type="text"
                      value={connectionArtwork}
                      onChange={(e) => setConnectionArtwork(e.target.value)}
                      placeholder="Enter artwork or theme..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Theme Focus
                    </label>
                    <select
                      value={connectionTheme}
                      onChange={(e) => setConnectionTheme(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    >
                      <option>Identity</option>
                      <option>Heritage</option>
                      <option>Social Justice</option>
                      <option>Environment</option>
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
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      Finding Connections...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Find Connections
                    </>
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
                      <h4 className="font-semibold text-gray-900 mb-2">Themes</h4>
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
                        <h4 className="font-semibold text-gray-900 mb-2">Techniques</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {culturalConnection.techniques.map((tech, i) => (
                            <li key={i}>{tech}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Contemporary Relevance</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {culturalConnection.contemporaryRelevance.map((rel, i) => (
                            <li key={i}>{rel}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Cross-Cultural Influences</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {culturalConnection.crossCulturalInfluences.map((influence, i) => (
                          <li key={i}>{influence}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Teaching Strategies</h4>
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
                  <FileText className="h-6 w-6 text-teal-600" />
                  Assessment & Rubrics Builder
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Type
                    </label>
                    <select
                      value={assessmentProjectType}
                      onChange={(e) => setAssessmentProjectType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    >
                      <option>Mixed Media Project</option>
                      <option>Portfolio Assessment</option>
                      <option>Studio Project</option>
                      <option>Research Project</option>
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
                          <RefreshCw className="h-5 w-5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />
                          Generate Rubric
                        </>
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
                      <span className="text-sm text-gray-500">Total Points</span>
                      <p className="text-2xl font-bold text-teal-600">{assessmentRubric.totalPoints}</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                          <th className="border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-900">Excellent</th>
                          <th className="border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-900">Proficient</th>
                          <th className="border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-900">Developing</th>
                          <th className="border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-900">Beginning</th>
                          <th className="border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-900">Points</th>
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
                    <h4 className="font-semibold text-gray-900 mb-2">Standards Alignment</h4>
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
                  <Users className="h-6 w-6 text-violet-600" />
                  Differentiation & Inclusion Tools
                </h2>
                <p className="text-gray-600">
                  Tools and strategies to make visual arts education accessible and inclusive for all learners.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-violet-600" />
                    Skill Level Differentiation
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Beginner Adaptations</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>Simplified techniques and materials</li>
                        <li>Step-by-step guided instruction</li>
                        <li>Pre-cut materials and templates</li>
                        <li>Visual demonstrations and examples</li>
                        <li>Extended time for completion</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Advanced Extensions</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>Complex multi-media projects</li>
                        <li>Independent research and exploration</li>
                        <li>Curatorial and exhibition opportunities</li>
                        <li>Mentorship and peer teaching</li>
                        <li>Portfolio development focus</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-violet-600" />
                    Inclusive Strategies
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Universal Design for Learning</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>Multiple means of representation</li>
                        <li>Multiple means of engagement</li>
                        <li>Multiple means of expression</li>
                        <li>Flexible materials and tools</li>
                        <li>Accessible workspace design</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Cultural Responsiveness</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>Diverse artist representation</li>
                        <li>Cultural context integration</li>
                        <li>Multilingual vocabulary support</li>
                        <li>Respectful cultural exploration</li>
                        <li>Student voice and choice</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-violet-600" />
                    Alternative Assessments
                  </h3>
                  <div className="space-y-4">
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Process portfolios over product</li>
                      <li>Verbal and written reflections</li>
                      <li>Peer and self-assessments</li>
                      <li>Digital documentation options</li>
                      <li>Adaptive rubrics and criteria</li>
                      <li>Multiple demonstration methods</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-violet-600" />
                    Accommodation Ideas
                  </h3>
                  <div className="space-y-4">
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Adaptive tools and materials</li>
                      <li>Modified workspace arrangements</li>
                      <li>Assistive technology integration</li>
                      <li>Visual and tactile supports</li>
                      <li>Extended time and breaks</li>
                      <li>Collaborative work options</li>
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

