import React from 'react'
import { useCurrentFrame, interpolate } from 'remotion'

interface Particle {
  x: number
  y: number
  r: number
  speed: number
  phase: number
  color: string
  opacity: number
  wobble: number
}

interface ParticleFieldProps {
  count?: number
  colors?: string[]
  direction?: 'up' | 'down' | 'converge' | 'diverge'
  startFrame?: number
  cx?: number
  cy?: number
  width?: number
  height?: number
}

function seededRand(seed: number): number {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

export const ParticleField: React.FC<ParticleFieldProps> = ({
  count = 48,
  colors = ['rgba(56,189,248,0.55)', 'rgba(139,92,246,0.45)', 'rgba(16,185,129,0.40)', 'rgba(245,158,11,0.35)'],
  direction = 'up',
  startFrame = 0,
  cx = 960,
  cy = 540,
  width = 1920,
  height = 1080,
}) => {
  const frame = useCurrentFrame()
  const f = Math.max(0, frame - startFrame)

  const particles: Particle[] = []
  for (let i = 0; i < count; i++) {
    const sr = (seed: number) => seededRand(i * 17.3 + seed)
    particles.push({
      x:       sr(0) * width,
      y:       sr(1) * height,
      r:       sr(2) * 3 + 1.5,
      speed:   sr(3) * 0.6 + 0.25,
      phase:   sr(4) * Math.PI * 2,
      color:   colors[Math.floor(sr(5) * colors.length)],
      opacity: sr(6) * 0.45 + 0.15,
      wobble:  sr(7) * 28,
    })
  }

  return (
    <svg
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      width={width}
      height={height}
    >
      {particles.map((p, i) => {
        let dx = 0, dy = 0

        if (direction === 'up') {
          const traveled = (f * p.speed) % height
          dy = -traveled
          dx = Math.sin(f * 0.018 + p.phase) * p.wobble
        } else if (direction === 'down') {
          const traveled = (f * p.speed) % height
          dy = traveled
          dx = Math.sin(f * 0.018 + p.phase) * p.wobble
        } else if (direction === 'converge') {
          const vx = (cx - p.x) / width
          const vy = (cy - p.y) / height
          dx = vx * f * p.speed * 0.8
          dy = vy * f * p.speed * 0.8
        } else if (direction === 'diverge') {
          const vx = (p.x - cx) / width
          const vy = (p.y - cy) / height
          dx = vx * f * p.speed * 0.6
          dy = vy * f * p.speed * 0.6
        }

        const px = ((p.x + dx) % width + width) % width
        const py = ((p.y + dy) % height + height) % height

        const fadeIn  = interpolate(f,  [0, 60],        [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
        const edgeFadeY = direction === 'up'
          ? interpolate(py, [0, 80, height - 80, height], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
          : 1

        const finalOpacity = p.opacity * fadeIn * edgeFadeY
          * (0.7 + 0.3 * Math.sin(f * 0.04 + p.phase))

        return (
          <g key={i}>
            {/* glow halo */}
            <circle cx={px} cy={py} r={p.r * 2.8} fill={p.color} opacity={finalOpacity * 0.28} />
            {/* core dot */}
            <circle cx={px} cy={py} r={p.r}       fill={p.color} opacity={finalOpacity} />
          </g>
        )
      })}
    </svg>
  )
}
