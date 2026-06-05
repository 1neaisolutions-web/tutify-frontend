import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { SimpleBarChart, TeacherToolsPageHeader } from '../components'
import * as examApi from '../../../../api/examApi'
import { examSectionPerformanceBars } from '../utils/analyticsDemoSeries'

type AnalyticsRangeId = '7d' | '30d' | 'all'

export default function ExamAnalytics() {
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
  const { examId } = useParams()
  const [exam, setExam] = useState<examApi.ExamApiItem | null>(null)
  const [range, setRange] = useState<AnalyticsRangeId>('30d')

  useEffect(() => {
    if (!examId) return
    let c = false
    ;(async () => {
      try {
        const ex = await examApi.fetchExam(examId)
        if (!c) setExam(ex)
      } catch {
        if (!c) setExam(null)
      }
    })()
    return () => {
      c = true
    }
  }, [examId])

  const e = exam

  const sectionPoints = useMemo(() => (e ? examSectionPerformanceBars(e, range) : []), [e, range])

  if (!e) {
    return (
      <div className="space-y-4 p-6">
        <p className="text-sm text-gray-700">{t('exam.detail.notFound')}</p>
        <Link to="/teacher-tools/exams" className="text-sm font-semibold text-primary-600">
          {t('exam.detail.backToList')}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <TeacherToolsPageHeader
        title={`${t('exam.analytics.titlePrefix')} ${e.title}`}
        breadcrumbs={[
          { label: t('teacherTools.breadcrumbTeacherTools'), to: '/teacher-tools' },
          { label: t('exam.breadcrumb'), to: '/teacher-tools/exams' },
          { label: e.title, to: `/teacher-tools/exams/${e.id}` },
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
          title={t('exam.analytics.chartSectionPerformance')}
          subtitle={t('exam.analytics.bySectionSubtitle', {
            range: ranges.find((x) => x.id === range)?.label ?? '',
          })}
          points={sectionPoints}
        />
      </div>
      <Link to={`/teacher-tools/exams/${e.id}`} className="text-sm font-semibold text-primary-600">
        {t('common.back')}
      </Link>
    </div>
  )
}
