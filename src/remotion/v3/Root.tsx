/**
 * TutifyDemoV3 — 60-second cinematic launch video.
 *
 * MASTER TIMELINE (1800 frames @ 30 fps = 60 s):
 *   Scene | Start | End  | Duration | Story
 *   01    |     0 |  240 |  240 (8s) | The Hook      — teacher working late
 *   02    |   240 |  450 |  210 (7s) | The Problem   — tool overload chaos
 *   03    |   450 |  750 |  300 (10s)| AI Magic      — hero generation moment
 *   04    |   750 | 1350 |  600 (20s)| Features Flow — 4×150f sub-narrations
 *   05    |  1350 | 1560 |  210 (7s) | Ecosystem     — connected platform
 *   06    |  1560 | 1800 |  240 (8s) | Vision Close  — brand finale
 *
 * AUDIO LAYERS:
 *   1. Music bed  — full 1800f, scene-based gain (0.09–0.14, ducked under VO)
 *   2. Voiceover  — 9 segments mapped to 6 scenes (Scene 4 has 4 sub-narrations)
 *   3. SFX        — nested <Sequence from={localFrame}> per event
 */
import React from 'react'
import { AbsoluteFill, Audio, Sequence, interpolate } from 'remotion'

import { Scene1Hook,      SCENE1_DURATION } from './scenes/Scene1Hook'
import { Scene2Problem,   SCENE2_DURATION } from './scenes/Scene2Problem'
import { Scene3AIMagic,   SCENE3_DURATION } from './scenes/Scene3AIMagic'
import { Scene4Features,  SCENE4_DURATION } from './scenes/Scene4Features'
import { Scene5Ecosystem, SCENE5_DURATION } from './scenes/Scene5Ecosystem'
import { Scene6Vision,    SCENE6_DURATION } from './scenes/Scene6Vision'

import { MUSIC_V3, VO_V3, SFX_V3 } from './assets'

// ── Scene start frames ────────────────────────────────────────────────────────
const S1 = 0
const S2 = S1 + SCENE1_DURATION   // 240
const S3 = S2 + SCENE2_DURATION   // 450
const S4 = S3 + SCENE3_DURATION   // 750
const S5 = S4 + SCENE4_DURATION   // 1350
const S6 = S5 + SCENE5_DURATION   // 1560

export const TOTAL_DURATION_V3 = S6 + SCENE6_DURATION  // 1800

/**
 * Music volume curve:
 *   - Ducked during VO presence (VO is at 0.88, music sits low beneath it)
 *   - Fades in over first 45f and out over last 45f
 *   - Slight swell for Scene 5 ecosystem reveal
 */
