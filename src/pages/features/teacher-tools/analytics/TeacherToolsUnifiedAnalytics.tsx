import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
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
    const workload: string =
      drafts > 20 ? t('teacherTools.workloadHigh') : drafts > 8 ? t('teacherTools.workloadMedium') : t('teacherTools.workloadLow')
    return [
      { label: t('teacherTools.statContentCreated'), value: String(total) },
      { label: t('teacherTools.overview.kpiPendingDrafts'), value: String(drafts) },
      { label: t('teacherTools.overview.kpiAvgQuizScore'), value: avgScore },
      { label: t('teacherTools.statReviewWorkload'), value: workload },
    ]
  }, [stats, allQuizzes, allAssignments, allWorksheets, allExams, t])

  const toolPoints = useMemo(() => {
    const counts = [
      { label: t('quiz.breadcrumb'), value: stats?.quizzes.total ?? allQuizzes.length, colorClass: 'bg-indigo-500' },
      { label: t('teacherTools.toolAssign'), value: stats?.assignments.total ?? allAssignments.length, colorClass: 'bg-violet-500' },
      { label: t('teacherTools.toolSheet'), value: stats?.worksheets.total ?? allWorksheets.length, colorClass: 'bg-emerald-500' },
      { label: t('teacherTools.toolExam'), value: stats?.exams.total ?? allExams.length, colorClass: 'bg-amber-500' },
    ]
    const max = Math.max(...counts.map((c) => c.value), 1)
    return counts.map((c) => ({ ...c, max }))
  }, [stats, allQuizzes, allAssignments, allWorksheets, allExams, t])

  const handleExport = () => {
    if (!stats) {
      toast.error(t('teacherTools.toastStatsNotLoaded'))
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
    toast.success(t('teacherTools.toastCsvDownloaded'))
  }

  return (
    <div className="space-y-8">
      <TeacherToolsPageHeader
        title={t('teacherTools.analytics.title')}
        subtitle={t('teacherTools.analytics.subtitle')}
        breadcrumbs={[{ label: t('teacherTools.breadcrumbTeacherTools'), to: '/teacher-tools' }, { label: t('exam.detail.tabs.analytics') }]}
        actions={
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white"
          >
            <Download className="h-4 w-4" /> {t('teacherTools.exportReport')}
          </button>
        }
      />

      {isLoading && <ChartSkeleton />}

      {!isLoading && (
        <>
          <p className="text-xs text-gray-500">{t('teacherTools.figuresNote')}</p>

          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((k) => (
              <div key={k.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase text-gray-500">{k.label}</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">{k.value}</p>
              </div>
            ))}
          </section>

          <SimpleBarChart title={t('teacherTools.chartToolLibrary')} subtitle={t('teacherTools.chartToolLibrarySubtitle')} points={toolPoints} />

          {showInsights && (
            <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <BarChart3 className="h-4 w-4" /> {t('teacherTools.productivity')}
              </div>
              <p className="mt-2 text-sm text-gray-700">{t('teacherTools.productivityHint')}</p>
            </div>
          )}

          <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5">
            <p className="text-xs font-semibold text-amber-700">{t('teacherTools.phase2ComingSoon')}</p>
            <p className="mt-1 text-sm text-amber-800">{t('teacherTools.phase2Body')}</p>
          </div>
        </>
      )}
    </div>
  )
}
