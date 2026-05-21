import React, { useMemo } from 'react'
import { useCurrentFrame } from 'remotion'
import { theme } from '../theme'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  drift: number
  phase: number
}

interface ParticleFieldProps {
  density?: number
  color?: string
  speed?: number
  width?: number
  height?: number
}

// Seeded pseudo-random — stable across frames
function seeded(seed: number): number {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

export const ParticleField: React.FC<ParticleFieldProps> = ({
  density = 60,
  color = theme.colors.skyBlue,
  speed = 1,
  width = 1920,
  height = 1080,
}) => {
  const frame = useCurrentFrame()

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: density }, (_, i) => ({
      id: i,
      x: seeded(i * 7.1) * width,
      y: seeded(i * 3.3) * height,
      size: seeded(i * 5.7) * 3 + 1,
      speed: seeded(i * 2.9) * 0.4 + 0.1,
      opacity: seeded(i * 1.3) * 0.5 + 0.1,
      drift: (seeded(i * 4.1) - 0.5) * 0.3,
      phase: seeded(i * 6.2) * Math.PI * 2,
    }))
  }, [density, width, height])

  return (
    <svg
      width={width}
      height={height}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      {particles.map((p) => {
        const t = frame * speed * p.speed
        const cy = ((p.y - t * 20) % height + height) % height
        const cx = p.x + Math.sin(t * 0.05 + p.phase) * 30 * p.drift
        const twinkle = Math.sin(frame * 0.05 + p.phase) * 0.3 + 0.7

        return (
          <circle
            key={p.id}
            cx={cx}
            cy={cy}
            r={p.size}
            fill={color}
            opacity={p.opacity * twinkle}
          />
        )
      })}
    </svg>
  )
}
