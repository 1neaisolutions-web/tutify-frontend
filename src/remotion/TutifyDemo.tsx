// TutifyDemo.tsx — Master 3:30 Composition
// 6300 frames @ 30fps | 26 scenes | Apple-keynote cinematic quality
import React from 'react'
import { AbsoluteFill, Audio, staticFile } from 'remotion'
import { TransitionSeries, linearTiming } from '@remotion/transitions'
import { fade } from '@remotion/transitions/fade'

import { Scene01ExhaustedTeacher }      from './scenes/Scene01_ExhaustedTeacher'
import { Scene02DisengagedStudents }    from './scenes/Scene02_DisengagedStudents'
import { Scene03PrincipalOverwhelmed }  from './scenes/Scene03_PrincipalOverwhelmed'
import { Scene04BrandReveal }           from './scenes/Scene04_BrandReveal'
import { Scene05UnifiedEcosystem }      from './scenes/Scene05_UnifiedEcosystem'
import { Scene06ThreeTierArchitecture } from './scenes/Scene06_ThreeTierArchitecture'
import { Scene07TeacherAssistantLive }  from './scenes/Scene07_TeacherAssistantLive'
import { Scene08WorksheetGeneration }   from './scenes/Scene08_WorksheetGeneration'
import { Scene09WorksheetDifferentiation } from './scenes/Scene09_WorksheetDifferentiation'
import { Scene10TemplateInput }         from './scenes/Scene10_TemplateInput'
import { Scene11TemplateOutput }        from './scenes/Scene11_TemplateOutput'
import { Scene12YouTubeGlobalContent }  from './scenes/Scene12_YouTubeGlobalContent'
import { Scene13YouTubeRegional }       from './scenes/Scene13_YouTubeRegional'
import { Scene14ImageStudio }           from './scenes/Scene14_ImageStudio'
import { Scene15SpecializedBots }       from './scenes/Scene15_SpecializedBots'
import { Scene16PersonalizationProfile } from './scenes/Scene16_PersonalizationProfile'
import { Scene17AdaptiveLearningPaths } from './scenes/Scene17_AdaptiveLearningPaths'
import { Scene18NextEraVision }         from './scenes/Scene18_NextEraVision'
import { Scene19AIHumanBridge }         from './scenes/Scene19_AIHumanBridge'
import { Scene20EnterpriseSecurity }    from './scenes/Scene20_EnterpriseSecurity'
import { Scene21ClassroomJoy }          from './scenes/Scene21_ClassroomJoy'
import { Scene22NumbersThatMatter }     from './scenes/Scene22_NumbersThatMatter'
import { Scene23GlobalMovement }        from './scenes/Scene23_GlobalMovement'
import { Scene24FinalBrandConvergence } from './scenes/Scene24_FinalBrandConvergence'
import { Scene25CallToAction }          from './scenes/Scene25_CallToAction'
import { Scene26FinalHold }             from './scenes/Scene26_FinalHold'

// Frame math:
//   Scenes 1-25: 252 frames each (8.4s)
//   Scene 26:    300 frames (10s)
//   Transitions: 25 × 12 frames overlap
//   Total: 25×252 + 300 - 25×12 = 6300 frames ✓
const S = 252   // standard scene duration
const S26 = 300 // final hold duration
const T = 12    // transition overlap duration

const fadeTiming = linearTiming({ durationInFrames: T })
const fadePresentation = fade()

