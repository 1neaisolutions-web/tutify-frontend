import { INTRO_HEADLINE } from '../../../compositions/shared/introHeadlineTypography'

const REST_WORD_COUNT = 7

/** Hero letters — wider stagger for calm type-on (~30 fps) */
export const HERO_M = 10
export const HERO_E1 = 20
export const HERO_E2 = 30
export const HERO_T = 40
/** Long eased zoom-out before lockup */
export const ZOOM_START = 52
export const ZOOM_END = 116
export const MEET_LOCK_START = 116
export const TUTIFY_START = 128
export const TUTIFY_SETTLE_FRAME = 154
export const LOGO_PAUSE_FRAMES = 20
export const LOGO_IN = TUTIFY_SETTLE_FRAME + LOGO_PAUSE_FRAMES
export const LOGO_PULSE_START = LOGO_IN + 18
export const LOGO_PULSE_END = LOGO_IN + 36
export const LOGO_EXIT_START = LOGO_PULSE_END + 12
export const LOGO_EXIT_END = LOGO_EXIT_START + 50

/** Ecosystem copy — offsets from act 2 start */
export const ACT2_START = LOGO_EXIT_END - 8
export const ECO_AN_START = ACT2_START + 10
export const ECO_REST_START = ACT2_START + 28
export const ECO_WORD_STAGGER = 8
export const ECO_WORD_SETTLE = 18
export const ECO_HOLD_FRAMES = 20

export const ECO_LINE_COMPLETE =
  ECO_REST_START + (REST_WORD_COUNT - 1) * ECO_WORD_STAGGER + ECO_WORD_SETTLE

export const SCENE_FADE_OUT = ECO_LINE_COMPLETE + ECO_HOLD_FRAMES
export const INTRO_SCENE_DURATION = SCENE_FADE_OUT + 24

export const HERO_FONT = 300
export const LOCKUP_FONT = INTRO_HEADLINE.fontSize
export const LOCKUP_SCALE = LOCKUP_FONT / HERO_FONT
export const LOCKUP_GAP_PX = 20
export const LOGO_SIZE = 112
export const ECO_FONT = INTRO_HEADLINE.fontSize
