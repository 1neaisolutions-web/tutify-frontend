/**
 * V6 Teaching intro — warm mesh + staggered cinematic exit.
 */
import React from 'react'
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion'
import { BackgroundGradient } from '../../compositions/TeachingIntro/BackgroundGradient'
import { BlurTextV6, EXIT_START_FRAME, TEACHING_INTRO_V6_DURATION } from './BlurTextV6'

export { TEACHING_INTRO_V6_DURATION, EXIT_START_FRAME } from './BlurTextV6'

const TeachingIntroV6: React.FC = () => {
  const frame = useCurrentFrame()

  const bgDim = interpolate(
    frame,
    [EXIT_START_FRAME, TEACHING_INTRO_V6_DURATION - 6],
    [1, 0.55],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.cubic),
    },
  )

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <AbsoluteFill style={{ opacity: bgDim }}>
        <BackgroundGradient />
      </AbsoluteFill>
      <BlurTextV6 />
    </AbsoluteFill>
  )
}

export default TeachingIntroV6
export { TeachingIntroV6 }
