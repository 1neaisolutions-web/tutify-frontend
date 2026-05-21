import React, { useMemo } from 'react'
import { useCurrentFrame } from 'remotion'
import { theme } from '../theme'

interface Particle {
  id: number
  startX: number   // px (within width)
  startY: number   // 0–1 normalized start position
  size: number
  speed: number    // px per frame
  color: string
  phaseOffset: number
  wobbleAmp: number
  cycleFrames: number
}

interface SoftParticlesProps {
  count?: number
  colors?: string[]
  width?: number
  height?: number
  style?: React.CSSProperties
}

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

export const SoftParticles: React.FC<SoftParticlesProps> = ({
  count = 22,
  colors = [
    theme.colors.skyBlueGlow,
    theme.colors.mintGlow,
    theme.colors.coralGlow,
  ],
  width = 1920,
  height = 1080,
  style,
}) => {
  const frame = useCurrentFrame()

  const particles = useMemo<Particle[]>(() => {
    const rand = seededRandom(71)
    return Array.from({ length: count }, (_, i) => {
      const cycleFrames = 180 + Math.round(rand() * 240) // 6–14s cycles
      return {
        id: i,
        startX: rand() * width,
        startY: rand(),
        size: 5 + rand() * 14,
        speed: height / cycleFrames,
        color: colors[Math.floor(rand() * colors.length)],
        phaseOffset: Math.round(rand() * cycleFrames),
        wobbleAmp: 10 + rand() * 25,
        cycleFrames,
      }
    })
  }, [count, width, height, JSON.stringify(colors)])

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width,
        height,
        pointerEvents: 'none',
        overflow: 'hidden',
        ...style,
      }}
    >
      {particles.map((p) => {
        const t = (frame + p.phaseOffset) % p.cycleFrames
        const progress = t / p.cycleFrames // 0 → 1

        // Travel from bottom to top
        const y = height - progress * (height + p.size * 2)
        // Horizontal drift
        const x = p.startX + Math.sin((progress * Math.PI * 2) + p.id) * p.wobbleAmp

        // Fade in / out
        const fadeIn  = Math.min(1, progress * 10)
        const fadeOut = Math.min(1, (1 - progress) * 10)
        const opacity = fadeIn * fadeOut * 0.75

        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: p.color,
              opacity,
              transform: 'translateX(-50%) translateY(-50%)',
            }}
          />
        )
      })}
    </div>
  )
}
