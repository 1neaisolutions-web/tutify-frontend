import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Play,
  Award,
  Users,
  Sparkles,
  Target,
  FileText,
  GraduationCap,
  CheckCircle2,
  Zap,
  Brain,
  Loader2,
  Lock,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react'
import { buildLearningHubSectionPath, learningHubData } from '../../features/learningHub'
import { ProfileCompletionGate } from '../../features/learningHub/ProfileCompletionGate'
import { useLearningHubRouteScrollToTop } from '../../features/learningHub/useLearningHubScrollToTop'
import { usePersonalizationStatus } from '../../hooks/usePersonalizationStatus'
import { useActivityTracker } from '../../hooks/useActivityTracker'
import { useLearningHubHomeData } from '../../hooks/useLearningHubHomeData'
import { useHubBootstrapOrchestration } from '../../hooks/useHubBootstrapOrchestration'
import { usePersonalizationPoller } from '../../hooks/usePersonalizationPoller'
import {
  retryLearningHubBootstrap,
  selectHubBootstrap,
  selectHubBootstrapRetryStatus,
  selectShowBootstrapBanner,
  selectHasReadyInventory,
  fetchLearningHubSlate,
  clearHubSyncStatus,
} from '../../redux/features/personalization/personalizationSlice'

// Feature flag — read once from env so component logic never depends on async hooks for this gate
const PERSONALIZATION_ENABLED = import.meta.env.VITE_PERSONALIZATION_ENABLED === 'true'
const SECTION_TARGETS = {
  // Minimum viable entry targets: show at least one unlocked and one locked-preview item
  // as soon as backend inventory is usable. Remaining inventory will continue preparing
  // in the background after the hub opens.
  micro_courses: { visible: 1, locked: 1 },
  growth_recommendations: { visible: 1, locked: 1 },
  tutorials: { visible: 1, locked: 1 },
  research_insights: { visible: 1, locked: 1 },
  specialist_tracks: { visible: 1, locked: 1 },
} as const

const SECTION_DISPLAY_LIMITS = {
  micro_courses:          { visible: 5, locked: 5 },
  growth_recommendations: { visible: 3, locked: 3 },
  tutorials:              { visible: 3, locked: 3 },
  research_insights:      { visible: 5, locked: 5 },
  specialist_tracks:      { visible: 3, locked: 3 },
} as const

type HubContinueItem = {
  contentId?: string
  contentType?: string
  route?: string
  title?: string
  subtitle?: string
  progressPercent?: number
}

const microCourses = learningHubData
  .filter((item) => item.section === 'personalized-micro-courses')
  .map((item) => ({
    title: item.title,
    duration: item.duration ?? '',
    category: item.subtitle ?? '',
    progress:
      item.slug === 'formative-assessment-strategies'
        ? 100
        : item.slug === 'differentiation-made-simple'
          ? 45
          : 0,
    difficulty: item.difficulty ?? '',
    slug: item.slug,
    route: buildLearningHubSectionPath('personalized-micro-courses', item.slug),
    contentId: undefined as string | undefined,
    contentType: 'micro_course' as const,
  }))

const tutorials = learningHubData
  .filter((item) => item.section === 'ai-guided-tutorials-demonstrations')
  .map((item) => ({
    title: item.title,
    type: item.subtitle ?? '',
    duration: item.duration ?? '',
    completed: false,
    slug: item.slug,
  }))

const researchInsights = learningHubData
  .filter((item) => item.section === 'research-insights-library')
  .map((item) => ({
  title: item.title,
  summary: item.shortDescription ?? '',
  duration: item.duration ?? '6 min read',
  topic: item.subtitle ?? 'Research',
  slug: item.slug,
}))

const aiRecommendations = learningHubData
  .filter((item) => item.section === 'ai-growth-recommendations')
  .filter((item) => item.aiGrowthRecommendationContent?.type === 'path')
  .map((item) => ({
    skill: item.title,
    reason: item.shortDescription ?? '',
    impact:
      item.aiGrowthRecommendationContent?.type === 'path'
        ? item.aiGrowthRecommendationContent.impactLevel
        : 'High',
    estimatedTime: item.duration ?? '',
    slug: item.slug,
  }))

type SpecialistTrackCard = {
  title: string
  description: string
  modules: number
  duration: string
  enrolled: boolean
  slug?: string
}

const specialistTracks: SpecialistTrackCard[] = [
  ...learningHubData
    .filter((item) => item.section === 'specialist-deep-dive-tracks')
    .map((item, index) => ({
      title: item.title,
      description: item.shortDescription ?? '',
      modules: item.specialistDeepDiveContent?.modules.length ?? 0,
      duration: item.duration ?? '',
      enrolled: index === 1,
      slug: item.slug,
    })),
]

const loading = false
const filteredContinueItems: HubContinueItem[] = []
const error = ''
const effectiveTutorials = tutorials

// ---------------------------------------------------------------------------
// AI Personalization Loading Component
// ---------------------------------------------------------------------------
const AI_STEPS = [
  { id: 'profile', label: 'Reading your teaching profile', detail: 'Subjects, grade band, goals, experience' },
  { id: 'gaps', label: 'Identifying skill development opportunities', detail: 'Comparing your profile with learning outcomes data' },
  { id: 'micro', label: 'Generating personalized micro-courses', detail: 'Creating 5–10 min learning units matched to your needs' },
  { id: 'growth', label: 'Building your AI growth recommendations', detail: 'Ranking learning paths by potential impact' },
  { id: 'tutorials', label: 'Curating AI-guided tutorials', detail: 'Selecting demos relevant to your classroom context' },
  { id: 'rank', label: 'Ranking and scoring your content', detail: 'Applying personalization signals for best-fit ordering' },
]

