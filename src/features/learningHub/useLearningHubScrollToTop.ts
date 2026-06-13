import { RefObject, useLayoutEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import { useDashboardScroll } from '../../contexts/DashboardScrollContext'
import { isLearningHubCatalogRoute } from './learningHubScrollState'

const LEARNING_HUB_ROOT = '/learning-hub'

/**
 * Resets scroll on Learning Hub detail route transitions.
 */
export function useLearningHubRouteScrollToTop(ready = true) {
  const { pathname } = useLocation()
  const navigationType = useNavigationType()
  const { scrollToTop } = useDashboardScroll()

  useLayoutEffect(() => {
    if (!ready) return
    if (!pathname.startsWith(LEARNING_HUB_ROOT)) return
    if (isLearningHubCatalogRoute(pathname)) return
    if (navigationType === 'POP') return

    scrollToTop()
  }, [pathname, navigationType, ready, scrollToTop])
}

/**
 * Resets scroll to the top of a content panel when content identity changes
 * inside the same route/component instance.
 */
export function useLearningHubContentScrollToTop(
  anchorRef: RefObject<HTMLElement | null>,
  contentKey: string,
) {
  const { getScrollContainer } = useDashboardScroll()

  useLayoutEffect(() => {
    const id = window.requestAnimationFrame(() => {
      const el = anchorRef.current
      const container = getScrollContainer()
      if (!el || !container) return

      const containerRect = container.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()
      container.scrollTop += elRect.top - containerRect.top
    })
    return () => window.cancelAnimationFrame(id)
  }, [anchorRef, contentKey, getScrollContainer])
}
