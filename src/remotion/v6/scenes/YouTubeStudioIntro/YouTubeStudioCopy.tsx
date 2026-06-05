/**
 * YouTube Fun Studio — fade in at center, fade out in place (no rise), pill + body below.
 */
import React from 'react'
import { AbsoluteFill, interpolate, Easing } from 'remotion'import { useCurrentFrame } from '@/remotion/shared/timelineFrame'

import {
  INTRO_HEADLINE,
  INTRO_HEADLINE_EMPHASIS_WEIGHT,
} from '../../../compositions/shared/introHeadlineTypography'
import {
  TAGLINE_ROWS,
  TAGLINE_EMPHASIS,
  TAGLINE_WORD_STARTS,
  BODY_REVEAL_START,
  BODY_REVEAL_FRAMES,
  HERO_FADE_START,
  HERO_FADE_END,
  PILL_IN_START,
  PILL_IN_END,
  TITLE_START,
  TITLE_IN_FRAMES,
  WORD_IN_FRAMES,
  INK,
  ORANGE,
  PILL_BG,
} from './constants'

const gentleEase = Easing.bezier(0.33, 0, 0.18, 1)
const TITLE_SLOT_HEIGHT = 108

const WordGap: React.FC = () => (
  <span aria-hidden style={{ display: 'inline-block', width: INTRO_HEADLINE.wordGap }} />
)

function wordStart(row: number, col: number): number {
  return TAGLINE_WORD_STARTS.find((e) => e.row === row && e.col === col)?.start ?? 0
}

const YoutubeIcon: React.FC = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="2" y="6" width="20" height="12" rx="3" stroke={ORANGE} strokeWidth="2" />
    <path d="M10 9.5v5l5-2.5-5-2.5z" fill={ORANGE} />
  </svg>
)

const BodyWord: React.FC<{
  word: string
  row: number
  col: number
  frame: number
}> = ({ word, row, col, frame }) => {
  const start = wordStart(row, col)
  const p =
    frame < start
      ? 0
      : interpolate(frame, [start, start + WORD_IN_FRAMES], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: gentleEase,
        })

  return (
    <span
      style={{
        display: 'inline-block',
        fontWeight: TAGLINE_EMPHASIS.has(word) ? INTRO_HEADLINE_EMPHASIS_WEIGHT : INTRO_HEADLINE.fontWeight,
        color: TAGLINE_EMPHASIS.has(word) ? ORANGE : INK,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [12, 0], { extrapolateRight: 'clamp' })}px)`,
        letterSpacing: INTRO_HEADLINE.letterSpacing,
      }}
    >
      {word}
    </span>
  )
}

type YouTubeStudioCopyProps = {
  fontFamily: string
}

export const YouTubeStudioCopy: React.FC<YouTubeStudioCopyProps> = ({ fontFamily }) => {
  const frame = useCurrentFrame()

  const titleInP = interpolate(frame, [TITLE_START, TITLE_START + TITLE_IN_FRAMES], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: gentleEase,
  })

  /** Slight enter only — no upward travel after visible */
  const titleEnterY = interpolate(titleInP, [0, 1], [12, 0], { extrapolateRight: 'clamp' })

  const fadeOutP =
    frame < HERO_FADE_START
      ? 0
      : interpolate(frame, [HERO_FADE_START, HERO_FADE_END], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: gentleEase,
        })

  const heroOp = titleInP * (1 - fadeOutP)
  const pillOp =
    frame < PILL_IN_START
      ? 0
      : interpolate(frame, [PILL_IN_START, PILL_IN_END], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: gentleEase,
        })

  const ruleW = interpolate(titleInP, [0.55, 1], [0, 220], { extrapolateRight: 'clamp' })
  const ruleOp = heroOp * interpolate(fadeOutP, [0, 0.5], [1, 0], { extrapolateRight: 'clamp' })
  const pillScale = interpolate(pillOp, [0, 1], [0.96, 1], { extrapolateRight: 'clamp' })

  const bodyIn =
    frame < BODY_REVEAL_START
      ? 0
      : interpolate(frame, [BODY_REVEAL_START, BODY_REVEAL_START + BODY_REVEAL_FRAMES], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: gentleEase,
        })

  const showTitleSlot = frame >= TITLE_START
  const showPillLayer = frame >= PILL_IN_START
  const stackY = frame < TITLE_START + TITLE_IN_FRAMES ? titleEnterY : 0

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: INTRO_HEADLINE.paddingX,
        paddingRight: INTRO_HEADLINE.paddingX,
        fontFamily,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: INTRO_HEADLINE.maxWidth,
          width: '100%',
          transform: stackY !== 0 ? `translateY(${stackY}px)` : undefined,
        }}
      >
        {showTitleSlot ? (
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: TITLE_SLOT_HEIGHT,
              marginBottom: '0.35em',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: heroOp,
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  fontSize: INTRO_HEADLINE.fontSize,
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.05,
                  color: ORANGE,
                  whiteSpace: 'nowrap',
                }}
              >
                YouTube Fun Studio
              </div>
              <div
                style={{
                  marginTop: 16,
                  height: 3,
                  width: ruleW,
                  borderRadius: 3,
                  background: `linear-gradient(90deg, transparent, ${ORANGE}, transparent)`,
                  opacity: ruleOp,
                }}
              />
            </div>

            {showPillLayer ? (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pillOp,
                  transform: `scale(${pillScale})`,
                  pointerEvents: 'none',
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 18px',
                    borderRadius: 999,
                    background: PILL_BG,
                    border: `1px solid rgba(249, 115, 22, 0.22)`,
                  }}
                >
                  <YoutubeIcon />
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: ORANGE,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    YouTube Fun Studio
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        <div
          style={{
            width: '100%',
            fontSize: INTRO_HEADLINE.fontSize,
            fontWeight: INTRO_HEADLINE.fontWeight,
            letterSpacing: INTRO_HEADLINE.letterSpacing,
            lineHeight: INTRO_HEADLINE.lineHeight,
            opacity: bodyIn,
            maxHeight:
              frame < BODY_REVEAL_START
                ? 0
                : interpolate(bodyIn, [0, 1], [0, 280], { extrapolateRight: 'clamp' }),
            overflow: 'hidden',
            transform: `translateY(${interpolate(bodyIn, [0, 1], [8, 0], { extrapolateRight: 'clamp' })}px)`,
          }}
        >
          {frame >= BODY_REVEAL_START
            ? TAGLINE_ROWS.map((row, ri) => (
                <div key={ri} style={{ marginTop: ri === 0 ? 0 : '0.28em', lineHeight: 1.18 }}>
                  {row.map((word, ci) => (
                    <React.Fragment key={`${ri}-${word}`}>
                      <BodyWord word={word} row={ri} col={ci} frame={frame} />
                      {ci < row.length - 1 ? <WordGap /> : null}
                    </React.Fragment>
                  ))}
                </div>
              ))
            : null}
        </div>
      </div>
    </AbsoluteFill>
  )
}
