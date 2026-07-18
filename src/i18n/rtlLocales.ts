/** ISO 639-1 prefixes that use right-to-left script (for future layout mirroring). */
const RTL_PREFIXES = new Set(['ar', 'he', 'fa', 'ur'])

/** True when the locale's script is typically RTL (Urdu, Arabic, etc.). */
export function isRtlLocale(code: string): boolean {
  const prefix = code.split('-')[0]?.toLowerCase() ?? ''
  return RTL_PREFIXES.has(prefix)
}

/**
 * Document layout direction. Intentionally always LTR for now: only UI strings
 * change per language; sidebar, flex order, and alignment stay the English shell.
 * Re-enable `isRtlLocale(code) ? 'rtl' : 'ltr'` when a Settings RTL toggle exists.
 */
export function documentDirectionForLocale(_code: string): 'rtl' | 'ltr' {
  return 'ltr'
}
