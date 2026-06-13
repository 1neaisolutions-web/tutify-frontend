import { useEffect, useLayoutEffect } from 'react'

import { useLocation, useNavigationType } from 'react-router-dom'

import { useDashboardScroll } from '../../contexts/DashboardScrollContext'

import { restoreScrollWhenReady } from '../../contexts/dashboardScrollState'

import {

  clearCatalogScrollState,

  isLearningHubCatalogRoute,

  peekCatalogScrollState,

} from './learningHubScrollState'



type LocationState = {

  restoreScroll?: boolean

}



/**

 * Restores catalog scroll when returning from a detail page, or resets to top on fresh visits.

 */

export function useRestoreCatalogScroll(ready = true) {

  const { pathname, state } = useLocation()

  const navigationType = useNavigationType()

  const { getScrollContainer, scrollToTop } = useDashboardScroll()

  const restoreScroll = (state as LocationState | null)?.restoreScroll === true



  useLayoutEffect(() => {

    if (!ready || !isLearningHubCatalogRoute(pathname)) return

    if (navigationType === 'POP' || restoreScroll) return

    clearCatalogScrollState()

    scrollToTop()

  }, [pathname, navigationType, restoreScroll, ready, scrollToTop])



  useEffect(() => {

    if (!ready || !isLearningHubCatalogRoute(pathname)) return



    const shouldRestore = navigationType === 'POP' || restoreScroll

    if (!shouldRestore) return



    const saved = peekCatalogScrollState()

    if (!saved || saved.pathname !== pathname) return



    return restoreScrollWhenReady(() => getScrollContainer(), saved.scrollTop)

  }, [pathname, navigationType, restoreScroll, ready, getScrollContainer])

}