const musicVol = (f: number): number => {
  let level: number
  if      (f < S2) level = 0.09  // Scene 1 — intimate late-night hook
  else if (f < S3) level = 0.11  // Scene 2 — tension lift
  else if (f < S4) level = 0.12  // Scene 3 — AI magic moment
  else if (f < S5) level = 0.13  // Scene 4 — feature energy
  else if (f < S6) level = 0.14  // Scene 5 — ecosystem swell
  else             level = 0.10  // Scene 6 — reflective close

  const fadeIn  = interpolate(f, [0, 45], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const fadeOut = interpolate(f, [TOTAL_DURATION_V3 - 45, TOTAL_DURATION_V3], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  return level * fadeIn * fadeOut
}

export const TutifyDemoV3: React.FC = () => (
  <AbsoluteFill>

    {/* ══ MUSIC BED — full composition ════════════════════════════════════ */}
    <Audio src={MUSIC_V3} volume={(f) => musicVol(f)} />

    {/* ══ SCENE 1 — The Hook (0–240f · 8s) ═══════════════════════════════
        VO: "It's 9 PM. The students are home… but the teacher is still working."
        SFX: none — pure cinematic atmosphere                                 */}
    <Sequence from={S1} durationInFrames={SCENE1_DURATION}>
      <Audio src={VO_V3.scene1} volume={0.88} />
      <Scene1Hook />
    </Sequence>

    {/* ══ SCENE 2 — The Problem (240–450f · 7s) ═══════════════════════════
        VO: "Too many tools. Too much manual work. And no clear path into the AI era."
        SFX: thud × 8 (tab chaos) → pile-settle (freeze/Tutify reveal)       */}
    <Sequence from={S2} durationInFrames={SCENE2_DURATION}>
      <Audio src={VO_V3.scene2} volume={0.88} />
      {/* Tab appearance thuds — escalating volume as chaos grows */}
      <Sequence from={0}>  <Audio src={SFX_V3.thud} volume={0.20} /></Sequence>
      <Sequence from={7}>  <Audio src={SFX_V3.thud} volume={0.22} /></Sequence>
      <Sequence from={14}> <Audio src={SFX_V3.thud} volume={0.24} /></Sequence>
      <Sequence from={21}> <Audio src={SFX_V3.thud} volume={0.26} /></Sequence>
      <Sequence from={28}> <Audio src={SFX_V3.thud} volume={0.28} /></Sequence>
      <Sequence from={35}> <Audio src={SFX_V3.thud} volume={0.30} /></Sequence>
      <Sequence from={42}> <Audio src={SFX_V3.thud} volume={0.32} /></Sequence>
      <Sequence from={49}> <Audio src={SFX_V3.thud} volume={0.33} /></Sequence>
      {/* Everything settles when Tutify logo appears at freeze frame 170 */}
      <Sequence from={170}><Audio src={SFX_V3.pileSettle} volume={0.28} /></Sequence>
      <Scene2Problem />
    </Sequence>

    {/* ══ SCENE 3 — AI Magic Moment (450–750f · 10s) ══════════════════════
        VO: "Meet Tutify. Your AI-powered teaching assistant."
        SFX: keyboard → button-click → sparkle → card × 4                    */}
    <Sequence from={S3} durationInFrames={SCENE3_DURATION}>
      <Audio src={VO_V3.scene3} volume={0.88} />
      {/* Typewriter starts at local frame 38 */}
      <Sequence from={38}> <Audio src={SFX_V3.keyboard}    volume={0.32} /></Sequence>
      {/* Generate button click at frame 122 */}
      <Sequence from={122}><Audio src={SFX_V3.buttonClick} volume={0.38} /></Sequence>
      {/* AI generation sparkle at frame 140 */}
      <Sequence from={140}><Audio src={SFX_V3.sparkle}     volume={0.32} /></Sequence>
      {/* Four output cards appear staggered from frame 142 */}
      <Sequence from={142}><Audio src={SFX_V3.cardAppear}  volume={0.24} /></Sequence>
      <Sequence from={162}><Audio src={SFX_V3.cardAppear}  volume={0.24} /></Sequence>
      <Sequence from={182}><Audio src={SFX_V3.cardAppear}  volume={0.24} /></Sequence>
      <Sequence from={202}><Audio src={SFX_V3.cardAppear}  volume={0.24} /></Sequence>
      <Scene3AIMagic />
    </Sequence>

    {/* ══ SCENE 4 — Features Flow (750–1350f · 20s) ═══════════════════════
        4 sub-narrations, one per feature (150f each)
        SFX woven through all 4 feature segments                              */}
    <Sequence from={S4} durationInFrames={SCENE4_DURATION}>

      {/* — Feature A VO (0–150f): "Generate quizzes, exams, and worksheets in seconds." */}
      <Sequence from={0}   durationInFrames={150}><Audio src={VO_V3.scene4a} volume={0.88} /></Sequence>
      {/* — Feature B VO (150–300f): "Turn complex ideas into visual learning." */}
      <Sequence from={150} durationInFrames={150}><Audio src={VO_V3.scene4b} volume={0.88} /></Sequence>
      {/* — Feature C VO (300–450f): "Transform any video into interactive classroom activities." */}
      <Sequence from={300} durationInFrames={150}><Audio src={VO_V3.scene4c} volume={0.88} /></Sequence>
      {/* — Feature D VO (450–600f): "Personalized pathways for every educator." */}
      <Sequence from={450} durationInFrames={150}><Audio src={VO_V3.scene4d} volume={0.88} /></Sequence>

      {/* Feature A SFX — quiz rows appearing at 40, 62, 84 */}
      <Sequence from={40}> <Audio src={SFX_V3.cardAppear} volume={0.22} /></Sequence>
      <Sequence from={62}> <Audio src={SFX_V3.cardAppear} volume={0.22} /></Sequence>
      <Sequence from={84}> <Audio src={SFX_V3.cardAppear} volume={0.22} /></Sequence>

      {/* Feature B SFX — AI-generated images ping in at 162, 185 */}
      <Sequence from={162}><Audio src={SFX_V3.dataPing}   volume={0.28} /></Sequence>
      <Sequence from={185}><Audio src={SFX_V3.dataPing}   volume={0.28} /></Sequence>

      {/* Feature C SFX — AI transform spark 380, output cards 402, 416, 430 */}
      <Sequence from={380}><Audio src={SFX_V3.buttonClick} volume={0.28} /></Sequence>
      <Sequence from={402}><Audio src={SFX_V3.cardAppear}  volume={0.22} /></Sequence>
      <Sequence from={416}><Audio src={SFX_V3.cardAppear}  volume={0.22} /></Sequence>
      <Sequence from={430}><Audio src={SFX_V3.cardAppear}  volume={0.22} /></Sequence>

      {/* Feature D SFX — personalization nodes appear at 468, 484, 500, 516 */}
      <Sequence from={468}><Audio src={SFX_V3.cardAppear}  volume={0.18} /></Sequence>
      <Sequence from={484}><Audio src={SFX_V3.cardAppear}  volume={0.18} /></Sequence>
      <Sequence from={500}><Audio src={SFX_V3.cardAppear}  volume={0.18} /></Sequence>
      <Sequence from={516}><Audio src={SFX_V3.cardAppear}  volume={0.18} /></Sequence>

      <Scene4Features />
    </Sequence>

    {/* ══ SCENE 5 — Ecosystem (1350–1560f · 7s) ═══════════════════════════
        VO: "One platform connecting teachers, students, parents, and schools."
        SFX: data-ping × 4 as network nodes connect                          */}
    <Sequence from={S5} durationInFrames={SCENE5_DURATION}>
      <Audio src={VO_V3.scene5} volume={0.88} />
      {/* 4 ecosystem nodes connect — staggered 14f apart from frame 34 */}
      <Sequence from={34}><Audio src={SFX_V3.dataPing} volume={0.26} /></Sequence>
      <Sequence from={48}><Audio src={SFX_V3.dataPing} volume={0.26} /></Sequence>
      <Sequence from={62}><Audio src={SFX_V3.dataPing} volume={0.26} /></Sequence>
      <Sequence from={76}><Audio src={SFX_V3.dataPing} volume={0.26} /></Sequence>
      <Scene5Ecosystem />
    </Sequence>

    {/* ══ SCENE 6 — Vision Close (1560–1800f · 8s) ════════════════════════
        VO: "Not replacing teachers. Empowering them. This is the future…"
        SFX: sunrise (classroom reveal) → completion (brand wordmark)         */}
    <Sequence from={S6} durationInFrames={SCENE6_DURATION}>
      <Audio src={VO_V3.scene6} volume={0.88} />
      {/* Future classroom reveal */}
      <Sequence from={0}>  <Audio src={SFX_V3.sunrise}    volume={0.32} /></Sequence>
      {/* Tutify wordmark materialises at phase 2, local frame 152 */}
      <Sequence from={152}><Audio src={SFX_V3.completion} volume={0.38} /></Sequence>
      <Scene6Vision />
    </Sequence>

  </AbsoluteFill>
)
