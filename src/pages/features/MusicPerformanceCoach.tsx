import { useState } from 'react'
import {
  Music,
  Headphones,
  Mic,
  Users,
  Award,
  BookOpen,
  PlayCircle,
  FileMusic,
  Target,
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
  Lightbulb,
  Zap,
  Copy,
  ExternalLink,
  GraduationCap,
  AlertCircle,
  Eye,
  Gamepad2,
} from 'lucide-react'
import {
  getInstruments,
  getMusicStyles,
  getEnsembleTypes,
  getGameCategories,
  getTheoryCategories,
  MusicTheoryConcept,
  CompositionGuide,
  PerformanceTechnique,
  EnsembleGuide,
  PedagogicalMethod,
  MusicGame,
  MusicStandard,
} from '../../utils/musicUtils'
import * as chatbotApi from '../../api/chatbots'
import { useSnackbar } from '../../hooks/useSnackbar'
import { useCapabilityCreditGate } from '../../hooks/useCapabilityCreditGate'
import { useChatbotHistorySession } from '../../hooks/useChatbotHistorySession'
import NoCreditsCard from '../../components/NoCreditsCard'
import {
  mapMusicTheoryResult,
  mapMusicCompositionResult,
  mapPerformanceTechniqueResult,
  mapEnsembleResult,
  mapMusicPedagogyList,
  mapMusicGamesList,
  mapMusicStandardsList,
} from '../../utils/musicAdapters'

const CHATBOT_SLUG = 'music-performance-coach'

type TabType = 'theory' | 'composition' | 'performance' | 'ensemble' | 'pedagogy' | 'games' | 'standards' | 'resources'

