/** When true, theme is forced to LOCKED_THEME and user cannot change it in Settings. Language is always user-controlled. */
export const THEME_LOCKED =
  String(import.meta.env.VITE_LOCK_PREFERENCES ?? '').toLowerCase() === 'true'

/** @deprecated Use THEME_LOCKED — kept for call sites that still reference the old name. */
export const PREFERENCES_LOCKED = THEME_LOCKED

export const LOCKED_THEME = 'light' as const
