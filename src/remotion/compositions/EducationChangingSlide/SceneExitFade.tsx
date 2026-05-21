import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { EDUCATION_SLIDE_DURATION } from './LineWordReveal'
const BG_LIGHT = '#F4F6F8'

/** Must match Root.tsx overlap (premountFor / durationInFrames tail). */
const CROSSFADE = 24
const EXIT_FRAMES = 12
const SEQUENCE_END = EDUCATION_SLIDE_DURATION + CROSSFADE

/** Fade slide out on the crossfade tail — Teachers (same BG_LIGHT) is underneath. */
export const SceneExitFade: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame()

  const fade = interpolate(
    frame,
    [SEQUENCE_END - EXIT_FRAMES, SEQUENCE_END],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: BG_LIGHT, opacity: fade }}>
      {children}
    </AbsoluteFill>
  )
}
