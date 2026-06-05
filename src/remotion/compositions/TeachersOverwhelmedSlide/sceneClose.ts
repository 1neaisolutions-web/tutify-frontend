import { Easing, interpolate } from 'remotion'
import { SCENE_DURATION, SCENE_FADE_START } from './constants'

/** 0 → 1 over the post-highlight close (eased). */
export const sceneCloseProgress = (frame: number): number =>
  interpolate(frame, [SCENE_FADE_START, SCENE_DURATION], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  })

export const sceneCloseOpacity = (frame: number): number => 1 - sceneCloseProgress(frame)

export const sceneCloseScale = (frame: number): number =>
  interpolate(sceneCloseProgress(frame), [0, 1], [1, 0.84], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  })

export const sceneCloseBlur = (frame: number): number =>
  interpolate(sceneCloseProgress(frame), [0, 0.45, 1], [0, 2, 16], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

export const sceneCloseDriftY = (frame: number): number =>
  interpolate(sceneCloseProgress(frame), [0, 1], [0, -32], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  })
