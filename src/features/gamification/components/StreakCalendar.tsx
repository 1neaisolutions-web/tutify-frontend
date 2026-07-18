import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { selectDailyActivity } from '@/redux/features/gamification/gamificationSelectors'
import { addDays, getTodayDate, qualifiesForStreakDay } from '../constants/streakRules'

type RootState = { preferences: { timezone: string } }

const StreakCalendar = () => {
  const { t } = useTranslation()
  const timezone = useSelector((state: RootState) => state.preferences?.timezone ?? 'UTC')
  const dailyActivity = useSelector(selectDailyActivity)

  const days = useMemo(() => {
    const today = getTodayDate(timezone)
    const activityMap = new Map(dailyActivity.map((d) => [d.date, d]))
    return Array.from({ length: 30 }, (_, index) => {
      const offset = 29 - index
      const date = addDays(today, -offset)
      const activity = activityMap.get(date)
      const active = activity ? qualifiesForStreakDay(activity) : false
      return { date, active, activity, isToday: date === today }
    })
  }, [dailyActivity, timezone])

  const formatTooltip = (date: string, activity?: (typeof dailyActivity)[number]) => {
    if (!activity) return t('studentPanel.gamification.calendar.noActivity', { date })
    const parts: string[] = []
    if (activity.studySeconds >= 60) {
      parts.push(t('studentPanel.gamification.calendar.studyMinutes', { minutes: Math.round(activity.studySeconds / 60) }))
    }
    if (activity.tasksCompleted > 0) {
      parts.push(t('studentPanel.gamification.calendar.tasks', { count: activity.tasksCompleted }))
    }
    if (activity.xpEarned > 0) {
      parts.push(t('studentPanel.gamification.calendar.xp', { xp: activity.xpEarned }))
    }
    return parts.length
      ? `${date}: ${parts.join(' · ')}`
      : t('studentPanel.gamification.calendar.noActivity', { date })
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {t('studentPanel.gamification.calendar.title')}
        </h3>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1">
            <span className="h-3 w-3 rounded-sm bg-emerald-500/80" />
            {t('studentPanel.gamification.calendar.active')}
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-3 w-3 rounded-sm bg-gray-200 dark:bg-gray-800" />
            {t('studentPanel.gamification.calendar.inactive')}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-15 gap-1.5 sm:grid-cols-15" style={{ gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' }}>
        {days.map((day) => (
          <div
            key={day.date}
            title={formatTooltip(day.date, day.activity)}
            className={`aspect-square rounded-sm transition-transform hover:scale-110 ${
              day.active
                ? 'bg-emerald-500/85 dark:bg-emerald-500/70'
                : 'bg-gray-200 dark:bg-gray-800'
            } ${day.isToday ? 'ring-2 ring-primary-500 ring-offset-1 dark:ring-offset-gray-950' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}

export default StreakCalendar
