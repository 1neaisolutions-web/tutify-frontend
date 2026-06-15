import { useEffect, useLayoutEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import { useDashboardScroll } from '../../contexts/DashboardScrollContext'
import { restoreScrollWhenReady } from '../../contexts/dashboardScrollState'
import { isChatbotCatalogRoute } from './chatbotsScrollState'

const GENERAL_TEACHING_ASSISTANT_PATH = '/chatbots/general-teaching-assistant'

function isChatbotDetailRoute(pathname: string): boolean {
  return (
    pathname.startsWith('/chatbots/') &&
    !isChatbotCatalogRoute(pathname) &&
    pathname !== GENERAL_TEACHING_ASSISTANT_PATH
  )
}

/**
 * Resets scroll on chatbot detail route transitions (catalog → bot page).
 * Skips POP so browser-back catalog scroll restoration is unchanged.
 */
export function useChatbotRouteScrollToTop(ready = true) {
  const { pathname } = useLocation()
  const navigationType = useNavigationType()
  const { getScrollContainer, scrollToTop } = useDashboardScroll()

  const shouldReset =
    ready && isChatbotDetailRoute(pathname) && navigationType !== 'POP'

  useLayoutEffect(() => {
    if (!shouldReset) return
    scrollToTop()
  }, [shouldReset, scrollToTop])

  useEffect(() => {
    if (!shouldReset) return
    return restoreScrollWhenReady(() => getScrollContainer(), 0)
  }, [shouldReset, pathname, getScrollContainer])
}
