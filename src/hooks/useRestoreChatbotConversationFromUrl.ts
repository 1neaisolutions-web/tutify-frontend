import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * History → Open: `/chatbots/{slug}?conversation=<id>` restores the chat session.
 * Persists the id to localStorage (same key as "current conversation"), invokes restore, then strips the query param.
 */
export function useRestoreChatbotConversationFromUrl(
  storageKey: string,
  onRestore: (conversationId: string) => void | Promise<void>,
): void {
  const [searchParams, setSearchParams] = useSearchParams()
  const conversationId = searchParams.get('conversation')
  const onRestoreRef = useRef(onRestore)
  onRestoreRef.current = onRestore

  useEffect(() => {
    if (!conversationId) {
      return
    }
    try {
      localStorage.setItem(storageKey, conversationId)
    } catch {
      // ignore
    }
    void Promise.resolve(onRestoreRef.current(conversationId))
    setSearchParams((prev) => {
      const n = new URLSearchParams(prev)
      n.delete('conversation')
      return n
    }, { replace: true })
  }, [conversationId, storageKey, setSearchParams])
}
