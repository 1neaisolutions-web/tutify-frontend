import { INTRO_HEADLINE } from '../../../compositions/shared/introHeadlineTypography'

/** Scene 03 — Meet Tutify + ecosystem tagline (360f @ 30fps = 12s) */
export const INTRO_SCENE_DURATION = 360

export const HERO_M = 8
export const HERO_E1 = 20
export const HERO_E2 = 32
export const HERO_T = 44
export const ZOOM_START = 54
export const ZOOM_END = 122
/** Lockup row: Meet settled, then Tutify, pause, logo */
export const MEET_LOCK_START = 118
export const TUTIFY_START = 128
/** ~34f slide — Tutify sits beside Meet */
export const TUTIFY_SETTLE_FRAME = 162
/** 1 second hold with Meet + Tutify before logo */
export const LOGO_PAUSE_FRAMES = 30
export const LOGO_IN = TUTIFY_SETTLE_FRAME + LOGO_PAUSE_FRAMES
export const LOGO_PULSE_START = LOGO_IN + 26
export const LOGO_PULSE_END = LOGO_IN + 46
export const ACT2_START = 258
export const ECO_AN_START = 266
export const ECO_REST_START = 282
export const ECO_WORD_STAGGER = 8
export const SCENE_FADE_OUT = 332

export const HERO_FONT = 300
export const LOCKUP_FONT = INTRO_HEADLINE.fontSize
export const LOCKUP_SCALE = LOCKUP_FONT / HERO_FONT

/** Meet · logo · Tutify — uniform spacing */
export const LOCKUP_GAP_PX = 20

export const LOGO_SIZE = 112
export const ECO_FONT = 64
