/**
 * Vision stage — calm slate base with soft brand light (no heavy yellow wash).
 */
import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'

export const VisionBackground: React.FC = () => {
  const frame = useCurrentFrame()

  const rise = interpolate(frame, [0, 36], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const drift = Math.sin((frame / 30) * 0.4) * 0.5 + 0.5

  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#F1F5F9' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(165deg,
            #F8FAFC 0%,
            #F1F5F9 38%,
            #EEF2FF 72%,
            #F8FAFC 100%)`,
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 75% 55% at ${48 + drift * 4}% ${42 + drift * 3}%,
            rgba(91, 79, 207, ${(0.14 * rise).toFixed(3)}) 0%,
            transparent 68%)`,
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 60% 45% at 50% 55%,
            rgba(255, 255, 255, ${(0.72 * rise).toFixed(3)}) 0%,
            transparent 70%)`,
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: '18%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '42%',
          height: 1,
          background: `linear-gradient(90deg, transparent, rgba(91,79,207,${(0.35 * rise).toFixed(3)}), transparent)`,
        }}
      />
    </AbsoluteFill>
  )
}
