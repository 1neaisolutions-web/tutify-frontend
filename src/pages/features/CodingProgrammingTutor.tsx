import { useState } from 'react'
import {
  Code,
  Target,
  Bug,
  Lightbulb,
  Brain,
  Trophy,
  FileCheck,
  Sparkles,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Clock,
  Star,
  Lock,
  Layers,
  Zap,
  BookOpen,
  PlayCircle,
  FileText,
  BarChart3,
  Award,
  Globe,
  Settings,
  ChevronRight,
  Copy,
  ExternalLink,
} from 'lucide-react'
import {
  getCompetitions,
  getProgrammingLanguages,
  CompetitionProblem,
  AlgorithmExplanation,
  DebuggingStrategy,
  ProjectMilestone,
  ComputationalThinkingFramework,
  CompetitionRoadmap,
  StandardsAlignment,
} from '../../utils/codingUtils'
import * as chatbotApi from '../../api/chatbots'
import { useSnackbar } from '../../hooks/useSnackbar'
import { useCapabilityCreditGate } from '../../hooks/useCapabilityCreditGate'
import { useChatbotHistorySession } from '../../hooks/useChatbotHistorySession'
import NoCreditsCard from '../../components/NoCreditsCard'
import {
  mapCompetitionAnalyzerToProblem,
  mapAlgorithmTutorResult,
  mapDebuggingAssistantResult,
  mapProjectPlannerToMilestones,
  mapComputationalThinkingResult,
  mapCompetitionRoadmapResult,
  mapCodingStandardsAlignmentResult,
} from '../../utils/codingTutorAdapters'

const CHATBOT_SLUG = 'coding-programming-tutor'

type TabType = 'competition' | 'algorithm' | 'debugging' | 'pbl' | 'thinking' | 'roadmap' | 'standards'

