import {
  ClipboardCheck,
  CheckCircle2,
  Clock,
  XCircle,
  Users,
  TrendingUp,
  FileText,
  Download,
  Filter,
  Calendar,
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatDate } from '../../lib/i18n/format'

const Assessment = () => {
  const { t } = useTranslation()
  const [selectedFilter, setSelectedFilter] = useState('all')

  const assessmentStats = [
    {
      label: t('assessmentPage.totalAssessments'),
      value: '1,842',
      change: '+18%',
      icon: ClipboardCheck,
      color: 'bg-blue-500',
    },
    {
      label: t('assessmentPage.completed'),
      value: '1,523',
      change: '+12%',
      icon: CheckCircle2,
      color: 'bg-green-500',
    },
    {
      label: t('assessmentPage.inProgress'),
      value: '287',
      change: '+5%',
      icon: Clock,
      color: 'bg-amber-500',
    },
    {
      label: t('assessmentPage.pendingReview'),
      value: '32',
      change: '-3%',
      icon: XCircle,
      color: 'bg-red-500',
    },
  ]

  const assessments = [
    {
      id: 1,
      title: t('assessmentPage.sample.quarterlyReview'),
      type: t('assessmentPage.type.formative'),
      students: 45,
      completed: 42,
      dueDate: '2024-01-20',
      statusKey: 'inProgress' as const,
      progress: 93,
    },
    {
      id: 2,
      title: t('assessmentPage.sample.endOfUnit'),
      type: t('assessmentPage.type.summative'),
      students: 38,
      completed: 38,
      dueDate: '2024-01-18',
      statusKey: 'completed' as const,
      progress: 100,
    },
    {
      id: 3,
      title: t('assessmentPage.sample.midTerm'),
      type: t('assessmentPage.type.formative'),
      students: 52,
      completed: 35,
      dueDate: '2024-01-25',
      statusKey: 'inProgress' as const,
      progress: 67,
    },
  ]

  const filterLabel = (filter: string) => {
    if (filter === 'all') return t('common.all')
    if (filter === 'completed') return t('assessmentPage.completed')
    if (filter === 'in-progress') return t('assessmentPage.inProgress')
    if (filter === 'pending') return t('assessmentPage.pending')
    return filter
  }

  const statusLabel = (key: 'completed' | 'inProgress') =>
    key === 'completed' ? t('assessmentPage.completed') : t('assessmentPage.inProgress')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">{t('assessmentPage.assessment')}</h1>
          <p className="mt-2 text-sm text-gray-600">{t('assessmentPage.manageAndTrackStudentAssessmentsAndEvaluations')}</p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            <Filter className="h-4 w-4" />{t('assessmentPage.filter')}</button>
          <button className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
            <Download className="h-4 w-4" />{t('assessmentPage.exportData')}</button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4">
        <span className="text-sm font-semibold text-gray-700">{t('assessmentPage.status')}</span>
        <div className="flex gap-2">
          {['all', 'completed', 'in-progress', 'pending'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                selectedFilter === filter
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filterLabel(filter)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {assessmentStats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <div className="mt-2 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-xs font-semibold text-green-600">{stat.change}</span>
                    <span className="text-xs text-gray-500">{t('assessmentPage.vsLastMonth')}</span>
                  </div>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color} text-white`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Assessments List */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{t('assessmentPage.recentAssessments')}</h2>
          <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">{t('assessmentPage.viewAll')}</button>
        </div>
        <div className="space-y-4">
          {assessments.map((assessment) => (
            <div
              key={assessment.id}
              className="rounded-xl border border-gray-100 bg-gray-50 p-5 hover:bg-gray-100 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-base font-semibold text-gray-900">{assessment.title}</h3>
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                      {assessment.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{t('assessmentPage.studentsCount', { count: assessment.students })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{t('assessmentPage.completedCount', { count: assessment.completed })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {t('assessmentPage.due', { date: formatDate(assessment.dueDate) })}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">{t('assessmentPage.progress')}</span>
                      <span className="font-semibold text-gray-900">{assessment.progress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className={`h-full rounded-full ${
                          assessment.progress === 100
                            ? 'bg-green-500'
                            : assessment.progress >= 80
                            ? 'bg-blue-500'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${assessment.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="ml-4 flex flex-col items-end gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      assessment.statusKey === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {statusLabel(assessment.statusKey)}
                  </span>
                  <button className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">{t('assessmentPage.viewDetails')}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Assessment


