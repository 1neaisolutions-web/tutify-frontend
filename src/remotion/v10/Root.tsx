/**
 * TutifyDemoV10 — V9 storyboard + scene pacing; transitions run ~2× slower.
 */
import React from 'react'
import { AbsoluteFill, Audio, Easing, Loop, Sequence, interpolate, useCurrentFrame } from 'remotion'

import TeachingIntro, { TEACHING_INTRO_DURATION } from '../v6/scenes/TeachingIntro/TeachingIntro'
import EducationChangingSlide, {
  EDUCATION_SLIDE_V6_DURATION as EDUCATION_SLIDE_DURATION,
} from '../v6/opening/EducationChangingSlideV6'
import { OPENING_HANDOFF } from '../v6/opening/constants'
import { OpeningHandoffOverlay } from '../v6/opening/OpeningHandoffOverlay'
import { ProblemSlideHandoffOverlay } from '../v6/opening/ProblemSlideHandoffOverlay'
import { PROBLEM_HANDOFF_FRAMES } from '../v6/opening/problemHandoff'
import { Scene01_Problem, SCENE01_DURATION } from './scenes/Scene01_Problem'
import { Scene02_Vision } from '../v6/scenes/Scene02_Vision'
import { Scene03_Introduction } from '../v6/scenes/Scene03_Introduction'
import { Scene04_AITeacherIntro } from '../v6/scenes/Scene04_AITeacherIntro'
import {
  Scene04_AIAssistant,
  SCENE04_SFX_FRAMES,
  SCENE04_DURATION,
} from '../v6/scenes/Scene04_AIAssistant'
import {
  Scene05_ImageStudioIntro,
  SCENE_IMAGE_STUDIO_INTRO_DURATION,
} from '../v6/scenes/Scene05_ImageStudioIntro'
import {
  Scene05_VisualStudio,
  SCENE05_DURATION,
  SCENE05_SFX_FRAMES,
} from '../v6/scenes/Scene05_VisualStudio'
import { Scene07_PersonalizationIntro } from '../v6/scenes/Scene07_PersonalizationIntro'
import { Scene07_Personalization } from '../v6/scenes/Scene07_Personalization'
import {
  Scene07b_LearningHub,
  SCENE07B_DURATION,
  QUIZ_START,
  QUIZ_SUBMIT,
  CERT_START,
} from '../v6/scenes/Scene07b_LearningHub'
import { Scene08_Ecosystem } from '../v6/scenes/Scene08_Ecosystem'
import { Scene10_Closing } from '../v6/scenes/Scene10_Closing'
import { FINALE_TYPE_START } from '../v6/scenes/ClosingScene/constants'

import { AnimatedGradientBG } from '../v6/components/AnimatedGradientBG'
import { KEYBOARD_SFX_LOOP_FRAMES, MUSIC_V4, SFX_V4 } from '../v6/assets'
import { sfxAllowedAt } from '../v6/timeline/sfxCutoff'

import { PathwaysHandoffProvider } from '../v9/context/PathwaysHandoffContext'
import { OpeningDepthOverlay } from '../v9/enhancements/OpeningDepthOverlay'
import { VisionMagneticOverlay } from '../v9/enhancements/VisionMagneticOverlay'
import { ScaledScene } from '../v9/utils/ScaledScene'
import {
  AIToImageTransition,
  HubToEcosystemTransition,
  ImageToYouTubeTransition,
  MeetToAITransition,
  OpeningToVisionTransition,
  PersoToHubTransition,
  TeachingToEducationTransition,
  VisionToMeetTransition,
  YouTubeToPersoTransition,
} from '../v9/transitions/ChapterTransitions'
import { TeachersToVisionFlash } from '../v9/transitions/TeachersToVisionFlash'

import { TRANSITION_SLOW_FACTOR_V10 } from './constants/transitionTiming'
import {
  TEACHING_INTRO_V10,
  EDUCATION_SLIDE_V10,
  PROBLEM_SLIDE_V10,
  SCENE02_V10,
  SCENE03_V10,
  AI_TEACHER_INTRO_V10,
  SCENE04_V10,
  IMAGE_STUDIO_INTRO_V10,
  SCENE05_V10,
  YOUTUBE_STUDIO_INTRO_V10,
  SCENE06_V10,
  PERSO_INTRO_V10,
  SCENE07_V10,
  SCENE07B_V10,
  SCENE08_V10,
  SCENE10_V10,
  SOURCE,
} from './timeline/sceneDurations'
import { CROSSFADE_V10, musicLevelAt } from './utils/sceneTransition'
import {
  TEACHERS_FLASH_FRAMES_V10,
  teachersEraseEndLocalV10,
  visionEnterDelayV10,
} from './timeline/teachersVisionHandoff'
import { HubZoomEnter } from './scenes/HubZoomEnter'
import { ClosingZoomEnter } from './scenes/ClosingZoomEnter'
import {
  YouTubeIntroQuizBlock,
  YouTubeIntroQuizTransitionOverlay,
} from './scenes/YouTubeIntroQuizBlock'

