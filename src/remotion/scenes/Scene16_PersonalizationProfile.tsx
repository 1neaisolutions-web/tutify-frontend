// Scene 16 — Profile Understanding (frames 3780–4032)
// "Every teacher, every student is different. Tutify understands
//  region, background, learning style, and institutional context — instantly."
import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from 'remotion'
import { GlassCard } from '../components/GlassCard'
import { ParticleField } from '../components/ParticleField'
import { theme } from '../theme'

const SATELLITES = [
  { label: 'Region',      icon: '🌍', color: theme.colors.skyBlue, angle: -90, delay: 40 },
  { label: 'Background',  icon: '📚', color: theme.colors.teal,    angle:   0, delay: 55 },
  { label: 'Preferences', icon: '💡', color: '#FFB347',            angle:  90, delay: 70 },
  { label: 'Institution', icon: '🏫', color: '#B47FFF',            angle: 180, delay: 85 },
]
const ORBIT_R = 310
const CX = 960, CY = 540

export const Scene16PersonalizationProfile: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const sceneOpacity = interpolate(frame, [0, 18, 234, 252], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Center card entrance
  const centerSpring = spring({ frame: frame - 10, fps, config: theme.spring.snappy })
  const centerScale = interpolate(centerSpring, [0, 1], [0.7, 1])
  const centerOpacity = interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // AI orb above center
  const aiOrbPulse = Math.sin(frame * 0.06) * 0.1 + 1

  // Label
  const labelOpacity = interpolate(frame, [100, 125], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{
      opacity: sceneOpacity,
      background: `linear-gradient(150deg, ${theme.colors.navyDeep} 0%, ${theme.colors.navy} 100%)`,
      overflow: 'hidden',
    }}>
      <ParticleField density={35} color={theme.colors.skyBlue} speed={0.3} />

      {/* Light streams from satellites to center */}
      <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0 }}>
        {SATELLITES.map((sat, i) => {
          const angle = (sat.angle * Math.PI) / 180
          const sx = CX + Math.cos(angle) * ORBIT_R
          const sy = CY + Math.sin(angle) * ORBIT_R
          const lineProgress = interpolate(frame, [sat.delay + 20, sat.delay + 50], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
          const pulsePos = ((frame * 0.025 + i * 0.25) % 1) * lineProgress
          return (
            <g key={i}>
              <line
                x1={sx} y1={sy} x2={CX} y2={CY}
                stroke={sat.color}
                strokeWidth={1.5}
                strokeOpacity={0.45 * lineProgress}
                strokeDasharray="4 6"
              />
              {lineProgress > 0.1 && (
                <circle
                  cx={sx + (CX - sx) * pulsePos}
                  cy={sy + (CY - sy) * pulsePos}
                  r={4}
                  fill={sat.color}
                  opacity={0.8 * lineProgress}
                />
              )}
              {/* Glow burst at center when line completes */}
              {lineProgress > 0.9 && (
                <circle cx={CX} cy={CY} r={15 * (Math.sin(frame * 0.12 + i) * 0.3 + 0.7)}
                  fill={sat.color}
                  opacity={0.08}
                />
              )}
            </g>
          )
        })}

        {/* AI orb streams above center */}
        <circle cx={CX} cy={CY - 180} r={40 * aiOrbPulse}
          fill={`url(#aiGlow)`} opacity={0.3}
        />
        <defs>
          <radialGradient id="aiGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={theme.colors.skyBlue} stopOpacity="1" />
            <stop offset="100%" stopColor={theme.colors.skyBlue} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={CX} cy={CY - 180} r={26 * aiOrbPulse}
          fill={theme.colors.skyBlue} opacity={0.9}
        />
        <text x={CX} y={CY - 175} textAnchor="middle" dominantBaseline="middle"
          fill="white" fontSize={10} fontFamily={theme.fonts.body} fontWeight={700}
        >
          AI
        </text>
        <line x1={CX} y1={CY - 152} x2={CX} y2={CY - 100}
          stroke={theme.colors.skyBlue} strokeWidth="1.5" strokeOpacity="0.4"
          strokeDasharray="3 5"
        />
      </svg>

      {/* Satellite cards */}
      {SATELLITES.map((sat, i) => {
        const angle = (sat.angle * Math.PI) / 180
        const sx = CX + Math.cos(angle) * ORBIT_R
        const sy = CY + Math.sin(angle) * ORBIT_R

        const satSpring = spring({ frame: frame - sat.delay, fps, config: theme.spring.bouncy })
        const satScale = interpolate(satSpring, [0, 1], [0, 1])
        const satOpacity = interpolate(frame, [sat.delay, sat.delay + 20], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })

        return (
          <div key={i} style={{
            position: 'absolute',
            left: sx - 75,
            top: sy - 55,
            opacity: satOpacity,
            transform: `scale(${satScale})`,
            transformOrigin: 'center center',
          }}>
            <GlassCard width={150} height={110} glowColor={sat.color} glowIntensity={0.5} borderRadius={16}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8 }}>
                <div style={{ fontSize: 28 }}>{sat.icon}</div>
                <div style={{ fontFamily: theme.fonts.headline, fontSize: 15, fontWeight: 700, color: sat.color }}>
                  {sat.label}
                </div>
              </div>
            </GlassCard>
          </div>
        )
      })}

      {/* Central profile card */}
      <div style={{
        position: 'absolute',
        left: CX - 140,
        top: CY - 90,
        opacity: centerOpacity,
        transform: `scale(${centerScale})`,
        transformOrigin: 'center center',
      }}>
        <GlassCard width={280} height={180} glowColor={theme.colors.skyBlue} glowIntensity={0.7} borderRadius={20}>
          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 48, height: 48,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.colors.skyBlue}40, ${theme.colors.teal}30)`,
                border: `1.5px solid ${theme.colors.skyBlue}50`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
              }}>
                👩‍🏫
              </div>
              <div>
                <div style={{ fontFamily: theme.fonts.headline, fontSize: 16, fontWeight: 700, color: theme.colors.white }}>
                  Sarah Ahmed
                </div>
                <div style={{ fontFamily: theme.fonts.body, fontSize: 13, color: 'rgba(245,249,255,0.55)' }}>
                  Science Teacher · Dubai
                </div>
              </div>
            </div>
            <div style={{
              display: 'flex',
              gap: 6,
              flexWrap: 'wrap',
            }}>
              {['Grade 9-11', 'CBSE', 'Arabic/English', 'Visual Learner'].map((tag) => (
                <div key={tag} style={{
                  background: `${theme.colors.skyBlue}18`,
                  border: `1px solid ${theme.colors.skyBlue}30`,
                  borderRadius: 6,
                  padding: '2px 8px',
                  fontFamily: theme.fonts.body,
                  fontSize: 11,
                  color: theme.colors.skyBlue,
                  fontWeight: 500,
                }}>
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Label */}
      <div style={{
        position: 'absolute',
        bottom: 70,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: labelOpacity,
        fontFamily: theme.fonts.headline,
        fontSize: 26,
        fontWeight: 700,
        color: theme.colors.white,
        letterSpacing: 0.5,
      }}>
        Region · Background ·{' '}
        <span style={{ color: theme.colors.skyBlue }}>Preferences</span>
        {' '}· Institution
      </div>
    </AbsoluteFill>
  )
}
