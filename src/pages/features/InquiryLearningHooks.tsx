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
  Search,
  Brain,
  HelpCircle,
  Beaker,
  Flame,
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

interface InquiryHook {
  type: string
  description: string
  example: string
  gradeLevel: string
  subject: string
  implementation: string[]
}

interface QuestionFramework {
  level: string
  description: string
  examples: string[]
  whenToUse: string
}

const InquiryLearningHooks = () => {
  const navigate = useNavigate()
  const [currentLesson, setCurrentLesson] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [showHookGenerator, setShowHookGenerator] = useState(false)
  const [hookInput, setHookInput] = useState({
    subject: '',
    gradeLevel: '',
    topic: '',
    hookType: '',
  })
  const [generatedHook, setGeneratedHook] = useState<any>(null)

  const lessons: LessonContent[] = [
    {
      id: 'art-of-hook',
      type: 'video',
      title: 'The Art of the Hook',
      duration: '18 min',
      points: 20,
      completed: false,
      content: {
        description: 'Learn how to create compelling hooks that spark curiosity and launch meaningful inquiry experiences.',
        keyPoints: [
          'Hooks should create cognitive dissonance or wonder',
          'Use authentic, real-world phenomena when possible',
          'Connect to students\' prior knowledge and interests',
          'Leave questions unanswered to drive inquiry',
          'Make hooks visual, interactive, or surprising',
        ],
        transcript: 'Welcome to Inquiry-Based Learning Hooks. A great hook is the foundation of inquiry-based learning...',
      },
    },
    {
      id: 'hook-types',
      type: 'reading',
      title: 'Types of Inquiry Hooks',
      points: 15,
      completed: false,
      content: {
        article: `# Types of Inquiry Hooks

## Phenomenon-Based Hooks

Phenomena are observable events that spark wonder and questions. They're perfect for launching inquiry because they're:
- **Authentic**: Real events students can observe or experience
- **Mysterious**: Create questions that need investigation
- **Relevant**: Connect to students' lives and interests

### Examples:
- Why do some objects float while others sink?
- What causes the phases of the moon?
- How do plants know which way to grow?

## Problem-Based Hooks

Present students with a real-world problem that requires investigation to solve. Problems should be:
- **Complex**: Require multiple steps to solve
- **Authentic**: Real problems people face
- **Open-ended**: Multiple possible solutions

### Examples:
- How can we reduce food waste in our school?
- Design a solution for clean water access
- What's the best way to reduce energy consumption?

## Question-Based Hooks

Start with a compelling question that students want to answer. Questions should be:
- **Open-ended**: Not answerable with yes/no
- **Investigateable**: Can be explored through inquiry
- **Engaging**: Spark curiosity and interest

### Examples:
- What makes some materials stronger than others?
- How do animals adapt to their environments?
- Why do some communities thrive while others struggle?

## Mystery Hooks

Present a mystery or puzzle that students must solve through investigation. Mysteries should be:
- **Intriguing**: Capture attention immediately
- **Solvable**: Students can find answers through inquiry
- **Relevant**: Connect to learning objectives

### Examples:
- The Case of the Disappearing Water
- Mystery of the Changing Leaves
- The Puzzle of the Ancient Artifact`,
        keyTakeaways: [
          'Different hook types work for different learning goals',
          'Authentic phenomena create the strongest hooks',
          'Hooks should connect to students\' interests and experiences',
          'Leave questions unanswered to drive inquiry',
        ],
      },
    },
    {
      id: 'hook-generator',
      type: 'interactive',
      title: 'Hook Generator Tool',
      points: 25,
      completed: false,
      content: {
        description: 'Use our AI-powered tool to generate inquiry hooks tailored to your subject and grade level.',
        steps: [
          'Select your subject area',
          'Choose grade level',
          'Enter topic or concept',
          'Select hook type',
          'Generate and customize',
        ],
      },
    },
    {
      id: 'question-design',
      type: 'reading',
      title: 'Designing Inquiry Questions',
      points: 15,
      completed: false,
      content: {
        article: `# Designing Inquiry Questions

## Question Levels

Effective inquiry questions exist at different cognitive levels, guiding students from exploration to deep understanding.

### Exploratory Questions
These questions help students explore and observe:
- "What do you notice about...?"
- "What patterns do you see?"
- "What happens when...?"

### Investigative Questions
These questions guide deeper investigation:
- "How does X affect Y?"
- "What causes...?"
- "What is the relationship between...?"

### Evaluative Questions
These questions require analysis and judgment:
- "Which solution is most effective and why?"
- "What evidence supports...?"
- "How confident are you in your conclusion?"`,
        keyTakeaways: [
          'Use questions at different cognitive levels',
          'Start with exploratory, move to investigative',
          'Questions should guide, not dictate inquiry',
          'Encourage students to generate their own questions',
        ],
      },
    },
    {
      id: 'template',
      type: 'template',
      title: 'Inquiry Lesson Framework',
      points: 20,
      completed: false,
      content: {
        description: 'Download a complete framework for designing inquiry-based lessons with hooks.',
        sections: [
          'Hook Design',
          'Question Generation',
          'Investigation Planning',
          'Data Collection',
          'Conclusion & Reflection',
        ],
      },
    },
  ]

  const hookTypes: InquiryHook[] = [
    {
      type: 'Phenomenon-Based',
      description: 'Start with an observable, intriguing phenomenon',
      example: 'Show a video of a plant growing toward light, then ask: "Why does the plant bend?"',
      gradeLevel: 'All grades',
      subject: 'Science',
      implementation: [
        'Present the phenomenon visually',
        'Ask "What do you notice?"',
        'Encourage questions and wonderings',
        'Guide students to investigate',
      ],
    },
    {
      type: 'Problem-Based',
      description: 'Present a real-world problem to solve',
      example: 'Students discover their school uses 500 plastic bottles daily. Challenge: "How can we reduce this?"',
      gradeLevel: '3-12',
      subject: 'All subjects',
      implementation: [
        'Present the problem authentically',
        'Allow students to explore the problem',
        'Guide investigation of possible solutions',
        'Support solution design and testing',
      ],
    },
    {
      type: 'Mystery',
      description: 'Present a mystery or puzzle to solve',
      example: 'Students find footprints, broken branches, and scattered seeds. "What happened here?"',
      gradeLevel: 'K-8',
      subject: 'Science, Social Studies',
      implementation: [
        'Set up the mystery scene',
        'Provide clues gradually',
        'Encourage hypothesis formation',
        'Guide investigation to solve mystery',
      ],
    },
    {
      type: 'Controversy',
      description: 'Present a controversial question or dilemma',
      example: 'Should we build a new playground or plant a garden? Both can\'t fit.',
      gradeLevel: '6-12',
      subject: 'Social Studies, Science',
      implementation: [
        'Present the controversy',
        'Explore multiple perspectives',
        'Investigate evidence for each side',
        'Support reasoned conclusions',
      ],
    },
  ]

  const questionFrameworks: QuestionFramework[] = [
    {
      level: 'Exploratory',
      description: 'Questions that help students observe and explore',
      examples: [
        'What do you notice about...?',
        'What patterns do you see?',
        'What happens when...?',
        'What questions do you have?',
      ],
      whenToUse: 'Beginning of inquiry, when introducing new concepts',
    },
    {
      level: 'Investigative',
      description: 'Questions that guide deeper investigation',
      examples: [
        'How does X affect Y?',
        'What causes...?',
        'What is the relationship between...?',
        'What would happen if...?',
      ],
      whenToUse: 'During investigation, when students are exploring',
    },
    {
      level: 'Analytical',
      description: 'Questions that require analysis and reasoning',
      examples: [
        'Why do you think...?',
        'What evidence supports...?',
        'How do you know...?',
        'What patterns explain...?',
      ],
      whenToUse: 'When analyzing data and drawing conclusions',
    },
    {
      level: 'Evaluative',
      description: 'Questions that require judgment and evaluation',
      examples: [
        'Which solution is most effective and why?',
        'How confident are you in your conclusion?',
        'What are the limitations of...?',
        'What would you do differently?',
      ],
      whenToUse: 'When evaluating solutions and reflecting on learning',
    },
  ]

  const handleLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId])
      const newProgress = ((completedLessons.length + 1) / lessons.length) * 100
      setProgress(newProgress)
    }
  }

  const handleGenerateHook = () => {
    if (!hookInput.subject || !hookInput.topic) return
    
    setTimeout(() => {
      const mockHook = {
        hook: `Why do ${hookInput.topic} behave differently in different conditions?`,
        type: hookInput.hookType || 'Phenomenon-Based',
        questions: [
          `What do you notice about ${hookInput.topic}?`,
          `What patterns do you observe?`,
          `What questions do you have?`,
        ],
        investigation: [
          'Observe and document initial observations',
          'Formulate hypotheses',
          'Design experiments or investigations',
          'Collect and analyze data',
          'Draw conclusions',
        ],
      }
      setGeneratedHook(mockHook)
    }, 1500)
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
                onClick={() => navigate('/learning-hub/student-engagement-path')}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wide">
                    Module 3
                  </span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    50 min
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
                <h1 className="text-3xl font-bold">Inquiry-Based Learning Hooks</h1>
                <p className="mt-2 text-green-100">
                  Discover powerful strategies to spark curiosity and launch inquiry-based learning experiences
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
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
                        ? 'bg-green-50 border-2 border-green-300'
                        : 'border-2 border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? 'bg-green-100 text-green-600'
                          : isActive
                          ? 'bg-green-100 text-green-600'
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
                            isActive ? 'text-green-900' : 'text-gray-900'
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
                </div>

                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Points</h3>
                  <ul className="space-y-2">
                    {currentLessonData.content.keyPoints.map((point: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Reading Lesson */}
            {currentLessonData.type === 'reading' && (
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: currentLessonData.content.article.replace(/\n/g, '<br />').replace(/#{3}/g, '<h3>').replace(/##/g, '<h2>').replace(/#/g, '<h1>') }} />
                </div>

                {currentLessonData.content.keyTakeaways && (
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
                )}
              </div>
            )}

            {/* Hook Generator Interactive */}
            {currentLessonData.type === 'interactive' && currentLessonData.id === 'hook-generator' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{currentLessonData.content.description}</h3>
                  
                  {!showHookGenerator ? (
                    <button
                      onClick={() => setShowHookGenerator(true)}
                      className="w-full px-6 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                    >
                      <Zap className="h-5 w-5" />
                      Launch Hook Generator
                    </button>
                  ) : (
                    <div className="bg-white rounded-xl p-6 border-2 border-green-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Inquiry Hook Generator</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                            <select
                              value={hookInput.subject}
                              onChange={(e) => setHookInput({ ...hookInput, subject: e.target.value })}
                              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                            >
                              <option value="">Select subject</option>
                              <option value="Science">Science</option>
                              <option value="Math">Math</option>
                              <option value="Social Studies">Social Studies</option>
                              <option value="English">English</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
                            <select
                              value={hookInput.gradeLevel}
                              onChange={(e) => setHookInput({ ...hookInput, gradeLevel: e.target.value })}
                              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                            >
                              <option value="">Select grade</option>
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                                <option key={grade} value={grade.toString()}>
                                  Grade {grade}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Topic or Concept</label>
                          <input
                            type="text"
                            value={hookInput.topic}
                            onChange={(e) => setHookInput({ ...hookInput, topic: e.target.value })}
                            placeholder="e.g., Photosynthesis, Fractions, Ancient Civilizations"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Hook Type</label>
                          <select
                            value={hookInput.hookType}
                            onChange={(e) => setHookInput({ ...hookInput, hookType: e.target.value })}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          >
                            <option value="">Select type</option>
                            <option value="Phenomenon-Based">Phenomenon-Based</option>
                            <option value="Problem-Based">Problem-Based</option>
                            <option value="Mystery">Mystery</option>
                            <option value="Controversy">Controversy</option>
                          </select>
                        </div>
                        <button
                          onClick={handleGenerateHook}
                          disabled={!hookInput.subject || !hookInput.topic}
                          className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                        >
                          <Sparkles className="h-4 w-4" />
                          Generate Hook
                        </button>

                        {generatedHook && (
                          <div className="mt-6 bg-green-50 rounded-lg p-6 border border-green-200">
                            <h4 className="text-base font-semibold text-gray-900 mb-3">Generated Inquiry Hook</h4>
                            <div className="bg-white rounded-lg p-4 border border-green-200 mb-4">
                              <p className="text-lg font-medium text-gray-900 mb-2">{generatedHook.hook}</p>
                              <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">
                                {generatedHook.type}
                              </span>
                            </div>
                            <div className="mb-4">
                              <p className="text-sm font-semibold text-gray-900 mb-2">Guiding Questions:</p>
                              <ul className="space-y-1">
                                {generatedHook.questions.map((q: string, idx: number) => (
                                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                    <HelpCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span>{q}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 mb-2">Investigation Steps:</p>
                              <ol className="space-y-1">
                                {generatedHook.investigation.map((step: string, idx: number) => (
                                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-semibold">
                                      {idx + 1}
                                    </span>
                                    <span>{step}</span>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Hook Types Examples */}
                <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hook Type Examples</h3>
                  <div className="space-y-4">
                    {hookTypes.map((hook, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-5 border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-base font-semibold text-gray-900">{hook.type}</h4>
                          <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">
                            {hook.gradeLevel}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{hook.description}</p>
                        <div className="bg-white rounded-lg p-3 border border-green-200 mb-3">
                          <p className="text-xs font-semibold text-gray-600 mb-1">Example:</p>
                          <p className="text-sm text-gray-900">{hook.example}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">Implementation:</p>
                          <ul className="space-y-1">
                            {hook.implementation.map((step, stepIdx) => (
                              <li key={stepIdx} className="text-xs text-gray-700 flex items-start gap-1">
                                <ArrowRight className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Question Frameworks */}
                {currentLessonData.id === 'hook-generator' && (
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Frameworks</h3>
                    <div className="space-y-4">
                      {questionFrameworks.map((framework, idx) => (
                        <div key={idx} className="bg-white rounded-lg p-5 border border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-base font-semibold text-gray-900">{framework.level} Questions</h4>
                            <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold">
                              {framework.whenToUse}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-3">{framework.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {framework.examples.map((example, exIdx) => (
                              <div key={exIdx} className="bg-blue-50 rounded p-2 border border-blue-200">
                                <p className="text-sm text-gray-900">{example}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
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
                  <ul className="space-y-2">
                    {currentLessonData.content.sections.map((section: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>{section}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button className="w-full px-6 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2">
                  <Download className="h-5 w-5" />
                  Download Template
                </button>
              </div>
            )}

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
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white text-sm font-semibold rounded-full hover:bg-green-700 transition"
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

export default InquiryLearningHooks

