/**
 * Shared beat vocabulary for TutifyDemoV6 pacing (@ 30 fps).
 */
export type RhythmTier =
  | 'opening'
  | 'emotional'
  | 'feature-intro'
  | 'feature-demo'
  | 'ecosystem'
  | 'closing'

export const FPS = 30

export const HOLD_BY_TIER: Record<RhythmTier, number> = {
  opening: 18,
  emotional: 24,
  'feature-intro': 12,
  'feature-demo': 10,
  ecosystem: 16,
  closing: 28,
}

/** Scene04_AIAssistant — hold after last output card (~1s @ 30fps). */
export const FEATURE_DEMO_RESULT_HOLD = 20
/** Pause after prompt typing ends before Generate (Scene04 frames 98→108). */
export const FEATURE_DEMO_POST_TYPE_PAUSE = 6

export const EXIT_BY_TIER: Record<RhythmTier, number> = {
  opening: 14,
  emotional: 14,
  'feature-intro': 12,
  'feature-demo': 10,
  ecosystem: 12,
  closing: 12,
}

export type BeatSpec = {
  wordCount?: number
  start?: number
  stagger?: number
  settle?: number
  hold?: number
  exit?: number
  tier?: RhythmTier
}

const DEFAULT_STAGGER = 10
const DEFAULT_SETTLE = 18

/** Word-by-word typography (matches AI Teacher / YouTube / Image intros). */
export const TEXT_REVEAL_STAGGER = 8
export const TEXT_REVEAL_SETTLE = 16
export const TEXT_REVEAL_ROW_GAP = 10
/** Read hold after a line finishes revealing (~1.3s @ 30fps). */
export const TEXT_REVEAL_HOLD = 20
/** Crossfade between headline lines. */
export const TEXT_REVEAL_CROSSFADE = 10

/** Total scene length from word-reveal + hold + exit (no crossfade). */
export const durationFromBeats = ({
  wordCount = 0,
  start = 8,
  stagger = DEFAULT_STAGGER,
  settle = DEFAULT_SETTLE,
  hold,
  exit,
  tier = 'feature-intro',
}: BeatSpec): number => {
  const lastWordStart = wordCount > 0 ? start + (wordCount - 1) * stagger : start
  const revealDone = wordCount > 0 ? lastWordStart + settle : start
  const holdFrames = hold ?? HOLD_BY_TIER[tier]
  const exitFrames = exit ?? EXIT_BY_TIER[tier]
  return revealDone + holdFrames + exitFrames
}
