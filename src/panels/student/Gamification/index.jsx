import { useTranslation } from 'react-i18next'

import {
  BadgeGrid,
  DevToolsPanel,
  LeaderboardPanel,
  StreakBadge,
  StreakCalendar,
  useGamification,
  XpProgressBar,
} from '@/features/gamification'

const Gamification = () => {
  const { t } = useTranslation()
  const {
    totalXp,
    level,
    currentStreak,
    longestStreak,
    unlockedBadgeIds,
    xpProgress,
  } = useGamification()

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {t('studentPanel.gamification.title')}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {t('studentPanel.gamification.subtitle')}
        </p>
      </div>

      <div className="px-6 py-6 max-w-5xl space-y-8">
        <DevToolsPanel />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <p className="text-xs text-gray-500">{t('studentPanel.gamification.stats.totalXpLabel')}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">{totalXp}</p>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <p className="text-xs text-gray-500">{t('studentPanel.gamification.stats.levelLabel')}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">{level}</p>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <p className="text-xs text-gray-500">{t('studentPanel.gamification.stats.currentStreak')}</p>
            <div className="mt-2">
              <StreakBadge currentStreak={currentStreak} />
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <p className="text-xs text-gray-500">{t('studentPanel.gamification.stats.longestStreak')}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {t('studentPanel.gamification.stats.streakDays', { count: longestStreak })}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <XpProgressBar totalXp={totalXp} level={level} percent={xpProgress.percent} />
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <StreakCalendar />
        </div>

        <section className="space-y-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {t('studentPanel.gamification.badgesTitle')}
          </h2>
          <BadgeGrid unlockedBadgeIds={unlockedBadgeIds} />
        </section>

        <section className="space-y-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {t('studentPanel.gamification.leaderboardTitle')}
          </h2>
          <LeaderboardPanel />
        </section>
      </div>
    </div>
  )
}

export default Gamification
