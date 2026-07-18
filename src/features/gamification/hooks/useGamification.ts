import { useSelector } from 'react-redux'

import {
  selectCurrentStreak,
  selectLeaderboardOptIn,
  selectLevel,
  selectLongestStreak,
  selectTotalXp,
  selectUnlockedBadges,
  selectXpProgress,
} from '@/redux/features/gamification/gamificationSelectors'

export const useGamification = () => {
  const totalXp = useSelector(selectTotalXp)
  const level = useSelector(selectLevel)
  const currentStreak = useSelector(selectCurrentStreak)
  const longestStreak = useSelector(selectLongestStreak)
  const unlockedBadgeIds = useSelector(selectUnlockedBadges)
  const leaderboardOptIn = useSelector(selectLeaderboardOptIn)
  const xpProgress = useSelector(selectXpProgress)

  return {
    totalXp,
    level,
    currentStreak,
    longestStreak,
    unlockedBadgeIds,
    leaderboardOptIn,
    xpProgress,
  }
}
