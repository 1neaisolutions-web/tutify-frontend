import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import type { ApexOptions } from 'apexcharts'
import { getGrowthAnalytics, getLlmCostAnalytics } from '@/api/admin'

export default function AdminAnalytics() {
  const [tab, setTab] = useState<'growth' | 'llm'>('growth')
  const [growth, setGrowth] = useState<Awaited<ReturnType<typeof getGrowthAnalytics>> | null>(null)
  const [llm, setLlm] = useState<Awaited<ReturnType<typeof getLlmCostAnalytics>> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([getGrowthAnalytics(), getLlmCostAnalytics()])
      .then(([g, l]) => { setGrowth(g); setLlm(l) })
      .finally(() => setLoading(false))
  }, [])

  const growthOptions: ApexOptions = {
    chart: { type: 'area', toolbar: { show: false } },
    xaxis: { categories: growth?.data.map((d) => d.date) ?? [] },
    stroke: { curve: 'smooth' },
    colors: ['#0ea5e9', '#10b981'],
  }

  const llmOptions: ApexOptions = {
    chart: { type: 'bar', stacked: true, toolbar: { show: false } },
    xaxis: { categories: [...new Set(llm?.data.map((d) => d.date) ?? [])] },
    colors: ['#818cf8', '#f472b6', '#38bdf8'],
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-gray-500">Platform growth and LLM cost metrics</p>
      </div>

      <div className="flex gap-2 border-b">
        {(['growth', 'llm'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === t ? 'border-sky-500 text-sky-600' : 'border-transparent text-gray-500'}`}>
            {t === 'growth' ? 'Growth' : 'LLM Cost'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="h-80 animate-pulse rounded-xl bg-gray-100" />
      ) : tab === 'growth' ? (
        <div className="rounded-xl border p-5">
          <div className="mb-4 flex gap-6 text-sm">
            <span>Total users: <strong>{growth?.total_users}</strong></span>
            <span>30d growth: <strong>{growth?.growth_rate_30d}%</strong></span>
          </div>
          <Chart options={growthOptions} series={[
            { name: 'New Users', data: growth?.data.map((d) => d.new_users) ?? [] },
            { name: 'Active Users', data: growth?.data.map((d) => d.active_users) ?? [] },
          ]} type="area" height={350} />
        </div>
      ) : (
        <div className="rounded-xl border p-5">
          <p className="mb-4 text-sm">30-day LLM cost: <strong>${llm?.total_usd_30d?.toFixed(2)}</strong></p>
          <Chart options={llmOptions} series={Object.entries(llm?.by_model ?? {}).map(([model, usd]) => ({
            name: model, data: [usd],
          }))} type="bar" height={350} />
        </div>
      )}
    </div>
  )
}
