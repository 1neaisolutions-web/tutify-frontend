import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Play,
  Pause,
  CheckCircle2,
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
  Lightbulb,
  TrendingUp,
  ArrowRight,
  Eye,
  Code,
  Cpu,
  Network,
  Layers,
  Brain,
  Sparkles,
} from 'lucide-react'

interface LessonContent {
  id: string
  type: 'video' | 'reading' | 'interactive' | 'template' | 'project'
  title: string
  duration?: string
  points: number
  completed: boolean
  content: any
}

interface ComputationalThinkingPillar {
  pillar: string
  name: string
  description: string
  examples: string[]
  activities: string[]
}

interface CodingTool {
  name: string
  type: 'block-based' | 'text-based' | 'unplugged'
  gradeLevel: string
  description: string
  link?: string
}

const ComputationalThinkingModule = () => {
  const navigate = useNavigate()
  const [currentLesson, setCurrentLesson] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [showWorkshop, setShowWorkshop] = useState(false)
  const [showLessonDesigner, setShowLessonDesigner] = useState(false)

  const lessons: LessonContent[] = [
    {
      id: 'ct-fundamentals',
      type: 'video',
      title: 'Computational Thinking Fundamentals',
      duration: '22 min',
      points: 20,
      completed: false,
      content: {
        description: 'Understand the four pillars of computational thinking and how they apply across disciplines.',
        keyPoints: [
          'Decomposition: Breaking problems into smaller parts',
          'Pattern Recognition: Identifying similarities and patterns',
          'Abstraction: Focusing on essential details',
          'Algorithm Design: Creating step-by-step solutions',
          'Computational thinking applies to all subjects',
        ],
      },
    },
    {
      id: 'coding-classroom',
      type: 'reading',
      title: 'Coding in the Classroom',
      points: 15,
      completed: false,
      content: {
        article: `# Coding in the Classroom

## Why Teach Coding?

Coding teaches students to think logically, solve problems systematically, and express creativity through technology. It's not just about programming—it's about developing computational thinking skills.

### Benefits of Coding Education

**Problem-Solving**: Coding requires breaking complex problems into manageable steps.

**Logical Thinking**: Students learn to think sequentially and logically.

**Creativity**: Coding allows students to create and express ideas.

**Persistence**: Debugging teaches resilience and persistence.

**Future-Ready**: Coding skills are increasingly important in all careers.

### Approaches to Teaching Coding

**Block-Based Programming**: Visual, drag-and-drop coding (Scratch, Blockly)
- Best for beginners
- Reduces syntax errors
- Focuses on logic

**Text-Based Programming**: Traditional coding languages (Python, JavaScript)
- More powerful and flexible
- Better for advanced students
- Closer to professional coding

**Unplugged Activities**: Coding concepts without computers
- Teaches concepts without technology barriers
- Accessible to all students
- Builds foundational understanding`,
        keyTakeaways: [
          'Start with block-based programming for beginners',
          'Use unplugged activities to teach concepts',
          'Integrate coding into existing curriculum',
          'Focus on computational thinking, not just syntax',
        ],
      },
    },
    {
      id: 'scratch-workshop',
      type: 'interactive',
      title: 'Scratch/Blockly Workshop',
      points: 30,
      completed: false,
      content: {
        description: 'Hands-on workshop using block-based programming tools to create interactive projects.',
        steps: [
          'Introduction to block-based programming',
          'Create your first program',
          'Add interactivity and animation',
          'Share and remix projects',
          'Plan integration into your curriculum',
        ],
      },
    },
    {
      id: 'unplugged',
      type: 'video',
      title: 'Unplugged Activities',
      duration: '18 min',
      points: 15,
      completed: false,
      content: {
        description: 'Learn to teach computational thinking concepts without computers using engaging activities.',
        keyPoints: [
          'Unplugged activities teach core concepts',
          'No technology barriers for students',
          'Engaging and hands-on',
          'Builds foundation for coding',
          'Can be integrated into any subject',
        ],
      },
    },
    {
      id: 'ct-lesson-project',
      type: 'project',
      title: 'Create Computational Thinking Lesson',
      points: 20,
      completed: false,
      content: {
        description: 'Design a computational thinking lesson that integrates coding or unplugged activities into your curriculum.',
        requirements: [
          'Identify computational thinking concepts',
          'Choose appropriate tools or activities',
          'Design engaging activities',
          'Create assessment rubrics',
          'Plan implementation',
        ],
      },
    },
  ]

  const computationalThinkingPillars: ComputationalThinkingPillar[] = [
    {
      pillar: 'Decomposition',
      name: 'Decomposition',
      description: 'Breaking complex problems into smaller, manageable parts',
      examples: [
        'Breaking a story into beginning, middle, end',
        'Dividing a science experiment into steps',
        'Organizing a research project into sections',
      ],
      activities: [
        'Have students break down daily routines',
        'Decompose a complex math problem',
        'Break a project into smaller tasks',
      ],
    },
    {
      pillar: 'Pattern Recognition',
      name: 'Pattern Recognition',
      description: 'Identifying similarities, patterns, and trends',
      examples: [
        'Recognizing patterns in data',
        'Finding patterns in nature',
        'Identifying patterns in literature',
      ],
      activities: [
        'Pattern matching games',
        'Data analysis activities',
        'Sequence pattern identification',
      ],
    },
    {
      pillar: 'Abstraction',
      name: 'Abstraction',
      description: 'Focusing on essential details while ignoring irrelevant information',
      examples: [
        'Creating models and representations',
        'Simplifying complex systems',
        'Identifying key concepts',
      ],
      activities: [
        'Model building',
        'Creating simplified representations',
        'Identifying essential vs. non-essential information',
      ],
    },
    {
      pillar: 'Algorithm',
      name: 'Algorithm Design',
      description: 'Creating step-by-step procedures to solve problems',
      examples: [
        'Writing instructions for daily tasks',
        'Creating recipes',
        'Designing experiments',
      ],
      activities: [
        'Writing clear instructions',
        'Creating flowcharts',
        'Designing step-by-step procedures',
      ],
    },
  ]

  const codingTools: CodingTool[] = [
    {
      name: 'Scratch',
      type: 'block-based',
      gradeLevel: 'Elementary - Middle School',
      description: 'Visual programming language where students drag and drop blocks to create interactive stories, games, and animations.',
    },
    {
      name: 'Blockly',
      type: 'block-based',
      gradeLevel: 'Elementary - High School',
      description: 'Library for building visual programming editors. Used in many educational platforms.',
    },
    {
      name: 'Python',
      type: 'text-based',
      gradeLevel: 'Middle School - High School',
      description: 'Beginner-friendly text-based programming language widely used in education and industry.',
    },
    {
      name: 'Unplugged Activities',
      type: 'unplugged',
      gradeLevel: 'All grades',
      description: 'Activities that teach computational thinking concepts without computers.',
    },
  ]

  const handleLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      const newCompletedLessons = [...completedLessons, lessonId]
      setCompletedLessons(newCompletedLessons)
      const newProgress = (newCompletedLessons.length / lessons.length) * 100
      setProgress(newProgress)
      
      // If all lessons are completed, mark module as complete in localStorage
      if (newCompletedLessons.length === lessons.length) {
        const completedModules = JSON.parse(localStorage.getItem('stem-mastery-completed-modules') || '[]')
        if (!completedModules.includes('computational-thinking')) {
          completedModules.push('computational-thinking')
          localStorage.setItem('stem-mastery-completed-modules', JSON.stringify(completedModules))
        }
      }
    }
  }
  
  // Check if module is already completed on mount
  useEffect(() => {
    const completedModules = JSON.parse(localStorage.getItem('stem-mastery-completed-modules') || '[]')
    if (completedModules.includes('computational-thinking') && completedLessons.length < lessons.length) {
      setCompletedLessons(lessons.map(l => l.id))
      setProgress(100)
    }
  }, [])

  const currentLessonData = lessons[currentLesson]
  const moduleProgress = (completedLessons.length / lessons.length) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => navigate('/learning-hub/stem-mastery')}
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
                    120 min
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
                <h1 className="text-3xl font-bold">Computational Thinking & Coding Integration</h1>
                <p className="mt-2 text-blue-100">
                  Integrate computational thinking concepts and coding activities into your STEM curriculum
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
                const Icon = lesson.type === 'video' ? Video : lesson.type === 'reading' ? BookOpen : lesson.type === 'interactive' ? Zap : lesson.type === 'project' ? Rocket : FileText

                return (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentLesson(idx)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      isActive ? 'bg-blue-50 border-2 border-blue-300' : 'border-2 border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-100 text-green-600' : isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-semibold">{idx + 1}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="h-3 w-3 flex-shrink-0" />
                          <p className={`text-sm font-semibold truncate ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
                            {lesson.title}
                          </p>
                        </div>
                        {lesson.duration && <p className="text-xs text-gray-500">{lesson.duration}</p>}
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
                      {isPlaying ? <Pause className="h-10 w-10" /> : <Play className="h-10 w-10 ml-1" />}
                    </button>
                  </div>
                </div>
                {currentLessonData.content.keyPoints && (
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
                )}

                {/* Computational Thinking Pillars */}
                {currentLessonData.id === 'ct-fundamentals' && (
                  <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">The Four Pillars of Computational Thinking</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {computationalThinkingPillars.map((pillar, idx) => (
                        <div key={idx} className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-5 border border-blue-200">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                              {idx + 1}
                            </div>
                            <h4 className="text-base font-bold text-gray-900">{pillar.name}</h4>
                          </div>
                          <p className="text-sm text-gray-700 mb-3">{pillar.description}</p>
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs font-semibold text-gray-600 mb-1">Examples:</p>
                              {pillar.examples.map((example, exIdx) => (
                                <p key={exIdx} className="text-xs text-gray-700 bg-white rounded p-2 border border-blue-100 mb-1">
                                  {example}
                                </p>
                              ))}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-600 mb-1">Activities:</p>
                              {pillar.activities.map((activity, aIdx) => (
                                <p key={aIdx} className="text-xs text-gray-700 bg-white rounded p-2 border border-blue-100 mb-1">
                                  {activity}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Reading Lesson */}
            {currentLessonData.type === 'reading' && (
              <div className="space-y-6">
                <div className="prose prose-lg max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: currentLessonData.content.article?.replace(/\n/g, '<br />').replace(/#{3}/g, '<h3>').replace(/##/g, '<h2>').replace(/#/g, '<h1>') || '' }} />
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

                {/* Coding Tools */}
                {currentLessonData.id === 'coding-classroom' && (
                  <div className="bg-white rounded-xl p-6 border-2 border-gray-200 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Coding Tools & Platforms</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {codingTools.map((tool, idx) => (
                        <div key={idx} className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Code className="h-5 w-5 text-blue-600" />
                            <h4 className="text-base font-bold text-gray-900">{tool.name}</h4>
                            <span className={`ml-auto px-2 py-1 rounded text-xs font-semibold ${
                              tool.type === 'block-based' ? 'bg-green-100 text-green-700' :
                              tool.type === 'text-based' ? 'bg-purple-100 text-purple-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {tool.type}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{tool.gradeLevel}</p>
                          <p className="text-sm text-gray-700">{tool.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Interactive Workshop */}
            {currentLessonData.type === 'interactive' && currentLessonData.id === 'scratch-workshop' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{currentLessonData.content.description}</h3>
                  
                  {!showWorkshop ? (
                    <button
                      onClick={() => setShowWorkshop(true)}
                      className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                      <Zap className="h-5 w-5" />
                      Launch Scratch Workshop
                    </button>
                  ) : (
                    <div className="bg-white rounded-xl p-6 border-2 border-blue-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Block-Based Programming Workshop</h3>
                      <div className="space-y-4">
                        <ol className="space-y-3">
                          {currentLessonData.content.steps.map((step: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <p className="text-sm font-semibold text-gray-900 mb-2">Try It Out:</p>
                          <p className="text-sm text-gray-700 mb-3">
                            Visit scratch.mit.edu to create your first project. Start with a simple animation or game.
                          </p>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
                            Open Scratch
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Project Lesson */}
            {currentLessonData.type === 'project' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{currentLessonData.content.description}</h3>
                  
                  {!showLessonDesigner ? (
                    <button
                      onClick={() => setShowLessonDesigner(true)}
                      className="w-full px-6 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                    >
                      <Rocket className="h-5 w-5" />
                      Launch Lesson Designer
                    </button>
                  ) : (
                    <div className="bg-white rounded-xl p-6 border-2 border-green-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Computational Thinking Lesson Designer</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Title</label>
                          <input
                            type="text"
                            placeholder="e.g., Introduction to Algorithms"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
                            <select className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100">
                              <option>Select grade</option>
                              {['K', '1', '2', '3', '4', '5', 'MS', 'HS'].map((grade) => (
                                <option key={grade} value={grade}>
                                  {grade === 'MS' ? 'Middle School' : grade === 'HS' ? 'High School' : `Grade ${grade}`}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Computational Thinking Pillar</label>
                            <select className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100">
                              <option>Select pillar</option>
                              <option>Decomposition</option>
                              <option>Pattern Recognition</option>
                              <option>Abstraction</option>
                              <option>Algorithm Design</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Activity Description</label>
                          <textarea
                            rows={4}
                            placeholder="Describe your computational thinking activity..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                          />
                        </div>
                        <div className="flex gap-3">
                          <button className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">
                            Save Lesson Plan
                          </button>
                          <button
                            onClick={() => setShowLessonDesigner(false)}
                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Requirements</h3>
                  <ol className="space-y-3">
                    {currentLessonData.content.requirements.map((req: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ol>
                </div>
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
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition"
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
                  onClick={() => navigate('/learning-hub/stem-mastery')}
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

export default ComputationalThinkingModule
