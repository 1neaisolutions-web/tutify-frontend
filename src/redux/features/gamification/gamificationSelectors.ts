import { createSelector } from '@reduxjs/toolkit'

import { DEMO_LEADERBOARD } from '../../../features/gamification/constants/demoLeaderboard'
import { getXpProgress } from '../../../features/gamification/constants/xpRules'
import { normalizeGamificationState } from '../../../features/gamification/storage/gamificationStorage'
import type { GamificationState } from '../../../features/gamification/types'

type RootState = { gamification: GamificationState }

export const selectGamification = (state: RootState) =>
  normalizeGamificationState(state.gamification)

export const selectTotalXp = createSelector(selectGamification, (g) => g.totalXp)

export const selectLevel = createSelector(selectGamification, (g) => g.level)

export const selectCurrentStreak = createSelector(selectGamification, (g) => g.currentStreak)

export const selectLongestStreak = createSelector(selectGamification, (g) => g.longestStreak)

export const selectUnlockedBadges = createSelector(selectGamification, (g) => g.unlockedBadgeIds)

export const selectLeaderboardOptIn = createSelector(selectGamification, (g) => g.leaderboardOptIn)

export const selectPendingBadgeUnlocks = createSelector(
  selectGamification,
  (g) => g.pendingBadgeUnlocks,
)

export const selectAnimateBadgeIds = createSelector(selectGamification, (g) => g.animateBadgeIds)

export const selectLastXpAwarded = createSelector(selectGamification, (g) => g.lastXpAwarded)

export const selectLevelUpLevel = createSelector(selectGamification, (g) => g.levelUpLevel)

export const selectDailyActivity = createSelector(selectGamification, (g) => g.dailyActivity)

export const selectLeaderboardEntries = createSelector(selectGamification, (g) => {
  const entries = g.leaderboardEntries ?? []
  return entries.length > 0 ? entries : DEMO_LEADERBOARD
})

export const selectXpProgress = createSelector(selectGamification, (g) => getXpProgress(g.totalXp))
