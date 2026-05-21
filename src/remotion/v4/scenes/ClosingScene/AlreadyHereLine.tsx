/**
 * “It’s already here.” — black type, Vision-matched scale.
 */
import React from 'react'
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { LINE2_DONE, LINE2_STAGGER, P2_FADE_OUT, P2_START } from './constants'
import { CLOSING_TYPE } from './typography'

const WORDS = ["It's", 'already', 'here.'] as const
const LINE_START = P2_START + 6
const WORD_SPRING = { damping: 200, stiffness: 120, mass: 0.85 }

const smooth = (p: number) =>
  interpolate(p, [0, 0.34, 1], [0, 0.48, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

type Props = { fontFamily: string }

export const AlreadyHereLine: React.FC<Props> = ({ fontFamily }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  if (frame < P2_START || frame >= P2_FADE_OUT) return null

  const lineOpacity = interpolate(
    frame,
    [P2_START, P2_START + 4, LINE2_DONE - 2, P2_FADE_OUT],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

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
          lineHeight: 1.12,
        }}
      >
        {WORDS.map((word, i) => {
          const start = LINE_START + i * LINE2_STAGGER
          const raw =
            frame >= start ? spring({ frame: frame - start, fps, config: WORD_SPRING }) : 0
          const p = smooth(raw)
          const isEmphasis = word === 'here.'
          const x = interpolate(p, [0, 1], [88, 0], { extrapolateRight: 'clamp' })
          const blur = interpolate(p, [0, 1], [isEmphasis ? 14 : 8, 0], {
            extrapolateRight: 'clamp',
          })
          const opacity =
            frame < start ? 0 : interpolate(p, [0, 1], [0.35, 1], { extrapolateRight: 'clamp' })

          return (
            <span
              key={word}
              style={{
                display: 'inline-block',
                fontSize: isEmphasis
                  ? CLOSING_TYPE.line2EmphasisFontSize
                  : CLOSING_TYPE.line2FontSize,
                fontWeight: isEmphasis
                  ? CLOSING_TYPE.line2EmphasisFontWeight
                  : CLOSING_TYPE.line2FontWeight,
                letterSpacing: CLOSING_TYPE.letterSpacing,
                color: '#0A1628',
                opacity,
                marginRight: CLOSING_TYPE.wordGap,
                transform: `translateX(${x}px)`,
                filter: blur > 0.5 ? `blur(${blur}px)` : undefined,
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
