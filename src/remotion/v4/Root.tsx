/**
 * TutifyDemoV4 — ~120-second cinematic AI education video.
 *
 * MASTER TIMELINE (~5889 frames @ 30 fps ≈ 196 s):
 *   Scene | Start | End  | Duration | Story
 *   00    |     0 |  180 |  180  (6s) | Teaching Intro     — blur title reveal
 *   01    |   180 |  390 |  210  (7s) | Education Changing — blue ribbon headline
 *   02    |   366 |  651 |  285 (9.5s)| Teachers Overwhelmed — typing, cards, highlight exit
 *   03    |   651 |  861 |  210  (7s) | The Vision         — dawn light, hope
 *   04    |   861 | 1221 |  360 (12s) | Introduction       — Meet Tutify + ecosystem line
 *   05    |  1131 | 1401 |  270  (9s) | AI Teacher Intro   — tagline beats (one-by-one)
 *   06    |  1401 | 1761 |  360 (12s) | AI Assistant       — live generation magic
 *   07    |  1761 | 2091 |  330 (11s) | Image Studio Intro — tagline beats
 *   07b   |  2091 | 2571 |  480 (16s) | PixGen Demo        — generative canvas + previews
 *   08    |  2547 | 2937 |  390 (13s) | YouTube Fun Studio — tagline beats (crossfade in)
 *   08b   |  2913 | 3453 |  540 (18s) | YouTube Quiz UI    — blueprint + quiz
 *   10    |  3429 | 3809 |  380 (12s) | Personalization Intro (right after quiz)
 *   10b   |  3805 | 4585 |  780 (26s) | Personalization Demo  — analysis + pathways
 *   10c   |  4561 | 5581 | 1020 (34s) | Learning Hub Demo  — hub → micro-course → quiz
 *   11    |  5557 | 6121 |  540 (18s) | Ecosystem — headline cycle → diagram → merge
 *   12    |  ~5075| ~5525|  450 (15s)| Closing            — future line → already here → logo → finale
 *
 * Scenes from PixGen onward overlap by CROSSFADE (24f). Music loops with smooth volume curve.
 *
 * AUDIO LAYERS:
 *   1. Music bed  — Pluck Loop Blueprint (looped, scene-based volume)
 *   2. Voiceover  — placeholder (add .mp3 files to v4/assets/ when ready)
 *   3. SFX        — nested <Sequence from={localFrame}> per event
 */
import React from 'react'
import { AbsoluteFill, Audio, Sequence, interpolate } from 'remotion'

import TeachingIntro, { TEACHING_INTRO_DURATION } from './scenes/TeachingIntro/TeachingIntro'
import EducationChangingSlide, {
  EDUCATION_SLIDE_DURATION,
} from '../compositions/EducationChangingSlide'
import { Scene01_Problem,        SCENE01_DURATION } from './scenes/Scene01_Problem'
import { Scene02_Vision,         SCENE02_DURATION } from './scenes/Scene02_Vision'
import { Scene03_Introduction,   SCENE03_DURATION } from './scenes/Scene03_Introduction'
import { Scene04_AITeacherIntro,   SCENE_AI_TEACHER_INTRO_DURATION } from './scenes/Scene04_AITeacherIntro'
import { Scene04_AIAssistant,    SCENE04_DURATION } from './scenes/Scene04_AIAssistant'
import { Scene05_ImageStudioIntro, SCENE_IMAGE_STUDIO_INTRO_DURATION } from './scenes/Scene05_ImageStudioIntro'
import { Scene05_VisualStudio,   SCENE05_DURATION } from './scenes/Scene05_VisualStudio'
import { Scene06_YouTubeStudioIntro, SCENE_YOUTUBE_STUDIO_INTRO_DURATION } from './scenes/Scene06_YouTubeStudioIntro'
import { Scene06_YouTube,        SCENE06_DURATION } from './scenes/Scene06_YouTube'
import { Scene07_PersonalizationIntro, SCENE07_INTRO_DURATION } from './scenes/Scene07_PersonalizationIntro'
import { Scene07_Personalization, SCENE07_DURATION } from './scenes/Scene07_Personalization'
import {
  Scene07b_LearningHub,
  SCENE07B_DURATION,
  CLICK_AT,
  COURSE_ENTER,
  QUIZ_START,
  QUIZ_SUBMIT,
  CERT_START,
} from './scenes/Scene07b_LearningHub'
import { Scene08_Ecosystem,      SCENE08_DURATION } from './scenes/Scene08_Ecosystem'
import { Scene10_Closing,        SCENE10_DURATION } from './scenes/Scene10_Closing'
import { FINALE_TYPE_START } from './scenes/ClosingScene/constants'

