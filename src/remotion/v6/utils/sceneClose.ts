import { Easing, interpolate } from 'remotion'

/** 0 → 1 eased progress over [fadeStart, duration]. */
export const sceneCloseProgress = (
  frame: number,
  fadeStart: number,
  duration: number,
): number =>
  interpolate(frame, [fadeStart, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  })

export const sceneCloseOpacity = (frame: number, fadeStart: number, duration: number): number =>
  1 - sceneCloseProgress(frame, fadeStart, duration)

export const sceneCloseScale = (frame: number, fadeStart: number, duration: number): number =>
  interpolate(sceneCloseProgress(frame, fadeStart, duration), [0, 1], [1, 0.97])

export const sceneCloseBlur = (frame: number, fadeStart: number, duration: number): number =>
  interpolate(sceneCloseProgress(frame, fadeStart, duration), [0, 1], [0, 10])

export const sceneCloseDriftY = (frame: number, fadeStart: number, duration: number): number =>
  interpolate(sceneCloseProgress(frame, fadeStart, duration), [0, 1], [0, 18])
