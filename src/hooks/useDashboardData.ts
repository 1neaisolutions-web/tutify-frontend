import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { useTeacherToolsDemo } from '../pages/features/teacher-tools/TeacherToolsDemoProvider'
import { useGetStatsQuery } from '../redux/features/teacherTools/stats/statsApiSlice'

dayjs.extend(relativeTime)

export type ToolType = 'quiz' | 'assignment' | 'worksheet' | 'exam'

export interface DashboardItem {
  id: string
  title: string
  tool: ToolType
  status: string
  subject: string
  grade: string
  dueAt?: string | null
  updatedAt?: string | null
  createdAt?: string | null
  path: string
}

const TOOL_PATHS: Record<ToolType, string> = {
  quiz: '/teacher-tools/quiz',
  assignment: '/teacher-tools/assignment',
  worksheet: '/teacher-tools/worksheet',
  exam: '/teacher-tools/exams',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toItem(raw: any, tool: ToolType): DashboardItem {
  return {
    id: raw.id,
    title: raw.title ?? 'Untitled',
    tool,
    status: raw.status ?? 'draft',
    subject: raw.subject ?? '',
    grade: raw.grade ?? '',
    dueAt: raw.dueAt ?? raw.due_at ?? null,
    updatedAt: raw.updatedAt ?? raw.updated_at ?? null,
    createdAt: raw.createdAt ?? raw.created_at ?? null,
    path: `${TOOL_PATHS[tool]}/${raw.id}`,
  }
}

function computeStreak(items: DashboardItem[]): number {
  const active = new Set(
    items
      .map((i) => i.updatedAt || i.createdAt)
      .filter(Boolean)
      .map((d) => dayjs(d as string).format('YYYY-MM-DD')),
  )
  let streak = 0
  let day = dayjs().startOf('day')
  while (active.has(day.format('YYYY-MM-DD'))) {
    streak++
    day = day.subtract(1, 'day')
  }
  return streak
}

export function useDashboardData() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useSelector((s: any) => s.auth?.user)
  const { data: stats, isLoading: statsLoading } = useGetStatsQuery()
  const { allQuizzes, allAssignments, allWorksheets, allExams } = useTeacherToolsDemo()

  const allItems = useMemo<DashboardItem[]>(
    () => [
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...allQuizzes.map((q: any) => toItem(q, 'quiz')),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...allAssignments.map((a: any) => toItem(a, 'assignment')),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...allWorksheets.map((w: any) => toItem(w, 'worksheet')),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...allExams.map((e: any) => toItem(e, 'exam')),
    ],
    [allQuizzes, allAssignments, allWorksheets, allExams],
  )

  const recentActivity = useMemo(
    () =>
      [...allItems]
        .filter((i) => i.updatedAt || i.createdAt)
        .sort(
          (a, b) =>
            dayjs(b.updatedAt || b.createdAt).valueOf() - dayjs(a.updatedAt || a.createdAt).valueOf(),
        )
        .slice(0, 6),
    [allItems],
  )

  const upcomingDeadlines = useMemo(
    () =>
      allItems
        .filter((i) => {
          if (!i.dueAt || i.status === 'archived') return false
          const due = dayjs(i.dueAt)
          return due.isAfter(dayjs()) && due.isBefore(dayjs().add(7, 'day'))
        })
        .sort((a, b) => dayjs(a.dueAt!).valueOf() - dayjs(b.dueAt!).valueOf())
        .slice(0, 5),
    [allItems],
  )

  const draftItems = useMemo(
    () =>
      allItems
        .filter((i) => i.status === 'draft')
        .sort(
          (a, b) =>
            dayjs(b.updatedAt || b.createdAt).valueOf() - dayjs(a.updatedAt || a.createdAt).valueOf(),
        )
        .slice(0, 4),
    [allItems],
  )

  const streak = useMemo(() => computeStreak(allItems), [allItems])

  const thisWeekCount = useMemo(
    () =>
      allItems.filter((i) => dayjs(i.createdAt || i.updatedAt).isAfter(dayjs().subtract(7, 'day')))
        .length,
    [allItems],
  )

  const hour = dayjs().hour()
  const tod = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName =
    user?.first_name || user?.firstName || (user?.full_name ?? '').split(' ')[0] || 'Teacher'

  return {
    greeting: `${tod}, ${firstName}`,
    user,
    stats,
    statsLoading,
    allItems,
    recentActivity,
    upcomingDeadlines,
    draftItems,
    streak,
    thisWeekCount,
  }
}

