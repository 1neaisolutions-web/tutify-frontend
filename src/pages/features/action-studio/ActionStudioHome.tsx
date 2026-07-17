import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Rocket,
  ArrowRight,
  ClipboardList,
  CalendarClock,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Trash2,
  Clock,
} from 'lucide-react'
import type { SprintPlan } from './interventionSprintTypes'
import { deleteSprint, listSavedSprints } from './interventionSprintStorage'

const comingSoonModules = [
  {
    key: 'behavior',
    icon: ShieldCheck,
    title: 'Behavior Support Planner',
    description: 'Turn a behavior concern into a proactive, structured support plan.',
  },
  {
    key: 'attendance',
    icon: CalendarClock,
    title: 'Attendance Recovery Planner',
    description: 'Build a re-engagement plan for students missing consistent instruction.',
  },
  {
    key: 'assessment',
    icon: ClipboardList,
    title: 'Assessment Action Planner',
    description: 'Convert assessment results into a targeted follow-up plan.',
  },
  {
    key: 'family',
    icon: MessageCircle,
    title: 'Family Communication Planner',
    description: 'Draft a full communication sequence for an ongoing classroom concern.',
  },
]

function formatRelativeDate(iso: string): string {
  const date = new Date(iso)
  const diffMs = Date.now() - date.getTime()
  const diffMin = Math.round(diffMs / 60000)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.round(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.round(diffHr / 24)
  return `${diffDay}d ago`
}

const ActionStudioHome = () => {
  const [savedSprints, setSavedSprints] = useState<SprintPlan[]>([])

  useEffect(() => {
    setSavedSprints(listSavedSprints())
  }, [])

  const handleDelete = (id: string) => {
    deleteSprint(id)
    setSavedSprints(listSavedSprints())
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Teaching Action Studio</h1>
        <p className="mt-1 text-sm text-gray-600">
          Turn a real classroom problem into one complete, connected action plan.
        </p>
      </div>

      <Link
        to="/action-studio/intervention-sprint"
        className="group block rounded-3xl border border-gray-200 bg-gradient-to-r from-primary-600 via-primary-600 to-indigo-600 p-8 text-white shadow-lg transition hover:shadow-xl"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <Rocket className="h-7 w-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90">
                Flagship module
              </div>
              <h2 className="mt-2 text-xl font-semibold">Intervention Sprint Studio</h2>
              <p className="mt-1 max-w-xl text-sm text-white/85">
                Convert classroom evidence into a short, practical student-support plan: problem
                summary, goal, daily actions, differentiation, monitoring, teacher guidance, family
                communication, and an admin/MTSS summary — all in one connected plan.
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 self-start rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primary-600 shadow-sm transition group-hover:bg-primary-50 lg:self-center">
            Start a sprint
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </div>
        </div>
      </Link>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Coming soon</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {comingSoonModules.map((mod) => (
            <div
              key={mod.key}
              className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 p-5 opacity-75"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                <mod.icon className="h-5 w-5" />
              </div>
              <p className="mt-3 text-sm font-semibold text-gray-600">{mod.title}</p>
              <p className="mt-1 text-xs text-gray-500">{mod.description}</p>
              <span className="mt-3 inline-block rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                Coming soon
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">My sprints</h3>
        {savedSprints.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
            <Sparkles className="mx-auto h-6 w-6 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">
              No saved sprints yet. Start a sprint above and save it to see it here.
            </p>
          </div>
        ) : (
          <div className="mt-3 divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white">
            {savedSprints.map((sprint) => (
              <div key={sprint.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <Link
                  to={`/action-studio/intervention-sprint?sprintId=${sprint.id}`}
                  className="min-w-0 flex-1"
                >
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {sprint.context.topicOrSkill || 'Untitled sprint'}{' '}
                    <span className="font-normal text-gray-400">
                      · {sprint.context.durationDays}-day · {sprint.context.subject || 'General'}
                    </span>
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" /> Updated {formatRelativeDate(sprint.updatedAt)}
                  </p>
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(sprint.id)}
                  className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                  aria-label="Delete sprint"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ActionStudioHome
