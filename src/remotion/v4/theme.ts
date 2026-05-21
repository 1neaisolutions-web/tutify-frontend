/**
 * V4 Theme — Light SaaS palette inspired by the reference video.
 * Soft animated gradients (lavender + cream), dark text, frosted-glass cards.
 */
export const theme = {
  colors: {
    // Gradient blob base colors
    bgBase:    '#BFC5E8',           // soft periwinkle base
    blobCool:  'rgba(148,155,220,0.78)',  // periwinkle blob
    blobWarm:  'rgba(242,232,212,0.82)',  // warm cream blob
    blobLight: 'rgba(255,255,255,0.58)',  // white highlight
    blobPurp:  'rgba(190,180,240,0.65)',  // soft violet

    // Surface
    surface:       'rgba(255,255,255,0.62)',
    surfaceStrong: 'rgba(255,255,255,0.82)',
    surfaceDim:    'rgba(255,255,255,0.38)',
    border:        'rgba(255,255,255,0.80)',
    borderDim:     'rgba(180,185,225,0.45)',

    // Brand
    primary:     '#5B4FCF',         // rich indigo-violet
    primaryDark: '#3B30A8',
    primaryGlow: 'rgba(91,79,207,0.22)',
    primarySoft: 'rgba(91,79,207,0.10)',

    accent:      '#E8803A',         // warm amber-orange
    accentLight: '#F5B07A',
    accentGlow:  'rgba(232,128,58,0.20)',

    secondary:     '#0EA871',       // fresh emerald
    secondaryGlow: 'rgba(14,168,113,0.20)',

    purple:      '#8B5CF6',
    purpleGlow:  'rgba(139,92,246,0.20)',

    rose:        '#E0556C',
    roseGlow:    'rgba(224,85,108,0.18)',

    // Typography — dark on light
    text:      '#1E1B4B',           // deep indigo-navy
    textMuted: '#5C5A80',           // medium indigo-gray
    textDim:   '#9898C0',           // dim
    textWhite: '#FFFFFF',           // for inverted contexts
  },

  font: {
    display: '"Inter", "SF Pro Display", system-ui, sans-serif',
    mono:    '"JetBrains Mono", "Fira Code", monospace',
  },

  spring: {
    gentle:   { damping: 200, stiffness: 100, mass: 1 },
    snappy:   { damping: 80,  stiffness: 200, mass: 1 },
    bouncy:   { damping: 60,  stiffness: 200, mass: 1 },
    entrance: { damping: 150, stiffness: 150, mass: 1 },
    logo:     { damping: 200, stiffness: 120, mass: 1 },
    heavy:    { damping: 20,  stiffness: 200, mass: 1.5 },
    word:     { damping: 90,  stiffness: 280, mass: 1 },   // word-by-word
    zoom:     { damping: 80,  stiffness: 180, mass: 1 },   // zoom-in reveals
  },
} as const
