import { useState } from 'react'
import {
  Briefcase,
  Globe,
  TrendingUp,
  DollarSign,
  Lightbulb,
  FileText,
  Users,
  BarChart3,
  Sparkles,
  Download,
  RefreshCw,
  CheckCircle2,
  Clock,
  Star,
  Lock,
  BookOpen,
  Target,
  Award,
  Zap,
  Building2,
  Coins,
  MapPin,
  Copy,
  ExternalLink,
  GraduationCap,
  Network,
} from 'lucide-react'
import {
  getBusinessRegions,
  getIndustries,
  InternationalBusinessStandard,
  EntrepreneurshipFramework,
  EconomicConcept,
  FinancialLiteracyModule,
  BusinessScenario,
  TradeAgreement,
  CrossCulturalBusinessGuide,
} from '../../utils/businessUtils'
import * as chatbotApi from '../../api/chatbots'
import {
  mapInternationalStandardsResponseToUI,
  mapEntrepreneurshipFrameworkResponseToUI,
  mapEconomicConceptResponseToUI,
  mapFinancialLiteracyModuleResponseToUI,
  mapBusinessScenarioResponseToUI,
  mapTradeAgreementsResponseToUI,
  mapCrossCulturalGuideResponseToUI,
} from '../../utils/businessAdapters'
import { useCapabilityCreditGate } from '../../hooks/useCapabilityCreditGate'
import { useChatbotHistorySession } from '../../hooks/useChatbotHistorySession'
import NoCreditsCard from '../../components/NoCreditsCard'

const BUSINESS_MENTOR_SLUG = 'business-studies-mentor'

type TabType = 'standards' | 'entrepreneurship' | 'economics' | 'financial' | 'scenarios' | 'trade' | 'cultural' | 'assessment'

