import React from 'react'
import { useCurrentFrame, interpolate, Easing } from 'remotion'

interface AnimatedNumberProps {
  to: number
  from?: number
  /** Frame at which counting begins */
  startFrame: number
  /** Duration of the count animation in frames (default 36 = 1.2s) */
  duration?: number
  suffix?: string
  prefix?: string
  decimals?: number
  style?: React.CSSProperties
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  to,
  from = 0,
  startFrame,
  duration = 36,
  suffix = '',
  prefix = '',
  decimals = 0,
  style,
}) => {
  const frame = useCurrentFrame()

  const progress = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.quad),
    }
  )

  const raw = from + (to - from) * progress
  const display =
    decimals > 0 ? raw.toFixed(decimals) : Math.round(raw).toString()

  return (
    <span style={style}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}
