import React from 'react'
import { theme } from '../theme'

interface FriendlyIconProps {
  /** Any icon node (SVG, lucide element, emoji, etc.) */
  icon: React.ReactNode
  color?: string
  size?: number
  /** Defaults to 10% opacity of `color` */
  backgroundColor?: string
  borderRadius?: number
  style?: React.CSSProperties
}

// Converts a 6-digit hex to rgba with given opacity
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export const FriendlyIcon: React.FC<FriendlyIconProps> = ({
  icon,
  color = theme.colors.skyBlue,
  size = 48,
  backgroundColor,
  borderRadius,
  style,
}) => {
  const bg =
    backgroundColor ??
    (color.startsWith('#') ? hexToRgba(color, 0.1) : 'rgba(59,158,255,0.1)')

  const br = borderRadius ?? Math.round(size * 0.28)

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: br,
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color,
        flexShrink: 0,
        ...style,
      }}
    >
      {icon}
    </div>
  )
}
