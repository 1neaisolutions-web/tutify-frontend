import type { BadgeDefinition, GamificationEvent, GamificationState } from '../types'
import { MIN_STUDY_SECONDS } from './streakRules'

const studySeconds = (event?: GamificationEvent) => Number(event?.payload.seconds ?? 0)
const scorePercent = (event?: GamificationEvent) => Number(event?.payload.scorePercent ?? 0)

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'first_steps',
    nameKey: 'studentPanel.gamification.badges.first_steps.name',
    descriptionKey: 'studentPanel.gamification.badges.first_steps.description',
    icon: '🌟',
    check: (p) => p.totalXp > 0,
  },
  {
    id: 'study_starter',
    nameKey: 'studentPanel.gamification.badges.study_starter.name',
    descriptionKey: 'studentPanel.gamification.badges.study_starter.description',
    icon: '📚',
    check: (p, e) =>
      p.dailyActivity.some((d) => d.studySeconds >= MIN_STUDY_SECONDS) ||
      (e?.type === 'study_session_saved' && studySeconds(e) >= MIN_STUDY_SECONDS),
  },
  {
    id: 'task_taker',
    nameKey: 'studentPanel.gamification.badges.task_taker.name',
    descriptionKey: 'studentPanel.gamification.badges.task_taker.description',
    icon: '✅',
    check: (p) => p.tasksCompletedTotal >= 1,
  },
  {
    id: 'quiz_rookie',
    nameKey: 'studentPanel.gamification.badges.quiz_rookie.name',
    descriptionKey: 'studentPanel.gamification.badges.quiz_rookie.description',
    icon: '📝',
    check: (p) => p.quizzesCompletedTotal >= 1,
  },
  {
    id: 'streak_3',
    nameKey: 'studentPanel.gamification.badges.streak_3.name',
    descriptionKey: 'studentPanel.gamification.badges.streak_3.description',
    icon: '🔥',
    check: (p) => p.currentStreak >= 3 || p.longestStreak >= 3,
  },
  {
    id: 'streak_7',
    nameKey: 'studentPanel.gamification.badges.streak_7.name',
    descriptionKey: 'studentPanel.gamification.badges.streak_7.description',
    icon: '⚡',
    check: (p) => p.currentStreak >= 7 || p.longestStreak >= 7,
  },
  {
    id: 'streak_30',
    nameKey: 'studentPanel.gamification.badges.streak_30.name',
    descriptionKey: 'studentPanel.gamification.badges.streak_30.description',
    icon: '🏆',
    check: (p) => p.currentStreak >= 30 || p.longestStreak >= 30,
  },
  {
    id: 'study_marathon',
    nameKey: 'studentPanel.gamification.badges.study_marathon.name',
    descriptionKey: 'studentPanel.gamification.badges.study_marathon.description',
    icon: '⏱️',
    check: (p, e) =>
      p.dailyActivity.some((d) => d.studySeconds >= 3600) ||
      (e?.type === 'study_session_saved' && studySeconds(e) >= 3600),
  },
  {
    id: 'task_master_10',
    nameKey: 'studentPanel.gamification.badges.task_master_10.name',
    descriptionKey: 'studentPanel.gamification.badges.task_master_10.description',
    icon: '🎯',
    check: (p) => p.tasksCompletedTotal >= 10,
  },
  {
    id: 'quiz_ace',
    nameKey: 'studentPanel.gamification.badges.quiz_ace.name',
    descriptionKey: 'studentPanel.gamification.badges.quiz_ace.description',
    icon: '🎓',
    check: (p, e) =>
      e?.type === 'quiz_completed' ? scorePercent(e) >= 90 : false,
  },
  {
    id: 'perfect_score',
    nameKey: 'studentPanel.gamification.badges.perfect_score.name',
    descriptionKey: 'studentPanel.gamification.badges.perfect_score.description',
    icon: '💯',
    check: (p, e) =>
      e?.type === 'quiz_completed' ? scorePercent(e) >= 100 : false,
  },
  {
    id: 'xp_500',
    nameKey: 'studentPanel.gamification.badges.xp_500.name',
    descriptionKey: 'studentPanel.gamification.badges.xp_500.description',
    icon: '⭐',
    check: (p) => p.totalXp >= 500,
  },
  {
    id: 'xp_2000',
    nameKey: 'studentPanel.gamification.badges.xp_2000.name',
    descriptionKey: 'studentPanel.gamification.badges.xp_2000.description',
    icon: '🌠',
    check: (p) => p.totalXp >= 2000,
  },
  {
    id: 'leaderboard_member',
    nameKey: 'studentPanel.gamification.badges.leaderboard_member.name',
    descriptionKey: 'studentPanel.gamification.badges.leaderboard_member.description',
    icon: '🤝',
    check: (p) => p.leaderboardOptIn,
  },
]

export const getBadgeById = (id: string): BadgeDefinition | undefined =>
  BADGE_DEFINITIONS.find((b) => b.id === id)
