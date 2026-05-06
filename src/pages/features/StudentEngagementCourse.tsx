import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BookOpen,
  Play,
  CheckCircle2,
  Circle,
  ArrowRight,
  ArrowLeft,
  Clock,
  Award,
  Target,
  Lightbulb,
  Users,
  Shield,
  TrendingUp,
  FileText,
  Star,
  X,
  ChevronRight,
  Sparkles,
  Zap,
} from 'lucide-react'

interface Lesson {
  id: number
  title: string
  duration: string
  content: {
    type: 'text' | 'video' | 'interactive' | 'quiz'
    data: any
  }[]
  completed: boolean
}

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const courseData = {
  title: 'Engaging reluctant learners',
  category: 'Student engagement',
  duration: '7 min',
  difficulty: 'Intermediate',
  description: 'Discover practical strategies to motivate and engage students who seem disconnected, uninterested, or resistant to learning.',
  learningObjectives: [
    'Understand why students become reluctant learners',
    'Build relevance and connect learning to students\' interests',
    'Use choice and autonomy to increase motivation',
    'Create a classroom culture that supports engagement',
  ],
  lessons: [
    {
      id: 1,
      title: 'Understanding Reluctant Learners',
      duration: '2 min',
      content: [
        {
          type: 'text',
          data: {
            heading: 'Why Students Disengage',
            paragraphs: [
              'Reluctant learners aren\'t lazy—they\'re often responding to past failures, lack of relevance, or feeling disconnected from the content. Understanding the root causes helps you address them effectively.',
              'Common reasons include: fear of failure, lack of relevance, feeling overwhelmed, learning differences not being addressed, or negative past experiences with school.',
            ],
          },
        },
        {
          type: 'text',
          data: {
            heading: 'The Engagement Spectrum',
            paragraphs: [
              'Students exist on a spectrum: highly engaged, moderately engaged, situationally engaged, and disengaged. Your goal isn\'t to get every student to love every lesson—it\'s to move them along the spectrum.',
              'Even small shifts matter. A disengaged student who becomes situationally engaged is progress. Celebrate incremental improvements.',
            ],
          },
        },
        {
          type: 'interactive',
          data: {
            title: 'Reflection',
            prompt: 'Think about your reluctant learners. What patterns do you notice? What might be underlying their disengagement?',
            tips: [
              'Look beyond surface behaviors to underlying causes',
              'Consider academic, social, and emotional factors',
              'Talk to students individually to understand their perspective',
              'Remember: behavior is communication',
            ],
          },
        },
      ],
      completed: false,
    },
    {
      id: 2,
      title: 'Building Relevance',
      duration: '2 min',
      content: [
        {
          type: 'text',
          data: {
            heading: 'Connect to Real Life',
            paragraphs: [
              'Students engage when they see how content connects to their lives, interests, or future goals. Start lessons with real-world connections, not abstract concepts.',
              'Example: Instead of "Today we\'re learning about percentages," try "Today we\'re learning how to calculate discounts—something you\'ll use every time you shop."',
            ],
          },
        },
        {
          type: 'text',
          data: {
            heading: 'Use Student Interests',
            paragraphs: [
              'Survey students about their interests, hobbies, and goals. Then weave these into your lessons. A student who loves video games might engage more if you frame math problems around game mechanics.',
              'Create interest inventories at the start of the year and refer back to them when planning lessons.',
            ],
          },
        },
        {
          type: 'text',
          data: {
            heading: 'Show the "Why"',
            paragraphs: [
              'Explain not just what students are learning, but why it matters. Help them see the bigger picture and how skills build on each other.',
              'Use phrases like "This skill will help you..." or "You\'ll need this when..." to make purpose clear.',
            ],
          },
        },
        {
          type: 'interactive',
          data: {
            title: 'Make It Relevant',
            prompt: 'Choose an upcoming lesson and identify 2-3 ways to connect it to students\' real lives or interests.',
            tips: [
              'Start with student interests from your inventory',
              'Think about real-world applications',
              'Consider future career connections',
              'Ask students how they might use this knowledge',
            ],
          },
        },
      ],
      completed: false,
    },
    {
      id: 3,
      title: 'Choice and Autonomy',
      duration: '2 min',
      content: [
        {
          type: 'text',
          data: {
            heading: 'The Power of Choice',
            paragraphs: [
              'When students have choices, they feel more ownership and control. This increases motivation and engagement, especially for reluctant learners.',
              'Offer choices in: what to learn (within parameters), how to learn (reading, watching, doing), how to demonstrate learning (product options), and when to work (within deadlines).',
            ],
          },
        },
        {
          type: 'text',
          data: {
            heading: 'Structured Choices',
            paragraphs: [
              'Choices don\'t mean chaos. Provide 2-3 options, all of which meet your learning objectives. This gives autonomy while maintaining focus.',
              'Example: "You can write an essay, create a video, or design a poster—all need to explain the water cycle."',
            ],
          },
        },
        {
          type: 'text',
          data: {
            heading: 'Gradual Release',
            paragraphs: [
              'Start with small choices and gradually increase autonomy. Begin with "choose your seat" or "choose your partner," then move to academic choices.',
              'As students demonstrate responsibility, offer more complex choices. This builds trust and capability.',
            ],
          },
        },
        {
          type: 'interactive',
          data: {
            title: 'Design Choices',
            prompt: 'Plan a lesson with structured choices. What options will you offer for how students engage with or demonstrate learning?',
            tips: [
              'Ensure all choices meet the same learning objective',
              'Start with 2-3 options to avoid overwhelm',
              'Make choices equally rigorous',
              'Provide clear expectations for each option',
            ],
          },
        },
      ],
      completed: false,
    },
    {
      id: 4,
      title: 'Creating an Engaging Culture',
      duration: '1 min',
      content: [
        {
          type: 'text',
          data: {
            heading: 'Safe to Try',
            paragraphs: [
              'Reluctant learners need to feel safe to take risks. Create a classroom where mistakes are learning opportunities, not failures.',
              'Model risk-taking yourself. Share your own mistakes and what you learned. Celebrate effort, not just achievement.',
            ],
          },
        },
        {
          type: 'text',
          data: {
            heading: 'Quick Wins',
            paragraphs: [
              'Help reluctant learners experience success early and often. Start with tasks they can complete successfully, then gradually increase challenge.',
              'Break large tasks into smaller steps. Celebrate each step completed. Success breeds motivation.',
            ],
          },
        },
        {
          type: 'interactive',
          data: {
            title: 'Your Engagement Plan',
            prompt: 'Identify one reluctant learner and create a plan to increase their engagement using strategies from this course.',
            tips: [
              'Start with building relationship and understanding',
              'Find ways to connect content to their interests',
              'Offer choices to increase autonomy',
              'Create opportunities for quick wins',
              'Be patient—engagement takes time',
            ],
          },
        },
      ],
      completed: false,
    },
  ],
  quiz: {
    questions: [
      {
        id: 1,
        question: 'What is a common reason students become reluctant learners?',
        options: [
          'They are naturally lazy',
          'They don\'t like school',
          'Fear of failure or lack of relevance',
          'They prefer to be at home',
        ],
        correctAnswer: 2,
        explanation: 'Reluctant learners often disengage due to fear of failure, lack of relevance, feeling overwhelmed, or negative past experiences—not laziness.',
      },
      {
        id: 2,
        question: 'How can you build relevance in your lessons?',
        options: [
          'Only teach abstract concepts',
          'Connect content to students\' real lives and interests',
          'Avoid mentioning real-world applications',
          'Focus only on test preparation',
        ],
        correctAnswer: 1,
        explanation: 'Building relevance means connecting content to students\' real lives, interests, and future goals to show why learning matters.',
      },
      {
        id: 3,
        question: 'What is the benefit of offering students choices?',
        options: [
          'It reduces teacher workload',
          'It increases student ownership, control, and motivation',
          'It eliminates the need for planning',
          'It ensures all students do the same work',
        ],
        correctAnswer: 1,
        explanation: 'When students have choices, they feel more ownership and control, which increases motivation and engagement.',
      },
      {
        id: 4,
        question: 'How can you help reluctant learners experience success?',
        options: [
          'Give them easier work permanently',
          'Start with tasks they can complete successfully, then gradually increase challenge',
          'Ignore their struggles',
          'Compare them to other students',
        ],
        correctAnswer: 1,
        explanation: 'Help reluctant learners experience success by starting with achievable tasks and gradually increasing challenge, celebrating each step.',
      },
    ],
  },
}

