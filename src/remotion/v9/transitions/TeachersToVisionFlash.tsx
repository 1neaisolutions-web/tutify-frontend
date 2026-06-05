/**
 * Full-frame white flash when Teachers headline erase completes → Vision chapter.
 */
import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'

import { teachersEraseFlashSequenceOpacity } from '../../compositions/TeachersOverwhelmedSlide/teachersEraseFlash'

type Props = {
  durationInFrames: number
}

export const TeachersToVisionFlash: React.FC<Props> = ({ durationInFrames }) => {
  const frame = useCurrentFrame()
  const core = teachersEraseFlashSequenceOpacity(frame, durationInFrames)

  if (core < 0.02) return null

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 80 }}>
      <AbsoluteFill
        style={{
          background: `rgba(255,255,255,${core * 0.94})`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: core * 0.55,
          background:
            'radial-gradient(ellipse 88% 72% at 50% 48%, rgba(255,255,255,0.9) 0%, rgba(191,219,254,0.35) 42%, transparent 70%)',
        }}
      />
    </AbsoluteFill>
  )
}
