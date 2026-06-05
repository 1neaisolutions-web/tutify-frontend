/**
 * V6 transitions — eased crossfades + optional cinematic close.
 */
import { Easing, interpolate } from 'remotion'

export const CROSSFADE = 12

const ease = Easing.inOut(Easing.cubic)
const RAMP_SCALE = 0.6

export const sceneEnter = (frame: number, crossfade = CROSSFADE): number =>
  interpolate(frame, [0, Math.max(1, Math.round(crossfade * RAMP_SCALE))], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  })

export const sceneExit = (frame: number, duration: number, crossfade = CROSSFADE): number =>
  interpolate(frame, [duration - Math.max(1, Math.round(crossfade * RAMP_SCALE)), duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  })

export const sceneMaster = (frame: number, duration: number, crossfade = CROSSFADE): number =>
  sceneEnter(frame, crossfade) * sceneExit(frame, duration, crossfade)

export { musicLevelAt } from '../../v4/utils/musicCurve'
