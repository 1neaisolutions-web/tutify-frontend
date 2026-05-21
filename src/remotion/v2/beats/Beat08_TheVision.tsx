/**
 * Beat 08 — The Vision (300 frames / 10 s)
 * Global: 2277–2577
 * Type: A — Quiet Typography (second and final use)
 *
 * Visual intent: "This should exist."
 * Apple-quiet. Maximum stillness. The words carry everything.
 *
 * Background: "Teacher in Sunlight.png" at 0.07 opacity — pure warmth
 * without visual competition. You feel the image more than you see it.
 *
 * Local frame map:
 *   0–60    "Tutify isn't just another tool." — spring entrance
 *   60–120  hold + breathing
 *   120–150 first line fades up + out
 *   150–210 "It's how the" fades in (charcoal)
 *   180–270 "next generation" — gradient fill, larger, spring entrance
 *   240–300 "of education works." — completes the sentence
 *   270–300 full composition holds, breathing on gradient line
 */
import React from 'react'
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion'
import { loadFont } from '@remotion/google-fonts/Sora'
import { theme } from '../theme'
import { BeatTransition } from '../components/BeatTransition'
import { IMG } from '../assets'

const { fontFamily: soraFont } = loadFont('normal', {
  weights: ['600', '700'],
  subsets: ['latin'],
})

export const BEAT08_DURATION = 300

const ENTER = { damping: 200, stiffness: 100, mass: 1 } as const
const EXIT_DUR = 20  // frames for text to drift up + out

export const Beat08_TheVision: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Breathing (0.5%, 4s)
  const breathe = 1 + 0.005 * Math.sin(frame * (2 * Math.PI / 120))

  // Camera push-in
  const cameraScale = interpolate(frame, [0, BEAT08_DURATION], [1.0, 1.018], {
    extrapolateRight: 'clamp',
  })

  // ── L1: "Tutify isn't just another tool." (0–150) ─────────────────────────
  const l1S = spring({ frame, fps, config: ENTER, durationInFrames: 30 })
  const l1EnterY = interpolate(l1S, [0, 1], [14, 0])
  const l1Opacity = interpolate(frame, [0, 18, 120, 150], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const l1ExitY = interpolate(frame, [120, 150], [0, -12], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const l1Scale = frame >= 18 && frame < 120 ? breathe : 1

  // ── L2: "It's how the" (150–300) ──────────────────────────────────────────
  const l2S = spring({
    frame: Math.max(0, frame - 150),
    fps,
    config: ENTER,
    durationInFrames: 28,
  })
  const l2Y = interpolate(l2S, [0, 1], [12, 0])
  const l2Opacity = interpolate(frame, [150, 168], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // ── L3: "next generation" — gradient text (180–300) ───────────────────────
  const l3S = spring({
    frame: Math.max(0, frame - 180),
    fps,
    config: ENTER,
    durationInFrames: 28,
  })
  const l3Y = interpolate(l3S, [0, 1], [14, 0])
  const l3Opacity = interpolate(frame, [180, 200], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const l3Scale = frame >= 240 ? 1 + 0.006 * Math.sin(frame * (2 * Math.PI / 120)) : 1

  // ── L4: "of education works." (240–300) ───────────────────────────────────
  const l4S = spring({
    frame: Math.max(0, frame - 240),
    fps,
    config: ENTER,
    durationInFrames: 28,
  })
  const l4Y = interpolate(l4S, [0, 1], [12, 0])
  const l4Opacity = interpolate(frame, [240, 258], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {/* Warm cream → soft mint gradient background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(145deg, #FFF4E6 0%, #F0FAF5 100%)',
        }}
      />

      {/* Teacher in Sunlight — very faint background warmth */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Img
          src={IMG.teacherSunlight}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 30%',
            opacity: 0.07,
            display: 'block',
            transform: `scale(${cameraScale})`,
          }}
        />
      </div>

      <GrainLayer id="b08grain" />

      {/* Camera scale wrapper */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${cameraScale})`,
          transformOrigin: '50% 50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        {/* ── L1 ─────────────────────────────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            top: '36%',
            left: '50%',
            transform: `translate(-50%, 0) translateY(${l1EnterY + l1ExitY}px) scale(${l1Scale})`,
            opacity: l1Opacity,
            textAlign: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          <span
            style={{
              fontFamily: soraFont,
              fontSize: 72,
              fontWeight: 600,
              color: theme.colors.charcoal,
              letterSpacing: '-0.028em',
              lineHeight: 1,
            }}
          >
            Tutify isn't just another tool.
          </span>
        </div>

        {/* ── L2 + L3 + L4 — stacked poem ─────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            top: '32%',
            left: '50%',
            transform: 'translate(-50%, 0)',
            textAlign: 'center',
          }}
        >
          {/* "It's how the" */}
          <div
            style={{
              opacity: l2Opacity,
              transform: `translateY(${l2Y}px)`,
              marginBottom: 4,
            }}
          >
            <span
              style={{
                fontFamily: soraFont,
                fontSize: 76,
                fontWeight: 600,
                color: theme.colors.charcoal,
                letterSpacing: '-0.028em',
                lineHeight: 1,
                display: 'block',
              }}
            >
              It&apos;s how the
            </span>
          </div>

          {/* "next generation" — gradient fill, 120px */}
          <div
            style={{
              opacity: l3Opacity,
              transform: `translateY(${l3Y}px) scale(${l3Scale})`,
              transformOrigin: 'center center',
              marginBottom: 4,
            }}
          >
            {/* SVG-based gradient text — most reliable cross-renderer approach */}
            <svg
              width="1400"
              height="145"
              viewBox="0 0 1400 145"
              style={{ display: 'block', margin: '0 auto', overflow: 'visible' }}
            >
              <defs>
                <linearGradient id="ngGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={theme.colors.skyBlue} />
                  <stop offset="100%" stopColor={theme.colors.mint} />
                </linearGradient>
              </defs>
              <text
                x="700"
                y="120"
                textAnchor="middle"
                fontFamily={soraFont}
                fontSize="118"
                fontWeight="700"
                letterSpacing="-4"
                fill="url(#ngGrad)"
              >
                next generation
              </text>
            </svg>
          </div>

          {/* "of education works." */}
          <div
            style={{
              opacity: l4Opacity,
              transform: `translateY(${l4Y}px)`,
            }}
          >
            <span
              style={{
                fontFamily: soraFont,
                fontSize: 76,
                fontWeight: 600,
                color: theme.colors.charcoal,
                letterSpacing: '-0.028em',
                lineHeight: 1,
                display: 'block',
              }}
            >
              of education works.
            </span>
          </div>
        </div>
      </div>

      <BeatTransition beatDuration={BEAT08_DURATION} openingFade closingFade />
    </AbsoluteFill>
  )
}

const GrainLayer: React.FC<{ id: string }> = ({ id }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04, pointerEvents: 'none', zIndex: 0 }}>
    <defs>
      <filter id={id} x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" seed="31" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
    </defs>
    <rect width="1920" height="1080" filter={`url(#${id})`} />
  </svg>
)
