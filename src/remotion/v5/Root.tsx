/**
 * TutifyDemoV5 — Premium cinematic AI education video.
 *
 * V5 MASTER TIMELINE (~5100 frames @ 30 fps ≈ 170 s):
 *
 *   Scene | Start | Duration | Description
 *   ──────┼───────┼──────────┼────────────────────────────────────────────
 *   00    |     0 |  270 (9s)| Cinematic opening: three dark beats
 *   01    |   250 |  285 (9.5s)| Teachers overwhelmed (v4 composition)
 *   02    |   515 |  240 (8s)| Vision: dark → dawn transition
 *   03    |   735 |  300 (10s)| Meet Tutify: deep indigo brand reveal
 *   04a   |  1015 |  195 (6.5s)| AI Teacher Intro: bold beats on dark
 *   04b   |  1190 |  330 (11s)| AI Assistant: live generation demo
 *   05a   |  1500 |  180 (6s)| Image Studio Intro: dark with violet glow
 *   05b   |  1660 |  480 (16s)| PixGen Demo (v4)
 *   06a   |  2120 |  100 (3.3s)| YouTube Intro: dark with red
 *   06b   |  2200 |  540 (18s)| YouTube Quiz Demo (v4)
 *   07a   |  2720 |  380 (12.7s)| Personalization Intro (v4)
 *   07b   |  3080 |  780 (26s)| Personalization Demo (v4)
 *   07c   |  3840 |  870 (29s)| Learning Hub Demo (v4)
 *   08    |  4690 |  480 (16s)| Ecosystem: dark cinematic
 *   10    |  5150 |  430 (14.3s)| Closing: dark premium finale
 *
 * Total: ~5580 frames ≈ 186s (with CROSSFADE overlaps: ~170s net)
 *
 * KEY V5 IMPROVEMENTS vs V4:
 *   • Cinematic dark-open arc: Scenes 00–04a on deep midnight bg
 *   • Ecosystem + closing return to dark (premium bookend)
 *   • Shorter CROSSFADE (20f vs 24f) = crisper cuts
 *   • Every intro scene is 10–30% tighter in pacing
 *   • New CinematicBG with deeper color depth + vignette
 *   • Premium typography: gradient text, bolder heroes, better weight contrast
 *   • More cinematic spring configs (purposeful, less bouncy)
 */
import React from 'react'
import { AbsoluteFill, Audio, Sequence, interpolate } from 'remotion'

import { Scene00_Opening,              SCENE00_DURATION }        from './scenes/Scene00_Opening'
import { Scene01_Problem,              SCENE01_DURATION }        from './scenes/Scene01_Problem'
import { Scene02_Vision,               SCENE02_DURATION }        from './scenes/Scene02_Vision'
import { Scene03_Introduction,         SCENE03_DURATION }        from './scenes/Scene03_Introduction'
import { Scene04_AITeacherIntro,       SCENE_AI_TEACHER_INTRO_DURATION } from './scenes/Scene04_AITeacherIntro'
import { Scene04_AIAssistant,          SCENE04_DURATION }        from './scenes/Scene04_AIAssistant'
import { Scene05_ImageStudioIntro,     SCENE_IMAGE_STUDIO_INTRO_DURATION } from './scenes/Scene05_ImageStudioIntro'
import { Scene05_VisualStudio,         SCENE05_DURATION }        from './scenes/Scene05_VisualStudio'
import { Scene06_YouTubeStudioIntro,   SCENE_YOUTUBE_STUDIO_INTRO_DURATION } from './scenes/Scene06_YouTubeIntro'
import { Scene06_YouTube,              SCENE06_DURATION }        from './scenes/Scene06_YouTube'
import { Scene07_PersonalizationIntro, SCENE07_INTRO_DURATION }  from './scenes/Scene07_PersonalizationIntro'
import { Scene07_Personalization,      SCENE07_DURATION }        from './scenes/Scene07_Personalization'
import {
  Scene07b_LearningHub,
  SCENE07B_DURATION,
  CLICK_AT,
  COURSE_ENTER,
  QUIZ_START,
  QUIZ_SUBMIT,
  CERT_START,
} from './scenes/Scene07b_LearningHub'
import { Scene08_Ecosystem,            SCENE08_DURATION }        from './scenes/Scene08_Ecosystem'
import { Scene10_Closing,              SCENE10_DURATION }        from './scenes/Scene10_Closing'

