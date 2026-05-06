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
  Layers,
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

const AdvancedDifferentiationPath = () => {
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
      id: 'tiered-instruction',
      title: 'Tiered Instruction Frameworks',
      description: 'Master the art of creating tiered lessons that challenge all students at their appropriate level while maintaining the same learning objectives.',
      duration: '40 min',
      level: 'Beginner',
      impact: 'High',
      skills: ['Tiered design', 'Readiness assessment', 'Complexity scaling', 'Objective alignment'],
      learningOutcomes: [
        'Understand tiered instruction principles',
        'Assess student readiness effectively',
        'Create tiered activities at 3-4 complexity levels',
        'Maintain learning objective alignment across tiers',
        'Implement tiered instruction in your classroom',
      ],
      content: [
        { type: 'video', title: 'Introduction to Tiered Instruction', duration: '12 min', points: 20 },
        { type: 'reading', title: 'Readiness Assessment Strategies', points: 15 },
        { type: 'interactive', title: 'Tiered Activity Designer', points: 30 },
        { type: 'template', title: 'Tiered Lesson Template Library', points: 20 },
      ],
      assessment: {
        type: 'Project-Based',
        description: 'Design a complete tiered lesson with activities for 3 readiness levels',
        points: 100,
      },
      realWorldApplication: 'Create a tiered lesson for your next unit, ensuring all students work toward the same learning objectives.',
      resources: [
        { type: 'video', title: 'Introduction to Tiered Instruction', duration: '12 min' },
        { type: 'article', title: 'Readiness Assessment Strategies' },
        { type: 'interactive', title: 'Tiered Activity Designer' },
        { type: 'template', title: 'Tiered Lesson Template Library' },
      ],
      completed: false,
      locked: false,
    },
    {
      id: 'content-differentiation',
      title: 'Advanced Content Differentiation',
      description: 'Learn sophisticated strategies for varying what students learn based on readiness, interests, and learning profiles.',
      duration: '35 min',
      level: 'Intermediate',
      impact: 'High',
      skills: ['Content variation', 'Learning contracts', 'Compacting', 'Interest-based learning'],
      learningOutcomes: [
        'Design learning contracts that provide choice',
        'Implement curriculum compacting for advanced learners',
        'Create interest-based content options',
        'Use varied texts and resources effectively',
        'Maintain rigor across all content levels',
      ],
      content: [
        { type: 'video', title: 'Content Differentiation Strategies', duration: '15 min', points: 25 },
        { type: 'reading', title: 'Learning Contracts & Compacting', points: 20 },
        { type: 'interactive', title: 'Content Differentiation Planner', points: 30 },
        { type: 'template', title: 'Learning Contract Templates', points: 20 },
      ],
      assessment: {
        type: 'Portfolio',
        description: 'Create a learning contract and compacting plan for your advanced learners',
        points: 100,
      },
      realWorldApplication: 'Develop learning contracts for your next unit that allow students to explore content aligned with their interests.',
      resources: [
        { type: 'video', title: 'Content Differentiation Strategies', duration: '15 min' },
        { type: 'article', title: 'Learning Contracts & Compacting' },
        { type: 'interactive', title: 'Content Differentiation Planner' },
        { type: 'template', title: 'Learning Contract Templates' },
      ],
      completed: false,
      locked: false,
    },
    {
      id: 'process-differentiation',
      title: 'Process Differentiation Mastery',
      description: 'Master techniques for varying how students make sense of content through different learning activities and strategies.',
      duration: '45 min',
      level: 'Intermediate',
      impact: 'High',
      skills: ['Activity variation', 'Learning stations', 'Flexible grouping', 'Multiple intelligences'],
      learningOutcomes: [
        'Design learning stations that engage all learners',
        'Implement flexible grouping strategies',
        'Create activities for different learning styles',
        'Use multiple intelligences in lesson design',
        'Facilitate varied process experiences',
      ],
      content: [
        { type: 'video', title: 'Process Differentiation Techniques', duration: '18 min', points: 25 },
        { type: 'reading', title: 'Learning Stations & Flexible Grouping', points: 20 },
        { type: 'interactive', title: 'Station Designer Tool', points: 35 },
        { type: 'template', title: 'Process Differentiation Templates', points: 25 },
      ],
      assessment: {
        type: 'Project-Based',
        description: 'Design and implement learning stations for a unit that address multiple learning styles',
        points: 100,
      },
      realWorldApplication: 'Create learning stations for your next lesson that allow students to engage with content in different ways.',
      resources: [
        { type: 'video', title: 'Process Differentiation Techniques', duration: '18 min' },
        { type: 'article', title: 'Learning Stations & Flexible Grouping' },
        { type: 'interactive', title: 'Station Designer Tool' },
        { type: 'template', title: 'Process Differentiation Templates' },
      ],
      completed: false,
      locked: false,
    },
    {
      id: 'product-differentiation',
      title: 'Product Differentiation Excellence',
      description: 'Create multiple pathways for students to demonstrate learning through varied products and assessments.',
      duration: '30 min',
      level: 'Intermediate',
      impact: 'Medium',
      skills: ['Choice boards', 'Product design', 'Rubric creation', 'Multiple intelligences'],
      learningOutcomes: [
        'Design effective choice boards',
        'Create product options that maintain rigor',
        'Develop rubrics that work across product types',
        'Incorporate multiple intelligences in product design',
        'Implement product differentiation successfully',
      ],
      content: [
        { type: 'video', title: 'Product Differentiation Strategies', duration: '12 min', points: 20 },
        { type: 'reading', title: 'Choice Boards & Product Options', points: 15 },
        { type: 'interactive', title: 'Choice Board Builder', points: 30 },
        { type: 'template', title: 'Product Differentiation Templates', points: 20 },
      ],
      assessment: {
        type: 'Portfolio',
        description: 'Create a choice board with 6-9 product options and a universal rubric',
        points: 100,
      },
      realWorldApplication: 'Replace your next assessment with a choice board that allows students to demonstrate learning in varied ways.',
      resources: [
        { type: 'video', title: 'Product Differentiation Strategies', duration: '12 min' },
        { type: 'article', title: 'Choice Boards & Product Options' },
        { type: 'interactive', title: 'Choice Board Builder' },
        { type: 'template', title: 'Product Differentiation Templates' },
      ],
      completed: false,
      locked: true,
    },
    {
      id: 'assessment-differentiation',
      title: 'Differentiated Assessment Strategies',
      description: 'Learn how to differentiate assessments to accurately measure learning while accommodating diverse learners.',
      duration: '35 min',
      level: 'Advanced',
      impact: 'High',
      skills: ['Assessment variation', 'Accommodations', 'Alternative assessments', 'Fairness'],
      learningOutcomes: [
        'Design differentiated assessments',
        'Create accommodations that maintain validity',
        'Develop alternative assessment options',
        'Ensure fairness across assessment types',
        'Use assessment data to inform differentiation',
      ],
      content: [
        { type: 'video', title: 'Differentiated Assessment Design', duration: '15 min', points: 25 },
        { type: 'reading', title: 'Fairness & Validity in Differentiation', points: 20 },
        { type: 'interactive', title: 'Assessment Differentiation Tool', points: 30 },
        { type: 'template', title: 'Differentiated Assessment Templates', points: 25 },
      ],
      assessment: {
        type: 'Project + Reflection',
        description: 'Design differentiated assessments and reflect on fairness and validity',
        points: 100,
      },
      realWorldApplication: 'Create differentiated assessment options for your next unit that accurately measure learning for all students.',
      resources: [
        { type: 'video', title: 'Differentiated Assessment Design', duration: '15 min' },
        { type: 'article', title: 'Fairness & Validity in Differentiation' },
        { type: 'interactive', title: 'Assessment Differentiation Tool' },
        { type: 'template', title: 'Differentiated Assessment Templates' },
      ],
      completed: false,
      locked: true,
    },
    {
      id: 'advanced-grouping',
      title: 'Advanced Grouping Strategies',
      description: 'Master sophisticated grouping techniques that maximize learning through strategic student placement and collaboration.',
      duration: '25 min',
      level: 'Advanced',
      impact: 'Medium',
      skills: ['Strategic grouping', 'Heterogeneous groups', 'Homogeneous groups', 'Dynamic grouping'],
      learningOutcomes: [
        'Understand when to use different grouping strategies',
        'Design heterogeneous groups for collaboration',
        'Create homogeneous groups for targeted instruction',
        'Implement dynamic grouping that changes based on needs',
        'Maximize learning through strategic grouping',
      ],
      content: [
        { type: 'video', title: 'Advanced Grouping Techniques', duration: '12 min', points: 20 },
        { type: 'reading', title: 'Research on Grouping Effectiveness', points: 15 },
        { type: 'interactive', title: 'Grouping Strategy Planner', points: 25 },
        { type: 'template', title: 'Grouping Templates & Tools', points: 20 },
      ],
      assessment: {
        type: 'Reflection',
        description: 'Reflect on your grouping strategies and plan improvements',
        points: 100,
      },
      realWorldApplication: 'Implement strategic grouping in your next unit, varying groups based on learning needs.',
      resources: [
        { type: 'video', title: 'Advanced Grouping Techniques', duration: '12 min' },
        { type: 'article', title: 'Research on Grouping Effectiveness' },
        { type: 'interactive', title: 'Grouping Strategy Planner' },
        { type: 'template', title: 'Grouping Templates & Tools' },
      ],
      completed: false,
      locked: true,
    },
  ]

  const staticSkillImpacts: SkillImpact[] = [
    {
      skill: 'Student Achievement',
      before: 68,
      after: 89,
      improvement: 21,
      description: 'Increase in student achievement across ability levels',
    },
    {
      skill: 'Student Engagement',
      before: 62,
      after: 87,
      improvement: 25,
      description: 'Improvement in engagement for all learners',
    },
    {
      skill: 'Advanced Learner Growth',
      before: 55,
      after: 85,
      improvement: 30,
      description: 'Better growth for advanced learners through appropriate challenge',
    },
    {
      skill: 'Struggling Learner Support',
      before: 58,
      after: 82,
      improvement: 24,
      description: 'Improved outcomes for struggling learners through targeted support',
    },
    {
      skill: 'Classroom Equity',
      before: 65,
      after: 91,
      improvement: 26,
      description: 'Increased equity in learning opportunities',
    },
  ]

  const staticAiGuidance: AIGuidance = {
    recommendation: 'Start with Tiered Instruction, then explore Content Differentiation',
    reason: 'Based on your lesson patterns, you work with diverse learners. Tiered instruction provides a solid foundation, then content differentiation will help you meet individual needs more precisely.',
    nextSteps: [
      'Complete Tiered Instruction Frameworks module',
      'Create your first tiered lesson',
      'Explore Content Differentiation strategies',
      'Assess student readiness before planning',
    ],
    personalizedTip: 'Your students benefit from clear structure. Start with 3 tiers (foundation, standard, challenge) before adding more complexity.',
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
    const saved = localStorage.getItem('advanced-differentiation-completed')
    if (saved) {
      setCompletedModules(JSON.parse(saved))
    }
  }, [])

  // Save completed modules to localStorage
  useEffect(() => {
    localStorage.setItem('advanced-differentiation-completed', JSON.stringify(completedModules))
  }, [completedModules])

  // Determine which modules are unlocked based on completion
  const getUnlockedModules = () => {
    return learningModules.map((module, index) => {
      // First 3 modules are always unlocked
      if (index < 3) {
        return { ...module, locked: false }
      }
      // Module 4 (Product Differentiation) unlocks when first 3 are completed
      if (index === 3) {
        const firstThreeCompleted = ['tiered-instruction', 'content-differentiation', 'process-differentiation'].every(
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
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-xl">
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
                    2 hours estimated
                  </span>
                </div>
                <h1 className="text-3xl font-bold">Advanced Differentiation Strategies</h1>
                <p className="mt-2 text-green-100">
                  Deepen your toolkit with tiered instruction frameworks and sophisticated differentiation techniques
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>High Impact</span>
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
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-600 text-white flex items-center justify-center">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">AI-Powered Learning Guidance</h3>
              <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                Personalized
              </span>
            </div>
            <p className="text-sm font-medium text-gray-900 mb-2">{aiGuidance.recommendation}</p>
            <p className="text-sm text-gray-700 mb-4">{aiGuidance.reason}</p>
            <div className="bg-white rounded-lg p-4 border border-green-200 mb-4">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Personalized Tip</p>
              <p className="text-sm text-gray-700">{aiGuidance.personalizedTip}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Your Next Steps</p>
              <ul className="space-y-1">
                {aiGuidance.nextSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <ArrowRight className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
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
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div className="space-y-4">
              {skillImpacts.map((impact, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{impact.skill}</span>
                    <span className="text-green-600 font-semibold">+{impact.improvement}%</span>
                  </div>
                  <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full bg-gray-400 rounded-full"
                      style={{ width: `${impact.before}%` }}
                    />
                    <div
                      className="absolute left-0 top-0 h-full bg-green-500 rounded-full transition-all duration-500"
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
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-green-200'
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
                              ? 'bg-green-100 text-green-600'
                              : 'bg-green-100 text-green-600'
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
                      <div className="px-5 pb-5 border-t border-green-200 pt-5 space-y-6">
                        {/* Learning Outcomes */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Target className="h-4 w-4 text-green-600" />
                            Learning Outcomes
                          </h4>
                          <ul className="space-y-2">
                            {module.learningOutcomes.map((outcome, outIdx) => (
                              <li key={outIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{outcome}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Content */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-green-600" />
                            Module Content
                          </h4>
                          <div className="space-y-2">
                            {module.content.map((item, contIdx) => (
                              <div key={contIdx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                                <div className="flex items-center gap-3">
                                  {item.type === 'video' && <Video className="h-4 w-4 text-green-600" />}
                                  {item.type === 'reading' && <FileText className="h-4 w-4 text-green-600" />}
                                  {item.type === 'interactive' && <Zap className="h-4 w-4 text-green-600" />}
                                  {item.type === 'template' && <FileText className="h-4 w-4 text-green-600" />}
                                  {item.type === 'project' && <Rocket className="h-4 w-4 text-green-600" />}
                                  <span className="text-sm text-gray-700">{item.title}</span>
                                  {item.duration && (
                                    <span className="text-xs text-gray-500">({item.duration})</span>
                                  )}
                                </div>
                                {item.points && (
                                  <span className="text-xs font-semibold text-green-600">{item.points} pts</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Assessment */}
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Award className="h-4 w-4 text-green-600" />
                            Assessment
                          </h4>
                          <p className="text-sm text-gray-700 mb-1">{module.assessment.type}</p>
                          <p className="text-sm text-gray-600">{module.assessment.description}</p>
                          <p className="text-xs text-green-600 font-semibold mt-2">{module.assessment.points} points</p>
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
                              className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition flex items-center gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              Review Module
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  const moduleRoutes: Record<string, string> = {
                                    'tiered-instruction': '/learning-hub/tiered-instruction-module',
                                    'content-differentiation': '/learning-hub/content-differentiation-module',
                                    'process-differentiation': '/learning-hub/process-differentiation-module',
                                    'product-differentiation': '/learning-hub/product-differentiation-module',
                                    'assessment-differentiation': '/learning-hub/assessment-differentiation-module',
                                    'advanced-grouping': '/learning-hub/advanced-grouping-module',
                                  }
                                  
                                  const route = moduleRoutes[module.id]
                                  if (route) {
                                    navigate(route)
                                  } else {
                                    setActiveModule(isExpanded ? null : module.id)
                                  }
                                }}
                                className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition flex items-center gap-2"
                              >
                                <Play className="h-4 w-4" />
                                Start Module
                              </button>
                              <button
                                onClick={() => handleModuleComplete(module.id)}
                                className="px-4 py-2 rounded-lg border-2 border-green-600 text-green-600 text-sm font-semibold hover:bg-green-50 transition flex items-center gap-2"
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
                    className="h-full bg-green-600 rounded-full transition-all duration-300"
                    style={{ width: `${totalProgress}%` }}
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Skills You'll Master</p>
                <div className="flex flex-wrap gap-2">
                  {learningModules.slice(0, 3).flatMap(m => m.skills).slice(0, 6).map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-4">Path Overview</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Modules</span>
                <span className="text-sm font-semibold text-gray-900">{learningModules.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Estimated Time</span>
                <span className="text-sm font-semibold text-gray-900">2 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Impact Level</span>
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold">High</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdvancedDifferentiationPath

