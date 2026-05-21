/**
 * Numera-style blue gradient — light top-left → saturated bottom-right.
 */
import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'

export const BlueMeetBackground: React.FC = () => {
  const frame = useCurrentFrame()

  const breathe = interpolate(
    Math.sin((frame / 30) * 0.4) * 0.5 + 0.5,
    [0, 1],
    [0.96, 1.04],
  )

  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#E6F2FF' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            linear-gradient(128deg,
              #F4FAFF 0%,
              #D6EBFF 28%,
              #8FC0F5 58%,
              #3B82F6 82%,
              #2563EB 100%)
          `,
          transform: `scale(${breathe})`,
          transformOrigin: '50% 45%',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 80% 60% at 72% 78%,
            rgba(37, 99, 235, 0.45) 0%, transparent 62%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 55% 45% at 18% 22%,
            rgba(255, 255, 255, 0.75) 0%, transparent 58%)`,
        }}
      />
    </AbsoluteFill>
  )
}
