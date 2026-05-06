import { useState } from 'react'
import {
  TrendingUp,
  Target,
  Palette,
  BarChart3,
  CheckCircle,
  FileText,
  Sparkles,
  Download,
  RefreshCw,
  Star,
  Lock,
  Globe,
  Eye,
  Lightbulb,
  Award,
  Users,
  BookOpen,
  Zap,
  ExternalLink,
  GraduationCap,
  Info,
  Copy,
  Megaphone,
  Search,
  MessageSquare,
  Video,
  Image as ImageIcon,
} from 'lucide-react'
import {
  getGradeLevels,
  getMarketingTopics,
  MarketingConcept,
  BrandingStrategy,
  DigitalMarketingChannel,
  MarketResearchMethod,
  MarketingStandard,
  MarketingCampaign,
} from '../../utils/marketingUtils'
import * as chatbotApi from '../../api/chatbots'
import {
  mapBrandingStrategiesResponseToUI,
  mapDigitalMarketingChannelsResponseToUI,
  mapMarketResearchMethodsResponseToUI,
  mapMarketingCampaignResponseToUI,
  mapMarketingConceptsResponseToUI,
  mapMarketingStandardsResponseToUI,
} from '../../utils/marketingAdapters'
import { useCapabilityCreditGate } from '../../hooks/useCapabilityCreditGate'
import { useChatbotHistorySession } from '../../hooks/useChatbotHistorySession'
import NoCreditsCard from '../../components/NoCreditsCard'

const MARKETING_STRATEGIST_SLUG = 'marketing-branding-strategist'

type TabType = 'marketing-concepts' | 'branding' | 'digital-marketing' | 'market-research' | 'campaigns' | 'standards' | 'resources'

