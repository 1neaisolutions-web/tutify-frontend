import { useState } from 'react'
import {
  Camera,
  Users,
  FileText,
  Target,
  Award,
  BookOpen,
  PlayCircle,
  Lightbulb,
  CheckCircle,
  Sparkles,
  Download,
  RefreshCw,
  CheckCircle2,
  Clock,
  Star,
  Lock,
  Globe,
  TrendingUp,
  BarChart3,
  Zap,
  Copy,
  ExternalLink,
  GraduationCap,
  AlertCircle,
  Eye,
  Theater,
  Film,
  Layout,
  Mic,
} from 'lucide-react'
import {
  getPlayGenres,
  getStageTypes,
  getProductionRoles,
  getTheaterPeriods,
  ScriptAnalysis,
  CharacterProfile,
  StageDirection,
  ProductionPlan,
  ActingMethod,
  TheaterStyle,
  TheaterStandard,
} from '../../utils/dramaUtils'
import * as chatbotApi from '../../api/chatbots'
import { useSnackbar } from '../../hooks/useSnackbar'
import { useCapabilityCreditGate } from '../../hooks/useCapabilityCreditGate'
import { useChatbotHistorySession } from '../../hooks/useChatbotHistorySession'
import NoCreditsCard from '../../components/NoCreditsCard'
import {
  mapScriptAnalysisResult,
  mapCharacterProfileResult,
  mapStageDirectionResult,
  mapProductionPlanResult,
  mapActingMethodsList,
  mapTheaterStylesList,
  mapTheaterStandardsList,
} from '../../utils/dramaAdapters'

import { useTranslation } from 'react-i18next'
import { GradeBandSelect } from '@/components/shared/GradeBandSelect'
import { chatbotBandToApi } from '@/catalog/adapters/chatbotAdapters'
const CHATBOT_SLUG = 'drama-theater-director'

type TabType = 'script-analysis' | 'character' | 'stage-direction' | 'production' | 'acting-methods' | 'theater-styles' | 'standards' | 'resources'

