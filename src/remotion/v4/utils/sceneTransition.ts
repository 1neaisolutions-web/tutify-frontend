/**
 * Shared enter/exit opacity for sequenced scenes with timeline overlap (premountFor).
 * Use the same CROSSFADE value in Root.tsx when offsetting `from={}` by CROSSFADE.
 */
import { interpolate } from 'remotion'

export const CROSSFADE = 24

/** Fade in at scene start (overlap with previous scene's exit). */
export const sceneEnter = (frame: number, crossfade = CROSSFADE): number =>
  interpolate(frame, [0, crossfade], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

/** Fade out at scene end (overlap with next scene's enter). */
export const sceneExit = (frame: number, duration: number, crossfade = CROSSFADE): number =>
  interpolate(frame, [duration - crossfade, duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

/** Combined master opacity for a scene that crossfades on both sides. */
export const sceneMaster = (frame: number, duration: number, crossfade = CROSSFADE): number =>
  sceneEnter(frame, crossfade) * sceneExit(frame, duration, crossfade)
