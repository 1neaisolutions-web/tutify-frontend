import React from 'react'
import { useCurrentFrame } from 'remotion'
import { theme } from '../theme'

interface GlowOrbProps {
  color?: string
  size?: number
  pulseSpeed?: number
  x?: number
  y?: number
  label?: string
  labelSize?: number
  style?: React.CSSProperties
}

export const GlowOrb: React.FC<GlowOrbProps> = ({
  color = theme.colors.skyBlue,
  size = 80,
  pulseSpeed = 0.04,
  x = 0,
  y = 0,
  label,
  labelSize = 14,
  style,
}) => {
  const frame = useCurrentFrame()
  const pulse = Math.sin(frame * pulseSpeed) * 0.2 + 0.9
  const innerPulse = Math.sin(frame * pulseSpeed + 1) * 0.15 + 0.85

  return (
    <div
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...style,
      }}
    >
      {/* Outer glow ring */}
      <div
        style={{
          position: 'absolute',
          width: size * 1.6 * pulse,
          height: size * 1.6 * pulse,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${hexToRgba(color, 0.15)} 0%, transparent 70%)`,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
      {/* Main sphere */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, ${lighten(color, 0.5)} 0%, ${color} 45%, ${darken(color, 0.4)} 100%)`,
          boxShadow: `0 0 ${size * 0.6 * pulse}px ${hexToRgba(color, 0.7)}, 0 0 ${size * 1.2 * pulse}px ${hexToRgba(color, 0.3)}, inset 0 0 ${size * 0.3}px rgba(255,255,255,0.2)`,
          transform: `scale(${innerPulse})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: size * 0.3,
            height: size * 0.15,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.4)',
            transform: 'rotate(-30deg) translateY(-20%)',
          }}
        />
      </div>
      {label && (
        <div
          style={{
            marginTop: 12,
            color: theme.colors.white,
            fontFamily: theme.fonts.body,
            fontSize: labelSize,
            fontWeight: 600,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            letterSpacing: 0.5,
            opacity: 0.9,
          }}
        >
          {label}
        </div>
      )}
    </div>
  )
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

function lighten(hex: string, amount: number): string {
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + Math.round(255 * amount))
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + Math.round(255 * amount))
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + Math.round(255 * amount))
  return `rgb(${r},${g},${b})`
}

function darken(hex: string, amount: number): string {
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - Math.round(255 * amount))
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - Math.round(255 * amount))
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - Math.round(255 * amount))
  return `rgb(${r},${g},${b})`
}
