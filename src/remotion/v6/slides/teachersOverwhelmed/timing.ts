import {
  WORD_ARE_END,
  HIGHLIGHT_START,
} from '../../../compositions/TeachersOverwhelmedSlide/constants'

/** First frame of “OVERWHELMED” typing (after “are”). */
export const OVERWHELMED_TYPE_START = WORD_ARE_END + 2

/** Stagger offsets are relative to this — not CARDS_START (28). */
export const CARDS_ANIMATION_ORIGIN = OVERWHELMED_TYPE_START

/** Cards should finish settling before blue highlight. */
export const CARDS_SETTLE_BEFORE = HIGHLIGHT_START - 10
