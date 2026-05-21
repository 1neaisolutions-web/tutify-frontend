// Tutify V2 — Warm/Light Brand Tokens
// Apple / Linear / Stripe aesthetic — bright, friendly, educational

export const theme = {
  colors: {
    // Backgrounds
    bg: '#FAFBFE',         // Soft white — the base of every scene
    surface: '#FFFFFF',    // Pure white — cards, modals

    // Primary accents
    skyBlue: '#3B9EFF',    // Primary CTA, headings, highlights
    mint: '#5DD4B5',       // Secondary — teacher, growth, learning
    coral: '#FFB69E',      // Warm — human moments, warmth, parent
    lavender: '#B8A9F5',   // Fourth accent — admin, structure

    // Text
    charcoal: '#1A2942',   // Main text (not pure black — softer)
    muted: '#6B7A99',      // Secondary text, captions

    // Derived glow variants (used in radial gradients)
    skyBlueGlow: 'rgba(59, 158, 255, 0.18)',
    mintGlow: 'rgba(93, 212, 181, 0.18)',
    coralGlow: 'rgba(255, 182, 158, 0.18)',
    lavenderGlow: 'rgba(184, 169, 245, 0.18)',

    // Pastel backgrounds for character cards
    mintPastel: '#E8F9F5',
    skyPastel: '#E8F3FF',
    coralPastel: '#FFF0EA',
    lavenderPastel: '#F2F0FF',
  },

  fonts: {
    headline: '"Sora", "DM Sans", system-ui, sans-serif',
    body: '"DM Sans", "Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", monospace',
  },

  // Spring configs — spec asks for { damping: 200, stiffness: 100 } for entrances
  spring: {
    entrance: { damping: 200, stiffness: 100, mass: 1 },
    gentle:   { damping: 200, stiffness: 80,  mass: 1 },
    snappy:   { damping: 150, stiffness: 200, mass: 1 },
    bouncy:   { damping: 120, stiffness: 150, mass: 1 },
  },

  // Card & surface shadows — soft, never harsh
  shadows: {
    card:  '0 4px 24px rgba(26, 41, 66, 0.08), 0 1px 4px rgba(26, 41, 66, 0.04)',
    lifted:'0 8px 40px rgba(26, 41, 66, 0.12), 0 2px 8px rgba(26, 41, 66, 0.06)',
    soft:  '0 2px 12px rgba(26, 41, 66, 0.06)',
    glow:  (color: string) => `0 0 40px ${color}`,
  },

  // Standard beat durations in frames (30 fps)
  beats: {
    standard:   300, // 10s — Beats 01, 02, 03, 05, 06, 07, 08
    magic:      360, // 12s — Beat 04 (hero moment)
    short:      240, // 8s  — Beat 09
    transition:  15, // 0.5s white-wash between beats
    total:      2700, // 90s full composition
  },
} as const

export type Theme = typeof theme

// Easing helpers (Remotion-compatible bezier strings, also re-exported for CSS)
export const ease = {
  smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  enter:  'cubic-bezier(0.0,  0.0, 0.2,  1)',
  exit:   'cubic-bezier(0.4,  0.0, 1.0,  1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // slight overshoot
} as const
