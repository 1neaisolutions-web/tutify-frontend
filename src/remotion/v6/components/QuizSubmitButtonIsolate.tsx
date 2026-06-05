/**
 * Zelios-style beat: dark purple field → white UI card → zoom into bottom-right CTA + click.
 */
import React from 'react'
import { AbsoluteFill, Easing, interpolate } from 'remotion'
import { useCurrentFrame } from '@/remotion/shared/timelineFrame'

import {
  QUIZ_SUBMIT_CLICK_HOLD,
  QUIZ_SUBMIT_ZOOM_IN_FRAMES,
  quizSubmitButtonPress,
  quizSubmitCardFocusZoom,
  quizSubmitCardTilt,
  quizSubmitGlowOpacity,
} from '../../shared/transitions/quizSubmitClickZoom'

const PURPLE_GRADIENT = 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 48%, #4C1D95 100%)'

/** Cursor target on isolated card CTA (1920×1080). */
export const QUIZ_SUBMIT_ISOLATE_BUTTON = { x: 1412, y: 748 }
export const QUIZ_SUBMIT_ISOLATE_CENTER = { x: 960, y: 500 }

const CARD_W = 1080
const CARD_H = 640

type QuizSubmitButtonIsolateProps = {
  focusStart: number
  clickAt: number
  restoreAt: number
  fontFamily: string
  clicking: boolean
  ripple: number
  cursorX: number
  cursorY: number
}

const PremiumCursor: React.FC<{
  x: number
  y: number
  clicking?: boolean
  ripple?: number
}> = ({ x, y, clicking, ripple = 0 }) => (
  <>
    {ripple > 0 ? (
      <div
        style={{
          position: 'absolute',
          left: x - 24,
          top: y - 24,
          width: 48,
          height: 48,
          borderRadius: '50%',
          border: '2px solid rgba(124,58,237,0.6)',
          transform: `scale(${1 + ripple * 2.8})`,
          opacity: Math.max(0, 1 - ripple),
          pointerEvents: 'none',
        }}
      />
    ) : null}
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: clicking ? 'scale(0.86) translateY(2px)' : 'scale(1)',
        filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.35))',
      }}
    >
      <svg width={32} height={32} viewBox="0 0 24 24">
        <path
          d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 01.35-.15h6.87a.5.5 0 00.35-.85L6.35 3.21a.5.5 0 00-.85.35z"
          fill="#fff"
          stroke="#0f172a"
          strokeWidth="1.2"
        />
      </svg>
    </div>
  </>
)

/** Faint placeholder lines — suggests document UI without readable clutter. */
const MockDocumentBody: React.FC = () => (
  <div style={{ flex: 1, padding: '8px 4px 0', opacity: 0.55 }}>
    {[
      { w: '72%', h: 12 },
      { w: '88%', h: 10 },
      { w: '64%', h: 10 },
      { w: '80%', h: 12 },
      { w: '50%', h: 10 },
    ].map((row, i) => (
      <div
        key={i}
        style={{
          height: row.h,
          width: row.w,
          borderRadius: 6,
          background: 'linear-gradient(90deg, #E9D5FF 0%, #F3E8FF 100%)',
          marginBottom: 14,
        }}
      />
    ))}
  </div>
)

export const QuizSubmitButtonIsolate: React.FC<QuizSubmitButtonIsolateProps> = ({
  focusStart,
  clickAt,
  restoreAt,
  fontFamily,
  clicking,
  ripple,
  cursorX,
  cursorY,
}) => {
  const frame = useCurrentFrame()
  const beatOpacity = interpolate(frame, [focusStart - 6, focusStart], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })
  const beatOut = interpolate(frame, [restoreAt - 8, restoreAt], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  if (beatOpacity < 0.02 && beatOut < 0.02) return null

  const zoomEnd = focusStart + QUIZ_SUBMIT_ZOOM_IN_FRAMES
  const clickEnd = clickAt + QUIZ_SUBMIT_CLICK_HOLD
  const cardZoom = quizSubmitCardFocusZoom(frame, focusStart)
  const tilt = quizSubmitCardTilt(frame, focusStart, zoomEnd)
  const press = quizSubmitButtonPress(frame, clickAt)
  const glow = quizSubmitGlowOpacity(frame, clickAt, clickEnd)
  const cardFade = interpolate(frame, [focusStart, focusStart + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const tealGlow = `0 0 ${36 + glow * 40}px rgba(45,212,191,${0.35 + glow * 0.45}), 0 28px 90px rgba(0,0,0,${0.18 + glow * 0.08})`

  return (
    <AbsoluteFill
      style={{
        opacity: beatOpacity * beatOut,
        zIndex: 420,
        pointerEvents: 'none',
        fontFamily,
      }}
    >
      <AbsoluteFill
        style={{
          background: `
            radial-gradient(ellipse 90% 80% at 50% 42%, #2d1b4e 0%, #1a0f2e 42%, #120a22 100%),
            radial-gradient(ellipse 50% 40% at 85% 15%, rgba(124,58,237,0.35) 0%, transparent 55%),
            radial-gradient(ellipse 45% 38% at 10% 88%, rgba(91,33,182,0.4) 0%, transparent 52%)
          `,
        }}
      />

      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: 1600,
        }}
      >
        <div
          style={{
            width: CARD_W,
            height: CARD_H,
            opacity: cardFade,
            transform: `
              perspective(1600px)
              rotateX(${tilt.rotateX}deg)
              rotateY(${tilt.rotateY}deg)
              scale(${cardZoom})
            `,
            transformOrigin: '88% 90%',
            borderRadius: 22,
            background: '#fff',
            boxShadow: tealGlow,
            border: '1px solid rgba(226,232,240,0.85)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '22px 28px 12px',
              background: 'linear-gradient(180deg, #FAF5FF 0%, #FFFFFF 38%)',
              borderBottom: '1px solid #F3E8FF',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#A78BFA',
              }}
            >
              Course Assessment
            </p>
            <p style={{ margin: '8px 0 0', fontSize: 18, fontWeight: 700, color: '#1F2937' }}>
              Review & submit
            </p>
          </div>

          <MockDocumentBody />

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: '18px 28px 26px',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                padding: '15px 34px',
                borderRadius: 999,
                background: PURPLE_GRADIENT,
                color: '#fff',
                fontSize: 17,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                transform: `scale(${press})`,
                boxShadow:
                  glow > 0.02
                    ? `0 0 ${40 + glow * 36}px rgba(124,58,237,0.65), 0 10px 32px rgba(91,33,182,0.45)`
                    : '0 10px 28px rgba(91,33,182,0.4)',
              }}
            >
              Submit Assessment →
            </div>
          </div>
        </div>
      </AbsoluteFill>

      <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
        <PremiumCursor x={cursorX} y={cursorY} clicking={clicking} ripple={ripple} />
      </div>
    </AbsoluteFill>
  )
}
