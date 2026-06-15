import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { peekChatbotsCatalogScrollState } from './chatbotsScrollState'

type LocationState = {
  restoreScroll?: boolean
}

/**
 * Navigate back to the chatbots catalog, restoring scroll position.
 */
export function useChatbotsBackNavigation() {
  const navigate = useNavigate()
  const location = useLocation()

  return useCallback(
    (fallbackPath = '/chatbots') => {
      const saved = peekChatbotsCatalogScrollState()
      const path = saved?.pathname ?? fallbackPath
      const currentState = location.state as LocationState | null
      if (location.pathname === path && currentState?.restoreScroll === true) {
        return
      }
      navigate(path, { state: { restoreScroll: true } })
    },
    [location.pathname, location.state, navigate],
  )
}
