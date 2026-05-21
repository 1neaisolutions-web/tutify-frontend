/**
 * Shared feature-intro tagline line — INTRO_HEADLINE scale + V6 motion.
 */
import React from 'react'
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { INTRO_HEADLINE, INTRO_HEADLINE_EMPHASIS_WEIGHT } from '../../compositions/shared/introHeadlineTypography'
import { springs } from '../motion/presets'
import { theme } from '../theme'

type Props = {
  text: string
  start: number
  duration: number
  fontWeight?: number
  color?: string
}

export const FeatureIntroBeat: React.FC<Props> = ({
  text,
  start,
  duration,
  fontWeight = INTRO_HEADLINE_EMPHASIS_WEIGHT,
  color = theme.colors.text,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const alpha = interpolate(
    frame,
    [start, start + 14, start + duration - 12, start + duration],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  if (alpha < 0.02) return null

  const p = spring({ frame: Math.max(0, frame - start), fps, config: springs.hero })
  const y = interpolate(p, [0, 1], [28, 0], { extrapolateRight: 'clamp' })
  const scale = interpolate(p, [0, 1], [0.94, 1], { extrapolateRight: 'clamp' })
  const op = interpolate(p, [0, 1], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <div
      style={{
        opacity: alpha * op,
        transform: `translateY(${y}px) scale(${scale})`,
        textAlign: 'center',
        maxWidth: INTRO_HEADLINE.maxWidth,
        padding: `0 ${INTRO_HEADLINE.paddingX}px`,
        fontFamily: theme.font.display,
        fontSize: INTRO_HEADLINE.fontSize,
        fontWeight,
        letterSpacing: INTRO_HEADLINE.letterSpacing,
        lineHeight: INTRO_HEADLINE.lineHeight,
        color,
      }}
    >
      {text}
    </div>
  )
}