const MarketingBrandingStrategist = () => {
  const { creditError, clearCreditError, captureApiError, runWithCredits } = useCapabilityCreditGate()
  const [activeTab, setActiveTab] = useState<TabType>('marketing-concepts')
  const [gradeLevel, setGradeLevel] = useState('High School (9-12)')
  const [isGenerating, setIsGenerating] = useState(false)

  // Marketing Concepts State
  const [marketingConcepts, setMarketingConcepts] = useState<MarketingConcept[]>([])
  const [selectedConcept, setSelectedConcept] = useState<MarketingConcept | null>(null)

  // Branding Strategies State
  const [brandingStrategies, setBrandingStrategies] = useState<BrandingStrategy[]>([])
  const [selectedStrategy, setSelectedStrategy] = useState<BrandingStrategy | null>(null)

  // Digital Marketing Channels State
  const [digitalChannels, setDigitalChannels] = useState<DigitalMarketingChannel[]>([])
  const [selectedChannel, setSelectedChannel] = useState<DigitalMarketingChannel | null>(null)

  // Market Research Methods State
  const [researchMethods, setResearchMethods] = useState<MarketResearchMethod[]>([])
  const [selectedMethod, setSelectedMethod] = useState<MarketResearchMethod | null>(null)

  // Marketing Standards State
  const [marketingStandards, setMarketingStandards] = useState<MarketingStandard[]>([])
  const [selectedStandard, setSelectedStandard] = useState<MarketingStandard | null>(null)

  // Campaign Generation State
  const [product, setProduct] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [objective, setObjective] = useState('')
  const [generatedCampaign, setGeneratedCampaign] = useState<MarketingCampaign | null>(null)

  const gradeLevels = getGradeLevels()
  const marketingTopics = getMarketingTopics()

  const MARKETING_CAP_TABS: Record<string, TabType> = {
    marketing_concepts: 'marketing-concepts',
    branding_strategies: 'branding',
    digital_marketing_channels: 'digital-marketing',
    market_research_methods: 'market-research',
    international_marketing_standards: 'standards',
    compaign: 'campaigns', // backend typo must match seed
  }

  const { conversationIdForActiveTab, pinFromResponse } = useChatbotHistorySession({
    slug: MARKETING_STRATEGIST_SLUG,
    activeTab,
    capabilityKeyToTab: MARKETING_CAP_TABS,
    onRestore: async ({ tabKey, userContent, assistantContent, assistantMetadata }) => {
      const cap = assistantMetadata?.capability_key as string | undefined
      const valid: TabType[] = ['marketing-concepts', 'branding', 'digital-marketing', 'market-research', 'campaigns', 'standards', 'resources']
      const tab: TabType =
        valid.includes(tabKey as TabType)
          ? (tabKey as TabType)
          : cap && MARKETING_CAP_TABS[cap]
            ? MARKETING_CAP_TABS[cap]
            : 'marketing-concepts'

      setActiveTab(tab)
      if (userContent) {
        // Most calls use gradeLevel as input. Keep UI aligned.
        setGradeLevel(userContent)
      }

      try {
        const data = JSON.parse(assistantContent) as Record<string, unknown>
        setMarketingConcepts([])
        setSelectedConcept(null)
        setBrandingStrategies([])
        setSelectedStrategy(null)
        setDigitalChannels([])
        setSelectedChannel(null)
        setResearchMethods([])
        setSelectedMethod(null)
        setMarketingStandards([])
        setSelectedStandard(null)
        setGeneratedCampaign(null)

        if (tab === 'marketing-concepts') {
          setMarketingConcepts(mapMarketingConceptsResponseToUI(data, gradeLevel))
        } else if (tab === 'branding') {
          setBrandingStrategies(mapBrandingStrategiesResponseToUI(data))
        } else if (tab === 'digital-marketing') {
          setDigitalChannels(mapDigitalMarketingChannelsResponseToUI(data))
        } else if (tab === 'market-research') {
          setResearchMethods(mapMarketResearchMethodsResponseToUI(data))
        } else if (tab === 'standards') {
          setMarketingStandards(mapMarketingStandardsResponseToUI(data))
        } else if (tab === 'campaigns') {
          setGeneratedCampaign(mapMarketingCampaignResponseToUI(data))
        }
      } catch {
        // keep restore silent
      }
    },
  })

  // Load Marketing Concepts (backend)
  const handleLoadMarketingConcepts = async () => {
    setIsGenerating(true)
    clearCreditError()
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(MARKETING_STRATEGIST_SLUG, 'marketing_concepts', {
        input: gradeLevel,
        input_type: 'text',
        parameters: { grade_level: gradeLevel },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      const concepts = mapMarketingConceptsResponseToUI(response.result as Record<string, unknown>, gradeLevel)
      setMarketingConcepts(concepts)
      pinFromResponse(response.conversation_id)
    } catch (e: unknown) {
      if (captureApiError(e)) return
      console.error('Marketing concepts:', e)
    } finally {
      setIsGenerating(false)
    }
  }

  // Load Branding Strategies (backend)
  const handleLoadBrandingStrategies = async () => {
    setIsGenerating(true)
    clearCreditError()
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(MARKETING_STRATEGIST_SLUG, 'branding_strategies', {
        input: gradeLevel,
        input_type: 'text',
        parameters: { grade_level: gradeLevel },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      const strategies = mapBrandingStrategiesResponseToUI(response.result as Record<string, unknown>)
      setBrandingStrategies(strategies)
      pinFromResponse(response.conversation_id)
    } catch (e: unknown) {
      if (captureApiError(e)) return
      console.error('Branding strategies:', e)
    } finally {
      setIsGenerating(false)
    }
  }

  // Load Digital Marketing Channels (backend)
  const handleLoadDigitalChannels = async () => {
    setIsGenerating(true)
    clearCreditError()
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(MARKETING_STRATEGIST_SLUG, 'digital_marketing_channels', {
        input: gradeLevel,
        input_type: 'text',
        parameters: { grade_level: gradeLevel },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      const channels = mapDigitalMarketingChannelsResponseToUI(response.result as Record<string, unknown>)
      setDigitalChannels(channels)
      pinFromResponse(response.conversation_id)
    } catch (e: unknown) {
      if (captureApiError(e)) return
      console.error('Digital marketing channels:', e)
    } finally {
      setIsGenerating(false)
    }
  }

  // Load Market Research Methods (backend)
  const handleLoadResearchMethods = async () => {
    setIsGenerating(true)
    clearCreditError()
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(MARKETING_STRATEGIST_SLUG, 'market_research_methods', {
        input: gradeLevel,
        input_type: 'text',
        parameters: { grade_level: gradeLevel },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      const methods = mapMarketResearchMethodsResponseToUI(response.result as Record<string, unknown>)
      setResearchMethods(methods)
      pinFromResponse(response.conversation_id)
    } catch (e: unknown) {
      if (captureApiError(e)) return
      console.error('Market research methods:', e)
    } finally {
      setIsGenerating(false)
    }
  }

  // Load Marketing Standards (backend)
  const handleLoadStandards = async () => {
    setIsGenerating(true)
    clearCreditError()
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(MARKETING_STRATEGIST_SLUG, 'international_marketing_standards', {
        input: gradeLevel,
        input_type: 'text',
        parameters: { grade_level: gradeLevel },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      const standards = mapMarketingStandardsResponseToUI(response.result as Record<string, unknown>)
      setMarketingStandards(standards)
      pinFromResponse(response.conversation_id)
    } catch (e: unknown) {
      if (captureApiError(e)) return
      console.error('Marketing standards:', e)
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate Marketing Campaign (backend)
  const handleGenerateCampaign = async () => {
    if (!product.trim() || !targetAudience.trim() || !objective.trim()) return
    setIsGenerating(true)
    clearCreditError()
    try {
      // Backend capability key is "compaign" (typo) — must match seed.
      const response = await runWithCredits(chatbotApi.executeCapability(MARKETING_STRATEGIST_SLUG, 'compaign', {
        input: gradeLevel,
        input_type: 'text',
        parameters: {
          grade_level: gradeLevel,
          product: product.trim(),
          target_audience: targetAudience.trim(),
          primary_objective: objective.trim(),
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      const campaign = mapMarketingCampaignResponseToUI(response.result as Record<string, unknown>)
      setGeneratedCampaign(campaign)
      pinFromResponse(response.conversation_id)
    } catch (e: unknown) {
      if (captureApiError(e)) return
      console.error('Marketing campaign:', e)
    } finally {
      setIsGenerating(false)
    }
  }

  const tabs = [
    { id: 'marketing-concepts' as TabType, label: 'Marketing Concepts', icon: BookOpen },
    { id: 'branding' as TabType, label: 'Branding', icon: Palette },
    { id: 'digital-marketing' as TabType, label: 'Digital Marketing', icon: Zap },
    { id: 'market-research' as TabType, label: 'Market Research', icon: Search },
    { id: 'campaigns' as TabType, label: 'Campaigns', icon: Megaphone },
    { id: 'standards' as TabType, label: 'Standards', icon: CheckCircle },
    { id: 'resources' as TabType, label: 'Resources', icon: FileText },
  ]
  // Exclude last sub-chatbot from UI; data still from backend for rest
  const visibleTabs = tabs.slice(0, -1)

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
      <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-3xl font-bold">Marketing & Branding Strategist</h1>
                  <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    <Star className="h-3 w-3" /> 4.8★
                  </span>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    <Lock className="inline h-3 w-3 mr-1" /> Premium
                  </span>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    <Globe className="inline h-3 w-3 mr-1" /> International Standards
                  </span>
                </div>
                <p className="mt-2 text-pink-100">
                  Comprehensive marketing and branding education aligned with international standards (AMA, CIM, IAA, ESOMAR, GDPR). 
                  Help students master marketing fundamentals, branding strategies, digital marketing channels, and market research 
                  through evidence-based pedagogy and global best practices.
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
            {visibleTabs.map((tab) => {
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
          {/* Marketing Concepts Tab */}
          {activeTab === 'marketing-concepts' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-6 border border-pink-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-pink-600" />
                  Marketing Fundamentals
                </h2>
                <p className="text-gray-700 mb-4">
                  Explore core marketing concepts tailored to different grade levels. Each concept includes key principles, 
                  examples, activities, and real-world applications.
                </p>
                <button
                  onClick={handleLoadMarketingConcepts}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-6 py-3 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 disabled:opacity-50 transition"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Load Marketing Concepts
                    </>
                  )}
                </button>
              </div>

              {marketingConcepts.length > 0 && (
                <div className="space-y-4">
                  {marketingConcepts
                    .filter(concept => {
                      if (gradeLevel === 'Elementary (K-5)') return concept.gradeLevel.includes('Elementary')
                      if (gradeLevel === 'Middle School (6-8)') return concept.gradeLevel.includes('Middle')
                      if (gradeLevel === 'High School (9-12)') return concept.gradeLevel.includes('High')
                      return true
                    })
                    .map((concept, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm cursor-pointer hover:border-pink-300 transition"
                        onClick={() => setSelectedConcept(selectedConcept?.id === concept.id ? null : concept)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900">{concept.concept}</h3>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-semibold">
                                {concept.gradeLevel}
                              </span>
                            </div>
                          </div>
                          <Eye className="h-5 w-5 text-gray-400" />
                        </div>
                        <p className="text-gray-700">{concept.description}</p>

                        {selectedConcept?.id === concept.id && (
                          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Key Principles</h4>
                              <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {concept.keyPrinciples.map((principle, i) => (
                                  <li key={i}>{principle}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Examples</h4>
                                <ul className="list-disc list-inside space-y-1 text-gray-700">
                                  {concept.examples.map((example, i) => (
                                    <li key={i}>{example}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Activities</h4>
                                <ul className="list-disc list-inside space-y-1 text-gray-700">
                                  {concept.activities.map((activity, i) => (
                                    <li key={i}>{activity}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Tools</h4>
                              <div className="flex flex-wrap gap-2">
                                {concept.tools.map((tool, i) => (
                                  <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                    {tool}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Real-World Applications</h4>
                              <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {concept.realWorldApplications.map((app, i) => (
                                  <li key={i}>{app}</li>
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

          {/* Branding Tab */}
          {activeTab === 'branding' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Palette className="h-6 w-6 text-purple-600" />
                  Branding Strategies
                </h2>
                <p className="text-gray-700 mb-4">
                  Explore comprehensive branding strategies including positioning, storytelling, and rebranding approaches.
                </p>
                <button
                  onClick={handleLoadBrandingStrategies}
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
                      Load Branding Strategies
                    </>
                  )}
                </button>
              </div>

              {brandingStrategies.length > 0 && (
                <div className="space-y-4">
                  {brandingStrategies.map((strategy, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm cursor-pointer hover:border-purple-300 transition"
                      onClick={() => setSelectedStrategy(selectedStrategy?.id === strategy.id ? null : strategy)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900">{strategy.strategy}</h3>
                        </div>
                        <Eye className="h-5 w-5 text-gray-400" />
                      </div>
                      <p className="text-gray-700">{strategy.description}</p>

                      {selectedStrategy?.id === strategy.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Components</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                              {strategy.components.map((component, i) => (
                                <li key={i}>{component}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Implementation Steps</h4>
                            <ol className="list-decimal list-inside space-y-1 text-gray-700">
                              {strategy.steps.map((step, i) => (
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

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Examples</h4>
                            <div className="flex flex-wrap gap-2">
                              {strategy.examples.map((example, i) => (
                                <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                  {example}
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

          {/* Digital Marketing Tab */}
          {activeTab === 'digital-marketing' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="h-6 w-6 text-blue-600" />
                  Digital Marketing Channels
                </h2>
                <p className="text-gray-700 mb-4">
                  Explore various digital marketing channels, platforms, best practices, and metrics for each channel.
                </p>
                <button
                  onClick={handleLoadDigitalChannels}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Load Digital Channels
                    </>
                  )}
                </button>
              </div>

              {digitalChannels.length > 0 && (
                <div className="space-y-4">
                  {digitalChannels.map((channel, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm cursor-pointer hover:border-blue-300 transition"
                      onClick={() => setSelectedChannel(selectedChannel?.id === channel.id ? null : channel)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900">{channel.channel}</h3>
                        </div>
                        <Eye className="h-5 w-5 text-gray-400" />
                      </div>
                      <p className="text-gray-700">{channel.description}</p>

                      {selectedChannel?.id === channel.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Platforms</h4>
                            <div className="flex flex-wrap gap-2">
                              {channel.platforms.map((platform, i) => (
                                <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                  {platform}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Best Practices</h4>
                              <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {channel.bestPractices.map((practice, i) => (
                                  <li key={i}>{practice}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Key Metrics</h4>
                              <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {channel.metrics.map((metric, i) => (
                                  <li key={i}>{metric}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Tools</h4>
                            <div className="flex flex-wrap gap-2">
                              {channel.tools.map((tool, i) => (
                                <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                  {tool}
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

          {/* Market Research Tab */}
          {activeTab === 'market-research' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Search className="h-6 w-6 text-green-600" />
                  Market Research Methods
                </h2>
                <p className="text-gray-700 mb-4">
                  Explore various market research methodologies, tools, and best practices for gathering consumer insights.
                </p>
                <button
                  onClick={handleLoadResearchMethods}
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
                      Load Research Methods
                    </>
                  )}
                </button>
              </div>

              {researchMethods.length > 0 && (
                <div className="space-y-4">
                  {researchMethods.map((method, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm cursor-pointer hover:border-green-300 transition"
                      onClick={() => setSelectedMethod(selectedMethod?.id === method.id ? null : method)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900">{method.method}</h3>
                        </div>
                        <Eye className="h-5 w-5 text-gray-400" />
                      </div>
                      <p className="text-gray-700">{method.description}</p>

                      {selectedMethod?.id === method.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Use Cases</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                              {method.useCases.map((useCase, i) => (
                                <li key={i}>{useCase}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Steps</h4>
                            <ol className="list-decimal list-inside space-y-1 text-gray-700">
                              {method.steps.map((step, i) => (
                                <li key={i}>{step}</li>
                              ))}
                            </ol>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Advantages</h4>
                              <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {method.advantages.map((advantage, i) => (
                                  <li key={i}>{advantage}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Limitations</h4>
                              <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {method.limitations.map((limitation, i) => (
                                  <li key={i}>{limitation}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Tools</h4>
                            <div className="flex flex-wrap gap-2">
                              {method.tools.map((tool, i) => (
                                <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                  {tool}
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

          {/* Campaigns Tab */}
          {activeTab === 'campaigns' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Megaphone className="h-6 w-6 text-orange-600" />
                  Marketing Campaign Generator
                </h2>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product/Service
                    </label>
                    <input
                      type="text"
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}
                      placeholder="e.g., New smartphone"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Audience
                    </label>
                    <input
                      type="text"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="e.g., Young professionals"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Objective
                    </label>
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => setObjective(e.target.value)}
                      placeholder="e.g., Increase brand awareness"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
                <button
                  onClick={handleGenerateCampaign}
                  disabled={!product.trim() || !targetAudience.trim() || !objective.trim() || isGenerating}
                  className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 transition"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Generate Campaign Plan
                    </>
                  )}
                </button>
              </div>

              {generatedCampaign && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{generatedCampaign.title}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                          {generatedCampaign.timeline}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          {generatedCampaign.targetAudience}
                        </span>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                      <Download className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Objectives</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {generatedCampaign.objectives.map((obj, i) => (
                          <li key={i}>{obj}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Channels</h4>
                      <div className="flex flex-wrap gap-2">
                        {generatedCampaign.channels.map((channel, i) => (
                          <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            {channel}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Messages</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {generatedCampaign.keyMessages.map((message, i) => (
                          <li key={i}>{message}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Tactics</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {generatedCampaign.tactics.map((tactic, i) => (
                          <li key={i}>{tactic}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Success Metrics</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {generatedCampaign.successMetrics.map((metric, i) => (
                          <li key={i}>{metric}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
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
                  International Marketing Standards
                </h2>
                <p className="text-gray-700 mb-4">
                  Access comprehensive international standards for marketing education from leading organizations worldwide.
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

              {marketingStandards.length > 0 && (
                <div className="space-y-4">
                  {marketingStandards.map((standard, idx) => (
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
                  Marketing & Branding Resources
                </h2>
                <p className="text-gray-600">
                  Curated resources for marketing concepts, branding strategies, digital marketing, and market research.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-pink-600" />
                    Marketing Fundamentals
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-pink-600" />
                      <span>AMA Marketing Education</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-pink-600" />
                      <span>CIM Marketing Resources</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-pink-600" />
                      <span>Marketing Case Studies</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-pink-600" />
                      <span>Marketing Tools & Templates</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Palette className="h-5 w-5 text-purple-600" />
                    Branding Resources
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-purple-600" />
                      <span>Brand Strategy Guides</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-purple-600" />
                      <span>Brand Identity Design Tools</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-purple-600" />
                      <span>Brand Storytelling Examples</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-purple-600" />
                      <span>Rebranding Case Studies</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    Digital Marketing Tools
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-blue-600" />
                      <span>Google Analytics Academy</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-blue-600" />
                      <span>Social Media Marketing Guides</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-blue-600" />
                      <span>SEO Best Practices</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-blue-600" />
                      <span>Email Marketing Platforms</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Search className="h-5 w-5 text-green-600" />
                    Market Research Tools
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-green-600" />
                      <span>ESOMAR Research Resources</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-green-600" />
                      <span>Survey Platforms</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-green-600" />
                      <span>Data Analysis Tools</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-green-600" />
                      <span>Research Methodology Guides</span>
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

export default MarketingBrandingStrategist



