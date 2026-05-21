/**
 * Closing backgrounds — Numera-style sky (ref 2–3), light vignette, black finale.
 */
import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'

/** Saturated sky blue — white headline must read clearly (not white-on-white) */
export const ClosingSkyBackground: React.FC = () => {
  const frame = useCurrentFrame()
  const breathe = interpolate(
    Math.sin((frame / 30) * 0.38) * 0.5 + 0.5,
    [0, 1],
    [0.98, 1.02],
  )

  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#C5DEF5' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            linear-gradient(145deg,
              #E8F4FF 0%,
              #B8D9F8 22%,
              #7EB8F0 48%,
              #4A9AE8 72%,
              #2B7FD4 100%)`,
          transform: `scale(${breathe})`,
          transformOrigin: '50% 44%',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 70% 55% at 50% 42%,
            rgba(255,255,255,0.28) 0%, transparent 62%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 90% 70% at 80% 85%,
            rgba(37, 99, 235, 0.22) 0%, transparent 55%)`,
        }}
      />
    </AbsoluteFill>
  )
}

/** Brighter centre for black “already here” headline */
export const ClosingLightBackground: React.FC = () => (
  <AbsoluteFill style={{ overflow: 'hidden', background: '#D8EBFA' }}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(160deg,
          #F0F8FF 0%,
          #D0E8FA 35%,
          #8FC0F5 70%,
          #5B9FEB 100%)`,
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(ellipse 85% 70% at 50% 48%,
          rgba(255,255,255,0.55) 0%, transparent 65%)`,
      }}
    />
  </AbsoluteFill>
)

export const ClosingBlackBackground: React.FC = () => (
  <AbsoluteFill style={{ background: '#000000' }} />
)
