// Scene 13 — YouTube Regional Algorithm (frames 3024–3276)
// "Our algorithm recommends what's right for your region —
//  and lets teachers explore across cultures with one tap."
import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from 'remotion'
import { GlassCard } from '../components/GlassCard'
import { theme } from '../theme'

// Approximate region points (x,y as 0-1 fractions of 1920×1080)
const REGIONS = [
  { name: 'North America', x: 0.18, y: 0.32, color: theme.colors.skyBlue },
  { name: 'Europe',        x: 0.48, y: 0.24, color: theme.colors.teal   },
  { name: 'Middle East',   x: 0.55, y: 0.38, color: '#FFB347'           },
  { name: 'South Asia',    x: 0.66, y: 0.40, color: '#B47FFF'           },
  { name: 'East Asia',     x: 0.75, y: 0.30, color: theme.colors.skyBlue },
  { name: 'Africa',        x: 0.50, y: 0.52, color: theme.colors.teal   },
  { name: 'Latam',         x: 0.25, y: 0.58, color: '#FF6B6B'           },
  { name: 'Oceania',       x: 0.78, y: 0.60, color: '#4ECB71'           },
]

export const Scene13YouTubeRegional: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const sceneOpacity = interpolate(frame, [0, 18, 234, 252], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Toggle panel slide-in
  const panelSpring = spring({ frame: frame - 80, fps, config: theme.spring.snappy })
  const panelX = interpolate(panelSpring, [0, 1], [-280, 0])
  const panelOpacity = interpolate(frame, [80, 105], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Label
  const labelOpacity = interpolate(frame, [50, 75], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{
      opacity: sceneOpacity,
      background: `linear-gradient(150deg, ${theme.colors.navyDeep} 0%, ${theme.colors.navy} 100%)`,
      overflow: 'hidden',
    }}>
      {/* Simplified world map SVG */}
      <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0 }}>
        {/* Simplified world outline paths */}
        <g opacity="0.15" fill="none" stroke={theme.colors.skyBlue} strokeWidth="1">
          {/* Americas */}
          <path d="M 180 200 L 250 180 L 310 220 L 340 300 L 320 380 L 290 420 L 260 480 L 240 560 L 200 580 L 180 540 L 160 480 L 150 400 L 160 320 Z" />
          {/* Europe */}
          <path d="M 860 140 L 920 130 L 980 150 L 1020 180 L 1000 220 L 960 240 L 900 230 L 860 200 Z" />
          {/* Africa */}
          <path d="M 900 340 L 960 320 L 1020 340 L 1040 400 L 1030 480 L 1000 560 L 960 600 L 920 560 L 890 480 L 880 400 Z" />
          {/* Asia */}
          <path d="M 1060 160 L 1200 140 L 1380 160 L 1460 200 L 1440 280 L 1380 320 L 1300 340 L 1200 320 L 1100 300 L 1060 240 Z" />
          {/* Oceania */}
          <path d="M 1440 500 L 1520 480 L 1560 520 L 1540 560 L 1480 580 L 1440 550 Z" />
        </g>

        {/* Connection lines between nearby regions */}
        {REGIONS.map((from, fi) =>
          REGIONS.slice(fi + 1, fi + 3).map((to, ti) => {
            const progress = interpolate(frame, [60 + fi * 8 + ti * 4, 90 + fi * 8 + ti * 4], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
            const x1 = from.x * 1920
            const y1 = from.y * 1080
            const x2 = to.x * 1920
            const y2 = to.y * 1080
            const mx = (x1 + x2) / 2
            const my = Math.min(y1, y2) - 60
            return (
              <path
                key={`${fi}-${ti}`}
                d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
                stroke={from.color}
                strokeWidth="1"
                strokeOpacity={0.35 * progress}
                fill="none"
                strokeDasharray={`${progress * 200} 1000`}
              />
            )
          })
        )}

        {/* Region dots with glow */}
        {REGIONS.map((region, i) => {
          const dotProgress = interpolate(frame, [15 + i * 10, 35 + i * 10], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
          const x = region.x * 1920
          const y = region.y * 1080
          const pulse = Math.sin(frame * 0.07 + i * 0.9) * 0.3 + 0.9

          return (
            <g key={i} opacity={dotProgress}>
              <circle cx={x} cy={y} r={18 * pulse} fill={region.color} opacity={0.12} />
              <circle cx={x} cy={y} r={8} fill={region.color} opacity={0.9} />
              <circle cx={x - 2} cy={y - 2} r={2} fill="white" opacity={0.5} />
              <text x={x + 14} y={y + 5}
                fill={region.color}
                fontSize={12}
                fontFamily={theme.fonts.body}
                fontWeight={600}
                opacity={0.8}
              >
                {region.name}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Filter panel */}
      <div style={{
        position: 'absolute',
        top: '50%',
        right: 80,
        transform: `translateY(-50%) translateX(${panelX > 0 ? panelX : 0}px)`,
        opacity: panelOpacity,
      }}>
        <GlassCard width={320} height={300} glowColor={theme.colors.skyBlue} glowIntensity={0.5} borderRadius={18}>
          <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 0 }}>
            <div style={{ fontFamily: theme.fonts.headline, fontSize: 16, fontWeight: 700, color: theme.colors.white, marginBottom: 20 }}>
              Content Filters
            </div>
            {['Show Regional Only', 'Cross-Cultural Mode', 'Safe for School', 'Curriculum Aligned'].map((toggle, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontFamily: theme.fonts.body, fontSize: 14, color: 'rgba(245,249,255,0.8)' }}>
                  {toggle}
                </span>
                <ToggleSwitch active={i !== 0} color={i === 1 ? theme.colors.teal : theme.colors.skyBlue} frame={frame} delay={i * 15} />
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Label */}
      <div style={{
        position: 'absolute',
        bottom: 80,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: labelOpacity,
        fontFamily: theme.fonts.headline,
        fontSize: 26,
        fontWeight: 600,
        color: theme.colors.white,
      }}>
        Right content. Right region.{' '}
        <span style={{ color: theme.colors.skyBlue }}>One tap to explore beyond.</span>
      </div>
    </AbsoluteFill>
  )
}

const ToggleSwitch: React.FC<{ active: boolean; color: string; frame: number; delay: number }> = ({ active, color, frame, delay }) => {
  const activeProg = interpolate(frame, [80 + delay, 100 + delay], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const knobX = active ? interpolate(activeProg, [0, 1], [3, 21]) : 3
  return (
    <div style={{
      width: 42, height: 24,
      borderRadius: 12,
      background: active ? `${color}40` : 'rgba(255,255,255,0.1)',
      border: `1.5px solid ${active ? color : 'rgba(255,255,255,0.2)'}`,
      position: 'relative',
      boxShadow: active ? `0 0 10px ${color}30` : 'none',
    }}>
      <div style={{
        position: 'absolute',
        width: 18, height: 18,
        borderRadius: '50%',
        background: active ? color : 'rgba(255,255,255,0.4)',
        top: 2,
        left: knobX,
      }} />
    </div>
  )
}