import { MUSIC_V5, SFX_V5 } from './assets'
import { CROSSFADE }      from './utils/sceneTransition'
import { musicLevelAt }   from './utils/sceneTransition'

// ── Scene start frames ────────────────────────────────────────────────────
const S0   = 0
const S1   = S0  + SCENE00_DURATION - CROSSFADE             // ~250
const S2   = S1  + SCENE01_DURATION - CROSSFADE             // ~515
const S3   = S2  + SCENE02_DURATION - CROSSFADE             // ~735
const S4   = S3  + SCENE03_DURATION - CROSSFADE             // ~1015
const S4b  = S4  + SCENE_AI_TEACHER_INTRO_DURATION          // ~1210
const S5   = S4b + SCENE04_DURATION - CROSSFADE             // ~1520
const S5b  = S5  + SCENE_IMAGE_STUDIO_INTRO_DURATION        // ~1700
const S6   = S5b + SCENE05_DURATION - CROSSFADE             // ~2160
const S6b  = S6  + SCENE_YOUTUBE_STUDIO_INTRO_DURATION      // ~2260
const S7   = S6b + SCENE06_DURATION - CROSSFADE             // ~2780
const S7b  = S7  + SCENE07_INTRO_DURATION - CROSSFADE       // ~3140
const S8   = S7b + SCENE07_DURATION - CROSSFADE             // ~3900
const S9   = S8  + SCENE07B_DURATION - CROSSFADE            // ~4750
const S10  = S9  + SCENE08_DURATION - CROSSFADE             // ~5210

export const TOTAL_DURATION_V5 = S10 + SCENE10_DURATION

/**
 * Music volume arc — cinematic narrative curve.
 * Dark scenes: low & atmospheric. Feature reveals: rising.
 * Full peak at ecosystem. Resolving fade at close.
 */
