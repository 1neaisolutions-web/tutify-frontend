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
  ClipboardCheck,
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
  title: 'Formative assessment strategies that work',
  category: 'Assessment strategies',
  duration: '6 min',
  difficulty: 'Intermediate',
  description: 'Learn evidence-based formative assessment techniques that provide real-time insights into student learning and guide your instruction.',
  learningObjectives: [
    'Implement quick-check strategies to gauge student understanding',
    'Use exit tickets and peer assessment effectively',
    'Provide actionable feedback that moves learning forward',
    'Create a culture of continuous improvement through assessment',
  ],
  lessons: [
    {
      id: 1,
      title: 'The Power of Formative Assessment',
      duration: '2 min',
      content: [
        {
          type: 'text',
          data: {
            heading: 'Why Formative Assessment Matters',
            paragraphs: [
              'Formative assessment is the process of gathering evidence about student learning during instruction to inform teaching decisions. Unlike summative assessments that evaluate learning at the end, formative assessments help you adjust your teaching in real-time.',
              'Research by Black & Wiliam shows that formative assessment can significantly improve student achievement, with effect sizes of 0.4 to 0.7—among the highest of any teaching strategy.',
            ],
          },
        },
        {
          type: 'text',
          data: {
            heading: 'Key Characteristics',
            paragraphs: [
              'Low-stakes: Students aren\'t graded, reducing anxiety and encouraging risk-taking',
              'Frequent: Conducted regularly throughout instruction, not just at unit end',
              'Actionable: Provides specific information you can use immediately to adjust teaching',
              'Student-focused: Helps students understand their own learning progress',
            ],
          },
        },
        {
          type: 'interactive',
          data: {
            title: 'Reflection',
            prompt: 'Think about your current assessment practices. How often do you check for understanding during a lesson?',
            tips: [
              'Aim for 3-5 check-ins per lesson',
              'Use a variety of methods to avoid monotony',
              'Make it quick—formative assessment shouldn\'t take more than 2-3 minutes',
              'Focus on one key concept or skill per check',
            ],
          },
        },
      ],
      completed: false,
    },
    {
      id: 2,
      title: 'Quick-Check Strategies',
      duration: '2 min',
      content: [
        {
          type: 'text',
          data: {
            heading: 'Thumbs Up, Down, Sideways',
            paragraphs: [
              'A simple, non-verbal way to check understanding. Ask students to show thumbs up (I understand), thumbs down (I need help), or thumbs sideways (I\'m getting there).',
              'This strategy works best when you\'ve established a safe classroom culture where students feel comfortable showing they don\'t understand.',
            ],
          },
        },
        {
          type: 'text',
          data: {
            heading: 'Traffic Light Cards',
            paragraphs: [
              'Give students red, yellow, and green cards. Red means "I\'m stuck," yellow means "I\'m working on it," green means "I\'ve got it."',
              'Students hold up the card that matches their understanding. This gives you an instant visual of where the class stands.',
            ],
          },
        },
        {
          type: 'text',
          data: {
            heading: 'One-Minute Papers',
            paragraphs: [
              'At the end of a lesson segment, ask students to write for one minute answering: "What was the most important thing you learned?" or "What question do you still have?"',
              'Collect and quickly scan responses to identify common misconceptions or areas needing clarification.',
            ],
          },
        },
        {
          type: 'interactive',
          data: {
            title: 'Try It This Week',
            prompt: 'Choose one quick-check strategy to implement in your next lesson. Plan when and how you\'ll use it.',
            tips: [
              'Start with one strategy and master it before adding more',
              'Explain the purpose to students so they understand why you\'re checking',
              'Use the information you gather to adjust your teaching immediately',
              'Track which strategies work best for different types of content',
            ],
          },
        },
      ],
      completed: false,
    },
    {
      id: 3,
      title: 'Exit Tickets & Peer Assessment',
      duration: '2 min',
      content: [
        {
          type: 'text',
          data: {
            heading: 'Effective Exit Tickets',
            paragraphs: [
              'Exit tickets are brief assessments given at the end of class. They should take 2-3 minutes and focus on one key question or concept.',
              'Effective exit ticket prompts include: "What was the main idea of today\'s lesson?" "What\'s one thing you\'re still confused about?" "How confident do you feel about [skill]?"',
            ],
          },
        },
        {
          type: 'text',
          data: {
            heading: 'Peer Assessment Benefits',
            paragraphs: [
              'Peer assessment helps students develop critical thinking and self-reflection skills. When students evaluate each other\'s work, they learn to identify quality and apply criteria.',
              'Start with simple rubrics or checklists. Model the process first, then gradually release responsibility to students.',
            ],
          },
        },
        {
          type: 'text',
          data: {
            heading: 'Structured Peer Feedback',
            paragraphs: [
              'Use the "Two Stars and a Wish" framework: Students identify two strengths and one area for improvement.',
              'Or try "I like, I wonder, I suggest": Students share what they like, what they wonder about, and what they suggest.',
            ],
          },
        },
        {
          type: 'interactive',
          data: {
            title: 'Design Your Exit Ticket',
            prompt: 'Create an exit ticket prompt for your next lesson. Make it specific and actionable.',
            tips: [
              'Keep it to one question or concept',
              'Make it quick to complete (2-3 minutes)',
              'Ensure you can review responses quickly',
              'Use the responses to plan your next lesson',
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
        question: 'What is the primary purpose of formative assessment?',
        options: [
          'To assign grades to students',
          'To evaluate learning at the end of a unit',
          'To gather evidence during instruction to inform teaching decisions',
          'To compare students to each other',
        ],
        correctAnswer: 2,
        explanation: 'Formative assessment is used during instruction to gather evidence about student learning and adjust teaching accordingly.',
      },
      {
        id: 2,
        question: 'Which quick-check strategy provides an instant visual of class understanding?',
        options: [
          'Written essays',
          'Traffic light cards',
          'Multiple choice tests',
          'Oral presentations',
        ],
        correctAnswer: 1,
        explanation: 'Traffic light cards allow students to quickly show their understanding level, giving teachers an immediate visual of where the class stands.',
      },
      {
        id: 3,
        question: 'Effective exit tickets should:',
        options: [
          'Take 15-20 minutes to complete',
          'Focus on multiple concepts',
          'Take 2-3 minutes and focus on one key question',
          'Be graded for accuracy',
        ],
        correctAnswer: 2,
        explanation: 'Exit tickets should be brief (2-3 minutes) and focus on one key concept or question to provide quick, actionable feedback.',
      },
      {
        id: 4,
        question: 'What is a key benefit of peer assessment?',
        options: [
          'It reduces teacher workload',
          'It helps students develop critical thinking and self-reflection skills',
          'It eliminates the need for teacher feedback',
          'It ensures all students get the same grade',
        ],
        correctAnswer: 1,
        explanation: 'Peer assessment helps students develop critical thinking skills as they learn to identify quality and apply criteria to evaluate work.',
      },
    ],
  },
}

const AssessmentStrategiesCourse = () => {
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 mb-4">
                <Award className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Congratulations!</h1>
              <p className="text-lg text-gray-600">You've completed the course</p>
            </div>

            <div className="border-2 border-blue-200 rounded-2xl p-8 mb-6 bg-gradient-to-br from-blue-50 to-indigo-50">
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
              <div className="mt-6 pt-6 border-t border-blue-200">
                <p className="text-sm text-gray-600 mb-2">Certificate of Completion</p>
                <p className="text-lg font-semibold text-gray-900">This certifies that you have successfully completed</p>
                <p className="text-xl font-bold text-blue-600 mt-2">{courseData.title}</p>
                <p className="text-sm text-gray-500 mt-4">Issued on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 flex items-center justify-center gap-2"
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
              <p className="text-sm text-gray-600 mt-1">Test your understanding of formative assessment strategies</p>
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
                        : 'bg-blue-100 text-blue-700'
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
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 bg-white hover:border-blue-300'
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
                                    ? 'border-blue-500 bg-blue-500'
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
            <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 mb-4">
                  {passed ? (
                    <Award className="w-8 h-8 text-white" />
                  ) : (
                    <Target className="w-8 h-8 text-white" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {passed ? 'Congratulations! You passed!' : 'Keep Learning'}
                </h3>
                <p className="text-lg font-semibold text-blue-600 mb-2">
                  Score: {score}/{courseData.quiz.questions.length} ({Math.round(percentage)}%)
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  {passed
                    ? 'You\'ve demonstrated a strong understanding of formative assessment strategies!'
                    : 'Review the course materials and try again. You need 70% to pass.'}
                </p>
                {passed ? (
                  <button
                    onClick={() => setShowCertificate(true)}
                    className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 flex items-center justify-center gap-2 mx-auto"
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
                      className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
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
                className="rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
      <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-3xl p-8 text-white shadow-xl">
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
                        ? 'bg-blue-50 border-2 border-blue-300'
                        : 'border-2 border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? 'bg-green-100 text-green-600'
                          : isActive
                          ? 'bg-blue-100 text-blue-600'
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
                          isActive ? 'text-blue-900' : 'text-gray-900'
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
                <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{currentContent.data.title}</h3>
                      <p className="text-gray-700 mb-4">{currentContent.data.prompt}</p>
                      <div className="bg-white rounded-lg p-4 border border-blue-200">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Tips:</p>
                        <ul className="space-y-1">
                          {currentContent?.data?.tips?.map((tip: string, idx: number) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                              <ChevronRight className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
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
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition"
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
          <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Learning Objectives
            </h3>
            <ul className="space-y-2">
              {courseData.learningObjectives.map((objective, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
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

export default AssessmentStrategiesCourse



