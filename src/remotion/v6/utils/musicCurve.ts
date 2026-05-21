import { interpolate } from 'remotion'

/** Piecewise-linear volume with smooth ramps between keyframes. */
export const musicLevelAt = (
  frame: number,
  keys: { at: number; level: number }[],
): number => {
  const sorted = [...keys].sort((a, b) => a.at - b.at)
  if (sorted.length === 0) return 0.12
  if (frame <= sorted[0].at) return sorted[0].level
  if (frame >= sorted[sorted.length - 1].at) return sorted[sorted.length - 1].level

  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i]
    const b = sorted[i + 1]
    if (frame >= a.at && frame < b.at) {
      return interpolate(frame, [a.at, b.at], [a.level, b.level], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    }
  }
  return sorted[sorted.length - 1].level
}
