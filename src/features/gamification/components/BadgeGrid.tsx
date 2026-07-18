import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { selectAnimateBadgeIds } from '@/redux/features/gamification/gamificationSelectors'
import { BADGE_DEFINITIONS } from '../constants/badgeDefinitions'

type BadgeGridProps = {
  unlockedBadgeIds: string[]
}

const BadgeGrid = ({ unlockedBadgeIds }: BadgeGridProps) => {
  const { t } = useTranslation()
  const animateBadgeIds = useSelector(selectAnimateBadgeIds)
  const unlocked = new Set(unlockedBadgeIds)
  const [glowingIds, setGlowingIds] = useState<string[]>([])

  useEffect(() => {
    if (!animateBadgeIds.length) return
    setGlowingIds(animateBadgeIds)
    const timer = window.setTimeout(() => setGlowingIds([]), 1600)
    return () => window.clearTimeout(timer)
  }, [animateBadgeIds])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {BADGE_DEFINITIONS.map((badge) => {
        const isUnlocked = unlocked.has(badge.id)
        const isGlowing = glowingIds.includes(badge.id)
        return (
          <div
            key={badge.id}
            className={`rounded-xl border p-3 text-center transition-all duration-500 ${
              isUnlocked
                ? 'border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-950/20'
                : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 opacity-70'
            } ${isGlowing ? 'scale-105 shadow-lg shadow-primary-400/30 ring-2 ring-primary-300 dark:ring-primary-700 animate-badge-pop' : ''}`}
          >
            <div className={`text-2xl mb-2 ${isUnlocked ? '' : 'grayscale'}`}>{badge.icon}</div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{t(badge.nameKey)}</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
              {t(badge.descriptionKey)}
            </p>
          </div>
        )
      })}
      <style>{`
        @keyframes badge-pop {
          0% { transform: scale(0.92); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1.05); }
        }
        .animate-badge-pop {
          animation: badge-pop 0.55s ease-out;
        }
      `}</style>
    </div>
  )
}

export default BadgeGrid
