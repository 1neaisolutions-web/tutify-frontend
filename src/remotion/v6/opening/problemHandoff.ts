/**
 * Fast Education → Teachers handoff curves (~0.35s @ 30fps).
 */
import { Easing, interpolate } from 'remotion'

export const PROBLEM_HANDOFF_FRAMES = 14
const easeOut = Easing.out(Easing.cubic)
const easeInOut = Easing.inOut(Easing.cubic)

export const problemHandoffProgress = (frame: number): number =>
  interpolate(frame, [0, PROBLEM_HANDOFF_FRAMES], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOut,
  })

/** Slide content in — used on Teachers slide local frame 0. */
export const problemSlideEnter = (
  frame: number,
): { opacity: number; scale: number; blur: number; translateY: number } => {
  const p = problemHandoffProgress(frame)
  return {
    opacity: interpolate(p, [0, 0.25, 1], [0, 0.92, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
    scale: interpolate(p, [0, 1], [1.045, 1], { extrapolateRight: 'clamp', easing: easeOut }),
    blur: interpolate(p, [0, 1], [11, 0], { extrapolateRight: 'clamp' }),
    translateY: interpolate(p, [0, 1], [28, 0], { extrapolateRight: 'clamp', easing: easeOut }),
  }
}

/** Full-frame wipe overlay (sequence-local frame). */
export const problemHandoffOverlay = (
  frame: number,
): { sweepX: number; sweepOpacity: number; flash: number; vignette: number } => {
  const p = problemHandoffProgress(frame)
  return {
    sweepX: interpolate(p, [0, 1], [-28, 108], { extrapolateRight: 'clamp', easing: easeInOut }),
    sweepOpacity: interpolate(p, [0, 0.2, 0.55, 1], [0, 0.9, 0.5, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
    flash: interpolate(p, [0, 0.35, 0.7, 1], [0, 0.22, 0.08, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
    vignette: interpolate(p, [0, 0.5, 1], [0.35, 0.12, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  }
}
