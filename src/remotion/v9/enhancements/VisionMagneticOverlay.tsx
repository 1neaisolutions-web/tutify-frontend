/**
 * V9 Vision — magnetic pill attraction shimmer during value pill beat.
 */
import React from 'react'
import { AbsoluteFill, interpolate } from 'remotion'
import { useCurrentFrame } from '@/remotion/shared/timelineFrame'

export const VisionMagneticOverlay: React.FC = () => {
  const frame = useCurrentFrame()
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.18)

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 25 }}>
      {[0, 1, 2].map((i) => {
        const x = 640 + i * 220
        const y = 900
        const pull = interpolate(frame, [120 + i * 8, 160 + i * 8], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: 'rgba(91,79,207,0.55)',
              transform: `translate(${pull * 18}px, ${-pull * 24}px) scale(${0.8 + pulse * 0.2})`,
              boxShadow: '0 0 20px rgba(91,79,207,0.35)',
              opacity: pull * 0.7,
            }}
          />
        )
      })}
    </AbsoluteFill>
  )
}
