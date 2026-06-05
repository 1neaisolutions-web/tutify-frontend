/**
 * SaaS-style product UI reveal — tilted 3D enter, DOF blur settle (reference: quick-check promo).
 */
import { Easing, interpolate } from 'remotion'

export const PRODUCT_UI_REVEAL_DURATION = 36

export type ProductUI3DRevealMotion = {
  opacity: number
  scale: number
  rotateX: number
  rotateY: number
  blur: number
  glowOpacity: number
}

/** Incoming UI panel (course → quiz, etc.). */
export const productUI3DRevealIn = (
  frame: number,
  start: number,
  duration = PRODUCT_UI_REVEAL_DURATION,
): ProductUI3DRevealMotion => {
  const p = interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  })

  return {
    opacity: interpolate(p, [0, 0.12, 1], [0, 0.85, 1], { extrapolateRight: 'clamp' }),
    scale: interpolate(p, [0, 1], [0.88, 1], { extrapolateRight: 'clamp' }),
    rotateX: interpolate(p, [0, 1], [11, 0], { extrapolateRight: 'clamp' }),
    rotateY: interpolate(p, [0, 1], [-18, 0], { extrapolateRight: 'clamp' }),
    blur: interpolate(p, [0, 0.45, 1], [20, 9, 0], { extrapolateRight: 'clamp' }),
    glowOpacity: interpolate(p, [0, 0.35, 0.75, 1], [0, 0.55, 0.28, 0], {
      extrapolateRight: 'clamp',
    }),
  }
}

/** Outgoing layer defocus while next panel enters. */
export const productUI3DRevealOutBlur = (
  frame: number,
  start: number,
  duration = PRODUCT_UI_REVEAL_DURATION,
): number =>
  interpolate(frame, [start, start + duration * 0.85], [0, 32], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  })

export const productUI3DRevealTransform = (motion: ProductUI3DRevealMotion): string =>
  `perspective(1600px) rotateX(${motion.rotateX}deg) rotateY(${motion.rotateY}deg) scale(${motion.scale})`
