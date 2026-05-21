/**
 * Beat 06 — The People (300 frames / 10 s)
 * Global: 1677–1977
 * Type: C — Product Hero with real PNG photographs
 *
 * Visual intent: "I want this for my school." (emotional anchor)
 * Real faces after two beats of product UI. The human moment.
 *
 * 4 cards laid down like polaroid photos — each holds a real photo.
 * Card 4 (Schools) crossfades from dim→sunlight: the visual metaphor.
 *
 * Local frame map:
 *   0–75    Cards lay down sequentially (25f stagger each)
 *   75–200  Micro-animations continue; all 4 cards held
 *   150–250 Personalization HUD overlay appears at centre
 *   250–300 HUD fades out, cards hold to beat end
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

export const BEAT06_DURATION = 300

const CARD_SPRING = { damping: 120, stiffness: 120, mass: 1 } as const
const HUD_SPRING  = { damping: 200, stiffness: 100, mass: 1 } as const

// ── Card layout ───────────────────────────────────────────────────────────────
const CARD_W   = 420
const CARD_H   = 390
const GUTTER   = 40
const GRID_W   = CARD_W * 2 + GUTTER
const GRID_H   = CARD_H * 2 + GUTTER
const GRID_L   = (1920 - GRID_W) / 2  // 270
const GRID_T   = (1080 - GRID_H) / 2  // 95

// Small random rotations give the polaroid-on-table feel
const ROTS = [-5.5, 6, 7, -5]

const CARDS = [
  {
    index: 0, row: 0, col: 0,
    img: IMG.teacherSunlight,
    label: 'Teachers',
    benefit: 'Hours saved every week',
    accent: theme.colors.mint,
    bg: theme.colors.mintPastel,
    startFrame: 0,
  },
  {
    index: 1, row: 0, col: 1,
    img: IMG.boyWithTablet,
    label: 'Students',
    benefit: 'Engaged and curious',
    accent: theme.colors.skyBlue,
    bg: theme.colors.skyPastel,
    startFrame: 25,
  },
  {
    index: 2, row: 1, col: 0,
    img: IMG.teacherAndStudent,
    label: 'Parents',
    benefit: 'Always in the loop',
    accent: theme.colors.coral,
    bg: theme.colors.coralPastel,
    startFrame: 50,
  },
  {
    index: 3, row: 1, col: 1,
    img: null,  // handled separately — crossfade
    label: 'Schools',
    benefit: 'In full control',
    accent: theme.colors.lavender,
    bg: theme.colors.lavenderPastel,
    startFrame: 75,
  },
]

export const Beat06_ThePeople: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // ── Personalization HUD (frames 150–250) ──────────────────────────────────
  const hudS = spring({
    frame: Math.max(0, frame - 150),
    fps,
    config: HUD_SPRING,
    durationInFrames: 30,
  })
  const hudOpacity = interpolate(frame, [150, 170, 240, 255], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const hudScale = interpolate(hudS, [0, 1], [0.88, 1.0])

  // Schools card crossfade (dim → sunlight, frames 90–150)
  const schoolsCrossfade = interpolate(frame, [90, 150], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ background: theme.colors.bg, overflow: 'hidden' }}>
      <GrainLayer id="b06grain" />

      {/* ── Photo cards ─────────────────────────────────────────────────── */}
      {CARDS.map((card) => {
        const elapsed = Math.max(0, frame - card.startFrame)
        const s = spring({ frame: elapsed, fps, config: CARD_SPRING, durationInFrames: 35 })
        const cardOpacity = interpolate(frame, [card.startFrame, card.startFrame + 20], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
        const cardScale = interpolate(s, [0, 1], [1.08, 1.0])
        const rot = interpolate(s, [0, 1], [ROTS[card.index], 0])

        const x = GRID_L + card.col * (CARD_W + GUTTER)
        const y = GRID_T + card.row * (CARD_H + GUTTER)

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
              transform: `scale(${cardScale}) rotate(${rot}deg)`,
              transformOrigin: 'center center',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                background: card.bg,
                borderRadius: 20,
                boxShadow: theme.shadows.lifted,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Photo area — top 68% */}
              <div style={{ height: '68%', position: 'relative', overflow: 'hidden' }}>
                {card.index < 3 ? (
                  <Img
                    src={card.img!}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center top',
                      display: 'block',
                    }}
                  />
                ) : (
                  /* Card 4: crossfade dim → sunlight */
                  <>
                    <Img
                      src={IMG.teacherDimRoom}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center top',
                        display: 'block',
                        opacity: 1 - schoolsCrossfade,
                      }}
                    />
                    <Img
                      src={IMG.teacherSunlight}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center top',
                        display: 'block',
                        opacity: schoolsCrossfade,
                      }}
                    />
                  </>
                )}
                {/* Subtle gradient at bottom of photo */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 50,
                    background: `linear-gradient(to top, ${card.bg}, transparent)`,
                    pointerEvents: 'none',
                  }}
                />
              </div>

              {/* Info area — bottom 32% */}
              <div
                style={{
                  padding: '12px 18px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                {/* Label pill */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: `${card.accent}20`,
                    border: `1.5px solid ${card.accent}40`,
                    borderRadius: 999,
                    padding: '4px 12px',
                    alignSelf: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: card.accent,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: soraFont,
                      fontSize: 14,
                      fontWeight: 700,
                      color: card.accent,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {card.label}
                  </span>
                </div>

                {/* Benefit line */}
                <span
                  style={{
                    fontFamily: theme.fonts.body,
                    fontSize: 13,
                    color: theme.colors.muted,
                    lineHeight: 1.3,
                  }}
                >
                  {card.benefit}
                </span>
              </div>
            </div>
          </div>
        )
      })}

      {/* ── Personalization HUD overlay (150–250) ───────────────────────── */}
      <PersonalizationHUD
        opacity={hudOpacity}
        scale={hudScale}
        frame={frame}
      />

      <BeatTransition beatDuration={BEAT06_DURATION} openingFade closingFade />
    </AbsoluteFill>
  )
}