const musicVol = (f: number): number => {
  const level = musicLevelAt(f, [
    { at: 0,    level: 0.05 },
    { at: S1,   level: 0.06 },
    { at: S2,   level: 0.07 },
    { at: S3,   level: 0.09 },
    { at: S4,   level: 0.11 },
    { at: S4b,  level: 0.13 },
    { at: S5,   level: 0.15 },
    { at: S5b,  level: 0.14 },
    { at: S6,   level: 0.135 },
    { at: S6b,  level: 0.13 },
    { at: S7,   level: 0.135 },
    { at: S7b,  level: 0.14 },
    { at: S8,   level: 0.150 },
    { at: S9,   level: 0.155 },
    { at: S10,  level: 0.13 },
    { at: TOTAL_DURATION_V5, level: 0.05 },
  ])

  const fadeIn  = interpolate(f, [0, 45], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const fadeOut = interpolate(f, [TOTAL_DURATION_V5 - 90, TOTAL_DURATION_V5], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  return level * fadeIn * fadeOut
}

export const TutifyDemoV5: React.FC = () => (
  <AbsoluteFill style={{ background: '#F4F6F8' }}>

    {/* ══ MUSIC BED ══════════════════════════════════════════════════════════ */}
    <Audio src={MUSIC_V5} volume={(f) => musicVol(f)} loop />

    {/* ══ SCENE 00 — Cinematic Opening (0–270f · 9s) ═════════════════════════ */}
    <Sequence from={S0} durationInFrames={SCENE00_DURATION} premountFor={CROSSFADE}>
      <Scene00_Opening />
    </Sequence>

    {/* ══ SCENE 01 — Teachers Overwhelmed ════════════════════════════════════ */}
    <Sequence from={S1} durationInFrames={SCENE01_DURATION + CROSSFADE} premountFor={CROSSFADE}>
      <Scene01_Problem />
    </Sequence>

    {/* ══ SCENE 02 — Vision (dark → dawn) ════════════════════════════════════ */}
    <Sequence from={S2} durationInFrames={SCENE02_DURATION} premountFor={CROSSFADE}>
      <Scene02_Vision />
    </Sequence>

    {/* ══ SCENE 03 — Meet Tutify (deep indigo brand reveal) ══════════════════
        SFX: sparkle on logo, card appears for feature chips                */}
    <Sequence from={S3} durationInFrames={SCENE03_DURATION}>
      <Sequence from={6}><Audio src={SFX_V5.sparkle}    volume={0.38} /></Sequence>
      <Sequence from={148}><Audio src={SFX_V5.sparkle}  volume={0.30} /></Sequence>
      <Sequence from={220}><Audio src={SFX_V5.cardAppear} volume={0.22} /></Sequence>
      <Sequence from={240}><Audio src={SFX_V5.cardAppear} volume={0.22} /></Sequence>
      <Sequence from={260}><Audio src={SFX_V5.cardAppear} volume={0.22} /></Sequence>
      <Sequence from={280}><Audio src={SFX_V5.cardAppear} volume={0.22} /></Sequence>
      <Scene03_Introduction />
    </Sequence>

    {/* ══ SCENE 04a — AI Teacher Intro (dark beats) ══════════════════════════ */}
    <Sequence from={S4} durationInFrames={SCENE_AI_TEACHER_INTRO_DURATION} premountFor={CROSSFADE}>
      <Scene04_AITeacherIntro />
    </Sequence>

    {/* ══ SCENE 04b — AI Assistant (live generation) ═════════════════════════
        SFX: keyboard, button-click, sparkle, card × 3                     */}
    <Sequence from={S4b} durationInFrames={SCENE04_DURATION} premountFor={CROSSFADE}>
      <Sequence from={28}><Audio src={SFX_V5.keyboard}    volume={0.32} /></Sequence>
      <Sequence from={120}><Audio src={SFX_V5.buttonClick} volume={0.40} /></Sequence>
      <Sequence from={124}><Audio src={SFX_V5.sparkle}    volume={0.34} /></Sequence>
      <Sequence from={148}><Audio src={SFX_V5.cardAppear} volume={0.26} /></Sequence>
      <Sequence from={178}><Audio src={SFX_V5.cardAppear} volume={0.26} /></Sequence>
      <Sequence from={208}><Audio src={SFX_V5.cardAppear} volume={0.26} /></Sequence>
      <Scene04_AIAssistant />
    </Sequence>

    {/* ══ SCENE 05a — Image Studio Intro (dark, violet) ══════════════════════ */}
    <Sequence from={S5} durationInFrames={SCENE_IMAGE_STUDIO_INTRO_DURATION} premountFor={CROSSFADE}>
      <Scene05_ImageStudioIntro />
    </Sequence>

    {/* ══ SCENE 05b — PixGen Demo (v4) ═══════════════════════════════════════
        SFX: keyboard ×2, button-click ×2, sparkle ×2, completion ×2       */}
    <Sequence from={S5b} durationInFrames={SCENE05_DURATION} premountFor={CROSSFADE}>
      <Sequence from={72}><Audio src={SFX_V5.keyboard}    volume={0.28} /></Sequence>
      <Sequence from={148}><Audio src={SFX_V5.buttonClick} volume={0.34} /></Sequence>
      <Sequence from={152}><Audio src={SFX_V5.sparkle}    volume={0.30} /></Sequence>
      <Sequence from={212}><Audio src={SFX_V5.completion} volume={0.28} /></Sequence>
      <Sequence from={308}><Audio src={SFX_V5.keyboard}   volume={0.26} /></Sequence>
      <Sequence from={368}><Audio src={SFX_V5.buttonClick} volume={0.34} /></Sequence>
      <Sequence from={372}><Audio src={SFX_V5.sparkle}    volume={0.30} /></Sequence>
      <Sequence from={422}><Audio src={SFX_V5.completion} volume={0.28} /></Sequence>
      <Scene05_VisualStudio />
    </Sequence>

    {/* ══ SCENE 06a — YouTube Fun Studio Intro (dark) ════════════════════════ */}
    <Sequence from={S6} durationInFrames={SCENE_YOUTUBE_STUDIO_INTRO_DURATION} premountFor={CROSSFADE}>
      <Scene06_YouTubeStudioIntro />
    </Sequence>

    {/* ══ SCENE 06b — YouTube Quiz Demo (v4) ════════════════════════════════
        SFX: keyboard, button-click, sparkle, data-ping × 3, completion    */}
    <Sequence from={S6b} durationInFrames={SCENE06_DURATION} premountFor={CROSSFADE}>
      <Sequence from={36}><Audio src={SFX_V5.keyboard}    volume={0.28} /></Sequence>
      <Sequence from={102}><Audio src={SFX_V5.buttonClick} volume={0.36} /></Sequence>
      <Sequence from={106}><Audio src={SFX_V5.sparkle}    volume={0.32} /></Sequence>
      <Sequence from={178}><Audio src={SFX_V5.dataPing}   volume={0.26} /></Sequence>
      <Sequence from={196}><Audio src={SFX_V5.dataPing}   volume={0.26} /></Sequence>
      <Sequence from={214}><Audio src={SFX_V5.dataPing}   volume={0.26} /></Sequence>
      <Sequence from={248}><Audio src={SFX_V5.completion} volume={0.30} /></Sequence>
      <Scene06_YouTube />
    </Sequence>

    {/* ══ SCENE 07a — Personalization Intro (v4) ═════════════════════════════ */}
    <Sequence from={S7} durationInFrames={SCENE07_INTRO_DURATION} premountFor={CROSSFADE}>
      <Scene07_PersonalizationIntro />
    </Sequence>

    {/* ══ SCENE 07b — Personalization Demo (v4) ══════════════════════════════ */}
    <Sequence from={S7b} durationInFrames={SCENE07_DURATION} premountFor={CROSSFADE}>
      <Sequence from={78}><Audio src={SFX_V5.dataPing}   volume={0.24} /></Sequence>
      <Sequence from={130}><Audio src={SFX_V5.dataPing}   volume={0.24} /></Sequence>
      <Sequence from={168}><Audio src={SFX_V5.dataPing}   volume={0.24} /></Sequence>
      <Sequence from={205}><Audio src={SFX_V5.dataPing}   volume={0.24} /></Sequence>
      <Sequence from={248}><Audio src={SFX_V5.dataPing}   volume={0.24} /></Sequence>
      <Sequence from={330}><Audio src={SFX_V5.sparkle}    volume={0.32} /></Sequence>
      <Sequence from={340}><Audio src={SFX_V5.completion} volume={0.30} /></Sequence>
      <Sequence from={408}><Audio src={SFX_V5.sparkle}    volume={0.28} /></Sequence>
      <Sequence from={568}><Audio src={SFX_V5.sparkle}    volume={0.34} /></Sequence>
      <Scene07_Personalization />
    </Sequence>

    {/* ══ SCENE 07c — Learning Hub Walkthrough (v4) ══════════════════════════ */}
    <Sequence from={S8} durationInFrames={SCENE07B_DURATION} premountFor={CROSSFADE}>
      <Sequence from={CLICK_AT - 8}><Audio src={SFX_V5.buttonClick} volume={0.34} /></Sequence>
      <Sequence from={COURSE_ENTER}><Audio src={SFX_V5.cardAppear}  volume={0.26} /></Sequence>
      <Sequence from={QUIZ_START + 20}><Audio src={SFX_V5.dataPing} volume={0.22} /></Sequence>
      <Sequence from={QUIZ_SUBMIT}><Audio src={SFX_V5.completion}   volume={0.32} /></Sequence>
      <Sequence from={CERT_START}><Audio src={SFX_V5.sparkle}       volume={0.36} /></Sequence>
      <Scene07b_LearningHub />
    </Sequence>

    {/* ══ SCENE 08 — Ecosystem (dark cinematic) ══════════════════════════════
        SFX: sparkle (center), data-ping × 5 (nodes)                       */}
    <Sequence from={S9} durationInFrames={SCENE08_DURATION} premountFor={CROSSFADE}>
      <Sequence from={16}><Audio src={SFX_V5.sparkle}   volume={0.32} /></Sequence>
      <Sequence from={225}><Audio src={SFX_V5.dataPing} volume={0.26} /></Sequence>
      <Sequence from={245}><Audio src={SFX_V5.dataPing} volume={0.26} /></Sequence>
      <Sequence from={265}><Audio src={SFX_V5.dataPing} volume={0.26} /></Sequence>
      <Sequence from={285}><Audio src={SFX_V5.dataPing} volume={0.26} /></Sequence>
      <Sequence from={305}><Audio src={SFX_V5.dataPing} volume={0.26} /></Sequence>
      <Sequence from={380}><Audio src={SFX_V5.sparkle}  volume={0.34} /></Sequence>
      <Scene08_Ecosystem />
    </Sequence>

    {/* ══ SCENE 10 — Closing (dark premium finale) ═══════════════════════════ */}
    <Sequence from={S10} durationInFrames={SCENE10_DURATION} premountFor={CROSSFADE}>
      <Sequence from={122}><Audio src={SFX_V5.sparkle}    volume={0.34} /></Sequence>
      <Sequence from={198}><Audio src={SFX_V5.completion} volume={0.40} /></Sequence>
      <Sequence from={328}><Audio src={SFX_V5.keyboard}   volume={0.22} /></Sequence>
      <Scene10_Closing />
    </Sequence>

  </AbsoluteFill>
)
