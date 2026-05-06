import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Layers,
  Lightbulb,
  X,
} from 'lucide-react'
import type {
  LearningHubSectionItem,
  SpecialistDeepDiveContentBlock,
  SpecialistDeepDiveModule,
} from '../../../features/learningHub/types'
import { youtubeWatchUrlToEmbedUrl } from '../../../features/learningHub/contentModel'
import { resolveSpecialistDeepDiveRenderProfile } from '../../../features/learningHub/specialistDeepDiveTrackShell'
import { useLearningHubContentScrollToTop } from '../../../features/learningHub/useLearningHubScrollToTop'

const theme = {
  headerGradient: 'from-indigo-600 via-blue-600 to-cyan-600',
  primaryButton: 'bg-indigo-600 hover:bg-indigo-500',
  primaryBorder: 'border-indigo-200',
  primaryText: 'text-indigo-700',
  accentBorder: 'border-indigo-200',
  accentIconBg: 'bg-indigo-100',
  accentIconText: 'text-indigo-600',
} as const

function computeStepIndex(
  modules: SpecialistDeepDiveModule[],
  mi: number,
  li: number,
  bi: number
): number {
  let idx = 0
  for (let i = 0; i < mi; i++) {
    for (const l of modules[i]!.lessons) {
      idx += l.contentBlocks.length
    }
  }
  for (let j = 0; j < li; j++) {
    idx += modules[mi]!.lessons[j]!.contentBlocks.length
  }
  idx += bi
  return idx
}

function totalContentSteps(modules: SpecialistDeepDiveModule[]): number {
  let n = 0
  for (const m of modules) {
    for (const l of m.lessons) {
      n += l.contentBlocks.length
    }
  }
  return n
}

interface SpecialistDeepDiveTrackRendererProps {
  item: LearningHubSectionItem
}

