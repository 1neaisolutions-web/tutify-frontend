import type { GamificationEvent } from '../types'
import { calculateEventXp, DAILY_XP_CAP } from '../constants/xpRules'

export const calculateXp = (
  event: GamificationEvent,
  dailyXpEarned: number,
): number => {
  const raw = calculateEventXp(event)
  if (raw <= 0) return 0
  const remaining = DAILY_XP_CAP - dailyXpEarned
  if (remaining <= 0) return 0
  return Math.min(raw, remaining)
}
