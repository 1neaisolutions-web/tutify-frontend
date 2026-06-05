/**
 * V10 — Teachers overwhelmed slide (color-reveal headline).
 */
import React from 'react'
import { AbsoluteFill, interpolate } from 'remotion'
import { useCurrentFrame } from '@/remotion/shared/timelineFrame'

import { loadFont } from '@remotion/google-fonts/Inter'
import { SCENE_CONTENT_IN, SCENE_DURATION } from '../../../compositions/TeachersOverwhelmedSlide/constants'
import {
  sceneCloseBlur,
  sceneCloseDriftY,
  sceneCloseOpacity,
  sceneCloseProgress,
  sceneCloseScale,
} from '../../../compositions/TeachersOverwhelmedSlide/sceneClose'
import { problemSlideEnter } from '../../../v6/opening/problemHandoff'
import { ScatteredCardsV6 } from '../../../v6/slides/teachersOverwhelmed/ScatteredCardsV6'
import { PLACEMENTS_V10, V10_LIGHT_CARD_IDS } from './placementsV10'
import { TeachersEraseFlashOverlay } from '../../../v6/slides/teachersOverwhelmed/TeachersEraseFlashOverlay'
import { TypingHeadlineV10 } from './TypingHeadlineV10'
import { TeachersDarkPurpleBG } from './TeachersDarkPurpleBG'

const { fontFamily: interFont } = loadFont('normal', {
  weights: ['500', '700'],
  subsets: ['latin'],
})

export { SCENE_DURATION as TEACHERS_OVERWHELMED_V10_DURATION }

export const TeachersOverwhelmedSlideV10: React.FC = () => {
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
    <AbsoluteFill style={{ overflow: 'hidden', opacity: bgOpacity }}>
      <TeachersDarkPurpleBG />
      <AbsoluteFill
        style={{
          opacity: contentOpacity,
          transform: `translateY(${closeDriftY}px) scale(${closeScale})`,
          filter: closeBlur > 0.25 ? `blur(${closeBlur}px)` : undefined,
        }}
      >
        <ScatteredCardsV6
          appearance="zelios"
          placements={PLACEMENTS_V10}
          blurCards={false}
          glassEffect={false}
          lightCardIds={V10_LIGHT_CARD_IDS}
          scatterScaleJitter
        />
        <TypingHeadlineV10 fontFamily={interFont} />
        <TeachersEraseFlashOverlay />
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

export default TeachersOverwhelmedSlideV10
