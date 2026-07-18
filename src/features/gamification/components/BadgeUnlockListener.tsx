import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import {
  clearAnimateBadgeIds,
  clearPendingBadgeUnlocks,
  isStreakMilestoneBadge,
} from '@/redux/features/gamification/gamificationSlice'
import { selectPendingBadgeUnlocks } from '@/redux/features/gamification/gamificationSelectors'
import { getBadgeById } from '../constants/badgeDefinitions'
import ConfettiBurst from './ConfettiBurst'

const BadgeUnlockListener = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const pending = useSelector(selectPendingBadgeUnlocks)
  const shownRef = useRef<string[]>([])
  const [toast, setToast] = useState<{
    badgeId: string
    icon: string
    name: string
    xpAwarded: number
  } | null>(null)
  const [confetti, setConfetti] = useState(false)

  useEffect(() => {
    if (!pending.length) {
      shownRef.current = []
      return
    }

    const fresh = pending.filter((item) => !shownRef.current.includes(item.badgeId))
    if (!fresh.length) return

    const next = fresh[0]
    const badge = getBadgeById(next.badgeId)
    if (!badge) return

    shownRef.current.push(next.badgeId)
    setToast({
      badgeId: next.badgeId,
      icon: badge.icon,
      name: t(badge.nameKey),
      xpAwarded: next.xpAwarded,
    })

    if (isStreakMilestoneBadge(next.badgeId)) {
      setConfetti(true)
    }

    const timer = window.setTimeout(() => {
      setToast(null)
      if (fresh.length <= 1) {
        dispatch(clearPendingBadgeUnlocks())
        dispatch(clearAnimateBadgeIds())
      }
    }, 3200)

    return () => window.clearTimeout(timer)
  }, [pending, dispatch, t])

  if (!toast && !confetti) return null

  return (
    <>
      <ConfettiBurst active={confetti} onComplete={() => setConfetti(false)} />
      {toast ? (
        <div className="fixed top-24 left-1/2 z-[110] -translate-x-1/2 animate-badge-toast">
          <div className="flex items-center gap-3 rounded-2xl border border-primary-200 dark:border-primary-800 bg-white dark:bg-gray-950 px-4 py-3 shadow-xl shadow-primary-500/10 min-w-[280px]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-950/40 text-2xl ring-2 ring-primary-200 dark:ring-primary-800">
              {toast.icon}
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-primary-600 dark:text-primary-400">
                {t('studentPanel.gamification.badgeUnlockedTitle')}
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{toast.name}</p>
              {toast.xpAwarded > 0 ? (
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  {t('studentPanel.gamification.xpEarned', { xp: toast.xpAwarded })}
                </p>
              ) : null}
            </div>
          </div>
          <style>{`
            @keyframes badge-toast-in {
              0% { opacity: 0; transform: translate(-50%, -12px) scale(0.95); }
              100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
            }
            .animate-badge-toast {
              animation: badge-toast-in 0.35s ease-out forwards;
            }
          `}</style>
        </div>
      ) : null}
    </>
  )
}

export default BadgeUnlockListener
