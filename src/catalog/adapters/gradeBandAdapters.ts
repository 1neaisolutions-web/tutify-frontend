import { FALLBACK_GRADE_BANDS } from '../fallbacks'
import {
  CHATBOT_BAND_DEFS,
  CAREER_BUSINESS_BAND_DEFS,
  VISUAL_ARTS_BAND_DEFS,
  YOUTUBE_BAND_DEFS,
  type GradeBandContextKey,
} from '../contexts'

/** Grade band legacy value → canonical GRADE_BANDS value. Keep in sync with metadata_data.GRADE_BAND_ALIASES */
const GRADE_BAND_ALIASES: Record<string, string> = {
  'k-5': 'K-2',
  'k-2': 'K-2',
  '3-5': '3-5',
  'grades 3-5': '3-5',
  '6-8': '6-8',
  'grades 6-8': '6-8',
  '9-10': '9-12',
  '9-12': '9-12',
  'grades 9-10': '9-12',
  'grades 11-12': '9-12',
  'higher education': 'higher_ed',
  higher_ed: 'higher_ed',
  'elementary (k-5)': 'K-2',
  'middle school (6-8)': '6-8',
  'high school (9-12)': '9-12',
  college: 'higher_ed',
  ms: '6-8',
  hs: '9-12',
  'middle school': '6-8',
  'high school': '9-12',
  'elementary (3-5)': '3-5',
}

export function resolveGradeBandValue(raw: string | null | undefined): string {
  if (!raw) return ''
  const key = raw.trim().toLowerCase()
  return GRADE_BAND_ALIASES[key] ?? raw.trim()
}

export function gradeBandValueForSelect(stored: string | null | undefined): string {
  return resolveGradeBandValue(stored)
}

export function formatGradeBandDisplay(stored: string | null | undefined): string {
  if (!stored) return ''
  const canonical = resolveGradeBandValue(stored)
  const fromFallback = FALLBACK_GRADE_BANDS.find((b) => b.value === canonical)
  if (fromFallback) return fromFallback.label
  const fromVisual = VISUAL_ARTS_BAND_DEFS.find((b) => b.value === stored || b.value === canonical)
  if (fromVisual) return fromVisual.label
  const fromYoutube = YOUTUBE_BAND_DEFS.find(
    (b) => b.apiValue === stored || b.value === stored || b.value === canonical,
  )
  if (fromYoutube) return fromYoutube.label
  const fromChatbot = CHATBOT_BAND_DEFS.find((b) => b.apiValue === stored || b.value === canonical)
  if (fromChatbot) return fromChatbot.label
  return stored
}

export function visualArtsGradeBandValueForSelect(stored: string | null | undefined): string {
  const v = stored?.trim()
  if (v && VISUAL_ARTS_BAND_DEFS.some((b) => b.value === v)) return v
  const canonical = resolveGradeBandValue(stored)
  if (canonical === '3-5' || canonical === 'K-2') return 'K-5'
  if (canonical === '6-8') return '6-8'
  if (canonical === '9-12') return '9-12'
  return '6-8'
}

export function visualArtsBandToApi(value: string): string {
  const match = VISUAL_ARTS_BAND_DEFS.find((b) => b.value === value)
  return match?.apiValue ?? value
}

export function youtubeGradeBandValueForSelect(stored: string | null | undefined): string {
  if (!stored) return '6-8'
  const trimmed = stored.trim()
  const byApi = YOUTUBE_BAND_DEFS.find(
    (b) => b.apiValue?.toLowerCase() === trimmed.toLowerCase() || b.value === trimmed,
  )
  if (byApi) return byApi.value
  const key = trimmed.toLowerCase()
  const aliasToCanonical: Record<string, string> = {
    '3-5': '3-5',
    'grades 3-5': '3-5',
    '6-8': '6-8',
    'grades 6-8': '6-8',
    '9-12': '9-10',
    'grades 9-10': '9-10',
    'grades 11-12': '11-12',
    higher_ed: 'higher_ed',
    'higher education': 'higher_ed',
  }
  if (aliasToCanonical[key]) return aliasToCanonical[key]
  return '6-8'
}

