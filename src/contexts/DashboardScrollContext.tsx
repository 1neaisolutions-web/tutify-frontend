import {

  createContext,

  useCallback,

  useContext,

  useMemo,

  useRef,

  type ReactNode,

  type RefObject,

} from 'react'

import { useLocation } from 'react-router-dom'

import { registerDashboardScrollContainer } from './dashboardScrollRegistry'

import { useDashboardRouteScroll } from './useDashboardRouteScroll'

import { isLearningHubCatalogRoute } from '../features/learningHub/learningHubScrollState'



type DashboardScrollContextValue = {

  scrollContainerRef: RefObject<HTMLDivElement | null>

  getScrollContainer: () => HTMLDivElement | null

  getScrollTop: () => number

  scrollToTop: () => void

  scrollTo: (top: number) => void

}



const DashboardScrollContext = createContext<DashboardScrollContextValue | null>(null)



const CHAT_PAGE_PATH = '/chatbots/general-teaching-assistant'



function isManagedScrollRoute(pathname: string) {

  if (pathname === CHAT_PAGE_PATH) return false

  if (isLearningHubCatalogRoute(pathname)) return false

  return true

}



export function DashboardScrollProvider({

  children,

  isChatPage: _isChatPage,

}: {

  children: ReactNode

  isChatPage: boolean

}) {

  const scrollContainerRef = useRef<HTMLDivElement | null>(null)



  const getScrollContainer = useCallback(() => scrollContainerRef.current, [])



  const getScrollTop = useCallback(() => scrollContainerRef.current?.scrollTop ?? 0, [])



  const scrollTo = useCallback((top: number) => {

    const container = scrollContainerRef.current

    if (!container) return

    container.scrollTop = top

  }, [])



  const scrollToTop = useCallback(() => {

    scrollTo(0)

  }, [scrollTo])



  const value = useMemo(

    () => ({

      scrollContainerRef,

      getScrollContainer,

      getScrollTop,

      scrollToTop,

      scrollTo,

    }),

    [getScrollContainer, getScrollTop, scrollTo, scrollToTop],

  )



  return <DashboardScrollContext.Provider value={value}>{children}</DashboardScrollContext.Provider>

}



const fallbackScrollContext: DashboardScrollContextValue = {

  scrollContainerRef: { current: null },

  getScrollContainer: () => null,

  getScrollTop: () => (typeof window !== 'undefined' ? window.scrollY : 0),

  scrollToTop: () => {

    if (typeof window === 'undefined') return

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })

  },

  scrollTo: (top: number) => {

    if (typeof window === 'undefined') return

    window.scrollTo({ top, left: 0, behavior: 'auto' })

  },

}



export function useDashboardScroll() {

  const context = useContext(DashboardScrollContext)

  return context ?? fallbackScrollContext

}



export function DashboardScrollContainer({

  children,

  className,

}: {

  children: ReactNode

  className?: string

}) {

  const { scrollContainerRef } = useDashboardScroll()

  const location = useLocation()

  const managed = isManagedScrollRoute(location.pathname)



  useDashboardRouteScroll({

    scrollContainerRef,

    enabled: managed,

  })



  const setContainerRef = useCallback(

    (node: HTMLDivElement | null) => {

      scrollContainerRef.current = node



      if (!isManagedScrollRoute(location.pathname)) {

        if (!node) {

          registerDashboardScrollContainer(null, location.key, location.pathname)

        }

        return

      }



      registerDashboardScrollContainer(node, location.key, location.pathname)

    },

    [location.key, location.pathname, scrollContainerRef],

  )



  return (

    <div ref={setContainerRef} className={className}>

      {children}

    </div>

  )

}