// ── Personalization HUD ───────────────────────────────────────────────────────

const SAT_NODES = [
  { label: 'Region',      color: theme.colors.skyBlue,   angle: -Math.PI * 0.25 },
  { label: 'Background',  color: theme.colors.mint,       angle:  Math.PI * 0.25 },
  { label: 'Preferences', color: theme.colors.coral,      angle:  Math.PI * 0.75 },
  { label: 'Institution', color: theme.colors.lavender,   angle: -Math.PI * 0.75 },
]

const PersonalizationHUD: React.FC<{ opacity: number; scale: number; frame: number }> = ({
  opacity,
  scale,
  frame,
}) => {
  const CX = 960   // centre of 1920-wide frame
  const CY = 540   // centre of 1080-tall frame
  const R  = 130   // orbit radius

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        {/* HUD background panel */}
        <rect
          x={CX - 200}
          y={CY - 200}
          width={400}
          height={400}
          rx={28}
          fill="rgba(255,255,255,0.92)"
          style={{ filter: 'drop-shadow(0 8px 32px rgba(26,41,66,0.16))' }}
        />

        {/* Connection lines to satellites */}
        {SAT_NODES.map((node, i) => {
          const elapsed = Math.max(0, frame - 150 - i * 10)
          const lineProgress = Math.min(1, elapsed / 20)
          const sx = CX
          const sy = CY
          const ex = CX + Math.cos(node.angle) * R * lineProgress
          const ey = CY + Math.sin(node.angle) * R * lineProgress
          return (
            <line
              key={i}
              x1={sx} y1={sy}
              x2={ex} y2={ey}
              stroke={node.color}
              strokeWidth="1.5"
              opacity={0.5}
              strokeDasharray="4 3"
            />
          )
        })}

        {/* Central profile circle */}
        <circle cx={CX} cy={CY} r={34} fill={`${theme.colors.charcoal}12`} stroke={theme.colors.charcoal} strokeWidth="2" />
        <circle cx={CX} cy={CY - 10} r={10} fill={theme.colors.charcoal} opacity={0.6} />
        <path d={`M ${CX - 16} ${CY + 20} Q ${CX - 16} ${CY + 4} ${CX} ${CY + 4} Q ${CX + 16} ${CY + 4} ${CX + 16} ${CY + 20}`}
          fill={theme.colors.charcoal} opacity={0.5} />

        {/* Satellite nodes */}
        {SAT_NODES.map((node, i) => {
          const elapsed = Math.max(0, frame - 150 - i * 10)
          const nodeProgress = Math.min(1, elapsed / 15)
          const nx = CX + Math.cos(node.angle) * R
          const ny = CY + Math.sin(node.angle) * R
          return (
            <g key={i} opacity={nodeProgress}>
              {/* Satellite ring */}
              <circle cx={nx} cy={ny} r={26} fill={`${node.color}18`} stroke={node.color} strokeWidth="1.5" />
              <circle cx={nx} cy={ny} r={10} fill={node.color} opacity={0.7} />
              {/* Label */}
              <text
                x={nx}
                y={ny + 42}
                textAnchor="middle"
                fontFamily={theme.fonts.body}
                fontSize="11"
                fill={theme.colors.muted}
                fontWeight="600"
              >
                {node.label}
              </text>
            </g>
          )
        })}

        {/* HUD title */}
        <text
          x={CX}
          y={CY - 148}
          textAnchor="middle"
          fontFamily={soraFont}
          fontSize="13"
          fill={theme.colors.muted}
          fontWeight="600"
          letterSpacing="0.04em"
        >
          PERSONALIZATION
        </text>
      </svg>
    </div>
  )
}

const GrainLayer: React.FC<{ id: string }> = ({ id }) => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04, pointerEvents: 'none', zIndex: 0 }}>
    <defs>
      <filter id={id} x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" seed="23" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
    </defs>
    <rect width="1920" height="1080" filter={`url(#${id})`} />
  </svg>
)
