/**
 * “The future of education isn’t coming someday.” — white on sky blue.
 */
import React from 'react'
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import {
  LINE1_DONE,
  LINE1_START,
  LINE1_STAGGER,
  P2_START,
} from './constants'
import { INTRO_HEADLINE } from '../../../compositions/shared/introHeadlineTypography'
import { CLOSING_TYPE } from './typography'

const WORDS = [
  'The',
  'future',
  'of',
  'education',
  "isn't",
  'coming',
  'someday.',
] as const

const WORD_SPRING = { damping: 220, stiffness: 88, mass: 0.9 }

const smooth = (p: number) =>
  interpolate(p, [0, 0.38, 1], [0, 0.42, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

const TEXT_SHADOW =
  '0 2px 16px rgba(21, 72, 130, 0.5), 0 0 36px rgba(37, 99, 235, 0.32)'

type Props = { fontFamily: string }

const WaveWord: React.FC<{
  word: string
  index: number
  start: number
  frame: number
  fps: number
}> = ({ word, index, start, frame, fps }) => {
  const raw = frame >= start ? spring({ frame: frame - start, fps, config: WORD_SPRING }) : 0
  const p = smooth(raw)

  const x = interpolate(p, [0, 1], [100 + index * 3, 0], { extrapolateRight: 'clamp' })
  const waveY = Math.sin(index * 1.2 + (1 - p) * 3.2) * 20 * (1 - p)
  const blur = interpolate(p, [0, 1], [12, 0], { extrapolateRight: 'clamp' })
  const opacity =
    frame < start ? 0 : interpolate(p, [0, 1], [0.5, 1], { extrapolateRight: 'clamp' })

  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: CLOSING_TYPE.line1FontSize,
        fontWeight: CLOSING_TYPE.line1FontWeight,
        letterSpacing: CLOSING_TYPE.letterSpacing,
        color: '#FFFFFF',
        opacity,
        transform: `translate(${x}px, ${waveY}px)`,
        filter: blur > 0.4 ? `blur(${blur}px)` : undefined,
        textShadow: TEXT_SHADOW,
        marginRight: CLOSING_TYPE.wordGap,
      }}
    >
      {word}
    </span>
  )
}

export const FutureEducationLine: React.FC<Props> = ({ fontFamily }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  if (frame >= P2_START) return null

  const lineOpacity = interpolate(frame, [P2_START - 10, P2_START - 2], [1, 0], {
    extrapolateLeft: 'clamp',
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
        padding: `0 ${CLOSING_TYPE.paddingX}px`,
        opacity: lineOpacity,
        pointerEvents: 'none',
        zIndex: 2,
        fontFamily,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          justifyContent: 'center',
          maxWidth: CLOSING_TYPE.maxWidth,
          lineHeight: INTRO_HEADLINE.lineHeight,
          textAlign: 'center',
        }}
      >
        {WORDS.map((word, i) => (
          <WaveWord
            key={word + i}
            word={word}
            index={i}
            start={LINE1_START + i * LINE1_STAGGER}
            frame={frame}
            fps={fps}
          />
        ))}
      </div>
    </div>
  )
}
