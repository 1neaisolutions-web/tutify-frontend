/** Scene 10 — closing (readable pace, intro-sized type) */
import { CROSSFADE } from '../../utils/sceneTransition'

export const FINALE_TAGLINE = 'The self-learning support OS'

const LINE1_START = 8
const LINE1_STAGGER = 8
const LINE1_WORDS = 7
const LINE1_SETTLE = 20
const HOLD_AFTER_LINE1 = 18

const LINE2_STAGGER = 8
const LINE2_WORDS = 3
const LINE2_SETTLE = 16
const HOLD_AFTER_LINE2 = 12

const LINE1_LAST_START = LINE1_START + (LINE1_WORDS - 1) * LINE1_STAGGER
export const LINE1_DONE = LINE1_LAST_START + LINE1_SETTLE

export const P2_START = LINE1_DONE + HOLD_AFTER_LINE1

const LINE2_LAST_START = P2_START + 8 + (LINE2_WORDS - 1) * LINE2_STAGGER
export const LINE2_DONE = LINE2_LAST_START + LINE2_SETTLE + HOLD_AFTER_LINE2

export const P3_START = LINE2_DONE + 6
export const P4_START = P3_START + 78

/** Finale typewriter — must finish before scene exit fade (see SCENE10_DURATION). */
export const FINALE_TYPE_DELAY = 10
export const FINALE_CHAR_FRAMES = 2
export const FINALE_TYPE_START = P4_START + FINALE_TYPE_DELAY
export const FINALE_TYPE_END =
  FINALE_TYPE_START + FINALE_TAGLINE.length * FINALE_CHAR_FRAMES
export const FINALE_HOLD = 52

export const SCENE10_DURATION = FINALE_TYPE_END + FINALE_HOLD + CROSSFADE

export const P1_TEXT_END = LINE1_DONE + HOLD_AFTER_LINE1
export const P2_FADE_OUT = LINE2_DONE
export const P2_END = P3_START
export const P3_END = P4_START + 8
export const P4_END = SCENE10_DURATION

export { LINE1_START, LINE1_STAGGER, LINE2_STAGGER }
