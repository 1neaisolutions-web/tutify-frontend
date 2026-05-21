import { staticFile } from 'remotion'
import logoSrc from '../logo.jpeg'

export const LOGO_SRC = logoSrc

// Music — reuse V3 background track
export const MUSIC_V4 = staticFile('remotion-assets/v3/pluck-loop-blueprint.mp3')

// SFX — reuse V2 public assets
const sfxBase = 'remotion-assets/v2/sfx'
export const SFX_V4 = {
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
