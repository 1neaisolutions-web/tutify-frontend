import { useEffect, useLayoutEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import { useDashboardScroll } from '../../contexts/DashboardScrollContext'
import { restoreScrollWhenReady } from '../../contexts/dashboardScrollState'
import {
  clearChatbotsCatalogScrollState,
  isChatbotCatalogRoute,
  peekChatbotsCatalogScrollState,
} from './chatbotsScrollState'

type LocationState = {
  restoreScroll?: boolean
}

/**
 * Restores catalog scroll when returning from a chatbot detail page, or resets to top on fresh visits.
 */
export function useRestoreChatbotsCatalogScroll(ready = true) {
  const { pathname, state } = useLocation()
  const navigationType = useNavigationType()
  const { getScrollContainer, scrollToTop } = useDashboardScroll()
  const restoreScroll = (state as LocationState | null)?.restoreScroll === true
  const shouldRestore = navigationType === 'POP' || restoreScroll

  useLayoutEffect(() => {
    if (!ready || !isChatbotCatalogRoute(pathname)) return

    if (shouldRestore) {
      const saved = peekChatbotsCatalogScrollState()
      if (!saved || saved.pathname !== pathname) return
      const container = getScrollContainer()
      if (container) container.scrollTop = saved.scrollTop
      return
    }

    clearChatbotsCatalogScrollState()
    scrollToTop()
  }, [pathname, shouldRestore, ready, scrollToTop, getScrollContainer])

  useEffect(() => {
    if (!ready || !isChatbotCatalogRoute(pathname)) return
    if (!shouldRestore) return

    const saved = peekChatbotsCatalogScrollState()
    if (!saved || saved.pathname !== pathname) return

    return restoreScrollWhenReady(() => getScrollContainer(), saved.scrollTop)
  }, [pathname, shouldRestore, ready, getScrollContainer])
}
