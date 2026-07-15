import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import type { ApexOptions } from 'apexcharts'

interface ActivityTrendChartProps {
  dau: number
  wau: number
  mau: number
  loading?: boolean
}

export default function ActivityTrendChart({ dau, wau, mau, loading }: ActivityTrendChartProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (loading || !mounted) {
    return <div className="h-64 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
  }

  const options: ApexOptions = {
    chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit' },
    plotOptions: { bar: { borderRadius: 6, columnWidth: '50%' } },
    xaxis: { categories: ['DAU', 'WAU', 'MAU'] },
    colors: ['#0ea5e9'],
    dataLabels: { enabled: true },
    yaxis: { title: { text: 'Users' } },
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
      <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">User Activity</h3>
      <Chart options={options} series={[{ name: 'Active Users', data: [dau, wau, mau] }]} type="bar" height={280} />
    </div>
  )
}
