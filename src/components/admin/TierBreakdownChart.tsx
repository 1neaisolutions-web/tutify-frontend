import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import type { ApexOptions } from 'apexcharts'

interface TierBreakdownChartProps {
  data?: Record<string, number>
  loading?: boolean
}

const TIER_COLORS = ['#94a3b8', '#38bdf8', '#818cf8', '#a78bfa', '#f472b6']

export default function TierBreakdownChart({ data, loading }: TierBreakdownChartProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (loading || !mounted) {
    return <div className="h-64 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
  }

  const labels = Object.keys(data ?? {})
  const series = Object.values(data ?? {})

  const options: ApexOptions = {
    chart: { type: 'donut', fontFamily: 'inherit' },
    labels: labels.map((l) => l.replace(/_/g, ' ')),
    colors: TIER_COLORS,
    legend: { position: 'bottom' },
    dataLabels: { enabled: true },
    plotOptions: { pie: { donut: { size: '60%' } } },
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
      <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Subscription Tiers</h3>
      {series.length > 0 ? (
        <Chart options={options} series={series} type="donut" height={280} />
      ) : (
        <p className="py-12 text-center text-sm text-gray-500">No subscription data</p>
      )}
    </div>
  )
}