const CROSS = CROSSFADE_V10
const OPENING_HANDOFF_V10 = Math.round(OPENING_HANDOFF * 2 * TRANSITION_SLOW_FACTOR_V10)
const PROBLEM_HANDOFF_V10 = Math.round(PROBLEM_HANDOFF_FRAMES * 2 * TRANSITION_SLOW_FACTOR_V10) + 4
const HUB_ZOOM_ENTER_FRAMES = Math.round(CROSS * 2.4)
const CLOSING_ZOOM_ENTER_FRAMES = Math.max(28, CROSS - 4)

const S0 = 0
const S1 = S0 + TEACHING_INTRO_V10 - OPENING_HANDOFF_V10
const S2 = S1 + EDUCATION_SLIDE_V10 - CROSS
const S3 = S2 - CROSS
const S4 = S3 + PROBLEM_SLIDE_V10 - CROSS
const S5 = S4 + SCENE02_V10 - CROSS
const S6 = S5 + SCENE03_V10 - CROSS
const S6b = S6 + AI_TEACHER_INTRO_V10 - CROSS
const S7 = S6b + SCENE04_V10 - CROSS
const S7b = S7 + IMAGE_STUDIO_INTRO_V10 - CROSS
const S8 = S7b + SCENE05_V10 - CROSS
const S9 = S8 + YOUTUBE_STUDIO_INTRO_V10 - CROSS
const S9_QUIZ_END = S9 + SCENE06_V10
const S10 = S9_QUIZ_END - CROSS
const S10b = S10 + PERSO_INTRO_V10 - CROSS
const S11 = S10b + SCENE07_V10 - CROSS
const S11b = S11 + SCENE07B_V10 - CROSS
const S12 = S11b + SCENE08_V10 - CROSS

const TOTAL_FRAMES_V10 = S12 + SCENE10_V10

export const TOTAL_DURATION_V10 = TOTAL_FRAMES_V10

const PROBLEM_ERASE_END_V10 = teachersEraseEndLocalV10(PROBLEM_SLIDE_V10)
const VISION_ENTER_DELAY_V10 = visionEnterDelayV10(PROBLEM_SLIDE_V10)

const scaleSfxFrame = (localFrame: number, sourceDuration: number, targetDuration: number): number =>
  Math.round(localFrame * (targetDuration / sourceDuration))

