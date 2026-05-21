/**
 * LogoReveal — Logo with zoom-spring entrance + soft glow rings.
 * Works beautifully on the light gradient background.
 */
import React from 'react'
import { useCurrentFrame, spring, interpolate, useVideoConfig } from 'remotion'
import { LOGO_SRC } from '../assets'
import { theme } from '../theme'

interface LogoRevealProps {
  startFrame?: number
  size?: number
  x?: number
  y?: number
  glowIntensity?: number
  showTagline?: boolean
  taglineText?: string
}

export const LogoReveal: React.FC<LogoRevealProps> = ({
  startFrame = 0,
  size = 120,
  x = 960,
  y = 540,
  glowIntensity = 1,
  showTagline = false,
  taglineText = 'Tutify',
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const f = Math.max(0, frame - startFrame)

  // Zoom-spring entrance
  const enterP  = spring({ frame: f, fps, config: theme.spring.zoom })
  const opacity = interpolate(enterP, [0, 1], [0, 1])
  const scale   = interpolate(enterP, [0, 1], [0.4, 1])

  // Pulsing glow rings after settle
  const settled = Math.max(0, f - 25)
  const pulse   = Math.sin(settled * 0.03) * 0.5 + 0.5
  const ring1R  = size * 0.68 * (1 + pulse * 0.10)
  const ring2R  = size * 0.88 * (1 + pulse * 0.06)

  // Tagline entrance
  const tagF       = Math.max(0, f - 30)
  const tagP       = spring({ frame: tagF, fps, config: { damping: 120, stiffness: 160, mass: 1 } })
  const tagOpacity = interpolate(tagP, [0, 1], [0, 1])
  const tagY       = interpolate(tagP, [0, 1], [16, 0])

  return (
    <div style={{
      position: 'absolute',
      left: x - size / 2,
      top:  y - size / 2,
      width: size,
      height: size,
      opacity,
      transform: `scale(${scale})`,
      transformOrigin: 'center',
    }}>
      {/* Soft ambient glow — works on light bg */}
      <div style={{
        position: 'absolute',
        left:   -glowIntensity * size * 0.9,
        top:    -glowIntensity * size * 0.9,
        width:   size + glowIntensity * size * 1.8,
        height:  size + glowIntensity * size * 1.8,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(91,79,207,${0.18 * glowIntensity}) 0%, transparent 68%)`,
        pointerEvents: 'none',
      }} />

      {/* Ring 2 — outer orbit */}
      <div style={{
        position: 'absolute',
        left:  size / 2 - ring2R,
        top:   size / 2 - ring2R,
        width:  ring2R * 2,
        height: ring2R * 2,
        borderRadius: '50%',
        border: `1px solid ${theme.colors.primary}30`,
        pointerEvents: 'none',
      }} />

      {/* Ring 1 — inner glow ring */}
      <div style={{
        position: 'absolute',
        left:  size / 2 - ring1R,
        top:   size / 2 - ring1R,
        width:  ring1R * 2,
        height: ring1R * 2,
        borderRadius: '50%',
        border: `1.5px solid ${theme.colors.primary}55`,
        boxShadow: `0 0 18px rgba(91,79,207,0.22)`,
        pointerEvents: 'none',
      }} />

      {/* Logo — on light bg the dark circle looks great */}
      <img
        src={LOGO_SRC}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          boxShadow: `0 8px 32px rgba(91,79,207,${0.22 * glowIntensity}), 0 2px 8px rgba(0,0,0,0.12)`,
        }}
      />

      {/* Tagline */}
      {showTagline && (
        <div style={{
          position: 'absolute',
          top: size + 14,
          left: '50%',
          transform: `translateX(-50%) translateY(${tagY}px)`,
          opacity: tagOpacity,
          fontSize: size * 0.36,
          fontFamily: theme.font.display,
          fontWeight: 800,
          color: theme.colors.text,
          letterSpacing: '-0.01em',
          whiteSpace: 'nowrap',
        }}>
          {taglineText}
        </div>
      )}
    </div>
  )
}
