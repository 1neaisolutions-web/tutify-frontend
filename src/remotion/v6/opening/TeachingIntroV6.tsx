/**
 * V6 Teaching intro — warm mesh + pixelate dissolve into Education slide.
 */
import React from 'react'
import { AbsoluteFill, Easing, interpolate } from 'remotion'
import { useCurrentFrame } from '@/remotion/shared/timelineFrame'
import { PixelateWrap } from '@/remotion/shared/PixelateWrap'

import { BackgroundGradient } from '../../compositions/TeachingIntro/BackgroundGradient'
import {
  BlurTextV6,
  PIXELATE_DURATION,
  PIXELATE_START_FRAME,
  TEACHING_INTRO_V6_DURATION,
} from './BlurTextV6'

export {
  TEACHING_INTRO_V6_DURATION,
  EXIT_START_FRAME,
  PIXELATE_START_FRAME,
  PIXELATE_DURATION,
  REVEAL_COMPLETE_FRAME,
} from './BlurTextV6'

const TeachingIntroV6: React.FC = () => {
  const frame = useCurrentFrame()

  const pixelProgress = interpolate(
    frame,
    [PIXELATE_START_FRAME, PIXELATE_START_FRAME + PIXELATE_DURATION],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.in(Easing.cubic),
    },
  )

  const blockSize = interpolate(pixelProgress, [0, 0.35, 1], [1, 6, 64], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const sceneOpacity = interpolate(
    frame,
    [PIXELATE_START_FRAME + PIXELATE_DURATION * 0.5, TEACHING_INTRO_V6_DURATION],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.in(Easing.cubic),
    },
  )

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <PixelateWrap blockSize={blockSize} opacity={sceneOpacity}>
        <BackgroundGradient />
        <BlurTextV6 />
      </PixelateWrap>
    </AbsoluteFill>
  )
}

export default TeachingIntroV6
export { TeachingIntroV6 }