const CodingProgrammingTutor = () => {
  const { toast } = useSnackbar()
  const { creditError, clearCreditError, captureApiError, runWithCredits } = useCapabilityCreditGate()
  const [activeTab, setActiveTab] = useState<TabType>('competition')
  const [gradeLevel, setGradeLevel] = useState('9-12')
  const [programmingLanguage, setProgrammingLanguage] = useState('python')
  const [selectedCompetition, setSelectedCompetition] = useState('codeforces')
  const [isGenerating, setIsGenerating] = useState(false)

  // Competition Analyzer State
  const [problemText, setProblemText] = useState('')
  const [competitionProblem, setCompetitionProblem] = useState<CompetitionProblem | null>(null)

  // Algorithm Tutor State
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('Binary Search')
  const [algorithmExplanation, setAlgorithmExplanation] = useState<AlgorithmExplanation | null>(null)

  // Debugging Assistant State
  const [errorType, setErrorType] = useState('Index Out of Bounds')
  const [codeInput, setCodeInput] = useState('')
  const [debuggingStrategy, setDebuggingStrategy] = useState<DebuggingStrategy | null>(null)

  // PBL Planner State
  const [projectType, setProjectType] = useState('Web Application')
  const [projectDuration, setProjectDuration] = useState('8 weeks')
  const [projectMilestones, setProjectMilestones] = useState<ProjectMilestone[]>([])

  // Computational Thinking State
  const [computationalThinking, setComputationalThinking] = useState<ComputationalThinkingFramework | null>(null)

  // Competition Roadmap State
  const [currentLevel, setCurrentLevel] = useState('beginner')
  const [targetLevel, setTargetLevel] = useState('intermediate')
  const [roadmap, setRoadmap] = useState<CompetitionRoadmap | null>(null)

  // Standards Alignment State
  const [standardsFramework, setStandardsFramework] = useState('CSTA')
  const [contentInput, setContentInput] = useState('')
  const [standardsAlignment, setStandardsAlignment] = useState<StandardsAlignment | null>(null)

  const CODING_CAP_TABS: Record<string, TabType> = {
    competition_analyzer: 'competition',
    algorithm_tutor: 'algorithm',
    debugging_assistant: 'debugging',
    project_planner: 'pbl',
    computational_thinking: 'thinking',
    competition_roadmap: 'roadmap',
    standards_alignment: 'standards',
  }

  const { conversationIdForActiveTab, pinFromResponse } = useChatbotHistorySession({
    slug: CHATBOT_SLUG,
    activeTab,
    capabilityKeyToTab: CODING_CAP_TABS,
    onRestore: async ({ tabKey, userContent, assistantContent, assistantMetadata }) => {
      const cap = assistantMetadata?.capability_key as string | undefined
      const validTabs: TabType[] = ['competition', 'algorithm', 'debugging', 'pbl', 'thinking', 'roadmap', 'standards']
      const tab: TabType =
        validTabs.includes(tabKey as TabType)
          ? (tabKey as TabType)
          : cap && CODING_CAP_TABS[cap]
            ? CODING_CAP_TABS[cap]
            : 'competition'
      setActiveTab(tab)
      try {
        const raw = JSON.parse(assistantContent) as Record<string, unknown>
        setCompetitionProblem(null)
        setAlgorithmExplanation(null)
        setDebuggingStrategy(null)
        setProjectMilestones([])
        setComputationalThinking(null)
        setRoadmap(null)
        setStandardsAlignment(null)
        const u = userContent?.trim() ?? ''
        if (tab === 'competition') {
          if (u) setProblemText(u)
          setCompetitionProblem(mapCompetitionAnalyzerToProblem(raw, selectedCompetition, u || problemText))
        } else if (tab === 'algorithm') {
          setAlgorithmExplanation(mapAlgorithmTutorResult(raw, programmingLanguage))
        } else if (tab === 'debugging') {
          if (u) setCodeInput(u)
          setDebuggingStrategy(mapDebuggingAssistantResult(raw))
        } else if (tab === 'pbl') {
          setProjectMilestones(mapProjectPlannerToMilestones(raw))
        } else if (tab === 'thinking') {
          setComputationalThinking(mapComputationalThinkingResult(raw))
        } else if (tab === 'roadmap') {
          setRoadmap(mapCompetitionRoadmapResult(raw, selectedCompetition, targetLevel))
        } else if (tab === 'standards') {
          if (u) setContentInput(u)
          setStandardsAlignment(mapCodingStandardsAlignmentResult(raw, standardsFramework, gradeLevel))
        }
      } catch {
        toast.error('Could not restore saved output from History.')
      }
    },
  })

  const competitions = getCompetitions()
  const languages = getProgrammingLanguages()

  // Competition Problem Analysis
  const handleAnalyzeProblem = async () => {
    if (!problemText.trim()) return
    setIsGenerating(true)
    try {
      const text = problemText.trim()
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'competition_analyzer', {
        input: text,
        input_type: 'text',
        parameters: {
          grade_level: gradeLevel,
          language: programmingLanguage,
          competition: selectedCompetition,
          problem_description: text,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setCompetitionProblem(mapCompetitionAnalyzerToProblem(response.result, selectedCompetition, text))
      pinFromResponse(response.conversation_id)
      toast.success('Problem analyzed')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to analyze problem'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Algorithm Explanation
  const handleGetAlgorithm = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'algorithm_tutor', {
        input: ' ',
        input_type: 'text',
        parameters: {
          grade_level: gradeLevel,
          language: programmingLanguage,
          competition: selectedCompetition,
          select_algorithm: selectedAlgorithm,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setAlgorithmExplanation(mapAlgorithmTutorResult(response.result, programmingLanguage))
      pinFromResponse(response.conversation_id)
      toast.success('Algorithm explanation loaded')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to load algorithm'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Debugging Strategy
  const handleGetDebuggingStrategy = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'debugging_assistant', {
        input: codeInput.trim() || ' ',
        input_type: 'text',
        parameters: {
          grade_level: gradeLevel,
          language: programmingLanguage,
          competition: selectedCompetition,
          error_type: errorType,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setDebuggingStrategy(mapDebuggingAssistantResult(response.result))
      pinFromResponse(response.conversation_id)
      toast.success('Debugging guidance loaded')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to load debugging strategy'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate Project Plan
  const handleGenerateProject = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'project_planner', {
        input: projectType,
        input_type: 'text',
        parameters: {
          grade_level: gradeLevel,
          language: programmingLanguage,
          competition: selectedCompetition,
          project_type: projectType,
          duration: projectDuration,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setProjectMilestones(mapProjectPlannerToMilestones(response.result))
      pinFromResponse(response.conversation_id)
      toast.success('Project plan generated')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to generate project plan'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Get Computational Thinking Framework
  const handleGetComputationalThinking = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'computational_thinking', {
        input: ' ',
        input_type: 'text',
        parameters: {
          grade_level: gradeLevel,
          language: programmingLanguage,
          competition: selectedCompetition,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setComputationalThinking(mapComputationalThinkingResult(response.result))
      pinFromResponse(response.conversation_id)
      toast.success('Computational thinking activities loaded')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to load computational thinking content'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate Competition Roadmap
  const handleGenerateRoadmap = async () => {
    setIsGenerating(true)
    try {
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'competition_roadmap', {
        input: ' ',
        input_type: 'text',
        parameters: {
          grade_level: gradeLevel,
          language: programmingLanguage,
          competition: selectedCompetition,
          current_level: currentLevel,
          target_level: targetLevel,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setRoadmap(mapCompetitionRoadmapResult(response.result, selectedCompetition, targetLevel))
      pinFromResponse(response.conversation_id)
      toast.success('Roadmap generated')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to generate roadmap'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  // Check Standards Alignment
  const handleCheckStandards = async () => {
    if (!contentInput.trim()) return
    setIsGenerating(true)
    try {
      const content = contentInput.trim()
      const response = await runWithCredits(chatbotApi.executeCapability(CHATBOT_SLUG, 'standards_alignment', {
        input: content,
        input_type: 'text',
        parameters: {
          grade_level: gradeLevel,
          language: programmingLanguage,
          competition: selectedCompetition,
          standards_framework: standardsFramework,
          content_to_analyze: content,
        },
        conversation_id: conversationIdForActiveTab ?? undefined,
      }))
      if (response == null) return
      setStandardsAlignment(mapCodingStandardsAlignmentResult(response.result, standardsFramework, gradeLevel))
      pinFromResponse(response.conversation_id)
      toast.success('Standards alignment analyzed')
    } catch (error: unknown) {
      const err = error as { detail?: string; message?: string; status?: number }
      const msg = err?.detail || err?.message || 'Failed to analyze standards alignment'
      toast.error(msg)
      if (err?.status === 403 || String(msg).includes('Premium')) {
        toast.info('Upgrade to Premium to use this feature', { duration: 5000 })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const tabs = [
    { id: 'competition' as TabType, label: 'Competition Analyzer', icon: Trophy },
    { id: 'algorithm' as TabType, label: 'Algorithm Tutor', icon: Code },
    { id: 'debugging' as TabType, label: 'Debugging Assistant', icon: Bug },
    { id: 'pbl' as TabType, label: 'Project Planner', icon: Lightbulb },
    { id: 'thinking' as TabType, label: 'Computational Thinking', icon: Brain },
    { id: 'roadmap' as TabType, label: 'Competition Roadmap', icon: Target },
    { id: 'standards' as TabType, label: 'Standards Alignment', icon: FileCheck },
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
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Code className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-3xl font-bold">Coding & Programming Tutor</h1>
                  <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    <Star className="h-3 w-3" /> 4.9★
                  </span>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    <Lock className="inline h-3 w-3 mr-1" /> Premium
                  </span>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    <Globe className="inline h-3 w-3 mr-1" /> Global Competitions
                  </span>
                </div>
                <p className="mt-2 text-indigo-100">
                  Advanced tools for teaching coding and preparing students for international competitions. 
                  Features competition problem analysis, algorithm explanations, debugging strategies, 
                  project-based learning, and standards alignment.
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
                <label className="text-sm font-medium">Language:</label>
                <select
                  value={programmingLanguage}
                  onChange={(e) => setProgrammingLanguage(e.target.value)}
                  className="bg-white/20 border border-white/30 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  {languages.map(lang => (
                    <option key={lang.id} value={lang.id}>{lang.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <label className="text-sm font-medium">Competition:</label>
                <select
                  value={selectedCompetition}
                  onChange={(e) => setSelectedCompetition(e.target.value)}
                  className="bg-white/20 border border-white/30 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  {competitions.map(comp => (
                    <option key={comp.id} value={comp.id}>{comp.name}</option>
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
                      ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
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
          {/* Competition Analyzer Tab */}
          {activeTab === 'competition' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-purple-600" />
                  Competition Problem Analyzer
                </h2>
                <p className="text-gray-600 mb-4">
                  Analyze competition problems from major platforms. Get solution approaches, 
                  algorithm recommendations, and practice suggestions.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Problem Description
                    </label>
                    <textarea
                      value={problemText}
                      onChange={(e) => setProblemText(e.target.value)}
                      placeholder="Paste the competition problem description here..."
                      className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={handleAnalyzeProblem}
                    disabled={!problemText.trim() || isGenerating}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5" />
                        Analyze Problem
                      </>
                    )}
                  </button>
                </div>
              </div>

              {competitionProblem && (
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{competitionProblem.title}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                            {competitionProblem.competition}
                          </span>
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                            {competitionProblem.difficulty}
                          </span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            {competitionProblem.category}
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
                        <p className="text-gray-700">{competitionProblem.description}</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Constraints</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {competitionProblem.constraints.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Sample Input</h4>
                          <pre className="bg-gray-50 p-3 rounded border text-sm">
                            {competitionProblem.sampleInput.join('\n')}
                          </pre>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Solution Approach</h4>
                        <ol className="list-decimal list-inside space-y-2 text-gray-700">
                          {competitionProblem.solutionApproach.map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ol>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Algorithms</h4>
                          <div className="flex flex-wrap gap-2">
                            {competitionProblem.algorithms.map((alg, i) => (
                              <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                {alg}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Data Structures</h4>
                          <div className="flex flex-wrap gap-2">
                            {competitionProblem.dataStructures.map((ds, i) => (
                              <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                {ds}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                        <div>
                          <span className="text-sm text-gray-500">Time Complexity</span>
                          <p className="font-semibold text-gray-900">{competitionProblem.timeComplexity}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Space Complexity</span>
                          <p className="font-semibold text-gray-900">{competitionProblem.spaceComplexity}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Algorithm Tutor Tab */}
          {activeTab === 'algorithm' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Code className="h-6 w-6 text-blue-600" />
                  Algorithm & Data Structure Tutor
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Algorithm
                    </label>
                    <select
                      value={selectedAlgorithm}
                      onChange={(e) => setSelectedAlgorithm(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Binary Search</option>
                      <option>Quick Sort</option>
                      <option>Merge Sort</option>
                      <option>BFS/DFS</option>
                      <option>Dijkstra's Algorithm</option>
                      <option>Dynamic Programming</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleGetAlgorithm}
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
                          Get Explanation
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {algorithmExplanation && (
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{algorithmExplanation.name}</h3>
                        <p className="text-gray-600 mt-1">{algorithmExplanation.category}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-xs text-gray-500">Time</span>
                          <p className="font-semibold text-gray-900">{algorithmExplanation.timeComplexity}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-500">Space</span>
                          <p className="font-semibold text-gray-900">{algorithmExplanation.spaceComplexity}</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{algorithmExplanation.description}</p>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Use Cases</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {algorithmExplanation.useCases.map((use, i) => (
                            <li key={i}>{use}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Code Example ({programmingLanguage})</h4>
                        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                          <pre className="text-sm">
                            <code>
                              {algorithmExplanation.codeExample.find(e => e.language === programmingLanguage)?.code ||
                               algorithmExplanation.codeExample[0]?.code}
                            </code>
                          </pre>
                        </div>
                        <button className="mt-2 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                          <Copy className="h-4 w-4" />
                          Copy Code
                        </button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Common Mistakes</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {algorithmExplanation.commonMistakes.map((mistake, i) => (
                              <li key={i}>{mistake}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Optimization Tips</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {algorithmExplanation.optimizationTips.map((tip, i) => (
                              <li key={i}>{tip}</li>
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

          {/* Debugging Assistant Tab */}
          {activeTab === 'debugging' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Bug className="h-6 w-6 text-red-600" />
                  Debugging Assistant
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Error Type
                    </label>
                    <select
                      value={errorType}
                      onChange={(e) => setErrorType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    >
                      <option>Index Out of Bounds</option>
                      <option>Null Pointer Exception</option>
                      <option>Time Limit Exceeded</option>
                      <option>Wrong Answer</option>
                      <option>Runtime Error</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleGetDebuggingStrategy}
                      disabled={isGenerating}
                      className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-5 w-5 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />
                          Get Strategy
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code to Debug (Optional)
                  </label>
                  <textarea
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    placeholder="Paste your code here for analysis..."
                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 font-mono text-sm"
                  />
                </div>
              </div>

              {debuggingStrategy && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{debuggingStrategy.errorType}</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Symptoms</h4>
                      <div className="flex flex-wrap gap-2">
                        {debuggingStrategy.symptoms.map((symptom, i) => (
                          <span key={i} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Common Causes</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {debuggingStrategy.commonCauses.map((cause, i) => (
                          <li key={i}>{cause}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Step-by-Step Approach</h4>
                      <ol className="list-decimal list-inside space-y-2 text-gray-700">
                        {debuggingStrategy.stepByStepApproach.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Recommended Tools</h4>
                        <div className="flex flex-wrap gap-2">
                          {debuggingStrategy.tools.map((tool, i) => (
                            <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Prevention Tips</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {debuggingStrategy.preventionTips.map((tip, i) => (
                            <li key={i}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Example Fix</h4>
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                        <pre className="text-sm">
                          <code>{debuggingStrategy.exampleFix}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Project-Based Learning Tab */}
          {activeTab === 'pbl' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-green-600" />
                  Project-Based Learning Planner
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Type
                    </label>
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option>Web Application</option>
                      <option>Game Development</option>
                      <option>Mobile App</option>
                      <option>Data Science Project</option>
                      <option>AI/ML Project</option>
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
                      <option>4 weeks</option>
                      <option>6 weeks</option>
                      <option>8 weeks</option>
                      <option>12 weeks</option>
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
                          Generate Plan
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {projectMilestones.length > 0 && (
                <div className="space-y-4">
                  {projectMilestones.map((milestone, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700 font-bold">
                              {milestone.milestone}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{milestone.title}</h3>
                              <p className="text-gray-600">{milestone.description}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          {milestone.estimatedTime}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Deliverables</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {milestone.deliverables.map((del, i) => (
                              <li key={i}>{del}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Skills Developed</h4>
                          <div className="flex flex-wrap gap-2">
                            {milestone.skills.map((skill, i) => (
                              <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-2">Resources</h4>
                        <div className="flex flex-wrap gap-2">
                          {milestone.resources.map((resource, i) => (
                            <a
                              key={i}
                              href="#"
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-200 transition flex items-center gap-1"
                            >
                              {resource}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Computational Thinking Tab */}
          {activeTab === 'thinking' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Brain className="h-6 w-6 text-purple-600" />
                  Computational Thinking Framework
                </h2>
                <p className="text-gray-600 mb-4">
                  Explore the four pillars of computational thinking: Decomposition, Pattern Recognition, 
                  Abstraction, and Algorithm Design.
                </p>
                <button
                  onClick={handleGetComputationalThinking}
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

              {computationalThinking && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Layers className="h-5 w-5 text-purple-600" />
                      Decomposition
                    </h3>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Steps</h4>
                      <ol className="list-decimal list-inside space-y-1 text-gray-700">
                        {computationalThinking.decomposition.steps.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                      <h4 className="font-semibold text-gray-900 mb-2 mt-4">Examples</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {computationalThinking.decomposition.examples.map((ex, i) => (
                          <li key={i}>{ex}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-600" />
                      Pattern Recognition
                    </h3>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Patterns</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {computationalThinking.patternRecognition.patterns.map((pattern, i) => (
                          <li key={i}>{pattern}</li>
                        ))}
                      </ul>
                      <h4 className="font-semibold text-gray-900 mb-2 mt-4">Exercises</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {computationalThinking.patternRecognition.exercises.map((ex, i) => (
                          <li key={i}>{ex}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Layers className="h-5 w-5 text-blue-600" />
                      Abstraction
                    </h3>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Concepts</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {computationalThinking.abstraction.concepts.map((concept, i) => (
                          <li key={i}>{concept}</li>
                        ))}
                      </ul>
                      <h4 className="font-semibold text-gray-900 mb-2 mt-4">Applications</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {computationalThinking.abstraction.applications.map((app, i) => (
                          <li key={i}>{app}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Code className="h-5 w-5 text-green-600" />
                      Algorithm Design
                    </h3>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Principles</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {computationalThinking.algorithmDesign.principles.map((principle, i) => (
                          <li key={i}>{principle}</li>
                        ))}
                      </ul>
                      <h4 className="font-semibold text-gray-900 mb-2 mt-4">Strategies</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {computationalThinking.algorithmDesign.strategies.map((strategy, i) => (
                          <li key={i}>{strategy}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Competition Roadmap Tab */}
          {activeTab === 'roadmap' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="h-6 w-6 text-amber-600" />
                  Competition Preparation Roadmap
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Level
                    </label>
                    <select
                      value={currentLevel}
                      onChange={(e) => setCurrentLevel(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Level
                    </label>
                    <select
                      value={targetLevel}
                      onChange={(e) => setTargetLevel(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleGenerateRoadmap}
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
                          Generate Roadmap
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {roadmap && (
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{roadmap.competition}</h3>
                        <p className="text-gray-600">Target Level: {roadmap.level}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-500">Alignment Score</span>
                        <p className="text-2xl font-bold text-green-600">{roadmap.learningPath.length * 20}%</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {roadmap.learningPath.map((phase, idx) => (
                        <div key={idx} className="border-l-4 border-amber-500 pl-6">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="text-lg font-bold text-gray-900">{phase.phase}</h4>
                              <p className="text-sm text-gray-600">{phase.duration}</p>
                            </div>
                            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                              Phase {idx + 1}
                            </span>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <h5 className="font-semibold text-gray-900 mb-2">Topics</h5>
                              <div className="flex flex-wrap gap-2">
                                {phase.topics.map((topic, i) => (
                                  <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-900 mb-2">Practice Problems</h5>
                              <ul className="list-disc list-inside text-sm text-gray-700">
                                {phase.practiceProblems.map((prob, i) => (
                                  <li key={i}>{prob}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="mt-4">
                            <h5 className="font-semibold text-gray-900 mb-2">Resources</h5>
                            <div className="flex flex-wrap gap-2">
                              {phase.resources.map((resource, i) => (
                                <a
                                  key={i}
                                  href="#"
                                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition flex items-center gap-1"
                                >
                                  {resource}
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Standards Alignment Tab */}
          {activeTab === 'standards' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileCheck className="h-6 w-6 text-indigo-600" />
                  International Standards Alignment
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Standards Framework
                    </label>
                    <select
                      value={standardsFramework}
                      onChange={(e) => setStandardsFramework(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="CSTA">CSTA (Computer Science Teachers Association)</option>
                      <option value="ISTE">ISTE (International Society for Technology in Education)</option>
                      <option value="UK">UK Computing Curriculum</option>
                      <option value="Australia">Australian Digital Technologies</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleCheckStandards}
                      disabled={!contentInput.trim() || isGenerating}
                      className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-5 w-5 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />
                          Check Alignment
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content/Curriculum to Analyze
                  </label>
                  <textarea
                    value={contentInput}
                    onChange={(e) => setContentInput(e.target.value)}
                    placeholder="Describe your curriculum, lesson plan, or learning objectives..."
                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {standardsAlignment && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{standardsAlignment.framework} Standards</h3>
                      <p className="text-gray-600">Grade Level: {standardsAlignment.gradeLevel}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500">Alignment Score</span>
                      <p className="text-3xl font-bold text-green-600">{standardsAlignment.alignmentScore}%</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {standardsAlignment.competencies.map((comp, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-bold text-gray-900 mb-2">{comp.competency}</h4>
                        <p className="text-gray-700 mb-3">{comp.description}</p>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-semibold text-gray-900 mb-2 text-sm">Evidence</h5>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                              {comp.evidence.map((ev, i) => (
                                <li key={i}>{ev}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-semibold text-gray-900 mb-2 text-sm">Assessment</h5>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                              {comp.assessment.map((ass, i) => (
                                <li key={i}>{ass}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
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

export default CodingProgrammingTutor



