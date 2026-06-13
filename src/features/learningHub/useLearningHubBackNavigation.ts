import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { peekCatalogScrollState } from './learningHubScrollState'

type LocationState = {
  restoreScroll?: boolean
}

/**
 * Navigate back to the catalog page the user opened content from, restoring scroll position.
 */
export function useLearningHubBackNavigation() {
  const navigate = useNavigate()
  const location = useLocation()

  return useCallback(
    (fallbackPath = '/learning-hub') => {
      const saved = peekCatalogScrollState()
      const path = saved?.pathname ?? fallbackPath
      const currentState = location.state as LocationState | null
      if (
        location.pathname === path &&
        currentState?.restoreScroll === true
      ) {
        return
      }
      navigate(path, { state: { restoreScroll: true } })
    },
    [location.pathname, location.state, navigate],
  )
}

export function navigateBackToLearningHubCatalog(
  navigate: ReturnType<typeof useNavigate>,
  fallbackPath = '/learning-hub',
  currentPathname?: string,
) {
  const saved = peekCatalogScrollState()
  const path = saved?.pathname ?? fallbackPath
  if (currentPathname && currentPathname === path) {
    return
  }
  navigate(path, { state: { restoreScroll: true } })
}
