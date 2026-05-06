/**
 * RTK Query `unwrap()` rejects with a plain object, not an `Error`.
 * Use this when surfacing list-load failures in Teacher Tools pages.
 */
export function formatListLoadError(e: unknown): string {
  if (e instanceof Error) return e.message

  if (typeof e === 'string' && e.trim()) return e

  if (typeof e === 'object' && e !== null) {
    const o = e as Record<string, unknown>

    if (typeof o.message === 'string' && o.message.trim()) {
      const m = o.message.trim()
      // RTK may surface long ApiError text — keep a single line for UI.
      const oneLine = m.includes('\n') ? m.split('\n')[0].trim() : m
      return oneLine.length > 200 ? `${oneLine.slice(0, 197)}…` : oneLine
    }
    if (typeof o.error === 'string' && o.error.trim()) return o.error

    const status = o.status
    if (status === 'FETCH_ERROR' && typeof o.error === 'string') {
      return o.error.includes('Failed to fetch')
        ? 'Could not reach the server. Check that the API is running and your network connection.'
        : o.error
    }
    if (status === 'TIMEOUT_ERROR') return 'The request timed out. Try again.'

    const data = o.data
    if (typeof data === 'object' && data !== null) {
      const d = data as Record<string, unknown>
      if (typeof d.detail === 'string' && d.detail.trim()) return d.detail
      if (Array.isArray(d.detail)) {
        const parts = d.detail.map((x) => (typeof x === 'object' && x !== null ? JSON.stringify(x) : String(x)))
        return parts.join('; ')
      }
      if (typeof d.detail === 'object' && d.detail !== null) {
        const de = d.detail as Record<string, unknown>
        if (typeof de.message === 'string') return de.message
      }
    }

    if (typeof status === 'number') {
      if (status === 401) return 'Your session expired or you are not signed in. Sign in again to load this list.'
      if (status === 403) return 'You do not have permission to view this list.'
      if (status === 404) return 'This list endpoint was not found. Restart the API or update the app if you recently deployed.'
      if (status === 503) return 'The service is temporarily unavailable (often a database issue). Try again shortly.'
      return `Request failed (HTTP ${status}).`
    }
  }

  return 'Something went wrong'
}
