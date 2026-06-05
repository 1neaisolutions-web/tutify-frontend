import { Easing, interpolate } from 'remotion'

import { ERASE_END } from './constants'

/** White punch when headline erase completes (before scene close / Vision). */
export const ERASE_FLASH_FRAMES = 4

export const ERASE_FLASH_START = ERASE_END
export const ERASE_FLASH_END = ERASE_FLASH_START + ERASE_FLASH_FRAMES

/** Opacity 0–1 on Teachers slide local frame. */
export const teachersEraseFlashOpacity = (frame: number): number => {
  if (frame < ERASE_FLASH_START) return 0
  return interpolate(
    frame,
    [ERASE_FLASH_START, ERASE_FLASH_START + 1, ERASE_FLASH_END],
    [0, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    },
  )
}

/** Sequence-local flash for V9 overlay (frame 0 = erase complete). */
export const teachersEraseFlashSequenceOpacity = (
  frame: number,
  durationInFrames: number,
): number => {
  const peak = Math.max(1, Math.round(durationInFrames * 0.38))
  return interpolate(frame, [0, peak, durationInFrames], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })
}
