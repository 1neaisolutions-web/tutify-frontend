import React from 'react'

interface WarmGlowProps {
  color: string
  width?: number
  height?: number
  opacity?: number
  style?: React.CSSProperties
  shape?: 'circle' | 'ellipse'
}

export const WarmGlow: React.FC<WarmGlowProps> = ({
  color,
  width = 400,
  height,
  opacity = 1,
  style,
  shape = 'circle',
}) => {
  const h = height ?? (shape === 'circle' ? width : width * 0.7)

  return (
    <div
      style={{
        width,
        height: h,
        background: `radial-gradient(ellipse ${width * 0.5}px ${h * 0.5}px at 50% 50%, ${color} 0%, transparent 70%)`,
        opacity,
        pointerEvents: 'none',
        ...style,
      }}
    />
  )
}