const ZOOM_TRANSITION_START = Math.round((6 + 10 / 30) * 60)
const ZOOM_TRANSITION_END = Math.round((6 + 13 / 30) * 60)
const ZOOM_TRANSITION_AMPLITUDE = 0.012

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
    { at: TOTAL_FRAMES_V10, level: 0.11 },
  ])

  const fadeIn = interpolate(f, [0, 90], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const fadeOut = interpolate(f, [TOTAL_FRAMES_V10 - 180, TOTAL_FRAMES_V10], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  return level * fadeIn * fadeOut
}

export const TutifyDemoV10: React.FC = () => {
  const frame = useCurrentFrame()
  const zoomTransitionProgress = interpolate(
    frame,
    [ZOOM_TRANSITION_START, ZOOM_TRANSITION_END],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.cubic),
    },
  )
  const zoomTransitionScale = 1 + Math.sin(zoomTransitionProgress * Math.PI) * ZOOM_TRANSITION_AMPLITUDE

  const sfxCutoff = TOTAL_FRAMES_V10
  const sfxOk = (globalFrame: number): boolean => globalFrame < sfxCutoff

  const aiKbdStart = scaleSfxFrame(
    SCENE04_SFX_FRAMES.keyboardTyping.start,
    SCENE04_DURATION,
    SCENE04_V10,
  )
  const aiKbdDur = scaleSfxFrame(
    SCENE04_SFX_FRAMES.keyboardTyping.duration,
    SCENE04_DURATION,
    SCENE04_V10,
  )

  return (
    <AbsoluteFill style={{ background: '#F4F6F8' }}>
      <Sequence from={S4 - CROSS}>
        <AnimatedGradientBG variant="cool" />
      </Sequence>

      <Audio src={MUSIC_V4} volume={(f) => musicVol(f)} loop />

      <AbsoluteFill
        style={{
          transform: `scale(${zoomTransitionScale})`,
          transformOrigin: 'center center',
        }}
      >
        <Sequence from={S0} durationInFrames={Math.max(1, S3 - S0)} premountFor={OPENING_HANDOFF_V10}>
          <OpeningDepthOverlay />
        </Sequence>

        <Sequence from={S0} durationInFrames={TEACHING_INTRO_V10} premountFor={OPENING_HANDOFF_V10}>
          <ScaledScene sourceDuration={TEACHING_INTRO_DURATION} targetDuration={TEACHING_INTRO_V10}>
            <TeachingIntro />
          </ScaledScene>
        </Sequence>

        <Sequence
          from={S1}
          durationInFrames={EDUCATION_SLIDE_V10 + OPENING_HANDOFF_V10}
          premountFor={OPENING_HANDOFF_V10}
        >
          <ScaledScene sourceDuration={EDUCATION_SLIDE_DURATION} targetDuration={EDUCATION_SLIDE_V10}>
            <EducationChangingSlide />
          </ScaledScene>
        </Sequence>

        <Sequence from={S1} durationInFrames={OPENING_HANDOFF_V10 * 2}>
          <ScaledScene sourceDuration={OPENING_HANDOFF * 2} targetDuration={OPENING_HANDOFF_V10 * 2}>
            <OpeningHandoffOverlay />
          </ScaledScene>
        </Sequence>

        <Sequence from={S1} durationInFrames={OPENING_HANDOFF_V10 * 2}>
          <ScaledScene sourceDuration={OPENING_HANDOFF * 2} targetDuration={OPENING_HANDOFF_V10 * 2}>
            <TeachingToEducationTransition durationInFrames={OPENING_HANDOFF_V10 * 2} />
          </ScaledScene>
        </Sequence>

        <Sequence from={S3} durationInFrames={PROBLEM_SLIDE_V10} premountFor={CROSS}>
          <ScaledScene sourceDuration={SCENE01_DURATION} targetDuration={PROBLEM_SLIDE_V10}>
            <Scene01_Problem />
          </ScaledScene>
        </Sequence>

        <Sequence from={S3} durationInFrames={PROBLEM_HANDOFF_V10}>
          <ScaledScene
            sourceDuration={PROBLEM_HANDOFF_FRAMES + 4}
            targetDuration={PROBLEM_HANDOFF_V10}
          >
            <ProblemSlideHandoffOverlay />
          </ScaledScene>
        </Sequence>

        <Sequence
          from={S3 + PROBLEM_ERASE_END_V10 - 2}
          durationInFrames={TEACHERS_FLASH_FRAMES_V10 + 2}
        >
          <OpeningToVisionTransition durationInFrames={TEACHERS_FLASH_FRAMES_V10 + 2} />
        </Sequence>

        <Sequence from={S3 + PROBLEM_ERASE_END_V10} durationInFrames={TEACHERS_FLASH_FRAMES_V10}>
          <TeachersToVisionFlash durationInFrames={TEACHERS_FLASH_FRAMES_V10} />
        </Sequence>

        <Sequence from={S4} durationInFrames={SCENE02_V10} premountFor={CROSS}>
          <Sequence from={VISION_ENTER_DELAY_V10}>
            <ScaledScene sourceDuration={SOURCE.vision} targetDuration={SCENE02_V10}>
              <Scene02_Vision />
              <VisionMagneticOverlay />
            </ScaledScene>
          </Sequence>
        </Sequence>

        <Sequence from={S5 - CROSS} durationInFrames={CROSS}>
          <VisionToMeetTransition durationInFrames={CROSS} />
        </Sequence>

        <Sequence
          from={S5}
          durationInFrames={SCENE03_V10}
          premountFor={CROSS}
          style={{ backgroundColor: '#1D4ED8' }}
        >
          <ScaledScene sourceDuration={SOURCE.meet} targetDuration={SCENE03_V10}>
            <Scene03_Introduction />
          </ScaledScene>
        </Sequence>

        <Sequence from={S6 - CROSS} durationInFrames={CROSS}>
          <MeetToAITransition durationInFrames={CROSS} />
        </Sequence>

        <Sequence from={S6} durationInFrames={AI_TEACHER_INTRO_V10} premountFor={CROSS}>
          <ScaledScene sourceDuration={SOURCE.aiTeacherIntro} targetDuration={AI_TEACHER_INTRO_V10}>
            <Scene04_AITeacherIntro />
          </ScaledScene>
        </Sequence>

        <Sequence from={S6b} durationInFrames={SCENE04_V10} premountFor={CROSS}>
          {sfxOk(S6b + aiKbdStart) ? (
            <Sequence from={aiKbdStart} durationInFrames={aiKbdDur}>
              <Loop durationInFrames={KEYBOARD_SFX_LOOP_FRAMES}>
                <Audio src={SFX_V4.keyboard} volume={0.3} />
              </Loop>
            </Sequence>
          ) : null}
          {SCENE04_SFX_FRAMES.cardAppear.map((at, i) => {
            const scaledAt = scaleSfxFrame(at, SCENE04_DURATION, SCENE04_V10)
            return sfxOk(S6b + scaledAt) ? (
              <Sequence key={`s4-card-${i}`} from={scaledAt}>
                <Audio src={SFX_V4.cardAppear} volume={0.3} />
              </Sequence>
            ) : null
          })}
          <ScaledScene sourceDuration={SCENE04_DURATION} targetDuration={SCENE04_V10}>
            <Scene04_AIAssistant />
          </ScaledScene>
        </Sequence>

        <Sequence from={S7 - CROSS} durationInFrames={CROSS}>
          <AIToImageTransition durationInFrames={CROSS} />
        </Sequence>

        <Sequence from={S7} durationInFrames={IMAGE_STUDIO_INTRO_V10} premountFor={CROSS}>
          <ScaledScene
            sourceDuration={SCENE_IMAGE_STUDIO_INTRO_DURATION}
            targetDuration={IMAGE_STUDIO_INTRO_V10}
          >
            <Scene05_ImageStudioIntro />
          </ScaledScene>
        </Sequence>

        <Sequence from={S7b} durationInFrames={SCENE05_V10} premountFor={CROSS}>
          {SCENE05_SFX_FRAMES.keyboardTyping.map((seg, i) => {
            const start = scaleSfxFrame(seg.start, SCENE05_DURATION, SCENE05_V10)
            const duration = scaleSfxFrame(seg.duration, SCENE05_DURATION, SCENE05_V10)
            return sfxOk(S7b + start) ? (
              <Sequence key={`s5-kbd-${i}`} from={start} durationInFrames={duration}>
                <Loop durationInFrames={KEYBOARD_SFX_LOOP_FRAMES}>
                  <Audio src={SFX_V4.keyboard} volume={0.3} />
                </Loop>
              </Sequence>
            ) : null
          })}
          <ScaledScene sourceDuration={SCENE05_DURATION} targetDuration={SCENE05_V10}>
            <Scene05_VisualStudio />
          </ScaledScene>
        </Sequence>

        <Sequence from={S8 - CROSS} durationInFrames={CROSS}>
          <ImageToYouTubeTransition durationInFrames={CROSS} />
        </Sequence>

        <Sequence
          from={S8}
          durationInFrames={YOUTUBE_STUDIO_INTRO_V10 + SCENE06_V10 - CROSS}
          premountFor={CROSS}
        >
          <YouTubeIntroQuizBlock
            introDuration={YOUTUBE_STUDIO_INTRO_V10}
            quizDuration={SCENE06_V10}
            crossfade={CROSS}
          />
        </Sequence>

        <Sequence from={S9} durationInFrames={CROSS}>
          <YouTubeIntroQuizTransitionOverlay crossfade={CROSS} />
        </Sequence>

        <Sequence from={S10 - CROSS} durationInFrames={CROSS}>
          <YouTubeToPersoTransition durationInFrames={CROSS} />
        </Sequence>

        <Sequence from={S10} durationInFrames={PERSO_INTRO_V10} premountFor={CROSS}>
          <ScaledScene sourceDuration={SOURCE.persoIntro} targetDuration={PERSO_INTRO_V10}>
            <Scene07_PersonalizationIntro />
          </ScaledScene>
        </Sequence>

        <Sequence from={S10b} durationInFrames={SCENE07_V10} premountFor={CROSS}>
          <PathwaysHandoffProvider>
            <ScaledScene sourceDuration={SOURCE.personalization} targetDuration={SCENE07_V10}>
              <Scene07_Personalization />
            </ScaledScene>
          </PathwaysHandoffProvider>
        </Sequence>

        <Sequence from={S11 - CROSS} durationInFrames={CROSS}>
          <PersoToHubTransition durationInFrames={CROSS} />
        </Sequence>

        <Sequence from={S11} durationInFrames={SCENE07B_V10} premountFor={CROSS}>
          {sfxOk(S11 + scaleSfxFrame(QUIZ_START + 16, SCENE07B_DURATION, SCENE07B_V10)) ? (
            <Sequence from={scaleSfxFrame(QUIZ_START + 16, SCENE07B_DURATION, SCENE07B_V10)}>
              <Audio src={SFX_V4.dataPing} volume={0.22} />
            </Sequence>
          ) : null}
          {sfxOk(S11 + scaleSfxFrame(QUIZ_SUBMIT, SCENE07B_DURATION, SCENE07B_V10)) ? (
            <Sequence from={scaleSfxFrame(QUIZ_SUBMIT, SCENE07B_DURATION, SCENE07B_V10)}>
              <Audio src={SFX_V4.completion} volume={0.32} />
            </Sequence>
          ) : null}
          {sfxOk(S11 + scaleSfxFrame(CERT_START, SCENE07B_DURATION, SCENE07B_V10)) ? (
            <Sequence from={scaleSfxFrame(CERT_START, SCENE07B_DURATION, SCENE07B_V10)}>
              <Audio src={SFX_V4.sparkle} volume={0.36} />
            </Sequence>
          ) : null}
          <HubZoomEnter enterFrames={HUB_ZOOM_ENTER_FRAMES}>
            <ScaledScene sourceDuration={SCENE07B_DURATION} targetDuration={SCENE07B_V10}>
              <Scene07b_LearningHub motionStyle="product3d" enableSubmitClickBeat />
            </ScaledScene>
          </HubZoomEnter>
        </Sequence>

        <Sequence from={S11b - CROSS} durationInFrames={CROSS}>
          <HubToEcosystemTransition durationInFrames={CROSS} />
        </Sequence>

        <Sequence from={S11b} durationInFrames={SCENE08_V10} premountFor={CROSS}>
          {sfxOk(S11b + scaleSfxFrame(14, SOURCE.ecosystem, SCENE08_V10)) ? (
            <Sequence from={scaleSfxFrame(14, SOURCE.ecosystem, SCENE08_V10)}>
              <Audio src={SFX_V4.sparkle} volume={0.32} />
            </Sequence>
          ) : null}
          {[262, 280, 298, 316, 334, 400].map((at) =>
            sfxOk(S11b + scaleSfxFrame(at, SOURCE.ecosystem, SCENE08_V10)) ? (
              <Sequence key={at} from={scaleSfxFrame(at, SOURCE.ecosystem, SCENE08_V10)}>
                <Audio
                  src={at === 400 ? SFX_V4.sparkle : SFX_V4.dataPing}
                  volume={at === 400 ? 0.34 : 0.26}
                />
              </Sequence>
            ) : null,
          )}
          <ScaledScene sourceDuration={SOURCE.ecosystem} targetDuration={SCENE08_V10}>
            <Scene08_Ecosystem />
          </ScaledScene>
        </Sequence>

        <Sequence from={S12 - CROSS} durationInFrames={SCENE10_V10 + CROSS} premountFor={CROSS}>
          {sfxOk(S12 + scaleSfxFrame(132, SOURCE.closing, SCENE10_V10)) ? (
            <Sequence from={CROSS + scaleSfxFrame(132, SOURCE.closing, SCENE10_V10)}>
              <Audio src={SFX_V4.sparkle} volume={0.34} />
            </Sequence>
          ) : null}
          {sfxOk(S12 + scaleSfxFrame(210, SOURCE.closing, SCENE10_V10)) ? (
            <Sequence from={CROSS + scaleSfxFrame(210, SOURCE.closing, SCENE10_V10)}>
              <Audio src={SFX_V4.completion} volume={0.4} />
            </Sequence>
          ) : null}
          {sfxOk(S12 + scaleSfxFrame(FINALE_TYPE_START, SOURCE.closing, SCENE10_V10)) ? (
            <Sequence
              from={CROSS + scaleSfxFrame(FINALE_TYPE_START, SOURCE.closing, SCENE10_V10)}
            >
              <Audio src={SFX_V4.keyboard} volume={0.22} />
            </Sequence>
          ) : null}
          <ClosingZoomEnter enterFrames={CLOSING_ZOOM_ENTER_FRAMES}>
            <ScaledScene sourceDuration={SOURCE.closing} targetDuration={SCENE10_V10}>
              <Scene10_Closing />
            </ScaledScene>
          </ClosingZoomEnter>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
