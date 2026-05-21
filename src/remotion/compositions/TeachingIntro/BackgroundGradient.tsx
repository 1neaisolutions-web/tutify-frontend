/**
 * Full-screen drifting magenta / orange / indigo mesh with heavy softness + grain.
 */
import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'

const abs: React.CSSProperties = { position: 'absolute', inset: 0 }

export const BackgroundGradient: React.FC = () => {
  const frame = useCurrentFrame()
  const t = frame * 0.018

  const b1x = 18 + Math.sin(t * 0.62) * 14
  const b1y = 22 + Math.cos(t * 0.48) * 12
  const b2x = 82 + Math.sin(t * 0.44 + 1.4) * 12
  const b2y = 38 + Math.cos(t * 0.55 + 0.8) * 14
  const b3x = 48 + Math.sin(t * 0.38 + 2.8) * 18
  const b3y = 52 + Math.cos(t * 0.42 + 2.1) * 16
  const b4x = 55 + Math.sin(t * 0.52 + 4.2) * 10
  const b4y = 8 + Math.cos(t * 0.36 + 1.2) * 8

  const breathe = (phase: number, amp: number) => 1 + Math.sin(t * 0.9 + phase) * amp

  return (
    <AbsoluteFill style={{ background: '#2a1048', overflow: 'hidden' }}>
      <div
        style={{
          ...abs,
          filter: 'blur(100px)',
          transform: 'scale(1.08)',
          willChange: 'transform',
        }}
      >
        <div
          style={{
            ...abs,
            background: `radial-gradient(ellipse ${68 * breathe(0, 0.08)}% ${62 * breathe(0.5, 0.06)}% at ${b1x}% ${b1y}%, rgba(180, 20, 72, 0.92) 0%, transparent 68%)`,
            transform: `translate(${Math.sin(t * 0.5) * 3}%, ${Math.cos(t * 0.4) * 2}%)`,
          }}
        />
        <div
          style={{
            ...abs,
            background: `radial-gradient(ellipse ${58 * breathe(1, 0.07)}% ${54 * breathe(1.3, 0.05)}% at ${b2x}% ${b2y}%, rgba(255, 120, 32, 0.88) 0%, transparent 65%)`,
            transform: `translate(${Math.sin(t * 0.45 + 1) * -2.5}%, ${Math.cos(t * 0.38 + 0.5) * 2}%)`,
          }}
        />
        <div
          style={{
            ...abs,
            background: `radial-gradient(ellipse ${72 * breathe(2, 0.09)}% ${66 * breathe(2.2, 0.07)}% at ${b3x}% ${b3y}%, rgba(72, 28, 140, 0.85) 0%, transparent 70%)`,
            transform: `translate(${Math.sin(t * 0.35 + 2) * 2}%, ${Math.cos(t * 0.42 + 1.5) * -1.5}%)`,
          }}
        />
        <div
          style={{
            ...abs,
            background: `radial-gradient(ellipse ${50 * breathe(3, 0.06)}% ${40 * breathe(3.5, 0.05)}% at ${b4x}% ${b4y}%, rgba(200, 140, 255, 0.55) 0%, transparent 62%)`,
            transform: `translate(${Math.sin(t * 0.28 + 3) * 1.5}%, ${Math.cos(t * 0.32 + 2) * 1}%)`,
          }}
        />
      </div>

      <div
        style={{
          ...abs,
          opacity: 0.05,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  )
}
