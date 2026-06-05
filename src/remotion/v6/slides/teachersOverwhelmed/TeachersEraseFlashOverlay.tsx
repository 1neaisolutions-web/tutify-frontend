/**
 * In-scene flash when typing erase completes (V6 / scaled V9 problem slide).
 */
import React from 'react'
import { AbsoluteFill } from 'remotion'
import { useCurrentFrame } from '@/remotion/shared/timelineFrame'

import { teachersEraseFlashOpacity } from '../../../compositions/TeachersOverwhelmedSlide/teachersEraseFlash'

export const TeachersEraseFlashOverlay: React.FC = () => {
  const frame = useCurrentFrame()
  const core = teachersEraseFlashOpacity(frame)

  if (core < 0.02) return null

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 45 }}>
      <AbsoluteFill style={{ background: `rgba(255,255,255,${core * 0.92})` }} />
      <AbsoluteFill
        style={{
          opacity: core * 0.5,
          background:
            'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(255,255,255,0.85) 0%, transparent 68%)',
        }}
      />
    </AbsoluteFill>
  )
}
