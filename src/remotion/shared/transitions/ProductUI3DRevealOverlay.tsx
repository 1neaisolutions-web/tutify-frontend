/**
 * Ambient purple wash during product UI 3D reveal handoffs.
 */
import React from 'react'
import { AbsoluteFill } from 'remotion'

type Props = {
  opacity: number
}

export const ProductUI3DRevealOverlay: React.FC<Props> = ({ opacity }) => {
  if (opacity < 0.02) return null

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 120 }}>
      <AbsoluteFill
        style={{
          opacity,
          background: `
            radial-gradient(ellipse 70% 55% at 18% 88%, rgba(139, 92, 246, 0.42) 0%, transparent 58%),
            radial-gradient(ellipse 55% 45% at 82% 22%, rgba(167, 139, 250, 0.28) 0%, transparent 52%)
          `,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: opacity * 0.35,
          background:
            'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.22) 0%, transparent 48%)',
        }}
      />
    </AbsoluteFill>
  )
}
