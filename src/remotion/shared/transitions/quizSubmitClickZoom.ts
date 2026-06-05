/**
 * Submit beat: zoom on real button → click → slide up → next phase.
 */
import { Easing, interpolate } from 'remotion'

export const QUIZ_SUBMIT_CURSOR_LEAD = 28
export const QUIZ_SUBMIT_CLICK_HOLD = 14
export const QUIZ_SUBMIT_ZOOM_IN_FRAMES = 24
export const QUIZ_SUBMIT_ZOOM_HOLD = 8
export const QUIZ_SUBMIT_EXIT_FRAMES = 22

/** Hero card layout (px) — flex-centered on 1920×1080. */
const HERO_CARD_W = 1080
const HERO_CARD_H = 640
/** Submit pill center inside hero card (bottom-right CTA). */
const HERO_BTN_X = 913
const HERO_BTN_Y = 572
const VIEWPORT_CX = 960
const VIEWPORT_CY = 532
const HERO_CARD_LEFT = (1920 - HERO_CARD_W) / 2
const HERO_CARD_TOP = (1080 - HERO_CARD_H) / 2

export const QUIZ_HERO_TRANSFORM_ORIGIN = `${(HERO_BTN_X / HERO_CARD_W) * 100}% ${(HERO_BTN_Y / HERO_CARD_H) * 100}%`

/** Pan at full zoom so the CTA sits in frame center. */
export const QUIZ_HERO_PAN_AT_ZOOM = {
  x: VIEWPORT_CX - (HERO_CARD_LEFT + HERO_BTN_X),
  y: VIEWPORT_CY - (HERO_CARD_TOP + HERO_BTN_Y),
}

const HERO_ZOOM_PEAK = 3.28

export const quizZeliosPurpleOpacity = (
  frame: number,
  heroStart: number,
  exitStart: number,
  restoreAt: number,
): number => {
  if (frame < heroStart) return 0
  if (frame >= restoreAt) {
    return interpolate(frame, [restoreAt, restoreAt + 10], [0.35, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  }
  if (frame >= exitStart) {
    return interpolate(frame, [exitStart, restoreAt], [1, 0.35], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  }
  return interpolate(frame, [heroStart, heroStart + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })
}

export const quizChromeHideOpacity = (
  frame: number,
  heroStart: number,
  exitStart: number,
  restoreAt: number,
): number => 1 - quizZeliosPurpleOpacity(frame, heroStart, exitStart, restoreAt)

export const quizContentFadeOpacity = (
  frame: number,
  heroStart: number,
  restoreAt: number,
): number => {
  if (frame < heroStart) return 1
  if (frame >= restoreAt) {
    return interpolate(frame, [restoreAt, restoreAt + 8], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  }
  return interpolate(frame, [heroStart, heroStart + 8], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
}

/** Title + subtitle peek above button during tight zoom. */
export const quizHeroHeaderPeekOpacity = (
  frame: number,
  zoomEnd: number,
  clickEnd: number,
): number => {
  if (frame < zoomEnd - 6) return 0
  if (frame >= clickEnd) {
    return interpolate(frame, [clickEnd, clickEnd + 6], [0.5, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  }
  return interpolate(frame, [zoomEnd - 6, zoomEnd], [0, 0.28], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
}

/** Heavy zoom — CTA fills center of frame. */
export const quizHeroCardScale = (
  frame: number,
  heroStart: number,
  zoomEnd: number,
  clickEnd: number,
): number => {
  if (frame < heroStart) return 1
  if (frame < zoomEnd) {
    return interpolate(frame, [heroStart, zoomEnd], [0.88, HERO_ZOOM_PEAK], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.cubic),
    })
  }
  if (frame < clickEnd + 4) return HERO_ZOOM_PEAK
  return interpolate(frame, [clickEnd + 4, clickEnd + 14], [HERO_ZOOM_PEAK, 2.95], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
}

/** Slide card so submit button lands at viewport center while zooming. */
export const quizHeroCardPan = (
  frame: number,
  heroStart: number,
  zoomEnd: number,
  clickEnd: number,
): { x: number; y: number } => {
  const { x: tx, y: ty } = QUIZ_HERO_PAN_AT_ZOOM
  if (frame < heroStart) return { x: 0, y: 0 }
  if (frame < zoomEnd) {
    return {
      x: interpolate(frame, [heroStart, zoomEnd], [0, tx], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.inOut(Easing.cubic),
      }),
      y: interpolate(frame, [heroStart, zoomEnd], [0, ty], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.inOut(Easing.cubic),
      }),
    }
  }
  if (frame < clickEnd + 4) return { x: tx, y: ty }
  return {
    x: interpolate(frame, [clickEnd + 4, clickEnd + 14], [tx, tx * 0.85], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
    y: interpolate(frame, [clickEnd + 4, clickEnd + 14], [ty, ty * 0.85], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  }
}

export const quizHeroCardTilt = (
  frame: number,
  heroStart: number,
  zoomEnd: number,
): { rotateX: number; rotateY: number } => {
  const p = interpolate(frame, [heroStart, zoomEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  })
  return {
    rotateX: interpolate(p, [0, 1], [7, 0], { extrapolateRight: 'clamp' }),
    rotateY: interpolate(p, [0, 1], [-11, 0], { extrapolateRight: 'clamp' }),
  }
}

/** After click — whole hero layer slides up off screen. */
export const quizHeroSlideUpY = (
  frame: number,
  exitStart: number,
  restoreAt: number,
): number => {
  if (frame < exitStart) return 0
  return interpolate(frame, [exitStart, restoreAt], [0, -520], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  })
}

export const quizSubmitGlowOpacity = (frame: number, clickAt: number, clickEnd: number): number =>
  interpolate(
    frame,
    [clickAt - 4, clickAt, clickEnd, clickEnd + 8],
    [0, 1, 0.9, 0.15],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

export const quizSubmitButtonPress = (frame: number, clickAt: number): number =>
  interpolate(frame, [clickAt, clickAt + 5, clickAt + QUIZ_SUBMIT_CLICK_HOLD], [1, 0.86, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

/** Cursor on centered submit CTA (1920×1080). */
export const QUIZ_HERO_BUTTON_TARGET = { x: VIEWPORT_CX, y: VIEWPORT_CY }

/** @deprecated legacy isolate clip — use QUIZ_SUBMIT_ZOOM_IN_FRAMES */
export const QUIZ_SUBMIT_ZOOM_FRAMES = QUIZ_SUBMIT_ZOOM_IN_FRAMES

export const quizSubmitCardFocusZoom = (
  frame: number,
  focusStart: number,
): number =>
  quizHeroCardScale(
    frame,
    focusStart,
    focusStart + QUIZ_SUBMIT_ZOOM_IN_FRAMES,
    focusStart + QUIZ_SUBMIT_ZOOM_IN_FRAMES + QUIZ_SUBMIT_CLICK_HOLD,
  )

export const quizSubmitCardTilt = quizHeroCardTilt

export const quizSubmitRealButtonZoom = quizHeroCardScale
export const quizMainUiOpacity = quizChromeHideOpacity
export const quizSubmitBackdropWash = quizZeliosPurpleOpacity
export const quizSubmitBackdropDim = quizZeliosPurpleOpacity
