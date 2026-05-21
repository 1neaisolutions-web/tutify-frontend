/**
 * V5 Theme — extends V4 palette with aliases needed by V5 scenes.
 * Visual identity: same light periwinkle/lavender as V4.
 */
import { theme as v4theme } from '../v4/theme'

const extraColors = {
  violet:      '#7C3AED',
  violetGlow:  'rgba(124,58,237,0.22)',
  emerald:     '#0EA871',
  emeraldGlow: 'rgba(14,168,113,0.22)',
  gold:        '#E8803A',
  goldGlow:    'rgba(232,128,58,0.22)',
  primaryDeep: '#1A1066',
} as const

export const theme = {
  colors: { ...v4theme.colors, ...extraColors },
  font: v4theme.font,
  spring: {
    ...v4theme.spring,
    precise: { damping: 200, stiffness: 120, mass: 1 },
  },
} as const
