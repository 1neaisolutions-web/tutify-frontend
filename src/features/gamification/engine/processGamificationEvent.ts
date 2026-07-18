import { getCalendarDate, qualifiesForStreakDay } from '../constants/streakRules'
import {
  calculateLevel,
  DAILY_XP_CAP,
  XP_STREAK_7_BONUS,
  XP_STREAK_DAILY,
} from '../constants/xpRules'
import type { DailyActivity, GamificationEvent, GamificationState, ProcessEventResult } from '../types'
import { calculateXp } from './calculateXp'
import { evaluateBadges } from './evaluateBadges'
import { evaluateStreak } from './evaluateStreak'

const MAX_EVENT_KEYS = 500
const MAX_DAILY_ACTIVITY_DAYS = 90

const upsertDailyActivity = (
  dailyActivity: DailyActivity[],
  date: string,
  patch: Partial<DailyActivity>,
): DailyActivity[] => {
  const idx = dailyActivity.findIndex((d) => d.date === date)
  if (idx >= 0) {
    const next = [...dailyActivity]
    next[idx] = { ...next[idx], ...patch }
    return next
  }
  return [{ date, studySeconds: 0, tasksCompleted: 0, xpEarned: 0, ...patch }, ...dailyActivity]
}

const trimDailyActivity = (dailyActivity: DailyActivity[]): DailyActivity[] =>
  dailyActivity
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, MAX_DAILY_ACTIVITY_DAYS)

const awardBonusXp = (
  dailyActivity: DailyActivity[],
  eventDate: string,
  amount: number,
): { dailyActivity: DailyActivity[]; awarded: number } => {
  const dayRecord = dailyActivity.find((d) => d.date === eventDate)
  const dailyXpEarned = dayRecord?.xpEarned ?? 0
  const remaining = DAILY_XP_CAP - dailyXpEarned
  const awarded = Math.min(amount, remaining)
  if (awarded <= 0) return { dailyActivity, awarded: 0 }
  const next = trimDailyActivity(
    upsertDailyActivity(dailyActivity, eventDate, { xpEarned: dailyXpEarned + awarded }),
  )
  return { dailyActivity: next, awarded }
}

export const processGamificationEvent = (
  state: GamificationState,
  event: GamificationEvent,
  timezone: string,
): ProcessEventResult => {
  if (state.processedEventKeys.includes(event.idempotencyKey)) {
    return { state, xpAwarded: 0, newBadges: [], streakExtended: false, duplicate: true }
  }

  const eventDate = getCalendarDate(event.occurredAt, timezone)
  const prevDay = state.dailyActivity.find((d) => d.date === eventDate)
  const wasQualifyingBefore = prevDay ? qualifiesForStreakDay(prevDay) : false

  let dailyActivity = [...state.dailyActivity]
  let tasksCompletedTotal = state.tasksCompletedTotal
  let quizzesCompletedTotal = state.quizzesCompletedTotal

  if (event.type === 'study_session_saved') {
    const seconds = Number(event.payload.seconds ?? 0)
    dailyActivity = upsertDailyActivity(dailyActivity, eventDate, {
      studySeconds: (prevDay?.studySeconds ?? 0) + seconds,
    })
  }

  if (event.type === 'task_completed') {
    dailyActivity = upsertDailyActivity(dailyActivity, eventDate, {
      tasksCompleted: (prevDay?.tasksCompleted ?? 0) + 1,
    })
    tasksCompletedTotal += 1
  }

  if (event.type === 'quiz_completed') {
    quizzesCompletedTotal += 1
  }

  dailyActivity = trimDailyActivity(dailyActivity)

  const dayAfterUpdate = dailyActivity.find((d) => d.date === eventDate)
  const dailyXpEarned = dayAfterUpdate?.xpEarned ?? 0
  let xpAwarded = calculateXp(event, dailyXpEarned)

  if (xpAwarded > 0) {
    dailyActivity = trimDailyActivity(
      upsertDailyActivity(dailyActivity, eventDate, {
        xpEarned: dailyXpEarned + xpAwarded,
      }),
    )
  }

  let totalXp = state.totalXp + xpAwarded
  let lastStreak7BonusAt = state.lastStreak7BonusAt

  const isQualifyingNow = dayAfterUpdate ? qualifiesForStreakDay(dayAfterUpdate) : false
  const dayFirstQualify = isQualifyingNow && !wasQualifyingBefore

  if (dayFirstQualify) {
    const streakBonus = awardBonusXp(dailyActivity, eventDate, XP_STREAK_DAILY)
    dailyActivity = streakBonus.dailyActivity
    xpAwarded += streakBonus.awarded
    totalXp += streakBonus.awarded
  }

  let workingState: GamificationState = {
    ...state,
    totalXp,
    level: calculateLevel(totalXp),
    dailyActivity,
    tasksCompletedTotal,
    quizzesCompletedTotal,
    lastStreak7BonusAt,
    processedEventKeys: [...state.processedEventKeys, event.idempotencyKey].slice(-MAX_EVENT_KEYS),
  }

  const streakAfter = evaluateStreak(dailyActivity, timezone, state.longestStreak)
  workingState = {
    ...workingState,
    currentStreak: streakAfter.currentStreak,
    longestStreak: streakAfter.longestStreak,
    lastActiveDate: streakAfter.lastActiveDate,
  }

  const streakExtended = dayFirstQualify && streakAfter.currentStreak > 0

  if (
    dayFirstQualify &&
    streakAfter.currentStreak >= 7 &&
    streakAfter.currentStreak % 7 === 0 &&
    lastStreak7BonusAt !== eventDate
  ) {
    const sevenBonus = awardBonusXp(dailyActivity, eventDate, XP_STREAK_7_BONUS)
    dailyActivity = sevenBonus.dailyActivity
    xpAwarded += sevenBonus.awarded
    totalXp += sevenBonus.awarded
    lastStreak7BonusAt = eventDate
    workingState = {
      ...workingState,
      totalXp,
      level: calculateLevel(totalXp),
      dailyActivity,
      lastStreak7BonusAt,
    }
  }

  const newBadges = evaluateBadges(workingState, event)
  workingState = {
    ...workingState,
    unlockedBadgeIds: [...workingState.unlockedBadgeIds, ...newBadges],
  }

  return {
    state: workingState,
    xpAwarded,
    newBadges,
    streakExtended,
    duplicate: false,
  }
}
