/**
 * Central asset registry — all V2 remotion assets served from public/remotion-assets/v2/.
 * Always use staticFile() so paths resolve correctly in both studio and render.
 */
import { staticFile } from 'remotion'

const base = 'remotion-assets/v2'

// ── Images ──────────────────────────────────────────────────────────────────
export const IMG = {
  teacherDimRoom:    staticFile(`${base}/images/teacher-dim-room.png`),
  teacherSunlight:   staticFile(`${base}/images/teacher-sunlight.png`),
  clockBlueHour:     staticFile(`${base}/images/clock-blue-hour.png`),
  clockGoldenHour:   staticFile(`${base}/images/clock-golden-hour.png`),
  boyWithTablet:     staticFile(`${base}/images/boy-with-tablet.png`),
  teacherAndStudent: staticFile(`${base}/images/teacher-and-student.png`),
} as const

// ── Music ────────────────────────────────────────────────────────────────────
export const MUSIC = staticFile(`${base}/music.mp3`)

// ── Voiceover — one file per beat ───────────────────────────────────────────
export const VO = {
  beat01: staticFile(`${base}/voiceover/vo-beat-01.mp3`),
  beat02: staticFile(`${base}/voiceover/vo-beat-02.mp3`),
  beat03: staticFile(`${base}/voiceover/vo-beat-03.mp3`),
  beat04: staticFile(`${base}/voiceover/vo-beat-04.mp3`),
  beat05: staticFile(`${base}/voiceover/vo-beat-05.mp3`),
  beat06: staticFile(`${base}/voiceover/vo-beat-06.mp3`),
  beat07: staticFile(`${base}/voiceover/vo-beat-07.mp3`),
  beat08: staticFile(`${base}/voiceover/vo-beat-08.mp3`),
  beat09: staticFile(`${base}/voiceover/vo-beat-09.mp3`),
} as const

// ── SFX ──────────────────────────────────────────────────────────────────────
export const SFX = {
  thud:        staticFile(`${base}/sfx/sfx-thud.mp3`),
  pileSettle:  staticFile(`${base}/sfx/sfx-pile-settle.mp3`),
  sunrise:     staticFile(`${base}/sfx/sfx-sunrise.mp3`),
  keyboard:    staticFile(`${base}/sfx/sfx-keyboard.mp3`),
  buttonClick: staticFile(`${base}/sfx/sfx-button-click.mp3`),
  sparkle:     staticFile(`${base}/sfx/sfx-sparkle.mp3`),
  cardAppear:  staticFile(`${base}/sfx/sfx-card-appear.mp3`),
  dataPing:    staticFile(`${base}/sfx/sfx-data-ping.mp3`),
  completion:  staticFile(`${base}/sfx/sfx-completion.mp3`),
} as const
