/**
 * TutifyDemoV2 — master 90-second composition.
 *
 * MASTER TIMELINE (locked):
 *   Beat  | Start | End  | Dur  | Type
 *   01    |    0 |  267 | 267  | A — Documentary image
 *   02    |  267 |  621 | 354  | A — Blurred image + word pile
 *   03    |  621 | 1017 | 396  | B — Golden hour sunrise
 *   04    | 1017 | 1377 | 360  | C — Hero product UI
 *   05    | 1377 | 1677 | 300  | C — Feature grid
 *   06    | 1677 | 1977 | 300  | C — People + PNG images
 *   07    | 1977 | 2277 | 300  | D — Stats + world map
 *   08    | 2277 | 2577 | 300  | A — Vision statement
 *   09    | 2577 | 2817 | 240  | B — Brand closer
 *   Total: 2817 frames = 93.9 s
 *
 * AUDIO LAYERS:
 *   1. Music bed — full timeline (AbsoluteFill level)
 *   2. Voiceover — per-beat, inside each <Sequence>
 *   3. SFX — nested <Sequence from={localFrame}> inside each beat
 */
import React from 'react'
import { AbsoluteFill, Audio, Sequence } from 'remotion'

import { Beat01_Recognition, BEAT01_DURATION } from './beats/Beat01_Recognition'
import { Beat02_TheWeight,   BEAT02_DURATION } from './beats/Beat02_TheWeight'
import { Beat03_ThePromise,  BEAT03_DURATION } from './beats/Beat03_ThePromise'
import { Beat04_MagicMoment, BEAT04_DURATION } from './beats/Beat04_MagicMoment'
import { Beat05_NotJustOneThing, BEAT05_DURATION } from './beats/Beat05_NotJustOneThing'
import { Beat06_ThePeople,   BEAT06_DURATION } from './beats/Beat06_ThePeople'
import { Beat07_TheProof,    BEAT07_DURATION } from './beats/Beat07_TheProof'
import { Beat08_TheVision,   BEAT08_DURATION } from './beats/Beat08_TheVision'
import { Beat09_TheInvitation, BEAT09_DURATION } from './beats/Beat09_TheInvitation'

import { MUSIC, VO, SFX } from './assets'

// Global beat start frames
const B01 = 0
const B02 = B01 + BEAT01_DURATION   // 267
const B03 = B02 + BEAT02_DURATION   // 621
const B04 = B03 + BEAT03_DURATION   // 1017
const B05 = B04 + BEAT04_DURATION   // 1377
const B06 = B05 + BEAT05_DURATION   // 1677
const B07 = B06 + BEAT06_DURATION   // 1977
const B08 = B07 + BEAT07_DURATION   // 2277
const B09 = B08 + BEAT08_DURATION   // 2577

export const TOTAL_DURATION = B09 + BEAT09_DURATION  // 2817

