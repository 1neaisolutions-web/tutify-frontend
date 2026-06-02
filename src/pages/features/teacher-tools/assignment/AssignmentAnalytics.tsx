import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { SimpleBarChart, TeacherToolsPageHeader } from '../components'
import { useTeacherToolsDemo } from '../TeacherToolsDemoProvider'
import { assignmentSubmissionBars } from '../utils/analyticsDemoSeries'

type AnalyticsRangeId = '7d' | '30d' | 'all'

export default function AssignmentAnalytics() {
  const { t } = useTranslation()
  const ranges = useMemo(
    () =>
      [
        { id: '7d' as const, label: t('teacherTools.range7d') },
        { id: '30d' as const, label: t('teacherTools.range30d') },
        { id: 'all' as const, label: t('teacherTools.rangeAll') },
      ] satisfies { id: AnalyticsRangeId; label: string }[],
    [t],
  )
  const { assignmentId } = useParams()
  const { allAssignments } = useTeacherToolsDemo()
  const a = useMemo(() => allAssignments.find((x) => x.id === assignmentId), [allAssignments, assignmentId])
  const [range, setRange] = useState<AnalyticsRangeId>('30d')

  const submissionPoints = useMemo(() => (a ? assignmentSubmissionBars(a, range) : []), [a, range])

  if (!a) {
    return (
      <div className="space-y-4 p-6">
        <p className="text-sm text-gray-700">{t('assignment.detail.notFound')}</p>
        <Link to="/teacher-tools/assignment" className="text-sm font-semibold text-primary-600">
          {t('assignment.detail.backToList')}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <TeacherToolsPageHeader
        title={`${t('quiz.analytics.titlePrefix')} ${a.title}`}
        breadcrumbs={[
          { label: t('teacherTools.breadcrumbTeacherTools'), to: '/teacher-tools' },
          { label: t('assignment.breadcrumb'), to: '/teacher-tools/assignment' },
          { label: a.title, to: `/teacher-tools/assignment/${a.id}` },
          { label: t('exam.detail.tabs.analytics') },
        ]}
      />

      <div className="flex flex-wrap gap-2">
        {ranges.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRange(r.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              range === r.id ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-700">
          <span className="font-semibold">{t('teacherTools.previewData')}</span>
          <span>{t('teacherTools.previewDataHint')}</span>
        </div>
        <SimpleBarChart
          title={t('assignment.analytics.chartSubmissionRate')}
          subtitle={
            a
              ? t('assignment.analytics.submittedSubtitle', {
                  submitted: a.submitted,
                  assigned: a.assignedCount,
                  range: ranges.find((x) => x.id === range)?.label ?? '',
                })
              : undefined
          }
          points={submissionPoints}
        />
      </div>
      <Link to={`/teacher-tools/assignment/${a.id}`} className="text-sm font-semibold text-primary-600">
        {t('common.back')}
      </Link>
    </div>
  )
}
