import { useState } from 'react'
import {
  Brain,
  Shield,
  Code,
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
  Target,
  Award,
  TrendingUp,
  AlertTriangle,
  Users,
  BookOpen,
  Zap,
  ExternalLink,
  GraduationCap,
  Info,
  Copy,
  PlayCircle,
} from 'lucide-react'
import {
  getGradeLevels,
  getDifficultyLevels,
  AIConcept,
  EthicalAIPrinciple,
  MLProject,
  AIStandard,
  AIEthicsFramework,
} from '../../utils/aiMlUtils'
import * as chatbotApi from '../../api/chatbots'
import { useSnackbar } from '../../hooks/useSnackbar'
import { useCapabilityCreditGate } from '../../hooks/useCapabilityCreditGate'
import { useChatbotHistorySession } from '../../hooks/useChatbotHistorySession'
import NoCreditsCard from '../../components/NoCreditsCard'
import {
  mapAiConceptsResult,
  mapEthicalAiToPrinciples,
  mapEthicalAiToFrameworks,
  mapMlProjectsResult,
  mapAiStandardsResult,
} from '../../utils/aiMlAdapters'

const CHATBOT_SLUG = 'ai-machine-learning-educator'

type TabType = 'ai-concepts' | 'ethical-ai' | 'ml-projects' | 'standards' | 'resources'

