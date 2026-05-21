/**
 * Beat 05 — Not Just One Thing (300 frames / 10 s)
 * Global: 1377–1677
 * Type: C — Product Hero (2×2 feature grid)
 *
 * Visual intent: "I want this for my school."
 * Four elevated cards, each revealing a core product capability.
 * Cards tilt in (3D-style) with stagger, then glow on VO cue.
 *
 * Local frame map:
 *   0–54    Cards entrance — staggered 18f apart, subtle tilt-in
 *   ~10     Worksheets card glows (VO: "Worksheets that adapt")
 *   ~80     YouTube card glows (VO: "Quizzes from any YouTube video")
 *   ~150    Image Studio card glows (VO: "Visuals on demand")
 *   ~210    AI Assistants card glows (VO: "AI tutors built for the classroom")
 *   0–300   Micro-animations run continuously inside each card
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

export const BEAT05_DURATION = 300

const ENTER = { damping: 200, stiffness: 100, mass: 1 } as const

// ── Card layout constants ────────────────────────────────────────────────────
const CARD_W = 740
const CARD_H = 310
const GUTTER = 40
const GRID_W = CARD_W * 2 + GUTTER   // 1520
const GRID_H = CARD_H * 2 + GUTTER   // 660
const GRID_LEFT = (1920 - GRID_W) / 2 // 200
const GRID_TOP = (1080 - GRID_H) / 2  // 210

const CARDS = [
  {
    index: 0,
    title: 'Worksheets',
    subtitle: 'Adapts to every learner',
    accent: theme.colors.mint,
    glowFrame: 10,
    row: 0,
    col: 0,
  },
  {
    index: 1,
    title: 'YouTube Quizzes',
    subtitle: 'Any video, instant assessment',
    accent: theme.colors.coral,
    glowFrame: 80,
    row: 0,
    col: 1,
  },
  {
    index: 2,
    title: 'Image Studio',
    subtitle: 'Visuals on demand',
    accent: theme.colors.lavender,
    glowFrame: 150,
    row: 1,
    col: 0,
  },
  {
    index: 3,
    title: 'AI Assistants',
    subtitle: 'Built for the classroom',
    accent: theme.colors.skyBlue,
    glowFrame: 210,
    row: 1,
    col: 1,
  },
]

export const Beat05_NotJustOneThing: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Subtle camera push-in
  const cameraScale = interpolate(frame, [0, BEAT05_DURATION], [1.0, 1.015], {
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ background: theme.colors.bg, overflow: 'hidden' }}>
      <GrainLayer id="b05grain" />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${cameraScale})`,
          transformOrigin: '50% 50%',
        }}
      >
        {CARDS.map((card) => {
          const startFrame = card.index * 18
          const s = spring({
            frame: Math.max(0, frame - startFrame),
            fps,
            config: ENTER,
            durationInFrames: 35,
          })
          const cardOpacity = interpolate(frame, [startFrame, startFrame + 18], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
          const cardScaleX = interpolate(s, [0, 1], [0.72, 1.0])
          const cardScaleY = interpolate(s, [0, 1], [0.96, 1.0])

          // Glow pulse: brightens accent on VO cue for 45 frames
          const glowProgress = interpolate(
            frame,
            [card.glowFrame, card.glowFrame + 15, card.glowFrame + 45],
            [0, 1, 0],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          )
          const extraShadow = glowProgress * 24   // extra lift px
          const extraGlow = glowProgress * 0.35   // extra glow opacity

          const x = GRID_LEFT + card.col * (CARD_W + GUTTER)
          const y = GRID_TOP + card.row * (CARD_H + GUTTER)

          return (
            <div
              key={card.index}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                width: CARD_W,
                height: CARD_H,
                opacity: cardOpacity,
                transform: `scaleX(${cardScaleX}) scaleY(${cardScaleY})`,
                transformOrigin: 'center center',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: theme.colors.surface,
                  borderRadius: 20,
                  boxShadow: `
                    0 ${8 + extraShadow}px ${40 + extraShadow * 2}px rgba(26,41,66,${0.10 + extraGlow}),
                    0 2px 8px rgba(26,41,66,0.06)
                  `,
                  position: 'relative',
                  overflow: 'hidden',
                  padding: '28px 30px',
                  boxSizing: 'border-box',
                }}
              >
                {/* Accent top border */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: card.accent,
                    borderRadius: '20px 20px 0 0',
                    opacity: 0.9 + glowProgress * 0.1,
                  }}
                />

                {/* Card header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: `${card.accent}18`,
                      border: `1.5px solid ${card.accent}35`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <CardIcon type={card.index} color={card.accent} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: soraFont,
                        fontSize: 22,
                        fontWeight: 700,
                        color: theme.colors.charcoal,
                        letterSpacing: '-0.02em',
                        lineHeight: 1,
                      }}
                    >
                      {card.title}
                    </div>
                    <div
                      style={{
                        fontFamily: theme.fonts.body,
                        fontSize: 13,
                        color: theme.colors.muted,
                        marginTop: 4,
                      }}
                    >
                      {card.subtitle}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: '#EEF0F6', marginBottom: 16 }} />

                {/* Micro-viz area */}
                <div style={{ height: 140, position: 'relative', overflow: 'hidden' }}>
                  <MicroViz type={card.index} color={card.accent} frame={frame} fps={fps} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <BeatTransition beatDuration={BEAT05_DURATION} openingFade closingFade />
    </AbsoluteFill>
  )
}

