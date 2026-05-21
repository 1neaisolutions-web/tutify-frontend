/**
 * Scene 00 V5 — Cinematic Opening on light periwinkle background.
 *
 * Three-beat story matching V4 visual identity:
 *   Beat A (0–90f):  "THE REALITY OF TEACHING TODAY" — char-by-char blur reveal
 *   Beat B (90–195f): "Education is changing." — large scale entrance
 *   Beat C (195–270f): "Every second. Every student. Matters." — staggered impact
 *
 * Background: AnimatedGradientBG 'cool' (light periwinkle mesh, same as v4 intros).
 * Text: dark ink palette (#1E1B4B / primary) matching v4 aesthetic.
 * Total: 270 frames (9 s)
 */
import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { loadFont } from '@remotion/google-fonts/Inter'
import { AnimatedGradientBG } from '../../v4/components/AnimatedGradientBG'
import { theme } from '../theme'

const { fontFamily: interFont } = loadFont('normal', {
  weights: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
})

export const SCENE00_DURATION = 270

const BEAT_A_START = 0
const BEAT_A_END   = 90
const BEAT_B_START = 90
const BEAT_B_END   = 195
const BEAT_C_START = 195
const BEAT_C_END   = SCENE00_DURATION

const fadeAOut = (frame: number) =>
  interpolate(frame, [BEAT_A_END - 16, BEAT_A_END], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })

const fadeBOut = (frame: number) =>
  interpolate(frame, [BEAT_B_END - 16, BEAT_B_END], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })

const fadeCOut = (frame: number) =>
  interpolate(frame, [BEAT_C_END - 22, BEAT_C_END], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })

// ── Beat A: "THE REALITY OF TEACHING TODAY" ───────────────────────────────
const BeatA: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const f = Math.max(0, frame - BEAT_A_START)
  const label = 'THE REALITY OF TEACHING TODAY'
  const alpha = interpolate(frame, [BEAT_A_START, BEAT_A_START + 20], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  }) * fadeAOut(frame)

  const chars = label.split('')
  const lineP = spring({ frame: f, fps, config: { damping: 80, stiffness: 100, mass: 1 } })
  const lineW = interpolate(lineP, [0, 1], [0, 520])

  return (
    <AbsoluteFill
      style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', opacity: alpha,
      }}
    >
      <div
        style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
          gap: '0.06em', maxWidth: 1100, textAlign: 'center',
          fontFamily: interFont,
          fontSize: 84,
          fontWeight: 800,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          lineHeight: 1.05,
        }}
      >
        {chars.map((char, i) => {
          const cf = Math.max(0, f - i * 1.2)
          const p = spring({ frame: cf, fps, config: { damping: 120, stiffness: 280, mass: 0.8 } })
          const op = interpolate(p, [0, 1], [0, 1])
          const blur = interpolate(p, [0, 1], [12, 0])
          const ty = interpolate(p, [0, 1], [20, 0])
          return (
            <span
              key={i}
              style={{
                opacity: op,
                filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
                transform: `translateY(${ty}px)`,
                display: 'inline-block',
                whiteSpace: char === ' ' ? 'pre' : 'normal',
                color: theme.colors.text,
              }}
            >
              {char === ' ' ? ' ' : char}
            </span>
          )
        })}
      </div>
      <div
        style={{
          marginTop: 28,
          height: 3,
          width: lineW,
          borderRadius: 3,
          background: `linear-gradient(90deg, transparent, ${theme.colors.primary}, transparent)`,
          opacity: 0.60,
        }}
      />
    </AbsoluteFill>
  )
}

