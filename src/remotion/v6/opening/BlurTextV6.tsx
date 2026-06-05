/**
 * V6 — staggered word exit, cool tint, eased recession (Teaching intro headline).
 */
import React from 'react'
import { interpolate, spring } from 'remotion'
import { useCurrentFrame, useVideoConfig } from '@/remotion/shared/timelineFrame'


const WORDS = ['The', 'Reality', 'of', 'Teaching', 'Today'] as const

/** Aligned with Education slide rhythm (~26f first word, 13f stagger). */
const JOURNEY_START = 14
const FIRST_WORD_DELAY = 10
const WORD_STAGGER = 13
const WORD_SETTLE = 26
/** Hold once headline is fully readable before pixelate handoff. */
const HOLD_FRAMES = 22
export const PIXELATE_DURATION = 26

const JOURNEY_SPRING = { damping: 260, stiffness: 52, mass: 1.12 }
const WORD_SPRING = { damping: 240, stiffness: 65, mass: 1.05 }

const WORD_STARTS = WORDS.map((_, i) => JOURNEY_START + FIRST_WORD_DELAY + i * WORD_STAGGER)
const LAST_WORD_START = WORD_STARTS[WORD_STARTS.length - 1]!

export const REVEAL_COMPLETE_FRAME = LAST_WORD_START + WORD_SETTLE
export const PIXELATE_START_FRAME = REVEAL_COMPLETE_FRAME + HOLD_FRAMES
/** @deprecated Use PIXELATE_START_FRAME */
export const EXIT_START_FRAME = PIXELATE_START_FRAME
export const TEACHING_INTRO_V6_DURATION = PIXELATE_START_FRAME + PIXELATE_DURATION + 10

const smooth = (p: number) =>
  interpolate(p, [0, 0.35, 0.72, 1], [0, 0.28, 0.68, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

const WordSpan: React.FC<{
  word: string
  start: number
  frame: number
  fps: number
  journeyPath: number
}> = ({ word, start, frame, fps, journeyPath }) => {
  const localRaw =
    frame >= start ? spring({ frame: frame - start, fps, config: WORD_SPRING }) : 0
  const local = smooth(localRaw)
  const unity = Math.min(local, journeyPath)

  const blur = interpolate(unity, [0, 1], [28, 0], { extrapolateRight: 'clamp' })
  const opacity =
    frame < start ? 0 : interpolate(unity, [0, 1], [0.38, 1], { extrapolateRight: 'clamp' })

  return (
    <span
      style={{
        display: 'inline-block',
        opacity,
        color: '#F5F5F7',
        filter: blur > 0.4 ? `blur(${blur}px)` : 'none',
        willChange: 'transform, opacity, filter',
      }}
    >
      {word}
    </span>
  )
}

export const BlurTextV6: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const journey = spring({
    frame: Math.max(0, frame - JOURNEY_START),
    fps,
    config: JOURNEY_SPRING,
  })
  const path = smooth(journey)

  const groupScale = interpolate(path, [0, 1], [1.72, 1], { extrapolateRight: 'clamp' })
  const groupX = interpolate(path, [0, 1], [-300, 0], { extrapolateRight: 'clamp' })
  const groupY = interpolate(path, [0, 1], [200, 0], { extrapolateRight: 'clamp' })

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          transform: `translate(${groupX}px, ${groupY}px) scale(${groupScale})`,
          transformOrigin: '50% 78%',
          willChange: 'transform',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'baseline',
            maxWidth: 1600,
            padding: '0 64px',
            fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif',
            fontSize: 96,
            fontWeight: 500,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
          }}
        >
          {WORDS.map((word, wordIndex) => (
            <React.Fragment key={word}>
              <WordSpan
                word={word}
                start={WORD_STARTS[wordIndex]!}
                frame={frame}
                fps={fps}
                journeyPath={path}
              />
              {wordIndex < WORDS.length - 1 ? (
                <span aria-hidden style={{ display: 'inline-block', width: '0.42em' }} />
              ) : null}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
