/**
 * UICard — Light frosted-glass card for the SaaS gradient theme.
 * White/translucent bg, soft shadow, colored accent, spring entrance.
 */
import React from 'react'
import { useCurrentFrame, spring, interpolate, useVideoConfig } from 'remotion'
import { theme } from '../theme'

interface UICardProps {
  startFrame?: number
  animationDelay?: number
  width?: number | string
  height?: number | string
  glowColor?: string
  accentColor?: string
  accentPosition?: 'top' | 'left' | 'none'
  borderRadius?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'zoom'
  zoomFrom?: number
  pulse?: boolean
  children?: React.ReactNode
  style?: React.CSSProperties
}

export const UICard: React.FC<UICardProps> = ({
  startFrame = 0,
  animationDelay = 0,
  width = 400,
  height = 300,
  glowColor,
  accentColor,
  accentPosition = 'top',
  borderRadius = 20,
  direction = 'up',
  zoomFrom = 0.82,
  pulse = false,
  children,
  style = {},
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const f = Math.max(0, frame - startFrame - animationDelay)

  const p = spring({ frame: f, fps, config: theme.spring.zoom })
  const opacity    = interpolate(p, [0, 1], [0, 1])

  let transform = ''
  if (direction === 'zoom') {
    const scale = interpolate(p, [0, 1], [zoomFrom, 1])
    transform = `scale(${scale})`
  } else if (direction === 'up') {
    const scale = interpolate(p, [0, 1], [0.9, 1])
    const ty    = interpolate(p, [0, 1], [40, 0])
    transform = `scale(${scale}) translateY(${ty}px)`
  } else if (direction === 'down') {
    const scale = interpolate(p, [0, 1], [0.9, 1])
    const ty    = interpolate(p, [0, 1], [-40, 0])
    transform = `scale(${scale}) translateY(${ty}px)`
  } else if (direction === 'left') {
    const scale = interpolate(p, [0, 1], [0.92, 1])
    const tx    = interpolate(p, [0, 1], [55, 0])
    transform = `scale(${scale}) translateX(${tx}px)`
  } else if (direction === 'right') {
    const scale = interpolate(p, [0, 1], [0.92, 1])
    const tx    = interpolate(p, [0, 1], [-55, 0])
    transform = `scale(${scale}) translateX(${tx}px)`
  }

  const pulseAmt = pulse
    ? (Math.sin((frame / 40) * Math.PI) * 0.5 + 0.5) * 0.15 + 0.05
    : 0

  const shadowColor = glowColor ?? theme.colors.primaryGlow
  const shadowStr = glowColor
    ? `0 10px 36px ${shadowColor}, 0 2px 8px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.95)`
    : `0 10px 36px rgba(91,79,207,0.10), 0 2px 8px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.95)`

  return (
    <div
      style={{
        width,
        height,
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(20px) saturate(190%)',
        WebkitBackdropFilter: 'blur(20px) saturate(190%)',
        border: `1.5px solid rgba(255,255,255,0.78)`,
        borderRadius,
        boxShadow: shadowStr,
        opacity,
        transform,
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Top shimmer */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 1,
        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.95) 50%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Accent bar */}
      {accentColor && accentPosition === 'top' && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: 3,
          background: accentColor,
          borderRadius: `${borderRadius}px ${borderRadius}px 0 0`,
          pointerEvents: 'none',
        }} />
      )}
      {accentColor && accentPosition === 'left' && (
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0,
          width: 4,
          background: accentColor,
          borderRadius: `${borderRadius}px 0 0 ${borderRadius}px`,
          pointerEvents: 'none',
        }} />
      )}

      {pulse && (
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius,
          boxShadow: `0 0 60px ${shadowColor}`,
          opacity: pulseAmt,
          pointerEvents: 'none',
        }} />
      )}

      {children}
    </div>
  )
}
