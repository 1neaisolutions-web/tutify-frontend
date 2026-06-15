const SCROLL_BY_KEY = 'dashboard:scrollByHistoryKey'
const SCROLL_BY_PATH = 'dashboard:scrollByPathname'

type ScrollMap = Record<string, number>

function readMap(key: string): ScrollMap {
  if (typeof window === 'undefined') return {}
  try {
    const raw = sessionStorage.getItem(key)
    return raw ? (JSON.parse(raw) as ScrollMap) : {}
  } catch {
    return {}
  }
}

function writeMap(key: string, map: ScrollMap) {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(key, JSON.stringify(map))
  } catch {
    // ignore quota / privacy errors
  }
}

export function saveRouteScroll(historyKey: string, pathname: string, scrollTop: number) {
  if (historyKey) {
    const byKey = readMap(SCROLL_BY_KEY)
    byKey[historyKey] = scrollTop
    writeMap(SCROLL_BY_KEY, byKey)
  }
  if (pathname) {
    const byPath = readMap(SCROLL_BY_PATH)
    byPath[pathname] = scrollTop
    writeMap(SCROLL_BY_PATH, byPath)
  }
}

export function getSavedRouteScroll(historyKey: string, pathname: string): number | null {
  if (historyKey) {
    const byKey = readMap(SCROLL_BY_KEY)
    if (historyKey in byKey) return byKey[historyKey]!
  }
  if (pathname) {
    const byPath = readMap(SCROLL_BY_PATH)
    if (pathname in byPath) return byPath[pathname]!
  }
  return null
}

export function clearRouteScrollForPathname(pathname: string) {
  if (!pathname) return
  const byPath = readMap(SCROLL_BY_PATH)
  if (!(pathname in byPath)) return
  delete byPath[pathname]
  writeMap(SCROLL_BY_PATH, byPath)
}

function clampScrollTop(container: HTMLElement, scrollTop: number) {
  const maxScroll = Math.max(0, container.scrollHeight - container.clientHeight)
  container.scrollTop = Math.min(scrollTop, maxScroll)
}

function isScrollRestored(container: HTMLElement, targetScrollTop: number) {
  const maxScroll = Math.max(0, container.scrollHeight - container.clientHeight)
  const expected = Math.min(targetScrollTop, maxScroll)
  return Math.abs(container.scrollTop - expected) < 2
}

/**
 * Re-applies scroll until content height catches up (async data, images, fonts).
 * Returns a cleanup function.
 */
export function restoreScrollWhenReady(
  getContainer: () => HTMLElement | null,
  scrollTop: number,
  maxDurationMs = 6000,
): () => void {
  let cancelled = false
  const started = performance.now()
  let rafId = 0

  const apply = () => {
    if (cancelled) return
    const container = getContainer()
    if (!container) return
    clampScrollTop(container, scrollTop)
  }

  const tick = () => {
    if (cancelled) return
    apply()
    const container = getContainer()
    if (
      container &&
      (isScrollRestored(container, scrollTop) || performance.now() - started > maxDurationMs)
    ) {
      return
    }
    rafId = window.requestAnimationFrame(tick)
  }

  apply()
  rafId = window.requestAnimationFrame(tick)

  const container = getContainer()
  const observers: Array<ResizeObserver | MutationObserver> = []

  if (container) {
    const ro = new ResizeObserver(() => apply())
    ro.observe(container)
    observers.push(ro)

    const mo = new MutationObserver(() => apply())
    mo.observe(container, { childList: true, subtree: true, attributes: true })
    observers.push(mo)
  }

  return () => {
    cancelled = true
    window.cancelAnimationFrame(rafId)
    observers.forEach((observer) => observer.disconnect())
  }
}

export function applyScrollWithRetries(setScrollTop: (top: number) => void, scrollTop: number) {
  setScrollTop(scrollTop)
  let attempts = 0
  const retry = () => {
    setScrollTop(scrollTop)
    if (++attempts < 10) {
      window.requestAnimationFrame(retry)
    }
  }
  window.requestAnimationFrame(retry)
}
