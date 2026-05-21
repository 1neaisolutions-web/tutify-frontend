// Scene 25 — Call to Action (frames 6048–6300)
// "Be part of the journey. Help shape the future of education for the next generation."
import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from 'remotion'
import { ParticleField } from '../components/ParticleField'
import { theme } from '../theme'

export const Scene25CallToAction: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const sceneOpacity = interpolate(frame, [0, 18, 234, 252], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Logo at top
  const logoOpacity = interpolate(frame, [10, 35], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const logoY = interpolate(frame, [10, 35], [-20, 0], { easing: Easing.bezier(0.4, 0, 0.2, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // CTA button
  const ctaSpring = spring({ frame: frame - 40, fps, config: theme.spring.bouncy })
  const ctaScale = interpolate(ctaSpring, [0, 1], [0.5, 1])
  const ctaOpacity = interpolate(frame, [40, 65], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const ctaGlow = Math.sin(frame * 0.08) * 0.3 + 0.8

  // Subtitle
  const subOpacity = interpolate(frame, [70, 95], [0, 1], { easing: Easing.bezier(0.4, 0, 0.2, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const subY = interpolate(frame, [70, 95], [15, 0], { easing: Easing.bezier(0.4, 0, 0.2, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{
      opacity: sceneOpacity,
      background: `linear-gradient(160deg, ${theme.colors.navyDeep} 0%, ${theme.colors.navy} 100%)`,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      <ParticleField density={40} color={theme.colors.skyBlue} speed={0.4} />

      {/* Radial glow background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${theme.colors.skyBlue}10 0%, transparent 70%)`,
      }} />

      {/* Logo at top */}
      <div style={{
        position: 'absolute',
        top: 80,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: logoOpacity,
        transform: `translateY(${logoY}px)`,
      }}>
        <div style={{
          fontFamily: theme.fonts.headline,
          fontSize: 48,
          fontWeight: 800,
          color: theme.colors.white,
          letterSpacing: -1,
          textShadow: `0 0 30px ${theme.colors.skyBlue}40`,
        }}>
          Tutify
        </div>
        <div style={{
          width: 160,
          height: 3,
          background: `linear-gradient(90deg, ${theme.colors.skyBlue}, ${theme.colors.teal})`,
          borderRadius: 2,
          margin: '8px auto 0',
        }} />
      </div>

      {/* Main content */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, marginTop: 40 }}>
        {/* Headline */}
        <div style={{
          textAlign: 'center',
          opacity: logoOpacity,
          fontFamily: theme.fonts.headline,
          fontSize: 58,
          fontWeight: 800,
          color: theme.colors.white,
          lineHeight: 1.1,
          letterSpacing: -1.5,
          maxWidth: 900,
        }}>
          Help shape the future of
          <br />
          <span style={{ color: theme.colors.skyBlue }}>education.</span>
        </div>

        {/* CTA Button */}
        <div style={{
          opacity: ctaOpacity,
          transform: `scale(${ctaScale})`,
          transformOrigin: 'center center',
        }}>
          <div style={{
            background: `linear-gradient(90deg, ${theme.colors.skyBlue}, ${theme.colors.teal})`,
            borderRadius: 16,
            padding: '22px 64px',
            fontFamily: theme.fonts.headline,
            fontSize: 26,
            fontWeight: 800,
            color: theme.colors.white,
            letterSpacing: 0.5,
            cursor: 'pointer',
            boxShadow: `0 0 ${40 * ctaGlow}px ${theme.colors.skyBlue}60, 0 0 ${80 * ctaGlow}px ${theme.colors.teal}20, 0 8px 40px rgba(0,0,0,0.4)`,
            textAlign: 'center',
          }}>
            Book a Demo
          </div>
        </div>

        {/* Subtitle */}
        <div style={{
          opacity: subOpacity,
          transform: `translateY(${subY}px)`,
          textAlign: 'center',
          fontFamily: theme.fonts.body,
          fontSize: 18,
          color: 'rgba(245,249,255,0.55)',
          letterSpacing: 0.5,
          lineHeight: 1.6,
          maxWidth: 600,
        }}>
          Join educators in 50+ countries already using Tutify
          <br />
          to reclaim their time and reignite student learning.
        </div>
      </div>

      {/* Bottom URL */}
      <div style={{
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: subOpacity * 0.6,
        fontFamily: theme.fonts.body,
        fontSize: 16,
        color: theme.colors.skyBlue,
        letterSpacing: 2,
      }}>
        www.tutify.co
      </div>
    </AbsoluteFill>
  )
}
