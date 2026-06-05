/**
 * AI Teacher intro — show center → fade out in place → pill + tagline (no rise).
 */
import { CROSSFADE } from '../../utils/sceneTransition'

export const TITLE_START = 10
export const TITLE_IN_FRAMES = 10
export const TITLE_HOLD_FRAMES = 14
export const HERO_FADE_START = TITLE_START + TITLE_IN_FRAMES + TITLE_HOLD_FRAMES
export const HERO_FADE_FRAMES = 20
export const HERO_FADE_END = HERO_FADE_START + HERO_FADE_FRAMES

export const PILL_IN_START = HERO_FADE_START + 8
export const PILL_IN_END = HERO_FADE_END
export const TAGLINE_REVEAL_START = HERO_FADE_START + 12
export const TAGLINE_REVEAL_FRAMES = 16
export const TAGLINE_START = HERO_FADE_START + 16

export const WORD_STAGGER = 6
export const ROW_GAP = 6
export const WORD_IN_FRAMES = 16
export const HOLD_FRAMES = 18
export const SCENE_FADE_OUT_FRAMES = CROSSFADE

export const TAGLINE_ROWS = [
  ['Create', 'quizzes,', 'worksheets,'],
  ['lesson', 'plans,', 'and', 'classroom'],
  ['activities', 'in', 'seconds.'],
] as const

export const TAGLINE_EMPHASIS = new Set<string>([
  'quizzes,',
  'worksheets,',
  'plans,',
  'seconds.',
])

const INK = '#111827'
const PURPLE = '#5B4FCF'
const PILL_BG = 'rgba(91, 79, 207, 0.12)'

export { INK, PURPLE, PILL_BG }

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
export const TAGLINE_COMPLETE = lastStart + WORD_IN_FRAMES
export const SCENE_FADE_START = TAGLINE_COMPLETE + HOLD_FRAMES
export const SCENE_AI_TEACHER_INTRO_DURATION = SCENE_FADE_START + SCENE_FADE_OUT_FRAMES
