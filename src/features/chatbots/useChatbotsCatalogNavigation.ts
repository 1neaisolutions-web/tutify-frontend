import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDashboardScroll } from '../../contexts/DashboardScrollContext'
import { clearRouteScrollForPathname } from '../../contexts/dashboardScrollState'
import { saveChatbotsCatalogScrollState } from './chatbotsScrollState'

export function useChatbotsCatalogNavigation() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { getScrollTop } = useDashboardScroll()

  const saveScroll = useCallback(() => {
    saveChatbotsCatalogScrollState({
      pathname,
      scrollTop: getScrollTop(),
    })
  }, [pathname, getScrollTop])

  const navigateToDetail = useCallback(
    (target: string, state?: object) => {
      saveScroll()
      clearRouteScrollForPathname(target)
      navigate(target, { state })
    },
    [navigate, saveScroll],
  )

  return { navigateToDetail, saveScroll }
}
