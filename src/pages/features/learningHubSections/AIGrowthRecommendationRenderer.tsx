import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Bookmark,
  CheckCircle2,
  Circle,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  Lightbulb,
  Lock,
  Pause,
  Play,
  Rocket,
  Share2,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Video,
  Zap,
} from 'lucide-react'
import {
  buildLearningHubSectionPath,
  LearningHubSectionItem,
  resolveAIGrowthLessonVideoMedia,
  resolveAIGrowthPathTheme,
  resolveSkillLabel,
  videoMediaToLessonEmbed,
} from '../../../features/learningHub'
import { useLearningHubContentScrollToTop } from '../../../features/learningHub/useLearningHubScrollToTop'
import { resolveAIGrowthModulePageVisual } from '../../../features/learningHub/content/aiGrowthModuleVisuals'
import AIGrowthStudentEngagementPathView from './AIGrowthStudentEngagementPathView'

interface AIGrowthRecommendationRendererProps {
  item: LearningHubSectionItem
}

const levelPill = (level: string) => {
  switch (level) {
    case 'Beginner':
      return 'bg-green-100 text-green-700'
    case 'Intermediate':
      return 'bg-blue-100 text-blue-700'
    case 'Advanced':
      return 'bg-purple-100 text-purple-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const impactPill = (impact: string) => {
  switch (impact) {
    case 'High':
      return 'bg-red-100 text-red-700 border-red-200'
    case 'Medium':
      return 'bg-amber-100 text-amber-700 border-amber-200'
    case 'Low':
      return 'bg-blue-100 text-blue-700 border-blue-200'
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

const AIGrowthRecommendationRenderer = ({ item }: AIGrowthRecommendationRendererProps) => {
  const navigate = useNavigate()
  const content = item.aiGrowthRecommendationContent
  const [activeModule, setActiveModule] = useState<string | null>(null)
  const [completedModules, setCompletedModules] = useState<string[]>([])
  const [currentModuleLesson, setCurrentModuleLesson] = useState(0)
  const [isLessonPlaying, setIsLessonPlaying] = useState(false)

  useEffect(() => {
    setIsLessonPlaying(false)
  }, [currentModuleLesson])
  const [completedModuleLessons, setCompletedModuleLessons] = useState<string[]>([])
  const [engagementLevelFilter, setEngagementLevelFilter] = useState<'all' | 'Beginner' | 'Intermediate' | 'Advanced'>('all')
  const isPathContent = content?.type === 'path'
  const contentTopRef = useRef<HTMLDivElement | null>(null)
  const contentScreenKey =
    content?.type === 'module'
      ? `${content.module.slug}:${content.module.detail?.lessons?.[currentModuleLesson]?.id ?? currentModuleLesson}`
      : `path:${activeModule ?? 'overview'}`
  useLearningHubContentScrollToTop(contentTopRef, contentScreenKey)

  useEffect(() => {
    if (!isPathContent || typeof window === 'undefined') {
      setCompletedModules([])
      return
    }
    const saved = localStorage.getItem(content.storageKey)
    setCompletedModules(saved ? JSON.parse(saved) : [])
  }, [content, isPathContent])

  useEffect(() => {
    if (!content || content.type !== 'module' || typeof window === 'undefined') {
      setCurrentModuleLesson(0)
      setCompletedModuleLessons([])
      return
    }
    const storageKey = `${content.module.slug}-completed-lessons`
    const saved = localStorage.getItem(storageKey)
    setCompletedModuleLessons(saved ? JSON.parse(saved) : [])
    setCurrentModuleLesson(0)
  }, [content])

  if (!content) return null

  const unlockedModules = useMemo(
    () => {
      if (!isPathContent) return []
      return content.modules.map((module, index) => {
        if (index < 3) return { ...module, locked: false }
        if (index === 3) {
          const firstThreeCompleted = content.modules.slice(0, 3).every((m) => completedModules.includes(m.id))
          return { ...module, locked: !firstThreeCompleted }
        }
        return { ...module, locked: !completedModules.includes(content.modules[index - 1].id) }
      })
    },
    [completedModules, content, isPathContent]
  )
  const availableModules = unlockedModules.filter((m) => !m.locked)
  const progress = availableModules.length ? (completedModules.length / availableModules.length) * 100 : 0
  const completedCount = completedModules.length

  const markComplete = (moduleId: string) => {
    if (!isPathContent) return
    if (completedModules.includes(moduleId)) return
    const next = [...completedModules, moduleId]
    setCompletedModules(next)
    localStorage.setItem(content.storageKey, JSON.stringify(next))
  }

  if (content.type === 'module') {
    const module = content.module
    const lessons = module.detail?.lessons ?? []
    const currentLesson = lessons[currentModuleLesson]
    const v = module.detail?.pageVisual ?? resolveAIGrowthModulePageVisual(content.parentPathSlug, module.slug)
    const totalPoints = lessons.reduce((sum, c) => sum + (c.points ?? 0), 0) || module.content.reduce((sum, c) => sum + (c.points ?? 0), 0)
    const earnedPoints = lessons.filter((l) => completedModuleLessons.includes(l.id)).reduce((s, l) => s + l.points, 0)
    const lessonProgress = lessons.length ? (completedModuleLessons.length / lessons.length) * 100 : 0
    const isTieredSidebar = v.sidebarStyle === 'tiered'

    const persistLessonComplete = (lessonId: string) => {
      if (completedModuleLessons.includes(lessonId) || typeof window === 'undefined') return
      const next = [...completedModuleLessons, lessonId]
      setCompletedModuleLessons(next)
      localStorage.setItem(`${module.slug}-completed-lessons`, JSON.stringify(next))
    }

    const onFooterAdvanceComplete = () => {
      if (!currentLesson || completedModuleLessons.includes(currentLesson.id)) return
      persistLessonComplete(currentLesson.id)
      if (currentModuleLesson < lessons.length - 1) setCurrentModuleLesson(currentModuleLesson + 1)
    }

    const markCompleteBtnClasses = `w-full px-6 py-3 text-white rounded-lg font-semibold transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${v.markCompleteButton}`

    const lessonTypeIcon = (type: string) => {
      if (type === 'video') return Video
      if (type === 'reading') return BookOpen
      if (type === 'interactive') return Zap
      return FileText
    }

    const lessonVideoMedia =
      currentLesson?.type === 'video'
        ? resolveAIGrowthLessonVideoMedia(module, currentModuleLesson, lessons)
        : undefined
    const lessonVideoEmbed = lessonVideoMedia ? videoMediaToLessonEmbed(lessonVideoMedia) : undefined

    return (
      <div className='space-y-6'>
        <div className={`bg-gradient-to-r ${v.headerGradient} rounded-3xl p-8 text-white shadow-xl`}>
          <div className='flex items-start justify-between mb-6'>
            <div className='flex-1'>
              <div className='flex items-center gap-3 mb-4'>
                <button
                  type='button'
                  onClick={() => navigate(buildLearningHubSectionPath('ai-growth-recommendations', content.parentPathSlug))}
                  className='p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition shrink-0'
                >
                  <ArrowLeft className='h-5 w-5' />
                </button>
                <div className='min-w-0'>
                  <div className='flex flex-wrap items-center gap-2 mb-2'>
                    <span className='px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wide'>
                      {module.detail?.moduleLabel ?? 'Module'}
                    </span>
                    <span className='text-white/80'>•</span>
                    <span className='text-white/80 text-sm flex items-center gap-1'>
                      <Clock className='h-3 w-3' />
                      {module.duration}
                    </span>
                    {v.heroShowEarnedPoints ? (
                      <>
                        <span className='text-white/80'>•</span>
                        <span className='text-white/80 text-sm flex items-center gap-1'>
                          <Star className='h-3 w-3' />
                          {earnedPoints} / {totalPoints} points
                        </span>
                      </>
                    ) : null}
                  </div>
                  <h1 className='text-3xl font-bold'>{module.title}</h1>
                  <p className={`mt-2 ${v.heroSubtitleClass}`}>{module.description}</p>
                </div>
              </div>
              <div className={`flex flex-wrap items-center gap-4 text-sm ${v.heroShowImpactRow ? 'mb-4' : ''}`}>
                {v.heroShowImpactRow ? (
                  <>
                    <div className='flex items-center gap-2'>
                      <Target className='w-4 h-4 shrink-0' />
                      <span>{module.impact} Impact</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Trophy className='w-4 h-4 shrink-0' />
                      <span>
                        {completedModuleLessons.length} of {lessons.length} lessons completed
                      </span>
                    </div>
                  </>
                ) : (
                  <div className='flex items-center gap-2'>
                    <Target className='w-4 h-4 shrink-0' />
                    <span>
                      {completedModuleLessons.length} of {lessons.length} lessons completed
                    </span>
                  </div>
                )}
                <div className='flex items-center gap-2'>
                  <TrendingUp className='w-4 h-4 shrink-0' />
                  <span>{Math.round(lessonProgress)}% Complete</span>
                </div>
              </div>
              <div className='mt-4 h-2 bg-white/20 rounded-full overflow-hidden'>
                <div className='h-full bg-white rounded-full transition-all duration-300' style={{ width: `${lessonProgress}%` }} />
              </div>
            </div>
            {v.heroShowBookmarkShare ? (
              <div className='flex items-center gap-2 shrink-0'>
                <button type='button' className='p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition'>
                  <Bookmark className='h-5 w-5' />
                </button>
                <button type='button' className='p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition'>
                  <Share2 className='h-5 w-5' />
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-6'>
              <h3 className='text-sm font-semibold uppercase tracking-wide text-gray-600 mb-4'>Lessons</h3>
              <div className='space-y-2'>
                {lessons.map((lesson, idx) => {
                  const isActive = idx === currentModuleLesson
                  const isCompleted = completedModuleLessons.includes(lesson.id)
                  const TypeIcon = lessonTypeIcon(lesson.type)

                  if (isTieredSidebar) {
                    return (
                      <button
                        key={lesson.id}
                        type='button'
                        onClick={() => setCurrentModuleLesson(idx)}
                        className={`w-full text-left p-3 rounded-lg transition ${
                          isActive
                            ? v.tieredSidebarActive
                            : isCompleted
                              ? v.tieredSidebarCompleted
                              : v.tieredSidebarIdle
                        }`}
                      >
                        <div className='flex items-center gap-2 mb-1'>
                          {isCompleted ? (
                            <CheckCircle2 className={`h-4 w-4 ${v.tieredSidebarCheckComplete}`} />
                          ) : (
                            <Circle className='h-4 w-4 text-gray-400' />
                          )}
                          <span className='text-xs font-semibold'>Lesson {idx + 1}</span>
                        </div>
                        <div className='flex items-center gap-2 text-xs text-gray-600'>
                          <TypeIcon className='h-3 w-3 shrink-0' />
                          <span>{lesson.title}</span>
                        </div>
                        {lesson.duration ? (
                          <div className='text-xs text-gray-500 mt-1 flex items-center gap-1'>
                            <Clock className='h-3 w-3' />
                            {lesson.duration}
                          </div>
                        ) : null}
                      </button>
                    )
                  }

                  return (
                    <button
                      key={lesson.id}
                      type='button'
                      onClick={() => setCurrentModuleLesson(idx)}
                      className={`w-full text-left p-3 rounded-lg transition ${isActive ? v.engagementSidebarActive : v.engagementSidebarIdle}`}
                    >
                      <div className='flex items-center gap-3'>
                        <div
                          className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                            isCompleted ? v.engagementNumCompleted : isActive ? v.engagementNumActive : v.engagementNumIdle
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className='w-4 h-4' /> : <span className='text-xs font-semibold'>{idx + 1}</span>}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center gap-2 mb-1'>
                            <TypeIcon className='h-3 w-3 shrink-0' />
                            <p className={`text-sm font-semibold truncate ${isActive ? v.engagementTitleActive : 'text-gray-900'}`}>{lesson.title}</p>
                          </div>
                          {lesson.duration ? <p className='text-xs text-gray-500'>{lesson.duration}</p> : null}
                          <p className='text-xs text-gray-500'>{lesson.points} points</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
              {isTieredSidebar ? (
                <div className='mt-6 pt-6 border-t border-gray-200'>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='text-xs text-gray-600'>Progress</span>
                    <span className='text-xs font-semibold text-gray-900'>{Math.round(lessonProgress)}%</span>
                  </div>
                  <div className='h-2 bg-gray-200 rounded-full overflow-hidden'>
                    <div className={`h-full ${v.sidebarProgressFill} rounded-full transition-all duration-300`} style={{ width: `${lessonProgress}%` }} />
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className='lg:col-span-3'>
            <div ref={contentTopRef} className='bg-white rounded-2xl border border-gray-200 p-8 shadow-sm'>
              {currentLesson ? (
                <div className='space-y-6'>
                  {v.sidebarStyle === 'engagement' ? (
                    <div className='mb-6 pb-6 border-b border-gray-200'>
                      <div className='flex items-center justify-between mb-4'>
                        <div>
                          <div className='flex items-center gap-2 text-sm text-gray-600 mb-2'>
                            <span>
                              Lesson {currentModuleLesson + 1} of {lessons.length}
                            </span>
                            <span>•</span>
                            <span>{currentLesson.points} points</span>
                            {currentLesson.duration ? (
                              <>
                                <span>•</span>
                                <span>{currentLesson.duration}</span>
                              </>
                            ) : null}
                          </div>
                          <h2 className='text-2xl font-bold text-gray-900'>{currentLesson.title}</h2>
                        </div>
                        {completedModuleLessons.includes(currentLesson.id) ? (
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shrink-0 ml-2 ${v.completedLessonBadge}`}>
                            <CheckCircle2 className='h-4 w-4' />
                            Completed
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  {currentLesson.type === 'video' && (
                    <div className='space-y-6'>
                      {v.sidebarStyle === 'tiered' ? (
                        <div className='flex items-center justify-between mb-6'>
                          <div>
                            <div className='flex items-center gap-2 mb-2'>
                              <Video className={`h-5 w-5 ${v.lessonTypeIconClass}`} />
                              <span className='text-sm font-semibold text-gray-600 uppercase tracking-wide'>Video Lesson</span>
                            </div>
                            <h2 className='text-2xl font-bold text-gray-900'>{currentLesson.title}</h2>
                          </div>
                          <div className='flex items-center gap-2'>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${v.pointsPill}`}>{currentLesson.points} points</span>
                            {v.showLessonHeaderShare ? (
                              <>
                                <button type='button' className='p-2 hover:bg-gray-100 rounded-lg transition'>
                                  <Bookmark className='h-5 w-5 text-gray-400' />
                                </button>
                                <button type='button' className='p-2 hover:bg-gray-100 rounded-lg transition'>
                                  <Share2 className='h-5 w-5 text-gray-400' />
                                </button>
                              </>
                            ) : null}
                          </div>
                        </div>
                      ) : null}

                      <div className='bg-gray-900 rounded-xl aspect-video flex items-center justify-center relative overflow-hidden'>
                        {lessonVideoEmbed ? (
                          lessonVideoEmbed.kind === 'iframe' ? (
                            <iframe
                              title={lessonVideoEmbed.title ?? currentLesson.title}
                              src={lessonVideoEmbed.src}
                              className='absolute inset-0 h-full w-full border-0'
                              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                              allowFullScreen
                            />
                          ) : (
                            <video
                              src={lessonVideoEmbed.src}
                              controls={lessonVideoEmbed.controls}
                              poster={lessonVideoEmbed.posterUrl}
                              className='absolute inset-0 h-full w-full object-contain bg-black'
                              playsInline
                            />
                          )
                        ) : (
                          <>
                            <div className={`absolute inset-0 bg-gradient-to-br ${v.videoOverlayGradient} opacity-20`} />
                            <button
                              type='button'
                              onClick={() => setIsLessonPlaying(!isLessonPlaying)}
                              className={
                                v.videoPlayUseTranslucent
                                  ? 'relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition'
                                  : 'relative z-10 w-20 h-20 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition shadow-xl'
                              }
                            >
                              {isLessonPlaying ? (
                                <Pause className={v.videoPlayUseTranslucent ? 'h-8 w-8' : `h-8 w-8 ${v.videoPlayIconClass} ml-1`} />
                              ) : (
                                <Play className={v.videoPlayUseTranslucent ? 'h-8 w-8 ml-1' : `h-8 w-8 ${v.videoPlayIconClass} ml-1`} />
                              )}
                            </button>
                            {isLessonPlaying && v.sidebarStyle === 'tiered' ? (
                              <div className='absolute bottom-4 left-4 right-4 z-10'>
                                <div className='h-1 bg-white/30 rounded-full overflow-hidden'>
                                  <div className='h-full bg-green-500 rounded-full' style={{ width: '35%' }} />
                                </div>
                              </div>
                            ) : null}
                          </>
                        )}
                      </div>

                      {currentLesson.content.keyPoints?.length ? (
                        <div className={v.keyPointsPanel}>
                          <h3 className={v.blockHeadingClass}>Key Points</h3>
                          <ul className='space-y-2'>
                            {currentLesson.content.keyPoints.map((point) => (
                              <li key={point} className='flex items-start gap-2 text-sm text-gray-700'>
                                <CheckCircle2 className={`h-4 w-4 mt-0.5 flex-shrink-0 ${v.keyPointsCheck}`} />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {currentLesson.content.transcript ? (
                        <div className={v.transcriptPanel}>
                          <h3 className={v.blockHeadingClass}>Transcript</h3>
                          <p className='text-sm text-gray-700 leading-relaxed'>{currentLesson.content.transcript}</p>
                        </div>
                      ) : null}

                      {v.lessonNavigation === 'inline-only' ? (
                        <button
                          type='button'
                          onClick={() => persistLessonComplete(currentLesson.id)}
                          disabled={completedModuleLessons.includes(currentLesson.id)}
                          className={markCompleteBtnClasses}
                        >
                          {completedModuleLessons.includes(currentLesson.id) ? (
                            <>
                              <CheckCircle2 className='h-5 w-5' />
                              Lesson Completed
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className='h-5 w-5' />
                              Mark as Complete
                            </>
                          )}
                        </button>
                      ) : null}
                    </div>
                  )}

                  {currentLesson.type === 'reading' && (
                    <div className='space-y-6'>
                      {v.sidebarStyle === 'tiered' ? (
                        <div className='flex items-center justify-between mb-6'>
                          <div>
                            <div className='flex items-center gap-2 mb-2'>
                              <BookOpen className={`h-5 w-5 ${v.lessonTypeIconClass}`} />
                              <span className='text-sm font-semibold text-gray-600 uppercase tracking-wide'>Reading</span>
                            </div>
                            <h2 className='text-2xl font-bold text-gray-900'>{currentLesson.title}</h2>
                          </div>
                          <div className='flex items-center gap-2'>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${v.pointsPill}`}>{currentLesson.points} points</span>
                            <button type='button' className='p-2 hover:bg-gray-100 rounded-lg transition'>
                              <Download className='h-5 w-5 text-gray-400' />
                            </button>
                          </div>
                        </div>
                      ) : null}

                      {currentLesson.content.article ? (
                        v.readingArticleWrap ? (
                          <div className='prose max-w-none'>
                            <div className={v.readingArticleWrap}>
                              <div
                                className='text-gray-700 leading-relaxed'
                                dangerouslySetInnerHTML={{
                                  __html: currentLesson.content.article
                                    .replace(/\n/g, '<br />')
                                    .replace(/#{3}/g, '<h3>')
                                    .replace(/##/g, '<h2>')
                                    .replace(/#/g, '<h1>'),
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className='prose prose-lg max-w-none'>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: currentLesson.content.article
                                  .replace(/\n/g, '<br />')
                                  .replace(/#{3}/g, '<h3>')
                                  .replace(/##/g, '<h2>')
                                  .replace(/#/g, '<h1>'),
                              }}
                            />
                          </div>
                        )
                      ) : null}

                      {currentLesson.content.keyTakeaways?.length ? (
                        <div className={v.readingTakeawaysPanel}>
                          <h3 className={v.blockHeadingClass}>Key Takeaways</h3>
                          <ul className='space-y-2'>
                            {currentLesson.content.keyTakeaways.map((takeaway) => (
                              <li key={takeaway} className='flex items-start gap-2 text-sm text-gray-700'>
                                <Lightbulb className={`h-4 w-4 mt-0.5 flex-shrink-0 ${v.readingTakeawaysIcon}`} />
                                <span>{takeaway}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {v.lessonNavigation === 'inline-only' ? (
                        <button
                          type='button'
                          onClick={() => persistLessonComplete(currentLesson.id)}
                          disabled={completedModuleLessons.includes(currentLesson.id)}
                          className={markCompleteBtnClasses}
                        >
                          {completedModuleLessons.includes(currentLesson.id) ? (
                            <>
                              <CheckCircle2 className='h-5 w-5' />
                              Lesson Completed
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className='h-5 w-5' />
                              Mark as Complete
                            </>
                          )}
                        </button>
                      ) : null}
                    </div>
                  )}

                  {currentLesson.type === 'interactive' && (
                    <div className='space-y-6'>
                      {v.sidebarStyle === 'tiered' ? (
                        <div className='flex items-center justify-between mb-6'>
                          <div>
                            <div className='flex items-center gap-2 mb-2'>
                              <Zap className={`h-5 w-5 ${v.lessonTypeIconClass}`} />
                              <span className='text-sm font-semibold text-gray-600 uppercase tracking-wide'>Interactive Tool</span>
                            </div>
                            <h2 className='text-2xl font-bold text-gray-900'>{currentLesson.title}</h2>
                            {currentLesson.content.description ? <p className='mt-2 text-gray-600'>{currentLesson.content.description}</p> : null}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${v.pointsPill}`}>{currentLesson.points} points</span>
                        </div>
                      ) : null}

                      <div className={`${v.interactiveStepsPanel}`}>
                        <h3 className={v.blockHeadingClass}>{currentLesson.content.description ?? 'Interactive Practice'}</h3>
                        <ol className='space-y-2'>
                          {(currentLesson.content.steps ?? []).map((step, idx) => (
                            <li key={step} className='flex items-start gap-2 text-sm text-gray-700'>
                              <span
                                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${v.interactiveStepNumber}`}
                              >
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {v.lessonNavigation === 'inline-only' ? (
                        <button
                          type='button'
                          onClick={() => persistLessonComplete(currentLesson.id)}
                          disabled={completedModuleLessons.includes(currentLesson.id)}
                          className={markCompleteBtnClasses}
                        >
                          {completedModuleLessons.includes(currentLesson.id) ? (
                            <>
                              <CheckCircle2 className='h-5 w-5' />
                              Lesson Completed
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className='h-5 w-5' />
                              Mark as Complete
                            </>
                          )}
                        </button>
                      ) : null}
                    </div>
                  )}

                  {currentLesson.type === 'template' && (
                    <div className='space-y-6'>
                      {v.sidebarStyle === 'tiered' ? (
                        <div className='flex items-center justify-between mb-6'>
                          <div>
                            <div className='flex items-center gap-2 mb-2'>
                              <FileText className={`h-5 w-5 ${v.lessonTypeIconClass}`} />
                              <span className='text-sm font-semibold text-gray-600 uppercase tracking-wide'>Template</span>
                            </div>
                            <h2 className='text-2xl font-bold text-gray-900'>{currentLesson.title}</h2>
                            {currentLesson.content.description ? <p className='mt-2 text-gray-600'>{currentLesson.content.description}</p> : null}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${v.pointsPill}`}>{currentLesson.points} points</span>
                        </div>
                      ) : null}

                      {v.sidebarStyle === 'tiered' ? (
                        <>
                          <div className={v.templateSectionsCard}>
                            <h3 className='text-sm font-semibold text-gray-900 mb-4'>Template Sections</h3>
                            <div className='space-y-3'>
                              {(currentLesson.content.sections ?? []).map((section, idx) => (
                                <div key={section} className='flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200'>
                                  <div
                                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${v.templateSectionNumber}`}
                                  >
                                    {idx + 1}
                                  </div>
                                  <span className='text-sm text-gray-700'>{section}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                            {['Elementary Template', 'Middle School Template', 'High School Template'].map((label, gIdx) => (
                              <button
                                key={label}
                                type='button'
                                className={`${v.templateDownloadCard} flex flex-col items-center gap-2`}
                              >
                                <Download className={`h-6 w-6 ${v.templateDownloadIcon}`} />
                                <span className='text-sm font-semibold text-gray-900'>{label}</span>
                                <span className='text-xs text-gray-600'>{['Grades K-5', 'Grades 6-8', 'Grades 9-12'][gIdx]}</span>
                              </button>
                            ))}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className='bg-green-50 rounded-xl p-6 border border-green-200'>
                            <h3 className='text-lg font-semibold text-gray-900 mb-3'>{currentLesson.content.description ?? 'Template Resource'}</h3>
                            <p className='text-sm text-gray-700 mb-4'>This template includes the following sections:</p>
                            <ul className='space-y-2'>
                              {(currentLesson.content.sections ?? []).map((section) => (
                                <li key={section} className='flex items-center gap-2 text-sm text-gray-700'>
                                  <CheckCircle2 className='h-4 w-4 text-green-600 flex-shrink-0' />
                                  <span>{section}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className='bg-white rounded-xl p-6 border-2 border-gray-200'>
                            <h3 className='text-lg font-semibold text-gray-900 mb-4'>Template Preview</h3>
                            <div className='space-y-4'>
                              {(currentLesson.content.sections ?? []).map((section) => (
                                <div key={section} className='border-2 border-dashed border-gray-300 rounded-lg p-4'>
                                  <h4 className='text-sm font-semibold text-gray-900 mb-2'>{section}</h4>
                                  <p className='text-xs text-gray-500 italic'>Your content will appear here...</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          <button
                            type='button'
                            className='w-full px-6 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2'
                          >
                            <Download className='h-5 w-5' />
                            Download Template
                          </button>
                        </>
                      )}

                      {v.lessonNavigation === 'inline-only' ? (
                        <button
                          type='button'
                          onClick={() => persistLessonComplete(currentLesson.id)}
                          disabled={completedModuleLessons.includes(currentLesson.id)}
                          className={markCompleteBtnClasses}
                        >
                          {completedModuleLessons.includes(currentLesson.id) ? (
                            <>
                              <CheckCircle2 className='h-5 w-5' />
                              Lesson Completed
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className='h-5 w-5' />
                              Mark as Complete
                            </>
                          )}
                        </button>
                      ) : null}
                    </div>
                  )}

                  {v.lessonNavigation === 'footer-with-advance' ? (
                    <div className='mt-8 flex items-center justify-between pt-6 border-t border-gray-200'>
                      <button
                        type='button'
                        onClick={() => setCurrentModuleLesson(Math.max(0, currentModuleLesson - 1))}
                        disabled={currentModuleLesson === 0}
                        className='flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition'
                      >
                        <ArrowLeft className='h-4 w-4' />
                        Previous
                      </button>
                      <button
                        type='button'
                        onClick={onFooterAdvanceComplete}
                        className={`flex items-center gap-2 px-6 py-3 text-white text-sm font-semibold rounded-full transition ${v.footerCompleteButton}`}
                      >
                        {completedModuleLessons.includes(currentLesson.id) ? (
                          <>
                            <CheckCircle2 className='h-4 w-4' />
                            Marked Complete
                          </>
                        ) : currentModuleLesson === lessons.length - 1 ? (
                          <>
                            <Trophy className='h-4 w-4' />
                            Complete Module
                          </>
                        ) : (
                          <>
                            Complete & Next
                            <ArrowRight className='h-4 w-4' />
                          </>
                        )}
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className='text-sm text-gray-600'>No lesson content configured for this module yet.</div>
              )}
            </div>

            {lessons.length > 0 && completedModuleLessons.length === lessons.length ? (
              <div className={`mt-6 rounded-2xl p-8 text-center ${v.completionPanel}`}>
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${v.completionIconBg}`}>
                  <Trophy className='h-8 w-8 text-white' />
                </div>
                <h3 className='text-2xl font-bold text-gray-900 mb-2'>Module Complete!</h3>
                <p className='text-gray-700 mb-6'>You completed all lessons in this module.</p>
                <button
                  type='button'
                  onClick={() => navigate(buildLearningHubSectionPath('ai-growth-recommendations', content.parentPathSlug))}
                  className={`rounded-full px-6 py-3 text-sm font-semibold text-white ${v.completionCta}`}
                >
                  Continue to Learning Path
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    )
  }

  if (content.pathLayout === 'student-engagement' && content.studentEngagementExtras) {
    return (
      <AIGrowthStudentEngagementPathView
        item={item}
        content={content}
        navigate={navigate}
        unlockedModules={unlockedModules}
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        completedModules={completedModules}
        completedCount={completedCount}
        availableModulesCount={availableModules.length}
        progress={progress}
        markComplete={markComplete}
        levelFilter={engagementLevelFilter}
        setLevelFilter={setEngagementLevelFilter}
      />
    )
  }

  const t = content.pathTheme ?? resolveAIGrowthPathTheme(content.themeId)
  const impactOverviewBadge =
    content.impactLevel === 'High'
      ? t.pathOverviewImpactBadgeHigh
      : content.impactLevel === 'Medium'
        ? t.pathOverviewImpactBadgeMedium
        : t.pathOverviewImpactBadgeLow

  return (
    <div className='space-y-6'>
      <div className={`bg-gradient-to-r ${t.headerGradient} rounded-3xl p-8 text-white shadow-xl`}>
        <div className='flex items-start justify-between mb-6'>
          <div className='flex-1'>
            <div className='flex items-center gap-3 mb-4'>
              <button
                type='button'
                onClick={() => navigate('/learning-hub')}
                className='p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition shrink-0'
              >
                <ArrowLeft className='h-5 w-5' />
              </button>
              <div className='min-w-0'>
                <div className='flex flex-wrap items-center gap-2 mb-2'>
                  <span className='px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wide'>{content.heroSubtitle}</span>
                  <span className='text-white/80'>•</span>
                  <span className='text-white/80 text-sm flex items-center gap-1'>
                    <Clock className='h-3 w-3' />
                    {content.estimatedTime} estimated
                  </span>
                </div>
                <h1 className='text-3xl font-bold'>{item.title}</h1>
                <p className={`mt-2 ${t.heroDescriptionClass}`}>{content.heroDescription}</p>
              </div>
            </div>
            <div className='flex flex-wrap items-center gap-4 text-sm'>
              <div className='flex items-center gap-2'>
                <Target className='w-4 h-4 shrink-0' />
                <span>{content.impactLevel} Impact</span>
              </div>
              <div className='flex items-center gap-2'>
                <Trophy className='w-4 h-4 shrink-0' />
                <span>
                  {completedCount} of {availableModules.length} modules completed
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <TrendingUp className='w-4 h-4 shrink-0' />
                <span>{Math.round(progress)}% Complete</span>
              </div>
            </div>
            <div className='mt-4 h-2 bg-white/20 rounded-full overflow-hidden'>
              <div className='h-full bg-white rounded-full transition-all duration-300' style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className={`bg-gradient-to-br ${t.tipPanelBg} rounded-2xl border-2 ${t.tipPanelBorder} p-6 shadow-sm`}>
        <div className='flex items-start gap-4'>
          <div className={`flex-shrink-0 w-12 h-12 rounded-xl text-white flex items-center justify-center ${t.sparklesIconBg}`}>
            <Sparkles className='h-6 w-6' />
          </div>
          <div className='flex-1 min-w-0'>
            <div className='flex flex-wrap items-center gap-2 mb-2'>
              <h3 className='text-lg font-semibold text-gray-900'>AI-Powered Learning Guidance</h3>
              <span className={t.guidancePersonalizedBadge}>Personalized</span>
            </div>
            <p className='text-sm font-medium text-gray-900 mb-2'>{content.aiGuidance.recommendation}</p>
            <p className='text-sm text-gray-700 mb-4'>{content.aiGuidance.reason}</p>
            <div className={`bg-white rounded-lg p-4 border mb-4 ${t.guidanceTipBoxBorder}`}>
              <p className='text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2'>Personalized Tip</p>
              <p className='text-sm text-gray-700'>{content.aiGuidance.personalizedTip}</p>
            </div>
            <div>
              <p className='text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2'>Your Next Steps</p>
              <ul className='space-y-1'>
                {content.aiGuidance.nextSteps.map((step) => (
                  <li key={step} className='flex items-start gap-2 text-sm text-gray-700'>
                    <ArrowRight className={`h-4 w-4 mt-0.5 flex-shrink-0 ${t.nextStepIconClass}`} />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 space-y-6'>
          <div className='bg-white rounded-2xl border border-gray-200 p-6 shadow-sm'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-bold text-gray-900'>Expected Impact on Your Teaching</h2>
              <TrendingUp className={`h-5 w-5 shrink-0 ${t.skillImpactHeaderIcon}`} />
            </div>
            <div className='space-y-4'>
              {content.skillImpacts.map((impact) => (
                <div key={impact.skillId} className='space-y-2'>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='font-medium text-gray-700'>{resolveSkillLabel(impact.skillId)}</span>
                    <span className={`font-semibold ${t.skillImprovementClass}`}>+{impact.improvement}%</span>
                  </div>
                  <div className='relative h-3 bg-gray-200 rounded-full overflow-hidden'>
                    <div className='absolute left-0 top-0 h-full bg-gray-400 rounded-full' style={{ width: `${impact.before}%` }} />
                    <div
                      className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${t.skillBarAfter}`}
                      style={{ width: `${impact.after}%` }}
                    />
                  </div>
                  <p className='text-xs text-gray-500'>{impact.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className='bg-white rounded-2xl border border-gray-200 p-6 shadow-sm'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-xl font-bold text-gray-900'>Learning Modules</h2>
              <Filter className='h-5 w-5 text-gray-400 shrink-0' />
            </div>
            <div className='space-y-4'>
              {unlockedModules.map((module, idx) => {
                const isExpanded = activeModule === module.id
                const isCompleted = completedModules.includes(module.id)
                const points = module.content.reduce((sum, entry) => sum + (entry.points ?? 0), 0) + module.assessment.points
                return (
                  <div
                    key={module.id}
                    className={`border-2 rounded-xl transition ${
                      module.locked
                        ? 'border-gray-200 bg-gray-50 opacity-60'
                        : isExpanded
                          ? `${t.moduleExpandedBorder} ${t.moduleExpandedBg}`
                          : `border-gray-200 bg-white ${t.moduleCollapsedHoverBorder}`
                    }`}
                  >
                    <button
                      type='button'
                      onClick={() => !module.locked && setActiveModule(isExpanded ? null : module.id)}
                      disabled={module.locked}
                      className='w-full p-5 text-left'
                    >
                      <div className='flex items-start justify-between gap-4'>
                        <div className='flex items-start gap-4 flex-1 min-w-0'>
                          <div
                            className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                              module.locked ? 'bg-gray-200 text-gray-400' : `${t.moduleNumberBadge}`
                            }`}
                          >
                            {module.locked ? <Lock className='h-5 w-5' /> : isCompleted ? <CheckCircle2 className='h-5 w-5' /> : <span className='font-bold'>{idx + 1}</span>}
                          </div>
                          <div className='flex-1 min-w-0'>
                            <div className='flex flex-wrap items-center gap-2 mb-2'>
                              <h3 className='text-lg font-semibold text-gray-900'>{module.title}</h3>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${levelPill(module.level)}`}>{module.level}</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${impactPill(module.impact)}`}>{module.impact} Impact</span>
                            </div>
                            <p className='text-sm text-gray-600 mb-3'>{module.description}</p>
                            <div className='flex flex-wrap items-center gap-4 text-xs text-gray-500'>
                              <span className='flex items-center gap-1'>
                                <Clock className='h-3 w-3' />
                                {module.duration}
                              </span>
                              <span className='flex items-center gap-1'>
                                <Star className='h-3 w-3' />
                                {points} points
                              </span>
                            </div>
                          </div>
                        </div>
                        {!module.locked ? (
                          <ArrowRight className={`h-5 w-5 text-gray-400 transition-transform shrink-0 ${isExpanded ? 'rotate-90' : ''}`} />
                        ) : null}
                      </div>
                    </button>

                    {module.locked ? (
                      <div className='px-5 pb-5 border-t border-gray-200 pt-5'>
                        <button
                          type='button'
                          disabled
                          className='w-full px-4 py-2 rounded-lg bg-gray-200 text-gray-500 text-sm font-semibold cursor-not-allowed flex items-center justify-center gap-2'
                        >
                          <Lock className='h-4 w-4' />
                          {idx === 3 ? 'Locked - Complete first 3 modules to unlock' : 'Locked - Complete previous module to unlock'}
                        </button>
                      </div>
                    ) : null}

                    {isExpanded && !module.locked ? (
                      <div className={`px-5 pb-5 border-t pt-5 space-y-6 ${t.moduleExpandedInnerBorder}`}>
                        <div>
                          <h4 className='text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2'>
                            <Target className={`h-4 w-4 ${t.sectionHeadingIconClass}`} />
                            Learning Outcomes
                          </h4>
                          <ul className='space-y-2'>
                            {module.learningOutcomes.map((outcome) => (
                              <li key={outcome} className='flex items-start gap-2 text-sm text-gray-700'>
                                <CheckCircle2 className={`h-4 w-4 mt-0.5 flex-shrink-0 ${t.sectionHeadingIconClass}`} />
                                <span>{outcome}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className='text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2'>
                            <BookOpen className={`h-4 w-4 ${t.sectionHeadingIconClass}`} />
                            Module Content
                          </h4>
                          <div className='space-y-2'>
                            {module.content.map((row) => (
                              <div key={row.title} className='flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200'>
                                <div className='flex items-center gap-3 min-w-0'>
                                  {row.type === 'video' && <Video className={`h-4 w-4 shrink-0 ${t.moduleContentRowIconClass}`} />}
                                  {row.type === 'reading' && <FileText className={`h-4 w-4 shrink-0 ${t.moduleContentRowIconClass}`} />}
                                  {row.type === 'interactive' && <Zap className={`h-4 w-4 shrink-0 ${t.moduleContentRowIconClass}`} />}
                                  {row.type === 'template' && <FileText className={`h-4 w-4 shrink-0 ${t.moduleContentRowIconClass}`} />}
                                  {row.type === 'project' && <Rocket className={`h-4 w-4 shrink-0 ${t.moduleContentRowIconClass}`} />}
                                  <span className='text-sm text-gray-700 truncate'>{row.title}</span>
                                  {row.duration ? <span className='text-xs text-gray-500 shrink-0'>({row.duration})</span> : null}
                                </div>
                                {row.points ? <span className={`text-xs font-semibold shrink-0 ${t.moduleContentPointsClass}`}>{row.points} pts</span> : null}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className={t.assessmentPanel}>
                          <h4 className='text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2'>
                            <Award className={`h-4 w-4 ${t.assessmentIconClass}`} />
                            Assessment
                          </h4>
                          <p className='text-sm text-gray-700 mb-1'>{module.assessment.type}</p>
                          <p className='text-sm text-gray-600'>{module.assessment.description}</p>
                          <p className={`text-xs font-semibold mt-2 ${t.assessmentPointsClass}`}>{module.assessment.points} points</p>
                        </div>

                        <div className='bg-blue-50 rounded-lg p-4 border border-blue-200'>
                          <h4 className='text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2'>
                            <Lightbulb className='h-4 w-4 text-blue-600' />
                            Real-World Application
                          </h4>
                          <p className='text-sm text-gray-700'>{module.realWorldApplication}</p>
                        </div>

                        <div className='flex flex-wrap items-center gap-3 pt-4 border-t border-gray-200'>
                          {isCompleted ? (
                            <button
                              type='button'
                              onClick={() => navigate(buildLearningHubSectionPath('ai-growth-recommendations', module.slug))}
                              className={`px-4 py-2 rounded-lg text-white text-sm font-semibold transition flex items-center gap-2 ${t.button}`}
                            >
                              <Eye className='h-4 w-4' />
                              Review Module
                            </button>
                          ) : (
                            <>
                              <button
                                type='button'
                                onClick={() => navigate(buildLearningHubSectionPath('ai-growth-recommendations', module.slug))}
                                className={`px-4 py-2 rounded-lg text-white text-sm font-semibold transition flex items-center gap-2 ${t.button}`}
                              >
                                <Play className='h-4 w-4' />
                                Start Module
                              </button>
                              <button
                                type='button'
                                onClick={() => markComplete(module.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${t.markCompleteOutlineButton}`}
                              >
                                <CheckCircle2 className='h-4 w-4' />
                                Mark Complete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className='space-y-6'>
          <div className='bg-white rounded-2xl border border-gray-200 p-6 shadow-sm'>
            <h3 className='text-sm font-semibold uppercase tracking-wide text-gray-600 mb-4'>Your Progress</h3>
            <div className='space-y-4'>
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-sm text-gray-600'>Modules Completed</span>
                  <span className='text-lg font-bold text-gray-900'>
                    {completedCount}/{availableModules.length}
                  </span>
                </div>
                <div className='h-2 bg-gray-200 rounded-full overflow-hidden'>
                  <div className={`h-full ${t.pathSidebarProgressBar} rounded-full transition-all duration-300`} style={{ width: `${progress}%` }} />
                </div>
              </div>
              <div className='pt-4 border-t border-gray-200'>
                <p className='text-xs text-gray-500 mb-2'>Skills You&apos;ll Master</p>
                <div className='flex flex-wrap gap-2'>
                  {content.modules
                    .slice(0, 3)
                    .flatMap((m) => m.skillIds)
                    .slice(0, 6)
                    .map((skillId, idx) => (
                      <span key={`${skillId}-${idx}`} className={t.pathSkillChip}>
                        {resolveSkillLabel(skillId)}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div className={`bg-gradient-to-br ${t.accentBg} rounded-2xl border ${t.accentBorder} p-6`}>
            <h3 className='text-sm font-semibold uppercase tracking-wide text-gray-600 mb-4'>Path Overview</h3>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>Total Modules</span>
                <span className='text-sm font-semibold text-gray-900'>{content.modules.length}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>Estimated Time</span>
                <span className='text-sm font-semibold text-gray-900'>{content.estimatedTime}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>Impact Level</span>
                <span className={impactOverviewBadge}>{content.impactLevel}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIGrowthRecommendationRenderer
