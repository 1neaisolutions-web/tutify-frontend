import { Easing, interpolate } from 'remotion'

const ease = Easing.inOut(Easing.cubic)

/** CSS rotate: negative degrees = counterclockwise. */
export const ROTATE_CCW_EXIT_DEG = -14
export const ROTATE_CCW_ENTER_START_DEG = -14

export type RotateCCWProgress = {
  rotateDeg: number
  scale: number
  opacity: number
}

export const rotateCCWExitMotion = (progress: number): RotateCCWProgress => ({
  rotateDeg: interpolate(progress, [0, 1], [0, ROTATE_CCW_EXIT_DEG], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  }),
  scale: interpolate(progress, [0, 1], [1, 0.94], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  }),
  opacity: interpolate(progress, [0, 0.35, 1], [1, 0.85, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }),
})

export const rotateCCWEnterMotion = (progress: number): RotateCCWProgress => ({
  rotateDeg: interpolate(progress, [0, 1], [ROTATE_CCW_ENTER_START_DEG, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  }),
  scale: interpolate(progress, [0, 1], [0.94, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  }),
  opacity: interpolate(progress, [0, 0.25, 1], [0, 0.9, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }),
})

export const rotateCCWTransform = (motion: RotateCCWProgress): string =>
  `rotate(${motion.rotateDeg}deg) scale(${motion.scale})`
