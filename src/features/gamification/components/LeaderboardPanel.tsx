import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { ArrowDown, ArrowUp, Minus } from 'lucide-react'

import { selectLeaderboardEntries } from '@/redux/features/gamification/gamificationSelectors'
import LeaderboardOptInToggle from './LeaderboardOptInToggle'

const LeaderboardPanel = () => {
  const { t } = useTranslation()
  const entries = useSelector(selectLeaderboardEntries)
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    setVisibleCount(0)
    const timers: number[] = []
    entries.forEach((_, index) => {
      timers.push(
        window.setTimeout(() => {
          setVisibleCount((count) => Math.max(count, index + 1))
        }, 80 * (index + 1)),
      )
    })
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [entries])

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/30 px-4 py-3">
        <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
          {t('studentPanel.gamification.leaderboard.demoBanner')}
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900/50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">{t('studentPanel.gamification.leaderboard.rank')}</th>
              <th className="px-4 py-3">{t('studentPanel.gamification.leaderboard.student')}</th>
              <th className="px-4 py-3">{t('studentPanel.gamification.leaderboard.quiz')}</th>
              <th className="px-4 py-3">{t('studentPanel.gamification.leaderboard.score')}</th>
              <th className="px-4 py-3">{t('studentPanel.gamification.leaderboard.date')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {entries.map((entry, index) => {
              const isVisible = index < visibleCount
              return (
                <tr
                  key={entry.id ?? entry.rank}
                  className={`transition-all duration-300 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  } ${
                    entry.isCurrentUser
                      ? 'bg-primary-50/80 dark:bg-primary-950/30 ring-1 ring-inset ring-primary-200 dark:ring-primary-800'
                      : 'bg-white dark:bg-gray-950'
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                    <div className="flex items-center gap-2">
                      <span>#{entry.rank}</span>
                      {entry.rankChange === 'up' ? (
                        <ArrowUp className="h-3.5 w-3.5 text-emerald-500" aria-label={t('studentPanel.gamification.leaderboard.rankUp')} />
                      ) : null}
                      {entry.rankChange === 'down' ? (
                        <ArrowDown className="h-3.5 w-3.5 text-red-500" aria-label={t('studentPanel.gamification.leaderboard.rankDown')} />
                      ) : null}
                      {!entry.rankChange ? (
                        <Minus className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600" aria-hidden="true" />
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-200 font-medium">
                    {entry.displayName}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-200">{entry.quizTitle}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-200">{entry.scorePercent}%</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(entry.completedAt).toLocaleDateString()}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <LeaderboardOptInToggle />
    </div>
  )
}

export default LeaderboardPanel
