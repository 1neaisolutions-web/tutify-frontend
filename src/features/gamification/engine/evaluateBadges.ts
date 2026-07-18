import { BADGE_DEFINITIONS } from '../constants/badgeDefinitions'
import type { GamificationEvent, GamificationState } from '../types'

export const evaluateBadges = (
  profile: GamificationState,
  event?: GamificationEvent,
): string[] => {
  const unlocked = new Set(profile.unlockedBadgeIds)
  const newlyUnlocked: string[] = []

  for (const badge of BADGE_DEFINITIONS) {
    if (unlocked.has(badge.id)) continue
    if (badge.check(profile, event)) {
      newlyUnlocked.push(badge.id)
      unlocked.add(badge.id)
    }
  }

  return newlyUnlocked
}
