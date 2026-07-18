import { addDays, getTodayDate } from './streakRules'
import { calculateLevel } from './xpRules'
import type { DemoLeaderboardEntry, GamificationState } from '../types'

const SEED_BADGES = [
  'first_steps',
  'study_starter',
  'task_taker',
  'quiz_rookie',
  'streak_3',
  'quiz_ace',
] as const

export const buildSeededLeaderboard = (currentUserName: string): DemoLeaderboardEntry[] => {
  const names = [
    'Alex M.',
    'Jordan K.',
    'Sam R.',
    currentUserName || 'You',
    'Taylor P.',
    'Casey L.',
    'Riley S.',
    'Morgan D.',
    'Jamie W.',
    'Avery T.',
  ]

  const scores = [100, 97, 94, 92, 90, 87, 84, 81, 78, 75]
  const quizzes = [
    "Newton's Laws (MCQ)",
    'Photosynthesis Basics (MCQ)',
    "Newton's Laws (MCQ)",
    'Photosynthesis Basics (MCQ)',
    "Newton's Laws (MCQ)",
    'Photosynthesis Basics (MCQ)',
    "Newton's Laws (MCQ)",
    'Photosynthesis Basics (MCQ)',
    "Newton's Laws (MCQ)",
    'Photosynthesis Basics (MCQ)',
  ]
  const rankChanges: Array<'up' | 'down' | null> = [
    null,
    'up',
    'down',
    'up',
    null,
    'down',
    'up',
    null,
    'down',
    'up',
  ]

  const baseDate = new Date()
  return names.map((displayName, index) => {
    const completedAt = new Date(baseDate)
    completedAt.setDate(completedAt.getDate() - index)
    const isCurrentUser = index === 3
    return {
      id: `lb-${index + 1}`,
      rank: index + 1,
      displayName: isCurrentUser ? `${displayName} (You)` : displayName,
      quizTitle: quizzes[index],
      scorePercent: scores[index],
      completedAt: completedAt.toISOString(),
      isCurrentUser,
      rankChange: rankChanges[index],
    }
  })
}

export const buildDemoSeedState = (
  timezone: string,
  currentUserName = 'You',
): GamificationState => {
  const today = getTodayDate(timezone)
  const dailyActivity = Array.from({ length: 5 }, (_, i) => {
    const date = addDays(today, -i)
    return {
      date,
      studySeconds: 900 + i * 300,
      tasksCompleted: i % 2 === 0 ? 1 : 0,
      xpEarned: 40 + i * 10,
    }
  })

  return {
    totalXp: 750,
    level: calculateLevel(750),
    currentStreak: 5,
    longestStreak: 5,
    lastActiveDate: today,
    unlockedBadgeIds: [...SEED_BADGES],
    processedEventKeys: ['dev-seed'],
    leaderboardOptIn: true,
    pendingBadgeUnlocks: [],
    dailyActivity,
    tasksCompletedTotal: 3,
    quizzesCompletedTotal: 2,
    lastStreak7BonusAt: null,
    leaderboardEntries: buildSeededLeaderboard(currentUserName),
    lastXpAwarded: 0,
    levelUpLevel: null,
    animateBadgeIds: [],
  }
}
