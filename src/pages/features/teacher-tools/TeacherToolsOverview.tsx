import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart3,
  Calendar,
  CalendarClock,
  ClipboardCheck,
  ClipboardList,
  ChevronRight,
  FileText,
  GraduationCap,
  Layers,
  Plus,
  Sparkles,
  TrendingUp,
  Wrench,
} from 'lucide-react'
import {
  CardGridSkeleton,
  SimpleBarChart,
} from './components'
import { SUBJECTS } from './types'
import { useTeacherToolsDemo } from './TeacherToolsDemoProvider'
import { useGetStatsQuery } from '../../../redux/features/teacherTools/stats/statsApiSlice'

function draftEditPath(tool: string, id: string): string {
  switch (tool) {
    case 'Quiz':
      return `/teacher-tools/quiz/${id}/edit`
    case 'Worksheet':
      return `/teacher-tools/worksheet/${id}/edit`
    case 'Assignment':
      return `/teacher-tools/assignment/${id}/edit`
    case 'Exam':
      return `/teacher-tools/exams/${id}/edit`
    default:
      return '/teacher-tools'
  }
}

function isAssignmentLive(status: string): boolean {
  return status === 'active' || status === 'pending_review' || status === 'graded'
}

type ToolKind = 'Quiz' | 'Assignment' | 'Worksheet' | 'Exam'

function contentDetailPath(tool: ToolKind, id: string): string {
  switch (tool) {
    case 'Quiz':
      return `/teacher-tools/quiz/${id}`
    case 'Assignment':
      return `/teacher-tools/assignment/${id}`
    case 'Worksheet':
      return `/teacher-tools/worksheet/${id}`
    case 'Exam':
      return `/teacher-tools/exams/${id}`
    default:
      return '/teacher-tools'
  }
}

function formatRelativeActivity(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const now = Date.now()
  const diffMs = now - d.getTime()
  const absSec = Math.abs(Math.floor(diffMs / 1000))
  if (diffMs < 0) {
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined })
  }
  if (absSec < 45) return 'Just now'
  if (absSec < 3600) return `${Math.floor(absSec / 60)}m ago`
  if (absSec < 86400) return `${Math.floor(absSec / 3600)}h ago`
  const diffDays = Math.floor(absSec / 86400)
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function deadlineUrgency(dateYmd: string): { headline: string; tone: 'soon' | 'week' | 'later' } {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(`${dateYmd}T12:00:00`)
  const diffDays = Math.round((target.getTime() - today.getTime()) / 86400000)
  if (diffDays === 0) return { headline: 'Today', tone: 'soon' }
  if (diffDays === 1) return { headline: 'Tomorrow', tone: 'soon' }
  if (diffDays <= 3) return { headline: `In ${diffDays} days`, tone: 'soon' }
  if (diffDays <= 14) return { headline: `In ${diffDays} days`, tone: 'week' }
  return {
    headline: target.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
    tone: 'later',
  }
}

const TOOL_ACCENTS: Record<
  ToolKind,
  { Icon: typeof ClipboardList; chip: string; rail: string; softBg: string }
> = {
  Quiz: {
    Icon: ClipboardList,
    chip: 'bg-indigo-50 text-indigo-800 ring-1 ring-indigo-200/70',
    rail: 'bg-indigo-500',
    softBg: 'bg-indigo-500/10',
  },
  Assignment: {
    Icon: FileText,
    chip: 'bg-violet-50 text-violet-800 ring-1 ring-violet-200/70',
    rail: 'bg-violet-500',
    softBg: 'bg-violet-500/10',
  },
  Worksheet: {
    Icon: Layers,
    chip: 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/70',
    rail: 'bg-emerald-500',
    softBg: 'bg-emerald-500/10',
  },
  Exam: {
    Icon: GraduationCap,
    chip: 'bg-amber-50 text-amber-900 ring-1 ring-amber-200/80',
    rail: 'bg-amber-500',
    softBg: 'bg-amber-500/10',
  },
}

