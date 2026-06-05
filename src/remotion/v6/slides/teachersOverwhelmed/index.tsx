/**
 * V6 slide 3 — Teachers overwhelmed (layered cards + typing headline).
 */
import React from 'react'
import { AbsoluteFill, interpolate } from 'remotion'
import { useCurrentFrame } from '@/remotion/shared/timelineFrame'

import { loadFont } from '@remotion/google-fonts/Inter'
import { TypingHeadline } from '../../../compositions/TeachersOverwhelmedSlide/TypingHeadline'
import {
  BG_LIGHT,
  SCENE_CONTENT_IN,
  SCENE_DURATION,
} from '../../../compositions/TeachersOverwhelmedSlide/constants'
import {
  sceneCloseBlur,
  sceneCloseDriftY,
  sceneCloseOpacity,
  sceneCloseProgress,
  sceneCloseScale,
} from '../../../compositions/TeachersOverwhelmedSlide/sceneClose'
import { problemSlideEnter } from '../../opening/problemHandoff'
import { ScatteredCardsV6 } from './ScatteredCardsV6'
import { TeachersEraseFlashOverlay } from './TeachersEraseFlashOverlay'

const { fontFamily: interFont } = loadFont('normal', {
  weights: ['500', '700'],
  subsets: ['latin'],
})

export { SCENE_DURATION as TEACHERS_OVERWHELMED_V6_DURATION }

export const TeachersOverwhelmedSlideV6: React.FC = () => {
  const frame = useCurrentFrame()

  const enter = problemSlideEnter(frame)
  const contentIn = interpolate(frame, [0, SCENE_CONTENT_IN], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const closeOpacity = sceneCloseOpacity(frame)
  const contentOpacity = contentIn * enter.opacity * closeOpacity
  const closeScale = sceneCloseScale(frame) * enter.scale
  const closeBlur = sceneCloseBlur(frame) + enter.blur
  const closeDriftY = sceneCloseDriftY(frame) + enter.translateY
  const closeT = sceneCloseProgress(frame)
  const bgOpacity = interpolate(closeT, [0, 0.45, 1], [1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: BG_LIGHT, opacity: bgOpacity }}>
      <AbsoluteFill
        style={{
          opacity: contentOpacity,
          transform: `translateY(${closeDriftY}px) scale(${closeScale})`,
          filter: closeBlur > 0.25 ? `blur(${closeBlur}px)` : undefined,
        }}
      >
        <ScatteredCardsV6 />
        <TypingHeadline fontFamily={interFont} />
        <TeachersEraseFlashOverlay />
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

export default TeachersOverwhelmedSlideV6
