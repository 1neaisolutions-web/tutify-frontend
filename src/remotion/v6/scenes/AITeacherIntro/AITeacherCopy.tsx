/**
 * AI Teacher intro — fade in at center, fade out in place (no rise), pill + tagline below.
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
  HERO_FADE_START,
  HERO_FADE_END,
  PILL_IN_START,
  PILL_IN_END,
  TAGLINE_REVEAL_START,
  TAGLINE_REVEAL_FRAMES,
  TITLE_START,
  TITLE_IN_FRAMES,
  WORD_IN_FRAMES,
  INK,
  PURPLE,
  PILL_BG,
} from './constants'

const gentleEase = Easing.bezier(0.33, 0, 0.18, 1)
const TITLE_SLOT_HEIGHT = 108
/** Fits 3 tagline rows + 108px "seconds." (320px was clipping the last line) */
const TAGLINE_BLOCK_MAX_HEIGHT = 440

function wordStart(row: number, col: number): number {
  return TAGLINE_WORD_STARTS.find((e) => e.row === row && e.col === col)?.start ?? 0
}

const SparkleIcon: React.FC = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M12 2l1.8 5.4L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.6L12 2z"
      fill={PURPLE}
    />
    <path
      d="M19 14l.9 2.7 2.7.9-2.7.9-.9 2.7-.9-2.7-2.7-.9 2.7-.9.9-2.7z"
      fill={PURPLE}
      opacity={0.85}
    />
  </svg>
)

const TaglineWord: React.FC<{
  word: string
  row: number
  col: number
  frame: number
  hasGapAfter: boolean
}> = ({ word, row, col, frame, hasGapAfter }) => {
  const start = wordStart(row, col)
  const p =
    frame < start
      ? 0
      : interpolate(frame, [start, start + WORD_IN_FRAMES], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: gentleEase,
        })
  const isSeconds = word === 'seconds.'
  const isEmphasis = TAGLINE_EMPHASIS.has(word)
  const color = isEmphasis || isSeconds ? PURPLE : INK
  const weight = isSeconds ? 800 : isEmphasis ? INTRO_HEADLINE_EMPHASIS_WEIGHT : INTRO_HEADLINE.fontWeight
  const fontSize = isSeconds ? 108 : INTRO_HEADLINE.fontSize

  return (
    <span
      style={{
        display: 'inline-block',
        fontWeight: weight,
        color,
        fontSize,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [12, 0], { extrapolateRight: 'clamp' })}px)`,
        letterSpacing: isSeconds ? '-0.04em' : INTRO_HEADLINE.letterSpacing,
        marginRight: hasGapAfter ? INTRO_HEADLINE.wordGap : undefined,
      }}
    >
      {word}
    </span>
  )
}

type AITeacherCopyProps = {
  fontFamily: string
  contentOpacity: number
}

export const AITeacherCopy: React.FC<AITeacherCopyProps> = ({ fontFamily, contentOpacity }) => {
  const frame = useCurrentFrame()

  const titleInP = interpolate(frame, [TITLE_START, TITLE_START + TITLE_IN_FRAMES], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: gentleEase,
  })

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

  const ruleW = interpolate(titleInP, [0.55, 1], [0, 160], { extrapolateRight: 'clamp' })
  const ruleOp = heroOp * interpolate(fadeOutP, [0, 0.5], [1, 0], { extrapolateRight: 'clamp' })
  const pillScale = interpolate(pillOp, [0, 1], [0.96, 1], { extrapolateRight: 'clamp' })

  const taglineIn =
    frame < TAGLINE_REVEAL_START
      ? 0
      : interpolate(frame, [TAGLINE_REVEAL_START, TAGLINE_REVEAL_START + TAGLINE_REVEAL_FRAMES], [0, 1], {
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
        opacity: contentOpacity,
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
                  color: PURPLE,
                  whiteSpace: 'nowrap',
                }}
              >
                AI Teacher Assistant
              </div>
              <div
                style={{
                  marginTop: 16,
                  height: 3,
                  width: ruleW,
                  borderRadius: 3,
                  background: `linear-gradient(90deg, transparent, ${PURPLE}, transparent)`,
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
                    border: `1px solid rgba(91, 79, 207, 0.18)`,
                  }}
                >
                  <SparkleIcon />
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: PURPLE,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    AI Teacher Assistant
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        <div
          style={{
            width: '100%',
            opacity: taglineIn,
            maxHeight:
              frame < TAGLINE_REVEAL_START
                ? 0
                : interpolate(taglineIn, [0, 1], [0, TAGLINE_BLOCK_MAX_HEIGHT], {
                    extrapolateRight: 'clamp',
                  }),
            overflow: taglineIn >= 1 ? 'visible' : 'hidden',
            transform: `translateY(${interpolate(taglineIn, [0, 1], [8, 0], { extrapolateRight: 'clamp' })}px)`,
          }}
        >
          {frame >= TAGLINE_REVEAL_START
            ? TAGLINE_ROWS.map((row, ri) => (
                <div
                  key={ri}
                  style={{
                    marginTop: ri === 0 ? 0 : '0.28em',
                    fontSize: INTRO_HEADLINE.fontSize,
                    lineHeight: 1.18,
                    minHeight: ri === TAGLINE_ROWS.length - 1 ? 128 : undefined,
                  }}
                >
                  {row.map((word, ci) => (
                    <TaglineWord
                      key={`${ri}-${ci}-${word}`}
                      word={word}
                      row={ri}
                      col={ci}
                      frame={frame}
                      hasGapAfter={ci < row.length - 1}
                    />
                  ))}
                </div>
              ))
            : null}
        </div>
      </div>
    </AbsoluteFill>
  )
}