export default function TeacherToolsOverview() {
  const { allQuizzes, allAssignments, allWorksheets, allExams } = useTeacherToolsDemo()
  const { data: stats, isLoading: statsLoading } = useGetStatsQuery()

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), [])

  const kpis = useMemo(() => {
    const totalActive =
      stats?.summary.total_active ??
      allQuizzes.filter((q) => q.status !== 'archived').length +
        allAssignments.filter((a) => a.status !== 'archived').length +
        allWorksheets.filter((w) => w.status !== 'archived').length +
        allExams.filter((e) => e.status !== 'archived').length

    const totalDraft =
      stats?.summary.total_draft ??
      [
        ...allQuizzes,
        ...allAssignments,
        ...allWorksheets,
        ...allExams,
      ].filter((x) => x.status === 'draft').length

    const scheduledThisWeek = stats?.summary.scheduled_this_week ?? 0

    const totalPublished =
      stats?.summary.total_published ??
      allQuizzes.filter((q) => q.status === 'published' || q.status === 'scheduled').length +
        allAssignments.filter((a) => isAssignmentLive(a.status)).length +
        allWorksheets.filter((w) => w.status === 'published').length +
        allExams.filter((e) => e.status === 'scheduled' || e.status === 'completed').length

    const scoredQuizzes = allQuizzes.filter((q) => q.submissionCount > 0 && q.avgScore > 0)
    const avgScore = scoredQuizzes.length
      ? Math.round(scoredQuizzes.reduce((sum, q) => sum + q.avgScore, 0) / scoredQuizzes.length)
      : null

    return { totalActive, totalDraft, scheduledThisWeek, totalPublished, avgScore }
  }, [stats, allQuizzes, allAssignments, allWorksheets, allExams])

  type FeedItem = {
    id: string
    contentId: string
    tool: ToolKind
    title: string
    actionLabel: string
    subject: string
    grade: string
    classKey: string
    type: string
    activityDate: string
  }

  const liveActivityFeed = useMemo((): FeedItem[] => {
    const entries: FeedItem[] = []

    allQuizzes.forEach((q) => {
      const d = q.updatedAt ?? q.createdAt ?? q.assignedAt ?? ''
      if (!d) return
      const actionLabel =
        q.status === 'draft'
          ? 'Saved as draft'
          : q.status === 'published'
            ? 'Published'
            : q.status === 'scheduled'
              ? 'Scheduled'
              : q.status === 'archived'
                ? 'Archived'
                : 'Updated'
      const actType =
        q.status === 'draft' ? 'created' : q.status === 'scheduled' ? 'scheduled' : 'published'
      entries.push({
        id: `quiz-${q.id}`,
        contentId: q.id,
        tool: 'Quiz',
        title: q.title,
        actionLabel,
        subject: q.subject,
        grade: q.grade,
        classKey: q.classes?.[0] ?? '',
        type: actType,
        activityDate: d,
      })
    })

    allAssignments.forEach((a) => {
      const d = a.updatedAt ?? a.createdAt ?? (a.dueAt ? `${a.dueAt}T12:00:00.000Z` : '')
      if (!d) return
      const actionLabel =
        a.status === 'draft'
          ? 'Saved as draft'
          : isAssignmentLive(a.status)
            ? 'Live'
            : a.status === 'archived'
              ? 'Archived'
              : 'Updated'
      entries.push({
        id: `asgn-${a.id}`,
        contentId: a.id,
        tool: 'Assignment',
        title: a.title,
        actionLabel,
        subject: a.subject,
        grade: a.grade,
        classKey: a.classes?.[0] ?? '',
        type: a.status === 'draft' ? 'created' : 'published',
        activityDate: d,
      })
    })

    allWorksheets.forEach((w) => {
      const d = w.createdAt ?? ''
      if (!d) return
      const actionLabel =
        w.status === 'draft'
          ? 'Saved as draft'
          : w.status === 'published'
            ? 'Published'
            : w.status === 'archived'
              ? 'Archived'
              : 'Updated'
      entries.push({
        id: `ws-${w.id}`,
        contentId: w.id,
        tool: 'Worksheet',
        title: w.title,
        actionLabel,
        subject: w.subject,
        grade: w.grade,
        classKey: w.classes?.[0] ?? '',
        type: w.status === 'draft' ? 'created' : w.status === 'published' ? 'published' : 'published',
        activityDate: d,
      })
    })

    allExams.forEach((e) => {
      const d = e.scheduleStart ?? ''
      if (!d) return
      const actionLabel =
        e.status === 'draft'
          ? 'Saved as draft'
          : e.status === 'scheduled'
            ? 'Scheduled'
            : e.status === 'archived'
              ? 'Archived'
              : 'Updated'
      entries.push({
        id: `exam-${e.id}`,
        contentId: e.id,
        tool: 'Exam',
        title: e.title,
        actionLabel,
        subject: e.subject,
        grade: e.grade,
        classKey: e.classes?.[0] ?? '',
        type: e.status === 'draft' ? 'created' : e.status === 'scheduled' ? 'scheduled' : 'published',
        activityDate: d,
      })
    })

    return entries.sort((a, b) => b.activityDate.localeCompare(a.activityDate)).slice(0, 20)
  }, [allQuizzes, allAssignments, allWorksheets, allExams])

  const visibleFeed = liveActivityFeed

  type DeadlineItem = {
    id: string
    contentId: string
    title: string
    date: string
    tool: ToolKind
    subject: string
    grade: string
    classKey: string
  }

  const liveDeadlines = useMemo((): DeadlineItem[] => {
    const items: DeadlineItem[] = []

    allQuizzes.forEach((q) => {
      if (q.dueAt && q.dueAt.slice(0, 10) >= todayStr) {
        items.push({
          id: `quiz-dl-${q.id}`,
          contentId: q.id,
          title: q.title,
          date: q.dueAt.slice(0, 10),
          tool: 'Quiz',
          subject: q.subject,
          grade: q.grade,
          classKey: q.classes?.[0] ?? '',
        })
      }
    })

    allAssignments.forEach((a) => {
      if (a.dueAt && a.dueAt.slice(0, 10) >= todayStr) {
        items.push({
          id: `asgn-dl-${a.id}`,
          contentId: a.id,
          title: a.title,
          date: a.dueAt.slice(0, 10),
          tool: 'Assignment',
          subject: a.subject,
          grade: a.grade,
          classKey: a.classes?.[0] ?? '',
        })
      }
    })

    allExams.forEach((e) => {
      if (e.scheduleStart && e.scheduleStart.slice(0, 10) >= todayStr) {
        items.push({
          id: `exam-dl-${e.id}`,
          contentId: e.id,
          title: e.title,
          date: e.scheduleStart.slice(0, 10),
          tool: 'Exam',
          subject: e.subject,
          grade: e.grade,
          classKey: e.classes?.[0] ?? '',
        })
      }
    })

    return items.sort((a, b) => a.date.localeCompare(b.date)).slice(0, 10)
  }, [allQuizzes, allAssignments, allExams, todayStr])

  const visibleDeadlines = liveDeadlines

  type DraftItem = {
    id: string
    title: string
    tool: string
    subject: string
    grade: string
    classKey: string
    updated: string
  }

  const liveDrafts = useMemo((): DraftItem[] => {
    const items: DraftItem[] = [
      ...allQuizzes
        .filter((q) => q.status === 'draft')
        .map((q) => ({
          id: q.id,
          title: q.title,
          tool: 'Quiz',
          subject: q.subject,
          grade: q.grade,
          classKey: q.classes?.[0] ?? '',
          updated: q.updatedAt ?? q.createdAt ?? '',
        })),
      ...allAssignments
        .filter((a) => a.status === 'draft')
        .map((a) => ({
          id: a.id,
          title: a.title,
          tool: 'Assignment',
          subject: a.subject,
          grade: a.grade,
          classKey: a.classes?.[0] ?? '',
          updated: a.updatedAt ?? a.createdAt ?? '',
        })),
      ...allWorksheets
        .filter((w) => w.status === 'draft')
        .map((w) => ({
          id: w.id,
          title: w.title,
          tool: 'Worksheet',
          subject: w.subject,
          grade: w.grade,
          classKey: w.classes?.[0] ?? '',
          updated: w.createdAt ?? '',
        })),
      ...allExams
        .filter((e) => e.status === 'draft')
        .map((e) => ({
          id: e.id,
          title: e.title,
          tool: 'Exam',
          subject: e.subject,
          grade: e.grade,
          classKey: e.classes?.[0] ?? '',
          updated: e.scheduleStart ?? '',
        })),
    ]
    return items.sort((a, b) => b.updated.localeCompare(a.updated))
  }, [allQuizzes, allAssignments, allWorksheets, allExams])

  const visibleDrafts = liveDrafts

  const liveToolPoints = useMemo(() => {
    const quizCount = stats?.quizzes.total ?? allQuizzes.length
    const assignCount = stats?.assignments.total ?? allAssignments.length
    const wsCount = stats?.worksheets.total ?? allWorksheets.length
    const examCount = stats?.exams.total ?? allExams.length
    const max = Math.max(quizCount, assignCount, wsCount, examCount, 1)
    return [
      { label: 'Quiz', value: quizCount, max, colorClass: 'bg-indigo-500' },
      { label: 'Assign', value: assignCount, max, colorClass: 'bg-violet-500' },
      { label: 'Sheet', value: wsCount, max, colorClass: 'bg-emerald-500' },
      { label: 'Exam', value: examCount, max, colorClass: 'bg-amber-500' },
    ]
  }, [stats, allQuizzes, allAssignments, allWorksheets, allExams])

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-800 via-primary-800 to-indigo-900 px-8 py-10 text-white shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90">
              <Wrench className="h-4 w-4" /> Teacher Tools
            </div>
            <h1 className="text-3xl font-semibold leading-tight">Your teaching content command center</h1>
            <p className="text-sm text-white/80">
              Create, assign, and analyze quizzes, assignments, worksheets, and exams — with a workflow built for
              international schools and multi-class teaching.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/teacher-tools/quiz/create"
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary-900 shadow hover:bg-gray-100"
              >
                <Plus className="h-4 w-4" /> Create Quiz
              </Link>
              <Link
                to="/teacher-tools/assignment/create"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
              >
                Create Assignment
              </Link>
              <Link
                to="/teacher-tools/worksheet/create"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
              >
                Create Worksheet
              </Link>
              <Link
                to="/teacher-tools/exams/create"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
              >
                Create Exam
              </Link>
            </div>
          </div>
          <div className="grid w-full max-w-sm gap-3 rounded-2xl bg-white/10 p-5 backdrop-blur">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">Pending drafts</span>
              <span className="text-2xl font-semibold">{statsLoading ? '…' : kpis.totalDraft}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">Published items</span>
              <span className="text-2xl font-semibold">{statsLoading ? '…' : kpis.totalPublished}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          <span className="rounded-full bg-gray-100 px-2 py-1">Live</span>
          <span>{SUBJECTS.length} subjects supported</span>
        </div>
        <div className="text-xs text-gray-500">Overview shows your latest content activity and upcoming dates.</div>
      </div>

      {statsLoading && <CardGridSkeleton n={6} />}

      {!statsLoading && (
        <>
          <p className="text-xs text-gray-500">Global metrics — not narrowed by filters below.</p>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              { label: 'Total active items', value: kpis.totalActive, icon: Layers },
              { label: 'Scheduled this week', value: kpis.scheduledThisWeek, icon: Calendar },
              { label: 'Pending drafts', value: kpis.totalDraft, icon: ClipboardCheck },
              { label: 'Published items', value: kpis.totalPublished, icon: TrendingUp },
              { label: 'Avg quiz score', value: kpis.avgScore !== null ? `${kpis.avgScore}%` : '—', icon: BarChart3 },
              { label: 'Quizzes taken', value: allQuizzes.filter((q) => q.submissionCount > 0).length, icon: Sparkles },
            ].map((k) => (
              <div key={k.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{k.label}</p>
                  <k.icon className="h-5 w-5 text-primary-500" />
                </div>
                <p className="mt-3 text-2xl font-semibold text-gray-900">{k.value}</p>
              </div>
            ))}
          </section>
        </>
      )}

      <SimpleBarChart
        title="Tool library"
        subtitle="Total items created per tool"
        points={liveToolPoints}
      />

      <p className="text-xs font-medium text-gray-600">
        Latest activity and upcoming dates from your library
      </p>
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-gray-200/90 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.06)] ring-1 ring-black/[0.04]">
          <div className="border-b border-gray-100 bg-gradient-to-br from-slate-50/90 via-white to-primary-50/30 px-5 py-4 sm:px-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-700 text-white shadow-md shadow-primary-700/25">
                  <Sparkles className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className="text-base font-semibold tracking-tight text-gray-900">Recent activity</h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                    Live from your library — opens the item. Filter by type above.
                  </p>
                </div>
              </div>
              {visibleFeed.length > 0 && (
                <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-600 shadow-sm ring-1 ring-gray-200/80">
                  {visibleFeed.length}
                </span>
              )}
            </div>
          </div>
          <div className="p-3 sm:p-4">
            <ul className="space-y-1">
              {visibleFeed.map((a) => {
                const acc = TOOL_ACCENTS[a.tool]
                const Icon = acc.Icon
                const rel = formatRelativeActivity(a.activityDate)
                return (
                  <li key={a.id}>
                    <Link
                      to={contentDetailPath(a.tool, a.contentId)}
                      className="group flex gap-3 rounded-2xl border border-transparent px-2 py-2.5 transition-colors hover:border-gray-200/90 hover:bg-gray-50/95"
                    >
                      <span
                        className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${acc.softBg}`}
                        aria-hidden
                      >
                        <Icon className="h-5 w-5 text-gray-800/90" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate font-medium leading-snug text-gray-900 group-hover:text-primary-800">{a.title}</p>
                          <time
                            className="shrink-0 text-[11px] font-medium tabular-nums text-gray-400"
                            dateTime={a.activityDate}
                          >
                            {rel}
                          </time>
                        </div>
                        <p className="mt-0.5 truncate text-xs text-gray-500">
                          {[a.subject, a.grade].filter(Boolean).join(' · ')}
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${acc.chip}`}
                          >
                            {a.tool}
                          </span>
                          <span className="text-[11px] text-gray-500">{a.actionLabel}</span>
                        </div>
                      </div>
                      <ChevronRight
                        className="mt-2.5 h-4 w-4 shrink-0 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-primary-500"
                        aria-hidden
                      />
                    </Link>
                  </li>
                )
              })}
            </ul>
            {visibleFeed.length === 0 &&
              (liveActivityFeed.length === 0 ? (
                <div className="flex flex-col items-center px-4 py-14 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 text-gray-400 ring-1 ring-gray-200/80">
                    <ClipboardCheck className="h-8 w-8" aria-hidden />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">Your timeline is ready</p>
                  <p className="mt-2 max-w-[260px] text-xs leading-relaxed text-gray-500">
                    Saves, publishes, and schedules will appear here as you work — tied to each quiz, assignment, worksheet, and
                    exam.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center px-4 py-12 text-center">
                  <div className="mb-3 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-800 ring-1 ring-amber-200/70">
                    No matches
                  </div>
                  <p className="max-w-xs text-sm text-gray-600">
                    No activity items available right now.
                  </p>
                </div>
              ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-gray-200/90 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.06)] ring-1 ring-black/[0.04]">
          <div className="border-b border-gray-100 bg-gradient-to-br from-slate-50/90 via-white to-violet-50/25 px-5 py-4 sm:px-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-md shadow-violet-700/20">
                  <CalendarClock className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className="text-base font-semibold tracking-tight text-gray-900">Upcoming deadlines</h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                    Due dates and scheduled exams — soon worksheet due dates too.
                  </p>
                </div>
              </div>
              {visibleDeadlines.length > 0 && (
                <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-600 shadow-sm ring-1 ring-gray-200/80">
                  {visibleDeadlines.length}
                </span>
              )}
            </div>
          </div>
          <div className="p-3 sm:p-4">
            <ul className="space-y-1">
              {visibleDeadlines.map((d) => {
                const acc = TOOL_ACCENTS[d.tool]
                const Icon = acc.Icon
                const urg = deadlineUrgency(d.date)
                const urgencyRing =
                  urg.tone === 'soon'
                    ? 'bg-amber-50 text-amber-950 ring-amber-200/90'
                    : urg.tone === 'week'
                      ? 'bg-violet-50 text-violet-950 ring-violet-200/80'
                      : 'bg-gray-50 text-gray-700 ring-gray-200/80'
                return (
                  <li key={d.id}>
                    <Link
                      to={contentDetailPath(d.tool, d.contentId)}
                      className="group flex gap-3 rounded-2xl border border-transparent px-2 py-2.5 transition-colors hover:border-gray-200/90 hover:bg-gray-50/95"
                    >
                      <span
                        className={`mt-0.5 flex w-1 shrink-0 self-stretch rounded-full ${acc.rail}`}
                        aria-hidden
                      />
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${acc.softBg}`}>
                        <Icon className="h-5 w-5 text-gray-800/90" aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate font-medium leading-snug text-gray-900 group-hover:text-primary-800">{d.title}</p>
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${urgencyRing}`}
                          >
                            {urg.headline}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-xs text-gray-500">
                          {[d.subject, d.grade].filter(Boolean).join(' · ')}
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          <span className={`text-[10px] font-semibold uppercase tracking-wide ${acc.chip} rounded-full px-2 py-0.5`}>
                            {d.tool}
                          </span>
                          <span className="text-[11px] tabular-nums text-gray-500">{d.date}</span>
                        </div>
                      </div>
                      <ChevronRight
                        className="mt-2.5 h-4 w-4 shrink-0 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-primary-500"
                        aria-hidden
                      />
                    </Link>
                  </li>
                )
              })}
            </ul>
            {visibleDeadlines.length === 0 &&
              (liveDeadlines.length === 0 ? (
                <div className="flex flex-col items-center px-4 py-14 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-white text-emerald-600 ring-1 ring-emerald-200/70">
                    <Calendar className="h-8 w-8" aria-hidden />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">No upcoming dates</p>
                  <p className="mt-2 max-w-[260px] text-xs leading-relaxed text-gray-500">
                    Add due dates on quizzes and assignments or schedule exams — they roll up here in chronological order.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center px-4 py-12 text-center">
                  <div className="mb-3 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-800 ring-1 ring-amber-200/70">
                    No matches
                  </div>
                  <p className="max-w-xs text-sm text-gray-600">
                    No deadlines available right now.
                  </p>
                </div>
              ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent hand-ins</h3>
            <p className="mt-0.5 text-xs text-gray-500">Student submission tracking.</p>
          </div>
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">Phase 2</span>
        </div>
        <p className="mt-3 text-sm text-gray-500">
          When students submit quizzes, assignments, worksheets, and exams, their hand-ins appear here. Student-facing portal
          coming in Phase 2.
        </p>
      </section>

      <section className="grid gap-6">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Continue editing</h3>
          <p className="mt-0.5 text-xs text-gray-500">Drafts in your library — opens the editor.</p>
          <ul className="mt-4 space-y-2">
            {visibleDrafts.map((d) => (
              <li key={`${d.tool}-${d.id}`}>
                <Link
                  to={draftEditPath(d.tool, d.id)}
                  className="flex items-center justify-between rounded-xl border border-dashed border-gray-200 px-3 py-2 text-sm hover:border-primary-300 hover:bg-primary-50/40"
                >
                  <span>
                    <span className="font-medium text-gray-900">{d.title}</span>
                    <span className="ml-2 text-xs text-gray-500">{d.tool}</span>
                  </span>
                  <span className="text-xs text-gray-500">{d.updated || '—'}</span>
                </Link>
              </li>
            ))}
          </ul>
              {visibleDrafts.length === 0 && (
            <p className="mt-2 text-sm text-gray-500">No drafts match these filters.</p>
          )}
        </div>
      </section>
    </div>
  )
}
