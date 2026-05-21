import React from 'react'
import { useCurrentFrame, spring, interpolate, useVideoConfig } from 'remotion'

interface UICardProps {
  startFrame?: number
  animationDelay?: number
  width?: number
  height?: number
  glowColor?: string
  pulse?: boolean
  children?: React.ReactNode
  style?: React.CSSProperties
}

export const UICard: React.FC<UICardProps> = ({
  startFrame = 0,
  animationDelay = 0,
  width = 400,
  height = 300,
  glowColor = 'rgba(56,189,248,0.25)',
  pulse = false,
  children,
  style = {},
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const f = Math.max(0, frame - startFrame - animationDelay)

  const p = spring({ frame: f, fps, config: { damping: 80, stiffness: 200, mass: 1 } })
  const opacity = interpolate(p, [0, 1], [0, 1])
  const scale = interpolate(p, [0, 1], [0.88, 1])
  const translateY = interpolate(p, [0, 1], [40, 0])

  const pulseAmt = pulse
    ? (Math.sin((frame / 35) * Math.PI) * 0.5 + 0.5) * 0.25 + 0.2
    : 0

  return (
    <div
      style={{
        width,
        height,
        background: 'rgba(255,255,255,0.045)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 20,
        boxShadow: `0 0 50px ${glowColor}, 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)`,
        opacity,
        transform: `scale(${scale}) translateY(${translateY}px)`,
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Top-edge shimmer line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />
      {/* Pulse glow overlay */}
      {pulse && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 20,
            boxShadow: `0 0 80px ${glowColor}`,
            opacity: pulseAmt,
            pointerEvents: 'none',
          }}
        />
      )}
      {children}
    </div>
  )
}
