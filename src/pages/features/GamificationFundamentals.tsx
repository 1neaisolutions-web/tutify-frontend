import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Play,
  Pause,
  CheckCircle2,
  Circle,
  Clock,
  Star,
  Download,
  Share2,
  Bookmark,
  Video,
  BookOpen,
  Zap,
  FileText,
  Rocket,
  Target,
  Trophy,
  Award,
  Users,
  Lightbulb,
  TrendingUp,
  BarChart3,
  Gamepad2,
  Sparkles,
  ArrowRight,
  Eye,
  MessageSquare,
  Settings,
  Maximize2,
  Volume2,
  SkipForward,
  SkipBack,
  RefreshCw,
} from 'lucide-react'

interface LessonContent {
  id: string
  type: 'video' | 'reading' | 'interactive' | 'template'
  title: string
  duration?: string
  points: number
  completed: boolean
  content: any
}

interface GameMechanic {
  name: string
  description: string
  examples: string[]
  implementation: string[]
  benefits: string[]
}

interface GamificationDesign {
  objective: string
  targetAudience: string
  mechanics: string[]
  rewards: string[]
  progression: string
}

const GamificationFundamentals = () => {
  const navigate = useNavigate()
  const [currentLesson, setCurrentLesson] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [showDesignTool, setShowDesignTool] = useState(false)
  const [gamificationDesign, setGamificationDesign] = useState<GamificationDesign>({
    objective: '',
    targetAudience: '',
    mechanics: [],
    rewards: [],
    progression: '',
  })

  const lessons: LessonContent[] = [
    {
      id: 'intro-video',
      type: 'video',
      title: 'Introduction to Gamification',
      duration: '12 min',
      points: 20,
      completed: false,
      content: {
        description: 'Learn what gamification is, why it works, and how it can transform your classroom engagement.',
        keyPoints: [
          'Gamification is applying game design elements to non-game contexts',
          'It taps into intrinsic motivation through autonomy, mastery, and purpose',
          'Effective gamification focuses on engagement, not just rewards',
          'It can increase student participation by up to 40%',
          'The goal is meaningful learning, not just points and badges',
        ],
        transcript: 'Welcome to Gamification Fundamentals. In this module, you\'ll learn how to transform your classroom into an engaging learning environment using game mechanics...',
      },
    },
    {
      id: 'psychology-reading',
      type: 'reading',
      title: 'The Psychology of Game-Based Learning',
      points: 15,
      completed: false,
      content: {
        article: `# The Psychology of Game-Based Learning

## Understanding Motivation

Gamification works because it taps into fundamental psychological principles that drive human behavior. Understanding these principles is crucial for effective implementation.

### Intrinsic vs. Extrinsic Motivation

**Intrinsic Motivation** comes from within - students learn because they find it interesting, enjoyable, or personally meaningful. This is the gold standard for education.

**Extrinsic Motivation** comes from external rewards like points, badges, or grades. While useful, over-reliance on extrinsic rewards can undermine intrinsic motivation.

### The Self-Determination Theory

According to Self-Determination Theory, three psychological needs drive motivation:

1. **Autonomy**: Students need to feel in control of their learning
2. **Competence**: Students need to feel capable and see progress
3. **Relatedness**: Students need to feel connected to others

### Flow State

Games excel at creating "flow" - a state of complete absorption where challenge matches skill level. In flow:
- Students lose track of time
- They're fully focused on the task
- They experience deep satisfaction

### Dopamine and Reward Systems

The brain releases dopamine not just when receiving rewards, but when anticipating them. This is why progress bars and "almost there" moments are so powerful.

## Key Takeaways

- Balance intrinsic and extrinsic motivation
- Support autonomy, competence, and relatedness
- Design for flow state experiences
- Use anticipation and progress to maintain engagement`,
        keyTakeaways: [
          'Intrinsic motivation leads to deeper, more lasting learning',
          'Autonomy, competence, and relatedness are essential',
          'Flow state occurs when challenge matches ability',
          'Anticipation can be as powerful as rewards themselves',
        ],
      },
    },
    {
      id: 'workshop',
      type: 'interactive',
      title: 'Gamification Design Workshop',
      points: 25,
      completed: false,
      content: {
        description: 'Use our interactive tool to design your own gamification system for your classroom.',
        steps: [
          'Define your learning objectives',
          'Identify your target audience',
          'Select appropriate game mechanics',
          'Design reward systems',
          'Plan progression pathways',
        ],
      },
    },
    {
      id: 'template',
      type: 'template',
      title: 'Gamification Lesson Template',
      points: 20,
      completed: false,
      content: {
        description: 'Download and customize our ready-to-use gamification template for your lessons.',
        sections: [
          'Learning Objectives',
          'Game Mechanics Selection',
          'Reward System Design',
          'Progression Map',
          'Assessment Integration',
        ],
      },
    },
  ]

  const gameMechanics: GameMechanic[] = [
    {
      name: 'Points',
      description: 'Numerical values awarded for completing tasks or demonstrating skills.',
      examples: [
        'XP (Experience Points) for completing assignments',
        'Bonus points for extra credit work',
        'Participation points for class engagement',
      ],
      implementation: [
        'Create a clear point system with defined values',
        'Display points prominently (leaderboard, student profiles)',
        'Allow points to be redeemed for meaningful rewards',
        'Ensure points reflect actual learning, not just completion',
      ],
      benefits: [
        'Immediate feedback on performance',
        'Quantifiable progress tracking',
        'Motivation through accumulation',
        'Flexible reward system foundation',
      ],
    },
    {
      name: 'Badges',
      description: 'Visual representations of achievements that students can collect and display.',
      examples: [
        '"Master Researcher" badge for excellent research projects',
        '"Collaboration Champion" badge for teamwork',
        '"Growth Mindset" badge for improvement over time',
      ],
      implementation: [
        'Design meaningful badges aligned to learning goals',
        'Create tiered badge systems (bronze, silver, gold)',
        'Allow students to showcase badges in portfolios',
        'Celebrate badge achievements publicly',
      ],
      benefits: [
        'Recognition of diverse achievements',
        'Visual progress representation',
        'Encourages skill development',
        'Builds student identity and pride',
      ],
    },
    {
      name: 'Leaderboards',
      description: 'Rankings that show student progress relative to peers or personal bests.',
      examples: [
        'Class-wide leaderboard for quiz scores',
        'Team leaderboards for group projects',
        'Personal best leaderboard (competing against self)',
      ],
      implementation: [
        'Use multiple leaderboards to avoid single-winner focus',
        'Consider team-based or personal best leaderboards',
        'Update frequently to maintain engagement',
        'Focus on growth, not just current standing',
      ],
      benefits: [
        'Social comparison motivates improvement',
        'Transparent progress tracking',
        'Encourages healthy competition',
        'Celebrates multiple types of achievement',
      ],
    },
    {
      name: 'Levels',
      description: 'Progressive stages that unlock new content, privileges, or challenges.',
      examples: [
        'Novice → Apprentice → Expert → Master levels',
        'Unlocking advanced topics after completing basics',
        'Access to special activities at higher levels',
      ],
      implementation: [
        'Define clear criteria for level advancement',
        'Make levels meaningful, not just cosmetic',
        'Provide clear pathways to next level',
        'Celebrate level-ups as major milestones',
      ],
      benefits: [
        'Clear progression structure',
        'Long-term motivation',
        'Sense of achievement',
        'Organized learning pathways',
      ],
    },
    {
      name: 'Quests',
      description: 'Goal-oriented tasks or missions that guide students through learning experiences.',
      examples: [
        '"Research Quest" - complete a research project',
        '"Collaboration Quest" - work effectively in teams',
        '"Mastery Quest" - demonstrate deep understanding',
      ],
      implementation: [
        'Create narrative context for quests',
        'Design quests with clear objectives and rewards',
        'Allow student choice in quest selection',
        'Make quests progressively more challenging',
      ],
      benefits: [
        'Structured goal-setting',
        'Narrative engagement',
        'Student autonomy',
        'Clear learning pathways',
      ],
    },
    {
      name: 'Progress Bars',
      description: 'Visual indicators showing completion status toward a goal.',
      examples: [
        'Unit completion progress',
        'Skill mastery progress',
        'Semester goal progress',
      ],
      implementation: [
        'Make progress bars visible and accessible',
        'Break large goals into smaller milestones',
        'Update progress in real-time',
        'Celebrate milestone completions',
      ],
      benefits: [
        'Visual progress tracking',
        'Motivation through visible advancement',
        'Clear goal visualization',
        'Reduces overwhelming large goals',
      ],
    },
  ]

  const handleLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId])
      const newProgress = ((completedLessons.length + 1) / lessons.length) * 100
      setProgress(newProgress)
    }
  }

  const handleDesignSubmit = () => {
    // In a real app, this would save the design
    alert('Gamification design saved! You can now implement this in your classroom.')
    setShowDesignTool(false)
  }

  const currentLessonData = lessons[currentLesson]
  const moduleProgress = (completedLessons.length / lessons.length) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => navigate('/learning-hub/student-engagement-path')}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wide">
                    Module 1
                  </span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    45 min
                  </span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {completedLessons.reduce((sum, id) => {
                      const lesson = lessons.find(l => l.id === id)
                      return sum + (lesson?.points || 0)
                    }, 0)} / {lessons.reduce((sum, l) => sum + l.points, 0)} points
                  </span>
                </div>
                <h1 className="text-3xl font-bold">Gamification Fundamentals</h1>
                <p className="mt-2 text-amber-100">
                  Learn the core principles of gamification and how to apply game mechanics to increase student motivation and engagement
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>High Impact</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                <span>{completedLessons.length} of {lessons.length} lessons completed</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>{Math.round(moduleProgress)}% Complete</span>
              </div>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${moduleProgress}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition">
              <Bookmark className="h-5 w-5" />
            </button>
            <button className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Lesson Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-4">Lessons</h3>
            <div className="space-y-2">
              {lessons.map((lesson, idx) => {
                const isActive = idx === currentLesson
                const isCompleted = completedLessons.includes(lesson.id)
                const Icon = lesson.type === 'video' ? Video : lesson.type === 'reading' ? BookOpen : lesson.type === 'interactive' ? Zap : FileText

                return (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentLesson(idx)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      isActive
                        ? 'bg-amber-50 border-2 border-amber-300'
                        : 'border-2 border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? 'bg-green-100 text-green-600'
                          : isActive
                          ? 'bg-amber-100 text-amber-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-semibold">{idx + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="h-3 w-3 flex-shrink-0" />
                          <p className={`text-sm font-semibold truncate ${
                            isActive ? 'text-amber-900' : 'text-gray-900'
                          }`}>
                            {lesson.title}
                          </p>
                        </div>
                        {lesson.duration && (
                          <p className="text-xs text-gray-500">{lesson.duration}</p>
                        )}
                        <p className="text-xs text-gray-500">{lesson.points} points</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            {/* Lesson Header */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <span>Lesson {currentLesson + 1} of {lessons.length}</span>
                    <span>•</span>
                    <span>{currentLessonData.points} points</span>
                    {currentLessonData.duration && (
                      <>
                        <span>•</span>
                        <span>{currentLessonData.duration}</span>
                      </>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{currentLessonData.title}</h2>
                </div>
                {completedLessons.includes(currentLessonData.id) && (
                  <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Completed
                  </span>
                )}
              </div>
            </div>

            {/* Video Lesson */}
            {currentLessonData.type === 'video' && (
              <div className="space-y-6">
                <div className="relative aspect-video rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition"
                    >
                      {isPlaying ? (
                        <Pause className="h-10 w-10" />
                      ) : (
                        <Play className="h-10 w-10 ml-1" />
                      )}
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white w-1/3 rounded-full" />
                    </div>
                    <div className="flex items-center justify-between mt-2 text-white text-xs">
                      <span>0:00</span>
                      <span>{currentLessonData.duration}</span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30">
                      <Maximize2 className="h-4 w-4" />
                    </button>
                    <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30">
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Points</h3>
                  <ul className="space-y-2">
                    {currentLessonData.content.keyPoints.map((point: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Transcript</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{currentLessonData.content.transcript}</p>
                </div>
              </div>
            )}

            {/* Reading Lesson */}
            {currentLessonData.type === 'reading' && (
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: currentLessonData.content.article.replace(/\n/g, '<br />').replace(/#{3}/g, '<h3>').replace(/##/g, '<h2>').replace(/#/g, '<h1>') }} />
                </div>

                <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Takeaways</h3>
                  <ul className="space-y-2">
                    {currentLessonData.content.keyTakeaways.map((takeaway: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <Lightbulb className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Interactive Workshop */}
            {currentLessonData.type === 'interactive' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{currentLessonData.content.description}</h3>
                  <p className="text-sm text-gray-700 mb-4">Follow these steps to design your gamification system:</p>
                  <ol className="space-y-3">
                    {currentLessonData.content.steps.map((step: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {!showDesignTool ? (
                  <button
                    onClick={() => setShowDesignTool(true)}
                    className="w-full px-6 py-4 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition flex items-center justify-center gap-2"
                  >
                    <Zap className="h-5 w-5" />
                    Launch Design Tool
                  </button>
                ) : (
                  <div className="bg-white rounded-xl p-6 border-2 border-amber-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Gamification Design Tool</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Learning Objective</label>
                        <textarea
                          value={gamificationDesign.objective}
                          onChange={(e) => setGamificationDesign({ ...gamificationDesign, objective: e.target.value })}
                          placeholder="What do you want students to learn or achieve?"
                          rows={3}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                        <input
                          type="text"
                          value={gamificationDesign.targetAudience}
                          onChange={(e) => setGamificationDesign({ ...gamificationDesign, targetAudience: e.target.value })}
                          placeholder="e.g., 5th grade math students"
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Game Mechanics</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {['Points', 'Badges', 'Leaderboards', 'Levels', 'Quests', 'Progress Bars'].map((mechanic) => (
                            <button
                              key={mechanic}
                              onClick={() => {
                                if (gamificationDesign.mechanics.includes(mechanic)) {
                                  setGamificationDesign({
                                    ...gamificationDesign,
                                    mechanics: gamificationDesign.mechanics.filter(m => m !== mechanic),
                                  })
                                } else {
                                  setGamificationDesign({
                                    ...gamificationDesign,
                                    mechanics: [...gamificationDesign.mechanics, mechanic],
                                  })
                                }
                              }}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                                gamificationDesign.mechanics.includes(mechanic)
                                  ? 'bg-amber-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {mechanic}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Reward System</label>
                        <input
                          type="text"
                          value={gamificationDesign.rewards.join(', ')}
                          onChange={(e) => setGamificationDesign({ ...gamificationDesign, rewards: e.target.value.split(', ') })}
                          placeholder="e.g., Extra recess, Homework pass, Class privileges"
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Progression Path</label>
                        <textarea
                          value={gamificationDesign.progression}
                          onChange={(e) => setGamificationDesign({ ...gamificationDesign, progression: e.target.value })}
                          placeholder="Describe how students will progress through levels or stages"
                          rows={3}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={handleDesignSubmit}
                          className="flex-1 px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition"
                        >
                          Save Design
                        </button>
                        <button
                          onClick={() => setShowDesignTool(false)}
                          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Template Lesson */}
            {currentLessonData.type === 'template' && (
              <div className="space-y-6">
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{currentLessonData.content.description}</h3>
                  <p className="text-sm text-gray-700 mb-4">This template includes the following sections:</p>
                  <ul className="space-y-2">
                    {currentLessonData.content.sections.map((section: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>{section}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Preview</h3>
                  <div className="space-y-4">
                    {currentLessonData.content.sections.map((section: string, idx: number) => (
                      <div key={idx} className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">{section}</h4>
                        <p className="text-xs text-gray-500 italic">Your content will appear here...</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="w-full px-6 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2">
                  <Download className="h-5 w-5" />
                  Download Template
                </button>
              </div>
            )}

            {/* Game Mechanics Reference */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Core Game Mechanics</h3>
              <div className="space-y-4">
                {gameMechanics.map((mechanic, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{mechanic.name}</h4>
                    <p className="text-sm text-gray-700 mb-3">{mechanic.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Examples</p>
                        <ul className="space-y-1">
                          {mechanic.examples.map((example, exIdx) => (
                            <li key={exIdx} className="text-xs text-gray-700 flex items-start gap-1">
                              <span className="text-amber-600">•</span>
                              <span>{example}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Implementation</p>
                        <ul className="space-y-1">
                          {mechanic.implementation.map((impl, implIdx) => (
                            <li key={implIdx} className="text-xs text-gray-700 flex items-start gap-1">
                              <ArrowRight className="h-3 w-3 text-indigo-600 mt-0.5 flex-shrink-0" />
                              <span>{impl}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Benefits</p>
                        <ul className="space-y-1">
                          {mechanic.benefits.map((benefit, benIdx) => (
                            <li key={benIdx} className="text-xs text-gray-700 flex items-start gap-1">
                              <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                onClick={() => setCurrentLesson(Math.max(0, currentLesson - 1))}
                disabled={currentLesson === 0}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </button>

              <button
                onClick={() => {
                  handleLessonComplete(currentLessonData.id)
                  if (currentLesson < lessons.length - 1) {
                    setCurrentLesson(currentLesson + 1)
                  }
                }}
                className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white text-sm font-semibold rounded-full hover:bg-amber-700 transition"
              >
                {completedLessons.includes(currentLessonData.id) ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Marked Complete
                  </>
                ) : currentLesson === lessons.length - 1 ? (
                  <>
                    <Trophy className="h-4 w-4" />
                    Complete Module
                  </>
                ) : (
                  <>
                    Complete & Next
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Module Completion */}
          {completedLessons.length === lessons.length && (
            <div className="mt-6 rounded-2xl border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-600 mb-4">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Module Complete!</h3>
              <p className="text-gray-700 mb-6">
                You've earned {lessons.reduce((sum, l) => sum + l.points, 0)} points. Great work!
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => navigate('/learning-hub/student-engagement-path')}
                  className="rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700"
                >
                  Continue to Next Module
                </button>
                <button className="rounded-full border-2 border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  Download Certificate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GamificationFundamentals



