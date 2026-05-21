import React from 'react'
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'

interface GlowOrbProps {
  color?: string
  size?: number
  x?: number
  y?: number
  pulseSpeed?: number
  startFrame?: number
  label?: string
  labelSize?: number
  style?: React.CSSProperties
}

export const GlowOrb: React.FC<GlowOrbProps> = ({
  color = '#38BDF8',
  size = 80,
  x = 0,
  y = 0,
  pulseSpeed = 0.04,
  startFrame = 0,
  label,
  labelSize = 14,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const f = Math.max(0, frame - startFrame)

  const enterP = spring({ frame: f, fps, config: { damping: 80, stiffness: 200, mass: 1 } })
  const opacity = interpolate(enterP, [0, 1], [0, 1])
  const scale   = interpolate(enterP, [0, 1], [0.4, 1])

  const pulse  = Math.sin(frame * pulseSpeed * Math.PI) * 0.5 + 0.5
  const halo1  = size * (1.8 + 0.4 * pulse)
  const halo2  = size * (2.6 + 0.6 * pulse)

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
      {/* Outer halo ring */}
      <div style={{
        position: 'absolute',
        left: -(halo2 - size) / 2,
        top:  -(halo2 - size) / 2,
        width:  halo2,
        height: halo2,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
      }} />
      {/* Inner halo ring */}
      <div style={{
        position: 'absolute',
        left: -(halo1 - size) / 2,
        top:  -(halo1 - size) / 2,
        width:  halo1,
        height: halo1,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`,
      }} />
      {/* Orb body */}
      <div style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle at 38% 32%, ${color}ff 0%, ${color}cc 40%, ${color}44 80%, transparent 100%)`,
        boxShadow: `0 0 ${size * 0.6}px ${color}88`,
      }} />
      {/* Specular highlight */}
      <div style={{
        position: 'absolute',
        top: size * 0.12,
        left: size * 0.22,
        width: size * 0.3,
        height: size * 0.2,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.45)',
        filter: 'blur(4px)',
      }} />
      {label && (
        <div style={{
          position: 'absolute',
          top: size + 10,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: labelSize,
          color: color,
          fontWeight: 600,
          whiteSpace: 'nowrap',
          fontFamily: '"Inter", sans-serif',
        }}>
          {label}
        </div>
      )}
    </div>
  )
}
