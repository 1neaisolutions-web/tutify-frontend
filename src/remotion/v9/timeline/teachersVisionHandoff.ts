import { ERASE_END, SCENE_DURATION } from '../../compositions/TeachersOverwhelmedSlide/constants'
import { CROSSFADE_V9 } from '../utils/sceneTransition'

/** White flash after headline erase @ composition fps (60) — snappy handoff. */
export const TEACHERS_FLASH_FRAMES_V9 = 5

export const teachersEraseEndLocalV9 = (problemSlideV9: number): number =>
  Math.round((ERASE_END / SCENE_DURATION) * problemSlideV9)

/** Delay Vision enter so flash finishes before copy appears (nested Sequence in v9 Root). */
export const visionEnterDelayV9 = (
  problemSlideV9: number,
  crossfade = CROSSFADE_V9,
  flashFrames = TEACHERS_FLASH_FRAMES_V9,
): number => {
  const eraseEnd = teachersEraseEndLocalV9(problemSlideV9)
  return Math.max(0, eraseEnd + flashFrames - problemSlideV9 + crossfade)
}
