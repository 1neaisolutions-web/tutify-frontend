/**
 * V6 — staggered word exit, cool tint, eased recession (Teaching intro headline).
 */
import React from 'react'
import {
  Easing,
  useCurrentFrame,
  interpolate,
  interpolateColors,
  spring,
  useVideoConfig,
} from 'remotion'

const WORDS = ['The', 'Reality', 'of', 'Teaching', 'Today'] as const

/** Aligned with Education slide rhythm (~26f first word, 13f stagger). */
const JOURNEY_START = 14
const FIRST_WORD_DELAY = 10
const WORD_STAGGER = 13
const WORD_SETTLE = 26
/** Brief hold once line is readable (~0.2s). */
const HOLD_FRAMES = 6
const WORD_EXIT_STAGGER = 5
const WORD_EXIT_DURATION = 14

const JOURNEY_SPRING = { damping: 260, stiffness: 52, mass: 1.12 }
const WORD_SPRING = { damping: 240, stiffness: 65, mass: 1.05 }

const WORD_STARTS = WORDS.map((_, i) => JOURNEY_START + FIRST_WORD_DELAY + i * WORD_STAGGER)
const LAST_WORD_START = WORD_STARTS[WORD_STARTS.length - 1]!

export const REVEAL_COMPLETE_FRAME = LAST_WORD_START + WORD_SETTLE
export const EXIT_START_FRAME = REVEAL_COMPLETE_FRAME + HOLD_FRAMES
export const TEACHING_INTRO_V6_DURATION =
  EXIT_START_FRAME + (WORDS.length - 1) * WORD_EXIT_STAGGER + WORD_EXIT_DURATION + 8

const smooth = (p: number) =>
  interpolate(p, [0, 0.35, 0.72, 1], [0, 0.28, 0.68, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

const wordExitProgress = (frame: number, wordIndex: number): number => {
  const start = EXIT_START_FRAME + wordIndex * WORD_EXIT_STAGGER
  return interpolate(frame, [start, start + WORD_EXIT_DURATION], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  })
}

const WordSpan: React.FC<{
  word: string
  wordIndex: number
  start: number
  frame: number
  fps: number
  journeyPath: number
}> = ({ word, wordIndex, start, frame, fps, journeyPath }) => {
  const localRaw =
    frame >= start ? spring({ frame: frame - start, fps, config: WORD_SPRING }) : 0
  const local = smooth(localRaw)
  const unity = Math.min(local, journeyPath)

  const blur = interpolate(unity, [0, 1], [28, 0], { extrapolateRight: 'clamp' })
  const baseOpacity =
    frame < start ? 0 : interpolate(unity, [0, 1], [0.38, 1], { extrapolateRight: 'clamp' })

  const exitP = frame >= EXIT_START_FRAME ? wordExitProgress(frame, wordIndex) : 0
  const opacity = baseOpacity * (1 - exitP)
  const exitBlur = interpolate(exitP, [0, 1], [0, 16], { extrapolateRight: 'clamp' })
  const exitY = interpolate(exitP, [0, 1], [0, -48], { extrapolateRight: 'clamp' })
  const exitScale = interpolate(exitP, [0, 1], [1, 0.94], { extrapolateRight: 'clamp' })

  const color = interpolateColors(exitP, [0, 1], ['#F5F5F7', '#D8E8FF'])

  return (
    <span
      style={{
        display: 'inline-block',
        opacity,
        color,
        transform: `translateY(${exitY}px) scale(${exitScale})`,
        filter: blur + exitBlur > 0.4 ? `blur(${blur + exitBlur}px)` : 'none',
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

  const globalExit = interpolate(
    frame,
    [EXIT_START_FRAME, TEACHING_INTRO_V6_DURATION - 4],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.cubic),
    },
  )

  const globalScale = interpolate(globalExit, [0, 1], [1, 0.97])

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        opacity: globalExit,
        transform: `scale(${globalScale})`,
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
                wordIndex={wordIndex}
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
