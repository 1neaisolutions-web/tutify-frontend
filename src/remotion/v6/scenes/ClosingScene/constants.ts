/** Scene 10 — closing (readable pace, intro-sized type) */
import { CROSSFADE } from '../../utils/sceneTransition'
import {
  TEXT_REVEAL_STAGGER,
  TEXT_REVEAL_SETTLE,
  TEXT_REVEAL_HOLD,
  TEXT_REVEAL_CROSSFADE,
} from '../../timeline/sceneRhythm'

export const FINALE_TAGLINE = 'The self-learning support OS'

const LINE1_START = 8
const LINE1_STAGGER = TEXT_REVEAL_STAGGER
const LINE1_WORDS = 7
const LINE1_SETTLE = TEXT_REVEAL_SETTLE
const HOLD_AFTER_LINE1 = 12
/** 3D card flip between “future of education…” and “It’s already here.” */
export const CARD_FLIP_DURATION = 20

const LINE2_STAGGER = TEXT_REVEAL_STAGGER
const LINE2_WORDS = 3
const LINE2_SETTLE = TEXT_REVEAL_SETTLE
const HOLD_AFTER_LINE2 = 12

const LINE1_LAST_START = LINE1_START + (LINE1_WORDS - 1) * LINE1_STAGGER
export const LINE1_DONE = LINE1_LAST_START + LINE1_SETTLE

export const FLIP_START = LINE1_DONE + HOLD_AFTER_LINE1
export const P2_START = FLIP_START + CARD_FLIP_DURATION

const LINE2_LAST_START = P2_START + TEXT_REVEAL_CROSSFADE + (LINE2_WORDS - 1) * LINE2_STAGGER
export const LINE2_DONE = LINE2_LAST_START + LINE2_SETTLE + HOLD_AFTER_LINE2

export const P3_START = LINE2_DONE + TEXT_REVEAL_CROSSFADE
export const P4_START = P3_START + 40

/** Finale typewriter — must finish before scene exit fade (see SCENE10_DURATION). */
export const FINALE_TYPE_DELAY = 4
export const FINALE_CHAR_FRAMES = 1
export const FINALE_TYPE_START = P4_START + FINALE_TYPE_DELAY
export const FINALE_TYPE_END =
  FINALE_TYPE_START + FINALE_TAGLINE.length * FINALE_CHAR_FRAMES
export const FINALE_HOLD = 30

export const SCENE10_DURATION = FINALE_TYPE_END + FINALE_HOLD + CROSSFADE

export const P1_TEXT_END = FLIP_START
export const P2_FADE_OUT = LINE2_DONE
export const P2_END = P3_START
export const P3_END = P4_START + 8
export const P4_END = SCENE10_DURATION

export { LINE1_START, LINE1_STAGGER, LINE2_STAGGER }
