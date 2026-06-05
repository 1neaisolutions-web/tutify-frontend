/**
 * Scene 04 — Meet Tutify (Numera-style) + ecosystem tagline.
 */
import React from 'react'
import { AbsoluteFill, Easing, interpolate } from 'remotion'
import { useCurrentFrame } from '@/remotion/shared/timelineFrame'

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

/** Floor for timeline; actual length follows IntroScene pacing. */
const SCENE03_MIN_DURATION = 320

export const SCENE03_DURATION = Math.max(SCENE03_MIN_DURATION, INTRO_SCENE_DURATION)

export const Scene03_Introduction: React.FC = () => {
  const frame = useCurrentFrame()

  const fadeIn = interpolate(frame, [0, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.33, 0, 0.18, 1),
  })

  const contentFade = interpolate(frame, [SCENE_FADE_OUT, INTRO_SCENE_DURATION], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  const bgFade = interpolate(frame, [SCENE_FADE_OUT + 10, INTRO_SCENE_DURATION], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  const sceneExitP = interpolate(frame, [SCENE_FADE_OUT - 4, INTRO_SCENE_DURATION - 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.33, 0, 0.18, 1),
  })

  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: MEET_BG_EDGE }}>
      <AbsoluteFill style={{ opacity: fadeIn * bgFade }}>
        <BlueMeetBackground />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          opacity: fadeIn * contentFade,
          transform: `scale(${interpolate(sceneExitP, [0, 1], [1, 1.012])})`,
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
