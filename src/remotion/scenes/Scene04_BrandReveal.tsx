// Scene 04 — Brand Reveal (frames 756–1008)
// "It's time for something different. It's time for Tutify."
// THE SHOWSTOPPER — pure code, no Veo, Apple keynote quality
import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Easing } from 'remotion'
import { theme } from '../theme'

export const Scene04BrandReveal: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Scene entrance
  const sceneOpacity = interpolate(frame, [0, 20, 232, 252], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // ── Background: dark navy → white bloom ──
  const bgProgress = interpolate(frame, [0, 80], [0, 1], {
    easing: Easing.bezier(0.4, 0, 0.2, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const bgColor = lerpColor('#020810', theme.colors.white, bgProgress)

  // ── Radial bloom from center ──
  const bloomScale = interpolate(frame, [0, 80], [0.3, 3.5], {
    easing: Easing.bezier(0.4, 0, 0.2, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const bloomOpacity = interpolate(frame, [0, 30, 70, 100], [0, 0.9, 0.6, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // ── Letter animation ──
  const word = 'Tutify'
  const letters = word.split('')

  // ── Underline sweep ──
  const lineProgress = interpolate(frame, [150, 185], [0, 1], {
    easing: Easing.bezier(0.4, 0, 0.2, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // ── Tagline fade ──
  const tagOpacity = interpolate(frame, [185, 220], [0, 1], {
    easing: Easing.bezier(0.4, 0, 0.2, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const tagY = interpolate(frame, [185, 220], [24, 0], {
    easing: Easing.bezier(0.4, 0, 0.2, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Determine if we're in light or dark phase for text color
  const textColor = lerpColor(theme.colors.white, theme.colors.textDark, bgProgress)

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity, background: bgColor, alignItems: 'center', justifyContent: 'center' }}>
      {/* Particle drift — light phase */}
      {frame > 40 && (
        <LightParticles frame={frame} />
      )}

      {/* Warm bloom burst */}
      <div style={{
        position: 'absolute',
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.colors.skyBlue}33 0%, ${theme.colors.skyBlue}11 40%, transparent 70%)`,
        opacity: bloomOpacity,
        transform: `scale(${bloomScale}) translate(-50%, -50%)`,
        left: '50%',
        top: '50%',
        transformOrigin: '0 0',
        pointerEvents: 'none',
      }} />

      {/* Main content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
      }}>
        {/* Letter-by-letter wordmark */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
          {letters.map((letter, i) => {
            const startF = 60 + i * 5
            const letterProgress = spring({
              frame: frame - startF,
              fps,
              config: theme.spring.bouncy,
            })
            const letterOpacity = interpolate(frame - startF, [0, 18], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
            const translateY = interpolate(letterProgress, [0, 1], [60, 0])

            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  opacity: letterOpacity,
                  transform: `translateY(${translateY}px)`,
                  fontFamily: theme.fonts.headline,
                  fontSize: 140,
                  fontWeight: 800,
                  color: textColor,
                  lineHeight: 1,
                  letterSpacing: -3,
                }}
              >
                {letter}
              </span>
            )
          })}
        </div>

        {/* Animated underline */}
        <div style={{
          width: `${lineProgress * 100}%`,
          maxWidth: 520,
          height: 5,
          background: `linear-gradient(90deg, ${theme.colors.skyBlue}, ${theme.colors.teal})`,
          borderRadius: 3,
          marginTop: 4,
          boxShadow: `0 0 20px ${theme.colors.skyBlue}99`,
        }} />

        {/* Tagline */}
        <div style={{
          opacity: tagOpacity * 0.8,
          transform: `translateY(${tagY}px)`,
          fontFamily: theme.fonts.body,
          fontSize: 26,
          color: theme.colors.textDark,
          letterSpacing: 2.5,
          fontWeight: 400,
          marginTop: 28,
        }}>
          Education, reimagined.
        </div>
      </div>
    </AbsoluteFill>
  )
}

/* Floating light particles in white-phase */
const LightParticles: React.FC<{ frame: number }> = ({ frame }) => {
  const particles = Array.from({ length: 24 }, (_, i) => ({
    x: (Math.sin(i * 7.1) * 0.5 + 0.5) * 1920,
    y: (Math.sin(i * 3.3) * 0.5 + 0.5) * 1080,
    r: (Math.sin(i * 5.7) * 0.5 + 0.5) * 4 + 2,
    phase: Math.sin(i * 2.3) * Math.PI * 2,
    speed: (Math.sin(i * 4.1) * 0.5 + 0.5) * 0.3 + 0.1,
    drift: (Math.sin(i * 6.9) - 0.5) * 0.5,
  }))

  return (
    <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {particles.map((p, i) => {
        const cy = ((p.y - frame * p.speed * 15) % 1080 + 1080) % 1080
        const cx = p.x + Math.sin(frame * 0.03 + p.phase) * 25 * p.drift
        const alpha = (Math.sin(frame * 0.04 + p.phase) * 0.15 + 0.15)
        return (
          <circle key={i} cx={cx} cy={cy} r={p.r}
            fill={theme.colors.skyBlue} opacity={alpha} />
        )
      })}
    </svg>
  )
}

// Linear color interpolation between two hex colors
function lerpColor(from: string, to: string, t: number): string {
  const clamp = Math.max(0, Math.min(1, t))
  const fr = parseInt(from.slice(1, 3), 16)
  const fg = parseInt(from.slice(3, 5), 16)
  const fb = parseInt(from.slice(5, 7), 16)
  const tr = parseInt(to.slice(1, 3), 16)
  const tg = parseInt(to.slice(3, 5), 16)
  const tb = parseInt(to.slice(5, 7), 16)
  const r = Math.round(fr + (tr - fr) * clamp)
  const g = Math.round(fg + (tg - fg) * clamp)
  const b = Math.round(fb + (tb - fb) * clamp)
  return `rgb(${r},${g},${b})`
}
