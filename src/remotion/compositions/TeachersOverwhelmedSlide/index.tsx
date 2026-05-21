/**
 * Slide 3 — Typing headline + balanced scattered cards → highlight → smooth exit.
 */
import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { loadFont } from '@remotion/google-fonts/Inter'
import { TypingHeadline } from './TypingHeadline'

const { fontFamily: interFont } = loadFont('normal', {
  weights: ['500', '700'],
  subsets: ['latin'],
})
import { ScatteredCards } from './ScatteredCards'
import {
  BG_LIGHT,
  SCENE_DURATION,
  SCENE_CONTENT_IN,
} from './constants'
import {
  sceneCloseBlur,
  sceneCloseDriftY,
  sceneCloseOpacity,
  sceneCloseProgress,
  sceneCloseScale,
} from './sceneClose'

export { SCENE_DURATION as TEACHERS_OVERWHELMED_DURATION }

export const TeachersOverwhelmedSlide: React.FC = () => {
  const frame = useCurrentFrame()

  const contentIn = interpolate(frame, [0, SCENE_CONTENT_IN], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const closeOpacity = sceneCloseOpacity(frame)
  const contentOpacity = contentIn * closeOpacity
  const closeScale = sceneCloseScale(frame)
  const closeBlur = sceneCloseBlur(frame)
  const closeDriftY = sceneCloseDriftY(frame)
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
        <ScatteredCards />
        <TypingHeadline fontFamily={interFont} />
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

export default TeachersOverwhelmedSlide
