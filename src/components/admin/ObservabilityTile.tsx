import { Activity, AlertCircle, CheckCircle2, Server } from 'lucide-react'

interface ObservabilityTileProps {
  healthStatus?: string
  queuePending?: number
  queueInProgress?: number
  errorRate24h?: number
  loading?: boolean
}

export default function ObservabilityTile({
  healthStatus = 'unknown',
  queuePending = 0,
  queueInProgress = 0,
  errorRate24h = 0,
  loading,
}: ObservabilityTileProps) {
  if (loading) {
    return <div className="h-48 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
  }

  const healthy = healthStatus === 'healthy'

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-4 flex items-center gap-2">
        <Server className="h-5 w-5 text-sky-500" />
        <h3 className="font-semibold text-gray-900 dark:text-white">System Health</h3>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">API Status</span>
          <span className={`flex items-center gap-1 text-sm font-medium ${healthy ? 'text-emerald-600' : 'text-amber-600'}`}>
            {healthy ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {healthStatus}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Job Queue</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {queuePending} pending · {queueInProgress} running
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">5xx Error Rate (24h)</span>
          <span className={`flex items-center gap-1 text-sm font-medium ${errorRate24h > 5 ? 'text-rose-600' : 'text-emerald-600'}`}>
            <Activity className="h-4 w-4" />
            {errorRate24h}%
          </span>
        </div>
      </div>
    </div>
  )
}