import { AnimatedGradientBG } from './components/AnimatedGradientBG'
import { MUSIC_V4, SFX_V4 } from './assets'
import { CROSSFADE } from './utils/sceneTransition'
import { musicLevelAt } from './utils/musicCurve'

// ── Scene start frames (overlapping handoffs from PixGen → close) ─────────────

const S0  = 0
const S1  = S0  + TEACHING_INTRO_DURATION - CROSSFADE
const S2  = S1  + EDUCATION_SLIDE_DURATION - CROSSFADE
const S3  = S2  - CROSSFADE
const S4  = S3  + SCENE01_DURATION - CROSSFADE
const S5  = S4  + SCENE02_DURATION          //  861
const S6  = S5  + SCENE03_DURATION                  // 1131
const S6b = S6  + SCENE_AI_TEACHER_INTRO_DURATION   // 1401
const S7  = S6b + SCENE04_DURATION                         // 1761
const S7b = S7  + SCENE_IMAGE_STUDIO_INTRO_DURATION        // 2091
const S8   = S7b + SCENE05_DURATION - CROSSFADE
const S9   = S8  + SCENE_YOUTUBE_STUDIO_INTRO_DURATION - CROSSFADE
const S9_QUIZ_END = S9 + SCENE06_DURATION
const S10  = S9_QUIZ_END - CROSSFADE
const S10b = S10 + SCENE07_INTRO_DURATION - CROSSFADE
const S11  = S10b + SCENE07_DURATION - CROSSFADE
const S11b = S11 + SCENE07B_DURATION - CROSSFADE
const S12  = S11b + SCENE08_DURATION - CROSSFADE

export const TOTAL_DURATION_V4 = S12 + SCENE10_DURATION

