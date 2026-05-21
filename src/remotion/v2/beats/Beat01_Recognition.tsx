/**
 * Beat 01 — Recognition (267 frames / ~8.9 s)
 * Global: 0–267
 * Type: A — Documentary-style image + text
 *
 * Visual intent: "That's exactly my life."
 * Think: Apple "Designed in California" — cinematic photograph,
 * quiet words, no decoration. The viewer feels before they think.
 *
 * Local frame map:
 *   0–267   "Teacher in Dim Room.png" full-frame, Ken Burns push-in (1.0→1.04)
 *   0–60    "9 PM." fades in at lower-left, holds
 *   60–90   "9 PM." holds + breathes
 *   90–120  "9 PM." fades out upward
 *   120–180 "The classroom is empty." fades in
 *   180–210 hold
 *   210–240 "The classroom is empty." fades out
 *   240–267 "But Sarah is still here." fades in and holds to beat end
 *            "Sarah" in coral with animated underline
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

export const BEAT01_DURATION = 267

// Gentle, non-bouncy — text arrives with quiet authority
const SETTLE = { damping: 200, stiffness: 90, mass: 1 } as const
// Fast settle for the final "Sarah" line — only 27 frames to land
const FAST = { damping: 150, stiffness: 200, mass: 1 } as const

// Warm white — legible over photograph, not harsh
const WARM_WHITE = '#FFF8F0'

export const Beat01_Recognition: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Breathing: 0.5%, 4-second sine cycle
  const breathe = 1 + 0.005 * Math.sin(frame * (2 * Math.PI / 120))

  // ── Ken Burns: subtle scale push-in over full beat ────────────────────────
  const kenBurnsScale = interpolate(frame, [0, BEAT01_DURATION], [1.0, 1.04], {
    extrapolateRight: 'clamp',
  })

  // ── LINE 1: "9 PM." (0–120) ──────────────────────────────────────────────
  const l1S = spring({ frame, fps, config: SETTLE, durationInFrames: 25 })
  const l1EnterY = interpolate(l1S, [0, 1], [16, 0])
  const l1Opacity = interpolate(frame, [0, 20, 90, 120], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  // Breathe during the hold (frames 60–90)
  const l1Scale = frame >= 60 && frame < 90 ? breathe : 1
  // Exit: drift up slightly while fading
  const l1ExitY = interpolate(frame, [90, 120], [0, -10], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const l1Y = l1EnterY + l1ExitY

  // ── LINE 2: "The classroom is empty." (120–240) ───────────────────────────
  const l2S = spring({
    frame: Math.max(0, frame - 120),
    fps,
    config: SETTLE,
    durationInFrames: 25,
  })
  const l2EnterY = interpolate(l2S, [0, 1], [16, 0])
  const l2Opacity = interpolate(frame, [120, 142, 210, 240], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const l2Scale = frame >= 168 && frame < 210 ? breathe : 1
  const l2ExitY = interpolate(frame, [210, 240], [0, -10], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const l2Y = l2EnterY + l2ExitY

  // ── LINE 3: "But Sarah is still here." (240–267) ──────────────────────────
  // Only 27 frames — quick spring, immediate presence
  const l3S = spring({
    frame: Math.max(0, frame - 240),
    fps,
    config: FAST,
    durationInFrames: 15,
  })
  const l3Y = interpolate(l3S, [0, 1], [14, 0])
  const l3Opacity = interpolate(frame, [240, 254, 257, 267], [0, 1, 1, 0.9], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // "Sarah" coral underline — draws across in 14 frames (246–260)
  const underlineS = spring({
    frame: Math.max(0, frame - 246),
    fps,
    config: { damping: 200, stiffness: 120, mass: 1 },
    durationInFrames: 14,
  })
  const underlineWidth = interpolate(underlineS, [0, 1], [0, 100])

  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#0A0A0A' }}>

      {/* ══ HERO IMAGE — full-frame with Ken Burns push-in ═══════════════════ */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${kenBurnsScale})`,
          transformOrigin: '55% 45%',   // push toward the teacher
          overflow: 'hidden',
        }}
      >
        <Img
          src={IMG.teacherDimRoom}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            display: 'block',
          }}
        />
      </div>

      {/* ══ CINEMATIC LAYERS (over image) ═══════════════════════════════════ */}

      {/* Warm colour grade — gives photograph the "late evening" tone */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(255, 170, 120, 0.12)',
          pointerEvents: 'none',
        }}
      />

      {/* Lens vignette — darkens edges, pulls focus to center */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 42%, rgba(0,0,0,0.72) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Lower-third gradient — ensures text legibility over any image content */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.30) 28%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      {/* ══ TEXT LAYER — lower-left, documentary style ══════════════════════ */}
      <div
        style={{
          position: 'absolute',
          left: 100,
          bottom: 108,
          right: 100,
          pointerEvents: 'none',
        }}
      >
        {/* ── L1: "9 PM." ──────────────────────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            opacity: l1Opacity,
            transform: `translateY(${l1Y}px) scale(${l1Scale})`,
            transformOrigin: 'left bottom',
          }}
        >
          <span
            style={{
              fontFamily: soraFont,
              fontSize: 172,
              fontWeight: 700,
              color: WARM_WHITE,
              letterSpacing: '0.008em',
              lineHeight: 1,
              display: 'block',
              textShadow: '0 3px 24px rgba(0,0,0,0.7), 0 1px 6px rgba(0,0,0,0.5)',
            }}
          >
            9 PM.
          </span>
        </div>

        {/* ── L2: "The classroom is empty." ────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            opacity: l2Opacity,
            transform: `translateY(${l2Y}px) scale(${l2Scale})`,
            transformOrigin: 'left bottom',
          }}
        >
          <span
            style={{
              fontFamily: soraFont,
              fontSize: 88,
              fontWeight: 700,
              color: WARM_WHITE,
              letterSpacing: '-0.024em',
              lineHeight: 1.1,
              display: 'block',
              textShadow: '0 2px 20px rgba(0,0,0,0.7), 0 1px 5px rgba(0,0,0,0.5)',
              maxWidth: 1400,
            }}
          >
            The classroom is empty.
          </span>
        </div>

        {/* ── L3: "But Sarah is still here." ───────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            opacity: l3Opacity,
            transform: `translateY(${l3Y}px)`,
            transformOrigin: 'left bottom',
          }}
        >
          <p
            style={{
              fontFamily: soraFont,
              fontSize: 88,
              fontWeight: 700,
              letterSpacing: '-0.026em',
              lineHeight: 1.1,
              margin: 0,
              padding: 0,
              whiteSpace: 'nowrap',
              textShadow: '0 2px 20px rgba(0,0,0,0.7), 0 1px 5px rgba(0,0,0,0.5)',
            }}
          >
            <span style={{ color: WARM_WHITE }}>But </span>

            {/* "Sarah" — coral with animated underline */}
            <span
              style={{
                color: theme.colors.coral,
                position: 'relative',
                display: 'inline-block',
              }}
            >
              Sarah
              <div
                style={{
                  position: 'absolute',
                  bottom: -10,
                  left: 0,
                  height: 3,
                  width: `${underlineWidth}%`,
                  background: theme.colors.coral,
                  borderRadius: 2,
                  boxShadow: '0 1px 8px rgba(255,182,158,0.6)',
                }}
              />
            </span>

            <span style={{ color: WARM_WHITE }}> is still here.</span>
          </p>
        </div>
      </div>

      {/* BeatTransition: opening fade from white, subtle closing */}
      <BeatTransition beatDuration={BEAT01_DURATION} openingFade closingFade />
    </AbsoluteFill>
  )
}
