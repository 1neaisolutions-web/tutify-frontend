// Scene 24 — Final Brand Convergence (frames 5796–6048)
// "This is Tutify. The AI-powered unified education system."
import React, { useMemo } from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from 'remotion'
import { theme } from '../theme'

const NUM_PARTICLES = 120
const CX = 960, CY = 500

export const Scene24FinalBrandConvergence: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const sceneOpacity = interpolate(frame, [0, 18, 234, 252], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Particles converge toward center logo position
  const convergeStart = 20
  const convergeEnd = 110

  const particles = useMemo(() => {
    return Array.from({ length: NUM_PARTICLES }, (_, i) => ({
      startX: (Math.sin(i * 7.3) * 0.5 + 0.5) * 1920,
      startY: (Math.sin(i * 3.7) * 0.5 + 0.5) * 1080,
      color:  i % 3 === 0 ? theme.colors.skyBlue : i % 3 === 1 ? theme.colors.teal : '#B47FFF',
      size:   (Math.sin(i * 5.1) * 0.5 + 0.5) * 4 + 1.5,
      delay:  (Math.sin(i * 2.9) * 0.5 + 0.5) * 30,
    }))
  }, [])

  // Logo entrance spring
  const logoSpring = spring({ frame: frame - convergeEnd, fps, config: theme.spring.gentle })
  const logoScale = interpolate(logoSpring, [0, 1], [0.7, 1])
  const logoOpacity = interpolate(frame, [convergeEnd, convergeEnd + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Tagline entrance
  const tagOpacity = interpolate(frame, [convergeEnd + 25, convergeEnd + 50], [0, 1], {
    easing: Easing.bezier(0.4, 0, 0.2, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Pulse glow
  const glowPulse = Math.sin(frame * 0.05) * 0.2 + 0.9

  return (
    <AbsoluteFill style={{
      opacity: sceneOpacity,
      background: `linear-gradient(160deg, ${theme.colors.navyDeep} 0%, ${theme.colors.navy} 100%)`,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Converging particles */}
      <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {particles.map((p, i) => {
          const localFrame = frame - p.delay
          const progress = interpolate(localFrame, [convergeStart, convergeEnd], [0, 1], {
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })

          const cx = p.startX + (CX - p.startX) * progress
          const cy = p.startY + (CY - p.startY) * progress

          // Particles vanish as they reach center
          const vanish = interpolate(progress, [0.7, 1], [1, 0])
          const opacity = progress < 0.05 ? 0 : interpolate(progress, [0.05, 0.2], [0, 1]) * vanish

          return (
            <circle key={i} cx={cx} cy={cy} r={p.size} fill={p.color} opacity={opacity * 0.75} />
          )
        })}

        {/* Glow pulse at center */}
        <radialGradient id="centerGlowFinal" cx="50%" cy="46%" r="25%">
          <stop offset="0%" stopColor={theme.colors.skyBlue} stopOpacity={0.3 * glowPulse} />
          <stop offset="100%" stopColor={theme.colors.skyBlue} stopOpacity="0" />
        </radialGradient>
        <rect x="0" y="0" width="1920" height="1080" fill="url(#centerGlowFinal)" />
      </svg>

      {/* Central logo */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        opacity: logoOpacity,
        transform: `scale(${logoScale})`,
      }}>
        {/* Wordmark */}
        <div style={{
          fontFamily: theme.fonts.headline,
          fontSize: 140,
          fontWeight: 800,
          color: theme.colors.white,
          letterSpacing: -4,
          lineHeight: 1,
          textShadow: `0 0 ${80 * glowPulse}px ${theme.colors.skyBlue}50, 0 0 ${40 * glowPulse}px ${theme.colors.teal}30`,
        }}>
          Tutify
        </div>

        {/* Underline */}
        <div style={{
          width: 500,
          height: 5,
          background: `linear-gradient(90deg, ${theme.colors.skyBlue}, ${theme.colors.teal})`,
          borderRadius: 3,
          boxShadow: `0 0 20px ${theme.colors.skyBlue}80`,
          marginTop: -8,
        }} />

        {/* Tagline */}
        <div style={{
          opacity: tagOpacity,
          fontFamily: theme.fonts.body,
          fontSize: 24,
          color: 'rgba(245,249,255,0.75)',
          letterSpacing: 3,
          fontWeight: 400,
          marginTop: 6,
          textAlign: 'center',
        }}>
          The AI-Powered Unified Education System
        </div>
      </div>

      {/* Bottom gradient line */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        background: `linear-gradient(90deg, ${theme.colors.skyBlue}, ${theme.colors.teal}, ${theme.colors.skyBlue})`,
        opacity: logoOpacity,
      }} />
    </AbsoluteFill>
  )
}
