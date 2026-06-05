/**
 * V10 — same scene pacing as V9; transitions run longer so handoffs read clearly.
 */
export const TRANSITION_SLOW_FACTOR_V10 = 2

/** Crossfade overlap between chapters @ 60fps (V9 = 18). */
export const CROSSFADE_V10 = 18 * TRANSITION_SLOW_FACTOR_V10

/** Fraction of crossfade used for opacity ramp (higher = gentler enter/exit). */
export const CROSSFADE_RAMP_SCALE_V10 = 0.85
