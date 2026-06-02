import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import { BarChart3, CheckCircle, Download, Target, TrendingDown, TrendingUp, Users } from 'lucide-react'
import ReactApexChart from 'react-apexcharts'
import type { ApexOptions } from 'apexcharts'

import { useGetAnalyticsQuery, type AnalyticsPeriod } from '../../redux/features/teacherTools/analytics/analyticsApiSlice'
import { useGetStatsQuery } from '../../redux/features/teacherTools/stats/statsApiSlice'
import { Link } from 'react-router-dom'

dayjs.extend(isoWeek)

function exportCSV(
  trend: { date: string; quiz: number; assignment: number; worksheet: number; exam: number; total: number }[],
  period: AnalyticsPeriod,
  header: string[],
) {
  const headerRow = header
  const rows = trend.map((p) => [p.date, p.quiz, p.assignment, p.worksheet, p.exam, p.total])
  const csv = [headerRow, ...rows].map((r) => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `content-analytics-${period}-${dayjs().format('YYYY-MM-DD')}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function ChartSkeleton({ height = 260 }: { height?: number }) {
  return <div className="animate-pulse rounded-xl bg-gray-100" style={{ height }} />
}

function KPISkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="card animate-pulse space-y-2">
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="h-8 w-12 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  )
}

const Analytics = () => {
  const { t } = useTranslation()
  const [period, setPeriod] = useState<AnalyticsPeriod>('30d')

  const periods = useMemo(
    (): { label: string; value: AnalyticsPeriod }[] => [
      { label: t('analyticsPage.period7d'), value: '7d' },
      { label: t('analyticsPage.period30d'), value: '30d' },
      { label: t('analyticsPage.period90d'), value: '90d' },
      { label: t('analyticsPage.period365d'), value: '365d' },
    ],
    [t],
  )

  const csvHeaders = useMemo(
    () => [
      t('analyticsPage.csvDate'),
      t('analyticsPage.seriesQuiz'),
      t('analyticsPage.seriesAssignment'),
      t('analyticsPage.seriesWorksheet'),
      t('analyticsPage.seriesExam'),
      t('analyticsPage.csvTotal'),
    ],
    [t],
  )

  const { data, isLoading, isFetching } = useGetAnalyticsQuery(period)
  const { data: stats } = useGetStatsQuery()

  const trendLabels = (data?.trend ?? []).map((p) =>
    data?.bucket_size === 'day' ? dayjs(p.date).format('MMM D') : `W${dayjs(p.date).isoWeek()}`,
  )

  const trendOptions: ApexOptions = {
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: { show: false },
      fontFamily: 'inherit',
      animations: { enabled: !isFetching },
    },
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'],
    xaxis: { categories: trendLabels, labels: { style: { fontSize: '11px' } } },
    yaxis: { labels: { formatter: (v: number) => String(Math.round(v)) } },
    legend: { position: 'top', horizontalAlign: 'left', fontSize: '12px' },
    dataLabels: { enabled: false },
    grid: { borderColor: '#F3F4F6' },
    plotOptions: { bar: { borderRadius: 3 } },
    tooltip: {
      y: {
        formatter: (v: number) =>
          t('analyticsPage.tooltipItems', { count: v }),
      },
    },
  }

  const trendSeries = [
    { name: t('analyticsPage.seriesQuiz'), data: (data?.trend ?? []).map((p) => p.quiz) },
    { name: t('analyticsPage.seriesAssignment'), data: (data?.trend ?? []).map((p) => p.assignment) },
    { name: t('analyticsPage.seriesWorksheet'), data: (data?.trend ?? []).map((p) => p.worksheet) },
    { name: t('analyticsPage.seriesExam'), data: (data?.trend ?? []).map((p) => p.exam) },
  ]

  const gradeLabels = (data?.by_grade ?? []).map((g) => g.label)
  const gradeValues = (data?.by_grade ?? []).map((g) => g.count)
  const gradeOptions: ApexOptions = {
    chart: { type: 'donut', fontFamily: 'inherit' },
    labels: gradeLabels,
    colors: ['#6366F1', '#3B82F6', '#0EA5E9', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
    legend: { position: 'bottom', fontSize: '12px' },
    dataLabels: { enabled: gradeValues.length > 0 },
    plotOptions: { pie: { donut: { size: '60%' } } },
  }

  const isEmpty =
    !data ||
    (data.velocity.this_period === 0 &&
      data.velocity.prev_period === 0 &&
      data.by_subject.length === 0 &&
      data.by_grade.length === 0)

  const vel = data?.velocity

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('analyticsPage.title')}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{t('analyticsPage.subtitle')}</p>
        </div>
        <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                period === p.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <KPISkeleton />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: t('analyticsPage.createdPeriod', { period }),
              value: data?.velocity.this_period ?? 0,
              sub:
                vel && vel.prev_period > 0
                  ? t('analyticsPage.vsPrevPeriod', {
                      pct: `${vel.change_pct > 0 ? '+' : ''}${vel.change_pct.toFixed(0)}`,
                    })
                  : '',
              icon: TrendingUp,
              color: 'text-blue-600 bg-blue-100',
            },
            {
              label: t('analyticsPage.published'),
              value: data?.total_published ?? stats?.summary.total_published ?? 0,
              sub: t('analyticsPage.totalAcrossTools'),
              icon: CheckCircle,
              color: 'text-green-600 bg-green-100',
            },
            {
              label: t('analyticsPage.activeClasses'),
              value: data?.active_class_keys ?? 0,
              sub: t('analyticsPage.distinctClassKeys'),
              icon: Users,
              color: 'text-violet-600 bg-violet-100',
            },
            {
              label: t('analyticsPage.avgQuizScore'),
              value: data?.avg_quiz_score != null ? `${data.avg_quiz_score}%` : '—',
              sub:
                data?.avg_quiz_score != null
                  ? t('analyticsPage.acrossPublishedQuizzes')
                  : t('analyticsPage.noQuizData'),
              icon: Target,
              color: 'text-amber-600 bg-amber-100',
            },
          ].map(({ label, value, sub, icon: Icon, color }) => (
            <div key={label} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                  {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
                </div>
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && isEmpty && (
        <div className="card text-center py-16">
          <BarChart3 className="h-12 w-12 text-gray-200 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900">{t('analyticsPage.emptyTitle')}</h3>
          <p className="text-sm text-gray-500 mt-1">{t('analyticsPage.emptyHint')}</p>
          <Link
            to="/teacher-tools/quiz/create"
            className="mt-4 inline-block rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            {t('analyticsPage.createFirstQuiz')}
          </Link>
        </div>
      )}

      {!isEmpty && (
        <div className={`card transition-opacity ${isFetching ? 'opacity-60' : ''}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-900">{t('analyticsPage.creationTrend')}</h2>
              <p className="text-xs text-gray-400">
                {t('analyticsPage.itemsPerBucket', {
                  bucket: data?.bucket_size === 'week' ? t('analyticsPage.bucketWeek') : t('analyticsPage.bucketDay'),
                })}
              </p>
            </div>
            <button
              onClick={() => data && exportCSV(data.trend, period, csvHeaders)}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50"
            >
              <Download className="h-3.5 w-3.5" /> {t('analyticsPage.exportCsv')}
            </button>
          </div>
          {isLoading ? (
            <ChartSkeleton height={260} />
          ) : (data?.trend.length ?? 0) === 0 ? (
            <p className="text-sm text-gray-400 text-center py-16">{t('analyticsPage.noItemsInPeriod')}</p>
          ) : (
            <ReactApexChart type="bar" height={260} options={trendOptions} series={trendSeries} />
          )}
        </div>
      )}

      {!isEmpty && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-4">{t('analyticsPage.subjectCoverage')}</h2>
            {isLoading ? (
              <ChartSkeleton height={200} />
            ) : (data?.by_subject.length ?? 0) === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">{t('analyticsPage.noSubjectData')}</p>
            ) : (
              <ul className="space-y-3">
                {data!.by_subject.map(({ label, count }) => {
                  const max = data!.by_subject[0].count || 1
                  const pct = Math.round((count / max) * 100)
                  return (
                    <li key={label}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-700 font-medium">{label}</span>
                        <span className="text-gray-500">{count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100">
                        <div className="h-2 rounded-full bg-primary-500 transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-4">{t('analyticsPage.gradeDistribution')}</h2>
            {isLoading ? (
              <ChartSkeleton height={200} />
            ) : gradeValues.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">{t('analyticsPage.noGradeData')}</p>
            ) : (
              <ReactApexChart type="donut" height={220} options={gradeOptions} series={gradeValues} />
            )}
          </div>
        </div>
      )}

      {!isEmpty && data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-1">{t('analyticsPage.contentVelocity')}</h2>
            <p className="text-xs text-gray-400 mb-4">{t('analyticsPage.periodComparison')}</p>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-5xl font-bold text-gray-900">{data.velocity.this_period}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {t('analyticsPage.itemsCreatedThisPeriod', { period })}
                </p>
              </div>
              <div>
                {data.velocity.change_pct > 0 ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="h-5 w-5" />
                    <span className="text-lg font-semibold">+{data.velocity.change_pct.toFixed(0)}%</span>
                  </div>
                ) : data.velocity.change_pct < 0 ? (
                  <div className="flex items-center gap-1 text-red-500">
                    <TrendingDown className="h-5 w-5" />
                    <span className="text-lg font-semibold">{data.velocity.change_pct.toFixed(0)}%</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">{t('analyticsPage.sameAsPrevious')}</span>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {t('analyticsPage.previousItems', { count: data.velocity.prev_period })}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-4">{t('analyticsPage.contentPipeline')}</h2>
            <div className="space-y-3">
              {[
                { label: t('analyticsPage.draft'), value: data.total_draft, colour: 'bg-gray-400' },
                { label: t('analyticsPage.published'), value: data.total_published, colour: 'bg-green-500' },
                { label: t('analyticsPage.archived'), value: data.total_archived, colour: 'bg-gray-200' },
              ].map(({ label, value, colour }) => {
                const total = data.total_draft + data.total_published + data.total_archived || 1
                return (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{label}</span>
                      <span className="font-medium text-gray-900">{value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100">
                      <div className={`h-2 rounded-full ${colour}`} style={{ width: `${(value / total) * 100}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Analytics

