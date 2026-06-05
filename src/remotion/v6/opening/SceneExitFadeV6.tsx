import React from 'react'
import { AbsoluteFill, Easing, interpolate } from 'remotion'
import { useCurrentFrame } from '@/remotion/shared/timelineFrame'

import { OPENING_HANDOFF } from './constants'
import { EDUCATION_SLIDE_V6_DURATION } from './LineWordRevealV6'
import { STAGE_BG } from './educationStageTheme'

const BG_LIGHT = '#F4F6F8'
const EXIT_FRAMES = 8
const SEQUENCE_END = EDUCATION_SLIDE_V6_DURATION + OPENING_HANDOFF
const ease = Easing.inOut(Easing.cubic)

/** Hold dark stage; tail scales down into light Teachers slide underneath. */
export const SceneExitFadeV6: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame()

  const fade = interpolate(
    frame,
    [SEQUENCE_END - EXIT_FRAMES, SEQUENCE_END],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease },
  )

  const stageScale = interpolate(fade, [0, 1], [0.97, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const stageY = interpolate(fade, [0, 1], [18, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AbsoluteFill style={{ background: BG_LIGHT, opacity: 1 - fade }} />
      <AbsoluteFill
        style={{
          background: STAGE_BG,
          opacity: fade,
          transform: `translateY(${stageY}px) scale(${stageScale})`,
          transformOrigin: 'center center',
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
