/**
 * Image Studio intro — title + cumulative copy, then handoff to PixGen UI demo.
 */
import React from 'react'
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion'
import { loadFont } from '@remotion/google-fonts/Inter'
import { ImageStudioCopy } from './ImageStudioIntro/ImageStudioCopy'
import {
  SCENE_IMAGE_STUDIO_INTRO_DURATION,
  SCENE_FADE_START,
} from './ImageStudioIntro/constants'
import { CROSSFADE } from '../utils/sceneTransition'

export { SCENE_IMAGE_STUDIO_INTRO_DURATION }

const { fontFamily } = loadFont('normal', {
  weights: ['500', '700', '800'],
  subsets: ['latin'],
})

export const Scene05_ImageStudioIntro: React.FC = () => {
  const frame = useCurrentFrame()

  const delayedIn = interpolate(frame, [CROSSFADE, CROSSFADE + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  const sceneIn = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  const sceneOut = interpolate(
    frame,
    [SCENE_FADE_START, SCENE_IMAGE_STUDIO_INTRO_DURATION],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.cubic),
    },
  )

  const fg = delayedIn * sceneIn * sceneOut

  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: '#FFFFFF' }}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(13, 148, 136, 0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <AbsoluteFill style={{ opacity: fg }}>
        <ImageStudioCopy fontFamily={fontFamily} />
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
