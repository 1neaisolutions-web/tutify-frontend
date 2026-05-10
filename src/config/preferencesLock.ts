export const PREFERENCES_LOCKED =
  String(import.meta.env.VITE_LOCK_PREFERENCES ?? '').toLowerCase() === 'true'

export const LOCKED_THEME = 'light' as const
export const LOCKED_LANGUAGE = 'en-US' as const

