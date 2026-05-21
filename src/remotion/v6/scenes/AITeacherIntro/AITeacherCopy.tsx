/**
 * Title + cumulative tagline — hero scale-up, smooth morph to pill, Vision word reveals.
 */
import React from 'react'
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Easing,
} from 'remotion'
import {
  INTRO_HEADLINE,
  INTRO_HEADLINE_EMPHASIS_WEIGHT,
} from '../../../compositions/shared/introHeadlineTypography'
import {
  TAGLINE_ROWS,
  TAGLINE_EMPHASIS,
  TAGLINE_WORD_STARTS,
  TAGLINE_START,
  TITLE_START,
  MORPH_START,
  TITLE_MORPH_END,
  INK,
  PURPLE,
  PILL_BG,
} from './constants'

const WORD_SPRING = { damping: 220, stiffness: 68, mass: 1.05 }
const TITLE_SPRING = { damping: 230, stiffness: 62, mass: 1.05 }
const RISE_SPRING = { damping: 32, stiffness: 110, mass: 0.95 }

const smooth = Easing.inOut(Easing.cubic)

const WordGap: React.FC = () => (
  <span aria-hidden style={{ display: 'inline-block', width: INTRO_HEADLINE.wordGap }} />
)

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
  fps: number
}> = ({ word, row, col, frame, fps }) => {
  const start = wordStart(row, col)
  const raw = frame >= start ? spring({ frame: frame - start, fps, config: WORD_SPRING }) : 0
  const opacity = frame < start ? 0 : interpolate(raw, [0, 1], [0, 1], { extrapolateRight: 'clamp' })
  const y = interpolate(raw, [0, 1], [32, 0], { extrapolateRight: 'clamp' })
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
        opacity,
        transform: `translateY(${y}px)`,
        willChange: 'transform, opacity',
        letterSpacing: isSeconds ? '-0.04em' : INTRO_HEADLINE.letterSpacing,
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
  const { fps } = useVideoConfig()

  const titleRaw =
    frame >= TITLE_START ? spring({ frame: frame - TITLE_START, fps, config: TITLE_SPRING }) : 0
  const titleOp = interpolate(titleRaw, [0, 1], [0, 1], { extrapolateRight: 'clamp' })
  const titleEnterY = interpolate(titleRaw, [0, 1], [36, 0], { extrapolateRight: 'clamp' })
  const heroScaleIn = interpolate(titleRaw, [0, 1], [0.86, 1], { extrapolateRight: 'clamp' })

  const morphT = interpolate(frame, [MORPH_START, TITLE_MORPH_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smooth,
  })

  const riseRaw =
    frame >= MORPH_START ? spring({ frame: frame - MORPH_START, fps, config: RISE_SPRING }) : 0
  const riseY = interpolate(riseRaw, [0, 1], [0, -72], { extrapolateRight: 'clamp', easing: smooth })

  const heroOpacity = interpolate(morphT, [0, 0.42, 0.78], [1, 0.92, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const pillOpacity = interpolate(morphT, [0.18, 0.48, 0.82], [0, 0.95, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const pillScale = interpolate(morphT, [0.18, 1], [0.94, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smooth,
  })
  const heroShrink = interpolate(morphT, [0, 1], [1, 0.9], { extrapolateRight: 'clamp', easing: smooth })
  const ruleOpacity =
    titleOp *
    interpolate(morphT, [0, 0.35], [interpolate(titleRaw, [0.4, 1], [0, 0.5], { extrapolateRight: 'clamp' }), 0], {
      extrapolateRight: 'clamp',
    })
  const pillIconOp = interpolate(morphT, [0.45, 0.9], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const ruleW = interpolate(titleRaw, [0, 1], [0, 180], { extrapolateRight: 'clamp' })

  const taglineVisible = frame >= TAGLINE_START - 4
  const taglineReveal = interpolate(morphT, [0.32, 0.95], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smooth,
  })
  const taglineY = interpolate(taglineReveal, [0, 1], [28, 0], { extrapolateRight: 'clamp', easing: smooth })

  const stackY = titleEnterY + riseY

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
          transform: `translateY(${stackY}px)`,
          willChange: 'transform',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            minHeight: 52,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.35em',
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
              opacity: titleOp * heroOpacity,
              transform: `scale(${heroScaleIn * heroShrink})`,
              transformOrigin: 'center center',
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
                opacity: ruleOpacity,
              }}
            />
          </div>

          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) scale(${pillScale})`,
              opacity: titleOp * pillOpacity,
              pointerEvents: 'none',
              willChange: 'transform, opacity',
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
              <div style={{ opacity: pillIconOp, display: 'flex' }}>
                <SparkleIcon />
              </div>
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
        </div>

        {taglineVisible ? (
          <div
            style={{
              fontSize: INTRO_HEADLINE.fontSize,
              fontWeight: INTRO_HEADLINE.fontWeight,
              letterSpacing: INTRO_HEADLINE.letterSpacing,
              lineHeight: INTRO_HEADLINE.lineHeight,
              opacity: taglineReveal,
              transform: `translateY(${taglineY}px)`,
              willChange: 'transform, opacity',
            }}
          >
            {TAGLINE_ROWS.map((row, ri) => (
              <div key={ri} style={{ marginTop: ri === 0 ? 0 : '0.28em', lineHeight: 1.18 }}>
                {row.map((word, ci) => (
                  <React.Fragment key={`${ri}-${word}`}>
                    <TaglineWord word={word} row={ri} col={ci} frame={frame} fps={fps} />
                    {ci < row.length - 1 ? <WordGap /> : null}
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  )
}
