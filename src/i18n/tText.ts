import type { TFunction } from 'i18next'

type TOptions = Parameters<TFunction>[1]

/**
 * Always returns a render-safe string from i18next.
 * Prevents React crashes when a key resolves to a nested object.
 */
export function tText(t: TFunction, key: string, options?: TOptions): string {
  const value = t(key, { ...options, defaultValue: options?.defaultValue ?? '' })
  if (typeof value === 'string') {
    if (!value || value === key) {
      const fallback = options?.defaultValue
      return typeof fallback === 'string' ? fallback : key
    }
    return value
  }
  if (typeof options?.defaultValue === 'string' && options.defaultValue) {
    return options.defaultValue
  }
  return key
}
