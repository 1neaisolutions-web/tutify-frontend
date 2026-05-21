// Scene 12 — YouTube Global Content (frames 2772–3024)
// "Everyone already watches YouTube. Tutify turns it into a safe, intelligent learning engine."
import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from 'remotion'
import { GlassCard } from '../components/GlassCard'
import { ParticleField } from '../components/ParticleField'
import { theme } from '../theme'

const CONTENT_ORBS = [
  { label: 'Space',     gradient: ['#1a0a4a', '#4B0082'], icon: '🌌', angle:  -90, orbitR: 300 },
  { label: 'Nature',    gradient: ['#0a3a0a', '#1a6b1a'], icon: '🌿', angle:  -30, orbitR: 300 },
  { label: 'World',     gradient: ['#0a2040', '#1a4080'], icon: '🌍', angle:   30, orbitR: 300 },
  { label: 'Ocean',     gradient: ['#002030', '#004060'], icon: '🌊', angle:   90, orbitR: 300 },
  { label: 'Culture',   gradient: ['#3a1010', '#6b2020'], icon: '🎭', angle:  150, orbitR: 300 },
  { label: 'Science',   gradient: ['#001040', '#003080'], icon: '⚛', angle:  210, orbitR: 300 },
]
const CX = 960, CY = 540

export const Scene12YouTubeGlobalContent: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const sceneOpacity = interpolate(frame, [0, 18, 234, 252], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const rotation = frame * 0.12

  // Label
  const labelOpacity = interpolate(frame, [80, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{
      opacity: sceneOpacity,
      background: `linear-gradient(150deg, ${theme.colors.navyDeep} 0%, ${theme.colors.navy} 100%)`,
      overflow: 'hidden',
    }}>
      <ParticleField density={40} color={theme.colors.skyBlue} speed={0.4} />

      <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0 }}>
        {/* Connection lines */}
        {CONTENT_ORBS.map((orb, i) => {
          const angle = ((orb.angle + rotation) * Math.PI) / 180
          const ox = CX + Math.cos(angle) * orb.orbitR
          const oy = CY + Math.sin(angle) * orb.orbitR
          const lineOpacity = interpolate(frame, [20 + i * 10, 45 + i * 10], [0, 0.5], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
          const pulse = ((frame * 0.018 + i * 0.18) % 1)
          return (
            <g key={i}>
              <line x1={CX} y1={CY} x2={ox} y2={oy}
                stroke={theme.colors.skyBlue} strokeWidth="1"
                strokeOpacity={lineOpacity} strokeDasharray="3 8" />
              <circle
                cx={CX + (ox - CX) * pulse}
                cy={CY + (oy - CY) * pulse}
                r={3.5} fill={theme.colors.skyBlue} opacity={lineOpacity * 0.8}
              />
            </g>
          )
        })}
      </svg>

      {/* Central video frame */}
      <div style={{
        position: 'absolute',
        left: CX - 130,
        top: CY - 80,
      }}>
        {(() => {
          const centerSpring = spring({ frame: frame - 10, fps, config: theme.spring.gentle })
          const centerScale = interpolate(centerSpring, [0, 1], [0.5, 1])
          const pulse = Math.sin(frame * 0.06) * 0.03 + 1
          return (
            <div style={{ transform: `scale(${centerScale * pulse})`, transformOrigin: 'center center' }}>
              <GlassCard width={260} height={160} glowColor={theme.colors.skyBlue} glowIntensity={0.8} borderRadius={14}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 8 }}>
                  {/* Play button */}
                  <div style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${theme.colors.skyBlue}, ${theme.colors.teal})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 0 25px ${theme.colors.skyBlue}60`,
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  </div>
                  <div style={{
                    fontFamily: theme.fonts.body,
                    fontSize: 12,
                    color: 'rgba(245,249,255,0.7)',
                    letterSpacing: 1,
                  }}>
                    YouTube Intelligence
                  </div>
                </div>
              </GlassCard>
            </div>
          )
        })()}
      </div>

      {/* Orbital content orbs */}
      {CONTENT_ORBS.map((orb, i) => {
        const angle = ((orb.angle + rotation) * Math.PI) / 180
        const ox = CX + Math.cos(angle) * orb.orbitR
        const oy = CY + Math.sin(angle) * orb.orbitR

        const orbSpring = spring({ frame: frame - (20 + i * 12), fps, config: theme.spring.bouncy })
        const orbScale = interpolate(orbSpring, [0, 1], [0, 1])
        const orbOpacity = interpolate(frame, [20 + i * 12, 40 + i * 12], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
        const orbPulse = Math.sin(frame * 0.05 + i * 1.1) * 0.05 + 1

        return (
          <div key={i} style={{
            position: 'absolute',
            left: ox - 55,
            top: oy - 55,
            opacity: orbOpacity,
            transform: `scale(${orbScale * orbPulse})`,
            transformOrigin: 'center center',
          }}>
            <GlassCard width={110} height={110} glowColor={theme.colors.skyBlue} glowIntensity={0.35} borderRadius={16}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 6 }}>
                <div style={{
                  width: 50,
                  height: 50,
                  borderRadius: 12,
                  background: `linear-gradient(135deg, ${orb.gradient[0]}, ${orb.gradient[1]})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                }}>
                  {orb.icon}
                </div>
                <div style={{ fontFamily: theme.fonts.body, fontSize: 12, color: 'rgba(245,249,255,0.75)', fontWeight: 600 }}>
                  {orb.label}
                </div>
              </div>
            </GlassCard>
          </div>
        )
      })}

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
        fontWeight: 700,
        color: theme.colors.white,
        letterSpacing: 0.5,
      }}>
        Nature · Space · Cultures ·{' '}
        <span style={{ color: theme.colors.skyBlue }}>Science</span>
      </div>
    </AbsoluteFill>
  )
}
