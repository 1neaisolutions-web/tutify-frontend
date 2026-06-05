/**
 * Real typewriter: char-by-char, spaces included in segments, inline blinking cursor.
 */
import React from 'react'
import { Easing, interpolate } from 'remotion'
import { useCurrentFrame } from '@/remotion/shared/timelineFrame'

import {
  COLOR_SLATE,
  SELECT_BLUE,
  T_CURSOR_END,
  HIGHLIGHT_START,
  HIGHLIGHT_END,
  CLOSE_START,
} from './constants'
import {
  INTRO_HEADLINE,
  INTRO_HEADLINE_EMPHASIS_WEIGHT,
} from '../shared/introHeadlineTypography'
import { getTypingState, splitForRender } from './typingEngine'

type TypingHeadlineProps = {
  fontFamily: string
}

const CURSOR_BLINK_FRAMES = 16

export const TypingHeadline: React.FC<TypingHeadlineProps> = ({ fontFamily }) => {
  const frame = useCurrentFrame()

  const { phase, visibleText, atWordBoundary } = getTypingState(frame)
  const { normal, emphasis } = splitForRender(visibleText)
  const cursorBlink = Math.floor(frame / CURSOR_BLINK_FRAMES) % 2 === 0

  const highlightOn = frame >= HIGHLIGHT_START && frame < HIGHLIGHT_END
  const highlightFade = interpolate(
    frame,
    [HIGHLIGHT_END, CLOSE_START + 10],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.quad),
    },
  )

  const showCursor =
    phase === 'cursor' ||
    phase === 'typing' ||
    phase === 'word_pause' ||
    phase === 'erasing' ||
    (phase === 'done' && frame < CLOSE_START && visibleText.length > 0)

  const cursorOpacity =
    phase === 'cursor' || atWordBoundary
      ? cursorBlink
        ? 1
        : 0.12
      : cursorBlink
        ? 0.92
        : 0.14

  const lineVisible = phase === 'cursor' || showCursor || visibleText.length > 0
  const maskReveal = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })
  const maskInset = interpolate(maskReveal, [0, 1], [46, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const revealOpacity = interpolate(maskReveal, [0, 1], [0.6, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const revealBlur = interpolate(maskReveal, [0, 1], [5, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const headlineBase: React.CSSProperties = {
    fontFamily,
    fontSize: INTRO_HEADLINE.fontSize,
    fontWeight: INTRO_HEADLINE.fontWeight,
    color: COLOR_SLATE,
    letterSpacing: INTRO_HEADLINE.letterSpacing,
    lineHeight: INTRO_HEADLINE.lineHeight,
    whiteSpace: 'pre',
  }

  const cursorStyle: React.CSSProperties = {
    fontWeight: 300,
    fontSize: INTRO_HEADLINE.fontSize,
    lineHeight: INTRO_HEADLINE.lineHeight,
    opacity: cursorOpacity,
    marginLeft: visibleText.length > 0 ? '0.06em' : 0,
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 30,
        pointerEvents: 'none',
        padding: `0 ${INTRO_HEADLINE.paddingX}px`,
        opacity: lineVisible ? revealOpacity : 0,
        clipPath: `inset(${maskInset}% 0 ${maskInset}% 0 round 18px)`,
        filter: revealBlur > 0.2 ? `blur(${revealBlur}px)` : undefined,
      }}
    >
      {phase === 'cursor' ? (
        <span style={{ ...headlineBase, ...cursorStyle }}>|</span>
      ) : (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            flexWrap: 'wrap',
            maxWidth: INTRO_HEADLINE.maxWidth,
            textAlign: 'center',
            ...headlineBase,
          }}
        >
          {normal.length > 0 ? <span>{normal}</span> : null}

          {emphasis.length > 0 ? (
            <span
              style={{
                position: 'relative',
                display: 'inline-block',
                fontWeight: INTRO_HEADLINE_EMPHASIS_WEIGHT,
                textTransform: 'uppercase',
                letterSpacing: INTRO_HEADLINE.letterSpacing,
              }}
            >
              {(highlightOn || (frame >= HIGHLIGHT_END && highlightFade > 0)) && (
                <span
                  style={{
                    position: 'absolute',
                    left: -10,
                    right: -10,
                    top: '6%',
                    bottom: '4%',
                    background: SELECT_BLUE,
                    borderRadius: 8,
                    opacity: highlightOn ? 1 : highlightFade,
                    zIndex: 0,
                  }}
                />
              )}
              <span
                style={{
                  position: 'relative',
                  zIndex: 1,
                  color:
                    highlightOn || (frame >= HIGHLIGHT_END && highlightFade > 0.15)
                      ? '#FFFFFF'
                      : COLOR_SLATE,
                }}
              >
                {emphasis}
              </span>
            </span>
          ) : null}

          {showCursor && <span style={cursorStyle}>|</span>}
        </div>
      )}
    </div>
  )
}