const AIMachineLearningEducator = () => {
  const { toast } = useSnackbar()
  const { creditError, clearCreditError, captureApiError, runWithCredits } = useCapabilityCreditGate()
  const [activeTab, setActiveTab] = useState<TabType>('ai-concepts')
  const [gradeLevel, setGradeLevel] = useState('High School (9-12)')
  const [difficulty, setDifficulty] = useState('Beginner')
  const [isGenerating, setIsGenerating] = useState(false)

  // AI Concepts State
  const [aiConcepts, setAiConcepts] = useState<AIConcept[]>([])
  const [selectedConcept, setSelectedConcept] = useState<AIConcept | null>(null)

  // Ethical AI State
  const [ethicalPrinciples, setEthicalPrinciples] = useState<EthicalAIPrinciple[]>([])
  const [selectedPrinciple, setSelectedPrinciple] = useState<EthicalAIPrinciple | null>(null)
  const [ethicsFrameworks, setEthicsFrameworks] = useState<AIEthicsFramework[]>([])
  const [selectedFramework, setSelectedFramework] = useState<AIEthicsFramework | null>(null)

  // ML Projects State
  const [mlProjects, setMlProjects] = useState<MLProject[]>([])
  const [selectedProject, setSelectedProject] = useState<MLProject | null>(null)

  // Standards State
  const [aiStandards, setAiStandards] = useState<AIStandard[]>([])
  const [selectedStandard, setSelectedStandard] = useState<AIStandard | null>(null)

  const AI_ML_CAP_TABS: Record<string, TabType> = {
    ai_concepts: 'ai-concepts',
    ethical_ai: 'ethical-ai',
    ml_projects: 'ml-projects',
    ai_standards: 'standards',
  }

  const { conversationIdForActiveTab, pinFromResponse } = useChatbotHistorySession({
    slug: CHATBOT_SLUG,
    activeTab,
    capabilityKeyToTab: AI_ML_CAP_TABS,
    onRestore: async ({ tabKey, assistantContent, assistantMetadata }) => {
      const cap = assistantMetadata?.capability_key as string | undefined
      const tab: TabType =
        tabKey === 'ai-concepts' ||
        tabKey === 'ethical-ai' ||
        tabKey === 'ml-projects' ||
        tabKey === 'standards' ||
        tabKey === 'resources'
          ? tabKey
          : cap && AI_ML_CAP_TABS[cap]
            ? AI_ML_CAP_TABS[cap]
            : 'ai-concepts'
      setActiveTab(tab)
      try {
        const raw = JSON.parse(assistantContent) as Record<string, unknown>
        setAiConcepts([])
        setEthicalPrinciples([])
        setEthicsFrameworks([])
        setMlProjects([])
        setAiStandards([])
        if (tab === 'ai-concepts') setAiConcepts(mapAiConceptsResult(raw, gradeLevel))
        else if (tab === 'ethical-ai') {
          try {
            setEthicalPrinciples(mapEthicalAiToPrinciples(raw))
          } catch {
            /* ignore */
          }
          try {
            setEthicsFrameworks(mapEthicalAiToFrameworks(raw))
          } catch {
            /* ignore */
          }
        } else if (tab === 'ml-projects') setMlProjects(mapMlProjectsResult(raw, gradeLevel))
        else if (tab === 'standards') setAiStandards(mapAiStandardsResult(raw, gradeLevel))
      } catch {
        toast.info('Could not restore saved output from History.')
      }
    },
  })

  const gradeLevels = getGradeLevels()
  const difficultyLevels = getDifficultyLevels()

  // Load AI Concepts
  const handleLoadAIConcepts = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'ai_concepts', {
        input: ' ',
        input_type: 'text',
        parameters: {
          grade_level: gradeLevel,
          difficulty,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setAiConcepts(mapAiConceptsResult(response.result, gradeLevel))
      pinFromResponse(response.conversation_id)
      toast.success('AI concepts loaded')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to load AI concepts'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Load Ethical AI Principles
  const handleLoadEthicalPrinciples = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'ethical_ai', {
        input: ' ',
        input_type: 'text',
        parameters: {
          grade_level: gradeLevel,
          difficulty,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setEthicalPrinciples(mapEthicalAiToPrinciples(response.result))
      pinFromResponse(response.conversation_id)
      toast.success('Ethical principles loaded')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to load ethical principles'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Load Ethics Frameworks
  const handleLoadEthicsFrameworks = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'ethical_ai', {
        input: ' ',
        input_type: 'text',
        parameters: {
          grade_level: gradeLevel,
          difficulty,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setEthicsFrameworks(mapEthicalAiToFrameworks(response.result))
      pinFromResponse(response.conversation_id)
      toast.success('Ethics frameworks loaded')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to load ethics frameworks'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Load ML Projects
  const handleLoadMLProjects = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'ml_projects', {
        input: ' ',
        input_type: 'text',
        parameters: {
          grade_level: gradeLevel,
          difficulty,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setMlProjects(mapMlProjectsResult(response.result, gradeLevel))
      pinFromResponse(response.conversation_id)
      toast.success('ML projects loaded')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to load ML projects'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Load AI Standards
  const handleLoadStandards = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'ai_standards', {
        input: ' ',
        input_type: 'text',
        parameters: {
          grade_level: gradeLevel,
          difficulty,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setAiStandards(mapAiStandardsResult(response.result, gradeLevel))
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

  const tabs = [
    { id: 'ai-concepts' as TabType, label: 'AI Concepts', icon: Brain },
    { id: 'ethical-ai' as TabType, label: 'Ethical AI', icon: Shield },
    { id: 'ml-projects' as TabType, label: 'ML Projects', icon: Code },
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
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-3xl font-bold">AI & Machine Learning Educator</h1>
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
                  Comprehensive AI and ML education aligned with international standards (ISTE, CSTA, UNESCO, EU AI Act, IEEE). 
                  Help students understand AI concepts, explore ethical implications, and build hands-on ML projects 
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
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <label className="text-sm font-medium">Difficulty:</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="bg-white/20 border border-white/30 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  {difficultyLevels.map(level => (
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
          {/* AI Concepts Tab */}
          {activeTab === 'ai-concepts' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Brain className="h-6 w-6 text-purple-600" />
                  AI Concepts for Students
                </h2>
                <p className="text-gray-700 mb-4">
                  Explore fundamental AI concepts tailored to different grade levels. Each concept includes key points, 
                  examples, activities, and real-world applications.
                </p>
                <button
                  onClick={handleLoadAIConcepts}
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
                      Load AI Concepts
                    </>
                  )}
                </button>
              </div>

              {aiConcepts.length > 0 && (
                <div className="space-y-4">
                  {aiConcepts
                    .filter(concept => {
                      if (gradeLevel === 'Elementary (K-5)') return concept.gradeLevel.includes('Elementary')
                      if (gradeLevel === 'Middle School (6-8)') return concept.gradeLevel.includes('Middle')
                      if (gradeLevel === 'High School (9-12)') return concept.gradeLevel.includes('High')
                      return true
                    })
                    .map((concept, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm cursor-pointer hover:border-purple-300 transition"
                        onClick={() => setSelectedConcept(selectedConcept?.id === concept.id ? null : concept)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900">{concept.concept}</h3>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
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
                              <h4 className="font-semibold text-gray-900 mb-2">Key Points</h4>
                              <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {concept.keyPoints.map((point, i) => (
                                  <li key={i}>{point}</li>
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
                              <h4 className="font-semibold text-gray-900 mb-2">Common Misconceptions</h4>
                              <div className="flex flex-wrap gap-2">
                                {concept.misconceptions.map((misconception, i) => (
                                  <span key={i} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                    {misconception}
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

          {/* Ethical AI Tab */}
          {activeTab === 'ethical-ai' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="h-6 w-6 text-red-600" />
                  Ethical AI Discussions
                </h2>
                <p className="text-gray-700 mb-4">
                  Explore ethical principles, frameworks, and case studies to help students understand the 
                  social and ethical implications of AI systems.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={handleLoadEthicalPrinciples}
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5" />
                        Load Ethical Principles
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleLoadEthicsFrameworks}
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
                        Load Ethics Frameworks
                      </>
                    )}
                  </button>
                </div>
              </div>

              {ethicalPrinciples.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">Ethical Principles</h3>
                  {ethicalPrinciples.map((principle, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm cursor-pointer hover:border-red-300 transition"
                      onClick={() => setSelectedPrinciple(selectedPrinciple?.id === principle.id ? null : principle)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900">{principle.principle}</h3>
                        </div>
                        <Eye className="h-5 w-5 text-gray-400" />
                      </div>
                      <p className="text-gray-700">{principle.description}</p>
                      <p className="text-sm text-gray-600 mt-2"><strong>Importance:</strong> {principle.importance}</p>

                      {selectedPrinciple?.id === principle.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Examples</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                              {principle.examples.map((example, i) => (
                                <li key={i}>{example}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Discussion Questions</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                              {principle.discussionQuestions.map((question, i) => (
                                <li key={i}>{question}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Case Studies</h4>
                            <div className="flex flex-wrap gap-2">
                              {principle.caseStudies.map((study, i) => (
                                <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                  {study}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Standards Alignment</h4>
                            <div className="flex flex-wrap gap-2">
                              {principle.standardsAlignment.map((standard, i) => (
                                <span key={i} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
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

              {ethicsFrameworks.length > 0 && (
                <div className="space-y-4 mt-6">
                  <h3 className="text-lg font-bold text-gray-900">Ethics Frameworks</h3>
                  {ethicsFrameworks.map((framework, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm cursor-pointer hover:border-orange-300 transition"
                      onClick={() => setSelectedFramework(selectedFramework?.id === framework.id ? null : framework)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900">{framework.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{framework.organization}</p>
                        </div>
                        <Eye className="h-5 w-5 text-gray-400" />
                      </div>
                      <p className="text-gray-700">{framework.description}</p>

                      {selectedFramework?.id === framework.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Principles</h4>
                            {framework.principles.map((principle, i) => (
                              <div key={i} className="border-l-4 border-orange-500 pl-4 mb-3">
                                <h5 className="font-semibold text-gray-900">{principle.principle}</h5>
                                <p className="text-sm text-gray-700 mt-1">{principle.description}</p>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 mt-2">
                                  {principle.examples.map((example, j) => (
                                    <li key={j}>{example}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ML Projects Tab */}
          {activeTab === 'ml-projects' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 border border-green-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Code className="h-6 w-6 text-green-600" />
                  Hands-On ML Projects
                </h2>
                <p className="text-gray-700 mb-4">
                  Step-by-step machine learning projects from beginner to advanced. Each project includes 
                  learning objectives, tools, datasets, and assessment criteria.
                </p>
                <button
                  onClick={handleLoadMLProjects}
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
                      Load ML Projects
                    </>
                  )}
                </button>
              </div>

              {mlProjects.length > 0 && (
                <div className="space-y-4">
                  {mlProjects
                    .filter(project => {
                      if (difficulty === 'Beginner') return project.difficulty === 'Beginner'
                      if (difficulty === 'Intermediate') return project.difficulty === 'Intermediate'
                      if (difficulty === 'Advanced') return project.difficulty === 'Advanced'
                      return true
                    })
                    .map((project, idx) => (
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
                                {project.difficulty}
                              </span>
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                {project.gradeLevel}
                              </span>
                              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                                {project.duration}
                              </span>
                            </div>
                          </div>
                          <Eye className="h-5 w-5 text-gray-400" />
                        </div>
                        <p className="text-gray-700">{project.description}</p>

                        {selectedProject?.id === project.id && (
                          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Learning Objectives</h4>
                              <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {project.learningObjectives.map((obj, i) => (
                                  <li key={i}>{obj}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Tools</h4>
                                <div className="flex flex-wrap gap-2">
                                  {project.tools.map((tool, i) => (
                                    <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                      {tool}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Datasets</h4>
                                <ul className="list-disc list-inside space-y-1 text-gray-700">
                                  {project.datasets.map((dataset, i) => (
                                    <li key={i}>{dataset}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">Project Steps</h4>
                              <div className="space-y-3">
                                {project.steps.map((step, idx) => (
                                  <div key={idx} className="border-l-4 border-green-500 pl-4">
                                    <div className="flex items-center justify-between mb-1">
                                      <h5 className="font-semibold text-gray-900">{step.step}</h5>
                                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                                        {step.duration}
                                      </span>
                                    </div>
                                    <p className="text-gray-700">{step.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Real-World Connection</h4>
                              <p className="text-gray-700">{project.realWorldConnection}</p>
                            </div>

                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Extensions</h4>
                              <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {project.extensions.map((extension, i) => (
                                  <li key={i}>{extension}</li>
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
                  <CheckCircle className="h-6 w-6 text-indigo-600" />
                  International AI Education Standards
                </h2>
                <p className="text-gray-700 mb-4">
                  Access comprehensive international standards for AI education from leading organizations worldwide.
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

              {aiStandards.length > 0 && (
                <div className="space-y-4">
                  {aiStandards.map((standard, idx) => (
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
                  AI & ML Education Resources
                </h2>
                <p className="text-gray-600">
                  Curated resources for AI concepts, ethical AI, machine learning projects, and standards.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    AI Concepts & Learning
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-purple-600" />
                      <span>AI4K12.org - AI Education Guidelines</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-purple-600" />
                      <span>Machine Learning for Kids</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-purple-600" />
                      <span>Teachable Machine</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-purple-600" />
                      <span>Scratch for ML</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-600" />
                    Ethical AI Resources
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-red-600" />
                      <span>Partnership on AI</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-red-600" />
                      <span>Algorithmic Justice League</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-red-600" />
                      <span>AI Fairness 360 Toolkit</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-red-600" />
                      <span>UNESCO AI Ethics</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Code className="h-5 w-5 text-green-600" />
                    ML Projects & Tools
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-green-600" />
                      <span>Google Colab</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-green-600" />
                      <span>Kaggle Learn</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-green-600" />
                      <span>TensorFlow Playground</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-green-600" />
                      <span>Fast.ai</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-indigo-600" />
                    Standards & Frameworks
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-indigo-600" />
                      <span>ISTE AI Standards</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-indigo-600" />
                      <span>CSTA Computer Science Standards</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-indigo-600" />
                      <span>EU AI Act</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-indigo-600" />
                      <span>IEEE Ethically Aligned Design</span>
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

export default AIMachineLearningEducator



