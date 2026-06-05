import { ERASE_END, SCENE_DURATION } from '../../compositions/TeachersOverwhelmedSlide/constants'
import { TRANSITION_SLOW_FACTOR_V10 } from '../constants/transitionTiming'
import { CROSSFADE_V10 } from '../utils/sceneTransition'

/** White flash after headline erase — slower than V9 (5f → 10f @ 2×). */
export const TEACHERS_FLASH_FRAMES_V10 = Math.round(5 * TRANSITION_SLOW_FACTOR_V10)

export const teachersEraseEndLocalV10 = (problemSlideV10: number): number =>
  Math.round((ERASE_END / SCENE_DURATION) * problemSlideV10)

export const visionEnterDelayV10 = (
  problemSlideV10: number,
  crossfade = CROSSFADE_V10,
  flashFrames = TEACHERS_FLASH_FRAMES_V10,
): number => {
  const eraseEnd = teachersEraseEndLocalV10(problemSlideV10)
  return Math.max(0, eraseEnd + flashFrames - problemSlideV10 + crossfade)
}
