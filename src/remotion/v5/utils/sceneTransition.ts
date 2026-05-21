// V5 — slightly shorter crossfade for crisper cuts
export { musicLevelAt } from '../../v4/utils/musicCurve'
import { interpolate } from 'remotion'

export const CROSSFADE = 20  // 20f vs v4's 24f — snappier handoffs

export const sceneEnter = (frame: number, crossfade = CROSSFADE): number =>
  interpolate(frame, [0, crossfade], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

export const sceneExit = (frame: number, duration: number, crossfade = CROSSFADE): number =>
  interpolate(frame, [duration - crossfade, duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

export const sceneMaster = (frame: number, duration: number, crossfade = CROSSFADE): number =>
  sceneEnter(frame, crossfade) * sceneExit(frame, duration, crossfade)
