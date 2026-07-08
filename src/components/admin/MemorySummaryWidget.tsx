import { Brain, TrendingDown, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { MemoryOverview } from '@/api/admin'

interface MemorySummaryWidgetProps {
  data?: MemoryOverview | null
  loading?: boolean
}

function formatCredits(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

export default function MemorySummaryWidget({ data, loading }: MemorySummaryWidgetProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-32 rounded bg-gray-200" />
          <div className="h-8 w-24 rounded bg-gray-200" />
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-sky-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Platform Memory</h3>
        </div>
        <Link to="/administration/memory" className="text-sm text-sky-600 hover:underline">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <p className="text-xs text-gray-500">Total Balance</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {formatCredits(data?.total_balance ?? 0)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Allocated</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {formatCredits(data?.total_allocated ?? 0)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <TrendingDown className="h-3 w-3" /> Daily Burn
          </p>
          <p className="text-xl font-bold text-amber-600">
            {formatCredits(data?.daily_burn_rate ?? 0)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="h-3 w-3" /> Runway
          </p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {data?.estimated_runway_days != null ? `${data.estimated_runway_days}d` : '—'}
          </p>
        </div>
      </div>
    </div>
  )
}
