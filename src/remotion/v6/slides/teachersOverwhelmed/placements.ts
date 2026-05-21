/**
 * Balanced ring — top-center filled, lighter right, clear headline (y ~430–560).
 * 1920×1080
 */
export type CardDepth = 0 | 1 | 2

export type CardPlacementV6 = {
  id: string
  kind: 'notify' | 'menu' | 'thread' | 'threadTall' | 'pill' | 'window' | 'dashboard'
  delay: number
  from: 'left' | 'right' | 'top' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  x: number
  y: number
  w: number
  h?: number
  rot?: number
  notifyIndex?: number
  depth?: CardDepth
}

export const PLACEMENTS_V6: CardPlacementV6[] = [
  /* Back wash — upper third (soft depth, not the only top content) */
  {
    id: 'thread-back',
    kind: 'thread',
    delay: 0,
    from: 'top',
    x: 548,
    y: 72,
    w: 220,
    h: 108,
    rot: -2,
    depth: 2,
  },
  {
    id: 'dashboard',
    kind: 'dashboard',
    delay: 3,
    from: 'topRight',
    x: 1120,
    y: 88,
    w: 440,
    h: 268,
    rot: 2,
    depth: 2,
  },

  /* Top-center foreground — fills gap above “Teachers are” */
  {
    id: 'n-top-center',
    kind: 'notify',
    delay: 2,
    from: 'top',
    x: 648,
    y: 218,
    w: 300,
    notifyIndex: 2,
    rot: 0.5,
    depth: 0,
  },
  {
    id: 'win-top',
    kind: 'window',
    delay: 5,
    from: 'top',
    x: 968,
    y: 198,
    w: 272,
    h: 168,
    rot: -1.5,
    depth: 0,
  },

  /* Corners */
  {
    id: 'menu',
    kind: 'menu',
    delay: 6,
    from: 'topLeft',
    x: 44,
    y: 148,
    w: 244,
    h: 206,
    rot: -4,
    depth: 1,
  },
  {
    id: 'thread-tall',
    kind: 'threadTall',
    delay: 9,
    from: 'topRight',
    x: 1470,
    y: 192,
    w: 288,
    h: 252,
    rot: 3,
    depth: 1,
  },

  /* Left stack */
  {
    id: 'n0',
    kind: 'notify',
    delay: 8,
    from: 'left',
    x: 36,
    y: 388,
    w: 296,
    notifyIndex: 0,
    depth: 0,
  },
  {
    id: 'n1',
    kind: 'notify',
    delay: 14,
    from: 'left',
    x: 58,
    y: 498,
    w: 284,
    notifyIndex: 1,
    rot: -1,
    depth: 0,
  },
  {
    id: 'n6',
    kind: 'notify',
    delay: 24,
    from: 'left',
    x: 72,
    y: 598,
    w: 272,
    notifyIndex: 6,
    depth: 0,
  },
  {
    id: 'n4',
    kind: 'notify',
    delay: 30,
    from: 'bottomLeft',
    x: 48,
    y: 688,
    w: 280,
    notifyIndex: 4,
    rot: -2,
    depth: 0,
  },

  /* Right — single mid card (not stacked) */
  {
    id: 'n3',
    kind: 'notify',
    delay: 16,
    from: 'right',
    x: 1536,
    y: 448,
    w: 298,
    notifyIndex: 3,
    rot: 1.5,
    depth: 0,
  },

  /* Bottom band */
  {
    id: 'n5',
    kind: 'notify',
    delay: 20,
    from: 'bottom',
    x: 298,
    y: 778,
    w: 288,
    notifyIndex: 5,
    depth: 0,
  },
  {
    id: 'n7',
    kind: 'notify',
    delay: 26,
    from: 'bottom',
    x: 848,
    y: 728,
    w: 284,
    notifyIndex: 7,
    depth: 0,
  },
  {
    id: 'win-mid',
    kind: 'window',
    delay: 22,
    from: 'bottomRight',
    x: 1248,
    y: 698,
    w: 312,
    h: 182,
    rot: 2,
    depth: 1,
  },
  {
    id: 'pill',
    kind: 'pill',
    delay: 34,
    from: 'bottom',
    x: 754,
    y: 848,
    w: 284,
    h: 50,
    depth: 0,
  },
]
