import { RefObject, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

const LEARNING_HUB_ROOT = '/learning-hub'

function scrollWindowToTop() {
  if (typeof window === 'undefined') return
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
}

/**
 * Resets scroll on Learning Hub route transitions.
 * Covers `/learning-hub` and any `/learning-hub/*` detail route.
 */
export function useLearningHubRouteScrollToTop() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    if (!pathname.startsWith(LEARNING_HUB_ROOT)) return
    const id = window.requestAnimationFrame(scrollWindowToTop)
    return () => window.cancelAnimationFrame(id)
  }, [pathname])
}

/**
 * Resets scroll to the top of a content panel when content identity changes
 * inside the same route/component instance.
 */
export function useLearningHubContentScrollToTop(
  anchorRef: RefObject<HTMLElement | null>,
  contentKey: string
) {
  useLayoutEffect(() => {
    const id = window.requestAnimationFrame(() => {
      const el = anchorRef.current
      if (!el) return
      el.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'auto' })
    })
    return () => window.cancelAnimationFrame(id)
  }, [anchorRef, contentKey])
}