function AIPersonalizationLoader() {
  const [activeStep, setActiveStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [dots, setDots] = useState('.')
  const stepRef = useRef(0)

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '.' : d + '.'))
    }, 500)
    return () => clearInterval(dotsInterval)
  }, [])

  useEffect(() => {
    const advance = () => {
      if (stepRef.current >= AI_STEPS.length - 1) return
      setCompletedSteps((prev) => [...prev, stepRef.current])
      stepRef.current += 1
      setActiveStep(stepRef.current)
      const next = 1800 + Math.random() * 1200
      setTimeout(advance, next)
    }
    const timer = setTimeout(advance, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="rounded-3xl border border-purple-100 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-8 shadow-2xl text-white">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/20 ring-1 ring-purple-400/30">
          <Brain className="h-5 w-5 text-purple-300" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-purple-300">AI Personalization Engine</p>
          <p className="text-lg font-semibold text-white">Building your learning profile{dots}</p>
        </div>
        <div className="ml-auto">
          <Loader2 className="h-5 w-5 text-purple-400 animate-spin" />
        </div>
      </div>

      <div className="space-y-3">
        {AI_STEPS.map((step, idx) => {
          const isDone = completedSteps.includes(idx)
          const isActive = activeStep === idx

          return (
            <div
              key={step.id}
              className={`flex items-start gap-3 rounded-2xl px-4 py-3 transition-all duration-500 ${
                isActive
                  ? 'bg-purple-500/20 ring-1 ring-purple-400/40'
                  : isDone
                  ? 'bg-white/5'
                  : 'opacity-40 cursor-default'
              }`}
            >
              <div className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                isDone
                  ? 'bg-green-500 text-white'
                  : isActive
                  ? 'bg-purple-400 text-white ring-2 ring-purple-400/40'
                  : 'bg-white/10 text-white/40'
              }`}>
                {isDone ? '✓' : isActive ? <Loader2 className="h-3 w-3 animate-spin" /> : idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold leading-tight ${isDone ? 'text-white/70' : isActive ? 'text-white' : 'text-white/40'}`}>
                  {step.label}
                  {isActive && <span className="text-purple-300">{dots}</span>}
                </p>
                {(isActive || isDone) && (
                  <p className={`mt-0.5 text-xs ${isDone ? 'text-white/40' : 'text-purple-300/80'}`}>
                    {step.detail}
                  </p>
                )}
              </div>
              {isDone && (
                <span className="mt-0.5 text-xs font-semibold text-green-400 flex-shrink-0">Done</span>
              )}
              {isActive && (
                <span className="mt-0.5 text-xs font-semibold text-purple-300 flex-shrink-0 animate-pulse">In progress</span>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-8 flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-3 text-xs text-white/50">
        <Sparkles className="h-4 w-4 text-purple-400 flex-shrink-0" />
        <span>Your personalized content will appear here once the AI finishes — usually within 30–60 seconds.</span>
      </div>
    </div>
  )
}

type HubBootstrapPayload = {
  stage_message?: string | null
  sub_status?: string | null
  current_stage?: string | null
  fallback_message?: string | null
  timeout_state?: string | null
  failure_state?: boolean
  taking_long?: boolean
  elapsed_seconds?: number
  blocking_sections?: string[]
  state?: string | null
} | null

function HubBootstrappingScreen({
  stage,
  progressPercent,
  bootstrap,
  onRetry,
  retryEnabled,
  retryStatus,
}: {
  stage?: string | null
  progressPercent?: number
  bootstrap?: HubBootstrapPayload
  onRetry?: () => void
  retryEnabled?: boolean
  retryStatus?: string
}) {
  const headline = bootstrap?.stage_message || stage || 'Personalizing your learning hub'
  const sub = bootstrap?.sub_status
  const pct = Math.max(0, Math.min(100, Math.round(Number(progressPercent ?? 0))))
  const showSlow =
    bootstrap?.taking_long ||
    bootstrap?.timeout_state === 'taking_long' ||
    bootstrap?.timeout_state === 'stalled'
  const degraded = bootstrap?.failure_state || bootstrap?.state === 'degraded'

  return (
    <section className="rounded-3xl border border-purple-100 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-8 text-white shadow-2xl">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-purple-300" />
            <h1 className="text-2xl font-semibold leading-tight">Personalizing your learning hub</h1>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold tabular-nums text-purple-200">{pct}%</p>
            <p className="text-xs uppercase tracking-wide text-white/50">Orchestration progress</p>
          </div>
        </div>
        <div>
          <p className="text-lg font-semibold text-white">{headline}</p>
          {sub ? <p className="mt-2 text-sm text-purple-100/85">{sub}</p> : null}
          <p className="mt-2 text-sm text-purple-100/70">
            Our AI is orchestrating your first ready-to-use learning experience. Progress reflects real
            backend milestones — not simulated animation.
          </p>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-purple-400 transition-all duration-700"
            style={{ width: `${Math.max(2, pct)}%` }}
          />
        </div>
        {bootstrap?.elapsed_seconds != null ? (
          <p className="text-xs text-white/45">
            Elapsed {Math.floor(bootstrap.elapsed_seconds / 60)}m {Math.floor(bootstrap.elapsed_seconds % 60)}s
            {bootstrap.blocking_sections && bootstrap.blocking_sections.length > 0
              ? ` · Waiting on: ${bootstrap.blocking_sections.join(', ')}`
              : ''}
          </p>
        ) : null}
        {showSlow && bootstrap?.fallback_message ? (
          <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-50">
            {bootstrap.fallback_message}
          </div>
        ) : null}
        {degraded ? (
          <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-50">
            Some background jobs reported issues. Your hub will still open when core content is ready; you
            can refresh if this persists.
          </div>
        ) : null}
        {retryEnabled ? (
          <div className="pt-2">
            <button
              onClick={onRetry}
              disabled={retryStatus === 'loading'}
              className="w-full rounded-xl bg-amber-500/15 border border-amber-300/30 px-4 py-3 text-sm font-semibold text-amber-50 hover:bg-amber-500/20 disabled:opacity-60"
            >
              {retryStatus === 'loading' ? 'Retrying…' : 'Retry bootstrapping'}
            </button>
          </div>
        ) : null}
        <div className="space-y-2 text-xs text-white/45">
          <p>Stages: profile → personalization → micro-courses → tutorials → growth → hub assembly.</p>
        </div>
      </div>
    </section>
  )
}
function persistHubRouteState(_target: string, _contentId?: string, _contentType?: string) {
  // API/slice integration intentionally disabled: keep frontend in dummy/local-data mode for now.
}

function toUserReason(reasonCodes: string[] | undefined): string {
  const code = (reasonCodes || [])[0] || ''
  const map: Record<string, string> = {
    profile_match: 'Matched to your teaching profile and goals.',
    inventory_expansion: 'Recommended from your newly prepared learning inventory.',
    quality_ranked: 'Selected as a high-quality next step for your growth.',
  }
  return map[code] || 'Recommended for your current learning goals.'
}

function resolveHubCardRoute(course: {
  slug?: string
  route?: string
  title?: string
}): string {
  if (course.route) return course.route
  if (course.slug) return buildLearningHubSectionPath('personalized-micro-courses', course.slug)

  const byTitle: Record<string, string> = {
    'Quick wins: Classroom management essentials': buildLearningHubSectionPath(
      'personalized-micro-courses',
      'classroom-management-essentials'
    ),
    'Formative assessment strategies that work': buildLearningHubSectionPath(
      'personalized-micro-courses',
      'formative-assessment-strategies'
    ),
    'Differentiation made simple': buildLearningHubSectionPath(
      'personalized-micro-courses',
      'differentiation-made-simple'
    ),
    'Engaging reluctant learners': buildLearningHubSectionPath(
      'personalized-micro-courses',
      'engaging-reluctant-learners'
    ),
    'AI tools for lesson planning': buildLearningHubSectionPath(
      'personalized-micro-courses',
      'ai-tools-for-lesson-planning'
    ),
  }
  return byTitle[course.title ?? ''] ?? '/learning-hub'
}

// ---------------------------------------------------------------------------
// Content card status sub-components
// ---------------------------------------------------------------------------

function GeneratingCard({ section }: { section?: string }) {
  return (
    <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4 flex items-center gap-3">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-purple-100">
        <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-purple-900">Generating your content…</p>
        <p className="text-xs text-purple-600 mt-0.5">
          AI is preparing a new {section ? section.replace(/_/g, ' ') : 'learning item'} tailored to your profile. Usually ready in 30–60 seconds.
        </p>
      </div>
    </div>
  )
}

function FailedCard({ onRetry, section }: { onRetry?: () => void; section?: string }) {
  return (
    <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 flex items-start gap-3">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-rose-100">
        <AlertTriangle className="h-4 w-4 text-rose-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-rose-900">Generation failed</p>
        <p className="text-xs text-rose-600 mt-0.5">
          A {section ? section.replace(/_/g, ' ') : 'content item'} could not be generated. It will retry automatically.
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 inline-flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-200"
          >
            <RefreshCw className="h-3 w-3" /> Retry now
          </button>
        )}
      </div>
    </div>
  )
}

function LockedPreviewCard({
  title,
  category,
  duration,
  unlockHint,
}: {
  title?: string
  category?: string
  duration?: string
  unlockHint?: string
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 opacity-75 select-none">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {category && (
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{category}</p>
            )}
            {duration && <span className="text-xs text-gray-400">• {duration}</span>}
          </div>
          <h3 className="mt-2 text-sm font-semibold text-gray-400">
            {title ? (
              <span className="blur-[2px] select-none">{title}</span>
            ) : (
              'Locked content'
            )}
          </h3>
          {unlockHint && (
            <p className="mt-1 text-xs text-gray-400">{unlockHint}</p>
          )}
        </div>
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100">
          <Lock className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>
  )
}

const ProfessionalLearningHub = () => {
  useLearningHubRouteScrollToTop()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { mode: personalizationMode, sectionReadiness } = usePersonalizationStatus()
  const { trackCardClick, trackContentStart } = useActivityTracker()
  usePersonalizationPoller(personalizationMode)

  // Backend slate data (when PERSONALIZATION_ENABLED=true and slate is available)
  const hubData = useLearningHubHomeData()
  const { usingSlate, slateMode } = hubData

  const showColdStart = PERSONALIZATION_ENABLED && !usingSlate && slateMode === 'no_profile'
  useHubBootstrapOrchestration(!!showColdStart)
  const hubBootstrap = useSelector(selectHubBootstrap)
  const retryStatus = useSelector(selectHubBootstrapRetryStatus)
  const showBootstrapBanner = useSelector(selectShowBootstrapBanner)
  const hasReadyInventory = useSelector(selectHasReadyInventory)
  const hubSyncStatus = useSelector((state: any) => state.personalization?.hubSyncStatus ?? 'idle')
  const hubSyncError = useSelector((state: any) => state.personalization?.hubSyncError ?? null)
  const canEnterHub =
    hubBootstrap?.can_enter_hub === true || hubData.pageReadinessState === 'hub_ready'
  const isHubBootstrapping =
    PERSONALIZATION_ENABLED && !showColdStart && !canEnterHub && showBootstrapBanner && !hasReadyInventory

  // Anti-stuck auto-recovery:
  // If orchestration progress does not change for 60s and backend says we're timing out,
  // we trigger a recovery inventory expansion (once or twice) instead of waiting forever.
  const lastProgressRef = useRef<number | null>(null)
  const lastProgressChangeAtRef = useRef<number>(Date.now())
  const autoRetryAttemptsRef = useRef<number>(0)
  useEffect(() => {
    if (!isHubBootstrapping) return
    const pctRaw = hubBootstrap?.progress_percent
    if (pctRaw == null) return
    const pct = Number(pctRaw)

    if (lastProgressRef.current === null) {
      lastProgressRef.current = pct
      lastProgressChangeAtRef.current = Date.now()
      return
    }

    if (pct !== lastProgressRef.current) {
      lastProgressRef.current = pct
      lastProgressChangeAtRef.current = Date.now()
      autoRetryAttemptsRef.current = 0
      return
    }

    const timeout_state = hubBootstrap?.timeout_state
    const stalledStates = new Set(['taking_long', 'stalled'])
    const shouldRetry =
      stalledStates.has(timeout_state || '') &&
      Date.now() - lastProgressChangeAtRef.current > 60_000 &&
      autoRetryAttemptsRef.current < 2 &&
      retryStatus !== 'loading'

    if (shouldRetry) {
      autoRetryAttemptsRef.current += 1
      lastProgressChangeAtRef.current = Date.now()
      dispatch(retryLearningHubBootstrap())
    }
  }, [dispatch, hubBootstrap?.progress_percent, hubBootstrap?.timeout_state, isHubBootstrapping, retryStatus])

  // Deduplicate items by content_id and normalised title.
  // Prevents the same content appearing multiple times when the DB has duplicate rows.
  function dedup<T>(
    items: T[],
    getId: (item: T) => string | undefined,
    getTitle: (item: T) => string | undefined
  ): T[] {
    const seenIds = new Set<string>()
    const seenTitles = new Set<string>()
    return items.filter((item) => {
      const id = (getId(item) || '').trim()
      const normTitle = (getTitle(item) || '').trim().toLowerCase()
      if (id && seenIds.has(id)) return false
      if (normTitle && seenTitles.has(normTitle)) return false
      if (id) seenIds.add(id)
      if (normTitle) seenTitles.add(normTitle)
      return true
    })
  }

  // When personalization is active (usingSlate=true) we ONLY show sections that the backend
  // explicitly populated. If a section is null, we return null (hidden), NOT static dummy data.
  // Static dummy data is only shown in cold_start mode (no profile) or when disabled.

  const shouldUseStaticFallback = !PERSONALIZATION_ENABLED || slateMode === 'no_profile'

  const effectiveMicroCourses = hubData.usingSlate
    ? (hubData.microCourses
        ? dedup(
            hubData.microCourses.visible_items.slice(0, SECTION_DISPLAY_LIMITS.micro_courses.visible).map((item: any) => ({
              title: item.title || item.content_id,
              duration: item.display_meta?.duration || '',
              category: item.display_meta?.category || item.content_type || '',
              progress: 0,
              difficulty: item.display_meta?.difficulty || '',
              slug: item.content_slug || item.content_id,
              route: item.route || '/learning-hub',
              contentId: item.content_id,
              contentType: item.content_type,
              assignmentId: item.assignment_id,
              locked: item.locked,
              section: 'micro_courses',
            })),
            (item: any) => item.contentId,
            (item: any) => item.title
          )
        : [])
    : shouldUseStaticFallback
      ? microCourses
      : []

  const effectiveAiRecommendations = hubData.usingSlate
    ? (hubData.growthRecommendations
        ? dedup(
            hubData.growthRecommendations.visible_items.slice(0, SECTION_DISPLAY_LIMITS.growth_recommendations.visible).map((item: any) => ({
              skill: item.title || item.content_id,
              reason: toUserReason(item.reason_codes),
              impact: 'High',
              estimatedTime: item.display_meta?.duration || '',
              slug:
                item.content_slug ||
                item.content_id ||
                String(item.title || 'growth').toLowerCase().replace(/\s+/g, '-'),
              route: item.route,
              contentId: item.content_id,
              contentType: item.content_type,
              assignmentId: item.assignment_id,
              locked: item.locked,
            })),
            (item: any) => item.contentId,
            (item: any) => item.skill
          )
        : [])
    : shouldUseStaticFallback
      ? aiRecommendations
      : []

  const effectiveTutorialsData = hubData.usingSlate
    ? (hubData.tutorials
        ? dedup(
            hubData.tutorials.visible_items.slice(0, SECTION_DISPLAY_LIMITS.tutorials.visible).map((item: any) => ({
              title: item.title || item.content_id,
              type: item.display_meta?.category || 'Tutorial',
              duration: item.display_meta?.duration || '',
              completed: false,
              slug: item.content_slug || item.content_id,
              route: item.route,
              contentId: item.content_id,
              contentType: item.content_type,
              assignmentId: item.assignment_id,
              locked: item.locked,
            })),
            (item: any) => item.contentId,
            (item: any) => item.title
          )
        : [])
    : shouldUseStaticFallback
      ? effectiveTutorials
      : []

  // Research Insights: never hide the section once hub is entered.
  const effectiveResearchInsights = hubData.usingSlate
    ? (hubData.researchInsights?.visible_items?.length
        ? dedup(
            hubData.researchInsights.visible_items,
            (item: any) => item.content_id,
            (item: any) => item.title
          ).slice(0, SECTION_DISPLAY_LIMITS.research_insights.visible).map((item: any) => ({
            title: item.title || item.content_id,
            summary: item.display_meta?.summary || '',
            duration: item.display_meta?.duration || '6 min read',
            topic: item.display_meta?.category || 'Research',
            slug: item.content_slug || item.content_id,
            route: item.route,
            contentId: item.content_id,
            contentType: item.content_type,
            assignmentId: item.assignment_id,
          }))
        : [])
    : shouldUseStaticFallback
      ? researchInsights
      : []

  // Specialist tracks: never hide the section once hub is entered.
  const effectiveSpecialistTracks = hubData.usingSlate
    ? (hubData.specialistTracks?.visible_items?.length
        ? dedup(
            hubData.specialistTracks.visible_items,
            (item: any) => item.content_id,
            (item: any) => item.title
          ).slice(0, SECTION_DISPLAY_LIMITS.specialist_tracks.visible).map((item: any) => ({
            title: item.title || item.content_id,
            description: item.display_meta?.summary || '',
            modules: item.display_meta?.module_count || 0,
            duration: item.display_meta?.duration || '',
            enrolled: false,
            slug: item.content_slug || item.content_id,
            route: item.route,
            contentId: item.content_id,
            contentType: item.content_type,
            assignmentId: item.assignment_id,
          }))
        : [])
    : shouldUseStaticFallback
      ? specialistTracks
      : []

  const isSlateLoading = hubData.usingSlate && hubData.loading
  const growthState = hubData.growthRecommendations?.growth_state
  const growthReady =
    !hubData.usingSlate ||
    (growthState?.readiness_state === 'ready' &&
      (hubData.growthRecommendations?.visible_items?.length ?? 0) >= SECTION_TARGETS.growth_recommendations.visible)
  const displayedMicroCourses = effectiveMicroCourses
  const displayedGrowthRecommendations = growthReady ? effectiveAiRecommendations : []
  const displayedTutorials = effectiveTutorialsData
  const displayedResearch = effectiveResearchInsights
  const displayedSpecialist = effectiveSpecialistTracks
  const visibleUnlockedCount =
    (hubData.microCourses?.visible_items?.length ?? 0) +
    (hubData.growthRecommendations?.visible_items?.length ?? 0) +
    (hubData.tutorials?.visible_items?.length ?? 0) +
    (hubData.researchInsights?.visible_items?.length ?? 0) +
    (hubData.specialistTracks?.visible_items?.length ?? 0)
  const preparedLockedCount =
    (hubData.microCourses?.locked_preview_items?.length ?? 0) +
    (hubData.growthRecommendations?.locked_preview_items?.length ?? 0) +
    (hubData.tutorials?.locked_preview_items?.length ?? 0) +
    (hubData.researchInsights?.locked_preview_items?.length ?? 0) +
    (hubData.specialistTracks?.locked_preview_items?.length ?? 0)
  const readySectionsCount = (hubData.minimumReadySections || []).length
  const shouldShowMicroViewAll =
    (hubData.microCourses?.visible_items?.length ?? 0) >= 5 &&
    (((hubData.microCourses?.visible_items?.length ?? 0) > 5) ||
      ((hubData.microCourses?.locked_preview_items?.length ?? 0) > 0))
  const shouldShowGrowthViewAll =
    growthReady &&
    (hubData.growthRecommendations?.visible_items?.length ?? 0) >= 3 &&
    (((hubData.growthRecommendations?.visible_items?.length ?? 0) > 3) ||
      ((hubData.growthRecommendations?.locked_preview_items?.length ?? 0) > 0))
  const shouldShowTutorialsViewAll =
    (hubData.tutorials?.visible_items?.length ?? 0) >= 3 &&
    (((hubData.tutorials?.visible_items?.length ?? 0) > 3) ||
      ((hubData.tutorials?.locked_preview_items?.length ?? 0) > 0))
  const shouldShowResearchViewAll =
    (hubData.researchInsights?.visible_items?.length ?? 0) >= 5 &&
    (((hubData.researchInsights?.visible_items?.length ?? 0) > 5) ||
      ((hubData.researchInsights?.locked_preview_items?.length ?? 0) > 0))
  const shouldShowSpecialistViewAll =
    (hubData.specialistTracks?.visible_items?.length ?? 0) >= 3 &&
    (((hubData.specialistTracks?.visible_items?.length ?? 0) > 3) ||
      ((hubData.specialistTracks?.locked_preview_items?.length ?? 0) > 0))
  // In personalized mode, always show sections that exist in the slate (even if currently empty)
  // so users see generating/preparing states rather than sections silently disappearing.
  const shouldShowTutorials = displayedTutorials.length > 0 || (hubData.usingSlate && hubData.tutorials != null)
  const shouldShowResearch = displayedResearch.length > 0 || (hubData.usingSlate && hubData.researchInsights != null)
  const shouldShowSpecialist = displayedSpecialist.length > 0 || (hubData.usingSlate && hubData.specialistTracks != null)

  /**
   * Navigate to a card destination using the full entity-binding contract.
   * assignment_id + content_id + content_type are the navigation contract.
   * slug is display-only and is never used for route resolution.
   */
  const handleCourseStart = (course: {
    slug?: string
    route?: string
    title?: string
    contentId?: string
    contentType?: string
    assignmentId?: string
    section?: string
  }) => {
    const target = resolveHubCardRoute(course)
    if (course.contentId) {
      trackCardClick(course.section || 'micro_courses', course.contentId, course.contentType || 'micro_course', course.assignmentId)
      trackContentStart(course.section || 'micro_courses', course.contentId, course.contentType || 'micro_course', course.assignmentId)
    }
    navigate(target, {
      state: {
        content_id: course.contentId,
        content_type: course.contentType,
        assignment_id: course.assignmentId,
        title: course.title,
        source_section: course.section || 'micro_courses',
      },
    })
  }

  const handleTutorialWatch = (tutorial: any) => {
    const slug = typeof tutorial === 'string' ? tutorial : (tutorial.slug || tutorial.contentId)
    const route = typeof tutorial === 'string' ? buildLearningHubSectionPath('ai-guided-tutorials-demonstrations', slug) : (tutorial.route || buildLearningHubSectionPath('ai-guided-tutorials-demonstrations', slug))
    navigate(route, {
      state: typeof tutorial === 'string' ? undefined : {
        content_id: tutorial.contentId,
        content_type: tutorial.contentType,
        assignment_id: tutorial.assignmentId,
        title: tutorial.title,
        source_section: 'tutorials',
      },
    })
  }

  const handleResearchReadMore = (insight: any) => {
    const slug = insight?.slug || insight?.contentId
    const target = insight?.route || buildLearningHubSectionPath('research-insights-library', slug)
    navigate(target, {
      state: {
        content_id: insight?.contentId,
        content_type: insight?.contentType,
        assignment_id: insight?.assignmentId,
        title: insight?.title,
        source_section: 'research_insights',
      },
    })
  }

  /**
   * Growth recommendation navigation contract:
   * Uses the full entity from the card (route + content_id + content_type + assignment_id).
   * Never falls back to generic routes that change entity identity.
   */
  const handleStartPath = (card: {
    slug?: string
    route?: string
    contentId?: string
    contentType?: string
    assignmentId?: string
    title?: string
  }) => {
    const target = card.route || buildLearningHubSectionPath('ai-growth-recommendations', card.slug || '')
    if (card.contentId) {
      trackCardClick('growth_recommendations', card.contentId, card.contentType || 'learning_path', card.assignmentId)
    }
    navigate(target, {
      state: {
        content_id: card.contentId,
        content_type: card.contentType || 'learning_path',
        assignment_id: card.assignmentId,
        title: card.title,
        source_section: 'growth_recommendations',
      },
    })
  }

  const handleEnrollTrack = (track?: any) => {
    if (!track) return
    const slug = track.slug || track.contentId
    const target = track.route || buildLearningHubSectionPath('specialist-deep-dive-tracks', slug)
    navigate(target, {
      state: {
        content_id: track.contentId,
        content_type: track.contentType,
        assignment_id: track.assignmentId,
        title: track.title,
        source_section: 'specialist_tracks',
      },
    })
  }

  // ─── Single-source-of-truth gate (no race condition) ────────────────────────
  //
  // Both `slateMode` and `usingSlate` come from the SAME Redux key
  // (personalization.slateMode / personalization.slateSections). They update in the
  // same atomic Redux dispatch, so they can never be inconsistent with each other.
  //
  // Rules:
  //  isAIProcessing  → show the AI loader, hide ALL content sections
  //  showColdStart   → show "complete your profile" banner + static sections
  //
  // slateMode === null  : API not yet resolved / cleared → treat as loading → show loader
  // slateMode === 'initializing' : backend confirmed background job running → show loader
  // slateMode === 'no_profile'   : backend confirmed no profile → show cold start
  // usingSlate === true          : real sections arrived → hide loader, show grid
  // Initial unknown state on hard refresh: do not render loader or dummy sections.
  // Wait for first slate response to avoid visible blinking.
  const isAwaitingInitialSlate = PERSONALIZATION_ENABLED && !usingSlate && slateMode === null
  const isAIProcessing =
    PERSONALIZATION_ENABLED &&
    !canEnterHub &&
    !usingSlate &&
    showBootstrapBanner &&
    !hasReadyInventory &&
    (slateMode === 'initializing' || slateMode === 'partial_ready' || slateMode === 'personalized')
  const showMainSections = !isAIProcessing && !isAwaitingInitialSlate
  const showStaticPanels = !PERSONALIZATION_ENABLED || showColdStart
  const preparingSections =
    hubData.usingSlate && Array.isArray(sectionReadiness)
      ? sectionReadiness.filter((r: any) => r.status === 'preparing' || r.status === 'partial_ready')
      : []
  const visibleCounts = [
    displayedMicroCourses.length,
    displayedGrowthRecommendations.length,
    displayedTutorials.length,
    displayedResearch?.length ?? 0,
    displayedSpecialist?.length ?? 0,
  ]
  const totalVisiblePersonalized = visibleCounts.reduce((acc, n) => acc + n, 0)

  const heroTitle = isAIProcessing
    ? 'Building your personalized professional learning hub'
    : showColdStart
      ? 'Complete your profile to unlock your personalized learning hub'
      : 'Grow as fast as your students — with your personalized professional learning hub'

  const heroSubtitle = isAIProcessing
    ? 'Our AI is preparing section-specific recommendations, tutorials, and next-step unlocks tailored to your profile.'
    : showColdStart
      ? 'Add your subjects, grade band, and goals to enable personalized recommendations and adaptive section unlocks.'
      : `You currently have ${totalVisiblePersonalized} personalized items ready across your learning sections.`

  // ─── Debounced loader visibility ─────────────────────────────────────────────
  // Only show the AI loader after 250ms of continuous processing. This prevents
  // a visible flash when the backend responds quickly (e.g. on navigation back
  // where a fresh fetch resolves before the user notices the loader).
  const [loaderVisible, setLoaderVisible] = useState(false)
  useEffect(() => {
    if (!isAIProcessing) {
      setLoaderVisible(false)
      return
    }
    const timer = setTimeout(() => setLoaderVisible(true), 250)
    return () => clearTimeout(timer)
  }, [isAIProcessing])

  if (isHubBootstrapping) {
    const loaderPct =
      hubBootstrap?.progress_percent ??
      hubData.globalProgressPercent ??
      0
    const loaderStage =
      hubBootstrap?.stage_message ??
      hubBootstrap?.global_generation_stage ??
      hubData.globalGenerationStage
    return (
      <div className="space-y-8">
        <HubBootstrappingScreen
          stage={loaderStage}
          progressPercent={Number(loaderPct)}
          bootstrap={hubBootstrap}
          onRetry={() => dispatch(retryLearningHubBootstrap())}
          retryEnabled={
            !!hubBootstrap?.fallback_message &&
            (hubBootstrap?.timeout_state === 'taking_long' || hubBootstrap?.timeout_state === 'stalled')
          }
          retryStatus={retryStatus}
        />
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {/* Sync status banners (profile change in progress / failed) */}
      {PERSONALIZATION_ENABLED && hubSyncStatus === 'updating' && (
        <div className="flex items-center gap-3 rounded-2xl bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-900">
          <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin text-blue-500" />
          <span>Updating your recommendations based on profile changes…</span>
        </div>
      )}
      {PERSONALIZATION_ENABLED && hubSyncStatus === 'failed' && hubSyncError && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 text-amber-500" />
            <span>{hubSyncError}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              dispatch(clearHubSyncStatus())
              dispatch(fetchLearningHubSlate())
            }}
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-200 transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh recommendations
          </button>
        </div>
      )}

      {showColdStart && <ProfileCompletionGate />}

      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-8 py-10 text-white shadow-xl">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90">
              <Sparkles className="h-4 w-4" /> Growth Hub
            </div>
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">{heroTitle}</h1>
            <p className="text-sm text-white/80">{heroSubtitle}</p>
            <div className="flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-wide">
              <span className="rounded-full bg-white/15 px-3 py-1">
                {isAIProcessing ? 'Preparing personalized content' : 'Adaptive learning plan'}
              </span>
              <span className="rounded-full bg-white/15 px-3 py-1">
                {showColdStart ? 'Profile-driven setup' : 'Evidence-backed'}
              </span>
              <span className="rounded-full bg-white/15 px-3 py-1">AI-personalized</span>
            </div>
          </div>

          <div className="grid w-full max-w-md gap-4 rounded-2xl bg-white/10 p-6 text-white backdrop-blur">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/70">Unlocked items</p>
              <p className="mt-2 text-3xl font-semibold">{loading ? '—' : visibleUnlockedCount}</p>
              <p className="text-xs text-white/70">Live personalized content available now</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/70">Prepared next</p>
              <p className="mt-2 text-3xl font-semibold">{loading ? '—' : preparedLockedCount}</p>
              <p className="text-xs text-white/70">Locked preview items generated</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/70">Hub readiness</p>
              <p className="mt-2 text-3xl font-semibold">{loading ? '—' : `${hubData.globalProgressPercent}%`}</p>
              <p className="text-xs text-white/70">{readySectionsCount}/4 minimum sections ready</p>
            </div>
          </div>
        </div>
      </section>

      {filteredContinueItems.length > 0 && (
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Zap className="h-5 w-5 text-amber-500" /> Continue Learning
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Pick up where you left off.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {filteredContinueItems.map((item: any) => (
              <div
                key={item.contentId}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-4 transition hover:border-amber-200 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {item.category && (
                        <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
                          {item.category}
                        </p>
                      )}
                      {item.duration && <span className="text-xs text-gray-500">• {item.duration}</span>}
                      {item.difficulty && <span className="text-xs text-gray-500">• {item.difficulty}</span>}
                    </div>
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">{item.title}</h3>
                    <div className="mt-3">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full bg-amber-500 transition-all"
                          style={{ width: `${item.progressPercent}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">{Math.round(item.progressPercent)}% complete</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (!item.contentId || item.contentId.startsWith('learning-hub:')) {
                        navigate('/learning-hub')
                        return
                      }
                      const target = item.route || '/learning-hub'
                      if (item.contentId) {
                        persistHubRouteState(target, item.contentId, item.contentType || 'micro_course')
                      }
                      navigate(target, {
                        state: {
                          contentId: item.contentId,
                          contentType: item.contentType || 'micro_course',
                        },
                      })
                    }}
                    className="rounded-full bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-600 hover:bg-amber-100 transition"
                  >
                    Continue
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Loader: only renders after 250ms to avoid visible flash on fast responses */}
      {loaderVisible && <AIPersonalizationLoader />}

      {/* Grid: hidden while processing OR waiting for first slate response */}
      {showMainSections && <section className="grid gap-6 xl:grid-cols-[1.5fr,1fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <Zap className="h-5 w-5 text-amber-500" /> Personalized micro-courses
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Short 5–10 minute learning units generated by AI, aligned to your needs.
                </p>
                {hubData.usingSlate && (hubData.microCourses?.locked_preview_items?.length ?? 0) > 0 && (
                  <p className="mt-1 text-xs text-amber-700">
                    {(hubData.microCourses?.locked_preview_items?.length ?? 0)} more prepared items will unlock as you progress.
                  </p>
                )}
              </div>
              {shouldShowMicroViewAll ? (
                <button
                  onClick={() => navigate('/learning-hub/sections/micro_courses')}
                  className="text-xs font-semibold uppercase tracking-wide text-amber-600 hover:text-amber-500"
                >
                  View all
                </button>
              ) : null}
            </div>

            {error && (
              <p className="mt-2 text-sm text-amber-600">{error}</p>
            )}
            <div className="mt-6 space-y-4">
              {isSlateLoading && displayedMicroCourses.length === 0 ? (
                <p className="text-sm text-gray-500">Loading your personalized recommendations…</p>
              ) : displayedMicroCourses.length === 0 ? (
                <p className="text-sm text-gray-500">
                  We are generating your first {SECTION_TARGETS.micro_courses.visible} classroom-ready micro-courses and preparing the next {SECTION_TARGETS.micro_courses.visible} unlocks.
                </p>
              ) : (
                displayedMicroCourses.map((course: any) => (
                  <div
                    key={course.contentId || course.title}
                    data-section="micro-course"
                    data-content-id={course.contentId || ''}
                    data-content-type={course.contentType || ''}
                    data-route={course.route || ''}
                    data-title={course.title || ''}
                    className="rounded-2xl border border-gray-100 bg-gray-50 p-4 transition hover:border-amber-200 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">{course.category}</p>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{course.duration}</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{course.difficulty}</span>
                        </div>
                        <h3 className="mt-2 text-sm font-semibold text-gray-900">{course.title}</h3>
                        {course.progress > 0 && (
                          <div className="mt-3">
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                              <div
                                className="h-full bg-amber-500 transition-all"
                                style={{ width: `${course.progress}%` }}
                              />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">{course.progress}% complete</p>
                          </div>
                        )}
                      </div>
                      <button
                        data-action="start-course"
                        data-content-id={course.contentId || ''}
                        data-content-type={course.contentType || ''}
                        data-route={course.route || ''}
                        data-title={course.title || ''}
                        onClick={() => handleCourseStart(course)}
                        className="rounded-full bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-600 hover:bg-amber-100 transition"
                      >
                        {course.progress === 0 ? 'Start' : course.progress === 100 ? 'Review' : 'Continue'}
                      </button>
                    </div>
                  </div>
                ))
              )}

              {/* Locked preview items — shown after visible items with blur + lock indicator */}
              {hubData.usingSlate &&
                (hubData.microCourses?.locked_preview_items ?? []).slice(0, SECTION_DISPLAY_LIMITS.micro_courses.locked).map((item: any) => (
                  <LockedPreviewCard
                    key={item.content_id || item.assignment_id}
                    title={item.title}
                    category={item.display_meta?.category}
                    duration={item.display_meta?.duration}
                    unlockHint={item.unlock_hint || 'Complete visible items to unlock this next.'}
                  />
                ))}

              {/* Generating / failed placeholders from section readiness */}
              {hubData.usingSlate &&
                sectionReadiness
                  .filter((r: any) => r.section === 'micro_courses')
                  .map((r: any) => {
                    if (r.status === 'preparing' && displayedMicroCourses.length === 0) {
                      return <GeneratingCard key="mc-generating" section="micro_course" />
                    }
                    if (r.status === 'failed') {
                      return <FailedCard key="mc-failed" section="micro_course" />
                    }
                    return null
                  })}
            </div>
          </div>

          {shouldShowTutorials ? <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <Play className="h-5 w-5 text-blue-500" /> AI-guided tutorials & demonstrations
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Step-by-step walkthroughs showing how to use templates effectively and apply best practices.
                </p>
              </div>
              {shouldShowTutorialsViewAll ? (
                <button
                  onClick={() => navigate('/learning-hub/sections/tutorials')}
                  className="text-xs font-semibold uppercase tracking-wide text-blue-600 hover:text-blue-500"
                >
                  View all
                </button>
              ) : null}
            </div>

            <div className="mt-6 space-y-4">
              {displayedTutorials.length === 0 && hubData.usingSlate ? (
                hubData.tutorials?.readiness === 'failed'
                  ? <FailedCard section="tutorial" />
                  : <GeneratingCard section="tutorial" />
              ) : displayedTutorials.map((tutorial: any) => (
                <div
                  key={tutorial.slug}
                  className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Play className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{tutorial.type}</p>
                      <h3 className="mt-1 text-sm font-semibold text-gray-900">{tutorial.title}</h3>
                      <p className="mt-1 text-xs text-gray-500">{tutorial.duration}</p>
                    </div>
                  </div>
                  {tutorial.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <button
                      onClick={() => handleTutorialWatch(tutorial)}
                      className="rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition"
                    >
                      Watch
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div> : null}

        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-600">
                <Target className="h-4 w-4 text-amber-500" /> AI growth recommendations
              </h3>
              {shouldShowGrowthViewAll ? (
                <button
                  onClick={() => navigate('/learning-hub/sections/growth_recommendations')}
                  className="text-xs font-semibold uppercase tracking-wide text-amber-600 hover:text-amber-500"
                >
                  View all
                </button>
              ) : null}
            </div>
            <p className="mt-2 text-xs text-gray-600">
              {displayedGrowthRecommendations.length === 0 ? (
                growthState?.readiness_state === 'no_signal'
                  ? 'We are analyzing your teaching patterns to identify high-impact skills.'
                  : growthState?.readiness_state === 'signal_building' || growthState?.readiness_state === 'collecting_signal'
                    ? `Signal progress: ${growthState?.signal_count || 0} of ${growthState?.required_signal_count || 5} collected.`
                    : growthState?.readiness_state === 'stalled' || growthState?.generation_stalled
                      ? 'Growth plan generation encountered an issue. Reload the page or continue using the hub — it will retry automatically.'
                      : 'Generating your personalized growth plan...'
              ) : (
                <>
                  Based on your usage, here are{' '}
                  {displayedGrowthRecommendations.length === 1
                    ? 'the skill that will'
                    : `the ${displayedGrowthRecommendations.length} skills that will`}{' '}
                  improve your teaching impact right now.
                </>
              )}
            </p>
            {hubData.usingSlate && (hubData.growthRecommendations?.locked_preview_items?.length ?? 0) > 0 && (
              <p className="mt-2 text-xs text-amber-700">
                {(hubData.growthRecommendations?.locked_preview_items?.length ?? 0)} additional recommendations are prepared and locked.
              </p>
            )}

            <div className="mt-4 space-y-4">
              {displayedGrowthRecommendations.length === 0 && hubData.usingSlate && (
                growthState?.readiness_state === 'stalled' || growthState?.generation_stalled
                  ? <FailedCard section="growth recommendation" />
                  : growthState?.readiness_state === 'generating'
                    ? <GeneratingCard section="growth recommendation" />
                    : null
              )}
              {displayedGrowthRecommendations.map((rec: any, idx: number) => (
                <div key={rec.contentId || rec.slug} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Skill {idx + 1}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                        rec.impact === 'High'
                          ? 'bg-amber-100 text-amber-700'
                          : rec.impact === 'Medium'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {rec.impact} impact
                    </span>
                  </div>
                  <h4 className="mt-2 text-sm font-semibold text-gray-900">{rec.skill}</h4>
                  <p className="mt-1 text-xs text-gray-600 break-words">{rec.reason}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-500">{rec.estimatedTime}</span>
                    <button
                      onClick={() => handleStartPath(rec)}
                      className="text-xs font-semibold text-amber-600 hover:text-amber-500 transition"
                    >
                      Start path
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {showStaticPanels && <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-600">
                <Award className="h-4 w-4 text-green-500" /> Certificates & progress
              </h3>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Unlocked now</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">{visibleUnlockedCount} items across your sections</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Ready sections</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">{readySectionsCount} sections meet minimum readiness</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Yearly growth report</p>
              <p className="mt-2 text-sm text-gray-700">
                Download your complete evidence log of completed training for appraisals and portfolios.
              </p>
              <button className="mt-3 w-full rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-gray-800">
                Export report
              </button>
            </div>
          </div>}
        </aside>
      </section>}

      {showMainSections && shouldShowResearch && <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <FileText className="h-5 w-5 text-purple-500" /> Research insights library
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Simplified, teacher-friendly summaries of top educational research — evidence-backed teaching in
              minutes.
            </p>
          </div>
          {shouldShowResearchViewAll ? (
            <button
              onClick={() => navigate('/learning-hub/sections/research_insights')}
              className="text-xs font-semibold uppercase tracking-wide text-purple-600 hover:text-purple-500"
            >
              View all
            </button>
          ) : null}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {displayedResearch.length === 0 && hubData.usingSlate ? (
            hubData.researchInsights?.readiness === 'failed'
              ? <FailedCard section="research insight" />
              : <GeneratingCard section="research insight" />
          ) : displayedResearch.map((insight: any) => (
            <div
              key={insight.slug}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-4 transition hover:border-purple-200 hover:shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">{insight.topic}</p>
              <h3 className="mt-2 text-sm font-semibold text-gray-900">{insight.title}</h3>
              <p className="mt-2 text-xs text-gray-600">{insight.summary}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-500">{insight.duration}</span>
                <button
                  type="button"
                  onClick={() => handleResearchReadMore(insight)}
                  className="text-xs font-semibold text-purple-600 hover:text-purple-500 transition"
                >
                  Read more
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>}

      {showMainSections && shouldShowSpecialist && <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <GraduationCap className="h-5 w-5 text-indigo-500" /> Specialist deep-dive tracks
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Advanced structured tracks for building niche expertise. Build a niche. Grow your expertise.
            </p>
          </div>
          {shouldShowSpecialistViewAll ? (
            <button
              onClick={() => navigate('/learning-hub/sections/specialist_tracks')}
              className="text-xs font-semibold uppercase tracking-wide text-indigo-600 hover:text-indigo-500"
            >
              View all
            </button>
          ) : null}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {displayedSpecialist.length === 0 && hubData.usingSlate ? (
            hubData.specialistTracks?.readiness === 'failed'
              ? <FailedCard section="specialist track" />
              : <GeneratingCard section="specialist track" />
          ) : displayedSpecialist.map((track: any) => (
            <div
              key={track.slug ?? track.title}
              className={`rounded-2xl border p-4 transition ${
                track.enrolled
                  ? 'border-indigo-200 bg-indigo-50'
                  : 'border-gray-100 bg-gray-50 hover:border-indigo-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Specialist track</p>
                {track.enrolled && (
                  <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                    Enrolled
                  </span>
                )}
              </div>
              <h3 className="mt-2 text-sm font-semibold text-gray-900">{track.title}</h3>
              <p className="mt-2 text-xs text-gray-600">{track.description}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span>{track.modules} modules</span>
                <span>{track.duration}</span>
              </div>
              <button
                type="button"
                onClick={() => handleEnrollTrack(track)}
                className={`mt-4 w-full rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  track.enrolled
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                    : 'border border-gray-200 bg-white text-gray-700 hover:border-indigo-200 hover:text-indigo-600'
                }`}
              >
                {track.enrolled ? 'Continue track' : 'Enroll now'}
              </button>
            </div>
          ))}
        </div>
      </section>}

      {showStaticPanels && <section className="rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 text-white shadow-md">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Coming soon</p>
            <h2 className="text-2xl font-semibold">Community Q&A</h2>
            <p className="text-sm text-white/75">
              Teachers can ask questions, share tips, get solutions — AI moderates and assists. Connect with educators
              worldwide.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/80 hover:bg-white/10">
            <Users className="h-4 w-4" /> Join waitlist
          </button>
        </div>
      </section>}
    </div>
  )
}

export default ProfessionalLearningHub
