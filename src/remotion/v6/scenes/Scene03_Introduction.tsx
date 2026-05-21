/**
 * Scene 04 — Meet Tutify (Numera-style) + ecosystem tagline.
 */
import React from 'react'
import { AbsoluteFill, Easing, useCurrentFrame, interpolate } from 'remotion'
import { loadFont } from '@remotion/google-fonts/Inter'
import { BlueMeetBackground, MEET_BG_EDGE } from './IntroScene/BlueMeetBackground'
import { MeetHeroBuild } from './IntroScene/MeetHeroBuild'
import { MeetTutifyLockup } from './IntroScene/MeetTutifyLockup'
import { EcosystemLine } from './IntroScene/EcosystemLine'
import { INTRO_SCENE_DURATION, SCENE_FADE_OUT } from './IntroScene/constants'

const { fontFamily: interFont } = loadFont('normal', {
  weights: ['500', '700', '800'],
  subsets: ['latin'],
})

import { SCENE03_DURATION as SCENE03_TARGET } from '../timeline/sceneDurations'

export const SCENE03_DURATION = Math.max(SCENE03_TARGET, INTRO_SCENE_DURATION)

export const Scene03_Introduction: React.FC = () => {
  const frame = useCurrentFrame()

  const fadeIn = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  const contentFade = interpolate(frame, [SCENE_FADE_OUT, INTRO_SCENE_DURATION], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  })

  const bgFade = interpolate(frame, [SCENE_FADE_OUT + 6, INTRO_SCENE_DURATION], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  })

  const sceneExitP = interpolate(frame, [SCENE_FADE_OUT - 4, INTRO_SCENE_DURATION - 4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  })

  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: MEET_BG_EDGE }}>
      <AbsoluteFill style={{ opacity: fadeIn * bgFade }}>
        <BlueMeetBackground />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          opacity: fadeIn * contentFade,
          transform: `scale(${interpolate(sceneExitP, [0, 1], [1, 1.04])})`,
          transformOrigin: '54% 44%',
        }}
      >
        <MeetHeroBuild fontFamily={interFont} opacity={1} />
        <MeetTutifyLockup fontFamily={interFont} opacity={1} />
        <EcosystemLine fontFamily={interFont} opacity={1} />
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
