import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Target,
  Clock,
  TrendingUp,
  Award,
  CheckCircle2,
  Circle,
  Lock,
  Play,
  BookOpen,
  Lightbulb,
  Zap,
  Users,
  Star,
  Brain,
  BarChart3,
  FileText,
  Video,
  Download,
  Share2,
  Sparkles,
  ArrowRight,
  Trophy,
  Eye,
  MessageSquare,
  Settings,
  Filter,
  Bot,
  ClipboardCheck,
  Rocket,
} from 'lucide-react'
import axiosInstance from '../../redux/http'
import { parseLearningPathFromRegistry } from '../../utils/learningHubGeneratedContent'

interface LearningModule {
  id: string
  title: string
  description: string
  duration: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  impact: 'Low' | 'Medium' | 'High'
  skills: string[]
  learningOutcomes: string[]
  content: Array<{
    type: 'video' | 'reading' | 'interactive' | 'template' | 'project'
    title: string
    duration?: string
    points?: number
  }>
  assessment: {
    type: string
    description: string
    points: number
  }
  realWorldApplication: string
  resources: {
    type: 'video' | 'article' | 'interactive' | 'template'
    title: string
    duration?: string
  }[]
  completed: boolean
  locked: boolean
}

interface SkillImpact {
  skill: string
  before: number
  after: number
  improvement: number
  description: string
}

interface AIGuidance {
  recommendation: string
  reason: string
  nextSteps: string[]
  personalizedTip: string
}