const BusinessStudiesMentor = () => {
  const { creditError, clearCreditError, captureApiError, runWithCredits } = useCapabilityCreditGate()
  const [activeTab, setActiveTab] = useState<TabType>('standards')
  const [gradeLevel, setGradeLevel] = useState('9-12')
  const [selectedRegion, setSelectedRegion] = useState('Global')
  const [selectedIndustry, setSelectedIndustry] = useState('Technology')
  const [isGenerating, setIsGenerating] = useState(false)

  // International Standards State
  const [selectedStandard, setSelectedStandard] = useState('ISO 9001')
  const [businessStandard, setBusinessStandard] = useState<InternationalBusinessStandard | null>(null)

  // Entrepreneurship State
  const [entrepreneurshipFramework, setEntrepreneurshipFramework] = useState<EntrepreneurshipFramework[]>([])

  // Economics State
  const [selectedConcept, setSelectedConcept] = useState('Supply and Demand')
  const [economicConcept, setEconomicConcept] = useState<EconomicConcept | null>(null)

  // Financial Literacy State
  const [financialTopic, setFinancialTopic] = useState('Personal Budgeting')
  const [financialModule, setFinancialModule] = useState<FinancialLiteracyModule | null>(null)

  // Business Scenarios State
  const [scenarioType, setScenarioType] = useState('Export Expansion')
  const [businessScenario, setBusinessScenario] = useState<BusinessScenario | null>(null)

  // Trade Agreements State
  const [tradeAgreements, setTradeAgreements] = useState<TradeAgreement[]>([])

  // Cross-Cultural Guide State
  const [culturalRegion, setCulturalRegion] = useState('Asia-Pacific')
  const [culturalGuide, setCulturalGuide] = useState<CrossCulturalBusinessGuide | null>(null)

  const regions = getBusinessRegions()
  const industries = getIndustries()

  const BUSINESS_CAP_TABS: Record<string, TabType> = {
    international_standards: 'standards',
    entrepreneurship_framework: 'entrepreneurship',
    economic_concepts: 'economics',
    financial_literacy_module: 'financial',
    business_scenarios: 'scenarios',
    trade_agreements: 'trade',
    cross_cultural_guide: 'cultural',
  }

  const { conversationIdForActiveTab, pinFromResponse } = useChatbotHistorySession({
    slug: BUSINESS_MENTOR_SLUG,
    activeTab,
    capabilityKeyToTab: BUSINESS_CAP_TABS,
    onRestore: async ({ tabKey, userContent, assistantContent, assistantMetadata }) => {
      const cap = assistantMetadata?.capability_key as string | undefined
      const valid: TabType[] = ['standards', 'entrepreneurship', 'economics', 'financial', 'scenarios', 'trade', 'cultural', 'assessment']
      const tab: TabType =
        valid.includes(tabKey as TabType)
          ? (tabKey as TabType)
          : cap && BUSINESS_CAP_TABS[cap]
            ? BUSINESS_CAP_TABS[cap]
            : 'standards'

      setActiveTab(tab)
      if (userContent) {
        // Only certain tabs have meaningful input; keep it minimal.
        if (tab === 'standards') setSelectedStandard(userContent)
        if (tab === 'economics') setSelectedConcept(userContent)
        if (tab === 'financial') setFinancialTopic(userContent)
        if (tab === 'scenarios') setScenarioType(userContent)
        if (tab === 'cultural') setCulturalRegion(userContent)
      }

      try {
        const data = JSON.parse(assistantContent) as Record<string, unknown>
        setBusinessStandard(null)
        setEntrepreneurshipFramework([])
        setEconomicConcept(null)
        setFinancialModule(null)
        setBusinessScenario(null)
        setTradeAgreements([])
        setCulturalGuide(null)

        if (tab === 'standards') {
          const standard = mapInternationalStandardsResponseToUI(data, selectedStandard, selectedRegion)
          setBusinessStandard(standard)
        } else if (tab === 'entrepreneurship') {
          setEntrepreneurshipFramework(mapEntrepreneurshipFrameworkResponseToUI(data))
        } else if (tab === 'economics') {
          setEconomicConcept(mapEconomicConceptResponseToUI(data))
        } else if (tab === 'financial') {
          setFinancialModule(mapFinancialLiteracyModuleResponseToUI(data, financialTopic, gradeLevel))
        } else if (tab === 'scenarios') {
          setBusinessScenario(mapBusinessScenarioResponseToUI(data, scenarioType, selectedIndustry, selectedRegion))
        } else if (tab === 'trade') {
          setTradeAgreements(mapTradeAgreementsResponseToUI(data))
        } else if (tab === 'cultural') {
          setCulturalGuide(mapCrossCulturalGuideResponseToUI(data, culturalRegion))
        }
      } catch {
        // keep restore silent; pages toast elsewhere
      }
    },
  })

  // International Standards (backend)
  const handleExploreStandard = async () => {
    setIsGenerating(true)
    clearCreditError()
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(BUSINESS_MENTOR_SLUG, 'international_standards', {
        input: selectedStandard,
        input_type: 'text',
        parameters: { grade_level: gradeLevel, region: selectedRegion, industry: selectedIndustry },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      const standard = mapInternationalStandardsResponseToUI(response.result as Record<string, unknown>, selectedStandard, selectedRegion)
      setBusinessStandard(standard)
      pinFromResponse(response.conversation_id)
    } catch (e: unknown) {
      if (captureApiError(e)) return
      console.error('International standards:', e)
    } finally {
      setIsGenerating(false)
    }
  }

  // Entrepreneurship Framework (backend)
  const handleGetEntrepreneurshipFramework = async () => {
    setIsGenerating(true)
    clearCreditError()
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(BUSINESS_MENTOR_SLUG, 'entrepreneurship_framework', {
        input: '',
        input_type: 'text',
        parameters: { grade_level: gradeLevel, region: selectedRegion, industry: selectedIndustry },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      const framework = mapEntrepreneurshipFrameworkResponseToUI(response.result as Record<string, unknown>)
      setEntrepreneurshipFramework(framework)
      pinFromResponse(response.conversation_id)
    } catch (e: unknown) {
      if (captureApiError(e)) return
      console.error('Entrepreneurship framework:', e)
    } finally {
      setIsGenerating(false)
    }
  }

  // Economic Concept (backend)
  const handleGetEconomicConcept = async () => {
    setIsGenerating(true)
    clearCreditError()
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(BUSINESS_MENTOR_SLUG, 'economic_concepts', {
        input: selectedConcept,
        input_type: 'text',
        parameters: { grade_level: gradeLevel, region: selectedRegion, industry: selectedIndustry },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      const concept = mapEconomicConceptResponseToUI(response.result as Record<string, unknown>)
      setEconomicConcept(concept)
      pinFromResponse(response.conversation_id)
    } catch (e: unknown) {
      if (captureApiError(e)) return
      console.error('Economic concept:', e)
    } finally {
      setIsGenerating(false)
    }
  }

  // Financial Literacy (backend)
  const handleGenerateFinancialModule = async () => {
    setIsGenerating(true)
    clearCreditError()
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(BUSINESS_MENTOR_SLUG, 'financial_literacy_module', {
        input: financialTopic,
        input_type: 'text',
        parameters: { grade_level: gradeLevel, region: selectedRegion, industry: selectedIndustry },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      const module = mapFinancialLiteracyModuleResponseToUI(response.result as Record<string, unknown>, financialTopic, gradeLevel)
      setFinancialModule(module)
      pinFromResponse(response.conversation_id)
    } catch (e: unknown) {
      if (captureApiError(e)) return
      console.error('Financial literacy module:', e)
    } finally {
      setIsGenerating(false)
    }
  }

  // Business Scenario (backend)
  const handleGenerateScenario = async () => {
    setIsGenerating(true)
    clearCreditError()
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(BUSINESS_MENTOR_SLUG, 'business_scenarios', {
        input: scenarioType,
        input_type: 'text',
        parameters: { grade_level: gradeLevel, region: selectedRegion, industry: selectedIndustry },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      const scenario = mapBusinessScenarioResponseToUI(response.result as Record<string, unknown>, scenarioType, selectedIndustry, selectedRegion)
      setBusinessScenario(scenario)
      pinFromResponse(response.conversation_id)
    } catch (e: unknown) {
      if (captureApiError(e)) return
      console.error('Business scenario:', e)
    } finally {
      setIsGenerating(false)
    }
  }

  // Trade Agreements (backend)
  const handleGetTradeAgreements = async () => {
    setIsGenerating(true)
    clearCreditError()
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(BUSINESS_MENTOR_SLUG, 'trade_agreements', {
        input: '',
        input_type: 'text',
        parameters: { grade_level: gradeLevel, region: selectedRegion, industry: selectedIndustry },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      const agreements = mapTradeAgreementsResponseToUI(response.result as Record<string, unknown>)
      setTradeAgreements(agreements)
      pinFromResponse(response.conversation_id)
    } catch (e: unknown) {
      if (captureApiError(e)) return
      console.error('Trade agreements:', e)
    } finally {
      setIsGenerating(false)
    }
  }

  // Cross-Cultural Guide (backend)
  const handleGetCulturalGuide = async () => {
    setIsGenerating(true)
    clearCreditError()
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(BUSINESS_MENTOR_SLUG, 'cross_cultural_guide', {
        input: culturalRegion,
        input_type: 'text',
        parameters: { grade_level: gradeLevel, region: selectedRegion, industry: selectedIndustry },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      const guide = mapCrossCulturalGuideResponseToUI(response.result as Record<string, unknown>, culturalRegion)
      setCulturalGuide(guide)
      pinFromResponse(response.conversation_id)
    } catch (e: unknown) {
      if (captureApiError(e)) return
      console.error('Cross-cultural guide:', e)
    } finally {
      setIsGenerating(false)
    }
  }

  const tabs = [
    { id: 'standards' as TabType, label: 'International Standards', icon: Award },
    { id: 'entrepreneurship' as TabType, label: 'Entrepreneurship', icon: Lightbulb },
    { id: 'economics' as TabType, label: 'Economics', icon: TrendingUp },
    { id: 'financial' as TabType, label: 'Financial Literacy', icon: DollarSign },
    { id: 'scenarios' as TabType, label: 'Business Scenarios', icon: Briefcase },
    { id: 'trade' as TabType, label: 'Trade Agreements', icon: Network },
    { id: 'cultural' as TabType, label: 'Cross-Cultural Guide', icon: Globe },
    { id: 'assessment' as TabType, label: 'Assessment Tools', icon: FileText },
  ]
  // Exclude last sub-chatbot (Trade Agreements) from UI; data still from backend for rest
  const visibleTabs = tabs.filter((t) => t.id !== 'trade')

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
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-3xl font-bold">Business Studies Mentor</h1>
                  <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    <Star className="h-3 w-3" /> 4.9★
                  </span>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    <Lock className="inline h-3 w-3 mr-1" /> Premium
                  </span>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    <Globe className="inline h-3 w-3 mr-1" /> International Focus
                  </span>
                </div>
                <p className="mt-2 text-blue-100">
                  Advanced tools for teaching international business, entrepreneurship, economics, and financial literacy. 
                  Prepare students to compete globally and bring business opportunities to their country through 
                  comprehensive understanding of international standards, trade agreements, and cross-cultural business practices.
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
                  <option value="9-12">9-12</option>
                  <option value="11-12">11-12</option>
                  <option value="College">College</option>
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
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <label className="text-sm font-medium">Industry:</label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="bg-white/20 border border-white/30 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
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
          {/* International Standards Tab */}
          {activeTab === 'standards' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="h-6 w-6 text-blue-600" />
                  International Business Standards
                </h2>
                <p className="text-gray-600 mb-4">
                  Explore global business standards that enable international trade and business operations. 
                  Understand compliance requirements and benefits for global market access.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Standard
                    </label>
                    <select
                      value={selectedStandard}
                      onChange={(e) => setSelectedStandard(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option>ISO 9001</option>
                      <option>IFRS</option>
                      <option>WTO Trade Rules</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleExploreStandard}
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
                          Explore Standard
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {businessStandard && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{businessStandard.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          {businessStandard.organization}
                        </span>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                          {businessStandard.region}
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
                      <p className="text-gray-700">{businessStandard.description}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Key Principles</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {businessStandard.keyPrinciples.map((principle, i) => (
                            <li key={i}>{principle}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Application Areas</h4>
                        <div className="flex flex-wrap gap-2">
                          {businessStandard.applicationAreas.map((area, i) => (
                            <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Compliance Requirements</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {businessStandard.complianceRequirements.map((req, i) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Benefits</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {businessStandard.benefits.map((benefit, i) => (
                          <li key={i}>{benefit}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Case Studies</h4>
                      <div className="space-y-2">
                        {businessStandard.caseStudies.map((study, i) => (
                          <div key={i} className="bg-gray-50 p-3 rounded-lg">
                            <div className="font-semibold text-gray-900">{study.company}</div>
                            <div className="text-sm text-gray-600 mt-1">{study.scenario}</div>
                            <div className="text-sm text-gray-700 mt-1 font-medium">{study.outcome}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Entrepreneurship Tab */}
          {activeTab === 'entrepreneurship' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-purple-600" />
                  Entrepreneurship Framework
                </h2>
                <p className="text-gray-600 mb-4">
                  Comprehensive framework for teaching entrepreneurship with international considerations. 
                  Guide students through ideation, planning, and launch stages.
                </p>
                <button
                  onClick={handleGetEntrepreneurshipFramework}
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
                      Load Framework
                    </>
                  )}
                </button>
              </div>

              {entrepreneurshipFramework.length > 0 && (
                <div className="space-y-4">
                  {entrepreneurshipFramework.map((stage, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{stage.stage}</h3>
                          <p className="text-gray-600 mt-1">{stage.description}</p>
                        </div>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                          Stage {idx + 1}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Activities</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {stage.activities.map((activity, i) => (
                              <li key={i}>{activity}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Skills Developed</h4>
                          <div className="flex flex-wrap gap-2">
                            {stage.skills.map((skill, i) => (
                              <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-2">International Considerations</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {stage.internationalConsiderations.map((consideration, i) => (
                            <li key={i}>{consideration}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-4 grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Challenges</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            {stage.challenges.map((challenge, i) => (
                              <li key={i}>{challenge}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Success Factors</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            {stage.successFactors.map((factor, i) => (
                              <li key={i}>{factor}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Economics Tab */}
          {activeTab === 'economics' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                  Economic Concepts
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Concept
                    </label>
                    <select
                      value={selectedConcept}
                      onChange={(e) => setSelectedConcept(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option>Supply and Demand</option>
                      <option>Comparative Advantage</option>
                      <option>Exchange Rates</option>
                      <option>Market Structures</option>
                      <option>Economic Growth</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleGetEconomicConcept}
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
                          Get Concept
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {economicConcept && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{economicConcept.name}</h3>
                      <p className="text-gray-600 mt-1">{economicConcept.category}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      {economicConcept.category}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-700">{economicConcept.description}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Key Terms</h4>
                        <div className="flex flex-wrap gap-2">
                          {economicConcept.keyTerms.map((term, i) => (
                            <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              {term}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Real-World Examples</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {economicConcept.realWorldExamples.map((example, i) => (
                            <li key={i}>{example}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">International Implications</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {economicConcept.internationalImplications.map((implication, i) => (
                          <li key={i}>{implication}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Teaching Strategies</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {economicConcept.teachingStrategies.map((strategy, i) => (
                            <li key={i}>{strategy}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Case Studies</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {economicConcept.caseStudies.map((study, i) => (
                            <li key={i}>{study}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Financial Literacy Tab */}
          {activeTab === 'financial' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="h-6 w-6 text-amber-600" />
                  Financial Literacy Modules
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Topic
                    </label>
                    <select
                      value={financialTopic}
                      onChange={(e) => setFinancialTopic(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    >
                      <option>Personal Budgeting</option>
                      <option>Investment Basics</option>
                      <option>Credit & Debt</option>
                      <option>Retirement Planning</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleGenerateFinancialModule}
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
                          Generate Module
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {financialModule && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{financialModule.topic}</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Learning Objectives</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {financialModule.learningObjectives.map((obj, i) => (
                          <li key={i}>{obj}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Key Concepts</h4>
                        <div className="flex flex-wrap gap-2">
                          {financialModule.keyConcepts.map((concept, i) => (
                            <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              {concept}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Activities</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {financialModule.activities.map((activity, i) => (
                            <li key={i}>{activity}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">International Perspectives</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {financialModule.internationalPerspectives.map((perspective, i) => (
                          <li key={i}>{perspective}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Assessment</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {financialModule.assessment.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Business Scenarios Tab */}
          {activeTab === 'scenarios' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="h-6 w-6 text-indigo-600" />
                  Real-World Business Scenarios
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scenario Type
                    </label>
                    <select
                      value={scenarioType}
                      onChange={(e) => setScenarioType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option>Export Expansion</option>
                      <option>Startup Pitch</option>
                      <option>Market Entry</option>
                      <option>Joint Venture</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleGenerateScenario}
                      disabled={isGenerating}
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
                          Generate Scenario
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {businessScenario && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{businessScenario.title}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                          {businessScenario.difficulty}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          {businessScenario.industry}
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          {businessScenario.region}
                        </span>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                      <Download className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Scenario</h4>
                      <p className="text-gray-700">{businessScenario.scenario}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Learning Objectives</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {businessScenario.objectives.map((obj, i) => (
                          <li key={i}>{obj}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Questions</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {businessScenario.questions.map((q, i) => (
                          <li key={i}>{q}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Resources</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {businessScenario.resources.map((resource, i) => (
                            <li key={i}>{resource}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">International Elements</h4>
                        <div className="flex flex-wrap gap-2">
                          {businessScenario.internationalElements.map((element, i) => (
                            <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                              {element}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Expected Outcomes</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {businessScenario.expectedOutcomes.map((outcome, i) => (
                          <li key={i}>{outcome}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Trade Agreements Tab */}
          {activeTab === 'trade' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Network className="h-6 w-6 text-teal-600" />
                  International Trade Agreements
                </h2>
                <p className="text-gray-600 mb-4">
                  Explore major trade agreements that shape global commerce. Understand how these agreements 
                  create opportunities for international business and economic growth.
                </p>
                <button
                  onClick={handleGetTradeAgreements}
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
                      Load Trade Agreements
                    </>
                  )}
                </button>
              </div>

              {tradeAgreements.length > 0 && (
                <div className="space-y-4">
                  {tradeAgreements.map((agreement, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">{agreement.name}</h3>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-semibold">
                              {agreement.type}
                            </span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                              {agreement.countries.length} Countries
                            </span>
                          </div>
                        </div>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                          <Download className="h-5 w-5 text-gray-600" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Participating Countries</h4>
                          <div className="flex flex-wrap gap-2">
                            {agreement.countries.map((country, i) => (
                              <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                {country}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Key Provisions</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                              {agreement.keyProvisions.map((provision, i) => (
                                <li key={i}>{provision}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Benefits</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                              {agreement.benefits.map((benefit, i) => (
                                <li key={i}>{benefit}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Challenges</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                              {agreement.challenges.map((challenge, i) => (
                                <li key={i}>{challenge}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Impact</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                              {agreement.impact.map((impact, i) => (
                                <li key={i}>{impact}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Teaching Points</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {agreement.teachingPoints.map((point, i) => (
                              <li key={i}>{point}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Cross-Cultural Guide Tab */}
          {activeTab === 'cultural' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-6 border border-pink-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Globe className="h-6 w-6 text-pink-600" />
                  Cross-Cultural Business Guide
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Region
                    </label>
                    <select
                      value={culturalRegion}
                      onChange={(e) => setCulturalRegion(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    >
                      <option>Asia-Pacific</option>
                      <option>Middle East</option>
                      <option>Latin America</option>
                      <option>Europe</option>
                      <option>Africa</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleGetCulturalGuide}
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

              {culturalGuide && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{culturalGuide.region} Business Guide</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Business Practices</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {culturalGuide.businessPractices.map((practice, i) => (
                          <li key={i}>{practice}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Communication Styles</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {culturalGuide.communicationStyles.map((style, i) => (
                            <li key={i}>{style}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Negotiation Approaches</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {culturalGuide.negotiationApproaches.map((approach, i) => (
                            <li key={i}>{approach}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Cultural Considerations</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {culturalGuide.culturalConsiderations.map((consideration, i) => (
                          <li key={i}>{consideration}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Common Mistakes</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {culturalGuide.commonMistakes.map((mistake, i) => (
                            <li key={i}>{mistake}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Success Strategies</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {culturalGuide.successStrategies.map((strategy, i) => (
                            <li key={i}>{strategy}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Case Examples</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {culturalGuide.caseExamples.map((example, i) => (
                          <li key={i}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Assessment Tools Tab */}
          {activeTab === 'assessment' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-6 border border-violet-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="h-6 w-6 text-violet-600" />
                  Assessment & Evaluation Tools
                </h2>
                <p className="text-gray-600">
                  Comprehensive assessment tools for evaluating student understanding of international business concepts, 
                  entrepreneurship skills, and financial literacy.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-violet-600" />
                    Case Study Analysis Rubric
                  </h3>
                  <div className="space-y-3">
                    <div className="border-l-4 border-violet-500 pl-4">
                      <h4 className="font-semibold text-gray-900">Analysis Depth (25 points)</h4>
                      <p className="text-sm text-gray-600">Excellent: Comprehensive analysis with multiple perspectives</p>
                    </div>
                    <div className="border-l-4 border-violet-500 pl-4">
                      <h4 className="font-semibold text-gray-900">International Context (25 points)</h4>
                      <p className="text-sm text-gray-600">Excellent: Strong understanding of global business factors</p>
                    </div>
                    <div className="border-l-4 border-violet-500 pl-4">
                      <h4 className="font-semibold text-gray-900">Critical Thinking (25 points)</h4>
                      <p className="text-sm text-gray-600">Excellent: Sophisticated evaluation and recommendations</p>
                    </div>
                    <div className="border-l-4 border-violet-500 pl-4">
                      <h4 className="font-semibold text-gray-900">Communication (25 points)</h4>
                      <p className="text-sm text-gray-600">Excellent: Clear, professional, well-structured presentation</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-violet-600" />
                    Business Plan Evaluation
                  </h3>
                  <div className="space-y-3">
                    <div className="border-l-4 border-violet-500 pl-4">
                      <h4 className="font-semibold text-gray-900">Market Analysis (20 points)</h4>
                      <p className="text-sm text-gray-600">Includes global market opportunity assessment</p>
                    </div>
                    <div className="border-l-4 border-violet-500 pl-4">
                      <h4 className="font-semibold text-gray-900">Financial Projections (20 points)</h4>
                      <p className="text-sm text-gray-600">Realistic multi-currency financial model</p>
                    </div>
                    <div className="border-l-4 border-violet-500 pl-4">
                      <h4 className="font-semibold text-gray-900">International Strategy (20 points)</h4>
                      <p className="text-sm text-gray-600">Clear expansion and cultural adaptation plan</p>
                    </div>
                    <div className="border-l-4 border-violet-500 pl-4">
                      <h4 className="font-semibold text-gray-900">Feasibility (20 points)</h4>
                      <p className="text-sm text-gray-600">Realistic assessment of challenges and opportunities</p>
                    </div>
                    <div className="border-l-4 border-violet-500 pl-4">
                      <h4 className="font-semibold text-gray-900">Presentation (20 points)</h4>
                      <p className="text-sm text-gray-600">Professional pitch with visual aids</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Coins className="h-5 w-5 text-violet-600" />
                    Financial Literacy Assessment
                  </h3>
                  <div className="space-y-3">
                    <div className="border-l-4 border-violet-500 pl-4">
                      <h4 className="font-semibold text-gray-900">Budget Creation (30 points)</h4>
                      <p className="text-sm text-gray-600">Realistic budget with international cost considerations</p>
                    </div>
                    <div className="border-l-4 border-violet-500 pl-4">
                      <h4 className="font-semibold text-gray-900">Investment Understanding (30 points)</h4>
                      <p className="text-sm text-gray-600">Knowledge of global investment options and risks</p>
                    </div>
                    <div className="border-l-4 border-violet-500 pl-4">
                      <h4 className="font-semibold text-gray-900">Financial Decision Making (40 points)</h4>
                      <p className="text-sm text-gray-600">Ability to make informed financial decisions with global perspective</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-violet-600" />
                    Cross-Cultural Competency
                  </h3>
                  <div className="space-y-3">
                    <div className="border-l-4 border-violet-500 pl-4">
                      <h4 className="font-semibold text-gray-900">Cultural Awareness (25 points)</h4>
                      <p className="text-sm text-gray-600">Understanding of cultural differences and business practices</p>
                    </div>
                    <div className="border-l-4 border-violet-500 pl-4">
                      <h4 className="font-semibold text-gray-900">Communication Skills (25 points)</h4>
                      <p className="text-sm text-gray-600">Effective cross-cultural communication strategies</p>
                    </div>
                    <div className="border-l-4 border-violet-500 pl-4">
                      <h4 className="font-semibold text-gray-900">Adaptation Strategies (25 points)</h4>
                      <p className="text-sm text-gray-600">Ability to adapt business approaches to different cultures</p>
                    </div>
                    <div className="border-l-4 border-violet-500 pl-4">
                      <h4 className="font-semibold text-gray-900">Case Application (25 points)</h4>
                      <p className="text-sm text-gray-600">Application of cultural knowledge to real scenarios</p>
                    </div>
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

export default BusinessStudiesMentor

