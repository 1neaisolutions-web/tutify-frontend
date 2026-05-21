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
  opening: 36,
  emotional: 42,
  'feature-intro': 24,
  'feature-demo': 18,
  ecosystem: 30,
  closing: 52,
}

/** Scene04_AIAssistant — hold after last output card (~1s @ 30fps). */
export const FEATURE_DEMO_RESULT_HOLD = 30
/** Pause after prompt typing ends before Generate (Scene04 frames 98→108). */
export const FEATURE_DEMO_POST_TYPE_PAUSE = 10

export const EXIT_BY_TIER: Record<RhythmTier, number> = {
  opening: 28,
  emotional: 24,
  'feature-intro': 22,
  'feature-demo': 20,
  ecosystem: 24,
  closing: 24,
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
export const TEXT_REVEAL_STAGGER = 12
export const TEXT_REVEAL_SETTLE = 28
export const TEXT_REVEAL_ROW_GAP = 10
/** Read hold after a line finishes revealing (~1.3s @ 30fps). */
export const TEXT_REVEAL_HOLD = 40
/** Crossfade between headline lines. */
export const TEXT_REVEAL_CROSSFADE = 18

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
