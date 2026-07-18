import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { resetGamification, seedDemoData } from '@/redux/features/gamification/gamificationSlice'

type RootState = {
  auth: { user?: { first_name?: string; full_name?: string } }
  preferences: { timezone: string }
}

const DevToolsPanel = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const timezone = useSelector((state: RootState) => state.preferences?.timezone ?? 'UTC')
  const displayName = useSelector((state: RootState) => {
    const user = state.auth?.user
    return user?.first_name || user?.full_name?.split(' ')[0] || 'You'
  })

  if (!import.meta.env.DEV) return null

  return (
    <div className="rounded-xl border border-dashed border-violet-300 dark:border-violet-800 bg-violet-50/60 dark:bg-violet-950/20 p-4 space-y-3">
      <div>
        <p className="text-sm font-semibold text-violet-900 dark:text-violet-200">
          {t('studentPanel.gamification.devTools.title')}
        </p>
        <p className="text-xs text-violet-700/80 dark:text-violet-300/80 mt-1">
          {t('studentPanel.gamification.devTools.subtitle')}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => dispatch(seedDemoData({ timezone, displayName }))}
          className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors"
        >
          {t('studentPanel.gamification.devTools.seed')}
        </button>
        <button
          type="button"
          onClick={() => dispatch(resetGamification())}
          className="px-4 py-2 rounded-lg border border-violet-300 dark:border-violet-700 text-violet-800 dark:text-violet-200 text-sm font-medium hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors"
        >
          {t('studentPanel.gamification.devTools.reset')}
        </button>
      </div>
    </div>
  )
}

export default DevToolsPanel
