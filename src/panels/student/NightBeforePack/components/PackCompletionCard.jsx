import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'

const PackCompletionCard = ({ score, total, onAskCopilot }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const percent = total ? Math.round((score / total) * 100) : 0

  return (
    <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/20 p-5 space-y-4">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden />
        <div>
          <h2 className="font-semibold text-emerald-900 dark:text-emerald-100">{t('studentPanel.nightBefore.completion.title')}</h2>
          <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-200">
            {t('studentPanel.nightBefore.completion.score', { score, total, percent })}
          </p>
          <p className="mt-2 text-sm text-emerald-800/90 dark:text-emerald-200/90">{t('studentPanel.nightBefore.completion.message')}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onAskCopilot}
          className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700"
        >
          {t('studentPanel.nightBefore.completion.askCopilot')}
        </button>
        <button
          type="button"
          onClick={() => navigate('/student/doubt-solver')}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          {t('studentPanel.nightBefore.completion.doubtSolver')}
        </button>
        <button
          type="button"
          onClick={() => navigate('/student/night-before')}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          {t('studentPanel.nightBefore.completion.backHub')}
        </button>
      </div>
    </div>
  )
}

export default PackCompletionCard
