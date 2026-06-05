/**
 * V10 — Zelios reference layout: large edge-bleed cards, center clear for headline.
 * Top: dark form + white popups + invoice. Bottom: wide table + schedule popup.
 */
import type { CardPlacementV6 } from '../../../v6/slides/teachersOverwhelmed/placements'

const FRAME_W = 1920
const FRAME_H = 1080
const TOP_INSET = 8
const BOTTOM_INSET = 10
const SIDE_BLEED = 64

const bottomY = (h: number): number => FRAME_H - h - BOTTOM_INSET
const rightX = (w: number, bleed = SIDE_BLEED): number => FRAME_W - w + bleed

export const V10_LIGHT_CARD_IDS = new Set([
  'win-light-1',
  'win-top',
  'win-mid',
  'n-top-center',
  'n5',
  'n3',
])

export const PLACEMENTS_V10: CardPlacementV6[] = [
  /* ── Top band — reference overlap ── */
  {
    id: 'menu',
    kind: 'menu',
    delay: 0,
    from: 'topLeft',
    x: -SIDE_BLEED - 8,
    y: TOP_INSET - 6,
    w: 348,
    h: 288,
    rot: -3.5,
    depth: 2,
  },
  {
    id: 'win-light-1',
    kind: 'window',
    delay: 2,
    from: 'topLeft',
    x: 248,
    y: TOP_INSET + 28,
    w: 412,
    h: 208,
    rot: -1.8,
    depth: 0,
  },
  {
    id: 'thread-back',
    kind: 'thread',
    delay: 4,
    from: 'top',
    x: 528,
    y: TOP_INSET + 4,
    w: 292,
    h: 138,
    rot: 2.2,
    depth: 2,
  },
  {
    id: 'n-top-center',
    kind: 'notify',
    delay: 6,
    from: 'top',
    x: 598,
    y: TOP_INSET - 2,
    w: 448,
    notifyIndex: 2,
    rot: 0.5,
    depth: 0,
  },
  {
    id: 'win-top',
    kind: 'window',
    delay: 8,
    from: 'top',
    x: 918,
    y: TOP_INSET + 36,
    w: 428,
    h: 228,
    rot: -1,
    depth: 0,
  },
  {
    id: 'dashboard',
    kind: 'dashboard',
    delay: 10,
    from: 'topRight',
    x: rightX(748, 72),
    y: TOP_INSET - 8,
    w: 748,
    h: 348,
    rot: 2.8,
    depth: 1,
  },
  {
    id: 'thread-tall',
    kind: 'threadTall',
    delay: 12,
    from: 'topRight',
    x: rightX(318, 48),
    y: TOP_INSET + 18,
    w: 318,
    h: 248,
    rot: 3.5,
    depth: 2,
  },

  /* ── Bottom — wide table + white schedule (reference) ── */
  {
    id: 'dashboard-wide',
    kind: 'dashboard',
    delay: 14,
    from: 'bottomRight',
    x: rightX(1120, 88),
    y: bottomY(328),
    w: 1120,
    h: 328,
    rot: 1.2,
    depth: 1,
  },
  {
    id: 'win-mid',
    kind: 'window',
    delay: 16,
    from: 'bottom',
    x: 438,
    y: bottomY(268),
    w: 498,
    h: 268,
    rot: 0.8,
    depth: 0,
  },
  {
    id: 'thread-bot',
    kind: 'thread',
    delay: 18,
    from: 'bottomLeft',
    x: -SIDE_BLEED + 4,
    y: bottomY(198),
    w: 368,
    h: 198,
    rot: -2.2,
    depth: 2,
  },

  /* ── Bottom edge — pills + notifies cropped by frame ── */
  {
    id: 'n0',
    kind: 'notify',
    delay: 20,
    from: 'bottomLeft',
    x: -SIDE_BLEED - 4,
    y: bottomY(88),
    w: 348,
    notifyIndex: 1,
    rot: -2.8,
    depth: 1,
  },
  {
    id: 'pill',
    kind: 'pill',
    delay: 22,
    from: 'bottom',
    x: 318,
    y: bottomY(68),
    w: 448,
    h: 68,
    depth: 2,
  },
  {
    id: 'n5',
    kind: 'notify',
    delay: 24,
    from: 'bottom',
    x: 1028,
    y: bottomY(92),
    w: 418,
    notifyIndex: 5,
    rot: -0.6,
    depth: 0,
  },
  {
    id: 'n3',
    kind: 'notify',
    delay: 26,
    from: 'bottomRight',
    x: rightX(392, 36),
    y: bottomY(94),
    w: 392,
    notifyIndex: 3,
    rot: 2.4,
    depth: 0,
  },
]
