const CATALOG_SCROLL_KEY = 'learningHub:catalogScroll'

export type CatalogScrollState = {
  pathname: string
  scrollTop: number
  contentId?: string
  assignmentId?: string
}

export function isLearningHubCatalogRoute(pathname: string): boolean {
  return pathname === '/learning-hub' || pathname.startsWith('/learning-hub/sections/')
}

export function saveCatalogScrollState(state: CatalogScrollState) {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(CATALOG_SCROLL_KEY, JSON.stringify(state))
  } catch {
    // ignore quota / privacy errors
  }
}

export function peekCatalogScrollState(): CatalogScrollState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(CATALOG_SCROLL_KEY)
    return raw ? (JSON.parse(raw) as CatalogScrollState) : null
  } catch {
    return null
  }
}

export function consumeCatalogScrollState(pathname: string): CatalogScrollState | null {
  const saved = peekCatalogScrollState()
  if (!saved || saved.pathname !== pathname) return null
  clearCatalogScrollState()
  return saved
}

export function clearCatalogScrollState() {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem(CATALOG_SCROLL_KEY)
  } catch {
    // ignore
  }
}

export function persistHubRouteState(target: string, contentId?: string, contentType?: string) {
  if (!contentId || typeof window === 'undefined') return
  try {
    sessionStorage.setItem(
      `learningHubRouteState:${target}`,
      JSON.stringify({ contentId, contentType }),
    )
  } catch {
    // ignore
  }
}
