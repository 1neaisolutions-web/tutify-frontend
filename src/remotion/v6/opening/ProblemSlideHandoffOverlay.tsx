/**
 * Directional light sweep when Education exits into Teachers Overwhelmed.
 */
import React from 'react'
import { AbsoluteFill } from 'remotion'import { useCurrentFrame } from '@/remotion/shared/timelineFrame'

import { problemHandoffOverlay } from './problemHandoff'

export const ProblemSlideHandoffOverlay: React.FC = () => {
  const frame = useCurrentFrame()
  const { sweepX, sweepOpacity, flash, vignette } = problemHandoffOverlay(frame)

  if (sweepOpacity < 0.02 && flash < 0.02 && vignette < 0.02) return null

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 24 }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 90% 70% at 50% 50%, rgba(255,255,255,${flash}) 0%, transparent 72%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: `inset 0 0 120px rgba(15, 23, 42, ${vignette})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '-8%',
          bottom: '-8%',
          left: `${sweepX}%`,
          width: '34%',
          opacity: sweepOpacity,
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.72) 42%, rgba(147,197,253,0.45) 68%, transparent 100%)',
          filter: 'blur(22px)',
          transform: 'skewX(-14deg)',
        }}
      />
    </AbsoluteFill>
  )
}
