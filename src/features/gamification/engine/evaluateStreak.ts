import { addDays, getTodayDate, qualifiesForStreakDay } from '../constants/streakRules'
import type { DailyActivity, StreakResult } from '../types'

export const evaluateStreak = (
  dailyActivity: DailyActivity[],
  timezone: string,
  previousLongest: number,
): StreakResult => {
  const qualifyingDates = new Set(
    dailyActivity.filter(qualifiesForStreakDay).map((d) => d.date),
  )

  if (qualifyingDates.size === 0) {
    return {
      currentStreak: 0,
      longestStreak: previousLongest,
      lastActiveDate: null,
      streakExtendedToday: false,
    }
  }

  const today = getTodayDate(timezone)
  const yesterday = addDays(today, -1)

  let startDate: string | null = null
  if (qualifyingDates.has(today)) {
    startDate = today
  } else if (qualifyingDates.has(yesterday)) {
    startDate = yesterday
  } else {
    return {
      currentStreak: 0,
      longestStreak: previousLongest,
      lastActiveDate: null,
      streakExtendedToday: false,
    }
  }

  let streak = 0
  let cursor = startDate
  while (qualifyingDates.has(cursor)) {
    streak += 1
    cursor = addDays(cursor, -1)
  }

  const sortedDates = [...qualifyingDates].sort()
  const lastActiveDate = sortedDates[sortedDates.length - 1] ?? null

  let longestStreak = previousLongest
  if (streak > longestStreak) longestStreak = streak

  // Also compute all-time longest from activity log
  let run = 0
  let maxRun = 0
  const allDates = sortedDates
  for (let i = 0; i < allDates.length; i++) {
    if (i === 0) {
      run = 1
    } else {
      const prev = allDates[i - 1]
      const curr = allDates[i]
      const expected = addDays(prev, 1)
      run = curr === expected ? run + 1 : 1
    }
    if (run > maxRun) maxRun = run
  }
  if (maxRun > longestStreak) longestStreak = maxRun

  return {
    currentStreak: streak,
    longestStreak,
    lastActiveDate,
    streakExtendedToday: qualifyingDates.has(today),
  }
}