export const TutifyDemoV2: React.FC = () => (
  <AbsoluteFill>

    {/* ══ MUSIC BED — plays the full 2817 frames ══════════════════════════════
        Volume morphs: 0.20 default → 0.25 during Beat08 (vision swell)
        → 0.18 during Beat09 (resolves for final hold) */}
    <Audio
      src={MUSIC}
      volume={(f) => {
        if (f >= B08 && f < B09) return 0.25   // Beat 08 — swell
        if (f >= B09) return 0.18              // Beat 09 — resolve
        return 0.20
      }}
    />

    {/* ══ BEAT 01 — Recognition ══════════════════════════════════════════════ */}
    <Sequence from={B01} durationInFrames={BEAT01_DURATION}>
      <Audio src={VO.beat01} volume={1.0} />
      <Beat01_Recognition />
    </Sequence>

    {/* ══ BEAT 02 — The Weight ═══════════════════════════════════════════════ */}
    <Sequence from={B02} durationInFrames={BEAT02_DURATION}>
      <Audio src={VO.beat02} volume={1.0} />
      {/* 5 word-drop thuds — escalating volume as pile grows */}
      <Sequence from={22}>  <Audio src={SFX.thud} volume={0.30} /></Sequence>
      <Sequence from={57}>  <Audio src={SFX.thud} volume={0.33} /></Sequence>
      <Sequence from={92}>  <Audio src={SFX.thud} volume={0.35} /></Sequence>
      <Sequence from={127}> <Audio src={SFX.thud} volume={0.38} /></Sequence>
      <Sequence from={162}> <Audio src={SFX.thud} volume={0.40} /></Sequence>
      {/* Pile settles when "Teaching" rises */}
      <Sequence from={215}> <Audio src={SFX.pileSettle} volume={0.30} /></Sequence>
      <Beat02_TheWeight />
    </Sequence>

    {/* ══ BEAT 03 — The Promise ══════════════════════════════════════════════ */}
    <Sequence from={B03} durationInFrames={BEAT03_DURATION}>
      <Audio src={VO.beat03} volume={1.0} />
      {/* Sunrise sound fires as the golden-hour image blooms */}
      <Sequence from={5}> <Audio src={SFX.sunrise} volume={0.40} /></Sequence>
      <Beat03_ThePromise />
    </Sequence>

    {/* ══ BEAT 04 — Magic Moment ═════════════════════════════════════════════ */}
    <Sequence from={B04} durationInFrames={BEAT04_DURATION}>
      <Audio src={VO.beat04} volume={1.0} />
      <Sequence from={80}>  <Audio src={SFX.keyboard}    volume={0.40} /></Sequence>
      <Sequence from={210}> <Audio src={SFX.buttonClick} volume={0.40} /></Sequence>
      <Sequence from={230}> <Audio src={SFX.sparkle}     volume={0.35} /></Sequence>
      <Beat04_MagicMoment />
    </Sequence>

    {/* ══ BEAT 05 — Not Just One Thing ══════════════════════════════════════ */}
    <Sequence from={B05} durationInFrames={BEAT05_DURATION}>
      <Audio src={VO.beat05} volume={1.0} />
      {/* Card appearance sounds — 4 cards, 18f apart */}
      <Sequence from={0}>  <Audio src={SFX.cardAppear} volume={0.28} /></Sequence>
      <Sequence from={18}> <Audio src={SFX.cardAppear} volume={0.28} /></Sequence>
      <Sequence from={36}> <Audio src={SFX.cardAppear} volume={0.28} /></Sequence>
      <Sequence from={54}> <Audio src={SFX.cardAppear} volume={0.28} /></Sequence>
      <Beat05_NotJustOneThing />
    </Sequence>

    {/* ══ BEAT 06 — The People ══════════════════════════════════════════════ */}
    <Sequence from={B06} durationInFrames={BEAT06_DURATION}>
      <Audio src={VO.beat06} volume={1.0} />
      {/* Polaroid placement sounds — 4 cards, 25f apart */}
      <Sequence from={0}>  <Audio src={SFX.cardAppear} volume={0.30} /></Sequence>
      <Sequence from={25}> <Audio src={SFX.cardAppear} volume={0.30} /></Sequence>
      <Sequence from={50}> <Audio src={SFX.cardAppear} volume={0.30} /></Sequence>
      <Sequence from={75}> <Audio src={SFX.cardAppear} volume={0.30} /></Sequence>
      <Beat06_ThePeople />
    </Sequence>

    {/* ══ BEAT 07 — The Proof ════════════════════════════════════════════════ */}
    <Sequence from={B07} durationInFrames={BEAT07_DURATION}>
      <Audio src={VO.beat07} volume={1.0} />
      {/* Data ping fires as each stat number lands */}
      <Sequence from={36}>  <Audio src={SFX.dataPing} volume={0.35} /></Sequence>
      <Sequence from={66}>  <Audio src={SFX.dataPing} volume={0.35} /></Sequence>
      <Sequence from={108}> <Audio src={SFX.dataPing} volume={0.35} /></Sequence>
      <Beat07_TheProof />
    </Sequence>

    {/* ══ BEAT 08 — The Vision ═══════════════════════════════════════════════ */}
    <Sequence from={B08} durationInFrames={BEAT08_DURATION}>
      <Audio src={VO.beat08} volume={1.0} />
      <Beat08_TheVision />
    </Sequence>

    {/* ══ BEAT 09 — The Invitation ═══════════════════════════════════════════ */}
    <Sequence from={B09} durationInFrames={BEAT09_DURATION}>
      <Audio src={VO.beat09} volume={1.0} />
      {/* Completion chime at beat open */}
      <Sequence from={0}> <Audio src={SFX.completion} volume={0.40} /></Sequence>
      <Beat09_TheInvitation />
    </Sequence>

  </AbsoluteFill>
)
