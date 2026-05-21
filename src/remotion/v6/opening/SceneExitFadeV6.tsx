import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { OPENING_HANDOFF } from './constants'
import { EDUCATION_SLIDE_V6_DURATION } from './LineWordRevealV6'
import { STAGE_BG } from './educationStageTheme'

const BG_LIGHT = '#F4F6F8'
const EXIT_FRAMES = 12
const SEQUENCE_END = EDUCATION_SLIDE_V6_DURATION + OPENING_HANDOFF

/** Hold dark stage; only tail crossfades to light Teachers slide underneath. */
export const SceneExitFadeV6: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame()

  const fade = interpolate(
    frame,
    [SEQUENCE_END - EXIT_FRAMES, SEQUENCE_END],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AbsoluteFill style={{ background: BG_LIGHT, opacity: 1 - fade }} />
      <AbsoluteFill style={{ background: STAGE_BG, opacity: fade }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  )
}
