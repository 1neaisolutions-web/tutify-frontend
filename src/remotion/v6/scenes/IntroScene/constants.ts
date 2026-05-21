import { INTRO_HEADLINE } from '../../../compositions/shared/introHeadlineTypography'

const REST_WORD_COUNT = 7

export const HERO_M = 8
export const HERO_E1 = 20
export const HERO_E2 = 32
export const HERO_T = 44
export const ZOOM_START = 54
export const ZOOM_END = 122
export const MEET_LOCK_START = 118
export const TUTIFY_START = 128
export const TUTIFY_SETTLE_FRAME = 162
export const LOGO_PAUSE_FRAMES = 30
export const LOGO_IN = TUTIFY_SETTLE_FRAME + LOGO_PAUSE_FRAMES
export const LOGO_PULSE_START = LOGO_IN + 26
export const LOGO_PULSE_END = LOGO_IN + 46
export const LOGO_EXIT_START = LOGO_PULSE_END + 18
export const LOGO_EXIT_END = LOGO_EXIT_START + 52

/** Ecosystem copy — offsets from act 2 start (not absolute; logo exit shifted act 2 later). */
export const ACT2_START = LOGO_EXIT_END - 6
export const ECO_AN_START = ACT2_START + 12
export const ECO_REST_START = ACT2_START + 36
export const ECO_WORD_STAGGER = 12
export const ECO_WORD_SETTLE = 28
export const ECO_HOLD_FRAMES = 48

export const ECO_LINE_COMPLETE =
  ECO_REST_START + (REST_WORD_COUNT - 1) * ECO_WORD_STAGGER + ECO_WORD_SETTLE

export const SCENE_FADE_OUT = ECO_LINE_COMPLETE + ECO_HOLD_FRAMES
export const INTRO_SCENE_DURATION = SCENE_FADE_OUT + 32

export const HERO_FONT = 300
export const LOCKUP_FONT = INTRO_HEADLINE.fontSize
export const LOCKUP_SCALE = LOCKUP_FONT / HERO_FONT
export const LOCKUP_GAP_PX = 20
export const LOGO_SIZE = 112
/** Same scale as slides 1–3 / Vision (INTRO_HEADLINE). */
export const ECO_FONT = INTRO_HEADLINE.fontSize
