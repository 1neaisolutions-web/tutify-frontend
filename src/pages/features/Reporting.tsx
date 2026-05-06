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
import { useState } from 'react'

const Reporting = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('last30days')
  const [selectedReportType, setSelectedReportType] = useState('all')
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [showCsvAnalysis, setShowCsvAnalysis] = useState(false)

  const reportTypes = [
    {
      id: 'usage',
      name: 'Usage Analytics',
      icon: BarChart3,
      description: 'Track template usage, feature adoption, and engagement metrics',
      color: 'bg-blue-500',
    },
    {
      id: 'performance',
      name: 'Performance Reports',
      icon: TrendingUp,
      description: 'Analyze student performance, assessment results, and learning outcomes',
      color: 'bg-green-500',
    },
    {
      id: 'engagement',
      name: 'Engagement Metrics',
      icon: Activity,
      description: 'Monitor student engagement, participation, and activity levels',
      color: 'bg-purple-500',
    },
    {
      id: 'assessment',
      name: 'Assessment Analysis',
      icon: Target,
      description: 'Detailed breakdown of assessment results and progress tracking',
      color: 'bg-amber-500',
    },
    {
      id: 'csv',
      name: 'CSV Data Analysis',
      icon: FileSpreadsheet,
      description: 'Upload and analyze CSV files with advanced data visualization',
      color: 'bg-indigo-500',
    },
    {
      id: 'custom',
      name: 'Custom Reports',
      icon: Settings,
      description: 'Create personalized reports with custom metrics and filters',
      color: 'bg-rose-500',
    },
  ]

  const stats = [
    {
      label: 'Total Reports Generated',
      value: '1,247',
      change: '+12%',
      trend: 'up',
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      label: 'Active Users',
      value: '342',
      change: '+8%',
      trend: 'up',
      icon: Users,
      color: 'bg-green-500',
    },
    {
      label: 'Templates Used',
      value: '892',
      change: '+15%',
      trend: 'up',
      icon: BookOpen,
      color: 'bg-purple-500',
    },
    {
      label: 'Data Exports',
      value: '456',
      change: '+22%',
      trend: 'up',
      icon: Download,
      color: 'bg-amber-500',
    },
  ]

  const recentReports = [
    {
      id: 1,
      title: 'Monthly Usage Report',
      type: 'Usage Analytics',
      generatedBy: 'Sarah Johnson',
      date: '2024-01-15',
      status: 'Completed',
      size: '2.4 MB',
    },
    {
      id: 2,
      title: 'Student Performance Analysis',
      type: 'Performance Reports',
      generatedBy: 'Michael Chen',
      date: '2024-01-14',
      status: 'Completed',
      size: '1.8 MB',
    },
    {
      id: 3,
      title: 'Engagement Metrics Q4',
      type: 'Engagement Metrics',
      generatedBy: 'Emily Davis',
      date: '2024-01-13',
      status: 'Pending',
      size: '-',
    },
    {
      id: 4,
      title: 'CSV Analysis - Student Data',
      type: 'CSV Data Analysis',
      generatedBy: 'David Wilson',
      date: '2024-01-12',
      status: 'Completed',
      size: '3.2 MB',
    },
  ]

  const csvAnalysisData = {
    totalRows: 1250,
    totalColumns: 15,
    insights: [
      { label: 'Average Score', value: '87.5%', trend: '+3.2%' },
      { label: 'Completion Rate', value: '94.2%', trend: '+1.8%' },
      { label: 'Top Performing Class', value: 'Grade 8A', trend: 'Stable' },
    ],
    charts: [
      { type: 'bar', title: 'Score Distribution', data: [45, 78, 92, 156, 203] },
      { type: 'line', title: 'Progress Over Time', data: [65, 72, 78, 85, 87, 89] },
      { type: 'pie', title: 'Category Breakdown', data: [35, 28, 22, 15] },
    ],
  }

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
          <h1 className="text-3xl font-semibold text-gray-900">Reporting & Analytics</h1>
          <p className="mt-2 text-sm text-gray-600">
            Generate comprehensive reports, analyze data, and track performance metrics
          </p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
            <FileText className="h-4 w-4" />
            Create Report
          </button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4">
        <Calendar className="h-5 w-5 text-gray-600" />
        <span className="text-sm font-semibold text-gray-700">Period:</span>
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
              {period === 'last7days' && 'Last 7 days'}
              {period === 'last30days' && 'Last 30 days'}
              {period === 'last90days' && 'Last 90 days'}
              {period === 'custom' && 'Custom'}
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
                    <span className="text-xs text-gray-500">vs last period</span>
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
          <h2 className="text-xl font-semibold text-gray-900">Report Types</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedReportType('all')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                selectedReportType === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedReportType('csv')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                selectedReportType === 'csv'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              CSV Analysis
            </button>
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
                      <span>Create report</span>
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
                <h3 className="text-lg font-semibold text-gray-900">CSV Data Analysis</h3>
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
              Close
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-6">
            <div className="rounded-xl border border-indigo-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Total Rows</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{csvAnalysisData.totalRows.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-indigo-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Total Columns</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{csvAnalysisData.totalColumns}</p>
            </div>
            <div className="rounded-xl border border-indigo-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">File Size</p>
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
              <Download className="h-4 w-4" />
              Export Analysis
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50">
              <Eye className="h-4 w-4" />
              View Full Report
            </button>
          </div>
        </div>
      )}

      {/* Recent Reports */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Reports</h2>
          <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
            View all
          </button>
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
                    report.status === 'Completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {report.status}
                </span>
                <button className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                  View
                </button>
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
            <p className="text-sm font-semibold text-gray-900">Upload CSV</p>
            <p className="text-xs text-gray-500">Analyze data files</p>
          </div>
        </button>
        <button className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition hover:border-indigo-300 hover:bg-indigo-50">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <PieChart className="h-6 w-6" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900">Visual Analytics</p>
            <p className="text-xs text-gray-500">Create charts</p>
          </div>
        </button>
        <button className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition hover:border-indigo-300 hover:bg-indigo-50">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <FileDown className="h-6 w-6" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900">Export Data</p>
            <p className="text-xs text-gray-500">Download reports</p>
          </div>
        </button>
        <button className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition hover:border-indigo-300 hover:bg-indigo-50">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <Settings className="h-6 w-6" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900">Custom Report</p>
            <p className="text-xs text-gray-500">Build your own</p>
          </div>
        </button>
      </div>
    </div>
  )
}

export default Reporting
