/** Source-frame timing for V9 pathways bracket handoff (Scene07 @ 30fps authoring). */
export const PATHWAYS_HANDOFF = {
  /** Start closing brackets after initial pathways settle. */
  bracketCloseStart: 350,
  bracketCloseEnd: 368,
  /** Zoom the closed bracket pair toward camera. */
  zoomInEnd: 388,
  bracketGapOpen: 28,
  /** Full text width at close start (px) — must fit "complete pathways" @ 88px. */
  textSlotPx: 780,
  zoomScaleMax: 3.4,
} as const
