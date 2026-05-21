/**
 * V6 transitions — eased crossfades + optional cinematic close.
 */
import { Easing, interpolate } from 'remotion'

export const CROSSFADE = 24

const ease = Easing.inOut(Easing.cubic)

export const sceneEnter = (frame: number, crossfade = CROSSFADE): number =>
  interpolate(frame, [0, crossfade], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  })

export const sceneExit = (frame: number, duration: number, crossfade = CROSSFADE): number =>
  interpolate(frame, [duration - crossfade, duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  })

export const sceneMaster = (frame: number, duration: number, crossfade = CROSSFADE): number =>
  sceneEnter(frame, crossfade) * sceneExit(frame, duration, crossfade)

export { musicLevelAt } from '../../v4/utils/musicCurve'
