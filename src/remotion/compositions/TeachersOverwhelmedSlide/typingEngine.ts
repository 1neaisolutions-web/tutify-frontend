import {
  T_CURSOR_END,
  CHAR_TYPE_FRAMES,
  WORD_PAUSE_FRAMES,
  ERASE_START,
  ERASE_END,
  TYPING_SEGMENTS,
  FULL_HEADLINE,
  OVERWHELMED_START,
} from './constants'

export type TypingPhase = 'cursor' | 'typing' | 'word_pause' | 'done' | 'erasing'

export type TypingState = {
  phase: TypingPhase
  visibleText: string
  atWordBoundary: boolean
}

const framesForSegment = (index: number): number => {
  const segment = TYPING_SEGMENTS[index] ?? ''
  return segment.length * CHAR_TYPE_FRAMES + WORD_PAUSE_FRAMES
}

export const getTypingTotalFrames = (): number =>
  TYPING_SEGMENTS.reduce((sum, _, i) => sum + framesForSegment(i), 0)

export const getFrameAfterSegment = (segmentIndex: number): number => {
  let f = T_CURSOR_END
  for (let i = 0; i <= segmentIndex; i++) f += framesForSegment(i)
  return f
}

/** Frame when character `charIndex` first becomes visible (end of its type slot). */
export const getCharAppearFrame = (charIndex: number): number => {
  let f = T_CURSOR_END
  let pos = 0

  for (let s = 0; s < TYPING_SEGMENTS.length; s++) {
    const segment = TYPING_SEGMENTS[s] ?? ''
    for (let c = 0; c < segment.length; c++) {
      f += CHAR_TYPE_FRAMES
      if (pos === charIndex) return f
      pos++
    }
    if (pos <= charIndex) f += WORD_PAUSE_FRAMES
  }

  return f
}

export const getTypingState = (frame: number): TypingState => {
  if (frame < T_CURSOR_END) {
    return { phase: 'cursor', visibleText: '', atWordBoundary: false }
  }

  let remaining = frame - T_CURSOR_END
  let visible = ''

  for (let s = 0; s < TYPING_SEGMENTS.length; s++) {
    const segment = TYPING_SEGMENTS[s] ?? ''

    for (let c = 0; c < segment.length; c++) {
      if (remaining < CHAR_TYPE_FRAMES) {
        // `visible` already holds segment.slice(0, c) — do not append again
        return {
          phase: 'typing',
          visibleText: visible,
          atWordBoundary: false,
        }
      }
      visible += segment[c]!
      remaining -= CHAR_TYPE_FRAMES
    }

    if (remaining < WORD_PAUSE_FRAMES) {
      return { phase: 'word_pause', visibleText: visible, atWordBoundary: true }
    }
    remaining -= WORD_PAUSE_FRAMES
  }

  if (frame < ERASE_START) {
    return { phase: 'done', visibleText: FULL_HEADLINE, atWordBoundary: false }
  }

  if (frame < ERASE_END) {
    let remaining = frame - ERASE_START
    let visible = FULL_HEADLINE

    for (let s = TYPING_SEGMENTS.length - 1; s >= 0; s--) {
      const segment = TYPING_SEGMENTS[s] ?? ''

      for (let i = 0; i < segment.length; i++) {
        if (remaining < CHAR_TYPE_FRAMES) {
          return { phase: 'erasing', visibleText: visible, atWordBoundary: false }
        }
        remaining -= CHAR_TYPE_FRAMES
        visible = visible.slice(0, -1)
      }

      if (s > 0) {
        if (remaining < WORD_PAUSE_FRAMES) {
          return { phase: 'word_pause', visibleText: visible, atWordBoundary: true }
        }
        remaining -= WORD_PAUSE_FRAMES
      }
    }
  }

  return { phase: 'done', visibleText: '', atWordBoundary: true }
}

/** Normal text before OVERWHELMED; emphasis slice (may be partial). */
export const splitForRender = (
  visible: string,
): { normal: string; emphasis: string } => {
  if (visible.length <= OVERWHELMED_START) {
    return { normal: visible, emphasis: '' }
  }
  return {
    normal: visible.slice(0, OVERWHELMED_START),
    emphasis: visible.slice(OVERWHELMED_START),
  }
}
