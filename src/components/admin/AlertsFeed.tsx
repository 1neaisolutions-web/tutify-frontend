import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, ChevronRight } from 'lucide-react'
import type { AdminAlert } from '@/api/admin'

interface AlertsFeedProps {
  alerts?: AdminAlert[]
  loading?: boolean
}

const severityColors: Record<string, string> = {
  critical: 'border-l-rose-500 bg-rose-50 dark:bg-rose-950/30',
  warning: 'border-l-amber-500 bg-amber-50 dark:bg-amber-950/30',
  info: 'border-l-sky-500 bg-sky-50 dark:bg-sky-950/30',
}

export default function AlertsFeed({ alerts = [], loading }: AlertsFeedProps) {
  if (loading) {
    return <div className="h-64 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-4 flex items-center gap-2">
        <Bell className="h-5 w-5 text-amber-500" />
        <h3 className="font-semibold text-gray-900 dark:text-white">Recent Alerts</h3>
        <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
          {alerts.length}
        </span>
      </div>
      {alerts.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500">No active alerts</p>
      ) : (
        <ul className="max-h-64 space-y-2 overflow-y-auto">
          {alerts.slice(0, 8).map((alert) => (
            <li
              key={alert.id}
              className={`rounded-lg border-l-4 p-3 ${severityColors[alert.severity] ?? severityColors.info}`}
            >
              <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.title}</p>
              <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">{alert.message}</p>
              {alert.link && (
                <Link to={alert.link} className="mt-1 inline-flex items-center gap-1 text-xs text-sky-600 hover:underline">
                  View <ChevronRight className="h-3 w-3" />
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
