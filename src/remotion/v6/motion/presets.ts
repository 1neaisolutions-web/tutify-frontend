import type React from 'react'
import { interpolate, spring, type SpringConfig } from 'remotion'
import { theme } from '../theme'

export const springs = {
  word: { damping: 200, stiffness: 88, mass: 0.95 } satisfies SpringConfig,
  hero: { damping: 200, stiffness: 72, mass: 0.95 } satisfies SpringConfig,
  ui: { damping: 220, stiffness: 165, mass: 0.95 } satisfies SpringConfig,
  camera: { damping: 240, stiffness: 58, mass: 1.05 } satisfies SpringConfig,
} as const

export const smooth = (p: number) =>
  interpolate(p, [0, 0.35, 0.72, 1], [0, 0.28, 0.68, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

export const wordReveal = (
  frame: number,
  start: number,
  fps: number,
  config: SpringConfig = springs.word,
): number => {
  if (frame < start) return 0
  const raw = spring({ frame: frame - start, fps, config })
  return smooth(raw)
}

/** Subtle push-in for demo UI (1.0 → 1.03). */
export const cameraPush = (
  frame: number,
  start: number,
  duration: number,
): number => {
  const t = interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  return interpolate(t, [0, 1], [1, 1.03])
}

export const SECTION_CHIP: React.CSSProperties = {
  fontFamily: theme.font.display,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.28em',
  textTransform: 'uppercase',
  color: theme.colors.textMuted,
}
