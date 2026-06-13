import { useEffect } from 'react'

/**
 * Disables native window scroll restoration (dashboard uses a custom scroll pane).
 */
export function DashboardScrollRestoration() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const previous = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    return () => {
      window.history.scrollRestoration = previous
    }
  }, [])

  return null
}
