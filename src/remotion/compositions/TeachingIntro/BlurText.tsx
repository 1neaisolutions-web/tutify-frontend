/**
 * Words sharpen together on a shared glide — readable hold, smooth exit.
 */
import React from 'react'
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'

const WORDS = ['The', 'Reality', 'of', 'Teaching', 'Today'] as const

const JOURNEY_START = 10
const WORD_STAGGER = 10
const WORD_SETTLE = 22
const HOLD_FRAMES = 50
const EXIT_DURATION = 28

const JOURNEY_SPRING = { damping: 200, stiffness: 72, mass: 0.95 }
const WORD_SPRING = { damping: 220, stiffness: 88, mass: 0.88 }

const WORD_STARTS = WORDS.map((_, i) => JOURNEY_START + i * WORD_STAGGER)
const LAST_WORD_START = WORD_STARTS[WORD_STARTS.length - 1]!

export const REVEAL_COMPLETE_FRAME = LAST_WORD_START + WORD_SETTLE
export const EXIT_START_FRAME = REVEAL_COMPLETE_FRAME + HOLD_FRAMES
export const TEACHING_INTRO_DURATION = EXIT_START_FRAME + EXIT_DURATION

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
    frame >= start
      ? spring({ frame: frame - start, fps, config: WORD_SPRING })
      : 0
  const local = smooth(localRaw)

  const unity = Math.min(local, journeyPath)

  const blur = interpolate(unity, [0, 1], [28, 0], { extrapolateRight: 'clamp' })
  const opacity =
    frame < start
      ? 0
      : interpolate(unity, [0, 1], [0.38, 1], { extrapolateRight: 'clamp' })

  return (
    <span
      style={{
        display: 'inline-block',
        opacity,
        filter: blur > 0.4 ? `blur(${blur}px)` : 'none',
        willChange: 'filter, opacity',
      }}
    >
      {word}
    </span>
  )
}

export const BlurText: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const journey = spring({
    frame: Math.max(0, frame - JOURNEY_START),
    fps,
    config: JOURNEY_SPRING,
  })
  const path = smooth(journey)

  const groupScale = interpolate(path, [0, 1], [2.35, 1], {
    extrapolateRight: 'clamp',
  })
  const groupX = interpolate(path, [0, 1], [-460, 0], {
    extrapolateRight: 'clamp',
  })
  const groupY = interpolate(path, [0, 1], [310, 0], {
    extrapolateRight: 'clamp',
  })

  const exitProgress = interpolate(
    frame,
    [EXIT_START_FRAME, EXIT_START_FRAME + EXIT_DURATION],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  const blockOpacity =
    frame >= EXIT_START_FRAME
      ? interpolate(exitProgress, [0, 1], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 1

  const blockBlur =
    frame >= EXIT_START_FRAME
      ? interpolate(exitProgress, [0, 1], [0, 14], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 0

  const blockY =
    frame >= EXIT_START_FRAME
      ? interpolate(exitProgress, [0, 1], [0, -60], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 0

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
          transform: `
            translate(${groupX}px, calc(${groupY}px + ${blockY}px))
            scale(${groupScale})
          `,
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
            color: '#F5F5F7',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            opacity: blockOpacity,
            filter: blockBlur > 0 ? `blur(${blockBlur}px)` : 'none',
          }}
        >
          {WORDS.map((word, wordIndex) => (
            <React.Fragment key={word}>
              <WordSpan
                word={word}
                start={WORD_STARTS[wordIndex]}
                frame={frame}
                fps={fps}
                journeyPath={path}
              />
              {wordIndex < WORDS.length - 1 ? (
                <span
                  aria-hidden
                  style={{ display: 'inline-block', width: '0.42em' }}
                />
              ) : null}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
