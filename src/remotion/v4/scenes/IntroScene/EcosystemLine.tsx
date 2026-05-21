/**
 * "An" rises from below · remaining words from the right — typography aligned with slides 1–3.
 */
import React from 'react'
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { INTRO_HEADLINE } from '../../../compositions/shared/introHeadlineTypography'
import {
  ACT2_START,
  ECO_AN_START,
  ECO_REST_START,
  ECO_WORD_STAGGER,
  ECO_FONT,
} from './constants'

const REST_WORDS =
  'intelligent education ecosystem designed for modern schools.'.split(' ')

const SPRING_DROP = { damping: 240, stiffness: 72, mass: 1 }
const SPRING_RIGHT = { damping: 210, stiffness: 100, mass: 0.9 }

type EcosystemLineProps = {
  fontFamily: string
  opacity: number
}

export const EcosystemLine: React.FC<EcosystemLineProps> = ({ fontFamily, opacity }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  if (frame < ACT2_START) return null

  const act2In = interpolate(frame, [ACT2_START, ACT2_START + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const anRaw =
    frame >= ECO_AN_START
      ? spring({ frame: frame - ECO_AN_START, fps, config: SPRING_DROP })
      : 0
  const anP = interpolate(anRaw, [0, 1], [0, 1], { extrapolateRight: 'clamp' })
  const anY = interpolate(anP, [0, 1], [44, 0], { extrapolateRight: 'clamp' })

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `0 ${INTRO_HEADLINE.paddingX}px`,
        opacity: opacity * act2In,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          maxWidth: INTRO_HEADLINE.maxWidth,
          textAlign: 'center',
          fontFamily,
          fontSize: ECO_FONT,
          fontWeight: INTRO_HEADLINE.fontWeight,
          letterSpacing: INTRO_HEADLINE.letterSpacing,
          lineHeight: INTRO_HEADLINE.lineHeight,
          color: '#0A1628',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            opacity: frame < ECO_AN_START ? 0 : anP,
            transform: `translateY(${anY}px)`,
            marginRight: INTRO_HEADLINE.wordGap,
          }}
        >
          An
        </span>
        {REST_WORDS.map((word, i) => {
          const start = ECO_REST_START + i * ECO_WORD_STAGGER
          const raw =
            frame >= start
              ? spring({ frame: frame - start, fps, config: SPRING_RIGHT })
              : 0
          const p = interpolate(raw, [0, 1], [0, 1], { extrapolateRight: 'clamp' })
          const x = interpolate(p, [0, 1], [64, 0], { extrapolateRight: 'clamp' })
          const blur = interpolate(p, [0, 1], [8, 0], { extrapolateRight: 'clamp' })

          return (
            <span
              key={word}
              style={{
                display: 'inline-block',
                opacity: frame < start ? 0 : p,
                transform: `translateX(${x}px)`,
                filter: blur > 0.25 ? `blur(${blur}px)` : undefined,
                marginRight: INTRO_HEADLINE.wordGap,
              }}
            >
              {word}
            </span>
          )
        })}
      </div>
    </div>
  )
}
