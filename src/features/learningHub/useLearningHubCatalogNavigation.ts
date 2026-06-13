import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDashboardScroll } from '../../contexts/DashboardScrollContext'
import { saveCatalogScrollState } from './learningHubScrollState'

export function useLearningHubCatalogNavigation() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { getScrollTop } = useDashboardScroll()

  const saveScroll = useCallback(
    (contentId?: string, assignmentId?: string) => {
      saveCatalogScrollState({
        pathname,
        scrollTop: getScrollTop(),
        contentId,
        assignmentId,
      })
    },
    [pathname, getScrollTop],
  )

  const navigateToDetail = useCallback(
    (target: string, state?: object, meta?: { contentId?: string; assignmentId?: string }) => {
      saveScroll(meta?.contentId, meta?.assignmentId)
      navigate(target, { state })
    },
    [navigate, saveScroll],
  )

  const navigateToSection = useCallback(
    (target: string) => {
      saveScroll()
      navigate(target)
    },
    [navigate, saveScroll],
  )

  return { navigateToDetail, navigateToSection, saveScroll }
}
