/**
 * AI Teacher intro — 270f @ 30fps. Tagline builds cumulatively (Vision pacing).
 */
export const SCENE_AI_TEACHER_INTRO_DURATION = 270

export const TITLE_START = 12
export const TAGLINE_START = 44
/** Begin hero → pill morph slightly before tagline words */
export const MORPH_START = TAGLINE_START - 6
/** Longer morph window for smooth crossfade + rise */
export const TITLE_MORPH_END = TAGLINE_START + 38
export const WORD_STAGGER = 12
export const ROW_GAP = 12
export const WORD_SETTLE = 28
export const HOLD_FRAMES = 56
export const SCENE_FADE_START = 236

export const TAGLINE_ROWS = [
  ['Create', 'quizzes,', 'worksheets,'],
  ['lesson', 'plans,', 'and', 'classroom'],
  ['activities', 'in', 'seconds.'],
] as const

/** Purple emphasis — matches premium light intro (image 2) */
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
export const TAGLINE_COMPLETE = lastStart + WORD_SETTLE
