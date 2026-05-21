/**
 * TeachingIntro — 1920×1080 · 30fps · 180 frames (6s).
 * "The Reality of Teaching Today" — per-letter blur reveal + mesh exit.
 */
import React from 'react'
import { AbsoluteFill } from 'remotion'
import { BackgroundGradient } from './BackgroundGradient'
import { BlurText, TEACHING_INTRO_DURATION } from './BlurText'

export { TEACHING_INTRO_DURATION, EXIT_START_FRAME, REVEAL_COMPLETE_FRAME } from './BlurText'

const TeachingIntro: React.FC = () => (
  <AbsoluteFill style={{ overflow: 'hidden' }}>
    <BackgroundGradient />
    <BlurText />
  </AbsoluteFill>
)

export default TeachingIntro
export { TeachingIntro }
