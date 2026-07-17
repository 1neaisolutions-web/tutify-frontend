import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const PackErrorState = ({ message, onRetry, showStudyLink = true }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-5 space-y-3">
      <h3 className="font-semibold text-red-800 dark:text-red-200">{t('studentPanel.nightBefore.error.title')}</h3>
      <p className="text-sm text-red-700 dark:text-red-300">{message || t('studentPanel.nightBefore.error.default')}</p>
      <div className="flex flex-wrap gap-2">
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700"
          >
            {t('studentPanel.nightBefore.error.retry')}
          </button>
        ) : null}
        {showStudyLink ? (
          <button
            type="button"
            onClick={() => navigate('/student/content')}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-white dark:hover:bg-gray-900"
          >
            {t('studentPanel.nightBefore.error.studyMaterials')}
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default PackErrorState