export function youtubeBandToApi(value: string): string {
  const match = YOUTUBE_BAND_DEFS.find((b) => b.value === value)
  return match?.apiValue ?? value
}

export function chatbotBandValueForSelect(stored: string | null | undefined): string {
  if (!stored) return '6-8'
  const trimmed = stored.trim()
  const byApi = CHATBOT_BAND_DEFS.find(
    (b) => b.apiValue.toLowerCase() === trimmed.toLowerCase() || b.value === trimmed,
  )
  if (byApi) return byApi.value
  return resolveGradeBandValue(stored) || '6-8'
}

export function chatbotBandToApi(canonical: string): string {
  const match = CHATBOT_BAND_DEFS.find((b) => b.value === canonical)
  if (match) return match.apiValue
  const key = canonical.trim().toLowerCase()
  const alias: Record<string, string> = {
    'k-2': 'Elementary (K-5)',
    '3-5': 'Elementary (K-5)',
    '6-8': 'Middle School (6-8)',
    '9-12': 'High School (9-12)',
    higher_ed: 'College',
  }
  return alias[key] ?? canonical
}

export function careerBusinessBandValueForSelect(stored: string | null | undefined): string {
  if (!stored) return '9-12'
  const trimmed = stored.trim()
  const byApi = CAREER_BUSINESS_BAND_DEFS.find(
    (b) => b.apiValue?.toLowerCase() === trimmed.toLowerCase() || b.value === trimmed,
  )
  if (byApi) return byApi.value
  if (trimmed.toLowerCase() === 'college') return 'higher_ed'
  return trimmed
}

export function careerBusinessBandToApi(canonical: string): string {
  const match = CAREER_BUSINESS_BAND_DEFS.find((b) => b.value === canonical)
  if (match?.apiValue) return match.apiValue
  return canonical
}

/** Engineering Design module uses short band labels in UI/API. */
export function engineeringBandToApi(canonical: string): string {
  const map: Record<string, string> = {
    '3-5': 'Elementary',
    '6-8': 'Middle School',
    '9-12': 'High School',
  }
  return map[canonical] ?? canonical
}

export function engineeringBandValueForSelect(stored: string | null | undefined): string {
  if (!stored) return ''
  const key = stored.trim().toLowerCase()
  const reverse: Record<string, string> = {
    elementary: '3-5',
    'middle school': '6-8',
    'high school': '9-12',
  }
  if (reverse[key]) return reverse[key]
  return chatbotBandValueForSelect(stored)
}

export function bandValueForSelect(
  stored: string | null | undefined,
  context: GradeBandContextKey,
): string {
  switch (context) {
    case 'youtube':
      return youtubeGradeBandValueForSelect(stored)
    case 'visualArts':
      return visualArtsGradeBandValueForSelect(stored)
    case 'chatbotBand':
      return chatbotBandValueForSelect(stored)
    case 'careerBusiness':
      return careerBusinessBandValueForSelect(stored)
    default:
      return gradeBandValueForSelect(stored)
  }
}

export function bandToApi(value: string, context: GradeBandContextKey): string {
  switch (context) {
    case 'youtube':
      return youtubeBandToApi(value)
    case 'visualArts':
      return visualArtsBandToApi(value)
    case 'chatbotBand':
      return chatbotBandToApi(value)
    case 'careerBusiness':
      return careerBusinessBandToApi(value)
    default:
      return value
  }
}

/** @deprecated use VISUAL_ARTS_BAND_DEFS from contexts */
export const VISUAL_ARTS_GRADE_BANDS = VISUAL_ARTS_BAND_DEFS

/** @deprecated use YOUTUBE_BAND_DEFS from contexts */
export const YOUTUBE_GRADE_BAND_VALUES = YOUTUBE_BAND_DEFS.map((b) => b.apiValue ?? b.value)
