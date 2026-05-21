/**
 * Scenes 1–3 only — same timeline, crossfades, music & SFX as TutifyDemoV4 opening.
 * Scene 1: Teaching Intro · Scene 2: Education · Scene 3: Teachers Overwhelmed
 */
import React from 'react'
import { AbsoluteFill, Audio, Sequence, interpolate } from 'remotion'

import TeachingIntro, { TEACHING_INTRO_DURATION } from './scenes/TeachingIntro/TeachingIntro'
import EducationChangingSlide, {
  EDUCATION_SLIDE_DURATION,
} from '../compositions/EducationChangingSlide'
import { Scene01_Problem, SCENE01_DURATION } from './scenes/Scene01_Problem'
import { MUSIC_V4, SFX_V4 } from './assets'

const CROSSFADE = 24

const S0 = 0
const S1 = S0 + TEACHING_INTRO_DURATION // 180
const S2 = S1 + EDUCATION_SLIDE_DURATION // 390
const S3 = S2 - CROSSFADE // 366
const S_END = S3 + SCENE01_DURATION // 651

export const TOTAL_DURATION_SCENES_123 = S_END

const musicVol = (f: number): number => {
  let level: number
  if (f < S1) level = 0.05
  else if (f < S2) level = 0.06
  else level = 0.08

  const fadeIn = interpolate(f, [0, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const fadeOut = interpolate(f, [S_END - 60, S_END], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  return level * fadeIn * fadeOut
}

export const TutifyScenes123: React.FC = () => (
  <AbsoluteFill style={{ background: '#F4F6F8' }}>
    <Audio src={MUSIC_V4} volume={(f) => musicVol(f)} />

    <Sequence from={S0} durationInFrames={TEACHING_INTRO_DURATION}>
      <TeachingIntro />
    </Sequence>

    <Sequence from={S1} durationInFrames={EDUCATION_SLIDE_DURATION}>
      <EducationChangingSlide />
    </Sequence>

    <Sequence from={S3} durationInFrames={SCENE01_DURATION} premountFor={CROSSFADE}>
      <Sequence from={78}><Audio src={SFX_V4.thud} volume={0.18} /></Sequence>
      <Sequence from={88}><Audio src={SFX_V4.thud} volume={0.17} /></Sequence>
      <Sequence from={98}><Audio src={SFX_V4.thud} volume={0.18} /></Sequence>
      <Sequence from={108}><Audio src={SFX_V4.thud} volume={0.19} /></Sequence>
      <Sequence from={118}><Audio src={SFX_V4.thud} volume={0.2} /></Sequence>
      <Sequence from={128}><Audio src={SFX_V4.thud} volume={0.2} /></Sequence>
      <Sequence from={158}><Audio src={SFX_V4.sparkle} volume={0.26} /></Sequence>
      <Sequence from={188}><Audio src={SFX_V4.pileSettle} volume={0.2} /></Sequence>
      <Scene01_Problem />
    </Sequence>
  </AbsoluteFill>
)
