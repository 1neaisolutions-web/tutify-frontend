import { calculateLevel } from '../constants/xpRules'
import type { GamificationState, PendingBadgeUnlock } from '../types'

export const STORAGE_KEY = 'tutify_student_gamification_v1'

export const getDefaultState = (): GamificationState => ({
  totalXp: 0,
  level: 1,
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  unlockedBadgeIds: [],
  processedEventKeys: [],
  leaderboardOptIn: false,
  pendingBadgeUnlocks: [],
  dailyActivity: [],
  tasksCompletedTotal: 0,
  quizzesCompletedTotal: 0,
  lastStreak7BonusAt: null,
  leaderboardEntries: [],
  lastXpAwarded: 0,
  levelUpLevel: null,
  animateBadgeIds: [],
})

const normalizePendingUnlocks = (value: unknown): PendingBadgeUnlock[] => {
  if (!Array.isArray(value)) return []
  return value.map((item) =>
    typeof item === 'string'
      ? { badgeId: item, xpAwarded: 0 }
      : {
          badgeId: String((item as PendingBadgeUnlock).badgeId ?? ''),
          xpAwarded: Number((item as PendingBadgeUnlock).xpAwarded ?? 0),
        },
  ).filter((item) => item.badgeId.length > 0)
}

export const normalizeGamificationState = (
  partial?: Partial<GamificationState> | null,
): GamificationState => {
  const defaults = getDefaultState()
  if (!partial || typeof partial !== 'object') return defaults

  const totalXp = Number(partial.totalXp ?? defaults.totalXp)

  return {
    ...defaults,
    ...partial,
    totalXp,
    level: calculateLevel(totalXp),
    unlockedBadgeIds: Array.isArray(partial.unlockedBadgeIds) ? partial.unlockedBadgeIds : [],
    processedEventKeys: Array.isArray(partial.processedEventKeys) ? partial.processedEventKeys : [],
    pendingBadgeUnlocks: normalizePendingUnlocks(partial.pendingBadgeUnlocks),
    dailyActivity: Array.isArray(partial.dailyActivity) ? partial.dailyActivity : [],
    leaderboardEntries: Array.isArray(partial.leaderboardEntries) ? partial.leaderboardEntries : [],
    animateBadgeIds: Array.isArray(partial.animateBadgeIds) ? partial.animateBadgeIds : [],
    lastXpAwarded: Number(partial.lastXpAwarded ?? 0),
    levelUpLevel: partial.levelUpLevel ?? null,
    tasksCompletedTotal: Number(partial.tasksCompletedTotal ?? 0),
    quizzesCompletedTotal: Number(partial.quizzesCompletedTotal ?? 0),
    currentStreak: Number(partial.currentStreak ?? 0),
    longestStreak: Number(partial.longestStreak ?? 0),
    leaderboardOptIn: Boolean(partial.leaderboardOptIn),
  }
}

const isValidState = (value: unknown): value is Partial<GamificationState> => {
  if (!value || typeof value !== 'object') return false
  const s = value as Partial<GamificationState>
  return typeof s.totalXp === 'number' && Array.isArray(s.unlockedBadgeIds)
}

export const loadGamificationState = (): GamificationState => {
  if (typeof window === 'undefined') return getDefaultState()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return getDefaultState()
    const parsed = JSON.parse(raw)
    if (!isValidState(parsed)) return getDefaultState()
    return normalizeGamificationState(parsed)
  } catch {
    return getDefaultState()
  }
}

export const saveGamificationState = (state: GamificationState): void => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeGamificationState(state)))
  } catch {
    // ignore quota errors
  }
}
