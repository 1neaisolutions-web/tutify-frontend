import { useMemo } from 'react'
import { BarChart3, Download } from 'lucide-react'
import {
  ChartSkeleton,
  SimpleBarChart,
  TeacherToolsPageHeader,
} from '../components'
import { useTeacherToolsDemo } from '../TeacherToolsDemoProvider'
import { useGetStatsQuery } from '../../../../redux/features/teacherTools/stats/statsApiSlice'
// @ts-expect-error — JS module
import { useSnackbar } from '../../../../hooks/useSnackbar'

export default function TeacherToolsUnifiedAnalytics() {
  const { toast } = useSnackbar()
  const { data: stats, isLoading } = useGetStatsQuery()
  const { allQuizzes, allAssignments, allWorksheets, allExams } = useTeacherToolsDemo()
  const showInsights = false

  const statCards = useMemo(() => {
    const total =
      stats?.summary.total_active ??
      allQuizzes.length + allAssignments.length + allWorksheets.length + allExams.length
    const drafts = stats?.summary.total_draft ?? 0
    const scoredQuizzes = allQuizzes.filter((q) => q.submissionCount > 0 && q.avgScore > 0)
    const avgScore = scoredQuizzes.length
      ? `${Math.round(scoredQuizzes.reduce((s, q) => s + q.avgScore, 0) / scoredQuizzes.length)}%`
      : '—'
    const workload: string = drafts > 20 ? 'High' : drafts > 8 ? 'Medium' : 'Low'
    return [
      { label: 'Content created', value: String(total) },
      { label: 'Pending drafts', value: String(drafts) },
      { label: 'Avg quiz score', value: avgScore },
      { label: 'Review workload', value: workload },
    ]
  }, [stats, allQuizzes, allAssignments, allWorksheets, allExams])

  const toolPoints = useMemo(() => {
    const counts = [
      { label: 'Quiz', value: stats?.quizzes.total ?? allQuizzes.length, colorClass: 'bg-indigo-500' },
      { label: 'Assign', value: stats?.assignments.total ?? allAssignments.length, colorClass: 'bg-violet-500' },
      { label: 'Sheet', value: stats?.worksheets.total ?? allWorksheets.length, colorClass: 'bg-emerald-500' },
      { label: 'Exam', value: stats?.exams.total ?? allExams.length, colorClass: 'bg-amber-500' },
    ]
    const max = Math.max(...counts.map((c) => c.value), 1)
    return counts.map((c) => ({ ...c, max }))
  }, [stats, allQuizzes, allAssignments, allWorksheets, allExams])

  const handleExport = () => {
    if (!stats) {
      toast.error('Stats not loaded yet')
      return
    }
    const rows: (string | number)[][] = [
      ['Tool', 'Total', 'Draft', 'Published', 'Archived'],
      ['Quiz', stats.quizzes.total, stats.quizzes.draft, stats.quizzes.published, stats.quizzes.archived],
      [
        'Assignment',
        stats.assignments.total,
        stats.assignments.draft,
        stats.assignments.published,
        stats.assignments.archived,
      ],
      [
        'Worksheet',
        stats.worksheets.total,
        stats.worksheets.draft,
        stats.worksheets.published,
        stats.worksheets.archived,
      ],
      [
        'Exam',
        stats.exams.total,
        stats.exams.draft,
        (stats.exams.scheduled ?? 0) + (stats.exams.completed ?? 0),
        stats.exams.archived,
      ],
      [],
      ['Summary', ''],
      ['Total active', stats.summary.total_active],
      ['Total published', stats.summary.total_published],
      ['Drafts pending', stats.summary.total_draft],
      ['Scheduled this week', stats.summary.scheduled_this_week],
      ['Published last 30d', stats.summary.published_last_30d],
    ]
    const csv = rows.map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `teacher-tools-stats-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('CSV downloaded')
  }

  return (
    <div className="space-y-8">
      <TeacherToolsPageHeader
        title="Teacher Tools analytics"
        subtitle="Cross-tool performance, grading workload, and exportable reports."
        breadcrumbs={[{ label: 'Teacher Tools', to: '/teacher-tools' }, { label: 'Analytics' }]}
        actions={
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white"
          >
            <Download className="h-4 w-4" /> Export report
          </button>
        }
      />

      {isLoading && <ChartSkeleton />}

      {!isLoading && (
        <>
          <p className="text-xs text-gray-500">Figures below are drawn from your live content library.</p>

          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((k) => (
              <div key={k.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase text-gray-500">{k.label}</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">{k.value}</p>
              </div>
            ))}
          </section>

          <SimpleBarChart title="Tool library" subtitle="Total items created per tool" points={toolPoints} />

          {showInsights && (
            <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <BarChart3 className="h-4 w-4" /> Productivity
              </div>
              <p className="mt-2 text-sm text-gray-700">
                Productivity insights will appear here once student submissions are enabled.
              </p>
            </div>
          )}

          <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5">
            <p className="text-xs font-semibold text-amber-700">Phase 2 — coming soon</p>
            <p className="mt-1 text-sm text-amber-800">
              Student engagement rates, score trends, and per-class performance will appear here once the student-facing
              submission portal is live.
            </p>
          </div>
        </>
      )}
    </div>
  )
}