const MusicPerformanceCoach = () => {
  const { toast } = useSnackbar()
  const { creditError, clearCreditError, captureApiError, runWithCredits } = useCapabilityCreditGate()
  const [activeTab, setActiveTab] = useState<TabType>('theory')
  const [gradeLevel, setGradeLevel] = useState('High School (9-12)')
  const [selectedInstrument, setSelectedInstrument] = useState('Piano')
  const [selectedStyle, setSelectedStyle] = useState('Classical')
  const [isGenerating, setIsGenerating] = useState(false)

  // Music Theory State
  const [theoryConcept, setTheoryConcept] = useState('Major Scale')
  const [musicTheoryInfo, setMusicTheoryInfo] = useState<MusicTheoryConcept | null>(null)

  // Composition State
  const [compositionType, setCompositionType] = useState('melody')
  const [compositionGuide, setCompositionGuide] = useState<CompositionGuide | null>(null)

  // Performance State
  const [performanceTechnique, setPerformanceTechnique] = useState('posture')
  const [techniqueInfo, setTechniqueInfo] = useState<PerformanceTechnique | null>(null)

  // Ensemble State
  const [ensembleType, setEnsembleType] = useState('Orchestra')
  const [ensembleGuide, setEnsembleGuide] = useState<EnsembleGuide | null>(null)

  // Pedagogy State
  const [pedagogicalMethods, setPedagogicalMethods] = useState<PedagogicalMethod[]>([])
  const [selectedMethod, setSelectedMethod] = useState<PedagogicalMethod | null>(null)

  // Games State
  const [gameCategory, setGameCategory] = useState('theory')
  const [musicGames, setMusicGames] = useState<MusicGame[]>([])

  // Standards State
  const [musicStandards, setMusicStandards] = useState<MusicStandard[]>([])
  const [selectedStandard, setSelectedStandard] = useState<MusicStandard | null>(null)

  const MUSIC_CAP_TABS: Record<string, TabType> = {
    music_theory: 'theory',
    music_composition: 'composition',
    performance_techniques: 'performance',
    ensemble_coordination: 'ensemble',
    music_pedagogy: 'pedagogy',
    music_games: 'games',
    music_standards: 'standards',
  }

  const { conversationIdForActiveTab, pinFromResponse } = useChatbotHistorySession({
    slug: CHATBOT_SLUG,
    activeTab,
    capabilityKeyToTab: MUSIC_CAP_TABS,
    onRestore: async ({ tabKey, assistantContent, assistantMetadata }) => {
      const cap = assistantMetadata?.capability_key as string | undefined
      const valid: TabType[] = ['theory', 'composition', 'performance', 'ensemble', 'pedagogy', 'games', 'standards', 'resources']
      const tab: TabType =
        valid.includes(tabKey as TabType)
          ? (tabKey as TabType)
          : cap && MUSIC_CAP_TABS[cap]
            ? MUSIC_CAP_TABS[cap]
            : 'theory'
      setActiveTab(tab)
      try {
        const raw = JSON.parse(assistantContent) as Record<string, unknown>
        setMusicTheoryInfo(null)
        setCompositionGuide(null)
        setTechniqueInfo(null)
        setEnsembleGuide(null)
        setPedagogicalMethods([])
        setMusicGames([])
        setMusicStandards([])
        if (tab === 'theory') setMusicTheoryInfo(mapMusicTheoryResult(raw))
        else if (tab === 'composition') setCompositionGuide(mapMusicCompositionResult(raw, selectedStyle, gradeLevel))
        else if (tab === 'performance') setTechniqueInfo(mapPerformanceTechniqueResult(raw, performanceTechnique))
        else if (tab === 'ensemble') setEnsembleGuide(mapEnsembleResult(raw))
        else if (tab === 'pedagogy') setPedagogicalMethods(mapMusicPedagogyList(raw))
        else if (tab === 'games') setMusicGames(mapMusicGamesList(raw))
        else if (tab === 'standards') setMusicStandards(mapMusicStandardsList(raw, gradeLevel))
      } catch {
        toast.error('Could not restore saved output from History.')
      }
    },
  })

  const instruments = getInstruments()
  const styles = getMusicStyles()
  const ensembleTypes = getEnsembleTypes()
  const gameCategories = getGameCategories()
  const theoryCategories = getTheoryCategories()

  // Load Music Theory
  const handleLoadTheory = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'music_theory', {
        input: ' ',
        input_type: 'text',
        parameters: {
          grade_level: gradeLevel,
          instrument: selectedInstrument,
          style: selectedStyle,
          theory_concept: theoryConcept,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setMusicTheoryInfo(mapMusicTheoryResult(response.result))
      pinFromResponse(response.conversation_id)
      toast.success('Music theory loaded')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to load music theory'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Load Composition Guide
  const handleLoadCompositionGuide = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'music_composition', {
        input: ' ',
        input_type: 'text',
        parameters: {
          grade_level: gradeLevel,
          instrument: selectedInstrument,
          style: selectedStyle,
          composition_type: compositionType,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setCompositionGuide(mapMusicCompositionResult(response.result, selectedStyle, gradeLevel))
      pinFromResponse(response.conversation_id)
      toast.success('Composition guide loaded')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to load composition guide'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Load Performance Technique
  const handleLoadPerformanceTechnique = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'performance_techniques', {
        input: ' ',
        input_type: 'text',
        parameters: {
          grade_level: gradeLevel,
          instrument: selectedInstrument,
          style: selectedStyle,
          technique: performanceTechnique,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setTechniqueInfo(mapPerformanceTechniqueResult(response.result, performanceTechnique))
      pinFromResponse(response.conversation_id)
      toast.success('Performance techniques loaded')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to load performance techniques'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Load Ensemble Guide
  const handleLoadEnsembleGuide = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'ensemble_coordination', {
        input: ' ',
        input_type: 'text',
        parameters: {
          grade_level: gradeLevel,
          instrument: selectedInstrument,
          style: selectedStyle,
          ensemble_type: ensembleType,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setEnsembleGuide(mapEnsembleResult(response.result))
      pinFromResponse(response.conversation_id)
      toast.success('Ensemble guide loaded')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to load ensemble guide'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Load Pedagogical Methods
  const handleLoadPedagogicalMethods = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'music_pedagogy', {
        input: ' ',
        input_type: 'text',
        parameters: {
          grade_level: gradeLevel,
          instrument: selectedInstrument,
          style: selectedStyle,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setPedagogicalMethods(mapMusicPedagogyList(response.result))
      pinFromResponse(response.conversation_id)
      toast.success('Pedagogy methods loaded')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to load pedagogy methods'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Load Music Games
  const handleLoadGames = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'music_games', {
        input: ' ',
        input_type: 'text',
        parameters: {
          grade_level: gradeLevel,
          instrument: selectedInstrument,
          style: selectedStyle,
          game_category: gameCategory.toLowerCase(),
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setMusicGames(mapMusicGamesList(response.result))
      pinFromResponse(response.conversation_id)
      toast.success('Music games loaded')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to load music games'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Load Music Standards
  const handleLoadStandards = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'music_standards', {
        input: ' ',
        input_type: 'text',
        parameters: {
          grade_level: gradeLevel,
          instrument: selectedInstrument,
          style: selectedStyle,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setMusicStandards(mapMusicStandardsList(response.result, gradeLevel))
      pinFromResponse(response.conversation_id)
      toast.success('Music standards loaded')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to load music standards'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const tabs = [
    { id: 'theory' as TabType, label: 'Music Theory', icon: BookOpen },
    { id: 'composition' as TabType, label: 'Composition', icon: FileMusic },
    { id: 'performance' as TabType, label: 'Performance', icon: Mic },
    { id: 'ensemble' as TabType, label: 'Ensemble', icon: Users },
    { id: 'pedagogy' as TabType, label: 'Pedagogy', icon: GraduationCap },
    { id: 'games' as TabType, label: 'Games', icon: Gamepad2 },
    { id: 'standards' as TabType, label: 'Standards', icon: CheckCircle },
    { id: 'resources' as TabType, label: 'Resources', icon: Music },
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
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Music className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-3xl font-bold">Music & Performance Coach</h1>
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
                <p className="mt-2 text-purple-100">
                  Comprehensive music education tools aligned with international standards (ISME, ISM, WIAE). 
                  Help students learn music theory, composition, performance techniques, and ensemble coordination 
                  through fun, engaging methods. Prepare students for global music excellence.
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
                  <option>Elementary (K-5)</option>
                  <option>Middle School (6-8)</option>
                  <option>High School (9-12)</option>
                  <option>College</option>
                </select>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <label className="text-sm font-medium">Instrument:</label>
                <select
                  value={selectedInstrument}
                  onChange={(e) => setSelectedInstrument(e.target.value)}
                  className="bg-white/20 border border-white/30 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  {instruments.map(instrument => (
                    <option key={instrument} value={instrument}>{instrument}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <label className="text-sm font-medium">Style:</label>
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="bg-white/20 border border-white/30 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  {styles.map(style => (
                    <option key={style} value={style}>{style}</option>
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
                      ? 'border-purple-600 text-purple-600 bg-purple-50'
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
          {/* Music Theory Tab */}
          {activeTab === 'theory' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                  Music Theory Fundamentals
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Theory Concept
                    </label>
                    <select
                      value={theoryConcept}
                      onChange={(e) => setTheoryConcept(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      {theoryCategories.map(concept => (
                        <option key={concept} value={concept}>{concept}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleLoadTheory}
                      disabled={isGenerating}
                      className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 transition"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-5 w-5 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />
                          Explore Concept
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {musicTheoryInfo && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{musicTheoryInfo.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                          {musicTheoryInfo.category}
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
                      <p className="text-gray-700">{musicTheoryInfo.description}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Fundamentals</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {musicTheoryInfo.fundamentals.map((fundamental, i) => (
                          <li key={i}>{fundamental}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Examples</h4>
                      <div className="space-y-2">
                        {musicTheoryInfo.examples.map((example, i) => (
                          <div key={i} className="bg-gray-50 p-3 rounded-lg font-mono text-sm text-gray-700">
                            {example}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Exercises</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {musicTheoryInfo.exercises.map((exercise, i) => (
                            <li key={i}>{exercise}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Tips</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {musicTheoryInfo.tips.map((tip, i) => (
                            <li key={i}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Common Mistakes</h4>
                      <div className="flex flex-wrap gap-2">
                        {musicTheoryInfo.commonMistakes.map((mistake, i) => (
                          <span key={i} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            {mistake}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Composition Tab */}
          {activeTab === 'composition' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-6 border border-pink-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileMusic className="h-6 w-6 text-pink-600" />
                  Composition Tools
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Composition Type
                    </label>
                    <select
                      value={compositionType}
                      onChange={(e) => setCompositionType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="melody">Melody Writing</option>
                      <option value="harmony">Harmony Writing</option>
                      <option value="rhythm">Rhythm Composition</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleLoadCompositionGuide}
                      disabled={isGenerating}
                      className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 disabled:opacity-50 transition"
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

              {compositionGuide && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{compositionGuide.title}</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Composition Elements</h4>
                      <div className="space-y-3">
                        {compositionGuide.elements.map((element, idx) => (
                          <div key={idx} className="border-l-4 border-pink-500 pl-4">
                            <h5 className="font-semibold text-gray-900 mb-1">{element.element}</h5>
                            <p className="text-gray-700 mb-2">{element.description}</p>
                            <div>
                              <span className="text-sm font-medium text-gray-700">Techniques:</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {element.techniques.map((tech, i) => (
                                  <span key={i} className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Structure</h4>
                      <div className="space-y-2">
                        {compositionGuide.structure.map((step, i) => (
                          <div key={i} className="flex gap-3 p-2 bg-gray-50 rounded">
                            <span className="flex-shrink-0 w-6 h-6 bg-pink-100 text-pink-700 rounded-full flex items-center justify-center text-xs font-bold">
                              {i + 1}
                            </span>
                            <span className="text-gray-700">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Exercises</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {compositionGuide.exercises.map((exercise, i) => (
                          <li key={i}>{exercise}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Performance Techniques Tab */}
          {activeTab === 'performance' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-rose-50 to-red-50 rounded-xl p-6 border border-rose-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Mic className="h-6 w-6 text-rose-600" />
                  Performance Techniques
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Technique
                    </label>
                    <select
                      value={performanceTechnique}
                      onChange={(e) => setPerformanceTechnique(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="posture">Posture & Positioning</option>
                      <option value="breathing">Breathing Technique</option>
                      <option value="articulation">Articulation</option>
                      <option value="expression">Expression & Dynamics</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleLoadPerformanceTechnique}
                      disabled={isGenerating}
                      className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 disabled:opacity-50 transition"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-5 w-5 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />
                          Get Technique
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {techniqueInfo && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{techniqueInfo.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-semibold">
                          {techniqueInfo.instrument}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          {techniqueInfo.category}
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
                      <p className="text-gray-700">{techniqueInfo.description}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Steps</h4>
                      <div className="space-y-2">
                        {techniqueInfo.steps.map((step, i) => (
                          <div key={i} className="flex gap-3 p-2 bg-gray-50 rounded">
                            <span className="flex-shrink-0 w-6 h-6 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center text-xs font-bold">
                              {i + 1}
                            </span>
                            <span className="text-gray-700">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Exercises</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {techniqueInfo.exercises.map((exercise, i) => (
                            <li key={i}>{exercise}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Tips</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {techniqueInfo.tips.map((tip, i) => (
                            <li key={i}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Common Issues</h4>
                        <div className="flex flex-wrap gap-2">
                          {techniqueInfo.commonIssues.map((issue, i) => (
                            <span key={i} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                              {issue}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Solutions</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {techniqueInfo.solutions.map((solution, i) => (
                            <li key={i}>{solution}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Ensemble Coordination Tab */}
          {activeTab === 'ensemble' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="h-6 w-6 text-blue-600" />
                  Ensemble Coordination
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ensemble Type
                    </label>
                    <select
                      value={ensembleType}
                      onChange={(e) => setEnsembleType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {ensembleTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleLoadEnsembleGuide}
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

              {ensembleGuide && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{ensembleGuide.type}</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-700">{ensembleGuide.description}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Instrumentation</h4>
                      <div className="flex flex-wrap gap-2">
                        {ensembleGuide.instrumentation.map((instrument, i) => (
                          <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            {instrument}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Roles & Responsibilities</h4>
                      <div className="space-y-3">
                        {ensembleGuide.roles.map((role, idx) => (
                          <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="font-semibold text-gray-900 mb-2">{role.role}</h5>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                              {role.responsibilities.map((resp, i) => (
                                <li key={i}>{resp}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Rehearsal Techniques</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {ensembleGuide.rehearsalTechniques.map((technique, i) => (
                            <li key={i}>{technique}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Performance Tips</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {ensembleGuide.performanceTips.map((tip, i) => (
                            <li key={i}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Common Challenges</h4>
                        <div className="flex flex-wrap gap-2">
                          {ensembleGuide.commonChallenges.map((challenge, i) => (
                            <span key={i} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                              {challenge}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Solutions</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {ensembleGuide.solutions.map((solution, i) => (
                            <li key={i}>{solution}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Pedagogical Methods Tab */}
          {activeTab === 'pedagogy' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-indigo-600" />
                  International Pedagogical Methods
                </h2>
                <p className="text-gray-600 mb-4">
                  Explore internationally recognized music education methods used worldwide.
                </p>
                <button
                  onClick={handleLoadPedagogicalMethods}
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
                      Load Methods
                    </>
                  )}
                </button>
              </div>

              {pedagogicalMethods.length > 0 && (
                <div className="space-y-4">
                  {pedagogicalMethods.map((method, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm cursor-pointer hover:border-indigo-300 transition"
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
                            <h4 className="font-semibold text-gray-900 mb-2">Key Principles</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                              {method.keyPrinciples.map((principle, i) => (
                                <li key={i}>{principle}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Teaching Strategies</h4>
                              <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {method.teachingStrategies.map((strategy, i) => (
                                  <li key={i}>{strategy}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Activities</h4>
                              <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {method.activities.map((activity, i) => (
                                  <li key={i}>{activity}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Benefits</h4>
                            <div className="flex flex-wrap gap-2">
                              {method.benefits.map((benefit, i) => (
                                <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                  {benefit}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Applications</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                              {method.applications.map((application, i) => (
                                <li key={i}>{application}</li>
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

          {/* Games Tab */}
          {activeTab === 'games' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Gamepad2 className="h-6 w-6 text-yellow-600" />
                  Interactive Music Games
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Game Category
                    </label>
                    <select
                      value={gameCategory}
                      onChange={(e) => setGameCategory(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    >
                      {gameCategories.map(cat => (
                        <option key={cat.toLowerCase()} value={cat.toLowerCase()}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleLoadGames}
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
                          Load Games
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {musicGames.length > 0 && (
                <div className="grid md:grid-cols-2 gap-4">
                  {musicGames.map((game, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900">{game.name}</h3>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                              {game.category}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              game.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                              game.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-orange-100 text-orange-700'
                            }`}>
                              {game.difficulty}
                            </span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                              {game.duration}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3">{game.description}</p>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Objectives</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {game.objectives.map((obj, i) => (
                            <li key={i}>{obj}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-3">
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition">
                          <PlayCircle className="h-4 w-4" />
                          Play Game
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Standards Tab */}
          {activeTab === 'standards' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-teal-600" />
                  International Music Education Standards
                </h2>
                <button
                  onClick={handleLoadStandards}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 transition"
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

              {musicStandards.length > 0 && (
                <div className="space-y-4">
                  {musicStandards.map((standard, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm cursor-pointer hover:border-teal-300 transition"
                      onClick={() => setSelectedStandard(selectedStandard?.id === standard.id ? null : standard)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900">{standard.name}</h3>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-semibold">
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
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                              {standard.keyComponents.map((component, i) => (
                                <li key={i}>{component}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Assessment Criteria</h4>
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
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-6 border border-violet-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Music className="h-6 w-6 text-violet-600" />
                  Music Resources & Repertoire
                </h2>
                <p className="text-gray-600">
                  Access curated repertoire libraries, practice materials, and reference resources for music education.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FileMusic className="h-5 w-5 text-violet-600" />
                    Repertoire Library
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Grade-appropriate pieces across genres and difficulty levels
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li>Classical repertoire</li>
                    <li>Popular music</li>
                    <li>World music</li>
                    <li>Jazz standards</li>
                    <li>Folk songs</li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-violet-600" />
                    Practice Materials
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Exercises, scales, and technical studies
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li>Scales and arpeggios</li>
                    <li>Technical exercises</li>
                    <li>Sight-reading materials</li>
                    <li>Ear training exercises</li>
                    <li>Etudes and studies</li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-violet-600" />
                    Reference Materials
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Music theory, history, and style guides
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li>Music theory references</li>
                    <li>Composer biographies</li>
                    <li>Style guides</li>
                    <li>Historical context</li>
                    <li>Performance practice</li>
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

export default MusicPerformanceCoach



