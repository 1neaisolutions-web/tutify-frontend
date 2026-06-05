/**
 * V6 — delayed first word so ribbon + wash land before headline.
 */
import React from 'react'
import { Easing, interpolate } from 'remotion'
import { useCurrentFrame } from '@/remotion/shared/timelineFrame'

import { INTRO_HEADLINE } from '../../compositions/shared/introHeadlineTypography'

const PRIMARY_WORDS = ['Education', 'is', 'changing', 'faster', 'than', 'ever.'] as const
const SECONDARY_WORDS = ['Teachers', 'need', 'smarter', 'support,', 'right', 'now.'] as const

type LineWordRevealV6Props = {
  fontFamily: string
}

const START_FRAME = 14
const WORD_STAGGER = 5
const WORD_SETTLE = 11
const HOLD_BEFORE_EXIT = 6
const EXIT_FRAMES = 10
/** Full primary line on screen before secondary swap (~0.5s @ 60fps in TutifyDemoV9 ScaledScene). */
const PRIMARY_HOLD_FRAMES = 30
const HANDOFF_GAP = PRIMARY_HOLD_FRAMES
const HANDOFF_FRAMES = 7

const WORD_STARTS = PRIMARY_WORDS.map((_, i) => START_FRAME + i * WORD_STAGGER)
const LAST_START = WORD_STARTS[WORD_STARTS.length - 1]!

export const REVEAL_COMPLETE_FRAME = LAST_START + WORD_SETTLE
const SECONDARY_IN_START = REVEAL_COMPLETE_FRAME + HANDOFF_GAP
export const EDUCATION_SLIDE_V6_DURATION =
  SECONDARY_IN_START + HANDOFF_FRAMES + HOLD_BEFORE_EXIT + EXIT_FRAMES

const smooth = (p: number) =>
  interpolate(p, [0, 0.38, 1], [0, 0.42, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

const WordSpan: React.FC<{
  word: string
  start: number
  frame: number
  slidePath: number
}> = ({ word, start, frame, slidePath }) => {
  const localRaw = interpolate(frame, [start, start + WORD_SETTLE], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })
  const local = smooth(localRaw)
  const unity = Math.min(local, slidePath)

  const y = interpolate(unity, [0, 1], [26, 0], { extrapolateRight: 'clamp' })
  const blur = interpolate(unity, [0, 1], [8, 0], { extrapolateRight: 'clamp' })
  const opacity =
    frame < start ? 0 : interpolate(unity, [0, 1], [0, 1], { extrapolateRight: 'clamp' })

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

export const LineWordRevealV6: React.FC<LineWordRevealV6Props> = ({ fontFamily }) => {
  const frame = useCurrentFrame()
  const slideRaw = interpolate(frame, [10, 21], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  })
  const slidePath = smooth(slideRaw)
  const handoffProgress = interpolate(
    frame,
    [SECONDARY_IN_START, SECONDARY_IN_START + HANDOFF_FRAMES],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.cubic),
    },
  )

  const primaryOpacity = 1 - handoffProgress
  const primaryY = interpolate(handoffProgress, [0, 1], [0, -22], { extrapolateRight: 'clamp' })
  const primaryScale = interpolate(handoffProgress, [0, 1], [1, 0.965], {
    extrapolateRight: 'clamp',
  })
  const primaryBlur = interpolate(handoffProgress, [0, 1], [0, 8], { extrapolateRight: 'clamp' })

  const secondaryOpacity = handoffProgress
  const secondaryY = interpolate(handoffProgress, [0, 1], [18, 0], { extrapolateRight: 'clamp' })
  const secondaryScale = interpolate(handoffProgress, [0, 1], [0.94, 1], {
    extrapolateRight: 'clamp',
  })
  const secondaryClipTopBottom = interpolate(handoffProgress, [0, 1], [46, 0], {
    extrapolateRight: 'clamp',
  })

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
          position: 'relative',
          width: '100%',
          maxWidth: INTRO_HEADLINE.maxWidth,
          minHeight: Math.ceil(INTRO_HEADLINE.fontSize * INTRO_HEADLINE.lineHeight),
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'baseline',
            justifyContent: 'center',
            gap: INTRO_HEADLINE.wordGap,
            fontFamily,
            fontSize: INTRO_HEADLINE.fontSize,
            fontWeight: INTRO_HEADLINE.fontWeight,
            color: '#FFFFFF',
            letterSpacing: INTRO_HEADLINE.letterSpacing,
            lineHeight: INTRO_HEADLINE.lineHeight,
            textAlign: 'center',
            textShadow:
              '0 0 48px rgba(255,255,255,0.12), 0 2px 28px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.08)',
            opacity: primaryOpacity,
            transform: `translateY(${primaryY}px) scale(${primaryScale})`,
            filter: primaryBlur > 0.2 ? `blur(${primaryBlur}px)` : 'none',
            willChange: 'transform, opacity, filter',
          }}
        >
          {PRIMARY_WORDS.map((word, i) => (
            <WordSpan
              key={word}
              word={word}
              start={WORD_STARTS[i]!}
              frame={frame}
              slidePath={slidePath}
            />
          ))}
        </div>

        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'baseline',
            justifyContent: 'center',
            gap: INTRO_HEADLINE.wordGap,
            fontFamily,
            fontSize: INTRO_HEADLINE.fontSize,
            fontWeight: INTRO_HEADLINE.fontWeight,
            color: '#FFFFFF',
            letterSpacing: INTRO_HEADLINE.letterSpacing,
            lineHeight: INTRO_HEADLINE.lineHeight,
            textAlign: 'center',
            textShadow:
              '0 0 48px rgba(255,255,255,0.12), 0 2px 28px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.08)',
            opacity: secondaryOpacity,
            transform: `translateY(${secondaryY}px) scale(${secondaryScale})`,
            clipPath: `inset(${secondaryClipTopBottom}% 0 ${secondaryClipTopBottom}% 0 round 20px)`,
            willChange: 'transform, opacity, clip-path',
          }}
        >
          {SECONDARY_WORDS.map((word) => (
            <span key={word}>{word}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
