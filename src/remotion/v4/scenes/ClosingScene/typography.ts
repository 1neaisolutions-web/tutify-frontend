import { INTRO_HEADLINE } from '../../../compositions/shared/introHeadlineTypography'

/** Same scale as Teaching Intro / Education / Overwhelmed */
export const CLOSING_TYPE = {
  line1FontSize: INTRO_HEADLINE.fontSize,
  line1FontWeight: INTRO_HEADLINE.fontWeight,
  line2FontSize: INTRO_HEADLINE.fontSize,
  line2FontWeight: 500,
  line2EmphasisFontSize: Math.round(INTRO_HEADLINE.fontSize * 1.08),
  line2EmphasisFontWeight: 700,
  letterSpacing: INTRO_HEADLINE.letterSpacing,
  paddingX: INTRO_HEADLINE.paddingX,
  maxWidth: INTRO_HEADLINE.maxWidth,
  wordGap: INTRO_HEADLINE.wordGap,
} as const
