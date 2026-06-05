import { theme } from '../../v4/theme'

export const COLOR_SLATE = '#1D1D1F'
export const COLOR_SLATE_MID = '#515154'
export const COLOR_CORAL = '#E33E38'
export const SELECT_BLUE = '#2563EB'
export const BG_LIGHT = '#F4F6F8'

/** Typewriter — per-character timing (see typingEngine.ts) */
export const T_CURSOR_END = 14
/** Leading space is part of each segment after the first — never lost mid-typing */
export const TYPING_SEGMENTS = ['Teachers', ' are', ' OVERWHELMED'] as const
export const FULL_HEADLINE = TYPING_SEGMENTS.join('')
export const OVERWHELMED_START = FULL_HEADLINE.indexOf('OVERWHELMED')
/** ~2 frames/char @ 30fps ≈ 15 chars/s */
export const CHAR_TYPE_FRAMES = 2
/** Blink at end of each word before the next segment */
export const WORD_PAUSE_FRAMES = 8
const _typingFramesForSegment = (index: number): number => {
  const segment = TYPING_SEGMENTS[index] ?? ''
  return segment.length * CHAR_TYPE_FRAMES + WORD_PAUSE_FRAMES
}

export const WORD_TEACHERS_END = T_CURSOR_END + _typingFramesForSegment(0)
export const WORD_ARE_END =
  T_CURSOR_END + _typingFramesForSegment(0) + _typingFramesForSegment(1)
export const WORD_OVER_START =
  T_CURSOR_END + _typingFramesForSegment(0) + _typingFramesForSegment(1)
export const WORD_OVER_END =
  TYPING_SEGMENTS.reduce((sum, _, i) => sum + _typingFramesForSegment(i), T_CURSOR_END)

export const CARDS_START = 28
/** ~1.5s with full card layout before highlight (last card settles ~f140). */
export const HOLD_START = 112
export const HIGHLIGHT_START = 112
export const HIGHLIGHT_END = 132
/** Start backspacing after the highlight beat (mirrors type timing). */
export const ERASE_START = HIGHLIGHT_END + 4

const _eraseFramesForSegment = (index: number): number => {
  const segment = TYPING_SEGMENTS[index] ?? ''
  return segment.length * CHAR_TYPE_FRAMES
}

/** Reverse segment order + word pauses — same rhythm as typing. */
export const ERASE_DURATION =
  TYPING_SEGMENTS.reduce((sum, _, i) => sum + _eraseFramesForSegment(i), 0) +
  (TYPING_SEGMENTS.length - 1) * WORD_PAUSE_FRAMES

export const ERASE_END = ERASE_START + ERASE_DURATION
/** After erase finishes, ease into close/transition. */
export const CLOSE_START = ERASE_END + 2
export const SCENE_FADE_START = CLOSE_START
/** Fast punch-out into Vision crossfade. */
export const SCENE_CLOSE_DURATION = 12
export const SCENE_DURATION = CLOSE_START + SCENE_CLOSE_DURATION
export const SCENE_CONTENT_IN = 1

export const CHAOS_CARDS = [
  { emoji: '📊', title: 'Enter marks by 9 AM', sub: '47 students · 0 submitted', accent: COLOR_CORAL },
  { emoji: '💬', title: '34 parent messages', sub: '12 unread · 3 days ago', accent: theme.colors.purple },
  { emoji: '📄', title: 'Grade 47 papers', sub: 'Math · Due 9 AM today', accent: COLOR_CORAL },
  { emoji: '📅', title: 'Lesson plan overdue', sub: '2 days late · HOD flagged', accent: theme.colors.accent },
] as const

export type CardPlacement = {
  id: string
  kind: 'notify' | 'menu' | 'thread' | 'pill' | 'window'
  delay: number
  from: 'left' | 'right' | 'top' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  x: number
  y: number
  w: number
  h?: number
  rot?: number
  notifyIndex?: number
  blur?: number
}

/** Symmetric ring around center headline — fills frame without crowding text */
export const PLACEMENTS: CardPlacement[] = [
  { id: 'menu', kind: 'menu', delay: 20, from: 'topLeft', x: 112, y: 134, w: 236, h: 200, rot: -3 },
  { id: 'thread1', kind: 'thread', delay: 24, from: 'topRight', x: 1376, y: 122, w: 308, h: 158, rot: 4 },
  { id: 'n0', kind: 'notify', delay: 28, from: 'left', x: 104, y: 344, w: 292, notifyIndex: 0 },
  { id: 'n1', kind: 'notify', delay: 34, from: 'right', x: 1500, y: 372, w: 296, notifyIndex: 1, rot: 2 },
]
