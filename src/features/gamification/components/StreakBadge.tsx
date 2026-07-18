import { Flame } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type StreakBadgeProps = {
  currentStreak: number
  compact?: boolean
}

const StreakBadge = ({ currentStreak, compact = false }: StreakBadgeProps) => {
  const { t } = useTranslation()

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-lg border border-orange-200 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-950/30 ${
        compact ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm'
      }`}
    >
      <Flame className={`text-orange-500 ${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
      <span className="font-medium text-orange-800 dark:text-orange-200">
        {t('studentPanel.gamification.stats.streakDays', { count: currentStreak })}
      </span>
    </div>
  )
}

export default StreakBadge
