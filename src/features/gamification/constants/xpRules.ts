import type { GamificationEvent } from '../types'
import { MIN_STUDY_SECONDS } from './streakRules'

export const DAILY_XP_CAP = 300

export const XP_STREAK_DAILY = 15
export const XP_STREAK_7_BONUS = 50

export const calculateLevel = (totalXp: number): number =>
  Math.floor(Math.sqrt(totalXp / 100)) + 1

export const xpForLevel = (level: number): number => {
  if (level <= 1) return 0
  return (level - 1) ** 2 * 100
}

export const xpForNextLevel = (level: number): number => level ** 2 * 100

export const getXpProgress = (totalXp: number): { level: number; percent: number; current: number; needed: number } => {
  const level = calculateLevel(totalXp)
  const currentLevelXp = xpForLevel(level)
  const nextLevelXp = xpForNextLevel(level)
  const span = nextLevelXp - currentLevelXp
  const current = totalXp - currentLevelXp
  const percent = span > 0 ? Math.min(100, Math.round((current / span) * 100)) : 100
  return { level, percent, current, needed: span }
}

export const calculateEventXp = (event: GamificationEvent): number => {
  switch (event.type) {
    case 'study_session_saved': {
      const seconds = Number(event.payload.seconds ?? 0)
      if (seconds < MIN_STUDY_SECONDS) return 0
      const base = 10
      const durationBonus = Math.floor(seconds / 300)
      return Math.min(50, base + durationBonus)
    }
    case 'task_completed':
      return 25
    case 'quiz_completed': {
      const scorePercent = Number(event.payload.scorePercent ?? 0)
      const bonus = Math.min(10, Math.round(scorePercent / 10))
      return 30 + bonus
    }
    default:
      return 0
  }
}
