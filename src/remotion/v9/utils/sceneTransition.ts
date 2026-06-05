/**
 * V9 transitions — tighter crossfades @ 60fps for premium launch pacing.
 */
import { Easing, interpolate } from 'remotion'

export const CROSSFADE_V9 = 18

const ease = Easing.inOut(Easing.cubic)
const RAMP_SCALE = 0.55

export const sceneEnter = (frame: number, crossfade = CROSSFADE_V9): number =>
  interpolate(frame, [0, Math.max(1, Math.round(crossfade * RAMP_SCALE))], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  })

export const sceneExit = (frame: number, duration: number, crossfade = CROSSFADE_V9): number =>
  interpolate(frame, [duration - Math.max(1, Math.round(crossfade * RAMP_SCALE)), duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  })

export const sceneMaster = (frame: number, duration: number, crossfade = CROSSFADE_V9): number =>
  sceneEnter(frame, crossfade) * sceneExit(frame, duration, crossfade)

export { musicLevelAt } from '../../v4/utils/musicCurve'
