import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Moon } from 'lucide-react'

const PackEmptyState = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 p-10 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-300">
        <Moon className="h-6 w-6" aria-hidden />
      </div>
      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.nightBefore.empty.title')}</h2>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto">{t('studentPanel.nightBefore.empty.subtitle')}</p>
      <button
        type="button"
        onClick={() => navigate('/student/night-before/create')}
        className="mt-5 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700"
      >
        {t('studentPanel.nightBefore.createCta')}
      </button>
    </div>
  )
}

export default PackEmptyState
