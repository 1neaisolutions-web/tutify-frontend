// Scene 10 — Template Input (frames 2268–2520)
// "Take one real classroom challenge — students who won't stay in their seats."
import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from 'remotion'
import { GlassCard } from '../components/GlassCard'
import { theme } from '../theme'

const INPUT_TEXT = 'students who do not sit in their seats'

export const Scene10TemplateInput: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const sceneOpacity = interpolate(frame, [0, 18, 234, 252], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Card entrance
  const cardSpring = spring({ frame: frame - 15, fps, config: theme.spring.snappy })
  const cardScale = interpolate(cardSpring, [0, 1], [0.88, 1])
  const cardOpacity = interpolate(frame, [15, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Camera push-in
  const pushIn = interpolate(frame, [0, 252], [1, 1.04], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Typewriter effect — 1 char every 3 frames, start at frame 70
  const typeStart = 70
  const charsVisible = Math.floor(Math.max(0, frame - typeStart) / 3)
  const typedText = INPUT_TEXT.slice(0, charsVisible)
  const showCursor = frame >= typeStart && charsVisible <= INPUT_TEXT.length

  // Generate button pulse
  const buttonGlow = Math.sin(frame * 0.1) * 0.3 + 0.7
  const buttonVisible = interpolate(frame, [50, 70], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Label
  const labelOpacity = interpolate(frame, [30, 55], [0, 1], { easing: Easing.bezier(0.4, 0, 0.2, 1), extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill style={{
      opacity: sceneOpacity,
      background: `linear-gradient(150deg, ${theme.colors.navyDeep} 0%, ${theme.colors.navy} 100%)`,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Ambient grid */}
      <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0, opacity: 0.05 }}>
        {Array.from({ length: 16 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 72} x2="1920" y2={i * 72} stroke={theme.colors.skyBlue} strokeWidth="1" />
        ))}
        {Array.from({ length: 27 }, (_, i) => (
          <line key={`v${i}`} x1={i * 72} y1="0" x2={i * 72} y2="1080" stroke={theme.colors.skyBlue} strokeWidth="1" />
        ))}
      </svg>

      <div style={{
        transform: `scale(${pushIn * cardScale})`,
        opacity: cardOpacity,
      }}>
        <GlassCard width={760} height={480} glowColor={theme.colors.skyBlue} glowIntensity={0.55} borderRadius={20}>
          <div style={{ padding: '32px 40px', height: '100%', display: 'flex', flexDirection: 'column', gap: 0 }}>
            {/* Title bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
              <div style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: `${theme.colors.skyBlue}20`,
                border: `1px solid ${theme.colors.skyBlue}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="3" stroke={theme.colors.skyBlue} strokeWidth="1.5" />
                  <line x1="7" y1="8" x2="17" y2="8" stroke={theme.colors.skyBlue} strokeWidth="1.5" />
                  <line x1="7" y1="12" x2="14" y2="12" stroke={theme.colors.skyBlue} strokeWidth="1.5" />
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: theme.fonts.headline, fontSize: 22, fontWeight: 700, color: theme.colors.white }}>
                  Classroom Management
                </div>
                <div style={{ fontFamily: theme.fonts.body, fontSize: 13, color: 'rgba(245,249,255,0.5)', marginTop: 2 }}>
                  AI-powered strategy generator
                </div>
              </div>
              <div style={{
                marginLeft: 'auto',
                background: `${theme.colors.teal}18`,
                border: `1px solid ${theme.colors.teal}40`,
                borderRadius: 6,
                padding: '4px 12px',
                fontFamily: theme.fonts.body,
                fontSize: 12,
                color: theme.colors.teal,
                fontWeight: 600,
              }}>
                Template
              </div>
            </div>

            {/* Grade dropdown */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: theme.fonts.body, fontSize: 13, color: 'rgba(245,249,255,0.55)', marginBottom: 7, letterSpacing: 0.5 }}>
                Grade Level
              </div>
              <div style={{
                height: 42,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                justifyContent: 'space-between',
              }}>
                <span style={{ fontFamily: theme.fonts.body, fontSize: 15, color: theme.colors.white }}>9th Grade</span>
                <span style={{ color: 'rgba(245,249,255,0.4)', fontSize: 12 }}>▼</span>
              </div>
            </div>

            {/* Input field with typewriter */}
            <div style={{ marginBottom: 24, flex: 1 }}>
              <div style={{ fontFamily: theme.fonts.body, fontSize: 13, color: 'rgba(245,249,255,0.55)', marginBottom: 7, letterSpacing: 0.5 }}>
                Describe the challenge
              </div>
              <div style={{
                minHeight: 80,
                background: 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${frame >= typeStart ? theme.colors.skyBlue + '60' : 'rgba(255,255,255,0.12)'}`,
                borderRadius: 10,
                padding: '14px 16px',
                fontFamily: theme.fonts.body,
                fontSize: 16,
                color: theme.colors.white,
                lineHeight: 1.5,
                boxShadow: frame >= typeStart ? `0 0 20px ${theme.colors.skyBlue}15` : 'none',
                transition: 'border-color 0.3s',
              }}>
                {typedText}
                {showCursor && (
                  <span style={{
                    display: 'inline-block',
                    width: 2,
                    height: '1em',
                    background: theme.colors.skyBlue,
                    marginLeft: 2,
                    verticalAlign: 'middle',
                    opacity: Math.sin(frame * 0.2) > 0 ? 1 : 0,
                  }} />
                )}
              </div>
            </div>

            {/* Generate button */}
            <div style={{ opacity: buttonVisible }}>
              <div style={{
                background: `linear-gradient(90deg, ${theme.colors.skyBlue}, ${theme.colors.teal})`,
                borderRadius: 12,
                padding: '14px 32px',
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: `0 0 ${25 * buttonGlow}px ${theme.colors.skyBlue}60, 0 4px 20px rgba(0,0,0,0.3)`,
                fontFamily: theme.fonts.headline,
                fontSize: 17,
                fontWeight: 700,
                color: theme.colors.white,
                letterSpacing: 0.5,
              }}>
                Generate Strategy →
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Scene label */}
      <div style={{
        position: 'absolute',
        top: 80,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: labelOpacity,
        fontFamily: theme.fonts.body,
        fontSize: 16,
        color: 'rgba(245,249,255,0.45)',
        letterSpacing: 3,
        textTransform: 'uppercase',
      }}>
        Template · Classroom Management
      </div>
    </AbsoluteFill>
  )
}
