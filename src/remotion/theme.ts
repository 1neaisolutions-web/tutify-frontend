// Tutify Brand Tokens — conference-grade palette
export const theme = {
  colors: {
    navy:      '#0B1F3A',
    skyBlue:   '#3B9EFF',
    teal:      '#00C9B1',
    white:     '#F5F9FF',
    textDark:  '#1A2942',

    // Derived helpers
    navyDeep:  '#060F1E',
    navyLight: '#112845',
    skyGlow:   'rgba(59,158,255,0.25)',
    tealGlow:  'rgba(0,201,177,0.25)',

    glass:     'rgba(255,255,255,0.07)',
    glassBorder: 'rgba(255,255,255,0.12)',
  },

  fonts: {
    headline: '"Sora", "Inter", sans-serif',
    body:     '"DM Sans", "Inter", sans-serif',
  },

  // Spring configs for Apple-keynote-style physics
  spring: {
    gentle:    { damping: 100, stiffness: 200, mass: 1 },
    snappy:    { damping: 80,  stiffness: 300, mass: 1 },
    bouncy:    { damping: 60,  stiffness: 200, mass: 1 },
    entrance:  { damping: 120, stiffness: 400, mass: 1 },
  },

  // Standard durations in frames (at 30 fps)
  durations: {
    entrance:   30,
    hold:      180,
    exit:       30,
    transition: 12,
    sceneFull: 252, // each scene in TransitionSeries (accounts for overlap)
    scene26:   300, // final hold scene
  },

  // CSS bezier easing strings
  easing: {
    apple: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    enter: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    exit:  'cubic-bezier(0.4, 0.0, 1.0, 1)',
  },
} as const

export type Theme = typeof theme