// ── Beat B: "Education is changing." ─────────────────────────────────────
const BeatB: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const f = Math.max(0, frame - BEAT_B_START)
  const alpha = interpolate(frame, [BEAT_B_START, BEAT_B_START + 18], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  }) * fadeBOut(frame)

  const words = ['Education', 'is', 'changing.']
  return (
    <AbsoluteFill
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: alpha,
      }}
    >
      <div style={{ display: 'flex', gap: '0.28em', flexWrap: 'wrap', justifyContent: 'center' }}>
        {words.map((word, i) => {
          const wf = Math.max(0, f - i * 10)
          const p = spring({ frame: wf, fps, config: { damping: 50, stiffness: 140, mass: 1.1 } })
          const op = interpolate(p, [0, 1], [0, 1])
          const sc = interpolate(p, [0, 1], [1.22, 1])
          const blur = interpolate(p, [0, 1], [10, 0])
          const isLast = i === words.length - 1
          return (
            <span
              key={i}
              style={{
                opacity: op,
                filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
                transform: `scale(${sc})`,
                transformOrigin: 'center center',
                display: 'inline-block',
                fontFamily: interFont,
                fontSize: 118,
                fontWeight: isLast ? 800 : 500,
                letterSpacing: '-0.04em',
                lineHeight: 1,
                ...(isLast
                  ? {
                      background: `linear-gradient(135deg, ${theme.colors.text} 0%, ${theme.colors.primary} 60%, ${theme.colors.violet} 100%)`,
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent',
                    }
                  : { color: 'rgba(30,27,75,0.72)' }),
              }}
            >
              {word}
            </span>
          )
        })}
      </div>
    </AbsoluteFill>
  )
}

// ── Beat C: "Every second. Every student. Matters." ───────────────────────
const BEAT_C_LINES = [
  { text: 'Every second.',  delay: 0,  size: 96,  weight: 300, color: 'rgba(30,27,75,0.40)' },
  { text: 'Every student.', delay: 22, size: 96,  weight: 300, color: 'rgba(30,27,75,0.62)' },
  { text: 'Matters.',       delay: 44, size: 118, weight: 800, color: theme.colors.text },
]

const BeatC: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const f = Math.max(0, frame - BEAT_C_START)
  const masterAlpha = interpolate(frame, [BEAT_C_START, BEAT_C_START + 16], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  }) * fadeCOut(frame)

  return (
    <AbsoluteFill
      style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 12, opacity: masterAlpha,
      }}
    >
      {BEAT_C_LINES.map((line, i) => {
        const lf = Math.max(0, f - line.delay)
        const p = spring({ frame: lf, fps, config: theme.spring.word })
        const op = interpolate(p, [0, 1], [0, 1])
        const ty = interpolate(p, [0, 1], [40, 0])
        const sc = interpolate(p, [0, 1], [0.88, 1])
        const isLast = i === BEAT_C_LINES.length - 1
        return (
          <div
            key={i}
            style={{
              opacity: op,
              transform: `translateY(${ty}px) scale(${sc})`,
              fontFamily: interFont,
              fontSize: line.size,
              fontWeight: line.weight,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              ...(isLast
                ? {
                    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.violet} 100%)`,
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }
                : { color: line.color }),
            }}
          >
            {line.text}
          </div>
        )
      })}
      {(() => {
        const uf = Math.max(0, f - 58)
        const uP = spring({ frame: uf, fps, config: theme.spring.snappy })
        const uW = interpolate(uP, [0, 1], [0, 280])
        return (
          <div
            style={{
              height: 4,
              width: uW,
              borderRadius: 4,
              background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.violet})`,
              marginTop: 8,
              opacity: interpolate(uP, [0, 1], [0, 1]),
            }}
          />
        )
      })()}
    </AbsoluteFill>
  )
}

export const Scene00_Opening: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const masterIn  = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const masterOut = interpolate(frame, [SCENE00_DURATION - 20, SCENE00_DURATION], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  const showA = frame >= BEAT_A_START && frame < BEAT_A_END + 2
  const showB = frame >= BEAT_B_START && frame < BEAT_B_END + 2
  const showC = frame >= BEAT_C_START

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AnimatedGradientBG variant="cool" />
      <AbsoluteFill style={{ opacity: masterIn * masterOut }}>
        {showA && <BeatA frame={frame} fps={fps} />}
        {showB && <BeatB frame={frame} fps={fps} />}
        {showC && <BeatC frame={frame} fps={fps} />}
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
