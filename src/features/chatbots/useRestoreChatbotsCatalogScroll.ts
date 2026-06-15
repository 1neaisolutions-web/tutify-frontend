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

  useLayoutEffect(() => {
    if (!ready || !isChatbotCatalogRoute(pathname)) return
    if (navigationType === 'POP' || restoreScroll) return
    clearChatbotsCatalogScrollState()
    scrollToTop()
  }, [pathname, navigationType, restoreScroll, ready, scrollToTop])

  useEffect(() => {
    if (!ready || !isChatbotCatalogRoute(pathname)) return

    const shouldRestore = navigationType === 'POP' || restoreScroll
    if (!shouldRestore) return

    const saved = peekChatbotsCatalogScrollState()
    if (!saved || saved.pathname !== pathname) return

    return restoreScrollWhenReady(() => getScrollContainer(), saved.scrollTop)
  }, [pathname, navigationType, restoreScroll, ready, getScrollContainer])
}
