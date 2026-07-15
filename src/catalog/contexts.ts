import { FALLBACK_GRADE_BANDS } from './fallbacks'

export type GradeBandContextKey =
  | 'default'
  | 'youtube'
  | 'visualArts'
  | 'chatbotBand'
  | 'careerBusiness'

export type GradeBandOption = { value: string; label: string; apiValue?: string }

function metadataBandLabel(
  slug: string,
  reduxBands?: GradeBandOption[],
  fallback?: string,
): string {
  const fromRedux = reduxBands?.find((b) => b.value === slug)
  if (fromRedux) return fromRedux.label
  const fromFallback = FALLBACK_GRADE_BANDS.find((b) => b.value === slug)
  return fromFallback?.label ?? fallback ?? slug
}

/** Standard metadata bands — values are canonical slugs */
export const DEFAULT_BAND_OPTIONS: GradeBandOption[] = [...FALLBACK_GRADE_BANDS]

/** Static defs for adapters (apiValue preserved for legacy APIs). */
export const YOUTUBE_BAND_DEFS: GradeBandOption[] = [
  { value: '3-5', label: '3–5', apiValue: 'Grades 3-5' },
  { value: '6-8', label: '6–8', apiValue: 'Grades 6-8' },
  { value: '9-10', label: '9–12', apiValue: 'Grades 9-10' },
  { value: '11-12', label: '9–12', apiValue: 'Grades 11-12' },
  { value: 'higher_ed', label: 'Higher Education', apiValue: 'Higher Education' },
]

export const VISUAL_ARTS_BAND_DEFS: GradeBandOption[] = [
  { value: 'K-5', label: 'K–5', apiValue: 'K-5' },
  { value: '6-8', label: '6–8', apiValue: '6-8' },
  { value: '9-12', label: '9–12', apiValue: '9-12' },
]

export const CHATBOT_BAND_DEFS: GradeBandOption[] = [
  { value: '3-5', label: '3–5', apiValue: 'Elementary (K-5)' },
  { value: '6-8', label: '6–8', apiValue: 'Middle School (6-8)' },
  { value: '9-12', label: '9–12', apiValue: 'High School (9-12)' },
  { value: 'higher_ed', label: 'Higher Education', apiValue: 'College' },
]

export const CAREER_BUSINESS_BAND_DEFS: GradeBandOption[] = [
  { value: '9-12', label: '9–12' },
  { value: '11-12', label: '9–12' },
  { value: 'higher_ed', label: 'College', apiValue: 'College' },
]

/** @deprecated Use buildYoutubeBandOptions — kept for adapter lookups */
export const YOUTUBE_BAND_OPTIONS = YOUTUBE_BAND_DEFS

/** @deprecated Use buildVisualArtsBandOptions */
export const VISUAL_ARTS_BAND_OPTIONS = VISUAL_ARTS_BAND_DEFS

/** @deprecated Use buildChatbotBandOptions */
export const CHATBOT_BAND_OPTIONS = CHATBOT_BAND_DEFS

/** @deprecated Use buildCareerBusinessBandOptions */
export const CAREER_BUSINESS_BAND_OPTIONS = CAREER_BUSINESS_BAND_DEFS

export function buildYoutubeBandOptions(
  reduxBands?: GradeBandOption[],
  i18nFallbacks?: {
    grades35?: string
    grades68?: string
    grades910?: string
    grades1112?: string
    higherEd?: string
  },
): GradeBandOption[] {
  return [
    {
      value: '3-5',
      label: metadataBandLabel('3-5', reduxBands, i18nFallbacks?.grades35 ?? '3–5'),
      apiValue: 'Grades 3-5',
    },
    {
      value: '6-8',
      label: metadataBandLabel('6-8', reduxBands, i18nFallbacks?.grades68 ?? '6–8'),
      apiValue: 'Grades 6-8',
    },
    {
      value: '9-10',
      label: i18nFallbacks?.grades910 ?? metadataBandLabel('9-12', reduxBands, '9–12'),
      apiValue: 'Grades 9-10',
    },
    {
      value: '11-12',
      label: i18nFallbacks?.grades1112 ?? metadataBandLabel('9-12', reduxBands, '9–12'),
      apiValue: 'Grades 11-12',
    },
    {
      value: 'higher_ed',
      label: metadataBandLabel('higher_ed', reduxBands, i18nFallbacks?.higherEd ?? 'Higher Education'),
      apiValue: 'Higher Education',
    },
  ]
}

export function buildVisualArtsBandOptions(
  reduxBands?: GradeBandOption[],
  k5Label?: string,
): GradeBandOption[] {
  const k2 = metadataBandLabel('K-2', reduxBands, 'K–2')
  const threeFive = metadataBandLabel('3-5', reduxBands, '3–5')
  const mergedK5 = k5Label ?? (k2 === threeFive ? k2 : `${k2} / ${threeFive}`)
  return [
    { value: 'K-5', label: mergedK5, apiValue: 'K-5' },
    {
      value: '6-8',
      label: metadataBandLabel('6-8', reduxBands, '6–8'),
      apiValue: '6-8',
    },
    {
      value: '9-12',
      label: metadataBandLabel('9-12', reduxBands, '9–12'),
      apiValue: '9-12',
    },
  ]
}

export function buildChatbotBandOptions(reduxBands?: GradeBandOption[]): GradeBandOption[] {
  return CHATBOT_BAND_DEFS.map((def) => ({
    ...def,
    label: metadataBandLabel(def.value, reduxBands, def.label),
  }))
}

export function buildCareerBusinessBandOptions(
  reduxBands?: GradeBandOption[],
  collegeLabel = 'College',
): GradeBandOption[] {
  return [
    { value: '9-12', label: metadataBandLabel('9-12', reduxBands, '9–12') },
    { value: '11-12', label: metadataBandLabel('9-12', reduxBands, '9–12') },
    { value: 'higher_ed', label: collegeLabel, apiValue: 'College' },
  ]
}

export function getBandOptionsForContext(
  context: GradeBandContextKey,
  reduxBands?: GradeBandOption[],
): GradeBandOption[] {
  switch (context) {
    case 'youtube':
      return buildYoutubeBandOptions(reduxBands)
    case 'visualArts':
      return buildVisualArtsBandOptions(reduxBands)
    case 'chatbotBand':
      return buildChatbotBandOptions(reduxBands)
    case 'careerBusiness':
      return buildCareerBusinessBandOptions(reduxBands)
    default:
      return reduxBands && reduxBands.length > 0 ? reduxBands : DEFAULT_BAND_OPTIONS
  }
}
