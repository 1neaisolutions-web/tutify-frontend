import { useCallback, useRef, useState } from 'react'

import * as chatbotApi from '../api/chatbots'
import { useRestoreChatbotConversationFromUrl } from './useRestoreChatbotConversationFromUrl'

export type ChatbotHistoryRestoreContext = {
  conversationId: string
  tabKey: string
  userContent: string
  assistantContent: string
  assistantMetadata: Record<string, unknown> | null
}

/**
 * Per-tab conversation ids for specialized chatbots:
 * - Open from History (?conversation=) pins the id for the tab inferred from message metadata.
 * - After at least one History open in this mount, successful API responses pin the active tab
 *   so a second generation on that tab overwrites the same History row.
 * - Pure blank-page sessions never pin, so repeated runs still create separate History entries (Q1).
 */
export function useChatbotHistorySession(opts: {
  slug: string
  activeTab: string
  /** Map assistant message metadata.capability_key → UI tab id */
  capabilityKeyToTab?: Record<string, string>
  /** Optional override (e.g. history-log uses metadata.tab) */
  detectTabFromMetadata?: (metadata: Record<string, unknown> | null | undefined) => string | null
  onRestore: (ctx: ChatbotHistoryRestoreContext) => void | Promise<void>
}): {
  conversationIdForActiveTab: string | null
  pinFromResponse: (conversationId?: string | null) => void
  clearActiveTab: () => void
} {
  const { slug, activeTab, capabilityKeyToTab, detectTabFromMetadata, onRestore } = opts
  const openedFromHistoryRef = useRef(false)
  const [tabConversationIds, setTabConversationIds] = useState<Record<string, string>>({})

  const storageKey = `${slug}:current-conversation`

  const resolveTabKey = useCallback(
    (meta: Record<string, unknown> | null | undefined): string => {
      const fromFn = detectTabFromMetadata?.(meta)
      if (fromFn) return fromFn
      const cap = meta && typeof meta.capability_key === 'string' ? meta.capability_key : null
      if (cap && capabilityKeyToTab?.[cap]) return capabilityKeyToTab[cap]
      return activeTab
    },
    [activeTab, capabilityKeyToTab, detectTabFromMetadata],
  )

  useRestoreChatbotConversationFromUrl(storageKey, async (convId) => {
    openedFromHistoryRef.current = true
    try {
      const detail = await chatbotApi.getConversation(convId)
      if (detail.chatbot_slug && detail.chatbot_slug !== slug) {
        return
      }

      const msgs = detail.messages || []
      const assistantMsg = [...msgs].reverse().find((m) => m.role === 'assistant')
      const userMsg = [...msgs].reverse().find((m) => m.role === 'user')
      if (!assistantMsg?.content) {
        return
      }

      const meta = (assistantMsg.metadata as Record<string, unknown> | null) ?? null
      const tabKey = resolveTabKey(meta)

      setTabConversationIds((prev) => ({ ...prev, [tabKey]: convId }))

      await Promise.resolve(
        onRestore({
          conversationId: convId,
          tabKey,
          userContent: userMsg?.content ?? '',
          assistantContent: assistantMsg.content,
          assistantMetadata: meta,
        }),
      )
    } catch {
      // Pages may toast elsewhere; keep restore silent
    }
  })

  const conversationIdForActiveTab = tabConversationIds[activeTab] ?? null

  const pinFromResponse = useCallback(
    (conversationId?: string | null) => {
      if (!conversationId) return
      if (!openedFromHistoryRef.current) return
      setTabConversationIds((prev) => ({ ...prev, [activeTab]: conversationId }))
    },
    [activeTab],
  )

  const clearActiveTab = useCallback(() => {
    setTabConversationIds((prev) => {
      const next = { ...prev }
      delete next[activeTab]
      return next
    })
  }, [activeTab])

  return { conversationIdForActiveTab, pinFromResponse, clearActiveTab }
}
