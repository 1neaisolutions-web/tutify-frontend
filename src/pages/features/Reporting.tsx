import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  Calendar,
  Download,
  Filter,
  Search,
  Upload,
  FileSpreadsheet,
  PieChart,
  LineChart,
  Activity,
  Award,
  BookOpen,
  Target,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  FileDown,
  Settings,
  Eye,
} from 'lucide-react'
import { useMemo, useState } from 'react'

import { useTranslation } from 'react-i18next'
const Reporting = () => {
  const { t } = useTranslation()
  const [selectedPeriod, setSelectedPeriod] = useState('last30days')
  const [selectedReportType, setSelectedReportType] = useState('all')
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [showCsvAnalysis, setShowCsvAnalysis] = useState(false)

  const reportTypes = useMemo(
    () => [
      { id: 'usage', name: t('reportingPage.reportType.usage.name'), icon: BarChart3, description: t('reportingPage.reportType.usage.description'), color: 'bg-blue-500' },
      { id: 'performance', name: t('reportingPage.reportType.performance.name'), icon: TrendingUp, description: t('reportingPage.reportType.performance.description'), color: 'bg-green-500' },
      { id: 'engagement', name: t('reportingPage.reportType.engagement.name'), icon: Activity, description: t('reportingPage.reportType.engagement.description'), color: 'bg-purple-500' },
      { id: 'assessment', name: t('reportingPage.reportType.assessment.name'), icon: Target, description: t('reportingPage.reportType.assessment.description'), color: 'bg-amber-500' },
      { id: 'csv', name: t('reportingPage.reportType.csv.name'), icon: FileSpreadsheet, description: t('reportingPage.reportType.csv.description'), color: 'bg-indigo-500' },
      { id: 'custom', name: t('reportingPage.reportType.custom.name'), icon: Settings, description: t('reportingPage.reportType.custom.description'), color: 'bg-rose-500' },
    ],
    [t],
  )

  const stats = useMemo(
    () => [
      { label: t('reportingPage.stats.totalReports'), value: '1,247', change: '+12%', trend: 'up', icon: FileText, color: 'bg-blue-500' },
      { label: t('reportingPage.stats.activeUsers'), value: '342', change: '+8%', trend: 'up', icon: Users, color: 'bg-green-500' },
      { label: t('reportingPage.stats.templatesUsed'), value: '892', change: '+15%', trend: 'up', icon: BookOpen, color: 'bg-purple-500' },
      { label: t('reportingPage.stats.dataExports'), value: '456', change: '+22%', trend: 'up', icon: Download, color: 'bg-amber-500' },
    ],
    [t],
  )

  const recentReports = useMemo(
    () => [
      { id: 1, title: t('reportingPage.samples.monthlyUsage'), type: t('reportingPage.reportType.usage.name'), generatedBy: 'Sarah Johnson', date: '2024-01-15', status: t('reportingPage.status.completed'), size: '2.4 MB' },
      { id: 2, title: t('reportingPage.samples.studentPerformance'), type: t('reportingPage.reportType.performance.name'), generatedBy: 'Michael Chen', date: '2024-01-14', status: t('reportingPage.status.completed'), size: '1.8 MB' },
      { id: 3, title: t('reportingPage.samples.engagementQ4'), type: t('reportingPage.reportType.engagement.name'), generatedBy: 'Emily Davis', date: '2024-01-13', status: t('reportingPage.status.pending'), size: '-' },
      { id: 4, title: t('reportingPage.samples.csvAnalysis'), type: t('reportingPage.reportType.csv.name'), generatedBy: 'David Wilson', date: '2024-01-12', status: t('reportingPage.status.completed'), size: '3.2 MB' },
    ],
    [t],
  )

  const csvAnalysisData = useMemo(
    () => ({
      totalRows: 1250,
      totalColumns: 15,
      insights: [
        { label: t('reportingPage.csvInsights.averageScore'), value: '87.5%', trend: '+3.2%' },
        { label: t('reportingPage.csvInsights.completionRate'), value: '94.2%', trend: '+1.8%' },
        { label: t('reportingPage.csvInsights.topClass'), value: 'Grade 8A', trend: t('reportingPage.csvInsights.stable') },
      ],
      charts: [
        { type: 'bar', title: t('reportingPage.charts.scoreDistribution'), data: [45, 78, 92, 156, 203] },
        { type: 'line', title: t('reportingPage.charts.progressOverTime'), data: [65, 72, 78, 85, 87, 89] },
        { type: 'pie', title: t('reportingPage.charts.categoryBreakdown'), data: [35, 28, 22, 15] },
      ],
    }),
    [t],
  )

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'text/csv') {
      setCsvFile(file)
      setShowCsvAnalysis(true)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">{t('reportingPage.reportingAnalytics')}</h1>
          <p className="mt-2 text-sm text-gray-600">{t('reportingPage.generateComprehensiveReportsAnalyzeDataAndTrackPerforma')}</p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            <Filter className="h-4 w-4" />{t('reportingPage.filter')}</button>
          <button className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
            <FileText className="h-4 w-4" />{t('reportingPage.createReport')}</button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4">
        <Calendar className="h-5 w-5 text-gray-600" />
        <span className="text-sm font-semibold text-gray-700">{t('reportingPage.period')}</span>
        <div className="flex gap-2">
          {['last7days', 'last30days', 'last90days', 'custom'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                selectedPeriod === period
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t(`reportingPage.periods.${period}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <div className="mt-2 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-xs font-semibold text-green-600">{stat.change}</span>
                    <span className="text-xs text-gray-500">{t('reportingPage.vsLastPeriod')}</span>
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

      {/* Report Types */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{t('reportingPage.reportTypes')}</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedReportType('all')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                selectedReportType === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >{t('reportingPage.all')}</button>
            <button
              onClick={() => setSelectedReportType('csv')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                selectedReportType === 'csv'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >{t('reportingPage.csvAnalysis')}</button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reportTypes.map((type) => {
            const Icon = type.icon
            return (
              <button
                key={type.id}
                onClick={() => {
                  if (type.id === 'csv') {
                    document.getElementById('csv-upload')?.click()
                  } else {
                    setSelectedReportType(type.id)
                  }
                }}
                className="group rounded-2xl border-2 border-gray-200 bg-white p-5 text-left transition hover:border-indigo-300 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${type.color} text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-indigo-600">
                      {type.name}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">{type.description}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-indigo-600">
                      <span>{t('reportingPage.createReport2')}</span>
                      <Zap className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
        <input
          id="csv-upload"
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* CSV Analysis Section */}
      {showCsvAnalysis && csvFile && (
        <div className="rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{t('reportingPage.csvDataAnalysis')}</h3>
                <p className="text-sm text-gray-600">{csvFile.name}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowCsvAnalysis(false)
                setCsvFile(null)
              }}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              {t('reportingPage.close')}
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-6">
            <div className="rounded-xl border border-indigo-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t('reportingPage.totalRows')}</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{csvAnalysisData.totalRows.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-indigo-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t('reportingPage.totalColumns')}</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{csvAnalysisData.totalColumns}</p>
            </div>
            <div className="rounded-xl border border-indigo-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t('reportingPage.fileSize')}</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {(csvFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-6">
            {csvAnalysisData.insights.map((insight, idx) => (
              <div key={idx} className="rounded-xl border border-indigo-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{insight.label}</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <p className="text-xl font-semibold text-gray-900">{insight.value}</p>
                  <span className="text-xs font-semibold text-green-600">{insight.trend}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {csvAnalysisData.charts.map((chart, idx) => (
              <div key={idx} className="rounded-xl border border-indigo-200 bg-white p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">{chart.title}</h4>
                <div className="h-32 flex items-end justify-between gap-1">
                  {chart.data.map((value, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t bg-gradient-to-t from-indigo-500 to-indigo-300 transition hover:from-indigo-600 hover:to-indigo-400"
                      style={{ height: `${(value / Math.max(...chart.data)) * 100}%` }}
                      title={`${value}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <button className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
              <Download className="h-4 w-4" />{t('reportingPage.exportAnalysis')}</button>
            <button className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50">
              <Eye className="h-4 w-4" />{t('reportingPage.viewFullReport')}</button>
          </div>
        </div>
      )}

      {/* Recent Reports */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{t('reportingPage.recentReports')}</h2>
          <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">{t('reportingPage.viewAll')}</button>
        </div>
        <div className="space-y-3">
          {recentReports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{report.title}</h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                    <span>{report.type}</span>
                    <span>•</span>
                    <span>{report.generatedBy}</span>
                    <span>•</span>
                    <span>{report.date}</span>
                    {report.size !== '-' && (
                      <>
                        <span>•</span>
                        <span>{report.size}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    report.status === t('reportingPage.status.completed')
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {report.status}
                </span>
                <button className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">{t('reportingPage.view')}</button>
                <button className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <button className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition hover:border-indigo-300 hover:bg-indigo-50">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <Upload className="h-6 w-6" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900">{t('reportingPage.uploadCsv')}</p>
            <p className="text-xs text-gray-500">{t('reportingPage.analyzeDataFiles')}</p>
          </div>
        </button>
        <button className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition hover:border-indigo-300 hover:bg-indigo-50">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <PieChart className="h-6 w-6" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900">{t('reportingPage.visualAnalytics')}</p>
            <p className="text-xs text-gray-500">{t('reportingPage.createCharts')}</p>
          </div>
        </button>
        <button className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition hover:border-indigo-300 hover:bg-indigo-50">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <FileDown className="h-6 w-6" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900">{t('reportingPage.exportData')}</p>
            <p className="text-xs text-gray-500">{t('reportingPage.downloadReports')}</p>
          </div>
        </button>
        <button className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition hover:border-indigo-300 hover:bg-indigo-50">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <Settings className="h-6 w-6" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900">{t('reportingPage.customReport')}</p>
            <p className="text-xs text-gray-500">{t('reportingPage.buildYourOwn')}</p>
          </div>
        </button>
      </div>
    </div>
  )
}

export default Reporting
