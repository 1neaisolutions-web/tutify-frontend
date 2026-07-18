import localeManifest from '../locales/locale-manifest.json'

/** All supported locale codes — every one has a complete bundle. */
export const FULL_LOCALE_CODES = localeManifest.fullLocales as readonly string[]

/** @deprecated No longer needed — all locales are full */
export const SHELL_MERGED_LOCALES = [] as const

/** @deprecated No longer needed — all locales are full */
export const PARTIAL_LOCALES = [] as const

export const FULLY_TRANSLATED_LOCALES = FULL_LOCALE_CODES

export type FullyTranslatedLocale = (typeof FULLY_TRANSLATED_LOCALES)[number]

/** Map ISO 639-1 prefix → canonical bundle when not an exact locale match. */
export const PREFIX_BUNDLE: Record<string, string> = {
  ...(localeManifest.prefixToFull as Record<string, string>),
}

const FULL_LOCALE_SET = new Set<string>(FULL_LOCALE_CODES)

/** Keys that must resolve to human-readable text (never the raw key) in every UI bundle. */
export const SHELL_TRANSLATION_KEYS = [
  'app.name',
  'nav.dashboard',
  'nav.teacherTools',
  'nav.settings',
  'settings.tabs.general',
  'settings.general.title',
  'settings.general.language.label',
  'layout.activateCredits',
  'languageDropdown.placeholder',
] as const

export type LanguageUiMode = 'full' | 'shell' | 'fallback'

export interface LanguageExpectation {
  code: string
  bundle: string
  hasUiTranslation: boolean
  uiMode: LanguageUiMode
}

/**
 * Maps ANY BCP 47 language tag to the nearest bundle we have.
 */
export function resolveTranslationLocale(code: string): string {
  if (!code) return 'en-US'

  if ((FULL_LOCALE_CODES as readonly string[]).includes(code)) return code

  const lang = code.split('-')[0]?.toLowerCase() ?? ''
  if (PREFIX_BUNDLE[lang]) return PREFIX_BUNDLE[lang]

  const match = (FULL_LOCALE_CODES as readonly string[]).find(
    (l) => l.split('-')[0]?.toLowerCase() === lang,
  )
  if (match) return match

  return 'en-US'
}

/** True when the app activates a non-English UI bundle for this preference code. */
export function hasUiTranslation(code: string): boolean {
  if (code.startsWith('en')) return true
  return resolveTranslationLocale(code) !== 'en-US'
}

export function getLanguageExpectation(code: string): LanguageExpectation {
  const bundle = resolveTranslationLocale(code)
  const hasUi = hasUiTranslation(code)
  const uiMode: LanguageUiMode = FULL_LOCALE_SET.has(bundle) ? 'full' : 'fallback'
  return { code, bundle, hasUiTranslation: hasUi, uiMode }
}

/** Returns true when t(key) is a human string, not the raw key path. */
export function isResolvedTranslation(key: string, value: string): boolean {
  if (!value || value === key) return false
  if (value.includes('.') && value.split('.').length >= 2 && /^[a-zA-Z]/.test(value)) {
    const parts = value.split('.')
    if (parts.every((p) => /^[a-zA-Z][a-zA-Z0-9]*$/.test(p))) return false
  }
  return true
}
