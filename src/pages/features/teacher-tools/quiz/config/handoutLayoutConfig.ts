/** Handout / PDF visual density (spacing only — question text is edited in Review). */
export type HandoutLayoutOpts = {
  /** Line height multiplier for body text (print + PDF). */
  bodyLineHeight: number
  /** Vertical space after each question block (px at ~96dpi; converted for PDF). */
  questionGapPx: number
  /**
   * Height of each ruled row for short-answer responses (px).
   * Larger values match real handwriting; saved with the quiz for PDF / print.
   */
  ruledLineSpacingPx: number
}

export const DEFAULT_HANDOUT_LAYOUT: HandoutLayoutOpts = {
  bodyLineHeight: 1.45,
  questionGapPx: 14,
  ruledLineSpacingPx: 44,
}

export const LINE_HEIGHT_PRESETS = [1.25, 1.35, 1.45, 1.55, 1.65, 1.75, 2] as const

export const QUESTION_GAP_PRESETS = [8, 12, 14, 18, 22, 28] as const

/** Vertical room per handwriting line on short-answer items (screen px). */
export const RULED_LINE_SPACING_PRESETS = [32, 36, 40, 44, 48, 54, 60, 72] as const

/** px → mm for jsPDF vertical gaps (96dpi approximation). */
export function questionGapPxToMm(px: number): number {
  return (Number.isFinite(px) ? px : DEFAULT_HANDOUT_LAYOUT.questionGapPx) * 0.264583
}

export function ruledLineSpacingPxToMm(px: number): number {
  const v = Number.isFinite(px) ? px : DEFAULT_HANDOUT_LAYOUT.ruledLineSpacingPx
  const clampedPx = Math.min(80, Math.max(24, v))
  return clampedPx * 0.264583
}