// ── Card icons ────────────────────────────────────────────────────────────────

const CardIcon: React.FC<{ type: number; color: string }> = ({ type, color }) => {
  const props = { width: 22, height: 22, stroke: color, strokeWidth: 1.8, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  if (type === 0) return (
    <svg viewBox="0 0 24 24" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <line x1="7" y1="8" x2="17" y2="8" />
      <line x1="7" y1="12" x2="14" y2="12" />
      <line x1="7" y1="16" x2="12" y2="16" />
    </svg>
  )
  if (type === 1) return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill={color} stroke="none" />
    </svg>
  )
  if (type === 2) return (
    <svg viewBox="0 0 24 24" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  )
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

// ── Micro-vizs ────────────────────────────────────────────────────────────────

const MicroViz: React.FC<{ type: number; color: string; frame: number; fps: number }> = ({ type, color, frame }) => {
  if (type === 0) return <WorksheetViz color={color} frame={frame} />
  if (type === 1) return <YouTubeViz color={color} frame={frame} />
  if (type === 2) return <ImageStudioViz color={color} frame={frame} />
  return <AIAssistantViz color={color} frame={frame} />
}

// Card 1 — Worksheets: 3 difficulty bars
const WorksheetViz: React.FC<{ color: string; frame: number }> = ({ color, frame }) => {
  const bars = [
    { label: 'Easy',   fill: 0.90, y: 20 },
    { label: 'Medium', fill: 0.62, y: 60 },
    { label: 'Hard',   fill: 0.35, y: 100 },
  ]
  // Subtle breathe animation on fill widths
  const breathe = 1 + 0.03 * Math.sin(frame * (2 * Math.PI / 90))

  return (
    <div style={{ padding: '8px 0' }}>
      {bars.map((bar) => {
        const w = Math.min(100, bar.fill * 100 * breathe)
        return (
          <div key={bar.label} style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: theme.fonts.body, fontSize: 12, color: theme.colors.muted }}>
                {bar.label}
              </span>
              <span style={{ fontFamily: theme.fonts.body, fontSize: 12, color, fontWeight: 600 }}>
                {Math.round(bar.fill * 100)}%
              </span>
            </div>
            <div style={{ height: 8, background: '#F0F2F8', borderRadius: 4, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${w}%`,
                  height: '100%',
                  background: color,
                  borderRadius: 4,
                  opacity: 0.85,
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Card 2 — YouTube: play button + 3 orbiting content orbs
const YouTubeViz: React.FC<{ color: string; frame: number }> = ({ color, frame }) => {
  const orbs = [
    { angle: 0,         size: 18, speed: 0.018, distance: 48, opacity: 0.9 },
    { angle: 2.1,       size: 14, speed: 0.015, distance: 54, opacity: 0.7 },
    { angle: 4.2,       size: 12, speed: 0.020, distance: 42, opacity: 0.6 },
  ]
  const cx = 120
  const cy = 70

  return (
    <svg width="680" height="140" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
      {/* Play button circle */}
      <circle cx={cx} cy={cy} r={30} fill={`${color}15`} stroke={color} strokeWidth="1.5" />
      <polygon
        points={`${cx - 8},${cy - 12} ${cx + 16},${cy} ${cx - 8},${cy + 12}`}
        fill={color}
        opacity={0.8}
      />

      {/* Orbiting content orbs */}
      {orbs.map((orb, i) => {
        const angle = orb.angle + frame * orb.speed
        const x = cx + Math.cos(angle) * orb.distance
        const y = cy + Math.sin(angle) * orb.distance
        const orbColors = [theme.colors.skyBlue, theme.colors.mint, theme.colors.lavender]
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={orb.distance} fill="none" stroke={`${color}15`} strokeWidth="1" strokeDasharray="4 4" />
            <circle cx={x} cy={y} r={orb.size / 2} fill={orbColors[i]} opacity={orb.opacity} />
          </g>
        )
      })}

      {/* Labels */}
      <text x={cx + 70} y={cy - 20} fontFamily={theme.fonts.body} fontSize="13" fill={theme.colors.muted}>
        Any video
      </text>
      <text x={cx + 70} y={cy} fontFamily={theme.fonts.body} fontSize="13" fill={theme.colors.charcoal} fontWeight="600">
        → instant quiz
      </text>
      <text x={cx + 70} y={cy + 22} fontFamily={theme.fonts.body} fontSize="12" fill={theme.colors.muted}>
        No prep needed
      </text>
    </svg>
  )
}

// Card 3 — Image Studio: floating subject thumbnails
const ImageStudioViz: React.FC<{ color: string; frame: number }> = ({ color, frame }) => {
  const thumbs = [
    { label: 'Science', offset: 0,   w: 110, h: 70, bg: `${theme.colors.skyBlue}20`,   border: theme.colors.skyBlue },
    { label: 'History', offset: 40,  w: 100, h: 66, bg: `${theme.colors.mint}20`,      border: theme.colors.mint },
    { label: 'Math',    offset: 80,  w: 105, h: 68, bg: `${theme.colors.lavender}20`,  border: theme.colors.lavender },
  ]

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      {thumbs.map((t, i) => {
        // Each thumbnail bobs with a slight vertical offset
        const bobY = 4 * Math.sin(frame * 0.04 + t.offset * 0.05)
        const opacity = 0.7 + 0.3 * Math.sin(frame * 0.03 + i * 2)
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 20 + i * 190,
              top: 20 + bobY,
              width: t.w,
              height: t.h,
              background: t.bg,
              border: `1.5px solid ${t.border}40`,
              borderRadius: 12,
              opacity,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            {/* Mini abstract icon */}
            <div style={{ width: 28, height: 28, borderRadius: 8, background: `${t.border}30`, border: `1px solid ${t.border}50` }} />
            <span style={{ fontFamily: theme.fonts.body, fontSize: 11, color: theme.colors.muted, fontWeight: 600 }}>
              {t.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// Card 4 — AI Assistants: 2 bot avatars + typing bubble
const AIAssistantViz: React.FC<{ color: string; frame: number }> = ({ color, frame }) => {
  // Typing dots: 3 dots sequentially pulse
  const dot1 = 0.3 + 0.7 * Math.max(0, Math.sin(frame * 0.15))
  const dot2 = 0.3 + 0.7 * Math.max(0, Math.sin(frame * 0.15 - 0.8))
  const dot3 = 0.3 + 0.7 * Math.max(0, Math.sin(frame * 0.15 - 1.6))

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, paddingTop: 8 }}>
      {/* Bot avatars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {[theme.colors.skyBlue, theme.colors.mint].map((c, i) => (
          <div
            key={i}
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: `${c}20`,
              border: `2px solid ${c}50`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8">
              <rect x="3" y="6" width="18" height="14" rx="4" />
              <path d="M8 6V4a4 4 0 0 1 8 0v2" />
              <circle cx="9" cy="13" r="1.5" fill={c} />
              <circle cx="15" cy="13" r="1.5" fill={c} />
            </svg>
          </div>
        ))}
      </div>

      {/* Chat bubble with typing animation */}
      <div style={{ flex: 1, paddingTop: 4 }}>
        <div
          style={{
            background: `${color}12`,
            border: `1.5px solid ${color}30`,
            borderRadius: '16px 16px 16px 4px',
            padding: '10px 16px',
            marginBottom: 12,
            display: 'inline-block',
          }}
        >
          <span style={{ fontFamily: theme.fonts.body, fontSize: 12, color: theme.colors.charcoal }}>
            What strategies help restless students?
          </span>
        </div>

        {/* Typing indicator */}
        <div
          style={{
            background: '#F0F2F8',
            borderRadius: '4px 16px 16px 16px',
            padding: '10px 16px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          {[dot1, dot2, dot3].map((d, i) => (
            <div
              key={i}
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: color,
                opacity: d,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const GrainLayer: React.FC<{ id: string }> = ({ id }) => (
  <svg
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04, pointerEvents: 'none', zIndex: 0 }}
  >
    <defs>
      <filter id={id} x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" seed="21" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
    </defs>
    <rect width="1920" height="1080" filter={`url(#${id})`} />
  </svg>
)