/**
 * Music volume curve — cinematic arc:
 *   S1 (problem): low & ominous
 *   S2 (vision):  subtle lift
 *   S3 (intro):   confident reveal
 *   S4 (AI hero): energized peak
 *   S5–S6:        sustained engagement
 *   S7 (persona): swell
 *   S8 (eco):     fullest swell
 *   S9 (adopt):   warm, calmer
 *   S10 (close):  resolve fade
 */
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
    { at: S10, level: 0.135 },
    { at: S10, level: 0.14 },
    { at: S10b, level: 0.145 },
    { at: S11, level: 0.155 },
    { at: S11b, level: 0.15 },
    { at: S12, level: 0.15 },
    { at: TOTAL_DURATION_V4, level: 0.11 },
  ])

  const fadeIn = interpolate(f, [0, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const fadeOut = interpolate(f, [TOTAL_DURATION_V4 - 90, TOTAL_DURATION_V4], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  return level * fadeIn * fadeOut
}

export const TutifyDemoV4: React.FC = () => (
  <AbsoluteFill style={{ background: '#F4F6F8' }}>

    {/* Living mesh from Vision onward — overlaps overwhelmed exit */}
    <Sequence from={S4 - CROSSFADE}>
      <AnimatedGradientBG variant="cool" />
    </Sequence>

    {/* ══ MUSIC BED ══════════════════════════════════════════════════════════ */}
    <Audio src={MUSIC_V4} volume={(f) => musicVol(f)} loop />

    {/* ══ SCENE 00 — Teaching Intro (0–180f · 6s) ═══════════════════════════ */}
    <Sequence from={S0} durationInFrames={TEACHING_INTRO_DURATION} premountFor={CROSSFADE}>
      <TeachingIntro />
    </Sequence>

    {/* ══ SCENE 01 — Education Changing ═════════════════════════════════════ */}
    <Sequence from={S1} durationInFrames={EDUCATION_SLIDE_DURATION + CROSSFADE} premountFor={CROSSFADE}>
      <EducationChangingSlide />
    </Sequence>

    {/* ══ SCENE 02 — Teachers Overwhelmed (366–651f · crossfade in) ═════════ */}
    <Sequence from={S3} durationInFrames={SCENE01_DURATION} premountFor={CROSSFADE}>
      <Scene01_Problem />
    </Sequence>

    {/* ══ SCENE 03 — The Vision ═══════════════════════════════════════════════ */}
    <Sequence from={S4} durationInFrames={SCENE02_DURATION} premountFor={CROSSFADE}>
      <Scene02_Vision />
    </Sequence>

    {/* ══ SCENE 04 — Introduction (840–1110f · 9s) ═══════════════════════════
        Logo reveal. "Meet Tutify." Preview cards.
        SFX: sparkle on logo, card-appear × 4                            */}
    <Sequence from={S5} durationInFrames={SCENE03_DURATION}>
      <Sequence from={8}><Audio src={SFX_V4.sparkle} volume={0.36} /></Sequence>
      <Sequence from={110}><Audio src={SFX_V4.cardAppear} volume={0.22} /></Sequence>
      <Sequence from={140}><Audio src={SFX_V4.cardAppear} volume={0.22} /></Sequence>
      <Sequence from={170}><Audio src={SFX_V4.cardAppear} volume={0.22} /></Sequence>
      <Sequence from={200}><Audio src={SFX_V4.cardAppear} volume={0.22} /></Sequence>
      <Scene03_Introduction />
    </Sequence>

    {/* ══ SCENE 05 — AI Teacher Intro (1131–1401f · 9s) ═══════════════════════
        Tagline beats one-by-one → hand off to generation UI               */}
    <Sequence from={S6} durationInFrames={SCENE_AI_TEACHER_INTRO_DURATION} premountFor={CROSSFADE}>
      <Scene04_AITeacherIntro />
    </Sequence>

    {/* ══ SCENE 06 — AI Assistant (1401–1761f · 12s) ══════════════════════════
        Typewriter → Generate → output cards.
        SFX: keyboard, button-click, sparkle, card × 3                    */}
    <Sequence from={S6b} durationInFrames={SCENE04_DURATION} premountFor={CROSSFADE}>
      <Sequence from={30}><Audio src={SFX_V4.keyboard}    volume={0.32} /></Sequence>
      <Sequence from={128}><Audio src={SFX_V4.buttonClick} volume={0.40} /></Sequence>
      <Sequence from={132}><Audio src={SFX_V4.sparkle}    volume={0.34} /></Sequence>
      <Sequence from={150}><Audio src={SFX_V4.cardAppear} volume={0.26} /></Sequence>
      <Sequence from={180}><Audio src={SFX_V4.cardAppear} volume={0.26} /></Sequence>
      <Sequence from={210}><Audio src={SFX_V4.cardAppear} volume={0.26} /></Sequence>
      <Scene04_AIAssistant />
    </Sequence>

    {/* ══ SCENE 07 — Image Studio Intro (1761–2091f · 11s) ═══════════════════ */}
    <Sequence from={S7} durationInFrames={SCENE_IMAGE_STUDIO_INTRO_DURATION} premountFor={CROSSFADE}>
      <Scene05_ImageStudioIntro />
    </Sequence>

    {/* ══ SCENE 07b — PixGen UI (2091–2571f · 16s) ═══════════════════════════
        Generative canvas + live preview · volcano → history generations.
        SFX: keyboard ×2, button-click ×2, sparkle ×2, completion ×2        */}
    <Sequence from={S7b} durationInFrames={SCENE05_DURATION} premountFor={CROSSFADE}>
      <Sequence from={72}><Audio src={SFX_V4.keyboard}    volume={0.28} /></Sequence>
      <Sequence from={148}><Audio src={SFX_V4.buttonClick} volume={0.34} /></Sequence>
      <Sequence from={152}><Audio src={SFX_V4.sparkle}    volume={0.30} /></Sequence>
      <Sequence from={212}><Audio src={SFX_V4.completion} volume={0.28} /></Sequence>
      <Sequence from={308}><Audio src={SFX_V4.keyboard}    volume={0.26} /></Sequence>
      <Sequence from={368}><Audio src={SFX_V4.buttonClick} volume={0.34} /></Sequence>
      <Sequence from={372}><Audio src={SFX_V4.sparkle}     volume={0.30} /></Sequence>
      <Sequence from={422}><Audio src={SFX_V4.completion} volume={0.28} /></Sequence>
      <Scene05_VisualStudio />
    </Sequence>

    {/* ══ SCENE 08 — YouTube Fun Studio Intro (2571–2961f · 13s) ═══════════ */}
    <Sequence from={S8} durationInFrames={SCENE_YOUTUBE_STUDIO_INTRO_DURATION} premountFor={CROSSFADE}>
      <Scene06_YouTubeStudioIntro />
    </Sequence>

    {/* ══ SCENE 08b — YouTube Quiz Blueprint ═══════════════════════════════════ */}
    <Sequence from={S9} durationInFrames={SCENE06_DURATION} premountFor={CROSSFADE}>
      <Sequence from={36}><Audio src={SFX_V4.keyboard}    volume={0.28} /></Sequence>
      <Sequence from={102}><Audio src={SFX_V4.buttonClick} volume={0.36} /></Sequence>
      <Sequence from={106}><Audio src={SFX_V4.sparkle}     volume={0.32} /></Sequence>
      <Sequence from={178}><Audio src={SFX_V4.dataPing}    volume={0.26} /></Sequence>
      <Sequence from={196}><Audio src={SFX_V4.dataPing}    volume={0.26} /></Sequence>
      <Sequence from={214}><Audio src={SFX_V4.dataPing}    volume={0.26} /></Sequence>
      <Sequence from={248}><Audio src={SFX_V4.completion} volume={0.30} /></Sequence>
      <Sequence from={440}><Audio src={SFX_V4.dataPing}    volume={0.24} /></Sequence>
      <Sequence from={458}><Audio src={SFX_V4.dataPing}    volume={0.24} /></Sequence>
      <Sequence from={476}><Audio src={SFX_V4.dataPing}    volume={0.24} /></Sequence>
      <Scene06_YouTube />
    </Sequence>

    {/* ══ SCENE 10 — Personalization Intro (after YouTube quiz · 10s) ═══════ */}
    <Sequence from={S10} durationInFrames={SCENE07_INTRO_DURATION} premountFor={CROSSFADE}>
      <Scene07_PersonalizationIntro />
    </Sequence>

    {/* ══ SCENE 10b — Personalization Demo ═══════════════════════════════════ */}
    <Sequence from={S10b} durationInFrames={SCENE07_DURATION} premountFor={CROSSFADE}>
      <Sequence from={78}><Audio src={SFX_V4.dataPing}    volume={0.24} /></Sequence>
      <Sequence from={130}><Audio src={SFX_V4.dataPing}    volume={0.24} /></Sequence>
      <Sequence from={168}><Audio src={SFX_V4.dataPing}    volume={0.24} /></Sequence>
      <Sequence from={205}><Audio src={SFX_V4.dataPing}    volume={0.24} /></Sequence>
      <Sequence from={248}><Audio src={SFX_V4.dataPing}    volume={0.24} /></Sequence>
      <Sequence from={330}><Audio src={SFX_V4.sparkle}     volume={0.32} /></Sequence>
      <Sequence from={340}><Audio src={SFX_V4.completion}  volume={0.30} /></Sequence>
      <Sequence from={408}><Audio src={SFX_V4.sparkle}      volume={0.28} /></Sequence>
      <Sequence from={568}><Audio src={SFX_V4.sparkle}     volume={0.34} /></Sequence>
      <Scene07_Personalization />
    </Sequence>

    {/* ══ SCENE 10c — Learning Hub walkthrough ═════════════════════════════ */}
    <Sequence from={S11} durationInFrames={SCENE07B_DURATION} premountFor={CROSSFADE}>
      <Sequence from={CLICK_AT - 8}><Audio src={SFX_V4.buttonClick} volume={0.34} /></Sequence>
      <Sequence from={COURSE_ENTER}><Audio src={SFX_V4.cardAppear} volume={0.26} /></Sequence>
      <Sequence from={QUIZ_START + 20}><Audio src={SFX_V4.dataPing} volume={0.22} /></Sequence>
      <Sequence from={QUIZ_SUBMIT}><Audio src={SFX_V4.completion} volume={0.32} /></Sequence>
      <Sequence from={CERT_START}><Audio src={SFX_V4.sparkle} volume={0.36} /></Sequence>
      <Scene07b_LearningHub />
    </Sequence>

    {/* ══ SCENE 11 — Ecosystem ═══════════════════════════════════════════════
        Network visualization: center → 5 nodes connecting.
        SFX: sparkle (center), data-ping × 5 (each node)               */}
    <Sequence from={S11b} durationInFrames={SCENE08_DURATION} premountFor={CROSSFADE}>
      <Sequence from={16}><Audio src={SFX_V4.sparkle}  volume={0.32} /></Sequence>
      <Sequence from={248}><Audio src={SFX_V4.dataPing} volume={0.26} /></Sequence>
      <Sequence from={268}><Audio src={SFX_V4.dataPing} volume={0.26} /></Sequence>
      <Sequence from={288}><Audio src={SFX_V4.dataPing} volume={0.26} /></Sequence>
      <Sequence from={308}><Audio src={SFX_V4.dataPing} volume={0.26} /></Sequence>
      <Sequence from={328}><Audio src={SFX_V4.dataPing} volume={0.26} /></Sequence>
      <Sequence from={400}><Audio src={SFX_V4.sparkle} volume={0.34} /></Sequence>
      <Scene08_Ecosystem />
    </Sequence>

    {/* ══ SCENE 12 — Closing (after ecosystem · crossfade in) ═══════════════ */}
    <Sequence from={S12} durationInFrames={SCENE10_DURATION} premountFor={CROSSFADE}>
      <Sequence from={132}><Audio src={SFX_V4.sparkle} volume={0.34} /></Sequence>
      <Sequence from={210}><Audio src={SFX_V4.completion} volume={0.4} /></Sequence>
      <Sequence from={FINALE_TYPE_START}><Audio src={SFX_V4.keyboard} volume={0.22} /></Sequence>
      <Scene10_Closing />
    </Sequence>

  </AbsoluteFill>
)
