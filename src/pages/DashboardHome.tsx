import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { formatDate } from '../lib/i18n/format'
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
  quiz: { i18nKey: 'dashboard.tools.quiz', colour: 'blue' },
  assignment: { i18nKey: 'dashboard.tools.assignment', colour: 'green' },
  worksheet: { i18nKey: 'dashboard.tools.worksheet', colour: 'orange' },
  exam: { i18nKey: 'dashboard.tools.exam', colour: 'purple' },
} as const

function ToolBadge({ tool }: { tool: DashboardItem['tool'] }) {
  const { t } = useTranslation()
  const meta = TOOL_META[tool]
  const colours: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    orange: 'bg-orange-100 text-orange-700',
    purple: 'bg-purple-100 text-purple-700',
  }
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${colours[meta.colour]}`}>
      {t(meta.i18nKey)}
    </span>
  )
}

function StatusPill({ status }: { status: string }) {
  const { t } = useTranslation()
  const map: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-600',
    published: 'bg-green-100 text-green-700',
    scheduled: 'bg-blue-100 text-blue-700',
    archived: 'bg-gray-100 text-gray-400',
  }
  const statusKey = `status.${status}` as const
  const label = t(statusKey, { defaultValue: status })
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${map[status] ?? map.draft}`}>{label}</span>
}

function DaysUntil({ dueAt }: { dueAt: string }) {
  const { t } = useTranslation()
  const d = dayjs(dueAt).diff(dayjs(), 'day')
  const colour = d <= 1 ? 'text-red-600' : d <= 3 ? 'text-amber-600' : 'text-gray-500'
  return (
    <span className={`text-xs font-medium ${colour}`}>
      {d === 0 ? t('dashboard.dueToday') : t('dashboard.dueInDays', { count: d })}
    </span>
  )
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
  { path: '/templates', icon: FileText, i18nKey: 'nav.templates', color: 'bg-blue-500' },
  { path: '/chatbots', icon: MessageSquare, i18nKey: 'nav.chatbots', color: 'bg-green-500' },
  { path: '/youtube-quiz', icon: Youtube, i18nKey: 'nav.youtubeQuiz', color: 'bg-red-500' },
  { path: '/pixgen', icon: Image, i18nKey: 'nav.pixgen', color: 'bg-purple-500' },
  { path: '/learning-hub', icon: BookOpen, i18nKey: 'nav.learningHub', color: 'bg-orange-500' },
  { path: '/history', icon: History, i18nKey: 'nav.history', color: 'bg-indigo-500' },
]

const DashboardHome = () => {
  const { t } = useTranslation()
  const { user, stats, statsLoading, recentActivity, upcomingDeadlines, draftItems, streak, thisWeekCount } =
    useDashboardData()

  const greeting = useMemo(() => {
    const hour = dayjs().hour()
    const key =
      hour < 12
        ? 'dashboard.greetingMorning'
        : hour < 17
          ? 'dashboard.greetingAfternoon'
          : 'dashboard.greetingEvening'
    const firstName =
      user?.first_name ||
      user?.firstName ||
      (user?.full_name ?? '').split(' ')[0] ||
      t('dashboard.defaultName')
    return t(key, { name: firstName })
  }, [user, t])

  const heroCTA = useMemo(() => {
    if (upcomingDeadlines.length > 0) {
      const first = upcomingDeadlines[0]
      return { label: t('dashboard.dueSoon', { title: first.title }), path: first.path }
    }
    if (draftItems.length > 0) {
      return { label: t('dashboard.continueDraft', { title: draftItems[0].title }), path: draftItems[0].path }
    }
    return { label: t('dashboard.createFirstQuiz'), path: '/teacher-tools/quiz/create' }
  }, [upcomingDeadlines, draftItems, t])

  return (
    <div className="space-y-8">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-500 to-indigo-500 p-8 text-white shadow-lg">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))]" />
        <div className="relative z-10 flex items-start justify-between">
          <div className="space-y-3 max-w-xl">
            <p className="text-white/60 text-sm">
              {formatDate(new Date(), { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h1 className="text-3xl font-bold">{greeting}</h1>
            <p className="text-white/80">
              {(stats?.summary.total_active ?? 0) > 0
                ? t('dashboard.activeContent', { count: stats?.summary.total_active ?? 0 })
                : t('dashboard.workspaceReady')}
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
                {t('dashboard.teacherToolsOverview')}
              </Link>
            </div>
          </div>
          {streak > 1 && (
            <div className="hidden lg:flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-3 text-white">
              <Flame className="h-6 w-6 text-orange-300" />
              <div>
                <p className="text-2xl font-bold leading-none">{streak}</p>
                <p className="text-xs text-white/70">{t('dashboard.dayStreak')}</p>
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
            { labelKey: 'dashboard.totalContent', value: stats?.summary.total_active ?? 0, icon: Layers, color: 'text-blue-600 bg-blue-100' },
            { labelKey: 'dashboard.thisWeek', value: thisWeekCount, icon: TrendingUp, color: 'text-green-600 bg-green-100' },
            { labelKey: 'dashboard.draftBacklog', value: stats?.summary.total_draft ?? 0, icon: FileEdit, color: 'text-amber-600 bg-amber-100' },
            { labelKey: 'dashboard.published', value: stats?.summary.total_published ?? 0, icon: CheckCircle, color: 'text-emerald-600 bg-emerald-100' },
          ].map(({ labelKey, value, icon: Icon, color }) => (
            <div key={labelKey} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t(labelKey)}</p>
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
                <AlertCircle className="h-4 w-4 text-amber-500" /> {t('dashboard.upcomingDeadlines')}
              </h2>
              <Link to="/teacher-tools" className="text-sm font-semibold text-primary-600 hover:text-primary-500">
                {t('dashboard.viewAll')}
              </Link>
            </div>
            {upcomingDeadlines.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">{t('dashboard.noDeadlines')}</p>
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
              <h2 className="font-semibold text-gray-900">{t('dashboard.recentActivity')}</h2>
            </div>
            {recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">{t('dashboard.noActivity')}</p>
                <Link to="/teacher-tools/quiz/create" className="mt-3 inline-block text-sm font-semibold text-primary-600 hover:text-primary-500">
                  {t('dashboard.createFirstQuizCta')}
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
                <FileEdit className="h-4 w-4 text-gray-500" /> {t('dashboard.draftsToFinish')}
              </h2>
              <Link to="/teacher-tools" className="text-sm font-semibold text-primary-600 hover:text-primary-500">
                {t('dashboard.all')}
              </Link>
            </div>
            {draftItems.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">{t('dashboard.noDrafts')}</p>
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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('dashboard.coreWorkflows')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureWorkflows.map(({ path, icon: Icon, i18nKey, color }) => (
            <Link key={path} to={path} className="card hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-4">
                <div className={`${color} w-11 h-11 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{t(i18nKey)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default DashboardHome
