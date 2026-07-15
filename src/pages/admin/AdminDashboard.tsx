import { useEffect, useState } from 'react'
import { Users, Building2, School, Brain, AlertTriangle } from 'lucide-react'
import KpiCard from '@/components/admin/KpiCard'
import MemorySummaryWidget from '@/components/admin/MemorySummaryWidget'
import TierBreakdownChart from '@/components/admin/TierBreakdownChart'
import ActivityTrendChart from '@/components/admin/ActivityTrendChart'
import ObservabilityTile from '@/components/admin/ObservabilityTile'
import AlertsFeed from '@/components/admin/AlertsFeed'
import QuickActionsBar from '@/components/admin/QuickActionsBar'
import { getDashboardOverview, getAdminAlerts, getMemoryOverview } from '@/api/admin'
import type { AdminAlert, DashboardOverview, MemoryOverview } from '@/api/admin'

export default function AdminDashboard() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null)
  const [memory, setMemory] = useState<MemoryOverview | null>(null)
  const [alerts, setAlerts] = useState<AdminAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      const results = await Promise.allSettled([
        getDashboardOverview(),
        getMemoryOverview(),
        getAdminAlerts(),
      ])

      const [ov, mem, al] = results
      if (ov.status === 'fulfilled') setOverview(ov.value)
      if (mem.status === 'fulfilled') setMemory(mem.value)
      if (al.status === 'fulfilled') setAlerts(al.value.items)

      const firstError = results.find((r) => r.status === 'rejected') as PromiseRejectedResult | undefined
      if (firstError && results.every((r) => r.status === 'rejected')) {
        const reason = firstError.reason
        setError(reason instanceof Error ? reason.message : 'Failed to load dashboard')
      } else if (firstError) {
        // Keep partial UI; surface a soft warning in console
        console.warn('[AdminDashboard] Partial load failure:', firstError.reason)
      }
      setLoading(false)
    }
    load()
  }, [])

  if (error && !overview && !memory) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700">
        <AlertTriangle className="h-5 w-5" />
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of users, memory, and system health</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Users" value={overview?.total_users?.toLocaleString() ?? '—'} icon={<Users className="h-5 w-5" />} />
        <KpiCard title="Organizations" value={overview?.total_organizations ?? '—'} icon={<Building2 className="h-5 w-5" />} accent="emerald" />
        <KpiCard title="Schools" value={overview?.total_schools ?? '—'} icon={<School className="h-5 w-5" />} accent="violet" />
        <KpiCard title="Active Alerts" value={overview?.alert_count ?? 0} icon={<Brain className="h-5 w-5" />} accent="amber" />
      </div>

      <MemorySummaryWidget data={memory} loading={loading} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ActivityTrendChart dau={overview?.dau ?? 0} wau={overview?.wau ?? 0} mau={overview?.mau ?? 0} loading={loading} />
        <TierBreakdownChart data={overview?.tier_breakdown} loading={loading} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ObservabilityTile
          healthStatus={overview?.health_status}
          queuePending={overview?.queue_pending}
          queueInProgress={overview?.queue_in_progress}
          errorRate24h={overview?.error_rate_24h}
          loading={loading}
        />
        <AlertsFeed alerts={alerts} loading={loading} />
      </div>

      <QuickActionsBar />
    </div>
  )
}
