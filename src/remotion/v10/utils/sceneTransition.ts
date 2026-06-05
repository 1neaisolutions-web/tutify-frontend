/**
 * V10 transitions — slower crossfades than V9 for visible chapter handoffs.
 */
import { Easing, interpolate } from 'remotion'

import { CROSSFADE_RAMP_SCALE_V10, CROSSFADE_V10 } from '../constants/transitionTiming'

export { CROSSFADE_V10 }

const ease = Easing.inOut(Easing.cubic)
const RAMP_SCALE = CROSSFADE_RAMP_SCALE_V10

export const sceneEnter = (frame: number, crossfade = CROSSFADE_V10): number =>
  interpolate(frame, [0, Math.max(1, Math.round(crossfade * RAMP_SCALE))], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  })

export const sceneExit = (frame: number, duration: number, crossfade = CROSSFADE_V10): number =>
  interpolate(frame, [duration - Math.max(1, Math.round(crossfade * RAMP_SCALE)), duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  })

export const sceneMaster = (frame: number, duration: number, crossfade = CROSSFADE_V10): number =>
  sceneEnter(frame, crossfade) * sceneExit(frame, duration, crossfade)

export { musicLevelAt } from '../../v4/utils/musicCurve'
