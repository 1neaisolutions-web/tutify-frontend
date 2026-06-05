import { Easing } from 'remotion'

export const LAUNCH_FPS = 30
export const LAUNCH_DURATION_SECONDS = 60
export const LAUNCH_DURATION_FRAMES = LAUNCH_FPS * LAUNCH_DURATION_SECONDS

export const launchEasing = {
  standard: Easing.bezier(0.33, 0, 0.2, 1),
  revealSnap: Easing.bezier(0.22, 1, 0.36, 1),
  exit: Easing.bezier(0.4, 0, 1, 1),
} as const

export const launchColors = {
  pageGradient:
    'radial-gradient(ellipse 75% 60% at 20% 10%, rgba(125,170,255,0.22) 0%, transparent 70%), radial-gradient(ellipse 80% 62% at 85% 90%, rgba(161,209,255,0.2) 0%, transparent 72%), linear-gradient(145deg, #F7FBFF 0%, #EEF5FF 44%, #FFFFFF 100%)',
  glassBg: 'rgba(255,255,255,0.88)',
  glassStroke: 'rgba(151, 177, 225, 0.28)',
  glassShadow: '0 16px 48px rgba(28, 58, 104, 0.08)',
  primaryText: '#0D2244',
  secondaryText: '#355B93',
  accentBlue: '#2563EB',
  accentBlueDeep: '#1D4ED8',
  accentBlueSoft: '#93C5FD',
} as const

export const launchTypography = {
  family: 'Inter, sans-serif',
  heroSize: 58,
  headingSize: 40,
  bodySize: 24,
  labelSize: 14,
} as const

export const launchSpacing = {
  cardRadius: 24,
  panelPadding: 28,
  sectionGap: 22,
  transitionOverlapFrames: 10,
} as const

export const readabilityGuardrails = {
  maxHighEnergyConcurrentMotions: 2,
  settleWindowFrames: [24, 45] as const,
  keepSinglePrimaryFocalModule: true,
  avoidFullDashboardOverload: true,
} as const

