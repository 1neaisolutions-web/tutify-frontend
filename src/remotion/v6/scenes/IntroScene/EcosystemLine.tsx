/**
 * "An" rises from below · remaining words from the right — INTRO_HEADLINE scale.
 */
import React from 'react'
import { Easing, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import {
  INTRO_HEADLINE,
  INTRO_HEADLINE_EMPHASIS_WEIGHT,
} from '../../../compositions/shared/introHeadlineTypography'
import {
  ACT2_START,
  ECO_AN_START,
  ECO_REST_START,
  ECO_WORD_STAGGER,
} from './constants'

const ECO_ROWS = [
  ['An', 'intelligent', 'education', 'ecosystem'],
  ['designed', 'for', 'modern', 'schools.'],
] as const

const ECO_EMPHASIS = new Set<string>(['ecosystem', 'schools.'])

const SLATE = '#0A1628'

const SPRING_DROP = { damping: 240, stiffness: 58, mass: 1.08 }
const SPRING_RIGHT = { damping: 230, stiffness: 65, mass: 1.05 }

const smooth = (p: number) =>
  interpolate(p, [0, 0.35, 0.72, 1], [0, 0.28, 0.68, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

const ECO_TEXT_SHADOW =
  '0 1px 0 rgba(255,255,255,0.38), 0 2px 24px rgba(255,255,255,0.18)'

const WordGap: React.FC = () => (
  <span aria-hidden style={{ display: 'inline-block', width: INTRO_HEADLINE.wordGap }} />
)

type EcosystemLineProps = {
  fontFamily: string
  opacity: number
}

function wordIndex(row: number, col: number): number {
  let i = 0
  for (let r = 0; r < ECO_ROWS.length; r++) {
    for (let c = 0; c < ECO_ROWS[r]!.length; c++) {
      if (r === row && c === col) return i
      i++
    }
  }
  return 0
}

function wordStart(row: number, col: number): number {
  const idx = wordIndex(row, col)
  if (idx === 0) return ECO_AN_START
  return ECO_REST_START + (idx - 1) * ECO_WORD_STAGGER
}

const EcoWord: React.FC<{
  word: string
  row: number
  col: number
  frame: number
  fps: number
  fromBelow?: boolean
}> = ({ word, row, col, frame, fps, fromBelow }) => {
  const start = wordStart(row, col)
  const raw =
    frame >= start
      ? spring({
          frame: frame - start,
          fps,
          config: fromBelow ? SPRING_DROP : SPRING_RIGHT,
        })
      : 0
  const p = smooth(raw)
  const opacity =
    frame < start ? 0 : interpolate(p, [0, 1], [0.38, 1], { extrapolateRight: 'clamp' })

  const y = fromBelow ? interpolate(p, [0, 1], [44, 0], { extrapolateRight: 'clamp' }) : 0
  const x = fromBelow ? 0 : interpolate(p, [0, 1], [56, 0], { extrapolateRight: 'clamp' })
  const blur = fromBelow
    ? interpolate(p, [0, 1], [14, 0], { extrapolateRight: 'clamp' })
    : interpolate(p, [0, 1], [12, 0], { extrapolateRight: 'clamp' })

  const weight = ECO_EMPHASIS.has(word) ? INTRO_HEADLINE_EMPHASIS_WEIGHT : INTRO_HEADLINE.fontWeight

  return (
    <span
      style={{
        display: 'inline-block',
        fontWeight: weight,
        color: SLATE,
        opacity,
        transform: `translate(${x}px, ${y}px)`,
        filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
        willChange: 'transform, opacity, filter',
      }}
    >
      {word}
    </span>
  )
}

export const EcosystemLine: React.FC<EcosystemLineProps> = ({ fontFamily, opacity }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  if (frame < ACT2_START) return null

  const act2In = interpolate(frame, [ACT2_START, ACT2_START + 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
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
        opacity: opacity * act2In,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          maxWidth: INTRO_HEADLINE.maxWidth,
          fontFamily,
          fontSize: INTRO_HEADLINE.fontSize,
          fontWeight: INTRO_HEADLINE.fontWeight,
          letterSpacing: INTRO_HEADLINE.letterSpacing,
          lineHeight: INTRO_HEADLINE.lineHeight,
          textAlign: 'center',
          textShadow: ECO_TEXT_SHADOW,
        }}
      >
        {ECO_ROWS.map((row, ri) => (
          <div
            key={ri}
            style={{
              marginTop: ri === 0 ? 0 : '0.34em',
              lineHeight: 1.18,
            }}
          >
            {row.map((word, ci) => (
              <React.Fragment key={`${ri}-${word}`}>
                <EcoWord
                  word={word}
                  row={ri}
                  col={ci}
                  frame={frame}
                  fps={fps}
                  fromBelow={ri === 0 && ci === 0}
                />
                {ci < row.length - 1 ? <WordGap /> : null}
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
