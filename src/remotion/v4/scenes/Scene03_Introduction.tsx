/**
 * Scene 04 — Meet Tutify (Numera-style) + ecosystem tagline.
 *
 * Act 1: M → e → e → t (hero) → zoom out → Meet · logo · Tutify + pulse
 * Act 2: "An intelligent education ecosystem designed for modern schools."
 */
import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import { loadFont } from '@remotion/google-fonts/Inter'
import { BlueMeetBackground } from './IntroScene/BlueMeetBackground'
import { MeetHeroBuild } from './IntroScene/MeetHeroBuild'
import { MeetTutifyLockup } from './IntroScene/MeetTutifyLockup'
import { EcosystemLine } from './IntroScene/EcosystemLine'
import { INTRO_SCENE_DURATION, SCENE_FADE_OUT } from './IntroScene/constants'

const { fontFamily: interFont } = loadFont('normal', {
  weights: ['500', '700', '800'],
  subsets: ['latin'],
})

export const SCENE03_DURATION = INTRO_SCENE_DURATION

export const Scene03_Introduction: React.FC = () => {
  const frame = useCurrentFrame()

  const fadeIn = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const fadeOut = interpolate(frame, [SCENE_FADE_OUT, INTRO_SCENE_DURATION], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const master = fadeIn * fadeOut

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <BlueMeetBackground />
      <AbsoluteFill style={{ opacity: master }}>
        <MeetHeroBuild fontFamily={interFont} opacity={1} />
        <MeetTutifyLockup fontFamily={interFont} opacity={1} />
        <EcosystemLine fontFamily={interFont} opacity={1} />
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
