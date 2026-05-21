/**
 * Beat 02 — The Weight (354 frames / ~11.8 s)
 * Global: 267–621
 * Type: A — Blurred image backdrop + spring word pile
 *
 * Visual intent: "Wait, what's all this?"
 * "Teacher in Dim Room.png" blurred at 20px behind the word pile
 * gives the pile physical weight — it's pressing down on a real person.
 *
 * Local frame map:
 *   0–22    Background settles, first word about to fall
 *   22–215  Admin words drop one by one with spring + thud bounce
 *   215–354 "Teaching" rises from below in coral
 *            Coral radial glow warms the pile
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
  weights: ['700'],
  subsets: ['latin'],
})

export const BEAT02_DURATION = 354

// Word drop: ~4% overshoot → satisfying physical thud
const DROP = { damping: 20, stiffness: 200, mass: 1 } as const
// Teaching rise: slow, buried-under-everything emergence
const RISE = { damping: 160, stiffness: 50, mass: 1 } as const

// Warm white — legible over dark blurred image
const WARM_WHITE = '#FFF8F0'

interface WordDef {
  text: string
  startFrame: number
  finalY: number
  rot: number
  dx: number
  fontSize: number
  color: string
}

const WORDS: WordDef[] = [
  { text: 'Lesson plans',  startFrame: 22,  finalY: 310, rot: -1.8, dx: -28, fontSize: 84, color: WARM_WHITE },
  { text: 'Worksheets',    startFrame: 57,  finalY: 400, rot:  1.5, dx:  42, fontSize: 84, color: WARM_WHITE },
  { text: 'Grading',       startFrame: 92,  finalY: 485, rot: -2.2, dx: -18, fontSize: 84, color: WARM_WHITE },
  { text: 'Reports',       startFrame: 124, finalY: 568, rot:  1.8, dx:  32, fontSize: 84, color: WARM_WHITE },
  { text: 'Parent emails', startFrame: 156, finalY: 648, rot: -0.8, dx: -35, fontSize: 84, color: WARM_WHITE },
]

const TEACHING: WordDef = {
  text: 'Teaching',
  startFrame: 215,
  finalY: 748,
  rot: 0,
  dx: 0,
  fontSize: 62,
  color: theme.colors.coral,
}

export const Beat02_TheWeight: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Coral glow builds as Teaching emerges
  const coralGlowOpacity = interpolate(frame, [215, 280], [0, 0.7], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ background: '#1A0F0A', overflow: 'hidden' }}>

      {/* ── Blurred background image ─────────────────────────────────────── */}
      {/* scale(1.08) prevents blur halo at edges */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <Img
          src={IMG.teacherDimRoom}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scale(1.08)',
            filter: 'blur(18px) brightness(0.35)',
            display: 'block',
          }}
        />
      </div>

      {/* Warm dark overlay — prevents image from competing with text */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(60, 25, 10, 0.35)',
          pointerEvents: 'none',
        }}
      />

      {/* Paper grain */}
      <GrainLayer id="b02grain" />

      {/* Coral radial glow — warms up behind the pile when Teaching appears */}
      <div
        style={{
          position: 'absolute',
          top: TEACHING.finalY - 120,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 700,
          height: 280,
          background: `radial-gradient(ellipse, rgba(255,100,60,0.22) 0%, rgba(255,100,60,0.08) 45%, transparent 70%)`,
          opacity: coralGlowOpacity,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Admin task words */}
      {WORDS.map((w) => (
        <FallingWord key={w.text} def={w} frame={frame} fps={fps} />
      ))}

      {/* "Teaching" — rises slowly from beneath everything */}
      <FallingWord def={TEACHING} frame={frame} fps={fps} crushed />

      <BeatTransition beatDuration={BEAT02_DURATION} openingFade closingFade />
    </AbsoluteFill>
  )
}

// ── Falling word ──────────────────────────────────────────────────────────────

interface FallingWordProps {
  def: WordDef
  frame: number
  fps: number
  crushed?: boolean
}

const FallingWord: React.FC<FallingWordProps> = ({ def, frame, fps, crushed = false }) => {
  const elapsed = Math.max(0, frame - def.startFrame)
  if (frame < def.startFrame - 2) return null

  const s = spring({
    frame: elapsed,
    fps,
    config: crushed ? RISE : DROP,
    durationInFrames: crushed ? 70 : 30,
  })

  const y = crushed
    ? interpolate(s, [0, 1], [1160, def.finalY], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : interpolate(s, [0, 1], [-120, def.finalY], { extrapolateLeft: 'clamp', extrapolateRight: 'extend' })

  const opacity = interpolate(elapsed, [0, crushed ? 20 : 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: '50%',
        transform: [
          `translateX(calc(-50% + ${def.dx}px))`,
          `rotate(${def.rot}deg)`,
          crushed ? 'scaleY(0.88)' : '',
        ].filter(Boolean).join(' '),
        transformOrigin: 'center center',
        opacity,
        zIndex: 1,
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          fontFamily: soraFont,
          fontSize: def.fontSize,
          fontWeight: 700,
          color: def.color,
          letterSpacing: crushed ? '-0.035em' : '-0.025em',
          lineHeight: 1,
          display: 'block',
          opacity: crushed ? 0.85 : 1,
          // Subtle text shadow for depth over blurred image
          textShadow: crushed
            ? '0 2px 16px rgba(255,100,60,0.4)'
            : '0 2px 20px rgba(0,0,0,0.6)',
        }}
      >
        {def.text}
      </span>
    </div>
  )
}

const GrainLayer: React.FC<{ id: string }> = ({ id }) => (
  <svg
    style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      opacity: 0.05,
      pointerEvents: 'none',
      zIndex: 0,
    }}
  >
    <defs>
      <filter id={id} x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" seed="15" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
    </defs>
    <rect width="1920" height="1080" filter={`url(#${id})`} />
  </svg>
)
