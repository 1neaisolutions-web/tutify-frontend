const CATALOG_SCROLL_KEY = 'chatbots:catalogScroll'

export type ChatbotsCatalogScrollState = {
  pathname: string
  scrollTop: number
}

export function isChatbotCatalogRoute(pathname: string): boolean {
  return pathname === '/chatbots'
}

export function saveChatbotsCatalogScrollState(state: ChatbotsCatalogScrollState) {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(CATALOG_SCROLL_KEY, JSON.stringify(state))
  } catch {
    // ignore quota / privacy errors
  }
}

export function peekChatbotsCatalogScrollState(): ChatbotsCatalogScrollState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(CATALOG_SCROLL_KEY)
    return raw ? (JSON.parse(raw) as ChatbotsCatalogScrollState) : null
  } catch {
    return null
  }
}

export function clearChatbotsCatalogScrollState() {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem(CATALOG_SCROLL_KEY)
  } catch {
    // ignore
  }
}
