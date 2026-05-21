/**
 * V6 — warm→blue wash + specular sweep during Teaching ↔ Education overlap.
 */
import React from 'react'
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion'
import { OPENING_HANDOFF, HANDOFF_LIGHT_SWEEP_AT } from './constants'

const ease = Easing.inOut(Easing.cubic)

export const OpeningHandoffOverlay: React.FC = () => {
  const frame = useCurrentFrame()
  const mid = OPENING_HANDOFF

  const morph = interpolate(frame, [0, mid, OPENING_HANDOFF * 2], [0, 0.55, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  })

  const warmWash = interpolate(morph, [0, 0.5, 1], [0.42, 0.18, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const coolWash = interpolate(morph, [0, 0.45, 1], [0, 0.22, 0.08], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const overlayFade = interpolate(
    frame,
    [OPENING_HANDOFF, OPENING_HANDOFF * 2 - 2],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease },
  )

  const sweepT = interpolate(
    frame,
    [HANDOFF_LIGHT_SWEEP_AT - 6, HANDOFF_LIGHT_SWEEP_AT + 22],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease },
  )
  const sweepX = interpolate(sweepT, [0, 1], [-18, 118])

  const sweepOpacity = interpolate(sweepT, [0, 0.35, 0.7, 1], [0, 0.85, 0.55, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 20, opacity: overlayFade }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 80% 70% at 42% 58%, rgba(180, 20, 72, ${warmWash * 0.55}) 0%, transparent 68%),
            radial-gradient(ellipse 75% 65% at 62% 42%, rgba(255, 120, 32, ${warmWash * 0.45}) 0%, transparent 65%)
          `,
          mixBlendMode: 'screen',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 90% 75% at 50% 105%, rgba(10, 42, 107, ${coolWash * 0.9}) 0%, transparent 58%),
            linear-gradient(180deg, transparent 0%, rgba(30, 79, 184, ${coolWash * 0.35}) 100%)
          `,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${sweepX}%`,
          width: '22%',
          opacity: sweepOpacity,
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 48%, rgba(168,208,255,0.35) 72%, transparent 100%)',
          filter: 'blur(28px)',
          transform: 'skewX(-12deg)',
        }}
      />
    </AbsoluteFill>
  )
}
