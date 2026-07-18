import type { DailyActivity } from '../types'

export const MIN_STUDY_SECONDS = 900

export const qualifiesForStreakDay = (activity: DailyActivity): boolean =>
  activity.studySeconds >= MIN_STUDY_SECONDS || activity.tasksCompleted >= 1

export const getCalendarDate = (isoString: string, timezone: string): string => {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(isoString))
  } catch {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(isoString))
  }
}

export const getTodayDate = (timezone: string): string =>
  getCalendarDate(new Date().toISOString(), timezone)

export const addDays = (dateStr: string, delta: number): string => {
  const [y, m, d] = dateStr.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  dt.setUTCDate(dt.getUTCDate() + delta)
  return dt.toISOString().slice(0, 10)
}
