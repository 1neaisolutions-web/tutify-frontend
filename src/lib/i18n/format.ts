type StoreLike = { getState: () => any } | null

let storeRef: StoreLike = null

export const setFormatStoreReference = (store: { getState: () => any }) => {
  storeRef = store
}

const getPrefs = (): { language: string; timezone: string } => {
  try {
    const state = storeRef?.getState?.()
    const p = state?.preferences
    return {
      language: p?.language || 'en-US',
      timezone: p?.timezone || 'UTC',
    }
  } catch {
    return { language: 'en-US', timezone: 'UTC' }
  }
}

export function formatDate(
  value: string | number | Date | null | undefined,
  options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' },
): string {
  if (!value) return '—'
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  const { language, timezone } = getPrefs()
  return new Intl.DateTimeFormat(language, { ...options, timeZone: timezone }).format(d)
}

export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  const { language } = getPrefs()
  return new Intl.NumberFormat(language, options).format(value)
}

export function formatCurrency(value: number, currency = 'USD'): string {
  const { language } = getPrefs()
  return new Intl.NumberFormat(language, { style: 'currency', currency }).format(value)
}

export function formatRelative(isoOrDate: string | Date): string {
  const date = isoOrDate instanceof Date ? isoOrDate : new Date(isoOrDate)
  const t = date.getTime()
  if (Number.isNaN(t)) return String(isoOrDate)

  const now = Date.now()
  const diffMs = t - now // positive = future, negative = past
  const abs = Math.abs(diffMs)

  const rtf = new Intl.RelativeTimeFormat(getPrefs().language, { numeric: 'auto' })

  const minute = 60_000
  const hour = 3_600_000
  const day = 86_400_000
  const week = 604_800_000
  const month = 2_592_000_000
  const year = 31_536_000_000

  if (abs < minute) return rtf.format(Math.round(diffMs / 1000), 'second')
  if (abs < hour) return rtf.format(Math.round(diffMs / minute), 'minute')
  if (abs < day) return rtf.format(Math.round(diffMs / hour), 'hour')
  if (abs < week) return rtf.format(Math.round(diffMs / day), 'day')
  if (abs < month) return rtf.format(Math.round(diffMs / week), 'week')
  if (abs < year) return rtf.format(Math.round(diffMs / month), 'month')
  return rtf.format(Math.round(diffMs / year), 'year')
}

