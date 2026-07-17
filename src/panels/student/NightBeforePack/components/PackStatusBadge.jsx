import { useTranslation } from 'react-i18next'

const statusClass = {
  scheduled: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200',
  generating: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-200',
  ready: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200',
  completed: 'bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-200',
}

const PackStatusBadge = ({ status }) => {
  const { t } = useTranslation()
  const cls = statusClass[status] || statusClass.scheduled
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
      {t(`studentPanel.nightBefore.status.${status}`)}
    </span>
  )
}

export default PackStatusBadge
