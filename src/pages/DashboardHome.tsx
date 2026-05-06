import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {
  Flame,
  Layers,
  TrendingUp,
  FileEdit,
  CheckCircle,
  FileText,
  MessageSquare,
  Youtube,
  Image,
  BookOpen,
  History,
  ArrowRight,
  AlertCircle,
} from 'lucide-react'

import { useDashboardData, type DashboardItem } from '../hooks/useDashboardData'

dayjs.extend(relativeTime)

// ── Tool icon & colour map ────────────────────────────────────────────────────
const TOOL_META = {
  quiz: { label: 'Quiz', colour: 'blue' },
  assignment: { label: 'Assignment', colour: 'green' },
  worksheet: { label: 'Worksheet', colour: 'orange' },
  exam: { label: 'Exam', colour: 'purple' },
} as const

function ToolBadge({ tool }: { tool: DashboardItem['tool'] }) {
  const meta = TOOL_META[tool]
  const colours: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    orange: 'bg-orange-100 text-orange-700',
    purple: 'bg-purple-100 text-purple-700',
  }
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${colours[meta.colour]}`}>
      {meta.label}
    </span>
  )
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-600',
    published: 'bg-green-100 text-green-700',
    scheduled: 'bg-blue-100 text-blue-700',
    archived: 'bg-gray-100 text-gray-400',
  }
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${map[status] ?? map.draft}`}>{status}</span>
}

function DaysUntil({ dueAt }: { dueAt: string }) {
  const d = dayjs(dueAt).diff(dayjs(), 'day')
  const colour = d <= 1 ? 'text-red-600' : d <= 3 ? 'text-amber-600' : 'text-gray-500'
  return <span className={`text-xs font-medium ${colour}`}>{d === 0 ? 'today' : `${d}d`}</span>
}

function KPISkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="card animate-pulse">
          <div className="h-3 w-24 bg-gray-200 rounded mb-3" />
          <div className="h-8 w-12 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  )
}

const featureWorkflows = [
  { path: '/templates', icon: FileText, title: 'Templates Library', color: 'bg-blue-500' },
  { path: '/chatbots', icon: MessageSquare, title: 'Specialized Chatbots', color: 'bg-green-500' },
  { path: '/youtube-quiz', icon: Youtube, title: 'YouTube Quiz Generator', color: 'bg-red-500' },
  { path: '/pixgen', icon: Image, title: 'PixGen (AI Media Studio)', color: 'bg-purple-500' },
  { path: '/learning-hub', icon: BookOpen, title: 'Professional Learning Hub', color: 'bg-orange-500' },
  { path: '/history', icon: History, title: 'History & Personalisation', color: 'bg-indigo-500' },
]

const DashboardHome = () => {
  const { greeting, stats, statsLoading, recentActivity, upcomingDeadlines, draftItems, streak, thisWeekCount } =
    useDashboardData()

  const heroCTA = useMemo(() => {
    if (upcomingDeadlines.length > 0) {
      const first = upcomingDeadlines[0]
      return { label: `Due soon: ${first.title}`, path: first.path }
    }
    if (draftItems.length > 0) {
      return { label: `Continue: ${draftItems[0].title}`, path: draftItems[0].path }
    }
    return { label: 'Create your first quiz', path: '/teacher-tools/quiz/create' }
  }, [upcomingDeadlines, draftItems])

  return (
    <div className="space-y-8">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-500 to-indigo-500 p-8 text-white shadow-lg">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))]" />
        <div className="relative z-10 flex items-start justify-between">
          <div className="space-y-3 max-w-xl">
            <p className="text-white/60 text-sm">{dayjs().format('dddd, MMMM D')}</p>
            <h1 className="text-3xl font-bold">{greeting}</h1>
            <p className="text-white/80">
              {(stats?.summary.total_active ?? 0) > 0
                ? `You have ${stats?.summary.total_active} active content items across all tools.`
                : 'Your workspace is ready. Build your first piece of content to get started.'}
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                to={heroCTA.path}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-primary-600 shadow-sm hover:bg-primary-50"
              >
                {heroCTA.label} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/teacher-tools"
                className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                Teacher Tools overview
              </Link>
            </div>
          </div>
          {streak > 1 && (
            <div className="hidden lg:flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-3 text-white">
              <Flame className="h-6 w-6 text-orange-300" />
              <div>
                <p className="text-2xl font-bold leading-none">{streak}</p>
                <p className="text-xs text-white/70">day streak</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── KPI row ──────────────────────────────────────────────────────── */}
      {statsLoading ? (
        <KPISkeleton />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Content', value: stats?.summary.total_active ?? 0, icon: Layers, color: 'text-blue-600 bg-blue-100' },
            { label: 'This Week', value: thisWeekCount, icon: TrendingUp, color: 'text-green-600 bg-green-100' },
            { label: 'Draft Backlog', value: stats?.summary.total_draft ?? 0, icon: FileEdit, color: 'text-amber-600 bg-amber-100' },
            { label: 'Published', value: stats?.summary.total_published ?? 0, icon: CheckCircle, color: 'text-emerald-600 bg-emerald-100' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
                </div>
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Activity + Sidebar ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" /> Upcoming deadlines
              </h2>
              <Link to="/teacher-tools" className="text-sm font-semibold text-primary-600 hover:text-primary-500">
                View all
              </Link>
            </div>
            {upcomingDeadlines.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">No deadlines in the next 7 days.</p>
            ) : (
              <ul className="space-y-2">
                {upcomingDeadlines.map((item) => (
                  <li key={item.id}>
                    <Link to={item.path} className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition hover:bg-gray-50">
                      <ToolBadge tool={item.tool} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                        <p className="text-xs text-gray-500">
                          {item.subject} · {item.grade}
                        </p>
                      </div>
                      <DaysUntil dueAt={item.dueAt!} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Recent activity</h2>
            </div>
            {recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">No activity yet.</p>
                <Link to="/teacher-tools/quiz/create" className="mt-3 inline-block text-sm font-semibold text-primary-600 hover:text-primary-500">
                  Create your first quiz →
                </Link>
              </div>
            ) : (
              <ul className="space-y-1">
                {recentActivity.map((item) => (
                  <li key={item.id}>
                    <Link to={item.path} className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition hover:bg-gray-50">
                      <ToolBadge tool={item.tool} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                        <p className="text-xs text-gray-500">
                          {item.subject} · {item.grade}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <StatusPill status={item.status} />
                        <p className="text-xs text-gray-400 mt-0.5">{dayjs(item.updatedAt || item.createdAt).fromNow()}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <FileEdit className="h-4 w-4 text-gray-500" /> Drafts to finish
              </h2>
              <Link to="/teacher-tools" className="text-sm font-semibold text-primary-600 hover:text-primary-500">
                All
              </Link>
            </div>
            {draftItems.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">No drafts — you're all caught up!</p>
            ) : (
              <ul className="space-y-2">
                {draftItems.map((item) => (
                  <li key={item.id}>
                    <Link to={item.path} className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-gray-50 transition">
                      <ToolBadge tool={item.tool} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                        <p className="text-xs text-gray-400">{dayjs(item.updatedAt || item.createdAt).fromNow()}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* ── Core workflows (navigation, no data needed) ───────────────────── */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Core workflows</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureWorkflows.map(({ path, icon: Icon, title, color }) => (
            <Link key={path} to={path} className="card hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-4">
                <div className={`${color} w-11 h-11 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{title}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default DashboardHome
