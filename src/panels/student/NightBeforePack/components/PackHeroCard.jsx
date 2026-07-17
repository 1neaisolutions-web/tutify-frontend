import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Moon, Clock } from 'lucide-react'
import PackStatusBadge from './PackStatusBadge'
import PackSourceBadge from './PackSourceBadge'

const PackHeroCard = ({ pack }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  if (!pack) return null

  const examLabel = new Date(pack.examAt).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <div className="rounded-2xl border border-primary-200 dark:border-primary-900/50 bg-gradient-to-br from-primary-50 to-white dark:from-primary-950/40 dark:to-gray-950 p-5 sm:p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-600 text-white px-2.5 py-0.5 text-xs font-semibold">
          <Moon className="h-3.5 w-3.5" aria-hidden />
          {t('studentPanel.nightBefore.hero.badge')}
        </span>
        <PackStatusBadge status={pack.status} />
        <PackSourceBadge source={pack.source} />
      </div>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{pack.title}</h2>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{pack.subject}</p>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-700 dark:text-gray-200">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-primary-600 dark:text-primary-300" aria-hidden />
          {t('studentPanel.nightBefore.hero.examAt', { date: examLabel })}
        </span>
        <span className="text-gray-400">·</span>
        <span>{t('studentPanel.nightBefore.hero.estimate', { minutes: pack.estimatedMinutes })}</span>
      </div>

      <button
        type="button"
        onClick={() => navigate(`/student/night-before/${pack.id}`)}
        className="mt-5 px-5 py-2.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 font-medium"
      >
        {t('studentPanel.nightBefore.hero.cta')}
      </button>
    </div>
  )
}

export default PackHeroCard
