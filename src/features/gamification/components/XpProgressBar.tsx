import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import {
  clearLastXpAwarded,
  clearLevelUpTrigger,
} from '@/redux/features/gamification/gamificationSlice'
import {
  selectLastXpAwarded,
  selectLevelUpLevel,
} from '@/redux/features/gamification/gamificationSelectors'

type XpProgressBarProps = {
  totalXp: number
  level: number
  percent?: number
  compact?: boolean
}

const XpProgressBar = ({ totalXp, level, percent = 0, compact = false }: XpProgressBarProps) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const lastXpAwarded = useSelector(selectLastXpAwarded)
  const levelUpLevel = useSelector(selectLevelUpLevel)
  const [displayPercent, setDisplayPercent] = useState(percent)
  const [floatXp, setFloatXp] = useState<number | null>(null)
  const [levelPulse, setLevelPulse] = useState(false)
  const prevPercent = useRef(percent)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setDisplayPercent(percent))
    return () => window.cancelAnimationFrame(frame)
  }, [percent])

  useEffect(() => {
    if (lastXpAwarded > 0) {
      setFloatXp(lastXpAwarded)
      const timer = window.setTimeout(() => {
        setFloatXp(null)
        dispatch(clearLastXpAwarded())
      }, 1400)
      return () => window.clearTimeout(timer)
    }
    return undefined
  }, [lastXpAwarded, dispatch])

  useEffect(() => {
    if (levelUpLevel) {
      setLevelPulse(true)
      const timer = window.setTimeout(() => {
        setLevelPulse(false)
        dispatch(clearLevelUpTrigger())
      }, 1800)
      return () => window.clearTimeout(timer)
    }
    return undefined
  }, [levelUpLevel, dispatch])

  useEffect(() => {
    prevPercent.current = percent
  }, [percent])

  return (
    <div className={`relative ${compact ? 'space-y-1' : 'space-y-2'}`}>
      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
        <span
          className={`transition-transform ${levelPulse ? 'scale-110 text-primary-600 dark:text-primary-400 font-bold' : ''}`}
        >
          {levelPulse && levelUpLevel
            ? t('studentPanel.gamification.levelUp', { level: levelUpLevel })
            : t('studentPanel.gamification.stats.level', { level })}
        </span>
        <span>{t('studentPanel.gamification.stats.totalXp', { xp: totalXp })}</span>
      </div>
      <div className="relative h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-[width] duration-700 ease-out ${
            levelPulse ? 'shadow-[0_0_12px_rgba(14,165,233,0.55)]' : ''
          }`}
          style={{ width: `${displayPercent}%` }}
        />
      </div>
      {floatXp ? (
        <span className="pointer-events-none absolute -top-1 right-2 text-xs font-bold text-emerald-500 animate-xp-float">
          +{floatXp} XP
        </span>
      ) : null}
      <style>{`
        @keyframes xp-float {
          0% { opacity: 0; transform: translateY(8px); }
          20% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-18px); }
        }
        .animate-xp-float {
          animation: xp-float 1.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default XpProgressBar