export function SpecialistDeepDiveTrackRenderer({ item }: SpecialistDeepDiveTrackRendererProps) {
  const navigate = useNavigate()
  const content = item.specialistDeepDiveContent
  if (!content || content.type !== 'track') {
    return null
  }

  resolveSpecialistDeepDiveRenderProfile(content.renderProfile)

  const modules = content.modules
  if (!modules.length) {
    return null
  }

  const [mi, setMi] = useState(0)
  const [li, setLi] = useState(0)
  const [bi, setBi] = useState(0)
  const [showComplete, setShowComplete] = useState(false)
  const contentTopRef = useRef<HTMLDivElement | null>(null)

  const currentModule = modules[mi]
  const currentLesson = currentModule?.lessons[li]
  const currentBlock = currentLesson?.contentBlocks[bi]
  const contentScreenKey = showComplete
    ? 'complete'
    : `${currentModule?.id ?? mi}:${currentLesson?.id ?? li}:${bi}`
  useLearningHubContentScrollToTop(contentTopRef, contentScreenKey)

  const totalSteps = useMemo(() => totalContentSteps(modules), [modules])
  const stepIndex = useMemo(
    () => computeStepIndex(modules, mi, li, bi),
    [modules, mi, li, bi]
  )
  const progressPct = totalSteps > 0 ? Math.min(100, ((stepIndex + 1) / totalSteps) * 100) : 0
  const isLastStep =
    mi === modules.length - 1 &&
    li === modules[mi]!.lessons.length - 1 &&
    bi === modules[mi]!.lessons[li]!.contentBlocks.length - 1

  const handleNext = () => {
    if (!currentModule || !currentLesson) return
    if (bi < currentLesson.contentBlocks.length - 1) {
      setBi(bi + 1)
      return
    }
    if (li < currentModule.lessons.length - 1) {
      setLi(li + 1)
      setBi(0)
      return
    }
    if (mi < modules.length - 1) {
      setMi(mi + 1)
      setLi(0)
      setBi(0)
      return
    }
    setShowComplete(true)
  }

  const handlePrev = () => {
    if (!currentModule || !currentLesson) return
    if (bi > 0) {
      setBi(bi - 1)
      return
    }
    if (li > 0) {
      setLi(li - 1)
      setBi(currentModule.lessons[li - 1]!.contentBlocks.length - 1)
      return
    }
    if (mi > 0) {
      const pm = modules[mi - 1]!
      setMi(mi - 1)
      setLi(pm.lessons.length - 1)
      setBi(pm.lessons[pm.lessons.length - 1]!.contentBlocks.length - 1)
    }
  }

  const gradientClass = content.headerGradientClass ?? theme.headerGradient

  const renderBlock = (block: SpecialistDeepDiveContentBlock) => {
    switch (block.type) {
      case 'video': {
        const embed = youtubeWatchUrlToEmbedUrl(block.media.url)
        return (
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900">
              {block.media.title ?? 'Video'}
            </h3>
            {block.media.duration && (
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {block.media.duration}
              </p>
            )}
            {embed ? (
              <div className="aspect-video w-full overflow-hidden rounded-xl border border-gray-200 bg-black shadow-sm">
                <iframe
                  title={block.media.title ?? 'Video'}
                  src={embed}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <p className="text-sm text-gray-600">This video URL could not be embedded.</p>
            )}
          </div>
        )
      }
      case 'text':
        return (
          <div className="prose max-w-none">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{block.heading}</h3>
            {block.paragraphs.map((para) => (
              <p key={para.slice(0, 48)} className="text-gray-700 leading-relaxed mb-4 last:mb-0">
                {para}
              </p>
            ))}
          </div>
        )
      case 'interactive':
        return (
          <div
            className={`rounded-2xl border-2 ${theme.accentBorder} bg-gradient-to-br from-indigo-50 to-blue-50 p-6`}
          >
            <div className="flex items-start gap-3 mb-4">
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full ${theme.accentIconBg} flex items-center justify-center`}
              >
                <Lightbulb className={`w-5 h-5 ${theme.accentIconText}`} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{block.title}</h3>
                <p className="text-gray-700 mb-4">{block.prompt}</p>
                <div className={`bg-white rounded-lg p-4 border ${theme.primaryBorder}`}>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Tips</p>
                  <ul className="space-y-1">
                    {block.tips.map((tip) => (
                      <li key={tip} className="text-sm text-gray-600 flex items-start gap-2">
                        <ChevronRight className={`w-4 h-4 ${theme.accentIconText} mt-0.5 flex-shrink-0`} />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )
      case 'caseStudy':
        return (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{block.title}</h3>
            <p className="text-gray-700 mb-4 leading-relaxed">{block.scenario}</p>
            {block.discussionQuestions && block.discussionQuestions.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-amber-900 mb-2">Discussion</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  {block.discussionQuestions.map((q) => (
                    <li key={q} className="flex gap-2">
                      <span className="text-amber-600">•</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )
      case 'template':
        return (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-gray-900">{block.title}</h3>
            </div>
            {block.sections && block.sections.length > 0 && (
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                {block.sections.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            )}
          </div>
        )
      default:
        return null
    }
  }

  if (showComplete) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-indigo-200 bg-white p-8 text-center shadow-sm">
          <Award className="mx-auto mb-4 h-16 w-16 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            {content.certification?.title ?? 'Track complete'}
          </h2>
          <p className="mt-2 text-gray-600">
            {content.certification?.body ??
              'You have completed all modules in this specialist deep-dive track.'}
          </p>
          <button
            type="button"
            onClick={() => navigate('/learning-hub')}
            className={`mt-6 rounded-full px-8 py-3 text-sm font-semibold text-white ${theme.primaryButton}`}
          >
            Back to Learning Hub
          </button>
        </div>
      </div>
    )
  }

  if (!currentModule || !currentLesson || !currentBlock) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className={`bg-gradient-to-r ${gradientClass} rounded-3xl p-8 text-white shadow-xl`}>
        <div className="mb-6 flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                {content.heroSubtitle}
              </span>
              <span className="text-white/80">•</span>
              <span className="text-sm text-white/80">{item.duration ?? ''}</span>
            </div>
            <h1 className="mb-3 text-3xl font-bold">{item.title}</h1>
            <p className="text-lg text-white/90">{content.heroDescription}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/90">
              <span className="flex items-center gap-1">
                <Layers className="h-4 w-4" />
                Module {mi + 1} of {modules.length}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {currentLesson.title}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {Math.round(progressPct)}% through content
              </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/learning-hub')}
            className="rounded-lg p-2 text-white/80 transition hover:bg-white/20 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="sticky top-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-600">
              Track modules
            </h3>
            <div className="space-y-3">
              {modules.map((mod, mIdx) => (
                <div key={mod.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setMi(mIdx)
                      setLi(0)
                      setBi(0)
                    }}
                    className={`w-full rounded-lg border-2 p-2 text-left text-sm font-semibold transition ${
                      mIdx === mi
                        ? 'border-indigo-300 bg-indigo-50 text-indigo-900'
                        : 'border-transparent text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    {mod.title}
                  </button>
                  {mIdx === mi && (
                    <div className="mt-1 space-y-1 border-l-2 border-indigo-100 pl-3">
                      {mod.lessons.map((lesson, lIdx) => (
                        <button
                          key={lesson.id}
                          type="button"
                          onClick={() => {
                            setMi(mIdx)
                            setLi(lIdx)
                            setBi(0)
                          }}
                          className={`block w-full rounded-md px-2 py-1.5 text-left text-xs transition ${
                            lIdx === li
                              ? 'bg-indigo-100 font-medium text-indigo-900'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {lesson.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {content.outcomes && content.outcomes.length > 0 && (
              <div className="mt-6 border-t border-gray-100 pt-4">
                <p className="mb-2 text-xs font-semibold uppercase text-gray-500">Outcomes</p>
                <ul className="space-y-1 text-xs text-gray-600">
                  {content.outcomes.slice(0, 4).map((o) => (
                    <li key={o} className="flex gap-1">
                      <CheckCircle2 className="mt-0.5 h-3 w-3 flex-shrink-0 text-green-600" />
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3">
          <div ref={contentTopRef} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 border-b border-gray-200 pb-6">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
                Step {stepIndex + 1} of {totalSteps}
              </p>
              <p className="text-sm text-gray-500">
                {currentModule.title} · {currentLesson.duration}
              </p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">{currentLesson.title}</h2>
            </div>

            <div className="mb-8 space-y-8">{renderBlock(currentBlock)}</div>

            <div className="flex items-center justify-between border-t border-gray-200 pt-6">
              <button
                type="button"
                onClick={handlePrev}
                disabled={mi === 0 && li === 0 && bi === 0}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Block {bi + 1} of {currentLesson.contentBlocks.length}
              </span>
              <button
                type="button"
                onClick={handleNext}
                className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition ${theme.primaryButton}`}
              >
                {isLastStep ? 'Finish track' : 'Next'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {content.assessment && (
            <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-6">
              <p className="text-sm font-semibold text-indigo-900">
                {content.assessment.title ?? 'Track assessment'}
              </p>
              <p className="mt-1 text-sm text-gray-700">{content.assessment.description}</p>
              {content.assessment.points != null && (
                <p className="mt-2 text-xs text-indigo-700">Portfolio points: {content.assessment.points}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
