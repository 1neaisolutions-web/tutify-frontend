import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { REHYDRATE } from 'redux-persist'

import { buildDemoSeedState } from '../../../features/gamification/constants/devSeedData'
import { evaluateBadges } from '../../../features/gamification/engine/evaluateBadges'
import { processGamificationEvent } from '../../../features/gamification/engine/processGamificationEvent'
import {
  getDefaultState,
  loadGamificationState,
  normalizeGamificationState,
  saveGamificationState,
} from '../../../features/gamification/storage/gamificationStorage'
import type { GamificationEvent, GamificationState, PendingBadgeUnlock } from '../../../features/gamification/types'

const STREAK_MILESTONE_BADGES = new Set(['streak_3', 'streak_7', 'streak_30'])

const toPendingUnlocks = (badgeIds: string[], xpAwarded: number): PendingBadgeUnlock[] =>
  badgeIds.map((badgeId, index) => ({
    badgeId,
    xpAwarded: index === 0 ? xpAwarded : 0,
  }))

const initialState: GamificationState = loadGamificationState()

const gamificationSlice = createSlice({
  name: 'gamification',
  initialState,
  reducers: {
    recordEvent: (
      state,
      action: PayloadAction<{ event: GamificationEvent; timezone: string }>,
    ) => {
      const normalized = normalizeGamificationState(state)
      const { event, timezone } = action.payload
      const prevLevel = normalized.level
      const result = processGamificationEvent(normalized, event, timezone)
      if (!result.duplicate) {
        const next = {
          ...result.state,
          lastXpAwarded: result.xpAwarded,
          levelUpLevel: result.state.level > prevLevel ? result.state.level : null,
          animateBadgeIds: result.newBadges,
          pendingBadgeUnlocks: toPendingUnlocks(result.newBadges, result.xpAwarded),
        }
        saveGamificationState(next)
        return next
      }
      return { ...state, lastXpAwarded: 0 }
    },
    setLeaderboardOptIn: (state, action: PayloadAction<boolean>) => {
      const base = normalizeGamificationState(state)
      const next = { ...base, leaderboardOptIn: action.payload }
      const newBadges = evaluateBadges(next)
      next.unlockedBadgeIds = [...next.unlockedBadgeIds, ...newBadges]
      next.animateBadgeIds = newBadges
      next.pendingBadgeUnlocks = toPendingUnlocks(newBadges, 0)
      saveGamificationState(next)
      return next
    },
    clearPendingBadgeUnlocks: (state) => {
      const next = { ...state, pendingBadgeUnlocks: [] }
      saveGamificationState(next)
      return next
    },
    clearAnimateBadgeIds: (state) => {
      const next = { ...state, animateBadgeIds: [] }
      saveGamificationState(next)
      return next
    },
    clearLevelUpTrigger: (state) => {
      const next = { ...state, levelUpLevel: null }
      saveGamificationState(next)
      return next
    },
    clearLastXpAwarded: (state) => {
      const next = { ...state, lastXpAwarded: 0 }
      saveGamificationState(next)
      return next
    },
    seedDemoData: (state, action: PayloadAction<{ timezone: string; displayName?: string }>) => {
      const next = buildDemoSeedState(action.payload.timezone, action.payload.displayName)
      saveGamificationState(next)
      return next
    },
    hydrateFromStorage: () => loadGamificationState(),
    resetGamification: () => {
      const next = getDefaultState()
      saveGamificationState(next)
      return next
    },
  },
  extraReducers: (builder) => {
    builder.addCase(REHYDRATE, (state, action) => {
      const incoming = (action.payload as { gamification?: Partial<GamificationState> } | undefined)
        ?.gamification
      return normalizeGamificationState(incoming ?? state)
    })
  },
})

export const isStreakMilestoneBadge = (badgeId: string): boolean =>
  STREAK_MILESTONE_BADGES.has(badgeId)

export const {
  recordEvent,
  setLeaderboardOptIn,
  clearPendingBadgeUnlocks,
  clearAnimateBadgeIds,
  clearLevelUpTrigger,
  clearLastXpAwarded,
  seedDemoData,
  hydrateFromStorage,
  resetGamification,
} = gamificationSlice.actions

export default gamificationSlice.reducer
