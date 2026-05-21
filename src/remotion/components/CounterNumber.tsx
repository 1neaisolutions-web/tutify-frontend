import React from 'react'
import { useCurrentFrame, interpolate, Easing } from 'remotion'
import { theme } from '../theme'

interface CounterNumberProps {
  from?: number
  to: number
  startFrame?: number
  durationFrames?: number
  suffix?: string
  prefix?: string
  size?: number
  color?: string
  font?: string
  weight?: number
}

export const CounterNumber: React.FC<CounterNumberProps> = ({
  from = 0,
  to,
  startFrame = 0,
  durationFrames = 60,
  suffix = '',
  prefix = '',
  size = 96,
  color = theme.colors.white,
  font = theme.fonts.headline,
  weight = 800,
}) => {
  const frame = useCurrentFrame()
  const localFrame = frame - startFrame

  const progress = interpolate(localFrame, [0, durationFrames], [0, 1], {
    easing: Easing.bezier(0.4, 0, 0.2, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const value = Math.round(from + (to - from) * progress)

  return (
    <span style={{
      fontFamily: font,
      fontSize: size,
      fontWeight: weight,
      color,
      lineHeight: 1,
      letterSpacing: -2,
    }}>
      {prefix}{value}{suffix}
    </span>
  )
}
