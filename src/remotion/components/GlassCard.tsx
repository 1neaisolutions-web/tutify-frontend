import React from 'react'
import { theme } from '../theme'

interface GlassCardProps {
  children?: React.ReactNode
  width?: number | string
  height?: number | string
  glowColor?: string
  glowIntensity?: number  // 0–1
  style?: React.CSSProperties
  borderRadius?: number
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  width = 400,
  height = 240,
  glowColor = theme.colors.skyBlue,
  glowIntensity = 0.4,
  style,
  borderRadius = 16,
}) => {
  const glowRgba = hexToRgba(glowColor, glowIntensity * 0.3)
  const glowShadow = `0 0 40px ${hexToRgba(glowColor, glowIntensity * 0.5)}, 0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.1)`

  return (
    <div
      style={{
        width,
        height,
        background: `linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.04) 100%)`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${theme.colors.glassBorder}`,
        borderRadius,
        boxShadow: glowShadow,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        ...style,
      }}
    >
      {/* Top-edge shimmer */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          width: '80%',
          height: 1,
          background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)`,
        }}
      />
      {children}
    </div>
  )
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}
