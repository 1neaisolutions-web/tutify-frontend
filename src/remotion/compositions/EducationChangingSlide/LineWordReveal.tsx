/**
 * Headline drops word-by-word — hold to read, then exit (duration derived below).
 */
import React from 'react'
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { INTRO_HEADLINE } from '../shared/introHeadlineTypography'

const WORDS = ['Education', 'is', 'changing', 'faster', 'than', 'ever.'] as const

type LineWordRevealProps = {
  fontFamily: string
}

const START_FRAME = 10
const WORD_STAGGER = 10
const WORD_SETTLE = 20
const HOLD_BEFORE_EXIT = 48
const EXIT_FRAMES = 28

const WORD_SPRING = { damping: 220, stiffness: 88, mass: 0.9 }
const SLIDE_SPRING = { damping: 230, stiffness: 58, mass: 1 }

const WORD_STARTS = WORDS.map((_, i) => START_FRAME + i * WORD_STAGGER)
const LAST_START = WORD_STARTS[WORD_STARTS.length - 1]!

export const REVEAL_COMPLETE_FRAME = LAST_START + WORD_SETTLE
export const EDUCATION_SLIDE_DURATION =
  REVEAL_COMPLETE_FRAME + HOLD_BEFORE_EXIT + EXIT_FRAMES

const smooth = (p: number) =>
  interpolate(p, [0, 0.38, 1], [0, 0.42, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

const WordSpan: React.FC<{
  word: string
  start: number
  frame: number
  fps: number
  slidePath: number
}> = ({ word, start, frame, fps, slidePath }) => {
  const localRaw =
    frame >= start ? spring({ frame: frame - start, fps, config: WORD_SPRING }) : 0
  const local = smooth(localRaw)
  const unity = Math.min(local, slidePath)

  const y = interpolate(unity, [0, 1], [-56, 0], { extrapolateRight: 'clamp' })
  const blur = interpolate(unity, [0, 1], [12, 0], { extrapolateRight: 'clamp' })
  const opacity =
    frame < start ? 0 : interpolate(unity, [0, 1], [0.32, 1], { extrapolateRight: 'clamp' })

  return (
    <span
      style={{
        display: 'inline-block',
        opacity,
        transform: `translateY(${y}px)`,
        filter: blur > 0.3 ? `blur(${blur}px)` : 'none',
        willChange: 'transform, opacity, filter',
      }}
    >
      {word}
    </span>
  )
}

export const LineWordReveal: React.FC<LineWordRevealProps> = ({ fontFamily }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const slideRaw = spring({
    frame: Math.max(0, frame - 4),
    fps,
    config: SLIDE_SPRING,
  })
  const slidePath = smooth(slideRaw)

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `0 ${INTRO_HEADLINE.paddingX}px`,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          justifyContent: 'center',
          gap: INTRO_HEADLINE.wordGap,
          maxWidth: INTRO_HEADLINE.maxWidth,
          fontFamily,
          fontSize: INTRO_HEADLINE.fontSize,
          fontWeight: INTRO_HEADLINE.fontWeight,
          color: '#FFFFFF',
          letterSpacing: INTRO_HEADLINE.letterSpacing,
          lineHeight: INTRO_HEADLINE.lineHeight,
          textAlign: 'center',
        }}
      >
        {WORDS.map((word, i) => (
          <WordSpan
            key={word}
            word={word}
            start={WORD_STARTS[i]}
            frame={frame}
            fps={fps}
            slidePath={slidePath}
          />
        ))}
      </div>
    </div>
  )
}
