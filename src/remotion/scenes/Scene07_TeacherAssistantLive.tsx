// Scene 07 — Teacher Assistant Announcement (frames 1512–1764)
// "And today, the first pillar of Tutify is live — the Teacher Assistant."
import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from 'remotion'
import { ParticleField } from '../components/ParticleField'
import { theme } from '../theme'

export const Scene07TeacherAssistantLive: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const sceneOpacity = interpolate(frame, [0, 18, 234, 252], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Main headline spring entrance
  const headlineSpring = spring({ frame: frame - 20, fps, config: theme.spring.snappy })
  const headlineY = interpolate(headlineSpring, [0, 1], [60, 0])
  const headlineOpacity = interpolate(frame, [20, 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Sub-headline
  const subOpacity = interpolate(frame, [55, 80], [0, 1], { easing: Easing.bezier(0.4, 0, 0.2, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const subY = interpolate(frame, [55, 80], [20, 0], { easing: Easing.bezier(0.4, 0, 0.2, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // ✓ Checkmark
  const checkOpacity = interpolate(frame, [80, 100], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const checkScale = spring({ frame: frame - 80, fps, config: theme.spring.bouncy })

  // Light sweep beams
  const beamOffset = (frame * 3) % 1920

  // Background blurred feature panels (abstract blocks)
  const panelOpacity = interpolate(frame, [30, 70], [0, 0.18], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{
      opacity: sceneOpacity,
      background: `linear-gradient(160deg, #050e1c 0%, ${theme.colors.navy} 50%, #0d2540 100%)`,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Geometric grid */}
      <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0, opacity: 0.07 }}>
        {Array.from({ length: 14 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 80} x2="1920" y2={i * 80} stroke={theme.colors.skyBlue} strokeWidth="1" />
        ))}
        {Array.from({ length: 25 }, (_, i) => (
          <line key={`v${i}`} x1={i * 80} y1="0" x2={i * 80} y2="1080" stroke={theme.colors.skyBlue} strokeWidth="1" />
        ))}
      </svg>

      {/* Light beam sweep */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(90deg, transparent ${beamOffset - 200}px, ${theme.colors.skyBlue}08 ${beamOffset}px, transparent ${beamOffset + 200}px)`,
        pointerEvents: 'none',
      }} />

      <ParticleField density={35} color={theme.colors.teal} speed={0.4} />

      {/* Background abstract panels */}
      {[
        { x: 100, y: 200, w: 340, h: 200 },
        { x: 100, y: 440, w: 340, h: 160 },
        { x: 1480, y: 200, w: 340, h: 180 },
        { x: 1480, y: 420, w: 340, h: 200 },
      ].map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: p.x,
          top: p.y,
          width: p.w,
          height: p.h,
          background: 'rgba(59,158,255,0.05)',
          border: '1px solid rgba(59,158,255,0.12)',
          borderRadius: 12,
          opacity: panelOpacity,
          backdropFilter: 'blur(8px)',
        }} />
      ))}

      {/* Main content block */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, zIndex: 1 }}>
        {/* Feature label pill */}
        <div style={{
          opacity: subOpacity,
          transform: `translateY(${subY}px)`,
          background: `${theme.colors.teal}18`,
          border: `1px solid ${theme.colors.teal}50`,
          borderRadius: 100,
          padding: '8px 28px',
          fontFamily: theme.fonts.body,
          fontSize: 15,
          color: theme.colors.teal,
          letterSpacing: 3,
          fontWeight: 600,
          textTransform: 'uppercase',
        }}>
          Now Live
        </div>

        {/* Headline */}
        <div style={{
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
          fontFamily: theme.fonts.headline,
          fontSize: 88,
          fontWeight: 800,
          color: theme.colors.white,
          textAlign: 'center',
          lineHeight: 1.05,
          letterSpacing: -2,
          textShadow: `0 0 80px ${theme.colors.skyBlue}44`,
        }}>
          Teacher
          <br />
          <span style={{ color: theme.colors.skyBlue }}>Assistant</span>
        </div>

        {/* Live checkmark badge */}
        <div style={{
          opacity: checkOpacity,
          transform: `scale(${checkScale})`,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: `${theme.colors.skyBlue}20`,
          border: `1.5px solid ${theme.colors.skyBlue}50`,
          borderRadius: 100,
          padding: '10px 28px',
          boxShadow: `0 0 30px ${theme.colors.skyBlue}30`,
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill={theme.colors.skyBlue} opacity="0.2" />
            <path d="M6 12l4 4 8-8" stroke={theme.colors.skyBlue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{
            fontFamily: theme.fonts.body,
            fontSize: 17,
            color: theme.colors.white,
            fontWeight: 600,
            letterSpacing: 0.5,
          }}>
            Every tool a modern teacher needs — in one unified space
          </span>
        </div>
      </div>
    </AbsoluteFill>
  )
}
