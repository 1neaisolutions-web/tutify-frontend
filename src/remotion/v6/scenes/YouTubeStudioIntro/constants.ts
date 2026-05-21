/**
 * YouTube Fun Studio intro — cumulative tagline, Vision pacing (~7s @ 30fps).
 */
import { CROSSFADE } from '../../utils/sceneTransition'

export const TITLE_START = 12
export const TAGLINE_START = 50
export const MORPH_START = TAGLINE_START - 6
export const TITLE_MORPH_END = TAGLINE_START + 38
export const WORD_STAGGER = 12
export const ROW_GAP = 10
export const WORD_SETTLE = 28
export const HOLD_FRAMES = 50

export const TAGLINE_ROWS = [
  ['Turn', 'everyday', 'videos'],
  ['into', 'meaningful', 'learning.'],
] as const

/** Orange emphasis — premium light intro (image 2) */
export const TAGLINE_EMPHASIS = new Set<string>(['videos', 'meaningful', 'learning.'])

export const INK = '#111827'
export const ORANGE = '#F97316'
export const PILL_BG = 'rgba(249, 115, 22, 0.12)'

function buildWordStarts(): { row: number; col: number; start: number }[] {
  const entries: { row: number; col: number; start: number }[] = []
  let t = TAGLINE_START
  TAGLINE_ROWS.forEach((row, ri) => {
    row.forEach((_, ci) => {
      entries.push({ row: ri, col: ci, start: t + ci * WORD_STAGGER })
    })
    t += row.length * WORD_STAGGER + ROW_GAP
  })
  return entries
}

export const TAGLINE_WORD_STARTS = buildWordStarts()

const lastStart = TAGLINE_WORD_STARTS[TAGLINE_WORD_STARTS.length - 1]!.start
export const TAGLINE_COMPLETE = lastStart + WORD_SETTLE
export const SCENE_FADE_START = TAGLINE_COMPLETE + HOLD_FRAMES
export const SCENE_YOUTUBE_STUDIO_INTRO_DURATION = SCENE_FADE_START + CROSSFADE
