/**
 * Typewriter color sweep — purple leading edge, settled text fades to light/dark tones.
 * Matches FinTech-style reveals (purple "head", white/lavender trail behind).
 */
import React from 'react'
import { interpolate, interpolateColors } from 'remotion'
import { useCurrentFrame } from '@/remotion/shared/timelineFrame'

import { getCharAppearFrame } from '../../compositions/TeachersOverwhelmedSlide/typingEngine'

/** Settled copy on dark backgrounds */
export const COLOR_REVEAL_ON_DARK = '#F5F5F7'
/** Settled copy on light backgrounds */
export const COLOR_REVEAL_SETTLED = '#000000'
/** Dark purple typing-head sweep */
export const COLOR_DARK_PURPLE = '#4C1D95'
export const COLOR_REVEAL_HEAD = COLOR_DARK_PURPLE

/** Zelios-style emphasis word (white → lavender → indigo) */
export const EMPHASIS_GRADIENT_CSS =
  'linear-gradient(105deg, #FFFFFF 0%, #E9D5FF 32%, #A78BFA 58%, #818CF8 82%, #6366F1 100%)'

/** Frames each character stays "head purple" before settling */
const HEAD_PURPLE_FRAMES = 14

export type ColorRevealTypewriterProps = {
  text: string
  startFrame: number
  duration: number
  visibleCount?: number
  /** Settled color for normal characters (behind the purple head). */
  settledColor?: string
  /** Purple at the moment a character is revealed. */
  headColor?: string
  /** Settled color for emphasis range (e.g. OVERWHELMED). */
  emphasisSettledColor?: string
  charStaggerFrames?: number
  style?: React.CSSProperties
  emphasisFromIndex?: number
  emphasisWeight?: number
  headPurpleFrames?: number
  forceColor?: string
  /** White→purple gradient on emphasis chars when settled (Zelios reference). */
  emphasisGradient?: boolean
  /** Offset into full headline for per-char timing (split normal / emphasis spans). */
  charIndexOffset?: number
}

export const ColorRevealTypewriter: React.FC<ColorRevealTypewriterProps> = ({
  text,
  startFrame,
  duration,
  visibleCount,
  settledColor = COLOR_REVEAL_SETTLED,
  headColor = COLOR_REVEAL_HEAD,
  emphasisSettledColor = COLOR_REVEAL_ON_DARK,
  charStaggerFrames,
  style,
  emphasisFromIndex,
  emphasisWeight = 700,
  headPurpleFrames = HEAD_PURPLE_FRAMES,
  forceColor,
  emphasisGradient = false,
  charIndexOffset = 0,
}) => {
  const frame = useCurrentFrame()

  if (text.length === 0) return null

  const capped =
    visibleCount === undefined ? text.length : Math.min(visibleCount, text.length)
  if (capped <= 0) return null

  const count = text.length
  const slot = charStaggerFrames ?? Math.max(1, duration / Math.max(count, 1))
  const useEngineTiming = visibleCount !== undefined

  return (
    <span
      style={{
        display: 'inline',
        whiteSpace: 'pre',
        ...style,
      }}
    >
      {[...text].map((char, index) => {
        if (index >= capped) return null

        const appearFrame = useEngineTiming
          ? getCharAppearFrame(index + charIndexOffset)
          : startFrame + index * slot

        const reveal = useEngineTiming
          ? 1
          : interpolate(frame, [appearFrame - slot * 0.42, appearFrame], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
        if (reveal <= 0.001) return null

        const isEmphasis =
          emphasisFromIndex !== undefined && index >= emphasisFromIndex

        const age = Math.max(0, frame - appearFrame)
        /** 1 = typing head (purple), 0 = settled (lavender / deep purple) */
        const headMix = interpolate(age, [0, headPurpleFrames], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })

        const settled = isEmphasis ? emphasisSettledColor : settledColor
        const useGrad = isEmphasis && emphasisGradient && !forceColor
        const showHead = headMix > 0.12

        const color = forceColor
          ? forceColor
          : useGrad && showHead
            ? headColor
            : useGrad
              ? 'transparent'
              : interpolateColors(headMix, [0, 1], [settled, headColor])

        return (
          <span
            key={`${index}-${char}`}
            style={{
              display: 'inline-block',
              color,
              opacity: reveal,
              fontWeight: isEmphasis ? emphasisWeight : undefined,
              textTransform: isEmphasis ? 'uppercase' : undefined,
              ...(useGrad && !showHead && !forceColor
                ? {
                    backgroundImage: EMPHASIS_GRADIENT_CSS,
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                  }
                : {}),
            }}
          >
            {char}
          </span>
        )
      })}
    </span>
  )
}
