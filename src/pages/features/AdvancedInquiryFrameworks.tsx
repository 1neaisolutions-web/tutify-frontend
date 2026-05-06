import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  Star,
  Download,
  Video,
  BookOpen,
  Zap,
  FileText,
  Target,
  Trophy,
  TrendingUp,
  ArrowRight,
  FlaskConical,
  Rocket,
  Lightbulb,
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

const AdvancedInquiryFrameworks = () => {
  const navigate = useNavigate()
  const [currentLesson, setCurrentLesson] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [progress, setProgress] = useState(0)

  const lessons: LessonContent[] = [
    {
      id: 'advanced-models',
      type: 'video',
      title: 'Advanced Inquiry Models',
      duration: '28 min',
      points: 30,
      completed: false,
      content: {
        description: 'Master sophisticated inquiry models including PBL, design thinking, and student-led research.',
        keyPoints: [
          'Project-Based Learning (PBL) frameworks',
          'Design Thinking process',
          'Student-led research methodologies',
          'Authentic problem-solving',
          'Long-term inquiry projects',
        ],
      },
    },
    {
      id: 'pbl-research',
      type: 'reading',
      title: 'PBL Research & Implementation',
      points: 25,
      completed: false,
      content: {
        article: `# PBL Research & Implementation

## Project-Based Learning

PBL is a teaching method where students learn by actively engaging in real-world, meaningful projects.

### Core Elements

**Driving Question**: An open-ended question that guides inquiry
**Authenticity**: Real-world relevance and connection
**Student Voice & Choice**: Students make decisions about their work
**Reflection**: Continuous reflection on learning
**Public Product**: Students share their work with authentic audience

### Benefits

- Deep, lasting learning
- Development of 21st-century skills
- Increased student engagement
- Real-world application
- Student autonomy and ownership`,
      },
    },
    {
      id: 'pbl-planner',
      type: 'interactive',
      title: 'PBL Planner Tool',
      points: 35,
      completed: false,
      content: {
        description: 'Plan your project-based learning experience.',
        steps: [
          'Define driving question',
          'Plan authentic context',
          'Design project milestones',
          'Create assessment rubrics',
          'Plan public presentation',
        ],
      },
    },
    {
      id: 'template',
      type: 'template',
      title: 'Advanced Inquiry Templates',
      points: 30,
      completed: false,
      content: {
        description: 'Access templates for advanced inquiry frameworks.',
        sections: [
          'PBL Planning Framework',
          'Design Thinking Templates',
          'Research Project Guides',
          'Inquiry Rubrics',
          'Presentation Templates',
        ],
      },
    },
  ]

  const handleLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId])
      setProgress(((completedLessons.length + 1) / lessons.length) * 100)
    }
  }

  const currentLessonData = lessons[currentLesson]
  const moduleProgress = (completedLessons.length / lessons.length) * 100

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 rounded-3xl p-8 text-white shadow-xl">
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
                    Module 8
                  </span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    80 min
                  </span>
                </div>
                <h1 className="text-3xl font-bold">Advanced Inquiry Frameworks</h1>
                <p className="mt-2 text-teal-100">
                  Master PBL, design thinking, and student-led research projects
                </p>
              </div>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-300" style={{ width: `${moduleProgress}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
                      isActive ? 'bg-teal-50 border-2 border-teal-300' : 'border-2 border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-100 text-green-600' : isActive ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-semibold">{idx + 1}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="h-3 w-3 flex-shrink-0" />
                          <p className={`text-sm font-semibold truncate ${isActive ? 'text-teal-900' : 'text-gray-900'}`}>
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

        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">{currentLessonData.title}</h2>
            </div>

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
                <div className="bg-teal-50 rounded-xl p-6 border border-teal-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Points</h3>
                  <ul className="space-y-2">
                    {currentLessonData.content.keyPoints.map((point: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {currentLessonData.type === 'reading' && (
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: currentLessonData.content.article?.replace(/\n/g, '<br />').replace(/#{3}/g, '<h3>').replace(/##/g, '<h2>').replace(/#/g, '<h1>') || '' }} />
              </div>
            )}

            {currentLessonData.type === 'interactive' && (
              <div className="bg-teal-50 rounded-xl p-6 border border-teal-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{currentLessonData.content.description}</h3>
                <ol className="space-y-3">
                  {currentLessonData.content.steps.map((step: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {currentLessonData.type === 'template' && (
              <div className="space-y-6">
                <div className="bg-teal-50 rounded-xl p-6 border border-teal-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{currentLessonData.content.description}</h3>
                  <ul className="space-y-2">
                    {currentLessonData.content.sections.map((section: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-teal-600 flex-shrink-0" />
                        <span>{section}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button className="w-full px-6 py-4 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition flex items-center justify-center gap-2">
                  <Download className="h-5 w-5" />
                  Download Template
                </button>
              </div>
            )}

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
                className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white text-sm font-semibold rounded-full hover:bg-teal-700 transition"
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

          {completedLessons.length === lessons.length && (
            <div className="mt-6 rounded-2xl border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 p-8 text-center">
              <Trophy className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Module Complete!</h3>
              <p className="text-gray-700 mb-6">Congratulations! You've completed all modules in the Student Engagement Path.</p>
              <button
                onClick={() => navigate('/learning-hub/student-engagement-path')}
                className="rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700"
              >
                View Certificate
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdvancedInquiryFrameworks



