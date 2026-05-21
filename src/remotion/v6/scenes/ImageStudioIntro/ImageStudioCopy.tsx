/**
 * AI IMAGE STUDIO — hero scale-up, smooth morph to pill, Vision word reveals.
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
  TEAL,
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

const ImageIcon: React.FC = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="3" y="5" width="18" height="14" rx="2" stroke={TEAL} strokeWidth="2" />
    <circle cx="8.5" cy="10" r="1.5" fill={TEAL} />
    <path d="M3 16l5-5 4 4 3-3 6 6" stroke={TEAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const BodyWord: React.FC<{
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
  const isEmphasis = TAGLINE_EMPHASIS.has(word)
  const color = isEmphasis ? TEAL : INK
  const weight = isEmphasis ? INTRO_HEADLINE_EMPHASIS_WEIGHT : INTRO_HEADLINE.fontWeight

  return (
    <span
      style={{
        display: 'inline-block',
        fontWeight: weight,
        color,
        opacity,
        transform: `translateY(${y}px)`,
        willChange: 'transform, opacity',
        letterSpacing: INTRO_HEADLINE.letterSpacing,
      }}
    >
      {word}
    </span>
  )
}

type ImageStudioCopyProps = {
  fontFamily: string
}

export const ImageStudioCopy: React.FC<ImageStudioCopyProps> = ({ fontFamily }) => {
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
  const ruleW = interpolate(titleRaw, [0, 1], [0, 200], { extrapolateRight: 'clamp' })

  const bodyVisible = frame >= TAGLINE_START - 4
  const bodyReveal = interpolate(morphT, [0.32, 0.95], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: smooth,
  })
  const bodyY = interpolate(bodyReveal, [0, 1], [28, 0], { extrapolateRight: 'clamp', easing: smooth })

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
                color: TEAL,
              }}
            >
              AI Image Studio
            </div>
            <div
              style={{
                marginTop: 16,
                height: 3,
                width: ruleW,
                borderRadius: 3,
                background: `linear-gradient(90deg, transparent, ${TEAL}, transparent)`,
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
                border: `1px solid rgba(13, 148, 136, 0.2)`,
              }}
            >
              <div style={{ opacity: pillIconOp, display: 'flex' }}>
                <ImageIcon />
              </div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: TEAL,
                  whiteSpace: 'nowrap',
                }}
              >
                AI Image Studio
              </span>
            </div>
          </div>
        </div>

        {bodyVisible ? (
          <div
            style={{
              fontSize: INTRO_HEADLINE.fontSize,
              fontWeight: INTRO_HEADLINE.fontWeight,
              letterSpacing: INTRO_HEADLINE.letterSpacing,
              lineHeight: INTRO_HEADLINE.lineHeight,
              opacity: bodyReveal,
              transform: `translateY(${bodyY}px)`,
              willChange: 'transform, opacity',
            }}
          >
            {TAGLINE_ROWS.map((row, ri) => (
              <div key={ri} style={{ marginTop: ri === 0 ? 0 : '0.28em', lineHeight: 1.18 }}>
                {row.map((word, ci) => (
                  <React.Fragment key={`${ri}-${word}`}>
                    <BodyWord word={word} row={ri} col={ci} frame={frame} fps={fps} />
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
