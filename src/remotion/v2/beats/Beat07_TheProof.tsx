/**
 * Beat 07 — The Proof (300 frames / 10 s)
 * Global: 1977–2277
 * Type: D — Data & Motion
 *
 * Visual intent: "I want this for my school." (proof layer)
 * Three massive stat numbers count up. Below: a world map with
 * brand-coloured glowing dots appearing in continental waves.
 *
 * Local frame map:
 *   0–30    Caption fades in: "Real impact. Real classrooms."
 *   30–66   Stat 1 "10+" counts up + enters (sky blue)
 *   60–96   Stat 2 "50+" counts up + enters (mint) — 30f stagger
 *   90–132  Stat 3 "98%" counts up + enters (coral) — 30f stagger
 *   36      sfx-data-ping (stat 1 lands)
 *   66      sfx-data-ping (stat 2 lands)
 *   108     sfx-data-ping (stat 3 lands)
 *   80–300  World map dots appear in continental waves
 */
import React from 'react'
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion'
import { loadFont } from '@remotion/google-fonts/Sora'
import { theme } from '../theme'
import { BeatTransition } from '../components/BeatTransition'

const { fontFamily: soraFont } = loadFont('normal', {
  weights: ['400', '700'],
  subsets: ['latin'],
})

export const BEAT07_DURATION = 300

const ENTER = { damping: 200, stiffness: 100, mass: 1 } as const

const STATS = [
  { label: '10+', subtitle: 'hours saved weekly',  color: theme.colors.skyBlue,  startFrame: 30, x: 480 },
  { label: '50+', subtitle: 'schools onboarded',   color: theme.colors.mint,      startFrame: 60, x: 960 },
  { label: '98%', subtitle: 'teacher satisfaction', color: theme.colors.coral,    startFrame: 90, x: 1440 },
]

// Glowing dots on the world map, grouped by continental wave
// (x, y) are in the SVG map's coordinate system (viewBox="0 0 1600 340")
const MAP_DOTS = [
  // North America — sky blue — wave 0 (frame 80)
  { x: 210, y: 100, color: theme.colors.skyBlue,  wave: 80 },
  { x: 260, y: 140, color: theme.colors.skyBlue,  wave: 90 },
  { x: 180, y: 150, color: theme.colors.skyBlue,  wave: 100 },
  // South America — mint — wave 1
  { x: 290, y: 240, color: theme.colors.mint,      wave: 115 },
  { x: 310, y: 280, color: theme.colors.mint,      wave: 125 },
  // Europe — lavender — wave 2
  { x: 690, y: 80,  color: theme.colors.lavender,  wave: 130 },
  { x: 720, y: 100, color: theme.colors.lavender,  wave: 138 },
  { x: 700, y: 120, color: theme.colors.lavender,  wave: 146 },
  // Africa — coral — wave 3
  { x: 710, y: 170, color: theme.colors.coral,     wave: 150 },
  { x: 730, y: 210, color: theme.colors.coral,     wave: 160 },
  // Middle East — lavender
  { x: 810, y: 150, color: theme.colors.lavender,  wave: 155 },
  // Asia — sky blue — wave 4
  { x: 950, y: 90,  color: theme.colors.skyBlue,   wave: 165 },
  { x: 1050, y: 110, color: theme.colors.skyBlue,  wave: 173 },
  { x: 1100, y: 80,  color: theme.colors.skyBlue,  wave: 181 },
  { x: 980, y: 145,  color: theme.colors.skyBlue,  wave: 189 },
  // South/Southeast Asia
  { x: 1020, y: 170, color: theme.colors.mint,     wave: 200 },
  { x: 1070, y: 180, color: theme.colors.mint,     wave: 208 },
  // Australia — mint — wave 5
  { x: 1170, y: 250, color: theme.colors.mint,     wave: 215 },
  { x: 1210, y: 270, color: theme.colors.mint,     wave: 223 },
]