const DramaTheaterDirector = () => {
  const { t } = useTranslation()
  const { toast } = useSnackbar()
  const { creditError, clearCreditError, captureApiError, runWithCredits } = useCapabilityCreditGate()
  const [activeTab, setActiveTab] = useState<TabType>('script-analysis')
  const [gradeLevel, setGradeLevel] = useState('9-12')
  const [playGenre, setPlayGenre] = useState('Drama')
  const [stageType, setStageType] = useState('Proscenium')
  const [isGenerating, setIsGenerating] = useState(false)

  // Script Analysis State
  const [playTitle, setPlayTitle] = useState('')
  const [playwright, setPlaywright] = useState('')
  const [scriptAnalysis, setScriptAnalysis] = useState<ScriptAnalysis | null>(null)

  // Character Development State
  const [characterName, setCharacterName] = useState('')
  const [characterRole, setCharacterRole] = useState('Protagonist')
  const [characterProfile, setCharacterProfile] = useState<CharacterProfile | null>(null)

  // Stage Direction State
  const [sceneName, setSceneName] = useState('')
  const [stageDirection, setStageDirection] = useState<StageDirection | null>(null)

  // Production Planning State
  const [productionTitle, setProductionTitle] = useState('')
  const [productionDuration, setProductionDuration] = useState('12 weeks')
  const [productionPlan, setProductionPlan] = useState<ProductionPlan | null>(null)

  // Acting Methods State
  const [actingMethods, setActingMethods] = useState<ActingMethod[]>([])
  const [selectedMethod, setSelectedMethod] = useState<ActingMethod | null>(null)

  // Theater Styles State
  const [theaterStyles, setTheaterStyles] = useState<TheaterStyle[]>([])
  const [selectedStyle, setSelectedStyle] = useState<TheaterStyle | null>(null)

  // Standards State
  const [theaterStandards, setTheaterStandards] = useState<TheaterStandard[]>([])
  const [selectedStandard, setSelectedStandard] = useState<TheaterStandard | null>(null)

  const DRAMA_CAP_TABS: Record<string, TabType> = {
    script_analysis_tools: 'script-analysis',
    character_development: 'character',
    stage_direction: 'stage-direction',
    production_planning: 'production',
    acting_methods: 'acting-methods',
    theater_styles: 'theater-styles',
    theater_standards: 'standards',
  }

  const { conversationIdForActiveTab, pinFromResponse } = useChatbotHistorySession({
    slug: CHATBOT_SLUG,
    activeTab,
    capabilityKeyToTab: DRAMA_CAP_TABS,
    onRestore: async ({ tabKey, userContent, assistantContent, assistantMetadata }) => {
      const cap = assistantMetadata?.capability_key as string | undefined
      const valid: TabType[] = [
        'script-analysis',
        'character',
        'stage-direction',
        'production',
        'acting-methods',
        'theater-styles',
        'standards',
        'resources',
      ]
      const tab: TabType =
        valid.includes(tabKey as TabType)
          ? (tabKey as TabType)
          : cap && DRAMA_CAP_TABS[cap]
            ? DRAMA_CAP_TABS[cap]
            : 'script-analysis'
      setActiveTab(tab)
      const u = userContent?.trim() ?? ''
      try {
        const raw = JSON.parse(assistantContent) as Record<string, unknown>
        setScriptAnalysis(null)
        setCharacterProfile(null)
        setStageDirection(null)
        setProductionPlan(null)
        setActingMethods([])
        setTheaterStyles([])
        setTheaterStandards([])
        if (tab === 'script-analysis') {
          if (u) setPlayTitle(u)
          setScriptAnalysis(mapScriptAnalysisResult(raw))
        } else if (tab === 'character') {
          if (u) setCharacterName(u)
          setCharacterProfile(mapCharacterProfileResult(raw))
        } else if (tab === 'stage-direction') {
          if (u) setSceneName(u)
          setStageDirection(mapStageDirectionResult(raw))
        } else if (tab === 'production') {
          if (u) setProductionTitle(u)
          setProductionPlan(mapProductionPlanResult(raw))
        } else if (tab === 'acting-methods') {
          setActingMethods(mapActingMethodsList(raw))
        } else if (tab === 'theater-styles') {
          setTheaterStyles(mapTheaterStylesList(raw))
        } else if (tab === 'standards') {
          setTheaterStandards(mapTheaterStandardsList(raw, chatbotBandToApi(gradeLevel)))
        }
      } catch {
        toast.error(t('dramaTheaterDirector.couldNotRestoreSavedOutputFromHistory'))
      }
    },
  })

  const genres = getPlayGenres()
  const stageTypes = getStageTypes()
  const roles = getProductionRoles()
  const periods = getTheaterPeriods()

  // Generate Script Analysis
  const handleGenerateScriptAnalysis = async () => {
    if (!playTitle.trim() || !playwright.trim()) return
    setIsGenerating(true)
    try {
      const title = playTitle.trim()
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'script_analysis_tools', {
        input: title,
        input_type: 'text',
        parameters: {
          grade_level: chatbotBandToApi(gradeLevel),
          genre: playGenre,
          stage_type: stageType,
          play_title: title,
          playwright: playwright.trim(),
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setScriptAnalysis(mapScriptAnalysisResult(response.result))
      pinFromResponse(response.conversation_id)
      toast.success(t('dramaTheaterDirector.scriptAnalysisGenerated'))
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to analyze script'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info(t('dramaTheaterDirector.upgradeToPremiumToUseThisFeature'), { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate Character Profile
  const handleGenerateCharacterProfile = async () => {
    if (!characterName.trim()) return
    setIsGenerating(true)
    try {
      const name = characterName.trim()
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'character_development', {
        input: name,
        input_type: 'text',
        parameters: {
          grade_level: chatbotBandToApi(gradeLevel),
          genre: playGenre,
          stage_type: stageType,
          character_name: name,
          role: characterRole,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setCharacterProfile(mapCharacterProfileResult(response.result))
      pinFromResponse(response.conversation_id)
      toast.success(t('dramaTheaterDirector.characterProfileGenerated'))
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to generate character profile'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info(t('dramaTheaterDirector.upgradeToPremiumToUseThisFeature'), { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate Stage Direction
  const handleGenerateStageDirection = async () => {
    if (!sceneName.trim()) return
    setIsGenerating(true)
    try {
      const scene = sceneName.trim()
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'stage_direction', {
        input: scene,
        input_type: 'text',
        parameters: {
          grade_level: chatbotBandToApi(gradeLevel),
          genre: playGenre,
          stage_type: stageType,
          scene_name: scene,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setStageDirection(mapStageDirectionResult(response.result))
      pinFromResponse(response.conversation_id)
      toast.success(t('dramaTheaterDirector.stageDirectionGenerated'))
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to generate stage direction'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info(t('dramaTheaterDirector.upgradeToPremiumToUseThisFeature'), { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate Production Plan
  const handleGenerateProductionPlan = async () => {
    if (!productionTitle.trim()) return
    setIsGenerating(true)
    try {
      const title = productionTitle.trim()
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'production_planning', {
        input: title,
        input_type: 'text',
        parameters: {
          grade_level: chatbotBandToApi(gradeLevel),
          genre: playGenre,
          stage_type: stageType,
          production_title: title,
          duration: productionDuration,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setProductionPlan(mapProductionPlanResult(response.result))
      pinFromResponse(response.conversation_id)
      toast.success(t('dramaTheaterDirector.productionPlanGenerated'))
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to generate production plan'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info(t('dramaTheaterDirector.upgradeToPremiumToUseThisFeature'), { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Load Acting Methods
  const handleLoadActingMethods = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'acting_methods', {
        input: ' ',
        input_type: 'text',
        parameters: {
          grade_level: chatbotBandToApi(gradeLevel),
          genre: playGenre,
          stage_type: stageType,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setActingMethods(mapActingMethodsList(response.result))
      pinFromResponse(response.conversation_id)
      toast.success(t('dramaTheaterDirector.actingMethodsLoaded'))
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to load acting methods'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info(t('dramaTheaterDirector.upgradeToPremiumToUseThisFeature'), { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Load Theater Styles
  const handleLoadTheaterStyles = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'theater_styles', {
        input: ' ',
        input_type: 'text',
        parameters: {
          grade_level: chatbotBandToApi(gradeLevel),
          genre: playGenre,
          stage_type: stageType,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setTheaterStyles(mapTheaterStylesList(response.result))
      pinFromResponse(response.conversation_id)
      toast.success(t('dramaTheaterDirector.theaterStylesLoaded'))
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to load theater styles'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info(t('dramaTheaterDirector.upgradeToPremiumToUseThisFeature'), { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Load Theater Standards
  const handleLoadStandards = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'theater_standards', {
        input: ' ',
        input_type: 'text',
        parameters: {
          grade_level: chatbotBandToApi(gradeLevel),
          genre: playGenre,
          stage_type: stageType,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setTheaterStandards(mapTheaterStandardsList(response.result, chatbotBandToApi(gradeLevel)))
      pinFromResponse(response.conversation_id)
      toast.success(t('dramaTheaterDirector.theaterStandardsLoaded'))
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to load standards'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info(t('dramaTheaterDirector.upgradeToPremiumToUseThisFeature'), { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const tabs = [
    { id: 'script-analysis' as TabType, label: t('dramaTheaterDirector.tabs.script-analysis'), icon: FileText },
    { id: 'character' as TabType, label: t('dramaTheaterDirector.tabs.character'), icon: Users },
    { id: 'stage-direction' as TabType, label: t('dramaTheaterDirector.tabs.stage-direction'), icon: Layout },
    { id: 'production' as TabType, label: t('dramaTheaterDirector.tabs.production'), icon: Target },
    { id: 'acting-methods' as TabType, label: t('dramaTheaterDirector.tabs.acting-methods'), icon: Award },
    { id: 'theater-styles' as TabType, label: t('dramaTheaterDirector.tabs.theater-styles'), icon: Theater },
    { id: 'standards' as TabType, label: t('dramaTheaterDirector.tabs.standards'), icon: CheckCircle },
    { id: 'resources' as TabType, label: t('dramaTheaterDirector.tabs.resources'), icon: BookOpen },
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
      <div className="bg-gradient-to-r from-red-700 via-rose-700 to-pink-700 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Camera className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-3xl font-bold">{t('dramaTheaterDirector.dramaTheaterDirector')}</h1>
                  <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    <Star className="h-3 w-3" /> 4.8★
                  </span>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    <Lock className="inline h-3 w-3 mr-1" />{t('dramaTheaterDirector.premium')}</span>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    <Globe className="inline h-3 w-3 mr-1" />{t('dramaTheaterDirector.internationalStandards')}</span>
                </div>
                <p className="mt-2 text-blue-100">{t('dramaTheaterDirector.heroDescription')}</p>
              </div>
            </div>
            
            {/* Quick Settings */}
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <GradeBandSelect
                  variant="native"
                  value={gradeLevel}
                  onChange={setGradeLevel}
                  label={t('dramaTheaterDirector.gradeLevel')}
                  context="chatbotBand"
                  selectClassName="bg-white/20 border border-white/30 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  className="flex items-center gap-2 [&_span]:text-sm [&_span]:font-medium [&_span]:text-white"
                />
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <label className="text-sm font-medium">{t('dramaTheaterDirector.genre')}</label>
                <select
                  value={playGenre}
                  onChange={(e) => setPlayGenre(e.target.value)}
                  className="bg-white/20 border border-white/30 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <label className="text-sm font-medium">{t('dramaTheaterDirector.stageType')}</label>
                <select
                  value={stageType}
                  onChange={(e) => setStageType(e.target.value)}
                  className="bg-white/20 border border-white/30 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  {stageTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
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
                      ? 'border-red-600 text-red-600 bg-red-50'
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
          {/* Script Analysis Tab */}
          {activeTab === 'script-analysis' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-6 border border-red-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="h-6 w-6 text-red-600" />{t('dramaTheaterDirector.scriptAnalysisTools')}</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('dramaTheaterDirector.playTitle')}</label>
                    <input
                      type="text"
                      value={playTitle}
                      onChange={(e) => setPlayTitle(e.target.value)}
                      placeholder={t('dramaTheaterDirector.eGRomeoAndJuliet')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('dramaTheaterDirector.playwright')}</label>
                    <input
                      type="text"
                      value={playwright}
                      onChange={(e) => setPlaywright(e.target.value)}
                      placeholder={t('dramaTheaterDirector.eGWilliamShakespeare')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
                <button
                  onClick={handleGenerateScriptAnalysis}
                  disabled={!playTitle.trim() || !playwright.trim() || isGenerating}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />{t('dramaTheaterDirector.analyzing')}</>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />{t('dramaTheaterDirector.analyzeScript')}</>
                  )}
                </button>
              </div>

              {scriptAnalysis && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{scriptAnalysis.title}</h3>
                      <p className="text-gray-600 mt-1">by {scriptAnalysis.playwright}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                          {scriptAnalysis.genre}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          {scriptAnalysis.period}
                        </span>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                      <Download className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">{t('dramaTheaterDirector.plotStructure')}</h4>
                      <div className="space-y-2">
                        {Object.entries(scriptAnalysis.structure.plotStructure).map(([key, value]) => (
                          <div key={key} className="border-l-4 border-red-500 pl-4">
                            <h5 className="font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h5>
                            <p className="text-gray-700">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('dramaTheaterDirector.characters')}</h4>
                      <div className="space-y-3">
                        {scriptAnalysis.characters.map((character, idx) => (
                          <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="font-semibold text-gray-900">{character.name}</h5>
                            <p className="text-sm text-gray-600 mb-2">{character.role}</p>
                            <div>
                              <span className="text-xs font-medium text-gray-700">{t('dramaTheaterDirector.objectives')}</span>
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 mt-1">
                                {character.objectives.map((obj, i) => (
                                  <li key={i}>{obj}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('dramaTheaterDirector.themes')}</h4>
                      <div className="flex flex-wrap gap-2">
                        {scriptAnalysis.themes.map((theme, i) => (
                          <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                            {theme}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('dramaTheaterDirector.culturalContext')}</h4>
                      <p className="text-gray-700">{scriptAnalysis.culturalContext}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Character Development Tab */}
          {activeTab === 'character' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-6 border border-rose-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="h-6 w-6 text-rose-600" />{t('dramaTheaterDirector.characterDevelopment')}</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('dramaTheaterDirector.characterName')}</label>
                    <input
                      type="text"
                      value={characterName}
                      onChange={(e) => setCharacterName(e.target.value)}
                      placeholder={t('dramaTheaterDirector.eGHamlet')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('dramaTheaterDirector.role')}</label>
                    <select
                      value={characterRole}
                      onChange={(e) => setCharacterRole(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                    >
                      <option>{t('dramaTheaterDirector.protagonist')}</option>
                      <option>{t('dramaTheaterDirector.antagonist')}</option>
                      <option>{t('dramaTheaterDirector.supporting')}</option>
                      <option>{t('dramaTheaterDirector.ensemble')}</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleGenerateCharacterProfile}
                  disabled={!characterName.trim() || isGenerating}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-2 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 disabled:opacity-50 transition"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />{t('dramaTheaterDirector.generating')}</>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />{t('dramaTheaterDirector.createCharacterProfile')}</>
                  )}
                </button>
              </div>

              {characterProfile && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{characterProfile.name}</h3>
                  
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{t('dramaTheaterDirector.physicalTraits')}</h4>
                        <div className="flex flex-wrap gap-2">
                          {characterProfile.physicalTraits.map((trait, i) => (
                            <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              {trait}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{t('dramaTheaterDirector.psychologicalTraits')}</h4>
                        <div className="flex flex-wrap gap-2">
                          {characterProfile.psychologicalTraits.map((trait, i) => (
                            <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                              {trait}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('dramaTheaterDirector.background')}</h4>
                      <p className="text-gray-700">{characterProfile.background}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('dramaTheaterDirector.objectives2')}</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {characterProfile.objectives.map((obj, i) => (
                          <li key={i}>{obj}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{t('dramaTheaterDirector.obstacles')}</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {characterProfile.obstacles.map((obstacle, i) => (
                            <li key={i}>{obstacle}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{t('dramaTheaterDirector.tactics')}</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {characterProfile.tactics.map((tactic, i) => (
                            <li key={i}>{tactic}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('dramaTheaterDirector.characterArc')}</h4>
                      <p className="text-gray-700">{characterProfile.arc}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Stage Direction Tab */}
          {activeTab === 'stage-direction' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-xl p-6 border border-pink-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Layout className="h-6 w-6 text-pink-600" />{t('dramaTheaterDirector.stageDirectionBlocking')}</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('dramaTheaterDirector.sceneName')}</label>
                    <input
                      type="text"
                      value={sceneName}
                      onChange={(e) => setSceneName(e.target.value)}
                      placeholder={t('dramaTheaterDirector.eGAct1Scene1')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleGenerateStageDirection}
                      disabled={!sceneName.trim() || isGenerating}
                      className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 disabled:opacity-50 transition"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-5 w-5 animate-spin" />{t('dramaTheaterDirector.generating')}</>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />{t('dramaTheaterDirector.generateBlocking')}</>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {stageDirection && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{stageDirection.scene}</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('dramaTheaterDirector.stageType2')}</h4>
                      <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-semibold">
                        {stageDirection.stageType}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">{t('dramaTheaterDirector.blocking')}</h4>
                      <div className="space-y-3">
                        {stageDirection.blocking.map((block, idx) => (
                          <div key={idx} className="border-l-4 border-pink-500 pl-4">
                            <h5 className="font-semibold text-gray-900">{block.character}</h5>
                            <div className="space-y-1 text-sm text-gray-700 mt-1">
                              <div><span className="font-medium">{t('dramaTheaterDirector.position')}</span> {block.position}</div>
                              <div><span className="font-medium">{t('dramaTheaterDirector.movement')}</span> {block.movement}</div>
                              <div><span className="font-medium">{t('dramaTheaterDirector.focus')}</span> {block.focus}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{t('dramaTheaterDirector.stagePicture')}</h4>
                      <p className="text-gray-700">{stageDirection.stagePicture}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">{t('dramaTheaterDirector.technicalNotes')}</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-1">{t('dramaTheaterDirector.lighting')}</h5>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            {stageDirection.technicalNotes.lighting.map((note, i) => (
                              <li key={i}>{note}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 mb-1">{t('dramaTheaterDirector.sound')}</h5>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            {stageDirection.technicalNotes.sound.map((note, i) => (
                              <li key={i}>{note}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 mb-1">{t('dramaTheaterDirector.props')}</h5>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            {stageDirection.technicalNotes.props.map((prop, i) => (
                              <li key={i}>{prop}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 mb-1">{t('dramaTheaterDirector.costume')}</h5>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            {stageDirection.technicalNotes.costume.map((note, i) => (
                              <li key={i}>{note}</li>
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

          {/* Production Planning Tab */}
          {activeTab === 'production' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-6 border border-red-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="h-6 w-6 text-red-600" />{t('dramaTheaterDirector.productionPlanning')}</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('dramaTheaterDirector.productionTitle')}</label>
                    <input
                      type="text"
                      value={productionTitle}
                      onChange={(e) => setProductionTitle(e.target.value)}
                      placeholder={t('dramaTheaterDirector.eGOurTown')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('dramaTheaterDirector.duration')}</label>
                    <select
                      value={productionDuration}
                      onChange={(e) => setProductionDuration(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    >
                      <option>{t('dramaTheaterDirector.kWeeks')}</option>
                      <option>{t('dramaTheaterDirector.k0Weeks')}</option>
                      <option>{t('dramaTheaterDirector.k2Weeks')}</option>
                      <option>{t('dramaTheaterDirector.k6Weeks')}</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleGenerateProductionPlan}
                  disabled={!productionTitle.trim() || isGenerating}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />{t('dramaTheaterDirector.generating')}</>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />{t('dramaTheaterDirector.generateProductionPlan')}</>
                  )}
                </button>
              </div>

              {productionPlan && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{productionPlan.title}</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">{t('dramaTheaterDirector.timeline')}</h4>
                      <div className="space-y-4">
                        {productionPlan.timeline.map((phase, idx) => (
                          <div key={idx} className="border-l-4 border-red-500 pl-4">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-semibold text-gray-900">{phase.phase}</h5>
                              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                {phase.startDate} - {phase.endDate}
                              </span>
                            </div>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                              {phase.tasks.map((task, i) => (
                                <li key={i}>{task}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">{t('dramaTheaterDirector.budget')}</h4>
                      <div className="space-y-2">
                        {productionPlan.budget.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <span className="font-medium text-gray-900">{item.category}</span>
                              <p className="text-sm text-gray-600">{item.notes}</p>
                            </div>
                            <span className="font-bold text-gray-900">{item.amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">{t('dramaTheaterDirector.teamRoles')}</h4>
                      <div className="space-y-3">
                        {productionPlan.team.map((role, idx) => (
                          <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="font-semibold text-gray-900 mb-2">{role.role}</h5>
                            <div>
                              <span className="text-sm font-medium text-gray-700">{t('dramaTheaterDirector.responsibilities')}</span>
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 mt-1">
                                {role.responsibilities.map((resp, i) => (
                                  <li key={i}>{resp}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Acting Methods Tab */}
          {activeTab === 'acting-methods' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="h-6 w-6 text-amber-600" />{t('dramaTheaterDirector.actingTechniquesMethods')}</h2>
                <button
                  onClick={handleLoadActingMethods}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 disabled:opacity-50 transition"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />{t('dramaTheaterDirector.loading')}</>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />{t('dramaTheaterDirector.loadActingMethods')}</>
                  )}
                </button>
              </div>

              {actingMethods.length > 0 && (
                <div className="space-y-4">
                  {actingMethods.map((method, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm cursor-pointer hover:border-amber-300 transition"
                      onClick={() => setSelectedMethod(selectedMethod?.id === method.id ? null : method)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900">{method.name}</h3>
                          <p className="text-gray-600 text-sm mt-1">Founded by {method.founder}</p>
                        </div>
                        <Eye className="h-5 w-5 text-gray-400" />
                      </div>
                      <p className="text-gray-700">{method.description}</p>

                      {selectedMethod?.id === method.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">{t('dramaTheaterDirector.keyPrinciples')}</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                              {method.keyPrinciples.map((principle, i) => (
                                <li key={i}>{principle}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">{t('dramaTheaterDirector.techniques')}</h4>
                              <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {method.techniques.map((technique, i) => (
                                  <li key={i}>{technique}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">{t('dramaTheaterDirector.exercises')}</h4>
                              <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {method.exercises.map((exercise, i) => (
                                  <li key={i}>{exercise}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">{t('dramaTheaterDirector.benefits')}</h4>
                            <div className="flex flex-wrap gap-2">
                              {method.benefits.map((benefit, i) => (
                                <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                  {benefit}
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

          {/* Theater Styles Tab */}
          {activeTab === 'theater-styles' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-6 border border-violet-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Theater className="h-6 w-6 text-violet-600" />{t('dramaTheaterDirector.internationalTheaterStyles')}</h2>
                <button
                  onClick={handleLoadTheaterStyles}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 disabled:opacity-50 transition"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />{t('dramaTheaterDirector.loading')}</>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />{t('dramaTheaterDirector.loadTheaterStyles')}</>
                  )}
                </button>
              </div>

              {theaterStyles.length > 0 && (
                <div className="space-y-4">
                  {theaterStyles.map((style, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm cursor-pointer hover:border-violet-300 transition"
                      onClick={() => setSelectedStyle(selectedStyle?.id === style.id ? null : style)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900">{style.name}</h3>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-semibold">
                              {style.origin}
                            </span>
                          </div>
                        </div>
                        <Eye className="h-5 w-5 text-gray-400" />
                      </div>
                      <p className="text-gray-700">{style.description}</p>

                      {selectedStyle?.id === style.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">{t('dramaTheaterDirector.characteristics')}</h4>
                            <div className="flex flex-wrap gap-2">
                              {style.characteristics.map((char, i) => (
                                <span key={i} className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">
                                  {char}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">{t('dramaTheaterDirector.keyPractitioners')}</h4>
                            <div className="flex flex-wrap gap-2">
                              {style.keyPractitioners.map((practitioner, i) => (
                                <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                  {practitioner}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">{t('dramaTheaterDirector.examples')}</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                              {style.examples.map((example, i) => (
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

          {/* Standards Tab */}
          {activeTab === 'standards' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-indigo-600" />{t('dramaTheaterDirector.internationalTheaterEducationStandards')}</h2>
                <button
                  onClick={handleLoadStandards}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />{t('dramaTheaterDirector.loading')}</>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />{t('dramaTheaterDirector.loadStandards')}</>
                  )}
                </button>
              </div>

              {theaterStandards.length > 0 && (
                <div className="space-y-4">
                  {theaterStandards.map((standard, idx) => (
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
                            <h4 className="font-semibold text-gray-900 mb-2">{t('dramaTheaterDirector.keyComponents')}</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                              {standard.keyComponents.map((component, i) => (
                                <li key={i}>{component}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">{t('dramaTheaterDirector.assessmentCriteria')}</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                              {standard.assessmentCriteria.map((criteria, i) => (
                                <li key={i}>{criteria}</li>
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

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-rose-50 to-red-50 rounded-xl p-6 border border-rose-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-rose-600" />{t('dramaTheaterDirector.theaterResourcesRepertoire')}</h2>
                <p className="text-gray-600">{t('dramaTheaterDirector.accessCuratedPlayLibrariesMonologueCollectionsAndTheate')}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-rose-600" />{t('dramaTheaterDirector.playLibrary')}</h3>
                  <p className="text-gray-700 mb-3">{t('dramaTheaterDirector.curatedCollectionOfPlaysAcrossGenresAndPeriods')}</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li>{t('dramaTheaterDirector.classicalPlays')}</li>
                    <li>{t('dramaTheaterDirector.contemporaryWorks')}</li>
                    <li>{t('dramaTheaterDirector.oneActPlays')}</li>
                    <li>{t('dramaTheaterDirector.studentWrittenWorks')}</li>
                    <li>{t('dramaTheaterDirector.internationalPlays')}</li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Mic className="h-5 w-5 text-rose-600" />{t('dramaTheaterDirector.monologueCollection')}</h3>
                  <p className="text-gray-700 mb-3">{t('dramaTheaterDirector.ageAppropriateMonologuesForAuditionsAndPractice')}</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li>{t('dramaTheaterDirector.classicalMonologues')}</li>
                    <li>{t('dramaTheaterDirector.contemporaryMonologues')}</li>
                    <li>{t('dramaTheaterDirector.ageAppropriateSelections')}</li>
                    <li>{t('dramaTheaterDirector.genreVariety')}</li>
                    <li>{t('dramaTheaterDirector.characterTypes')}</li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Film className="h-5 w-5 text-rose-600" />{t('dramaTheaterDirector.sceneStudy')}</h3>
                  <p className="text-gray-700 mb-3">{t('dramaTheaterDirector.sceneCollectionsWithAnalysisGuides')}</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li>{t('dramaTheaterDirector.sceneCollections')}</li>
                    <li>{t('dramaTheaterDirector.analysisGuides')}</li>
                    <li>{t('dramaTheaterDirector.performanceNotes')}</li>
                    <li>{t('dramaTheaterDirector.characterBreakdowns')}</li>
                    <li>{t('dramaTheaterDirector.directingNotes')}</li>
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

export default DramaTheaterDirector

