/**
 * V9 opening — cinematic parallax depth + subtle DOF vignette.
 */
import React from 'react'
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion'

export const OpeningDepthOverlay: React.FC = () => {
  const frame = useCurrentFrame()
  const drift = Math.sin(frame * 0.04) * 12
  const depth = interpolate(frame, [0, 90], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 40 }}>
      <div
        style={{
          position: 'absolute',
          inset: -40,
          background: `radial-gradient(ellipse 55% 45% at ${48 + drift * 0.08}% ${42 + drift * 0.05}%, rgba(37,99,235,${0.08 * depth}), transparent 70%)`,
          transform: `translate(${drift}px, ${drift * 0.35}px) scale(${1 + depth * 0.02})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: `inset 0 0 ${80 + depth * 40}px rgba(15,23,42,${0.12 * depth})`,
        }}
      />
    </AbsoluteFill>
  )
}
