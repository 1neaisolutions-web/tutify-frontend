import { useState, useEffect } from 'react'
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
  Layers,
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

interface TieredActivity {
  learningObjective: string
  foundationTier: string
  standardTier: string
  challengeTier: string
  extensionTier: string
  assessment: string
}

interface ReadinessLevel {
  level: string
  description: string
  characteristics: string[]
  activities: string[]
}

const TieredInstructionModule = () => {
  const navigate = useNavigate()
  const [currentLesson, setCurrentLesson] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [showDesignTool, setShowDesignTool] = useState(false)
  const [tieredActivity, setTieredActivity] = useState<TieredActivity>({
    learningObjective: '',
    foundationTier: '',
    standardTier: '',
    challengeTier: '',
    extensionTier: '',
    assessment: '',
  })

  const lessons: LessonContent[] = [
    {
      id: 'intro-video',
      type: 'video',
      title: 'Introduction to Tiered Instruction',
      duration: '12 min',
      points: 20,
      completed: false,
      content: {
        description: 'Learn the fundamentals of tiered instruction and how to create lessons that challenge all students at their appropriate level.',
        keyPoints: [
          'Tiered instruction maintains the same learning objectives for all students',
          'Activities vary in complexity, not in learning goals',
          'Readiness assessment is crucial for effective tiering',
          'Tiered lessons promote equity by ensuring all students can access grade-level content',
          'Effective tiering requires clear criteria for each complexity level',
        ],
        transcript: 'Welcome to Tiered Instruction Frameworks. In this module, you\'ll learn how to create lessons that challenge every student at their appropriate level while maintaining the same learning objectives...',
      },
    },
    {
      id: 'readiness-reading',
      type: 'reading',
      title: 'Readiness Assessment Strategies',
      points: 15,
      completed: false,
      content: {
        article: `# Readiness Assessment Strategies

## Understanding Student Readiness

Student readiness refers to a student's current knowledge, understanding, and skill level related to a specific learning objective. Unlike ability grouping, readiness is content-specific and can vary across subjects and topics.

### Key Principles

**Readiness is Dynamic**: A student may be advanced in one area but need foundational support in another. Readiness changes as students learn and grow.

**Readiness is Content-Specific**: A student's readiness in mathematics doesn't predict their readiness in reading comprehension.

**Readiness Assessment is Ongoing**: Regular formative assessment helps you understand where each student is in their learning journey.

## Assessment Methods

### 1. Pre-Assessment

Use quick checks before starting a new unit to gauge prior knowledge:

- **Entrance Tickets**: 2-3 questions that reveal understanding
- **KWL Charts**: What students Know, Want to know, Learned
- **Concept Maps**: Visual representations of understanding
- **Quick Writes**: Brief responses to open-ended prompts

### 2. Formative Assessment

Ongoing checks during instruction:

- **Observation**: Watch how students approach tasks
- **Exit Tickets**: End-of-lesson checks for understanding
- **Think-Pair-Share**: Peer discussions reveal understanding
- **Whiteboard Responses**: Quick whole-class checks

### 3. Performance-Based Assessment

Observe students in action:

- **Problem-Solving Tasks**: See how students approach challenges
- **Explanations**: Ask students to explain their thinking
- **Work Samples**: Review student work for patterns
- **Self-Assessment**: Students reflect on their own readiness

## Determining Readiness Levels

### Foundation Level
Students who:
- Have limited prior knowledge
- Need concrete examples and scaffolding
- Require step-by-step guidance
- Benefit from visual supports and manipulatives

### Standard Level
Students who:
- Have basic understanding
- Can work with some independence
- Understand core concepts
- Can apply learning with support

### Challenge Level
Students who:
- Have strong prior knowledge
- Can work independently
- Understand concepts deeply
- Can extend learning to new contexts

### Extension Level
Students who:
- Have advanced understanding
- Can create original work
- Can teach others
- Can apply learning to complex, real-world problems

## Key Takeaways

- Assess readiness regularly, not just at the start
- Use multiple assessment methods for accuracy
- Remember readiness is content-specific
- Create clear criteria for each readiness level
- Adjust tiers based on ongoing assessment data`,
        keyTakeaways: [
          'Readiness is dynamic and content-specific',
          'Use multiple assessment methods for accuracy',
          'Foundation, Standard, Challenge, and Extension levels guide tiering',
          'Ongoing assessment is essential for effective tiering',
          'Clear criteria help determine appropriate tiers',
        ],
      },
    },
    {
      id: 'designer-tool',
      type: 'interactive',
      title: 'Tiered Activity Designer',
      points: 30,
      completed: false,
      content: {
        description: 'Design tiered activities that maintain learning objective alignment while varying complexity.',
        steps: [
          'Define your learning objective',
          'Assess student readiness levels',
          'Create activities for each tier',
          'Ensure all tiers address the same objective',
          'Design assessment that works across tiers',
        ],
      },
    },
    {
      id: 'template-library',
      type: 'template',
      title: 'Tiered Lesson Template Library',
      points: 20,
      completed: false,
      content: {
        description: 'Download ready-to-use templates for creating tiered lessons across subjects and grade levels.',
        sections: [
          'Learning Objective Definition',
          'Readiness Assessment Plan',
          'Tiered Activity Design',
          'Assessment Alignment',
          'Reflection and Adjustment',
        ],
      },
    },
  ]

  const readinessLevels: ReadinessLevel[] = [
    {
      level: 'Foundation',
      description: 'Students need foundational support and scaffolding',
      characteristics: [
        'Limited prior knowledge',
        'Needs concrete examples',
        'Requires step-by-step guidance',
        'Benefits from visual supports',
      ],
      activities: [
        'Use manipulatives and visuals',
        'Provide sentence starters',
        'Break tasks into smaller steps',
        'Offer guided practice',
      ],
    },
    {
      level: 'Standard',
      description: 'Students have basic understanding and can work with some independence',
      characteristics: [
        'Basic understanding of concepts',
        'Can work with some independence',
        'Understands core concepts',
        'Can apply learning with support',
      ],
      activities: [
        'Provide structured practice',
        'Use guided questions',
        'Offer peer collaboration',
        'Include checkpoints',
      ],
    },
    {
      level: 'Challenge',
      description: 'Students have strong understanding and can work independently',
      characteristics: [
        'Strong prior knowledge',
        'Can work independently',
        'Deep understanding of concepts',
        'Can extend to new contexts',
      ],
      activities: [
        'Open-ended problems',
        'Multiple solution paths',
        'Real-world applications',
        'Peer teaching opportunities',
      ],
    },
    {
      level: 'Extension',
      description: 'Students have advanced understanding and can create original work',
      characteristics: [
        'Advanced understanding',
        'Can create original work',
        'Can teach others',
        'Can apply to complex problems',
      ],
      activities: [
        'Independent research projects',
        'Create original solutions',
        'Design new problems',
        'Mentor other students',
      ],
    },
  ]

  // Load completed lessons from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('tiered-instruction-completed')
    if (saved) {
      setCompletedLessons(JSON.parse(saved))
      const savedLessons = JSON.parse(saved)
      setProgress((savedLessons.length / lessons.length) * 100)
    }
  }, [])

  // Save completed lessons to localStorage
  useEffect(() => {
    localStorage.setItem('tiered-instruction-completed', JSON.stringify(completedLessons))
  }, [completedLessons])

  const handleLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      const newCompleted = [...completedLessons, lessonId]
      setCompletedLessons(newCompleted)
      setProgress((newCompleted.length / lessons.length) * 100)
    }
  }

  const handleDesignSubmit = () => {
    if (!tieredActivity.learningObjective || !tieredActivity.foundationTier || !tieredActivity.standardTier) {
      alert('Please fill in at least the learning objective, foundation tier, and standard tier.')
      return
    }
    alert('Tiered activity design saved! You can now implement this in your classroom.')
    setShowDesignTool(false)
  }

  const currentLessonData = lessons[currentLesson]
  const moduleProgress = (completedLessons.length / lessons.length) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => navigate('/learning-hub/advanced-differentiation-path')}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wide">
                    Module 1 of 6
                  </span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    40 min
                  </span>
                </div>
                <h1 className="text-3xl font-bold">Tiered Instruction Frameworks</h1>
                <p className="mt-2 text-green-100">
                  Master the art of creating tiered lessons that challenge all students at their appropriate level
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>{completedLessons.length} of {lessons.length} lessons completed</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>{Math.round(moduleProgress)}% Complete</span>
              </div>
            </div>
            <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${moduleProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Lessons Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-4">Lessons</h3>
            <div className="space-y-2">
              {lessons.map((lesson, idx) => {
                const isCompleted = completedLessons.includes(lesson.id)
                const isActive = idx === currentLesson
                return (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentLesson(idx)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      isActive
                        ? 'bg-green-100 border-2 border-green-500 text-green-900'
                        : isCompleted
                        ? 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Circle className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="text-xs font-semibold">Lesson {idx + 1}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      {lesson.type === 'video' && <Video className="h-3 w-3" />}
                      {lesson.type === 'reading' && <BookOpen className="h-3 w-3" />}
                      {lesson.type === 'interactive' && <Zap className="h-3 w-3" />}
                      {lesson.type === 'template' && <FileText className="h-3 w-3" />}
                      <span>{lesson.title}</span>
                    </div>
                    {lesson.duration && (
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {lesson.duration}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Progress</span>
                <span className="text-xs font-semibold text-gray-900">{Math.round(moduleProgress)}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-600 rounded-full transition-all duration-300"
                  style={{ width: `${moduleProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            {/* Video Lesson */}
            {currentLessonData.type === 'video' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Video className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Video Lesson</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{currentLessonData.title}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      {currentLessonData.points} points
                    </span>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                      <Bookmark className="h-5 w-5 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                      <Share2 className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-xl aspect-video flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-600 opacity-20"></div>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="relative z-10 w-20 h-20 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition shadow-xl"
                  >
                    {isPlaying ? (
                      <Pause className="h-8 w-8 text-green-600 ml-1" />
                    ) : (
                      <Play className="h-8 w-8 text-green-600 ml-1" />
                    )}
                  </button>
                  {isPlaying && (
                    <div className="absolute bottom-4 left-4 right-4 z-10">
                      <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Key Points</h3>
                  <ul className="space-y-2">
                    {currentLessonData.content.keyPoints?.map((point: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Transcript</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{currentLessonData.content.transcript}</p>
                </div>

                <button
                  onClick={() => handleLessonComplete(currentLessonData.id)}
                  disabled={completedLessons.includes(currentLessonData.id)}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {completedLessons.includes(currentLessonData.id) ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Lesson Completed
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Mark as Complete
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Reading Lesson */}
            {currentLessonData.type === 'reading' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Reading</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{currentLessonData.title}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      {currentLessonData.points} points
                    </span>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                      <Download className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <div className="bg-white rounded-lg p-8 border border-gray-200">
                    <div
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: currentLessonData.content.article?.replace(/\n/g, '<br />').replace(/#{3}/g, '<h3>').replace(/##/g, '<h2>').replace(/#/g, '<h1>') || '',
                      }}
                    />
                  </div>
                </div>

                {currentLessonData.content.keyTakeaways && (
                  <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Key Takeaways</h3>
                    <ul className="space-y-2">
                      {currentLessonData.content.keyTakeaways.map((takeaway: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <Lightbulb className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={() => handleLessonComplete(currentLessonData.id)}
                  disabled={completedLessons.includes(currentLessonData.id)}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {completedLessons.includes(currentLessonData.id) ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Lesson Completed
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Mark as Complete
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Interactive Tool */}
            {currentLessonData.type === 'interactive' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Interactive Tool</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{currentLessonData.title}</h2>
                    <p className="mt-2 text-gray-600">{currentLessonData.content.description}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    {currentLessonData.points} points
                  </span>
                </div>

                <div className="bg-green-50 rounded-lg p-6 border border-green-200 mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Design Steps</h3>
                  <ol className="space-y-2">
                    {currentLessonData.content.steps?.map((step: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Learning Objective *
                    </label>
                    <textarea
                      value={tieredActivity.learningObjective}
                      onChange={(e) => setTieredActivity({ ...tieredActivity, learningObjective: e.target.value })}
                      placeholder="What should all students learn? (e.g., Students will be able to solve multi-step word problems)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Foundation Tier *
                      </label>
                      <textarea
                        value={tieredActivity.foundationTier}
                        onChange={(e) => setTieredActivity({ ...tieredActivity, foundationTier: e.target.value })}
                        placeholder="Activity for students needing foundational support..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        rows={4}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Standard Tier *
                      </label>
                      <textarea
                        value={tieredActivity.standardTier}
                        onChange={(e) => setTieredActivity({ ...tieredActivity, standardTier: e.target.value })}
                        placeholder="Activity for students with basic understanding..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        rows={4}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Challenge Tier
                      </label>
                      <textarea
                        value={tieredActivity.challengeTier}
                        onChange={(e) => setTieredActivity({ ...tieredActivity, challengeTier: e.target.value })}
                        placeholder="Activity for students with strong understanding..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        rows={4}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Extension Tier
                      </label>
                      <textarea
                        value={tieredActivity.extensionTier}
                        onChange={(e) => setTieredActivity({ ...tieredActivity, extensionTier: e.target.value })}
                        placeholder="Activity for students with advanced understanding..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        rows={4}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Assessment (How will you check understanding across all tiers?)
                    </label>
                    <textarea
                      value={tieredActivity.assessment}
                      onChange={(e) => setTieredActivity({ ...tieredActivity, assessment: e.target.value })}
                      placeholder="Describe how you'll assess learning across all tiers..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Readiness Level Guide</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {readinessLevels.map((level, idx) => (
                        <div key={idx} className="bg-white rounded p-3 border border-gray-200">
                          <h5 className="text-xs font-semibold text-gray-900 mb-1">{level.level}</h5>
                          <p className="text-xs text-gray-600 mb-2">{level.description}</p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {level.characteristics.slice(0, 2).map((char, charIdx) => (
                              <li key={charIdx}>• {char}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleDesignSubmit}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    Save Tiered Activity Design
                  </button>
                </div>

                <button
                  onClick={() => handleLessonComplete(currentLessonData.id)}
                  disabled={completedLessons.includes(currentLessonData.id)}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {completedLessons.includes(currentLessonData.id) ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Lesson Completed
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Mark as Complete
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Template Lesson */}
            {currentLessonData.type === 'template' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Template</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{currentLessonData.title}</h2>
                    <p className="mt-2 text-gray-600">{currentLessonData.content.description}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    {currentLessonData.points} points
                  </span>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Template Sections</h3>
                  <div className="space-y-3">
                    {currentLessonData.content.sections?.map((section: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-semibold">
                          {idx + 1}
                        </div>
                        <span className="text-sm text-gray-700">{section}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition flex flex-col items-center gap-2">
                    <Download className="h-6 w-6 text-green-600" />
                    <span className="text-sm font-semibold text-gray-900">Elementary Template</span>
                    <span className="text-xs text-gray-600">Grades K-5</span>
                  </button>
                  <button className="p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition flex flex-col items-center gap-2">
                    <Download className="h-6 w-6 text-green-600" />
                    <span className="text-sm font-semibold text-gray-900">Middle School Template</span>
                    <span className="text-xs text-gray-600">Grades 6-8</span>
                  </button>
                  <button className="p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition flex flex-col items-center gap-2">
                    <Download className="h-6 w-6 text-green-600" />
                    <span className="text-sm font-semibold text-gray-900">High School Template</span>
                    <span className="text-xs text-gray-600">Grades 9-12</span>
                  </button>
                </div>

                <button
                  onClick={() => handleLessonComplete(currentLessonData.id)}
                  disabled={completedLessons.includes(currentLessonData.id)}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {completedLessons.includes(currentLessonData.id) ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Lesson Completed
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Mark as Complete
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TieredInstructionModule



