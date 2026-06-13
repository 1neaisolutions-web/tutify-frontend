import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import {
  getSavedRouteScroll,
  restoreScrollWhenReady,
  saveRouteScroll,
} from './dashboardScrollState'
import { persistActiveDashboardScroll } from './dashboardScrollRegistry'

type Options = {
  scrollContainerRef: RefObject<HTMLDivElement | null>
  enabled: boolean
}

/**
 * Per-layout scroll save/restore. Runs inside DashboardScrollContainer so restore
 * always has a mounted scroll container (each route remounts its own layout).
 */
export function useDashboardRouteScroll({ scrollContainerRef, enabled }: Options) {
  const location = useLocation()
  const navigationType = useNavigationType()
  const historyKeyRef = useRef(location.key)
  const pathnameRef = useRef(location.pathname)
  historyKeyRef.current = location.key
  pathnameRef.current = location.pathname

  useEffect(() => {
    if (!enabled) return

    const onClickCapture = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const anchor = target.closest('a[href]')
      if (!anchor || anchor.getAttribute('target') === '_blank') return
      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return
      }
      if (/^https?:\/\//i.test(href)) {
        try {
          const url = new URL(href)
          if (url.origin !== window.location.origin) return
        } catch {
          return
        }
      }
      persistActiveDashboardScroll()
    }

    document.addEventListener('click', onClickCapture, true)
    return () => document.removeEventListener('click', onClickCapture, true)
  }, [enabled])

  // Reset to top immediately on forward navigation to avoid showing stale scroll.
  useLayoutEffect(() => {
    if (!enabled) return
    if (navigationType === 'POP') return
    const container = scrollContainerRef.current
    if (container) container.scrollTop = 0
  }, [enabled, location.key, location.pathname, navigationType, scrollContainerRef])

  // Restore after paint + when content height grows (async lists, images, etc.).
  useEffect(() => {
    if (!enabled) return

    const container = scrollContainerRef.current
    if (!container) return

    const historyKey = location.key
    const pathname = location.pathname

    let stopRestore: (() => void) | undefined

    if (navigationType === 'POP') {
      const saved = getSavedRouteScroll(historyKey, pathname)
      if (saved != null) {
        stopRestore = restoreScrollWhenReady(() => scrollContainerRef.current, saved)
      }
    }

    const onScroll = () => {
      const el = scrollContainerRef.current
      if (!el) return
      saveRouteScroll(historyKeyRef.current, pathnameRef.current, el.scrollTop)
    }

    container.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      stopRestore?.()
      container.removeEventListener('scroll', onScroll)
      // Detached nodes often report scrollTop 0 — would clobber a good saved position.
      if (container.isConnected) {
        saveRouteScroll(historyKey, pathname, container.scrollTop)
      }
    }
  }, [enabled, location.key, location.pathname, navigationType, scrollContainerRef])
}
