import { useState } from 'react'
import { useEffect } from 'react'
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
  Gamepad2,
  Search,
  Rocket,
  BarChart3,
  FileText,
  Video,
  Download,
  Share2,
  Sparkles,
  ArrowRight,
  Trophy,
  Flame,
  Eye,
  MessageSquare,
  Settings,
  Filter,
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

const StudentEngagementPath = () => {
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
      id: 'gamification-basics',
      title: 'Gamification Fundamentals',
      description: 'Learn the core principles of gamification and how to apply game mechanics to increase student motivation and engagement.',
      duration: '45 min',
      level: 'Beginner',
      impact: 'High',
      skills: ['Game mechanics', 'Reward systems', 'Progress tracking', 'Student motivation'],
      learningOutcomes: [
        'Understand core gamification principles and psychology',
        'Design effective reward systems that motivate students',
        'Apply game mechanics to lesson planning',
        'Create progress tracking systems',
        'Implement gamification in your classroom',
      ],
      content: [
        { type: 'video', title: 'Introduction to Gamification', duration: '12 min', points: 20 },
        { type: 'reading', title: 'The Psychology of Game-Based Learning', points: 15 },
        { type: 'interactive', title: 'Gamification Design Workshop', points: 25 },
        { type: 'template', title: 'Gamification Lesson Template', points: 15 },
        { type: 'project', title: 'Design Your Gamified Lesson', points: 25 },
      ],
      assessment: {
        type: 'Project-Based',
        description: 'Create a complete gamified lesson plan with reward systems and progress tracking',
        points: 100,
      },
      realWorldApplication: 'Implement a gamified unit in your classroom and track student engagement improvements.',
      resources: [
        { type: 'video', title: 'Introduction to Gamification', duration: '12 min' },
        { type: 'article', title: 'The Psychology of Game-Based Learning' },
        { type: 'interactive', title: 'Gamification Design Workshop' },
        { type: 'template', title: 'Gamification Lesson Template' },
      ],
      completed: false,
      locked: false,
    },
    {
      id: 'points-badges-leaderboards',
      title: 'Points, Badges & Leaderboards',
      description: 'Master the most popular gamification elements and learn when and how to use them effectively in your classroom.',
      duration: '60 min',
      level: 'Beginner',
      impact: 'High',
      skills: ['Point systems', 'Badge design', 'Leaderboard management', 'Fair competition'],
      learningOutcomes: [
        'Design effective point systems that reflect learning',
        'Create meaningful badge systems with clear criteria',
        'Implement leaderboards that motivate without demotivating',
        'Balance competition with collaboration',
        'Avoid common gamification pitfalls',
      ],
      content: [
        { type: 'video', title: 'Designing Effective Point Systems', duration: '15 min', points: 20 },
        { type: 'reading', title: 'Badge Design Best Practices', points: 15 },
        { type: 'interactive', title: 'Create Your Badge System', points: 25 },
        { type: 'video', title: 'Leaderboard Management', duration: '18 min', points: 20 },
        { type: 'template', title: 'Leaderboard Template', points: 20 },
      ],
      assessment: {
        type: 'Portfolio',
        description: 'Design a complete points, badges, and leaderboard system for your classroom',
        points: 100,
      },
      realWorldApplication: 'Implement a points and badge system in your next unit and measure student engagement.',
      resources: [
        { type: 'video', title: 'Designing Effective Reward Systems', duration: '15 min' },
        { type: 'article', title: 'Avoiding Gamification Pitfalls' },
        { type: 'interactive', title: 'Create Your Badge System' },
        { type: 'template', title: 'Leaderboard Template' },
      ],
      completed: false,
      locked: false,
    },
    {
      id: 'inquiry-hooks',
      title: 'Inquiry-Based Learning Hooks',
      description: 'Discover powerful strategies to spark curiosity and launch inquiry-based learning experiences that captivate students.',
      duration: '50 min',
      level: 'Intermediate',
      impact: 'High',
      skills: ['Question design', 'Curiosity triggers', 'Problem-based learning', 'Student-driven inquiry'],
      learningOutcomes: [
        'Design compelling hooks that spark curiosity',
        'Create phenomenon-based learning experiences',
        'Craft effective inquiry questions',
        'Launch student-driven investigations',
        'Use hooks to drive meaningful inquiry',
      ],
      content: [
        { type: 'video', title: 'The Art of the Hook', duration: '18 min', points: 20 },
        { type: 'reading', title: 'Types of Inquiry Hooks', points: 15 },
        { type: 'interactive', title: 'Hook Generator Tool', points: 25 },
        { type: 'reading', title: 'Designing Inquiry Questions', points: 15 },
        { type: 'template', title: 'Inquiry Lesson Framework', points: 20 },
      ],
      assessment: {
        type: 'Project-Based',
        description: 'Create and implement an inquiry-based lesson with a compelling hook',
        points: 100,
      },
      realWorldApplication: 'Design and launch an inquiry-based unit using a compelling hook to engage your students.',
      resources: [
        { type: 'video', title: 'The Art of the Hook', duration: '18 min' },
        { type: 'article', title: 'Inquiry Learning Research & Best Practices' },
        { type: 'interactive', title: 'Hook Generator Tool' },
        { type: 'template', title: 'Inquiry Lesson Framework' },
      ],
      completed: false,
      locked: false,
    },
    {
      id: 'quest-based-learning',
      title: 'Quest-Based Learning Design',
      description: 'Transform your curriculum into engaging quests and missions that guide students through meaningful learning journeys.',
      duration: '75 min',
      level: 'Intermediate',
      impact: 'High',
      skills: ['Quest design', 'Narrative structure', 'Choice and agency', 'Progressive challenges'],
      learningOutcomes: [
        'Design compelling quest narratives',
        'Create progressive challenges that build skills',
        'Provide meaningful student choice and agency',
        'Structure curriculum as engaging quests',
        'Implement quest-based learning in your classroom',
      ],
      content: [
        { type: 'video', title: 'Building Learning Quests', duration: '20 min', points: 20 },
        { type: 'reading', title: 'Storytelling in Education', points: 15 },
        { type: 'interactive', title: 'Quest Builder Tool', points: 30 },
        { type: 'reading', title: 'Choice and Agency in Quests', points: 15 },
        { type: 'template', title: 'Quest Template Library', points: 20 },
      ],
      assessment: {
        type: 'Project-Based',
        description: 'Design a complete quest-based learning unit with narrative, challenges, and student choice',
        points: 100,
      },
      realWorldApplication: 'Transform one of your existing units into a quest-based learning experience.',
      resources: [
        { type: 'video', title: 'Building Learning Quests', duration: '20 min' },
        { type: 'article', title: 'Storytelling in Education' },
        { type: 'interactive', title: 'Quest Builder Tool' },
        { type: 'template', title: 'Quest Template Library' },
      ],
      completed: false,
      locked: true,
    },
    {
      id: 'collaborative-games',
      title: 'Collaborative Game Mechanics',
      description: 'Learn how to design games that promote teamwork, collaboration, and peer learning while maintaining engagement.',
      duration: '55 min',
      level: 'Intermediate',
      impact: 'Medium',
      skills: ['Team dynamics', 'Collaborative challenges', 'Peer assessment', 'Group rewards'],
      learningOutcomes: [
        'Design games that require teamwork to succeed',
        'Create interdependent challenges',
        'Facilitate peer learning and collaboration',
        'Balance individual and team rewards',
        'Build collaborative classroom culture',
      ],
      content: [
        { type: 'video', title: 'Cooperative Learning Games', duration: '16 min', points: 20 },
        { type: 'reading', title: 'Social Learning Theory in Practice', points: 15 },
        { type: 'interactive', title: 'Team Challenge Designer', points: 25 },
        { type: 'template', title: 'Collaborative Game Templates', points: 20 },
      ],
      assessment: {
        type: 'Portfolio',
        description: 'Design and implement a collaborative game that promotes teamwork',
        points: 100,
      },
      realWorldApplication: 'Create a collaborative game for your next group project to enhance teamwork.',
      resources: [
        { type: 'video', title: 'Cooperative Learning Games', duration: '16 min' },
        { type: 'article', title: 'Social Learning Theory in Practice' },
        { type: 'interactive', title: 'Team Challenge Designer' },
        { type: 'template', title: 'Collaborative Game Templates' },
      ],
      completed: false,
      locked: true,
    },
    {
      id: 'adaptive-gamification',
      title: 'Adaptive Gamification Systems',
      description: 'Create personalized gamification experiences that adapt to individual student needs and learning styles.',
      duration: '90 min',
      level: 'Advanced',
      impact: 'High',
      skills: ['Personalization', 'Adaptive systems', 'Data-driven design', 'Individual pathways'],
      learningOutcomes: [
        'Understand adaptive learning principles',
        'Design personalized gamification experiences',
        'Use data to inform personalization',
        'Create individual learning pathways',
        'Implement adaptive systems in your classroom',
      ],
      content: [
        { type: 'video', title: 'AI-Powered Gamification', duration: '25 min', points: 30 },
        { type: 'reading', title: 'Adaptive Learning Research', points: 20 },
        { type: 'interactive', title: 'Adaptive System Builder', points: 35 },
        { type: 'template', title: 'Personalization Framework', points: 25 },
      ],
      assessment: {
        type: 'Project + Reflection',
        description: 'Design an adaptive gamification system and reflect on its implementation',
        points: 100,
      },
      realWorldApplication: 'Create a personalized gamification system that adapts to individual student progress.',
      resources: [
        { type: 'video', title: 'AI-Powered Gamification', duration: '25 min' },
        { type: 'article', title: 'Adaptive Learning Research' },
        { type: 'interactive', title: 'Adaptive System Builder' },
        { type: 'template', title: 'Personalization Framework' },
      ],
      completed: false,
      locked: true,
    },
    {
      id: 'assessment-games',
      title: 'Gamified Assessment Strategies',
      description: 'Transform assessments into engaging game experiences that provide meaningful feedback and reduce test anxiety.',
      duration: '65 min',
      level: 'Advanced',
      impact: 'High',
      skills: ['Game-based assessment', 'Formative gaming', 'Feedback loops', 'Reduced anxiety'],
      learningOutcomes: [
        'Design gamified assessments that maintain validity',
        'Create engaging formative assessment games',
        'Provide meaningful feedback through game mechanics',
        'Reduce test anxiety through gamification',
        'Balance fun with rigorous assessment',
      ],
      content: [
        { type: 'video', title: 'Assessment Through Play', duration: '22 min', points: 25 },
        { type: 'reading', title: 'Validating Game-Based Assessment', points: 20 },
        { type: 'interactive', title: 'Assessment Game Designer', points: 30 },
        { type: 'template', title: 'Gamified Assessment Templates', points: 25 },
      ],
      assessment: {
        type: 'Project-Based',
        description: 'Design and validate a gamified assessment that maintains academic rigor',
        points: 100,
      },
      realWorldApplication: 'Transform one of your assessments into an engaging game experience.',
      resources: [
        { type: 'video', title: 'Assessment Through Play', duration: '22 min' },
        { type: 'article', title: 'Validating Game-Based Assessment' },
        { type: 'interactive', title: 'Assessment Game Designer' },
        { type: 'template', title: 'Gamified Assessment Templates' },
      ],
      completed: false,
      locked: true,
    },
    {
      id: 'advanced-inquiry',
      title: 'Advanced Inquiry Frameworks',
      description: 'Master sophisticated inquiry models including PBL, design thinking, and student-led research projects.',
      duration: '80 min',
      level: 'Advanced',
      impact: 'High',
      skills: ['Project-based learning', 'Design thinking', 'Research methods', 'Student autonomy'],
      learningOutcomes: [
        'Master project-based learning frameworks',
        'Apply design thinking to education',
        'Facilitate student-led research projects',
        'Create authentic inquiry experiences',
        'Develop student autonomy and ownership',
      ],
      content: [
        { type: 'video', title: 'Advanced Inquiry Models', duration: '28 min', points: 30 },
        { type: 'reading', title: 'PBL Research & Implementation', points: 25 },
        { type: 'interactive', title: 'PBL Planner Tool', points: 35 },
        { type: 'template', title: 'Advanced Inquiry Templates', points: 30 },
      ],
      assessment: {
        type: 'Portfolio',
        description: 'Design and implement a complete PBL or design thinking project',
        points: 100,
      },
      realWorldApplication: 'Launch a student-led inquiry project using PBL or design thinking frameworks.',
      resources: [
        { type: 'video', title: 'Advanced Inquiry Models', duration: '28 min' },
        { type: 'article', title: 'PBL Research & Implementation' },
        { type: 'interactive', title: 'PBL Planner Tool' },
        { type: 'template', title: 'Advanced Inquiry Templates' },
      ],
      completed: false,
      locked: true,
    },
  ]

  const staticSkillImpacts: SkillImpact[] = [
    {
      skill: 'Student Participation',
      before: 65,
      after: 92,
      improvement: 27,
      description: 'Increase in active student participation during lessons',
    },
    {
      skill: 'Lesson Engagement',
      before: 58,
      after: 88,
      improvement: 30,
      description: 'Improvement in overall lesson engagement scores',
    },
    {
      skill: 'Knowledge Retention',
      before: 62,
      after: 85,
      improvement: 23,
      description: 'Better long-term retention of learned concepts',
    },
    {
      skill: 'Student Motivation',
      before: 59,
      after: 90,
      improvement: 31,
      description: 'Increase in intrinsic motivation to learn',
    },
    {
      skill: 'Classroom Management',
      before: 71,
      after: 89,
      improvement: 18,
      description: 'Reduction in behavioral issues through engagement',
    },
  ]

  const staticAiGuidance: AIGuidance = {
    recommendation: 'Focus on Gamification Fundamentals first, then move to Inquiry Hooks',
    reason: 'Based on your lesson patterns, you create structured lessons that would benefit from gamification elements. Once students are engaged, inquiry-based hooks will deepen their learning.',
    nextSteps: [
      'Complete Gamification Fundamentals module',
      'Apply points system to your next lesson',
      'Try one inquiry hook this week',
      'Track student engagement metrics',
    ],
    personalizedTip: 'Your students respond well to visual rewards. Consider starting with badge systems before introducing leaderboards.',
  }

  const [learningModules, setLearningModules] = useState<LearningModule[]>(staticLearningModules)
  const [skillImpacts, setSkillImpacts] = useState<SkillImpact[]>(staticSkillImpacts)
  const [aiGuidance, setAiGuidance] = useState<AIGuidance>(staticAiGuidance)

  useEffect(() => {
    const shouldFetch = typeof contentId === 'string' && contentId.startsWith('factory-')
    if (!shouldFetch) {
      setLearningModules(staticLearningModules)
      setSkillImpacts(staticSkillImpacts)
      setAiGuidance(staticAiGuidance)
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const res = await axiosInstance.get(`/api/v1/content-registry/by-content-id/${encodeURIComponent(contentId)}`)
        const parsed = parseLearningPathFromRegistry(res?.data)
        if (cancelled) return
        if (Array.isArray(parsed.learningModules) && parsed.learningModules.length > 0) {
          setLearningModules(parsed.learningModules as LearningModule[])
        } else {
          setLearningModules(staticLearningModules)
        }
        if (Array.isArray(parsed.skillImpacts) && parsed.skillImpacts.length > 0) {
          setSkillImpacts(parsed.skillImpacts as SkillImpact[])
        } else {
          setSkillImpacts(staticSkillImpacts)
        }
        if (parsed.aiGuidance && parsed.aiGuidance.recommendation) {
          setAiGuidance(parsed.aiGuidance as AIGuidance)
        } else {
          setAiGuidance(staticAiGuidance)
        }
      } catch {
        if (cancelled) return
        setLearningModules(staticLearningModules)
        setSkillImpacts(staticSkillImpacts)
        setAiGuidance(staticAiGuidance)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [contentId])

  // Determine which modules are unlocked based on completion
  const getUnlockedModules = () => {
    return learningModules.map((module, index) => {
      // First 3 modules are always unlocked
      if (index < 3) {
        return { ...module, locked: false }
      }
      // Module 4 (Quest-Based Learning) unlocks when first 3 are completed
      if (index === 3) {
        const firstThreeCompleted = ['gamification-basics', 'points-badges-leaderboards', 'inquiry-hooks'].every(
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
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 rounded-3xl p-8 text-white shadow-xl">
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
                    3 hours estimated
                  </span>
                </div>
                <h1 className="text-3xl font-bold">Student Engagement Techniques</h1>
                <p className="mt-2 text-amber-100">
                  Master gamification and inquiry-based learning hooks to transform your classroom
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
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">AI-Powered Learning Guidance</h3>
              <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                Personalized
              </span>
            </div>
            <p className="text-sm font-medium text-gray-900 mb-2">{aiGuidance.recommendation}</p>
            <p className="text-sm text-gray-700 mb-4">{aiGuidance.reason}</p>
            <div className="bg-white rounded-lg p-4 border border-blue-200 mb-4">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Personalized Tip</p>
              <p className="text-sm text-gray-700">{aiGuidance.personalizedTip}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Your Next Steps</p>
              <ul className="space-y-1">
                {aiGuidance.nextSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
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
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000"
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
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={currentLevel}
                  onChange={(e) => setCurrentLevel(e.target.value as any)}
                  className="text-xs border border-gray-300 rounded-lg px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-100"
                >
                  <option value="Beginner">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {unlockedModulesList
                .filter(m => currentLevel === 'Beginner' || m.level === currentLevel)
                .map((module, idx) => {
                  const isCompleted = completedModules.includes(module.id)
                  const isActive = activeModule === module.id
                  const originalIndex = learningModules.findIndex(m => m.id === module.id)

                  return (
                    <div
                      key={module.id}
                      className={`rounded-xl border-2 p-6 transition ${
                        isCompleted
                          ? 'bg-green-50 border-green-300'
                          : module.locked
                          ? 'bg-gray-50 border-gray-200 opacity-60'
                          : isActive
                          ? 'bg-amber-50 border-amber-300 shadow-md'
                          : 'bg-white border-gray-200 hover:border-amber-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center text-sm font-bold">
                              {originalIndex + 1}
                            </span>
                            <h3 className="text-lg font-bold text-gray-900">{module.title}</h3>
                            {isCompleted && (
                              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                            )}
                            {module.locked && <Lock className="h-5 w-5 text-gray-400 flex-shrink-0" />}
                          </div>
                          <p className="text-sm text-gray-700 ml-10 mb-3">{module.description}</p>
                          <div className="flex flex-wrap items-center gap-2 ml-10">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getLevelColor(module.level)}`}>
                              {module.level}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getImpactColor(module.impact)}`}>
                              {module.impact} Impact
                            </span>
                            <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {module.duration}
                            </span>
                            {module.assessment && (
                              <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                                {module.assessment.points} points
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="ml-10 mb-4">
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Skills You'll Gain</p>
                        <div className="flex flex-wrap gap-2">
                          {module.skills.map((skill, skillIdx) => (
                            <span
                              key={skillIdx}
                              className="px-2 py-1 rounded bg-white border border-gray-200 text-xs text-gray-700"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {module.learningOutcomes && module.learningOutcomes.length > 0 && (
                        <div className="ml-10 mb-4">
                          <p className="text-sm font-semibold text-gray-900 mb-2">Learning Outcomes</p>
                          <ul className="space-y-1">
                            {module.learningOutcomes.map((outcome, outIdx) => (
                              <li key={outIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                <ArrowRight className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                <span>{outcome}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {isActive && (
                        <>
                          {module.content && Array.isArray(module.content) && module.content.length > 0 && (
                            <div className="ml-10 mb-4 bg-white rounded-lg p-5 border border-amber-200">
                              <p className="text-sm font-semibold text-gray-900 mb-3">Module Content</p>
                              <div className="space-y-3">
                                {module.content.map((item, itemIdx) => {
                                  const ContentIcon =
                                    item.type === 'video'
                                      ? Video
                                      : item.type === 'reading'
                                      ? BookOpen
                                      : item.type === 'interactive'
                                      ? Zap
                                      : item.type === 'project'
                                      ? Rocket
                                      : FileText
                                  return (
                                    <div
                                      key={itemIdx}
                                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200"
                                    >
                                      <div className="flex items-center gap-3">
                                        <ContentIcon className="h-5 w-5 text-amber-600" />
                                        <div>
                                          <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                          {item.duration && (
                                            <p className="text-xs text-gray-500">{item.duration}</p>
                                          )}
                                        </div>
                                      </div>
                                      {item.points && (
                                        <span className="px-2 py-1 rounded bg-amber-100 text-amber-700 text-xs font-semibold">
                                          {item.points} pts
                                        </span>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                          {module.assessment && (
                            <div className="ml-10 mb-4 pt-4 border-t border-gray-200">
                              <p className="text-sm font-semibold text-gray-900 mb-2">Assessment</p>
                              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                                <p className="text-sm font-medium text-gray-900 mb-1">{module.assessment.type}</p>
                                <p className="text-xs text-gray-700">{module.assessment.description}</p>
                                <p className="text-xs text-purple-700 font-semibold mt-1">
                                  {module.assessment.points} points
                                </p>
                              </div>
                            </div>
                          )}
                          {module.realWorldApplication && (
                            <div className="ml-10 mb-4 pt-4 border-t border-gray-200">
                              <p className="text-sm font-semibold text-gray-900 mb-2">Real-World Application</p>
                              <p className="text-sm text-gray-700 bg-blue-50 rounded-lg p-3 border border-blue-200">
                                {module.realWorldApplication}
                              </p>
                            </div>
                          )}
                        </>
                      )}

                      <div className="ml-10 flex items-center gap-3">
                        {module.locked ? (
                          <button
                            disabled
                            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-500 text-sm font-semibold cursor-not-allowed flex items-center gap-2"
                          >
                            <Lock className="h-4 w-4" />
                            {originalIndex === 3 
                              ? 'Locked - Complete first 3 modules to unlock'
                              : 'Locked - Complete previous module to unlock'}
                          </button>
                        ) : isCompleted ? (
                          <button
                            onClick={() => setActiveModule(isActive ? null : module.id)}
                            className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            Review Module
                          </button>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  const moduleRoutes: Record<string, string> = {
                                    'gamification-basics': '/learning-hub/gamification-fundamentals',
                                    'points-badges-leaderboards': '/learning-hub/points-badges-leaderboards',
                                    'inquiry-hooks': '/learning-hub/inquiry-learning-hooks',
                                    'quest-based-learning': '/learning-hub/quest-based-learning',
                                    'collaborative-games': '/learning-hub/collaborative-game-mechanics',
                                    'adaptive-gamification': '/learning-hub/adaptive-gamification',
                                    'assessment-games': '/learning-hub/gamified-assessment',
                                    'advanced-inquiry': '/learning-hub/advanced-inquiry-frameworks',
                                  }
                                  
                                  const route = moduleRoutes[module.id]
                                  if (route) {
                                    navigate(route)
                                  } else {
                                    setActiveModule(isActive ? null : module.id)
                                  }
                                }}
                                className="px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 flex items-center gap-2"
                              >
                                {isActive ? (
                                  <>
                                    <Eye className="h-4 w-4" />
                                    Hide Details
                                  </>
                                ) : (
                                  <>
                                    <Play className="h-4 w-4" />
                                    Start Module
                                  </>
                                )}
                              </button>
                            <button
                              onClick={() => handleModuleComplete(module.id)}
                              className="px-4 py-2 rounded-lg border-2 border-green-600 text-green-600 text-sm font-semibold hover:bg-green-50 flex items-center gap-2"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Mark Complete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Progress Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Overall Completion</span>
                  <span className="text-sm font-bold text-amber-600">{Math.round(totalProgress)}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300"
                    style={{ width: `${totalProgress}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
                  <p className="text-xs text-gray-600">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {unlockedModules.length - completedCount}
                  </p>
                  <p className="text-xs text-gray-600">Remaining</p>
                </div>
              </div>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-600" />
              Achievements
            </h3>
            <div className="space-y-3">
              {[
                { name: 'First Steps', earned: completedCount >= 1, description: 'Complete your first module' },
                { name: 'Gamification Master', earned: completedModules.includes('gamification-basics'), description: 'Master gamification fundamentals' },
                { name: 'Inquiry Expert', earned: completedModules.includes('inquiry-hooks'), description: 'Learn inquiry-based hooks' },
                { name: 'Engagement Champion', earned: completedCount >= 5, description: 'Complete 5 modules' },
                { name: 'Pathway Complete', earned: completedCount === unlockedModules.length, description: 'Finish all modules' },
              ].map((badge, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    badge.earned
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  {badge.earned ? (
                    <Award className="h-5 w-5 text-amber-600 flex-shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${badge.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                      {badge.name}
                    </p>
                    <p className="text-xs text-gray-600">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-3 rounded-lg bg-white border border-amber-200 hover:bg-amber-50 transition flex items-center gap-2">
                <Download className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium text-gray-900">Download Certificate</span>
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg bg-white border border-amber-200 hover:bg-amber-50 transition flex items-center gap-2">
                <Share2 className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium text-gray-900">Share Progress</span>
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg bg-white border border-amber-200 hover:bg-amber-50 transition flex items-center gap-2">
                <Settings className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium text-gray-900">Customize Path</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 text-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">Ready to Transform Your Classroom?</h3>
          <p className="text-amber-100 mb-6">
            Start your first module and begin applying engagement techniques immediately
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                const firstModule = learningModules.find(m => !m.locked)
                if (firstModule) {
                  setActiveModule(firstModule.id)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
              }}
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-amber-600 hover:bg-amber-50 transition flex items-center gap-2"
            >
              <Rocket className="h-4 w-4" />
              Start Learning Path
            </button>
            <button
              onClick={() => navigate('/learning-hub')}
              className="rounded-full border-2 border-white px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition"
            >
              Explore More Paths
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentEngagementPath

