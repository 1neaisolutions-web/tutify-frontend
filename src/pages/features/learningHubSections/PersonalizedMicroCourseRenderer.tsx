import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Award, BookOpen, CheckCircle2, ChevronRight, Clock, FileText, Lightbulb, Target, X } from 'lucide-react'
import { LearningHubSectionItem, resolvePersonalizedMicroCourseTheme } from '../../../features/learningHub'
import { useLearningHubContentScrollToTop } from '../../../features/learningHub/useLearningHubScrollToTop'

interface PersonalizedMicroCourseRendererProps {
  item: LearningHubSectionItem
}

const PersonalizedMicroCourseRenderer = ({ item }: PersonalizedMicroCourseRendererProps) => {
  const navigate = useNavigate()
  const [currentLesson, setCurrentLesson] = useState(0)
  const [currentContentIndex, setCurrentContentIndex] = useState(0)
  const [completedLessons, setCompletedLessons] = useState<number[]>([])
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [showCertificate, setShowCertificate] = useState(false)
  const contentTopRef = useRef<HTMLDivElement | null>(null)

  const content = item.personalizedMicroCourseContent
  const theme = useMemo(() => {
    if (!content) return null
    return content.theme ?? resolvePersonalizedMicroCourseTheme(content.themeId)
  }, [content])

  if (!content || !theme) {
    return null
  }

  const currentLessonData = content.lessons[currentLesson]
  const currentContent = currentLessonData?.contentBlocks[currentContentIndex]
  const progress = ((completedLessons.length + (currentLesson > 0 ? 1 : 0)) / content.lessons.length) * 100
  const score = Object.entries(quizAnswers).filter(
    ([qId, answer]) => content.quizQuestions[parseInt(qId, 10) - 1]?.correctAnswer === answer
  ).length
  const percentage = content.quizQuestions.length ? (score / content.quizQuestions.length) * 100 : 0
  const passed = percentage >= content.passingScorePercent
  const certificateDate = useMemo(
    () => new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    []
  )
  const activeLessonTitleClass = theme.accentIconText.replace('-600', '-900')

  const contentScreenKey = showCertificate
    ? 'certificate'
    : showQuiz
    ? 'quiz'
    : `${currentLessonData?.id ?? currentLesson}:${currentContentIndex}`
  useLearningHubContentScrollToTop(contentTopRef, contentScreenKey)

  const markCompletedAndMove = () => {
    if (!completedLessons.includes(currentLesson)) {
      setCompletedLessons([...completedLessons, currentLesson])
    }
  }

  const handleNext = () => {
    if (currentContentIndex < currentLessonData.contentBlocks.length - 1) {
      setCurrentContentIndex(currentContentIndex + 1)
      return
    }
    if (currentLesson < content.lessons.length - 1) {
      markCompletedAndMove()
      setCurrentLesson(currentLesson + 1)
      setCurrentContentIndex(0)
      return
    }
    markCompletedAndMove()
    setShowQuiz(true)
  }

  const handlePrevious = () => {
    if (currentContentIndex > 0) {
      setCurrentContentIndex(currentContentIndex - 1)
      return
    }
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1)
      setCurrentContentIndex(content.lessons[currentLesson - 1].contentBlocks.length - 1)
    }
  }

  if (showCertificate) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.accentBackground} flex items-center justify-center p-6`}>
        <div className='max-w-2xl w-full'>
          <div ref={contentTopRef} className='bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center'>
            <div className='mb-6'>
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${theme.primaryButton.split(' ')[0]} mb-4`}>
                <Award className='w-12 h-12 text-white' />
              </div>
              <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-2'>Congratulations!</h1>
              <p className='text-lg text-gray-600'>You've completed the course</p>
            </div>
            <div className={`border-2 ${theme.primaryBorder} rounded-2xl p-8 mb-6 bg-gradient-to-br ${theme.accentBackground}`}>
              <h2 className='text-2xl font-bold text-gray-900 mb-2'>{item.title}</h2>
              <div className='flex items-center justify-center gap-4 text-sm text-gray-600 mb-4'>
                <span className='flex items-center gap-1'><Clock className='w-4 h-4' />{item.duration}</span>
                <span className='flex items-center gap-1'><Target className='w-4 h-4' />{item.difficulty}</span>
              </div>
              <div className={`mt-6 pt-6 border-t ${theme.primaryBorder}`}>
                <p className='text-sm text-gray-600 mb-2'>Certificate of Completion</p>
                <p className='text-lg font-semibold text-gray-900'>This certifies that you have successfully completed</p>
                <p className={`text-xl font-bold ${theme.primaryText} mt-2`}>{item.title}</p>
                <p className='text-sm text-gray-500 mt-4'>Issued on {certificateDate}</p>
              </div>
            </div>
            <div className='flex flex-col sm:flex-row gap-3'>
              <button
                onClick={() => window.print()}
                className={`flex-1 rounded-full ${theme.primaryButton} px-6 py-3 text-sm font-semibold text-white flex items-center justify-center gap-2`}
              >
                <FileText className='w-4 h-4' /> Download Certificate
              </button>
              <button
                onClick={() => navigate('/learning-hub')}
                className='flex-1 rounded-full border-2 border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50'
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
    return (
      <div className='space-y-6'>
        <div ref={contentTopRef} className='bg-white rounded-2xl border border-gray-200 p-6 shadow-sm'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h2 className='text-2xl font-bold text-gray-900'>Course Assessment</h2>
              <p className='text-sm text-gray-600 mt-1'>{content.quizSubtitle}</p>
            </div>
            <button onClick={() => navigate('/learning-hub')} className='p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100'>
              <X className='w-5 h-5' />
            </button>
          </div>
          <div className='space-y-6'>
            {content.quizQuestions.map((question, idx) => {
              const userAnswer = quizAnswers[question.id]
              const isCorrect = userAnswer === question.correctAnswer
              return (
                <div key={question.id} className='border border-gray-200 rounded-xl p-6 bg-gray-50'>
                  <div className='flex items-start gap-3 mb-4'>
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                        quizSubmitted
                          ? isCorrect
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                          : `${theme.accentIconBg} ${theme.accentIconText}`
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <h3 className='text-lg font-semibold text-gray-900 mt-1'>{question.question}</h3>
                  </div>
                  <div className='space-y-2'>
                    {question.options.map((option, optIdx) => {
                      const isSelected = userAnswer === optIdx
                      const isCorrectOption = optIdx === question.correctAnswer
                      return (
                        <button
                          key={optIdx}
                          onClick={() => !quizSubmitted && setQuizAnswers({ ...quizAnswers, [question.id]: optIdx })}
                          disabled={quizSubmitted}
                          className={`w-full text-left p-4 rounded-lg border-2 transition ${
                            quizSubmitted
                              ? isCorrectOption
                                ? 'border-green-500 bg-green-50'
                                : isSelected
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-200 bg-white'
                              : isSelected
                              ? `${theme.accentBorder} ${theme.accentIconBg}`
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className='flex items-center gap-3'>
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                quizSubmitted
                                  ? isCorrectOption
                                    ? 'border-green-500 bg-green-500'
                                    : isSelected
                                    ? 'border-red-500 bg-red-500'
                                    : 'border-gray-300'
                                  : isSelected
                                  ? `${theme.accentIconBg} ${theme.accentBorder}`
                                  : 'border-gray-300'
                              }`}
                            >
                              {quizSubmitted && isCorrectOption && <CheckCircle2 className='w-3 h-3 text-white' />}
                              {isSelected && !quizSubmitted && <div className='w-2 h-2 bg-white rounded-full' />}
                            </div>
                            <span className='text-gray-700'>{option}</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                  {quizSubmitted && (
                    <div className={`mt-4 p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                      <p className={`text-sm font-semibold mb-1 ${isCorrect ? 'text-green-800' : 'text-amber-800'}`}>{isCorrect ? '✓ Correct!' : 'Explanation:'}</p>
                      <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-amber-700'}`}>{question.explanation}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          {quizSubmitted ? (
            <div className={`mt-6 p-6 rounded-2xl bg-gradient-to-r ${theme.accentBackground} ${theme.primaryBorder} border`}>
              <div className='text-center'>
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${theme.primaryButton.split(' ')[0]} mb-4`}>
                  {passed ? <Award className='w-8 h-8 text-white' /> : <Target className='w-8 h-8 text-white' />}
                </div>
                <h3 className='text-2xl font-bold text-gray-900 mb-2'>{passed ? 'Congratulations! You passed!' : 'Keep Learning'}</h3>
                <p className={`text-lg font-semibold ${theme.primaryText} mb-2`}>
                  Score: {score}/{content.quizQuestions.length} ({Math.round(percentage)}%)
                </p>
                <p className='text-sm text-gray-600 mb-4'>{passed ? content.successMessage : `Review the course materials and try again. You need ${content.passingScorePercent}% to pass.`}</p>
                {passed ? (
                  <button onClick={() => setShowCertificate(true)} className={`rounded-full ${theme.primaryButton} px-6 py-3 text-sm font-semibold text-white flex items-center justify-center gap-2 mx-auto`}>
                    <Award className='w-4 h-4' /> View Certificate
                  </button>
                ) : (
                  <div className='flex gap-3 justify-center'>
                    <button
                      onClick={() => {
                        setShowQuiz(false)
                        setCurrentLesson(0)
                        setCurrentContentIndex(0)
                        setQuizAnswers({})
                        setQuizSubmitted(false)
                      }}
                      className={`rounded-full ${theme.primaryButton} px-6 py-3 text-sm font-semibold text-white`}
                    >
                      Review Course
                    </button>
                    <button onClick={() => { setQuizAnswers({}); setQuizSubmitted(false) }} className='rounded-full border-2 border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50'>
                      Retake Quiz
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className='mt-6 flex justify-end'>
              <button
                onClick={() => setQuizSubmitted(true)}
                disabled={Object.keys(quizAnswers).length < content.quizQuestions.length}
                className={`rounded-full ${theme.primaryButton} px-8 py-3 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
              >
                Submit Assessment <ArrowRight className='w-4 h-4' />
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className={`bg-gradient-to-r ${theme.headerGradient} rounded-3xl p-8 text-white shadow-xl`}>
        <div className='flex items-start justify-between mb-6'>
          <div className='flex-1'>
            <div className='flex items-center gap-2 mb-3'>
              <span className='rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide'>{item.subtitle}</span>
              <span className='text-white/80'>•</span><span className='text-white/80 text-sm'>{item.duration}</span>
              <span className='text-white/80'>•</span><span className='text-white/80 text-sm'>{item.difficulty}</span>
            </div>
            <h1 className='text-3xl font-bold mb-3'>{item.title}</h1>
            <p className='text-white/90 text-lg mb-4'>{content.description}</p>
            <div className='flex items-center gap-4 text-sm'>
              <div className='flex items-center gap-2'><Clock className='w-4 h-4' /><span>Progress: {Math.round(progress)}%</span></div>
              <div className='flex items-center gap-2'><BookOpen className='w-4 h-4' /><span>Lesson {currentLesson + 1} of {content.lessons.length}</span></div>
            </div>
            <div className='mt-4 h-2 bg-white/20 rounded-full overflow-hidden'>
              <div className='h-full bg-white rounded-full transition-all duration-300' style={{ width: `${progress}%` }} />
            </div>
          </div>
          <button onClick={() => navigate('/learning-hub')} className='p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition'><X className='w-5 h-5' /></button>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        <div className='lg:col-span-1'>
          <div className='bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-6'>
            <h3 className='text-sm font-semibold uppercase tracking-wide text-gray-600 mb-4'>Course Content</h3>
            <div className='space-y-2'>
              {content.lessons.map((lesson, idx) => {
                const isActive = idx === currentLesson
                const isCompleted = completedLessons.includes(idx)
                return (
                  <button
                    key={lesson.id}
                    onClick={() => { setCurrentLesson(idx); setCurrentContentIndex(0) }}
                    className={`w-full text-left p-3 rounded-lg transition ${isActive ? `${theme.accentBackground.startsWith('from') ? 'bg-gray-50' : ''} border-2 ${theme.accentBorder}` : 'border-2 border-transparent hover:bg-gray-50'}`}
                  >
                    <div className='flex items-center gap-3'>
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-100 text-green-600' : isActive ? `${theme.accentIconBg} ${theme.accentIconText}` : 'bg-gray-100 text-gray-400'}`}>
                        {isCompleted ? <CheckCircle2 className='w-4 h-4' /> : <span className='text-xs font-semibold'>{idx + 1}</span>}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className={`text-sm font-semibold truncate ${isActive ? activeLessonTitleClass : 'text-gray-900'}`}>{lesson.title}</p>
                        <p className='text-xs text-gray-500 mt-0.5'>{lesson.duration}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
        <div className='lg:col-span-3'>
          <div ref={contentTopRef} className='bg-white rounded-2xl border border-gray-200 p-8 shadow-sm'>
            <div className='mb-6 pb-6 border-b border-gray-200'>
              <div className='flex items-center gap-2 text-sm text-gray-600 mb-2'>
                <span>Lesson {currentLesson + 1} of {content.lessons.length}</span><span>•</span><span>{currentLessonData.duration}</span>
              </div>
              <h2 className='text-2xl font-bold text-gray-900'>{currentLessonData.title}</h2>
            </div>
            <div className='space-y-8 mb-8'>
              {currentContent.type === 'text' ? (
                <div className='prose max-w-none'>
                  <h3 className='text-xl font-bold text-gray-900 mb-4'>{currentContent.heading}</h3>
                  {currentContent.paragraphs.map((para) => <p key={para} className='text-gray-700 leading-relaxed mb-4'>{para}</p>)}
                </div>
              ) : (
                <div className={`rounded-2xl border-2 ${theme.accentBorder} bg-gradient-to-br ${theme.accentBackground} p-6`}>
                  <div className='flex items-start gap-3 mb-4'>
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full ${theme.accentIconBg} flex items-center justify-center`}>
                      <Lightbulb className={`w-5 h-5 ${theme.accentIconText}`} />
                    </div>
                    <div className='flex-1'>
                      <h3 className='text-lg font-bold text-gray-900 mb-2'>{currentContent.title}</h3>
                      <p className='text-gray-700 mb-4'>{currentContent.prompt}</p>
                      <div className={`bg-white rounded-lg p-4 border ${theme.accentBorder}`}>
                        <p className='text-sm font-semibold text-gray-700 mb-2'>Tips:</p>
                        <ul className='space-y-1'>
                          {currentContent.tips.map((tip) => (
                            <li key={tip} className='text-sm text-gray-600 flex items-start gap-2'>
                              <ChevronRight className={`w-4 h-4 ${theme.accentIconText} mt-0.5 flex-shrink-0`} />
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
            <div className='flex items-center justify-between pt-6 border-t border-gray-200'>
              <button onClick={handlePrevious} disabled={currentLesson === 0 && currentContentIndex === 0} className='flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition'>
                <ArrowLeft className='w-4 h-4' /> Previous
              </button>
              <div className='flex items-center gap-2 text-sm text-gray-600'>
                <span>Content {currentContentIndex + 1} of {currentLessonData.contentBlocks.length}</span>
              </div>
              <button onClick={handleNext} className={`flex items-center gap-2 px-6 py-3 ${theme.primaryButton} text-white text-sm font-semibold rounded-full transition`}>
                {currentContentIndex === currentLessonData.contentBlocks.length - 1 && currentLesson === content.lessons.length - 1
                  ? 'Complete Course'
                  : currentContentIndex === currentLessonData.contentBlocks.length - 1
                  ? 'Next Lesson'
                  : 'Continue'}
                <ArrowRight className='w-4 h-4' />
              </button>
            </div>
          </div>
          <div className={`mt-6 bg-gradient-to-br ${theme.accentBackground} rounded-2xl border ${theme.accentBorder} p-6`}>
            <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
              <Target className={`w-5 h-5 ${theme.accentIconText}`} /> Learning Objectives
            </h3>
            <ul className='space-y-2'>
              {content.learningObjectives.map((objective) => (
                <li key={objective} className='flex items-start gap-2 text-sm text-gray-700'>
                  <CheckCircle2 className={`w-4 h-4 ${theme.accentIconText} mt-0.5 flex-shrink-0`} />
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

export default PersonalizedMicroCourseRenderer

