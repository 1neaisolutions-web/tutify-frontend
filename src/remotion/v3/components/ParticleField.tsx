import React from 'react'
import { useCurrentFrame } from 'remotion'

interface ParticleFieldProps {
  count?: number
  color1?: string
  color2?: string
  width?: number
  height?: number
}

const sr = (seed: number) => {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

export const ParticleField: React.FC<ParticleFieldProps> = ({
  count = 40,
  color1 = '#38BDF8',
  color2 = '#34D399',
  width = 1920,
  height = 1080,
}) => {
  const frame = useCurrentFrame()

  return (
    <svg
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      width={width}
      height={height}
    >
      {Array.from({ length: count }, (_, i) => {
        const x = sr(i * 7.3) * width
        const speed = 0.25 + sr(i * 5.1) * 0.9
        const size = 1.2 + sr(i * 2.9) * 3.5
        const baseOpacity = 0.18 + sr(i * 4.1) * 0.55
        const wobble = Math.sin((frame / 55 + sr(i * 8.3) * Math.PI * 2)) * 28
        const color = i % 3 === 0 ? color2 : color1
        const lifecycle = (frame * speed + sr(i * 6.7) * height) % height
        const y = height - lifecycle
        const lifeOpacity =
          lifecycle < 80
            ? lifecycle / 80
            : lifecycle > height - 80
            ? (height - lifecycle) / 80
            : 1

        return (
          <g key={i}>
            <circle
              cx={x + wobble}
              cy={y}
              r={size}
              fill={color}
              opacity={baseOpacity * lifeOpacity}
            />
            {/* Glow halo */}
            <circle
              cx={x + wobble}
              cy={y}
              r={size * 2.5}
              fill={color}
              opacity={baseOpacity * lifeOpacity * 0.15}
            />
          </g>
        )
      })}
    </svg>
  )
}
