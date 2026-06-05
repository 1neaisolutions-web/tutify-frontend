import { Easing, interpolate } from 'remotion'
import { ZOOM_START, MEET_LOCK_START, TUTIFY_START, TUTIFY_SETTLE_FRAME } from './constants'

/** One continuous right → left path (px) — hero + lockup share this */
const X_ZOOM_START = 12
const X_LOCKUP_HOLD = -4
const X_TUTIFY_END = -24

/** Hero → lockup crossfade length (frames) */
export const MEET_HANDOFF_FADE = 42

export const getMeetHandoffEnd = (): number => MEET_LOCK_START + MEET_HANDOFF_FADE

/**
 * Frame-based Meet X — no springs, no reset at hero/lockup boundary.
 */
export const getMeetTranslateX = (frame: number): number => {
  if (frame < ZOOM_START) return 0

  if (frame < TUTIFY_START) {
    return interpolate(frame, [ZOOM_START, MEET_LOCK_START, TUTIFY_START], [X_ZOOM_START, X_LOCKUP_HOLD, X_LOCKUP_HOLD], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.33, 0, 0.18, 1),
    })
  }

  return interpolate(frame, [TUTIFY_START, TUTIFY_SETTLE_FRAME], [X_LOCKUP_HOLD, X_TUTIFY_END], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.33, 0, 0.18, 1),
  })
}
