// Scene 26 — Final Hold (frames 6300–6600 / 10 seconds)
// "Tutify" | "The AI-Powered Unified Education System" | "www.tutify.co"
// Music carries — ultra-slow push-in, gentle particle drift
import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion'
import { ParticleField } from '../components/ParticleField'
import { theme } from '../theme'

export const Scene26FinalHold: React.FC = () => {
  const frame = useCurrentFrame()

  const sceneOpacity = interpolate(frame, [0, 25], [0, 1], {
    easing: Easing.bezier(0.4, 0, 0.2, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Ultra-slow push-in over 300 frames
  const pushIn = interpolate(frame, [0, 300], [1.0, 1.06], {
    easing: Easing.bezier(0.4, 0, 0.2, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Each element fades in staggered
  const logoOpacity = interpolate(frame, [20, 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const taglineOpacity = interpolate(frame, [50, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const urlOpacity = interpolate(frame, [80, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Subtle logo glow pulse (very slow)
  const glowPulse = Math.sin(frame * 0.03) * 0.15 + 0.9

  return (
    <AbsoluteFill style={{
      opacity: sceneOpacity,
      background: `linear-gradient(160deg, ${theme.colors.navyDeep} 0%, ${theme.colors.navy} 60%, #0d2540 100%)`,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Very sparse particles — final ambience */}
      <ParticleField density={25} color={theme.colors.skyBlue} speed={0.2} />
      <ParticleField density={10} color={theme.colors.teal} speed={0.15} />

      {/* Radial ambient glow — very soft */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(ellipse 55% 45% at 50% 50%, ${theme.colors.skyBlue}08 0%, transparent 70%)`,
        transform: `scale(${glowPulse})`,
      }} />

      {/* Push-in wrapper */}
      <div style={{ transform: `scale(${pushIn})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        {/* Main wordmark */}
        <div style={{
          opacity: logoOpacity,
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: theme.fonts.headline,
            fontSize: 120,
            fontWeight: 800,
            color: theme.colors.white,
            letterSpacing: -3,
            lineHeight: 1,
            filter: `drop-shadow(0 0 ${30 * glowPulse}px ${theme.colors.skyBlue}50) drop-shadow(0 0 ${60 * glowPulse}px ${theme.colors.skyBlue}20)`,
          }}>
            Tutify
          </div>
        </div>

        {/* Separator line */}
        <div style={{
          opacity: taglineOpacity,
          width: 400,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${theme.colors.skyBlue}, ${theme.colors.teal}, transparent)`,
          borderRadius: 2,
          marginTop: -8,
        }} />

        {/* Tagline */}
        <div style={{
          opacity: taglineOpacity,
          fontFamily: theme.fonts.body,
          fontSize: 22,
          color: 'rgba(245,249,255,0.72)',
          letterSpacing: 3,
          fontWeight: 400,
          textAlign: 'center',
          lineHeight: 1.5,
        }}>
          The AI-Powered Unified Education System
        </div>

        {/* Website URL */}
        <div style={{
          opacity: urlOpacity,
          fontFamily: theme.fonts.body,
          fontSize: 20,
          color: theme.colors.skyBlue,
          letterSpacing: 3,
          fontWeight: 500,
          marginTop: 8,
          textShadow: `0 0 20px ${theme.colors.skyBlue}50`,
        }}>
          www.tutify.co
        </div>
      </div>

      {/* Bottom gradient accent */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        background: `linear-gradient(90deg, ${theme.colors.skyBlue}, ${theme.colors.teal})`,
        opacity: urlOpacity * 0.6,
      }} />
    </AbsoluteFill>
  )
}
