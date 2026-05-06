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
  Bot,
  Code,
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
  title: 'AI tools for lesson planning',
  category: 'Digital literacy & AI readiness',
  duration: '9 min',
  difficulty: 'Advanced',
  description: 'Master AI-powered tools to streamline lesson planning, create engaging content, and personalize instruction while maintaining pedagogical integrity.',
  learningObjectives: [
    'Select appropriate AI tools for different lesson planning tasks',
    'Write effective prompts that generate high-quality educational content',
    'Integrate AI tools into your lesson planning workflow efficiently',
    'Use AI ethically and maintain teacher judgment in content creation',
  ],
  lessons: [
    {
      id: 1,
      title: 'Introduction to AI in Education',
      duration: '2 min',
      content: [
        {
          type: 'text',
          data: {
            heading: 'The AI Revolution in Teaching',
            paragraphs: [
              'AI tools can help teachers save time on routine tasks like generating lesson plans, creating assessments, and developing differentiated activities. However, AI is a tool, not a replacement for teacher expertise.',
              'Effective use of AI requires understanding what it can and cannot do, maintaining pedagogical judgment, and using it to enhance rather than replace your professional skills.',
            ],
          },
        },
        {
          type: 'text',
          data: {
            heading: 'What AI Can Do',
            paragraphs: [
              'Generate lesson plan templates and outlines',
              'Create differentiated activities and assessments',
              'Suggest learning objectives aligned to standards',
              'Generate discussion questions and prompts',
              'Provide ideas for engaging activities',
            ],
          },
        },
        {
          type: 'text',
          data: {
            heading: 'What AI Cannot Do',
            paragraphs: [
              'Understand your specific students\' needs and contexts',
              'Replace your pedagogical expertise and judgment',
              'Know your school\'s culture and community',
              'Make decisions about what\'s developmentally appropriate',
              'Build relationships with students',
            ],
          },
        },
        {
          type: 'interactive',
          data: {
            title: 'Reflection',
            prompt: 'Think about your current lesson planning process. Which tasks take the most time? How might AI help?',
            tips: [
              'Identify repetitive tasks that could be streamlined',
              'Consider where AI-generated ideas could spark creativity',
              'Think about tasks that require your unique expertise',
              'Remember: AI enhances, not replaces, your skills',
            ],
          },
        },
      ],
      completed: false,
    },
    {
      id: 2,
      title: 'Selecting the Right AI Tools',
      duration: '2 min',
      content: [
        {
          type: 'text',
          data: {
            heading: 'Popular AI Tools for Teachers',
            paragraphs: [
              'ChatGPT/Claude: General-purpose AI assistants for generating content, brainstorming, and answering questions',
              'Curipod: AI-powered interactive presentations and lessons',
              'Diffit: Creates differentiated reading materials',
              'MagicSchool: Suite of AI tools specifically for teachers',
              'Canva AI: Generates images and designs for lessons',
            ],
          },
        },
        {
          type: 'text',
          data: {
            heading: 'Choosing the Right Tool',
            paragraphs: [
              'Consider your specific need: Are you planning a lesson, creating assessments, or generating activities?',
              'Evaluate output quality: Test tools with sample prompts to see if they meet your standards',
              'Check privacy and data policies: Ensure student data is protected',
              'Consider cost: Some tools are free, others require subscriptions',
            ],
          },
        },
        {
          type: 'interactive',
          data: {
            title: 'Tool Selection',
            prompt: 'Identify one AI tool you\'d like to try. What specific task will you use it for?',
            tips: [
              'Start with one tool and master it before adding more',
              'Choose a tool that addresses a specific pain point',
              'Test it with a simple task first',
              'Evaluate if it actually saves time and improves quality',
            ],
          },
        },
      ],
      completed: false,
    },
    {
      id: 3,
      title: 'Mastering Prompt Engineering',
      duration: '3 min',
      content: [
        {
          type: 'text',
          data: {
            heading: 'The Art of Prompting',
            paragraphs: [
              'Effective prompts are specific, contextual, and include clear instructions. The better your prompt, the better the AI output.',
              'A good prompt includes: context (grade level, subject), specific requirements (learning objectives, standards), format preferences, and constraints (time, resources).',
            ],
          },
        },
        {
          type: 'text',
          data: {
            heading: 'Prompt Structure',
            paragraphs: [
              'Role: "You are an experienced [grade] [subject] teacher..."',
              'Task: "Create a lesson plan for..."',
              'Context: "My students are [description]..."',
              'Requirements: "Include [specific elements]..."',
              'Format: "Present it as [format]..."',
            ],
          },
        },
        {
          type: 'text',
          data: {
            heading: 'Example Prompt',
            paragraphs: [
              'You are an experienced 5th-grade science teacher. Create a 45-minute lesson plan on the water cycle for students who are visual and kinesthetic learners. Include: learning objectives aligned to NGSS, a hands-on activity, formative assessment, and differentiation for struggling learners. Present it as a step-by-step guide with time allocations.',
            ],
          },
        },
        {
          type: 'interactive',
          data: {
            title: 'Write Your Prompt',
            prompt: 'Write a detailed prompt for an AI tool to help with an upcoming lesson. Include role, task, context, requirements, and format.',
            tips: [
              'Be specific about grade level and subject',
              'Include information about your students',
              'Specify learning objectives or standards',
              'Request the format you prefer',
              'Ask for revisions if the output doesn\'t meet your needs',
            ],
          },
        },
      ],
      completed: false,
    },
    {
      id: 4,
      title: 'Integrating AI into Your Workflow',
      duration: '2 min',
      content: [
        {
          type: 'text',
          data: {
            heading: 'A Practical Workflow',
            paragraphs: [
              '1. Start with your learning objectives and standards',
              '2. Use AI to generate initial ideas and structures',
              '3. Review and refine AI output with your expertise',
              '4. Personalize for your specific students and context',
              '5. Add your own creative touches and modifications',
            ],
          },
        },
        {
          type: 'text',
          data: {
            heading: 'Maintaining Quality',
            paragraphs: [
              'Always review AI-generated content for accuracy, appropriateness, and alignment with your goals',
              'Customize AI output to fit your teaching style and students\' needs',
              'Use AI as a starting point, not a final product',
              'Combine AI efficiency with your professional judgment',
            ],
          },
        },
        {
          type: 'text',
          data: {
            heading: 'Ethical Considerations',
            paragraphs: [
              'Protect student privacy: Never input student names or personal information',
              'Maintain academic integrity: Use AI to enhance your work, not replace your thinking',
              'Be transparent: If required by your school, disclose AI use',
              'Stay informed: AI tools and policies evolve rapidly',
            ],
          },
        },
        {
          type: 'interactive',
          data: {
            title: 'Your AI Workflow',
            prompt: 'Design your own workflow for integrating AI into lesson planning. What steps will you follow?',
            tips: [
              'Start with clear learning objectives',
              'Use AI for ideation and structure',
              'Always review and refine output',
              'Personalize for your students',
              'Maintain your professional judgment',
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
        question: 'What is the primary role of AI in lesson planning?',
        options: [
          'To replace teachers',
          'To enhance teacher efficiency while maintaining professional judgment',
          'To eliminate the need for planning',
          'To make all lessons identical',
        ],
        correctAnswer: 1,
        explanation: 'AI should enhance teacher efficiency and creativity while teachers maintain their professional judgment and expertise.',
      },
      {
        id: 2,
        question: 'What should an effective AI prompt include?',
        options: [
          'Only the topic',
          'Context, specific requirements, format preferences, and constraints',
          'Just the grade level',
          'A single sentence',
        ],
        correctAnswer: 1,
        explanation: 'Effective prompts include context (grade level, subject), specific requirements, format preferences, and constraints to generate high-quality output.',
      },
      {
        id: 3,
        question: 'What is a key ethical consideration when using AI?',
        options: [
          'Never use AI at all',
          'Protect student privacy and maintain academic integrity',
          'Use AI for everything',
          'Share all AI outputs publicly',
        ],
        correctAnswer: 1,
        explanation: 'Key ethical considerations include protecting student privacy, maintaining academic integrity, and being transparent about AI use when required.',
      },
      {
        id: 4,
        question: 'How should you use AI-generated content?',
        options: [
          'Use it exactly as generated',
          'As a starting point that you review, refine, and personalize',
          'Only for assessments',
          'Never review it',
        ],
        correctAnswer: 1,
        explanation: 'AI-generated content should be used as a starting point that you review, refine, and personalize with your expertise and knowledge of your students.',
      },
    ],
  },
}

const DigitalLiteracyCourse = () => {
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 mb-4">
                <Award className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Congratulations!</h1>
              <p className="text-lg text-gray-600">You've completed the course</p>
            </div>

            <div className="border-2 border-indigo-200 rounded-2xl p-8 mb-6 bg-gradient-to-br from-indigo-50 to-blue-50">
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
              <div className="mt-6 pt-6 border-t border-indigo-200">
                <p className="text-sm text-gray-600 mb-2">Certificate of Completion</p>
                <p className="text-lg font-semibold text-gray-900">This certifies that you have successfully completed</p>
                <p className="text-xl font-bold text-indigo-600 mt-2">{courseData.title}</p>
                <p className="text-sm text-gray-500 mt-4">Issued on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 flex items-center justify-center gap-2"
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
              <p className="text-sm text-gray-600 mt-1">Test your understanding of AI tools for lesson planning</p>
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
                        : 'bg-indigo-100 text-indigo-700'
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
                                  ? 'border-indigo-500 bg-indigo-50'
                                  : 'border-gray-200 bg-white hover:border-indigo-300'
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
                                    ? 'border-indigo-500 bg-indigo-500'
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
            <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600 mb-4">
                  {passed ? (
                    <Award className="w-8 h-8 text-white" />
                  ) : (
                    <Target className="w-8 h-8 text-white" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {passed ? 'Congratulations! You passed!' : 'Keep Learning'}
                </h3>
                <p className="text-lg font-semibold text-indigo-600 mb-2">
                  Score: {score}/{courseData.quiz.questions.length} ({Math.round(percentage)}%)
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  {passed
                    ? 'You\'ve demonstrated a strong understanding of AI tools for lesson planning!'
                    : 'Review the course materials and try again. You need 70% to pass.'}
                </p>
                {passed ? (
                  <button
                    onClick={() => setShowCertificate(true)}
                    className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 flex items-center justify-center gap-2 mx-auto"
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
                      className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
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
                className="rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
      <div className="bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 rounded-3xl p-8 text-white shadow-xl">
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
                        ? 'bg-indigo-50 border-2 border-indigo-300'
                        : 'border-2 border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? 'bg-green-100 text-green-600'
                          : isActive
                          ? 'bg-indigo-100 text-indigo-600'
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
                          isActive ? 'text-indigo-900' : 'text-gray-900'
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
                <div className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{currentContent.data.title}</h3>
                      <p className="text-gray-700 mb-4">{currentContent.data.prompt}</p>
                      <div className="bg-white rounded-lg p-4 border border-indigo-200">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Tips:</p>
                        <ul className="space-y-1">
                          {currentContent.data.tips.map((tip: string, idx: number) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                              <ChevronRight className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
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
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-full hover:bg-indigo-700 transition"
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
          <div className="mt-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              Learning Objectives
            </h3>
            <ul className="space-y-2">
              {courseData.learningObjectives.map((objective, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
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

export default DigitalLiteracyCourse