const StudentEngagementCourse = () => {
  const navigate = useNavigate()
  const [currentLesson, setCurrentLesson] = useState(0)
  const [currentContentIndex, setCurrentContentIndex] = useState(0)
  const [completedLessons, setCompletedLessons] = useState<number[]>([])
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [courseCompleted, setCourseCompleted] = useState(false)
  const [showCertificate, setShowCertificate] = useState(false)

  const currentLessonData = courseData.lessons[currentLesson]
  const currentContent = currentLessonData?.content[currentContentIndex]
  const progress = ((completedLessons.length + (currentLesson > 0 ? 1 : 0)) / courseData.lessons.length) * 100

  const handleNext = () => {
    if (currentContentIndex < currentLessonData.content.length - 1) {
      setCurrentContentIndex(currentContentIndex + 1)
    } else if (currentLesson < courseData.lessons.length - 1) {
      if (!completedLessons.includes(currentLesson)) {
        setCompletedLessons([...completedLessons, currentLesson])
      }
      setCurrentLesson(currentLesson + 1)
      setCurrentContentIndex(0)
    } else {
      if (!completedLessons.includes(currentLesson)) {
        setCompletedLessons([...completedLessons, currentLesson])
      }
      setShowQuiz(true)
    }
  }

  const handlePrevious = () => {
    if (currentContentIndex > 0) {
      setCurrentContentIndex(currentContentIndex - 1)
    } else if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1)
      setCurrentContentIndex(courseData.lessons[currentLesson - 1].content.length - 1)
    }
  }

  const handleQuizAnswer = (questionId: number, answerIndex: number) => {
    if (quizSubmitted) return
    setQuizAnswers({ ...quizAnswers, [questionId]: answerIndex })
  }

  const handleQuizSubmit = () => {
    setQuizSubmitted(true)
    const score = Object.entries(quizAnswers).filter(
      ([qId, answer]) => courseData.quiz.questions[parseInt(qId) - 1].correctAnswer === answer
    ).length
    if (score >= courseData.quiz.questions.length * 0.7) {
      setCourseCompleted(true)
      setTimeout(() => setShowCertificate(true), 1000)
    }
  }

  const handleCompleteCourse = () => {
    navigate('/learning-hub')
  }

  if (showCertificate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 mb-4">
                <Award className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Congratulations!</h1>
              <p className="text-lg text-gray-600">You've completed the course</p>
            </div>

            <div className="border-2 border-purple-200 rounded-2xl p-8 mb-6 bg-gradient-to-br from-purple-50 to-pink-50">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{courseData.title}</h2>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {courseData.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  {courseData.difficulty}
                </span>
              </div>
              <div className="mt-6 pt-6 border-t border-purple-200">
                <p className="text-sm text-gray-600 mb-2">Certificate of Completion</p>
                <p className="text-lg font-semibold text-gray-900">This certifies that you have successfully completed</p>
                <p className="text-xl font-bold text-purple-600 mt-2">{courseData.title}</p>
                <p className="text-sm text-gray-500 mt-4">Issued on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700 flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Download Certificate
              </button>
              <button
                onClick={handleCompleteCourse}
                className="flex-1 rounded-full border-2 border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                Back to Learning Hub
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showQuiz) {
    const score = Object.entries(quizAnswers).filter(
      ([qId, answer]) => courseData.quiz.questions[parseInt(qId) - 1].correctAnswer === answer
    ).length
    const percentage = (score / courseData.quiz.questions.length) * 100
    const passed = percentage >= 70

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Course Assessment</h2>
              <p className="text-sm text-gray-600 mt-1">Test your understanding of student engagement strategies</p>
            </div>
            <button
              onClick={() => navigate('/learning-hub')}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {courseData.quiz.questions.map((question, idx) => {
              const userAnswer = quizAnswers[question.id]
              const isCorrect = userAnswer === question.correctAnswer

              return (
                <div key={question.id} className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                      quizSubmitted
                        ? isCorrect
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">{question.question}</h3>
                      <div className="space-y-2">
                        {question.options.map((option, optIdx) => {
                          const isSelected = userAnswer === optIdx
                          const isCorrectOption = optIdx === question.correctAnswer

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleQuizAnswer(question.id, optIdx)}
                              disabled={quizSubmitted}
                              className={`w-full text-left p-4 rounded-lg border-2 transition ${
                                quizSubmitted
                                  ? isCorrectOption
                                    ? 'border-green-500 bg-green-50'
                                    : isSelected
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-200 bg-white'
                                  : isSelected
                                  ? 'border-purple-500 bg-purple-50'
                                  : 'border-gray-200 bg-white hover:border-purple-300'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  quizSubmitted
                                    ? isCorrectOption
                                      ? 'border-green-500 bg-green-500'
                                      : isSelected
                                      ? 'border-red-500 bg-red-500'
                                      : 'border-gray-300'
                                    : isSelected
                                    ? 'border-purple-500 bg-purple-500'
                                    : 'border-gray-300'
                                }`}>
                                  {quizSubmitted && isCorrectOption && <CheckCircle2 className="w-3 h-3 text-white" />}
                                  {isSelected && !quizSubmitted && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                                <span className={`flex-1 ${quizSubmitted && !isCorrectOption && isSelected ? 'text-red-700' : quizSubmitted && isCorrectOption ? 'text-green-700' : 'text-gray-700'}`}>
                                  {option}
                                </span>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                      {quizSubmitted && (
                        <div className={`mt-4 p-4 rounded-lg ${
                          isCorrect ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
                        }`}>
                          <p className={`text-sm font-semibold mb-1 ${isCorrect ? 'text-green-800' : 'text-amber-800'}`}>
                            {isCorrect ? '✓ Correct!' : 'Explanation:'}
                          </p>
                          <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-amber-700'}`}>
                            {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {quizSubmitted && (
            <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-600 mb-4">
                  {passed ? (
                    <Award className="w-8 h-8 text-white" />
                  ) : (
                    <Target className="w-8 h-8 text-white" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {passed ? 'Congratulations! You passed!' : 'Keep Learning'}
                </h3>
                <p className="text-lg font-semibold text-purple-600 mb-2">
                  Score: {score}/{courseData.quiz.questions.length} ({Math.round(percentage)}%)
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  {passed
                    ? 'You\'ve demonstrated a strong understanding of student engagement strategies!'
                    : 'Review the course materials and try again. You need 70% to pass.'}
                </p>
                {passed ? (
                  <button
                    onClick={() => setShowCertificate(true)}
                    className="rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700 flex items-center justify-center gap-2 mx-auto"
                  >
                    <Award className="w-4 h-4" />
                    View Certificate
                  </button>
                ) : (
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => {
                        setShowQuiz(false)
                        setCurrentLesson(0)
                        setCurrentContentIndex(0)
                        setQuizAnswers({})
                        setQuizSubmitted(false)
                      }}
                      className="rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700"
                    >
                      Review Course
                    </button>
                    <button
                      onClick={() => {
                        setQuizAnswers({})
                        setQuizSubmitted(false)
                      }}
                      className="rounded-full border-2 border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Retake Quiz
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {!quizSubmitted && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleQuizSubmit}
                disabled={Object.keys(quizAnswers).length < courseData.quiz.questions.length}
                className="rounded-full bg-purple-600 px-8 py-3 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Submit Assessment
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                {courseData.category}
              </span>
              <span className="text-white/80">•</span>
              <span className="text-white/80 text-sm">{courseData.duration}</span>
              <span className="text-white/80">•</span>
              <span className="text-white/80 text-sm">{courseData.difficulty}</span>
            </div>
            <h1 className="text-3xl font-bold mb-3">{courseData.title}</h1>
            <p className="text-white/90 text-lg mb-4">{courseData.description}</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Progress: {Math.round(progress)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Lesson {currentLesson + 1} of {courseData.lessons.length}</span>
              </div>
            </div>
            <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <button
            onClick={() => navigate('/learning-hub')}
            className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Lesson Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-4">Course Content</h3>
            <div className="space-y-2">
              {courseData.lessons.map((lesson, idx) => {
                const isActive = idx === currentLesson
                const isCompleted = completedLessons.includes(idx)

                return (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setCurrentLesson(idx)
                      setCurrentContentIndex(0)
                    }}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      isActive
                        ? 'bg-purple-50 border-2 border-purple-300'
                        : 'border-2 border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? 'bg-green-100 text-green-600'
                          : isActive
                          ? 'bg-purple-100 text-purple-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-semibold">{idx + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${
                          isActive ? 'text-purple-900' : 'text-gray-900'
                        }`}>
                          {lesson.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{lesson.duration}</p>
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
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <span>Lesson {currentLesson + 1} of {courseData.lessons.length}</span>
                <span>•</span>
                <span>{currentLessonData.duration}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{currentLessonData.title}</h2>
            </div>

            {/* Content */}
            <div className="space-y-8 mb-8">
              {currentContent?.type === 'text' && (
                <div className="prose max-w-none">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{currentContent.data.heading}</h3>
                  {currentContent.data.paragraphs.map((para: string, idx: number) => (
                    <p key={idx} className="text-gray-700 leading-relaxed mb-4">
                      {para}
                    </p>
                  ))}
                </div>
              )}

              {currentContent?.type === 'interactive' && (
                <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{currentContent.data.title}</h3>
                      <p className="text-gray-700 mb-4">{currentContent.data.prompt}</p>
                      <div className="bg-white rounded-lg p-4 border border-purple-200">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Tips:</p>
                        <ul className="space-y-1">
                          {currentContent.data.tips.map((tip: string, idx: number) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                              <ChevronRight className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                onClick={handlePrevious}
                disabled={currentLesson === 0 && currentContentIndex === 0}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Content {currentContentIndex + 1} of {currentLessonData.content.length}</span>
              </div>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white text-sm font-semibold rounded-full hover:bg-purple-700 transition"
              >
                {currentContentIndex === currentLessonData.content.length - 1 && currentLesson === courseData.lessons.length - 1
                  ? 'Complete Course'
                  : currentContentIndex === currentLessonData.content.length - 1
                  ? 'Next Lesson'
                  : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Learning Objectives Sidebar */}
          <div className="mt-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Learning Objectives
            </h3>
            <ul className="space-y-2">
              {courseData.learningObjectives.map((objective, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentEngagementCourse



