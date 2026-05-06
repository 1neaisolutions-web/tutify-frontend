import { useEffect, useMemo, useState } from 'react'
import {
  ListChecks,
  ChevronRight,
  Lightbulb,
  BookOpen,
  Target,
  Heart,
  FlaskConical,
  Languages,
  CheckCircle2,
} from 'lucide-react'
import { useSnackbar } from '../../../hooks/useSnackbar'
import { getLessonStrategies, LessonStrategySummary } from '../../../api/youtubeQuiz'

type StrategyVisuals = {
  Icon: typeof Lightbulb
  cardCls: string
  activeCls: string
  iconCls: string
  badgeCls: string
}

const STRATEGY_VISUALS: Record<string, StrategyVisuals> = {
  inquiry_launch: {
    Icon: Lightbulb,
    cardCls: 'border-blue-200 bg-blue-50 hover:border-blue-300',
    activeCls: 'border-blue-500 bg-blue-100',
    iconCls: 'bg-blue-100 text-blue-600',
    badgeCls: 'bg-blue-600',
  },
  flipped_mini_lesson: {
    Icon: BookOpen,
    cardCls: 'border-green-200 bg-green-50 hover:border-green-300',
    activeCls: 'border-green-500 bg-green-100',
    iconCls: 'bg-green-100 text-green-600',
    badgeCls: 'bg-green-600',
  },
  career_spotlight: {
    Icon: Target,
    cardCls: 'border-purple-200 bg-purple-50 hover:border-purple-300',
    activeCls: 'border-purple-500 bg-purple-100',
    iconCls: 'bg-purple-100 text-purple-600',
    badgeCls: 'bg-purple-600',
  },
  sel_morning_meeting: {
    Icon: Heart,
    cardCls: 'border-rose-200 bg-rose-50 hover:border-rose-300',
    activeCls: 'border-rose-500 bg-rose-100',
    iconCls: 'bg-rose-100 text-rose-600',
    badgeCls: 'bg-rose-600',
  },
  stem_lab_prep: {
    Icon: FlaskConical,
    cardCls: 'border-orange-200 bg-orange-50 hover:border-orange-300',
    activeCls: 'border-orange-500 bg-orange-100',
    iconCls: 'bg-orange-100 text-orange-600',
    badgeCls: 'bg-orange-600',
  },
  language_listening_center: {
    Icon: Languages,
    cardCls: 'border-teal-200 bg-teal-50 hover:border-teal-300',
    activeCls: 'border-teal-500 bg-teal-100',
    iconCls: 'bg-teal-100 text-teal-600',
    badgeCls: 'bg-teal-600',
  },
}

const FALLBACK_VISUALS: StrategyVisuals = {
  Icon: ListChecks,
  cardCls: 'border-gray-200 bg-gray-50 hover:border-gray-300',
  activeCls: 'border-gray-400 bg-gray-100',
  iconCls: 'bg-gray-100 text-gray-600',
  badgeCls: 'bg-gray-600',
}

type StrategyCard = LessonStrategySummary & StrategyVisuals

const prettyQuestionType = (value: string): string =>
  value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

const formatQuestionMix = (mix: Record<string, number>): string => {
  const total = Object.values(mix).reduce((sum, value) => sum + value, 0)
  if (!total) return 'No question mix available'
  return Object.entries(mix)
    .map(([key, value]) => `${Math.round((value / total) * 100)}% ${prettyQuestionType(key)}`)
    .join(' · ')
}

interface Props {
  onStrategyApplied?: (strategyId: string, strategyTitle: string) => void
  /** Called when the user selects a strategy card or applies one — use to scroll to the main quiz form. */
  onUserInteract?: () => void
}

export function LessonFlowBuilder({ onStrategyApplied, onUserInteract }: Props) {
  const { toast } = useSnackbar()
  const [strategies, setStrategies] = useState<LessonStrategySummary[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [appliedId, setAppliedId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const loadStrategies = async () => {
      try {
        const response = await getLessonStrategies()
        if (cancelled) return
        setStrategies(response)
      } catch (error) {
        if (cancelled) return
        console.error('Failed to load lesson strategies', error)
        toast.error('Unable to load lesson strategies right now.')
      }
    }
    loadStrategies()
    return () => {
      cancelled = true
    }
  }, [toast])

  const strategyCards = useMemo<StrategyCard[]>(
    () =>
      strategies.map((strategy) => ({
        ...strategy,
        ...(STRATEGY_VISUALS[strategy.id] ?? FALLBACK_VISUALS),
      })),
    [strategies]
  )

  const active = strategyCards.find((s) => s.id === activeId) ?? null

  const handleApply = () => {
    if (!active) return
    setAppliedId(active.id)
    toast.success(`Strategy "${active.title}" applied to your quiz configuration.`)
    onStrategyApplied?.(active.id, active.title)
    onUserInteract?.()
  }

  return (
    <div
      className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm scroll-mt-24"
      id="youtube-quiz-lesson-flow"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <ListChecks className="h-5 w-5 text-red-500" />
            Interactive Lesson Flow Builder
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Tap a card to preview, then apply — your choice updates the quiz blueprint above (we scroll you there).
          </p>
        </div>
        {appliedId && (
          <div className="flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Strategy: {strategyCards.find((s) => s.id === appliedId)?.title}
          </div>
        )}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3" data-testid="lesson-strategy-grid">
        {strategyCards.map((s) => {
          const isActive = activeId === s.id
          const Icon = s.Icon
          return (
            <button
              key={s.id}
              data-testid={`lesson-strategy-card-${s.id}`}
              onClick={() => {
                setActiveId(isActive ? null : s.id)
                onUserInteract?.()
              }}
              className={`rounded-2xl border-2 p-4 text-left transition-all ${
                isActive ? s.activeCls : s.cardCls
              }`}
            >
              <div
                className={`mb-2 inline-flex h-8 w-8 items-center justify-center rounded-xl ${s.iconCls}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <p className="font-semibold text-gray-900">{s.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-600">{s.description}</p>
            </button>
          )
        })}
      </div>

      {active && (
        <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-5 transition-all">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-900">
              Applied Strategy Preview — {active.title}
            </p>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${active.badgeCls}`}
            >
              Active
            </span>
          </div>

          <div className="grid gap-4 text-sm md:grid-cols-2">
            <DetailField label="Teaching mode" value={active.teaching_mode} />
            <DetailField label="Recommended quiz type" value={active.recommended_quiz_type} />
            <DetailField
              label="Suggested question mix"
              value={formatQuestionMix(active.base_question_mix)}
              wide
            />
            <DetailField label="Estimated classroom time" value={active.estimated_classroom_time} />
            <DetailField label="Recommended export format" value={active.recommended_export_format} />
            <DetailField
              label="Best use case"
              value={active.best_use_case}
              wide
            />
          </div>

          <div className="mt-4 rounded-xl border border-dashed border-gray-300 bg-white p-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Teacher prompt
            </p>
            <p className="italic text-gray-800">{active.teacher_prompt}</p>
          </div>

          <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
              Differentiation note
            </p>
            <p className="text-sm text-amber-900">{active.differentiation_note}</p>
          </div>

          <button
            onClick={handleApply}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
          >
            <ChevronRight className="h-4 w-4" />
            Apply Strategy to Quiz
          </button>
        </div>
      )}
    </div>
  )
}

function DetailField({
  label,
  value,
  wide = false,
}: {
  label: string
  value: string
  wide?: boolean
}) {
  return (
    <div className={wide ? 'md:col-span-2' : ''}>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-0.5 text-sm text-gray-800">{value}</p>
    </div>
  )
}