const AIAssistedAssessmentPath = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeModule, setActiveModule] = useState<string | null>(null)
  const [completedModules, setCompletedModules] = useState<string[]>([])
  const [currentLevel, setCurrentLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner')
  const persisted = (() => {
    try {
      const raw = sessionStorage.getItem(`learningHubRouteState:${location.pathname}`)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })()
  const contentId = (location.state as any)?.contentId || persisted?.contentId || null

  const staticLearningModules: LearningModule[] = [
    {
      id: 'ai-assessment-intro',
      title: 'Introduction to AI in Assessment',
      description: 'Understand how AI can enhance assessment design, automate rubric creation, and provide instant feedback to improve learning outcomes.',
      duration: '25 min',
      level: 'Beginner',
      impact: 'Medium',
      skills: ['AI tools', 'Assessment design', 'Automation', 'Feedback systems'],
      learningOutcomes: [
        'Understand AI capabilities in assessment',
        'Identify opportunities for AI integration',
        'Evaluate AI assessment tools',
        'Maintain assessment validity with AI',
        'Set up your AI assessment workflow',
      ],
      content: [
        { type: 'video', title: 'AI in Assessment: An Overview', duration: '10 min', points: 20 },
        { type: 'reading', title: 'AI Tools for Teachers', points: 15 },
        { type: 'interactive', title: 'AI Assessment Tool Explorer', points: 25 },
        { type: 'template', title: 'Assessment Planning Template', points: 15 },
      ],
      assessment: {
        type: 'Reflection',
        description: 'Reflect on how AI can enhance your assessment practices',
        points: 100,
      },
      realWorldApplication: 'Identify one assessment in your next unit that could benefit from AI assistance.',
      resources: [
        { type: 'video', title: 'AI in Assessment: An Overview', duration: '10 min' },
        { type: 'article', title: 'AI Tools for Teachers' },
        { type: 'interactive', title: 'AI Assessment Tool Explorer' },
        { type: 'template', title: 'Assessment Planning Template' },
      ],
      completed: false,
      locked: false,
    },
    {
      id: 'automated-rubrics',
      title: 'Automated Rubric Generation',
      description: 'Learn how to use AI to create detailed, standards-aligned rubrics quickly while maintaining quality and rigor.',
      duration: '30 min',
      level: 'Intermediate',
      impact: 'High',
      skills: ['Rubric design', 'AI prompts', 'Standards alignment', 'Quality control'],
      learningOutcomes: [
        'Write effective prompts for rubric generation',
        'Generate standards-aligned rubrics with AI',
        'Refine and customize AI-generated rubrics',
        'Ensure rubric quality and validity',
        'Create rubrics efficiently',
      ],
      content: [
        { type: 'video', title: 'AI Rubric Generation Techniques', duration: '12 min', points: 25 },
        { type: 'reading', title: 'Rubric Design Best Practices', points: 20 },
        { type: 'interactive', title: 'AI Rubric Generator Tool', points: 35 },
        { type: 'template', title: 'Rubric Prompt Templates', points: 20 },
      ],
      assessment: {
        type: 'Project-Based',
        description: 'Generate and refine 3 rubrics using AI for different assessment types',
        points: 100,
      },
      realWorldApplication: 'Use AI to generate rubrics for your next major assignment, then customize them for your needs.',
      resources: [
        { type: 'video', title: 'AI Rubric Generation Techniques', duration: '12 min' },
        { type: 'article', title: 'Rubric Design Best Practices' },
        { type: 'interactive', title: 'AI Rubric Generator Tool' },
        { type: 'template', title: 'Rubric Prompt Templates' },
      ],
      completed: false,
      locked: false,
    },
    {
      id: 'instant-feedback',
      title: 'Instant Feedback Loops',
      description: 'Implement AI-powered feedback systems that provide immediate, actionable feedback to students, accelerating learning.',
      duration: '35 min',
      level: 'Intermediate',
      impact: 'High',
      skills: ['Feedback automation', 'AI feedback', 'Formative assessment', 'Student growth'],
      learningOutcomes: [
        'Design AI-powered feedback systems',
        'Create effective feedback prompts',
        'Implement instant feedback in assessments',
        'Balance AI feedback with teacher feedback',
        'Use feedback data to inform instruction',
      ],
      content: [
        { type: 'video', title: 'AI Feedback Systems', duration: '15 min', points: 25 },
        { type: 'reading', title: 'Effective Feedback Strategies', points: 20 },
        { type: 'interactive', title: 'Feedback Loop Designer', points: 35 },
        { type: 'template', title: 'Feedback Prompt Library', points: 20 },
      ],
      assessment: {
        type: 'Portfolio',
        description: 'Design and implement an AI feedback system for one assessment',
        points: 100,
      },
      realWorldApplication: 'Set up instant AI feedback for your next formative assessment to provide immediate guidance to students.',
      resources: [
        { type: 'video', title: 'AI Feedback Systems', duration: '15 min' },
        { type: 'article', title: 'Effective Feedback Strategies' },
        { type: 'interactive', title: 'Feedback Loop Designer' },
        { type: 'template', title: 'Feedback Prompt Library' },
      ],
      completed: false,
      locked: false,
    },
    {
      id: 'formative-automation',
      title: 'Formative Assessment Automation',
      description: 'Automate formative assessment creation and analysis to save time while maintaining quality and gaining deeper insights.',
      duration: '30 min',
      level: 'Advanced',
      impact: 'Medium',
      skills: ['Formative assessment', 'Question generation', 'Data analysis', 'Time efficiency'],
      learningOutcomes: [
        'Generate formative assessment questions with AI',
        'Automate assessment analysis and insights',
        'Create quick-check assessments efficiently',
        'Use AI to identify learning gaps',
        'Streamline formative assessment workflow',
      ],
      content: [
        { type: 'video', title: 'Automating Formative Assessment', duration: '12 min', points: 25 },
        { type: 'reading', title: 'Formative Assessment Best Practices', points: 20 },
        { type: 'interactive', title: 'Formative Assessment Builder', points: 30 },
        { type: 'template', title: 'Automated Assessment Templates', points: 25 },
      ],
      assessment: {
        type: 'Project-Based',
        description: 'Create a suite of automated formative assessments for one unit',
        points: 100,
      },
      realWorldApplication: 'Automate formative assessment creation for your next unit to save time and increase frequency.',
      resources: [
        { type: 'video', title: 'Automating Formative Assessment', duration: '12 min' },
        { type: 'article', title: 'Formative Assessment Best Practices' },
        { type: 'interactive', title: 'Formative Assessment Builder' },
        { type: 'template', title: 'Automated Assessment Templates' },
      ],
      completed: false,
      locked: true,
    },
    {
      id: 'summative-ai-design',
      title: 'AI-Enhanced Summative Assessment Design',
      description: 'Design comprehensive summative assessments with AI assistance while maintaining rigor, validity, and fairness.',
      duration: '25 min',
      level: 'Advanced',
      impact: 'Medium',
      skills: ['Summative design', 'AI integration', 'Assessment validity', 'Quality assurance'],
      learningOutcomes: [
        'Design summative assessments with AI support',
        'Ensure assessment validity and reliability',
        'Create comprehensive assessment suites',
        'Balance AI efficiency with teacher judgment',
        'Maintain assessment quality standards',
      ],
      content: [
        { type: 'video', title: 'AI in Summative Assessment', duration: '10 min', points: 20 },
        { type: 'reading', title: 'Summative Assessment Design Principles', points: 15 },
        { type: 'interactive', title: 'Summative Assessment Designer', points: 30 },
        { type: 'template', title: 'Summative Assessment Templates', points: 20 },
      ],
      assessment: {
        type: 'Project + Reflection',
        description: 'Design a summative assessment with AI assistance and reflect on the process',
        points: 100,
      },
      realWorldApplication: 'Use AI to design your next summative assessment, then refine it with your professional judgment.',
      resources: [
        { type: 'video', title: 'AI in Summative Assessment', duration: '10 min' },
        { type: 'article', title: 'Summative Assessment Design Principles' },
        { type: 'interactive', title: 'Summative Assessment Designer' },
        { type: 'template', title: 'Summative Assessment Templates' },
      ],
      completed: false,
      locked: true,
    },
  ]

  const staticSkillImpacts: SkillImpact[] = [
    {
      skill: 'Assessment Efficiency',
      before: 55,
      after: 85,
      improvement: 30,
      description: 'Time saved on assessment creation and grading',
    },
    {
      skill: 'Feedback Quality',
      before: 62,
      after: 88,
      improvement: 26,
      description: 'Improvement in feedback timeliness and specificity',
    },
    {
      skill: 'Assessment Frequency',
      before: 58,
      after: 82,
      improvement: 24,
      description: 'Increase in formative assessment frequency',
    },
    {
      skill: 'Student Growth',
      before: 65,
      after: 86,
      improvement: 21,
      description: 'Better student growth through faster feedback',
    },
    {
      skill: 'Data Insights',
      before: 60,
      after: 84,
      improvement: 24,
      description: 'Improved insights from automated analysis',
    },
  ]

  const staticAiGuidance: AIGuidance = {
    recommendation: 'Start with Automated Rubrics, then explore Instant Feedback',
    reason: 'Your formative assessments could benefit from automated rubric generation and instant feedback loops. Start with rubrics to establish clear criteria, then add instant feedback to accelerate learning.',
    nextSteps: [
      'Complete Automated Rubric Generation module',
      'Generate your first AI rubric',
      'Explore Instant Feedback Loops',
      'Implement AI feedback in one assessment',
    ],
    personalizedTip: 'You create detailed assessments regularly. AI can help you generate rubrics quickly while you focus on refining them for your specific students.',
  }

  const [learningModules, setLearningModules] = useState<LearningModule[]>(staticLearningModules)
  const [skillImpacts, setSkillImpacts] = useState<SkillImpact[]>(staticSkillImpacts)
  const [aiGuidance, setAiGuidance] = useState<AIGuidance>(staticAiGuidance)

  useEffect(() => {
    const shouldFetch = typeof contentId === 'string' && contentId.startsWith('factory-')
    if (!shouldFetch) return
    let cancelled = false
    ;(async () => {
      try {
        const res = await axiosInstance.get(`/api/v1/content-registry/by-content-id/${encodeURIComponent(contentId)}`)
        const parsed = parseLearningPathFromRegistry(res?.data)
        if (cancelled) return
        if (Array.isArray(parsed.learningModules) && parsed.learningModules.length > 0) {
          setLearningModules(parsed.learningModules as LearningModule[])
        }
        if (Array.isArray(parsed.skillImpacts) && parsed.skillImpacts.length > 0) {
          setSkillImpacts(parsed.skillImpacts as SkillImpact[])
        }
        if (parsed.aiGuidance && parsed.aiGuidance.recommendation) {
          setAiGuidance(parsed.aiGuidance as AIGuidance)
        }
      } catch {
        // keep static fallback
      }
    })()
    return () => {
      cancelled = true
    }
  }, [contentId])

  // Load completed modules from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ai-assessment-completed')
    if (saved) {
      setCompletedModules(JSON.parse(saved))
    }
  }, [])

  // Save completed modules to localStorage
  useEffect(() => {
    localStorage.setItem('ai-assessment-completed', JSON.stringify(completedModules))
  }, [completedModules])

  // Determine which modules are unlocked based on completion
  const getUnlockedModules = () => {
    return learningModules.map((module, index) => {
      // First 3 modules are always unlocked
      if (index < 3) {
        return { ...module, locked: false }
      }
      // Module 4 (Formative Automation) unlocks when first 3 are completed
      if (index === 3) {
        const firstThreeCompleted = ['ai-assessment-intro', 'automated-rubrics', 'instant-feedback'].every(
          id => completedModules.includes(id)
        )
        return { ...module, locked: !firstThreeCompleted }
      }
      // Subsequent modules unlock when previous module is completed
      const previousModuleId = learningModules[index - 1].id
      return { ...module, locked: !completedModules.includes(previousModuleId) }
    })
  }

  const unlockedModulesList = getUnlockedModules()
  const unlockedModules = unlockedModulesList.filter(m => !m.locked)
  const completedCount = completedModules.length
  const totalProgress = unlockedModules.length > 0 ? (completedCount / unlockedModules.length) * 100 : 0

  const handleModuleComplete = (moduleId: string) => {
    if (!completedModules.includes(moduleId)) {
      setCompletedModules([...completedModules, moduleId])
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'Medium':
        return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'Low':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-700'
      case 'Intermediate':
        return 'bg-blue-100 text-blue-700'
      case 'Advanced':
        return 'bg-purple-100 text-purple-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-6" data-page-kind="growth_path" data-content-id={contentId || ''} data-content-type="learning_path">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => navigate('/learning-hub')}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wide">
                    AI-Guided Learning Path
                  </span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    1.5 hours estimated
                  </span>
                </div>
                <h1 className="text-3xl font-bold">AI-Assisted Assessment Design</h1>
                <p className="mt-2 text-indigo-100">
                  Leverage AI to automate rubric generation and create instant feedback loops that accelerate learning
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>Medium Impact</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                <span>{completedCount} of {unlockedModules.length} modules completed</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>{Math.round(totalProgress)}% Complete</span>
              </div>
            </div>
            <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${totalProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* AI Guidance Card */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border-2 border-indigo-200 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">AI-Powered Learning Guidance</h3>
              <span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
                Personalized
              </span>
            </div>
            <p className="text-sm font-medium text-gray-900 mb-2">{aiGuidance.recommendation}</p>
            <p className="text-sm text-gray-700 mb-4">{aiGuidance.reason}</p>
            <div className="bg-white rounded-lg p-4 border border-indigo-200 mb-4">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Personalized Tip</p>
              <p className="text-sm text-gray-700">{aiGuidance.personalizedTip}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Your Next Steps</p>
              <ul className="space-y-1">
                {aiGuidance.nextSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <ArrowRight className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Learning Path */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skill Impact Preview */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Expected Impact on Your Teaching</h2>
              <TrendingUp className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="space-y-4">
              {skillImpacts.map((impact, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{impact.skill}</span>
                    <span className="text-indigo-600 font-semibold">+{impact.improvement}%</span>
                  </div>
                  <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full bg-gray-400 rounded-full"
                      style={{ width: `${impact.before}%` }}
                    />
                    <div
                      className="absolute left-0 top-0 h-full bg-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${impact.after}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">{impact.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Modules */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Learning Modules</h2>
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {unlockedModulesList.map((module, idx) => {
                const isExpanded = activeModule === module.id
                const isCompleted = completedModules.includes(module.id)

                return (
                  <div
                    key={module.id}
                    className={`border-2 rounded-xl transition ${
                      module.locked
                        ? 'border-gray-200 bg-gray-50 opacity-60'
                        : isExpanded
                        ? 'border-indigo-300 bg-indigo-50'
                        : 'border-gray-200 bg-white hover:border-indigo-200'
                    }`}
                  >
                    <button
                      onClick={() => !module.locked && setActiveModule(isExpanded ? null : module.id)}
                      disabled={module.locked}
                      className="w-full p-5 text-left"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                            module.locked
                              ? 'bg-gray-200 text-gray-400'
                              : isCompleted
                              ? 'bg-indigo-100 text-indigo-600'
                              : 'bg-indigo-100 text-indigo-600'
                          }`}>
                            {module.locked ? (
                              <Lock className="h-5 w-5" />
                            ) : isCompleted ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              <span className="font-bold">{idx + 1}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getLevelColor(module.level)}`}>
                                {module.level}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getImpactColor(module.impact)}`}>
                                {module.impact} Impact
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {module.duration}
                              </span>
                              <span className="flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                {module.content.reduce((sum, item) => sum + (item.points || 0), 0) + module.assessment.points} points
                              </span>
                            </div>
                          </div>
                        </div>
                        {!module.locked && (
                          <ArrowRight
                            className={`h-5 w-5 text-gray-400 transition-transform flex-shrink-0 ${
                              isExpanded ? 'rotate-90' : ''
                            }`}
                          />
                        )}
                      </div>
                    </button>

                    {module.locked && (
                      <div className="px-5 pb-5 border-t border-gray-200 pt-5">
                        <button
                          disabled
                          className="w-full px-4 py-2 rounded-lg bg-gray-200 text-gray-500 text-sm font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <Lock className="h-4 w-4" />
                          {idx === 3 
                            ? 'Locked - Complete first 3 modules to unlock'
                            : 'Locked - Complete previous module to unlock'}
                        </button>
                      </div>
                    )}

                    {isExpanded && !module.locked && (
                      <div className="px-5 pb-5 border-t border-indigo-200 pt-5 space-y-6">
                        {/* Learning Outcomes */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Target className="h-4 w-4 text-indigo-600" />
                            Learning Outcomes
                          </h4>
                          <ul className="space-y-2">
                            {module.learningOutcomes.map((outcome, outIdx) => (
                              <li key={outIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle2 className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                                <span>{outcome}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Content */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-indigo-600" />
                            Module Content
                          </h4>
                          <div className="space-y-2">
                            {module.content.map((item, contIdx) => (
                              <div key={contIdx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                                <div className="flex items-center gap-3">
                                  {item.type === 'video' && <Video className="h-4 w-4 text-indigo-600" />}
                                  {item.type === 'reading' && <FileText className="h-4 w-4 text-indigo-600" />}
                                  {item.type === 'interactive' && <Zap className="h-4 w-4 text-indigo-600" />}
                                  {item.type === 'template' && <FileText className="h-4 w-4 text-indigo-600" />}
                                  {item.type === 'project' && <Rocket className="h-4 w-4 text-indigo-600" />}
                                  <span className="text-sm text-gray-700">{item.title}</span>
                                  {item.duration && (
                                    <span className="text-xs text-gray-500">({item.duration})</span>
                                  )}
                                </div>
                                {item.points && (
                                  <span className="text-xs font-semibold text-indigo-600">{item.points} pts</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Assessment */}
                        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Award className="h-4 w-4 text-indigo-600" />
                            Assessment
                          </h4>
                          <p className="text-sm text-gray-700 mb-1">{module.assessment.type}</p>
                          <p className="text-sm text-gray-600">{module.assessment.description}</p>
                          <p className="text-xs text-indigo-600 font-semibold mt-2">{module.assessment.points} points</p>
                        </div>

                        {/* Real-World Application */}
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-blue-600" />
                            Real-World Application
                          </h4>
                          <p className="text-sm text-gray-700">{module.realWorldApplication}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                          {isCompleted ? (
                            <button
                              onClick={() => setActiveModule(isExpanded ? null : module.id)}
                              className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition flex items-center gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              Review Module
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  const moduleRoutes: Record<string, string> = {
                                    'ai-assessment-intro': '/learning-hub/ai-assessment-intro-module',
                                    'automated-rubrics': '/learning-hub/automated-rubrics-module',
                                    'instant-feedback': '/learning-hub/instant-feedback-module',
                                    'formative-automation': '/learning-hub/formative-automation-module',
                                    'summative-ai-design': '/learning-hub/summative-ai-design-module',
                                  }
                                  
                                  const route = moduleRoutes[module.id]
                                  if (route) {
                                    navigate(route)
                                  } else {
                                    setActiveModule(isExpanded ? null : module.id)
                                  }
                                }}
                                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition flex items-center gap-2"
                              >
                                <Play className="h-4 w-4" />
                                Start Module
                              </button>
                              <button
                                onClick={() => handleModuleComplete(module.id)}
                                className="px-4 py-2 rounded-lg border-2 border-indigo-600 text-indigo-600 text-sm font-semibold hover:bg-indigo-50 transition flex items-center gap-2"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                Mark Complete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-4">Your Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Modules Completed</span>
                  <span className="text-lg font-bold text-gray-900">{completedCount}/{unlockedModules.length}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${totalProgress}%` }}
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Skills You'll Master</p>
                <div className="flex flex-wrap gap-2">
                  {learningModules.slice(0, 3).flatMap(m => m.skills).slice(0, 6).map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-200 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-4">Path Overview</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Modules</span>
                <span className="text-sm font-semibold text-gray-900">{learningModules.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Estimated Time</span>
                <span className="text-sm font-semibold text-gray-900">1.5 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Impact Level</span>
                <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-semibold">Medium</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIAssistedAssessmentPath

