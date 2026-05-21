/**
 * TutifyDemoV6 — Premium V4 evolution (light theme, unified pacing, eased motion).
 * Durations: timeline/sceneDurations.ts · Transitions: utils/sceneTransition.ts
 */
import React from 'react'
import { AbsoluteFill, Audio, Loop, Sequence, interpolate } from 'remotion'

import TeachingIntro, { TEACHING_INTRO_DURATION } from './scenes/TeachingIntro/TeachingIntro'
import EducationChangingSlide, {
  EDUCATION_SLIDE_V6_DURATION as EDUCATION_SLIDE_DURATION,
} from './opening/EducationChangingSlideV6'
import { OPENING_HANDOFF } from './opening/constants'
import { OpeningHandoffOverlay } from './opening/OpeningHandoffOverlay'
import { Scene01_Problem, SCENE01_DURATION } from './scenes/Scene01_Problem'
import { Scene02_Vision } from './scenes/Scene02_Vision'
import { Scene03_Introduction } from './scenes/Scene03_Introduction'
import { Scene04_AITeacherIntro } from './scenes/Scene04_AITeacherIntro'
import {
  Scene04_AIAssistant,
  SCENE04_SFX_FRAMES,
  SCENE04_DURATION,
} from './scenes/Scene04_AIAssistant'
import {
  Scene05_ImageStudioIntro,
  SCENE_IMAGE_STUDIO_INTRO_DURATION,
} from './scenes/Scene05_ImageStudioIntro'
import {
  Scene05_VisualStudio,
  SCENE05_DURATION,
  SCENE05_SFX_FRAMES,
} from './scenes/Scene05_VisualStudio'
import {
  Scene06_YouTubeStudioIntro,
  SCENE_YOUTUBE_STUDIO_INTRO_DURATION,
} from './scenes/Scene06_YouTubeStudioIntro'
import { Scene06_YouTube, SCENE06_DURATION } from './scenes/Scene06_YouTube'
import { Scene07_PersonalizationIntro } from './scenes/Scene07_PersonalizationIntro'
import { Scene07_Personalization } from './scenes/Scene07_Personalization'
import {
  Scene07b_LearningHub,
  SCENE07B_DURATION,
  QUIZ_START,
  QUIZ_SUBMIT,
  CERT_START,
} from './scenes/Scene07b_LearningHub'
import { Scene08_Ecosystem } from './scenes/Scene08_Ecosystem'
import { Scene10_Closing } from './scenes/Scene10_Closing'
import { FINALE_TYPE_START } from './scenes/ClosingScene/constants'

import {
  SCENE02_DURATION,
  SCENE03_DURATION,
  SCENE07_DURATION,
  SCENE07_INTRO_DURATION,
  SCENE08_DURATION,
  SCENE_AI_TEACHER_INTRO_DURATION,
} from './timeline/sceneDurations'
import { SCENE10_DURATION } from './scenes/Scene10_Closing'

import { AnimatedGradientBG } from './components/AnimatedGradientBG'
import { KEYBOARD_SFX_LOOP_FRAMES, MUSIC_V4, SFX_V4 } from './assets'
import { CROSSFADE, musicLevelAt } from './utils/sceneTransition'

const S0 = 0
const S1 = S0 + TEACHING_INTRO_DURATION - OPENING_HANDOFF
const S2 = S1 + EDUCATION_SLIDE_DURATION - CROSSFADE
const S3 = S2 - CROSSFADE
const S4 = S3 + SCENE01_DURATION - CROSSFADE
const S5 = S4 + SCENE02_DURATION - CROSSFADE
const S6 = S5 + SCENE03_DURATION - CROSSFADE
const S6b = S6 + SCENE_AI_TEACHER_INTRO_DURATION - CROSSFADE
const S7 = S6b + SCENE04_DURATION - CROSSFADE
const S7b = S7 + SCENE_IMAGE_STUDIO_INTRO_DURATION - CROSSFADE
const S8 = S7b + SCENE05_DURATION - CROSSFADE
const S9 = S8 + SCENE_YOUTUBE_STUDIO_INTRO_DURATION - CROSSFADE
const S9_QUIZ_END = S9 + SCENE06_DURATION
const S10 = S9_QUIZ_END - CROSSFADE
const S10b = S10 + SCENE07_INTRO_DURATION - CROSSFADE
const S11 = S10b + SCENE07_DURATION - CROSSFADE
const S11b = S11 + SCENE07B_DURATION - CROSSFADE
const S12 = S11b + SCENE08_DURATION - CROSSFADE

