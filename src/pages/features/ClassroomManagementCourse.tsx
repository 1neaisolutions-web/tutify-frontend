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
  title: 'Quick wins: Classroom management essentials',
  category: 'Classroom management',
  duration: '8 min',
  difficulty: 'Beginner',
  description: 'Master the fundamentals of effective classroom management with evidence-based strategies you can implement immediately.',
  learningObjectives: [
    'Establish clear expectations and routines from day one',
    'Use positive reinforcement to build a supportive classroom culture',
    'Implement proactive strategies to prevent disruptions',
    'Respond effectively to challenging behaviors',
  ],
  lessons: [
    {
      id: 1,
      title: 'Setting the Foundation: Clear Expectations',
      duration: '2 min',
      content: [
        {
          type: 'text',
          data: {
            heading: 'Why Clear Expectations Matter',
            paragraphs: [
              'Research shows that students perform better when they understand exactly what is expected of them. Clear expectations reduce anxiety, increase engagement, and create a predictable learning environment.',
              'Effective teachers establish expectations early and reinforce them consistently. This isn\'t about being strict—it\'s about creating a safe, structured space where learning can thrive.',
            ],
          },
        },
        {
          type: 'text',
          data: {
            heading: 'The 3-Step Framework',
            paragraphs: [
              '1. Define: Clearly state what you expect in specific, observable terms. Instead of "be respectful," say "listen when others are speaking and raise your hand to contribute."',
              '2. Model: Show students exactly what the expectation looks like in action. Demonstrate both the correct and incorrect behaviors.',
              '3. Practice: Give students opportunities to practice meeting expectations, especially during the first weeks of school.',
            ],
          },
        },
        {
          type: 'interactive',
          data: {
            title: 'Quick Reflection',
            prompt: 'Think about your current classroom expectations. Are they specific and observable?',
            tips: [
              'Use action verbs: "raise your hand" instead of "be polite"',
              'Make expectations measurable: "complete 3 problems" instead of "do your best"',
              'Keep the list short: 3-5 core expectations work better than 20 rules',
            ],
          },
        },
      ],
      completed: false,
    },
    {
      id: 2,
      title: 'Building Positive Relationships',
      duration: '2 min',
      content: [
        {
          type: 'text',
          data: {
            heading: 'The Relationship-Responsibility Connection',
            paragraphs: [
              'Students are more likely to follow expectations when they feel valued and connected to their teacher. Positive relationships are the foundation of effective classroom management.',
              'This doesn\'t mean being a friend—it means showing genuine interest in students as individuals, acknowledging their strengths, and creating opportunities for connection.',
            ],
          },
        },
        {
          type: 'text',
          data: {
            heading: 'Daily Connection Strategies',
            paragraphs: [
              'Greet students at the door: A simple "Good morning, [name]" sets a positive tone and shows you notice each student.',
              'Use positive narration: Instead of "Stop talking," try "I see Sarah is ready with her materials. Thank you, Sarah."',
              '2x10 strategy: Spend 2 minutes per day for 10 days having a personal conversation with a challenging student about non-academic topics.',
              'Celebrate small wins: Notice and acknowledge when students meet expectations, even in small ways.',
            ],
          },
        },
        {
          type: 'interactive',
          data: {
            title: 'Connection Challenge',
            prompt: 'This week, try greeting every student by name at the door. Notice the difference it makes.',
            tips: [
              'Set a reminder on your phone for the first week',
              'If you have a large class, rotate which students you greet personally',
              'Track which students respond most positively to this approach',
            ],
          },
        },
      ],
      completed: false,
    },
    {
      id: 3,
      title: 'Proactive Prevention Strategies',
      duration: '2 min',
      content: [
        {
          type: 'text',
          data: {
            heading: 'Prevention Beats Reaction',
            paragraphs: [
              'The best classroom management happens before problems occur. Proactive strategies anticipate challenges and address them before they escalate.',
              'Think of it like preventive medicine: addressing small issues early prevents major disruptions later.',
            ],
          },
        },
        {
          type: 'text',
          data: {
            heading: 'Key Proactive Techniques',
            paragraphs: [
              'Proximity control: Move around the room strategically. Your presence near off-task students often redirects behavior without words.',
              'Non-verbal cues: Develop a system of hand signals, eye contact, or gestures that communicate expectations silently.',
              'Smooth transitions: Plan transitions carefully. Unstructured time between activities invites misbehavior.',
              'Attention signals: Teach and practice a consistent way to get students\' attention (e.g., "Class, class" / "Yes, yes").',
              'Seating arrangements: Strategically place students who need more support near you or positive peer models.',
            ],
          },
        },
        {
          type: 'interactive',
          data: {
            title: 'Your Prevention Plan',
            prompt: 'Identify one transition time in your day that tends to be chaotic. Plan a specific routine for it.',
            tips: [
              'Write down the exact steps students should follow',
              'Practice the routine with students multiple times',
              'Use a timer to make transitions predictable',
              'Celebrate when transitions go smoothly',
            ],
          },
        },
      ],
      completed: false,
    },
    {
      id: 4,
      title: 'Responding to Challenges',
      duration: '2 min',
      content: [
        {
          type: 'text',
          data: {
            heading: 'The Escalation Ladder',
            paragraphs: [
              'When students don\'t meet expectations, respond in a way that maintains dignity and keeps the focus on learning. Start with the least intrusive intervention and escalate only if needed.',
              'The goal is to redirect behavior while preserving the relationship and minimizing disruption to other students.',
            ],
          },
        },
        {
          type: 'text',
          data: {
            heading: 'Response Strategies (Least to Most Intrusive)',
            paragraphs: [
              '1. Non-verbal: Eye contact, proximity, or a gesture',
              '2. Quiet verbal: A private word or whisper near the student',
              '3. Reminder: "Remember our expectation about..."',
              '4. Choice: "You can either [option A] or [option B]. Which do you choose?"',
              '5. Logical consequence: "Because you chose to [behavior], you need to [consequence]."',
              '6. Private conversation: Move to a private space to discuss the issue',
            ],
          },
        },
        {
          type: 'text',
          data: {
            heading: 'Key Principles',
            paragraphs: [
              'Stay calm: Your emotional regulation models the behavior you want to see.',
              'Be consistent: Apply consequences fairly and predictably.',
              'Focus on behavior, not character: "That choice was disruptive" not "You\'re disruptive."',
              'Preserve relationships: Every interaction should maintain or strengthen your connection with the student.',
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
        question: 'What is the most effective way to establish classroom expectations?',
        options: [
          'Post a long list of rules on the wall',
          'Define, model, and practice specific, observable behaviors',
          'Let students figure out expectations on their own',
          'Only mention expectations when students break them',
        ],
        correctAnswer: 1,
        explanation: 'The Define-Model-Practice framework is research-backed and helps students understand exactly what is expected.',
      },
      {
        id: 2,
        question: 'Which strategy is most effective for preventing disruptions?',
        options: [
          'Reacting quickly to every misbehavior',
          'Using proximity control and smooth transitions',
          'Ignoring minor disruptions',
          'Threatening consequences frequently',
        ],
        correctAnswer: 1,
        explanation: 'Proactive strategies like proximity control and well-planned transitions prevent problems before they start.',
      },
      {
        id: 3,
        question: 'When responding to challenging behavior, you should:',
        options: [
          'Start with the most severe consequence',
          'Escalate from least to most intrusive interventions',
          'Ignore it and hope it stops',
          'Call parents immediately',
        ],
        correctAnswer: 1,
        explanation: 'Starting with the least intrusive intervention preserves relationships and often resolves issues without escalation.',
      },
      {
        id: 4,
        question: 'The 2x10 strategy involves:',
        options: [
          'Spending 2 hours with 10 students',
          'Spending 2 minutes per day for 10 days connecting with a challenging student',
          'Giving 2 warnings before 10 consequences',
          'Meeting with 10 parents in 2 days',
        ],
        correctAnswer: 1,
        explanation: 'The 2x10 strategy builds relationships through brief, consistent personal connections.',
      },
    ],
  },
}

const ClassroomManagementCourse = () => {
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
      // Mark lesson as completed
      if (!completedLessons.includes(currentLesson)) {
        setCompletedLessons([...completedLessons, currentLesson])
      }
      setCurrentLesson(currentLesson + 1)
      setCurrentContentIndex(0)
    } else {
      // Last lesson completed
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
      // 70% to pass
      setCourseCompleted(true)
      setTimeout(() => setShowCertificate(true), 1000)
    }
  }

  const handleCompleteCourse = () => {
    navigate('/learning-hub')
  }

  if (showCertificate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 mb-4">
                <Award className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Congratulations!</h1>
              <p className="text-lg text-gray-600">You've completed the course</p>
            </div>

            <div className="border-2 border-amber-200 rounded-2xl p-8 mb-6 bg-gradient-to-br from-amber-50 to-orange-50">
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
              <div className="mt-6 pt-6 border-t border-amber-200">
                <p className="text-sm text-gray-600 mb-2">Certificate of Completion</p>
                <p className="text-lg font-semibold text-gray-900">This certifies that you have successfully completed</p>
                <p className="text-xl font-bold text-amber-600 mt-2">{courseData.title}</p>
                <p className="text-sm text-gray-500 mt-4">Issued on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 rounded-full bg-amber-600 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-700 flex items-center justify-center gap-2"
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
              <p className="text-sm text-gray-600 mt-1">Test your understanding of classroom management essentials</p>
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
                    ? 'You\'ve demonstrated a strong understanding of classroom management essentials!'
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
                className="rounded-full bg-amber-600 px-8 py-3 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-8 text-white shadow-xl">
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
                        <p className={`text-sm font-semibold truncate ${
                          isActive ? 'text-amber-900' : 'text-gray-900'
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
                <div className="rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{currentContent.data.title}</h3>
                      <p className="text-gray-700 mb-4">{currentContent.data.prompt}</p>
                      <div className="bg-white rounded-lg p-4 border border-amber-200">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Tips:</p>
                        <ul className="space-y-1">
                          {currentContent.data.tips.map((tip: string, idx: number) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                              <ChevronRight className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
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
                className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white text-sm font-semibold rounded-full hover:bg-amber-700 transition"
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

export default ClassroomManagementCourse



