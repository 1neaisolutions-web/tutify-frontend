/**
 * V3 Audio Asset Registry
 *
 * VO files  — direct Vite imports from src/remotion/v3/ (9 segments)
 * Music     — staticFile from public/remotion-assets/v3/ (user already copied)
 * SFX       — staticFile reused from public/remotion-assets/v2/sfx/ (shared with V2)
 *
 * 9 VO segments → 6 visual scenes:
 *   scene1 → Scene 1 Hook
 *   scene2 → Scene 2 Problem
 *   scene3 → Scene 3 AI Magic
 *   scene4 → Scene 4 Feature A (Quizzes)
 *   scene5 → Scene 4 Feature B (Image Studio)
 *   scene6 → Scene 4 Feature C (YouTube)
 *   scene7 → Scene 4 Feature D (Personalized)
 *   scene8 → Scene 5 Ecosystem
 *   scene9 → Scene 6 Vision Close
 */
import { staticFile } from 'remotion'

// ── Voiceover (9 segments) ────────────────────────────────────────────────────
import vo1 from './scene1.mp3'
import vo2 from './scene2.mp3'
import vo3 from './scene3.mp3'
import vo4 from './scene4.mp3'
import vo5 from './scene5.mp3'
import vo6 from './scene6.mp3'
import vo7 from './scene7.mp3'
import vo8 from './scene8.mp3'
import vo9 from './scene9.mp3'

export const VO_V3 = {
  scene1:  vo1,  // "It's 9 PM…"
  scene2:  vo2,  // "Too many tools…"
  scene3:  vo3,  // "Meet Tutify…"
  scene4a: vo4,  // "Generate quizzes, exams, and worksheets in seconds."
  scene4b: vo5,  // "Turn complex ideas into visual learning."
  scene4c: vo6,  // "Transform any video into interactive classroom activities."
  scene4d: vo7,  // "Personalized pathways for every educator."
  scene5:  vo8,  // "One platform connecting…"
  scene6:  vo9,  // "Not replacing teachers. Empowering them…"
} as const

// ── Background Music ──────────────────────────────────────────────────────────
// File is in public/remotion-assets/v3/pluck-loop-blueprint.mp3
export const MUSIC_V3 = staticFile('remotion-assets/v3/pluck-loop-blueprint.mp3')

// ── SFX — reused from V2 public assets ───────────────────────────────────────
const sfxBase = 'remotion-assets/v2/sfx'
export const SFX_V3 = {
  thud:        staticFile(`${sfxBase}/sfx-thud.mp3`),
  pileSettle:  staticFile(`${sfxBase}/sfx-pile-settle.mp3`),
  sunrise:     staticFile(`${sfxBase}/sfx-sunrise.mp3`),
  keyboard:    staticFile(`${sfxBase}/sfx-keyboard.mp3`),
  buttonClick: staticFile(`${sfxBase}/sfx-button-click.mp3`),
  sparkle:     staticFile(`${sfxBase}/sfx-sparkle.mp3`),
  cardAppear:  staticFile(`${sfxBase}/sfx-card-appear.mp3`),
  dataPing:    staticFile(`${sfxBase}/sfx-data-ping.mp3`),
  completion:  staticFile(`${sfxBase}/sfx-completion.mp3`),
} as const