export const Beat07_TheProof: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Camera push-in
  const cameraScale = interpolate(frame, [0, BEAT07_DURATION], [1.0, 1.02], {
    extrapolateRight: 'clamp',
  })

  // Caption
  const captionOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(145deg, #FFF8F0 0%, #FAFBFE 100%)',
        overflow: 'hidden',
      }}
    >
      <GrainLayer id="b07grain" />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${cameraScale})`,
          transformOrigin: '50% 40%',
        }}
      >
        {/* ── Caption ─────────────────────────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            top: 64,
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: captionOpacity,
          }}
        >
          <span
            style={{
              fontFamily: theme.fonts.body,
              fontSize: 18,
              color: theme.colors.muted,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            Real impact. Real classrooms.
          </span>
        </div>

        {/* ── Three massive stats ──────────────────────────────────────── */}
        {STATS.map((stat, i) => {
          const elapsed = Math.max(0, frame - stat.startFrame)
          const s = spring({ frame: elapsed, fps, config: ENTER, durationInFrames: 36 })
          const statOpacity = interpolate(frame, [stat.startFrame, stat.startFrame + 18], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
          const statY = interpolate(s, [0, 1], [30, 0])

          // Count-up animation — 0 → number over 36 frames
          const numericPart = parseInt(stat.label)
          const suffix = stat.label.replace(String(numericPart), '')
          const displayNum = Math.round(interpolate(elapsed, [0, 36], [0, numericPart], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }))

          // Soft glow halo size breathes gently
          const glowSize = 200 + 20 * Math.sin(frame * 0.05)

          // Center stat is slightly larger (dominance)
          const fontSize = i === 1 ? 260 : 220

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: stat.x,
                top: 220,
                transform: `translate(-50%, 0) translateY(${statY}px)`,
                opacity: statOpacity,
                textAlign: 'center',
              }}
            >
              {/* Glow halo */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: glowSize,
                  height: glowSize * 0.6,
                  transform: 'translate(-50%, -50%)',
                  background: `radial-gradient(ellipse, ${stat.color}22 0%, transparent 70%)`,
                  pointerEvents: 'none',
                  filter: 'blur(30px)',
                }}
              />

              {/* Stat number */}
              <div
                style={{
                  fontFamily: soraFont,
                  fontSize,
                  fontWeight: 700,
                  color: stat.color,
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  position: 'relative',
                }}
              >
                {displayNum}{suffix}
              </div>

              {/* Stat subtitle */}
              <div
                style={{
                  fontFamily: theme.fonts.body,
                  fontSize: 18,
                  color: theme.colors.muted,
                  marginTop: 10,
                  letterSpacing: '0.01em',
                }}
              >
                {stat.subtitle}
              </div>
            </div>
          )
        })}

        {/* ── World map ────────────────────────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 160,
            right: 160,
            height: 340,
            opacity: 0.82,
          }}
        >
          <svg
            viewBox="0 0 1600 340"
            style={{ width: '100%', height: '100%', overflow: 'visible' }}
          >
            {/* Simplified continental outlines — cool grey */}
            <g fill="#D8DDE8" stroke="none">
              {/* North America */}
              <path d="M 120,20 L 380,15 L 420,60 L 400,110 L 350,160 L 290,175 L 240,165 L 190,130 L 140,90 L 120,50 Z" />
              {/* Central America / Caribbean */}
              <path d="M 290,175 L 320,190 L 305,210 L 285,195 Z" />
              {/* South America */}
              <path d="M 260,220 L 340,215 L 370,250 L 365,300 L 330,335 L 280,325 L 250,285 L 240,255 Z" />
              {/* Europe */}
              <path d="M 650,18 L 760,12 L 790,45 L 770,80 L 740,95 L 700,90 L 660,65 L 645,40 Z" />
              {/* Iceland + UK */}
              <path d="M 590,25 L 615,20 L 620,38 L 598,42 Z" />
              <path d="M 640,45 L 660,40 L 664,58 L 645,60 Z" />
              {/* Africa */}
              <path d="M 650,105 L 780,100 L 810,140 L 800,210 L 770,270 L 720,295 L 670,280 L 640,225 L 630,160 L 640,120 Z" />
              {/* Middle East */}
              <path d="M 790,100 L 850,95 L 880,125 L 855,150 L 810,145 L 790,120 Z" />
              {/* Central Asia */}
              <path d="M 850,60 L 1000,50 L 1040,90 L 1010,130 L 940,140 L 880,120 L 860,90 Z" />
              {/* South/SE Asia */}
              <path d="M 990,130 L 1080,120 L 1110,150 L 1095,185 L 1040,195 L 1000,170 L 980,150 Z" />
              {/* China/East Asia */}
              <path d="M 1000,55 L 1160,40 L 1190,80 L 1170,130 L 1090,140 L 1020,120 L 1000,80 Z" />
              {/* Japan / Korea */}
              <path d="M 1175,65 L 1200,58 L 1205,82 L 1182,90 Z" />
              <path d="M 1160,80 L 1175,75 L 1180,95 L 1165,100 Z" />
              {/* Southeast Asia islands */}
              <path d="M 1060,190 L 1120,185 L 1130,210 L 1090,215 Z" />
              <path d="M 1110,215 L 1145,210 L 1148,228 L 1115,232 Z" />
              {/* Australia */}
              <path d="M 1140,220 L 1290,210 L 1320,245 L 1310,295 L 1260,315 L 1190,305 L 1155,270 L 1140,245 Z" />
              {/* New Zealand */}
              <path d="M 1320,290 L 1338,280 L 1345,300 L 1330,312 Z" />
              {/* Russia / Siberia */}
              <path d="M 780,12 L 1160,8 L 1180,38 L 1160,55 L 1000,60 L 860,68 L 780,50 Z" />
            </g>

            {/* Glowing dots */}
            {MAP_DOTS.map((dot, i) => {
              const dotOpacity = interpolate(frame, [dot.wave, dot.wave + 12], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })
              // Subtle pulsing
              const pulse = 1 + 0.25 * Math.sin(frame * 0.08 + i * 0.7)
              return (
                <g key={i} opacity={dotOpacity}>
                  {/* Glow halo */}
                  <circle cx={dot.x} cy={dot.y} r={10 * pulse} fill={dot.color} opacity={0.15} />
                  <circle cx={dot.x} cy={dot.y} r={5} fill={dot.color} opacity={0.85} />
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      <BeatTransition beatDuration={BEAT07_DURATION} openingFade closingFade />
    </AbsoluteFill>
  )
}

const GrainLayer: React.FC<{ id: string }> = ({ id }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04, pointerEvents: 'none', zIndex: 0 }}>
    <defs>
      <filter id={id} x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" seed="29" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
    </defs>
    <rect width="1920" height="1080" filter={`url(#${id})`} />
  </svg>
)
