import { theme } from '../../v4/theme'

export const COLOR_SLATE = '#1D1D1F'
export const COLOR_SLATE_MID = '#515154'
export const COLOR_CORAL = '#E33E38'
export const SELECT_BLUE = '#2563EB'
export const BG_LIGHT = '#F4F6F8'

/** Typing phases (local frames) — paced for read time */
export const T_CURSOR_END = 14
export const WORD_TEACHERS_END = 38
export const WORD_ARE_END = 54
export const WORD_OVER_END = 88

export const CARDS_START = 28
/** ~1.5s with full card layout before highlight (last card settles ~f140). */
export const HOLD_START = 168
export const HIGHLIGHT_START = 168
export const HIGHLIGHT_END = 198
/** Brief beat on highlighted word, then eased close into Vision crossfade. */
export const CLOSE_START = HIGHLIGHT_END + 6
export const SCENE_FADE_START = CLOSE_START
export const SCENE_CLOSE_DURATION = 48
export const SCENE_DURATION = CLOSE_START + SCENE_CLOSE_DURATION
export const SCENE_CONTENT_IN = 1

export const CHAOS_CARDS = [
  { emoji: '📊', title: 'Enter marks by 9 AM', sub: '47 students · 0 submitted', accent: COLOR_CORAL },
  { emoji: '💬', title: '34 parent messages', sub: '12 unread · 3 days ago', accent: theme.colors.purple },
  { emoji: '📄', title: 'Grade 47 papers', sub: 'Math · Due 9 AM today', accent: COLOR_CORAL },
  { emoji: '📅', title: 'Lesson plan overdue', sub: '2 days late · HOD flagged', accent: theme.colors.accent },
  { emoji: '🔔', title: 'Admin report due', sub: 'Principal review', accent: theme.colors.primary },
  { emoji: '🧪', title: 'Prep lab materials', sub: 'Grade 10 · Tomorrow', accent: theme.colors.secondary },
  { emoji: '📝', title: 'IEP documents pending', sub: '3 students · Legal', accent: theme.colors.accent },
  { emoji: '⏰', title: '3 AM — still working', sub: '2+ hours tonight', accent: COLOR_CORAL },
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
  { id: 'menu', kind: 'menu', delay: 24, from: 'topLeft', x: 88, y: 118, w: 236, h: 200, rot: -3 },
  { id: 'thread1', kind: 'thread', delay: 30, from: 'topRight', x: 1396, y: 112, w: 308, h: 158, rot: 4 },
  { id: 'thread2', kind: 'thread', delay: 34, from: 'top', x: 668, y: 88, w: 268, h: 132, rot: -1, blur: 0.2 },
  { id: 'n0', kind: 'notify', delay: 38, from: 'left', x: 72, y: 318, w: 292, notifyIndex: 0 },
  { id: 'n1', kind: 'notify', delay: 44, from: 'left', x: 96, y: 418, w: 276, notifyIndex: 1, blur: 0.12 },
  { id: 'n2', kind: 'notify', delay: 40, from: 'right', x: 1552, y: 308, w: 288, notifyIndex: 2 },
  { id: 'n3', kind: 'notify', delay: 48, from: 'right', x: 1524, y: 402, w: 296, notifyIndex: 3, rot: 2 },
  { id: 'pill', kind: 'pill', delay: 52, from: 'bottom', x: 778, y: 812, w: 268, h: 50 },
  { id: 'win', kind: 'window', delay: 58, from: 'bottomRight', x: 1348, y: 648, w: 328, h: 188, rot: 3 },
  { id: 'n4', kind: 'notify', delay: 64, from: 'bottomLeft', x: 108, y: 668, w: 278, notifyIndex: 4, blur: 0.18 },
  { id: 'n5', kind: 'notify', delay: 70, from: 'bottom', x: 348, y: 798, w: 282, notifyIndex: 5 },
  { id: 'n6', kind: 'notify', delay: 76, from: 'right', x: 1588, y: 528, w: 272, notifyIndex: 6, blur: 0.28 },
  { id: 'n7', kind: 'notify', delay: 82, from: 'bottomRight', x: 1128, y: 778, w: 286, notifyIndex: 7, rot: -2 },
]
