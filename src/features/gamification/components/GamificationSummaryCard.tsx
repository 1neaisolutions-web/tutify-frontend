import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Trophy } from 'lucide-react'

import { useGamification } from '../hooks/useGamification'
import StreakBadge from './StreakBadge'
import XpProgressBar from './XpProgressBar'

const GamificationSummaryCard = () => {
  const { t } = useTranslation()
  const { totalXp, level, currentStreak, xpProgress } = useGamification()

  return (
    <Link
      to="/student/gamification"
      className="block rounded-xl border border-gray-200 dark:border-gray-800 bg-gradient-to-r from-primary-50/80 to-white dark:from-primary-950/30 dark:to-gray-950 p-3 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
          <Trophy className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          {t('studentPanel.gamification.summary.title')}
        </div>
        <StreakBadge currentStreak={currentStreak} compact />
      </div>
      <XpProgressBar totalXp={totalXp} level={level} percent={xpProgress.percent} compact />
    </Link>
  )
}

export default GamificationSummaryCard
