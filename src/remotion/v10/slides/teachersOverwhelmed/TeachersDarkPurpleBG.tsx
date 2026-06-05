/**
 * Zelios-style hero background — center purple wash, black edges, soft glow drift.
 */
import React from 'react'
import { AbsoluteFill } from 'remotion'
import { useCurrentFrame } from '@/remotion/shared/timelineFrame'

export const TEACHERS_BG_BASE = '#05020e'

export const TeachersDarkPurpleBG: React.FC = () => {
  const frame = useCurrentFrame()
  const t = frame * 0.012

  const centerPulse = 0.72 + Math.sin(t * 0.5) * 0.08
  const cornerGlow = 0.38 + Math.cos(t * 0.7 + 1) * 0.08

  return (
    <AbsoluteFill style={{ background: TEACHERS_BG_BASE, overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 82% 72% at 50% 48%, rgba(120, 45, 195, ${centerPulse}) 0%, rgba(88, 32, 155, 0.65) 22%, rgba(36, 14, 72, 0.5) 42%, rgba(8, 3, 18, 0.92) 68%, ${TEACHERS_BG_BASE} 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 38% 32% at 50% 50%, rgba(180, 90, 255, 0.22) 0%, transparent 72%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 45% 40% at 88% 12%, rgba(99, 40, 180, ${cornerGlow}) 0%, transparent 68%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 50% 38% at 12% 88%, rgba(55, 20, 110, ${cornerGlow * 0.7}) 0%, transparent 65%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 95% 82% at 50% 50%, transparent 28%, rgba(0, 0, 0, 0.78) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  )
}
