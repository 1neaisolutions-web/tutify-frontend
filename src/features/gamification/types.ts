export type GamificationEventType =
  | 'study_session_saved'
  | 'task_completed'
  | 'quiz_completed'

export interface GamificationEvent {
  type: GamificationEventType
  payload: Record<string, unknown>
  idempotencyKey: string
  occurredAt: string
}

export interface DailyActivity {
  date: string
  studySeconds: number
  tasksCompleted: number
  xpEarned: number
}

export interface GamificationState {
  totalXp: number
  level: number
  currentStreak: number
  longestStreak: number
  lastActiveDate: string | null
  unlockedBadgeIds: string[]
  processedEventKeys: string[]
  leaderboardOptIn: boolean
  pendingBadgeUnlocks: PendingBadgeUnlock[]
  dailyActivity: DailyActivity[]
  tasksCompletedTotal: number
  quizzesCompletedTotal: number
  lastStreak7BonusAt: string | null
  leaderboardEntries: DemoLeaderboardEntry[]
  lastXpAwarded: number
  levelUpLevel: number | null
  animateBadgeIds: string[]
}

export interface BadgeDefinition {
  id: string
  nameKey: string
  descriptionKey: string
  icon: string
  check: (profile: GamificationState, event?: GamificationEvent) => boolean
}

export interface ProcessEventResult {
  state: GamificationState
  xpAwarded: number
  newBadges: string[]
  streakExtended: boolean
  duplicate: boolean
}

export interface StreakResult {
  currentStreak: number
  longestStreak: number
  lastActiveDate: string | null
  streakExtendedToday: boolean
}

export interface PendingBadgeUnlock {
  badgeId: string
  xpAwarded: number
}

export interface DemoLeaderboardEntry {
  rank: number
  displayName: string
  quizTitle: string
  scorePercent: number
  completedAt: string
  id?: string
  isCurrentUser?: boolean
  rankChange?: 'up' | 'down' | null
}
