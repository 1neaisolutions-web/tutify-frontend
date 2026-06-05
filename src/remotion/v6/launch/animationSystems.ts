import { interpolate } from 'remotion'
import { launchEasing } from './styleTokens'

export const cursorVisibleAt = (frame: number, cadence = 16): boolean =>
  frame % cadence < cadence / 2

export const getTypewriterLength = (
  frame: number,
  start: number,
  duration: number,
  textLength: number,
): number =>
  Math.floor(
    interpolate(frame, [start, start + duration], [0, textLength], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: launchEasing.standard,
    }),
  )

export const getProgress = (frame: number, start: number, end: number): number =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: launchEasing.standard,
  })

export const getCounterPercent = (frame: number, start: number, end: number): number =>
  Math.floor(
    interpolate(frame, [start, end], [0, 100], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: launchEasing.standard,
    }),
  )

export const slideBlurTransition = (
  frame: number,
  start = 0,
  inFrames = 16,
  offsetPx = 64,
): { opacity: number; translateX: number; blur: number } => {
  const inP = interpolate(frame, [start, start + inFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: launchEasing.standard,
  })
  return {
    opacity: inP,
    translateX: interpolate(inP, [0, 1], [offsetPx, 0], {
      extrapolateRight: 'clamp',
    }),
    blur: interpolate(inP, [0, 1], [8, 0], { extrapolateRight: 'clamp' }),
  }
}

export const alphaMaskReveal = (
  frame: number,
  start: number,
  revealFrames: number,
): { scaleY: number; opacity: number } => {
  const p = interpolate(frame, [start, start + revealFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: launchEasing.revealSnap,
  })
  return {
    scaleY: p,
    opacity: p,
  }
}

