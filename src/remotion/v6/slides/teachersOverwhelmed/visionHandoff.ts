/**
 * Fast Teachers → Vision punch-out (~0.4s close + enter).
 */
import { Easing, interpolate } from 'remotion'

export const VISION_HANDOFF_ENTER_FRAMES = 11

const easeOut = Easing.out(Easing.cubic)

export const visionSceneEnter = (
  frame: number,
): { opacity: number; scale: number; blur: number; translateY: number } => {
  const p = interpolate(frame, [0, VISION_HANDOFF_ENTER_FRAMES], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOut,
  })
  return {
    opacity: p,
    scale: interpolate(p, [0, 1], [1.08, 1], { extrapolateRight: 'clamp' }),
    blur: interpolate(p, [0, 1], [14, 0], { extrapolateRight: 'clamp' }),
    translateY: interpolate(p, [0, 1], [48, 0], { extrapolateRight: 'clamp' }),
  }
}
