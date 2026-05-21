import React from 'react'
import { useCurrentFrame, interpolate, Easing } from 'remotion'
import { theme } from '../theme'

interface AnimatedTextProps {
  text: string
  font?: string
  size?: number
  color?: string
  weight?: number | string
  startFrame?: number
  durationFrames?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  distance?: number
  style?: React.CSSProperties
  letterSpacing?: number
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  font = theme.fonts.headline,
  size = 48,
  color = theme.colors.white,
  weight = 700,
  startFrame = 0,
  durationFrames = 30,
  direction = 'up',
  distance = 30,
  style,
  letterSpacing = 0,
}) => {
  const frame = useCurrentFrame()
  const localFrame = frame - startFrame

  const progress = interpolate(localFrame, [0, durationFrames], [0, 1], {
    easing: Easing.bezier(0.4, 0, 0.2, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const opacity = progress

  const offsets: Record<string, [string, number]> = {
    up:    ['translateY', distance],
    down:  ['translateY', -distance],
    left:  ['translateX', distance],
    right: ['translateX', -distance],
    none:  ['translateY', 0],
  }
  const [axis, startOffset] = offsets[direction]
  const offset = interpolate(progress, [0, 1], [startOffset, 0])
  const transform = `${axis}(${offset}px)`

  return (
    <div
      style={{
        opacity,
        transform,
        fontFamily: font,
        fontSize: size,
        color,
        fontWeight: weight,
        letterSpacing,
        lineHeight: 1.15,
        ...style,
      }}
    >
      {text}
    </div>
  )
}
