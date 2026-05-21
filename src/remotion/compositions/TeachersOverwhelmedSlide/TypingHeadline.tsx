/**
 * Center typing: blinking | → word-by-word → OVERWHELMED (bold black caps) → blue select → hide.
 */
import React from 'react'
import { Easing, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import {
  COLOR_SLATE,
  SELECT_BLUE,
  T_CURSOR_END,
  WORD_TEACHERS_END,
  WORD_ARE_END,
  WORD_OVER_END,
  HIGHLIGHT_START,
  HIGHLIGHT_END,
  CLOSE_START,
} from './constants'
import {
  INTRO_HEADLINE,
  INTRO_HEADLINE_EMPHASIS_WEIGHT,
} from '../shared/introHeadlineTypography'

type TypingHeadlineProps = {
  fontFamily: string
}

const WORD_SPRING = { damping: 200, stiffness: 88, mass: 0.95 }

const showWord = (frame: number, start: number, end: number, fps: number): number => {
  if (frame < start) return 0
  if (frame >= end) return 1
  return spring({ frame: frame - start, fps, config: WORD_SPRING })
}

export const TypingHeadline: React.FC<TypingHeadlineProps> = ({ fontFamily }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const cursorOnly = frame < T_CURSOR_END
  const cursorBlink = Math.floor(frame / 8) % 2 === 0

  const teachersP = showWord(frame, T_CURSOR_END, WORD_TEACHERS_END, fps)
  const areP = showWord(frame, WORD_TEACHERS_END + 2, WORD_ARE_END, fps)
  const overP = showWord(frame, WORD_ARE_END + 2, WORD_OVER_END, fps)

  const lineVisible = teachersP > 0.02 || areP > 0.02 || overP > 0.02 || cursorOnly

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

  const wordStyle = (p: number, extra?: React.CSSProperties): React.CSSProperties => ({
    display: 'inline-block',
    opacity: interpolate(p, [0, 1], [0, 1], { extrapolateRight: 'clamp' }),
    transform: `translateY(${interpolate(p, [0, 1], [10, 0], { extrapolateRight: 'clamp' })}px)`,
    ...extra,
  })

  const showCursorAfter =
    (teachersP > 0.92 && areP < 0.08) ||
    (areP > 0.92 && overP < 0.08) ||
    (overP > 0.05 && overP < 0.98)

  const showTrailingCursor =
    !cursorOnly &&
    frame < HIGHLIGHT_START &&
    overP < 0.98 &&
    (showCursorAfter || (teachersP < 0.92 && frame >= T_CURSOR_END))

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
        opacity: lineVisible ? 1 : 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          justifyContent: 'center',
          maxWidth: INTRO_HEADLINE.maxWidth,
          fontFamily,
          fontSize: INTRO_HEADLINE.fontSize,
          fontWeight: INTRO_HEADLINE.fontWeight,
          color: COLOR_SLATE,
          letterSpacing: INTRO_HEADLINE.letterSpacing,
          lineHeight: INTRO_HEADLINE.lineHeight,
          textAlign: 'center',
          gap: INTRO_HEADLINE.wordGap,
        }}
      >
        {cursorOnly && (
          <span
            style={{
              fontWeight: 300,
              fontSize: INTRO_HEADLINE.fontSize,
              opacity: cursorBlink ? 1 : 0.15,
            }}
          >
            |
          </span>
        )}

        {!cursorOnly && (
          <>
            <span style={wordStyle(teachersP)}>Teachers</span>
            {teachersP > 0.85 && (
              <>
                <span style={wordStyle(areP)}>are</span>
                {areP > 0.85 && (
                  <span
                    style={{
                      ...wordStyle(overP),
                      position: 'relative',
                      display: 'inline-block',
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
                        fontWeight: INTRO_HEADLINE_EMPHASIS_WEIGHT,
                        textTransform: 'uppercase',
                        letterSpacing: INTRO_HEADLINE.letterSpacing,
                        color:
                          highlightOn || (frame >= HIGHLIGHT_END && highlightFade > 0.15)
                            ? '#FFFFFF'
                            : COLOR_SLATE,
                        opacity: 1,
                      }}
                    >
                      OVERWHELMED
                    </span>
                  </span>
                )}
              </>
            )}
            {showTrailingCursor && (
              <span
                style={{
                  fontWeight: 300,
                  fontSize: INTRO_HEADLINE.fontSize,
                  opacity: cursorBlink ? 0.9 : 0.12,
                }}
              >
                |
              </span>
            )}
          </>
        )}
      </div>
    </div>
  )
}