export const TOTAL_DURATION_V6 = S12 + SCENE10_DURATION

const musicVol = (f: number): number => {
  const level = musicLevelAt(f, [
    { at: 0, level: 0.05 },
    { at: S1, level: 0.06 },
    { at: S4, level: 0.08 },
    { at: S5, level: 0.1 },
    { at: S6, level: 0.12 },
    { at: S6b, level: 0.13 },
    { at: S7, level: 0.15 },
    { at: S7b, level: 0.14 },
    { at: S8, level: 0.135 },
    { at: S9, level: 0.13 },
    { at: S10, level: 0.14 },
    { at: S10b, level: 0.145 },
    { at: S11, level: 0.155 },
    { at: S11b, level: 0.15 },
    { at: S12, level: 0.15 },
    { at: TOTAL_DURATION_V6, level: 0.11 },
  ])

  const fadeIn = interpolate(f, [0, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const fadeOut = interpolate(f, [TOTAL_DURATION_V6 - 90, TOTAL_DURATION_V6], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  return level * fadeIn * fadeOut
}

export const TutifyDemoV6: React.FC = () => (
  <AbsoluteFill style={{ background: '#F4F6F8' }}>
    <Sequence from={S4 - CROSSFADE}>
      <AnimatedGradientBG variant="cool" />
    </Sequence>

    <Audio src={MUSIC_V4} volume={(f) => musicVol(f)} loop />

    <Sequence from={S0} durationInFrames={TEACHING_INTRO_DURATION} premountFor={OPENING_HANDOFF}>
      <TeachingIntro />
    </Sequence>

    <Sequence from={S1} durationInFrames={EDUCATION_SLIDE_DURATION + OPENING_HANDOFF} premountFor={OPENING_HANDOFF}>
      <EducationChangingSlide />
    </Sequence>

    <Sequence from={S1} durationInFrames={OPENING_HANDOFF * 2}>
      <OpeningHandoffOverlay />
    </Sequence>

    <Sequence from={S3} durationInFrames={SCENE01_DURATION} premountFor={CROSSFADE}>
      <Scene01_Problem />
    </Sequence>

    <Sequence from={S4} durationInFrames={SCENE02_DURATION} premountFor={CROSSFADE}>
      <Scene02_Vision />
    </Sequence>

    <Sequence
      from={S5}
      durationInFrames={SCENE03_DURATION}
      premountFor={CROSSFADE}
      style={{ backgroundColor: '#1D4ED8' }}
    >
      <Scene03_Introduction />
    </Sequence>

    <Sequence from={S6} durationInFrames={SCENE_AI_TEACHER_INTRO_DURATION} premountFor={CROSSFADE}>
      <Scene04_AITeacherIntro />
    </Sequence>

    <Sequence from={S6b} durationInFrames={SCENE04_DURATION} premountFor={CROSSFADE}>
      <Sequence
        from={SCENE04_SFX_FRAMES.keyboardTyping.start}
        durationInFrames={SCENE04_SFX_FRAMES.keyboardTyping.duration}
      >
        <Loop durationInFrames={KEYBOARD_SFX_LOOP_FRAMES}>
          <Audio src={SFX_V4.keyboard} volume={0.3} />
        </Loop>
      </Sequence>
      {SCENE04_SFX_FRAMES.cardAppear.map((at, i) => (
        <Sequence key={`s4-card-${i}`} from={at}>
          <Audio src={SFX_V4.cardAppear} volume={0.3} />
        </Sequence>
      ))}
      <Scene04_AIAssistant />
    </Sequence>

    <Sequence from={S7} durationInFrames={SCENE_IMAGE_STUDIO_INTRO_DURATION} premountFor={CROSSFADE}>
      <Scene05_ImageStudioIntro />
    </Sequence>

    <Sequence from={S7b} durationInFrames={SCENE05_DURATION} premountFor={CROSSFADE}>
      {SCENE05_SFX_FRAMES.keyboardTyping.map((seg, i) => (
        <Sequence key={`s5-kbd-${i}`} from={seg.start} durationInFrames={seg.duration}>
          <Loop durationInFrames={KEYBOARD_SFX_LOOP_FRAMES}>
            <Audio src={SFX_V4.keyboard} volume={0.3} />
          </Loop>
        </Sequence>
      ))}
      <Scene05_VisualStudio />
    </Sequence>

    <Sequence from={S8} durationInFrames={SCENE_YOUTUBE_STUDIO_INTRO_DURATION} premountFor={CROSSFADE}>
      <Scene06_YouTubeStudioIntro />
    </Sequence>

    <Sequence from={S9} durationInFrames={SCENE06_DURATION} premountFor={CROSSFADE}>
      <Scene06_YouTube />
    </Sequence>

    <Sequence from={S10} durationInFrames={SCENE07_INTRO_DURATION} premountFor={CROSSFADE}>
      <Scene07_PersonalizationIntro />
    </Sequence>

    <Sequence from={S10b} durationInFrames={SCENE07_DURATION} premountFor={CROSSFADE}>
      <Scene07_Personalization />
    </Sequence>

    <Sequence from={S11} durationInFrames={SCENE07B_DURATION} premountFor={CROSSFADE}>
      <Sequence from={QUIZ_START + 16}><Audio src={SFX_V4.dataPing} volume={0.22} /></Sequence>
      <Sequence from={QUIZ_SUBMIT}><Audio src={SFX_V4.completion} volume={0.32} /></Sequence>
      <Sequence from={CERT_START}><Audio src={SFX_V4.sparkle} volume={0.36} /></Sequence>
      <Scene07b_LearningHub />
    </Sequence>

    <Sequence from={S11b} durationInFrames={SCENE08_DURATION} premountFor={CROSSFADE}>
      <Sequence from={14}><Audio src={SFX_V4.sparkle} volume={0.32} /></Sequence>
      <Sequence from={262}><Audio src={SFX_V4.dataPing} volume={0.26} /></Sequence>
      <Sequence from={280}><Audio src={SFX_V4.dataPing} volume={0.26} /></Sequence>
      <Sequence from={298}><Audio src={SFX_V4.dataPing} volume={0.26} /></Sequence>
      <Sequence from={316}><Audio src={SFX_V4.dataPing} volume={0.26} /></Sequence>
      <Sequence from={334}><Audio src={SFX_V4.dataPing} volume={0.26} /></Sequence>
      <Sequence from={400}><Audio src={SFX_V4.sparkle} volume={0.34} /></Sequence>
      <Scene08_Ecosystem />
    </Sequence>

    <Sequence from={S12} durationInFrames={SCENE10_DURATION} premountFor={CROSSFADE}>
      <Sequence from={132}><Audio src={SFX_V4.sparkle} volume={0.34} /></Sequence>
      <Sequence from={210}><Audio src={SFX_V4.completion} volume={0.4} /></Sequence>
      <Sequence from={FINALE_TYPE_START}><Audio src={SFX_V4.keyboard} volume={0.22} /></Sequence>
      <Scene10_Closing />
    </Sequence>
  </AbsoluteFill>
)
