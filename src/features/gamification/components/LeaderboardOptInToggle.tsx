import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { setLeaderboardOptIn } from '@/redux/features/gamification/gamificationSlice'
import { selectLeaderboardOptIn } from '@/redux/features/gamification/gamificationSelectors'

const LeaderboardOptInToggle = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const optedIn = useSelector(selectLeaderboardOptIn)

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 space-y-3">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={optedIn}
          onChange={(e) => dispatch(setLeaderboardOptIn(e.target.checked))}
          className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {t('studentPanel.gamification.leaderboard.optInLabel')}
          </p>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
            {t('studentPanel.gamification.leaderboard.optInDescription')}
          </p>
        </div>
      </label>
    </div>
  )
}

export default LeaderboardOptInToggle