export const TutifyDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#0B1F3A' }}>
      {/* ── Audio tracks ── */}
      <Audio src={staticFile('remotion-assets/voiceover.mp3')} volume={1.0} />
      {/* <Audio src={staticFile('remotion-assets/music.mp3')}     volume={0.22} /> */}
      {/* <Audio src={staticFile('remotion-assets/sfx-master.mp3')} volume={0.4} /> */}

      <TransitionSeries>
        {/* ── Part 1: The Educational Crisis (0:00–0:24) ── */}
        <TransitionSeries.Sequence durationInFrames={S}>
          <Scene01ExhaustedTeacher />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fadePresentation} timing={fadeTiming} />

        <TransitionSeries.Sequence durationInFrames={S}>
          <Scene02DisengagedStudents />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fadePresentation} timing={fadeTiming} />

        <TransitionSeries.Sequence durationInFrames={S}>
          <Scene03PrincipalOverwhelmed />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fadePresentation} timing={fadeTiming} />

        {/* ── Part 2: Meet Tutify (0:24–0:48) ── */}
        <TransitionSeries.Sequence durationInFrames={S}>
          <Scene04BrandReveal />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fadePresentation} timing={fadeTiming} />

        <TransitionSeries.Sequence durationInFrames={S}>
          <Scene05UnifiedEcosystem />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fadePresentation} timing={fadeTiming} />

        <TransitionSeries.Sequence durationInFrames={S}>
          <Scene06ThreeTierArchitecture />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fadePresentation} timing={fadeTiming} />

        {/* ── Part 3: Teacher Assistant Live (0:48–0:56) ── */}
        <TransitionSeries.Sequence durationInFrames={S}>
          <Scene07TeacherAssistantLive />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fadePresentation} timing={fadeTiming} />

        {/* ── Part 4: Worksheet Deep Dive (0:56–1:12) ── */}
        <TransitionSeries.Sequence durationInFrames={S}>
          <Scene08WorksheetGeneration />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fadePresentation} timing={fadeTiming} />

        <TransitionSeries.Sequence durationInFrames={S}>
          <Scene09WorksheetDifferentiation />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fadePresentation} timing={fadeTiming} />

        {/* ── Part 5: Template Demo (1:12–1:28) ── */}
        <TransitionSeries.Sequence durationInFrames={S}>
          <Scene10TemplateInput />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fadePresentation} timing={fadeTiming} />

        <TransitionSeries.Sequence durationInFrames={S}>
          <Scene11TemplateOutput />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fadePresentation} timing={fadeTiming} />

        {/* ── Part 6: YouTube Intelligence (1:28–1:44) ── */}
        <TransitionSeries.Sequence durationInFrames={S}>
          <Scene12YouTubeGlobalContent />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fadePresentation} timing={fadeTiming} />

        <TransitionSeries.Sequence durationInFrames={S}>
          <Scene13YouTubeRegional />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fadePresentation} timing={fadeTiming} />

        {/* ── Part 7: Image Studio (1:44–1:52) ── */}
        <TransitionSeries.Sequence durationInFrames={S}>
          <Scene14ImageStudio />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fadePresentation} timing={fadeTiming} />

        {/* ── Part 8: Specialized Bots (1:52–2:00) ── */}
        <TransitionSeries.Sequence durationInFrames={S}>
          <Scene15SpecializedBots />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fadePresentation} timing={fadeTiming} />

        {/* ── Part 9: Personalized Learning (2:00–2:16) ── */}
        <TransitionSeries.Sequence durationInFrames={S}>
          <Scene16PersonalizationProfile />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fadePresentation} timing={fadeTiming} />

        <TransitionSeries.Sequence durationInFrames={S}>
          <Scene17AdaptiveLearningPaths />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fadePresentation} timing={fadeTiming} />

        {/* ── Part 10: Vision & Differentiation (2:16–2:40) ── */}
        <TransitionSeries.Sequence durationInFrames={S}>
          <Scene18NextEraVision />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fadePresentation} timing={fadeTiming} />

        <TransitionSeries.Sequence durationInFrames={S}>
          <Scene19AIHumanBridge />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fadePresentation} timing={fadeTiming} />

        <TransitionSeries.Sequence durationInFrames={S}>
          <Scene20EnterpriseSecurity />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fadePresentation} timing={fadeTiming} />

        {/* ── Part 11: Real Impact & Movement (2:40–3:04) ── */}
        <TransitionSeries.Sequence durationInFrames={S}>
          <Scene21ClassroomJoy />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fadePresentation} timing={fadeTiming} />

        <TransitionSeries.Sequence durationInFrames={S}>
          <Scene22NumbersThatMatter />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fadePresentation} timing={fadeTiming} />

        <TransitionSeries.Sequence durationInFrames={S}>
          <Scene23GlobalMovement />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fadePresentation} timing={fadeTiming} />

        {/* ── Part 12: Closing (3:04–3:30) ── */}
        <TransitionSeries.Sequence durationInFrames={S}>
          <Scene24FinalBrandConvergence />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fadePresentation} timing={fadeTiming} />

        <TransitionSeries.Sequence durationInFrames={S}>
          <Scene25CallToAction />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fadePresentation} timing={fadeTiming} />

        {/* Scene 26 — 10-second final hold */}
        <TransitionSeries.Sequence durationInFrames={S26}>
          <Scene26FinalHold />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  )
}
