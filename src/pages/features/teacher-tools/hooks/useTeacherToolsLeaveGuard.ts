import {
  UNSAFE_NavigationContext as NavigationContext,
  useBeforeUnload,
} from 'react-router-dom'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'

type PendingLeave = () => void

type HistoryNavigator = {
  push: (...args: unknown[]) => void
  replace: (...args: unknown[]) => void
  go: (delta: number) => void
}

/**
 * Prompts before leaving when `when` is true (in-app navigation + tab close).
 * Runs `onDiscard` before the pending navigation continues.
 *
 * Does not call `history.listen` — BrowserRouter already owns the single listener.
 */
export function useTeacherToolsLeaveGuard(when: boolean, onDiscard: () => void) {
  const [discardOpen, setDiscardOpen] = useState(false)
  const pendingLeaveRef = useRef<PendingLeave | null>(null)
  const whenRef = useRef(when)
  const onDiscardRef = useRef(onDiscard)
  const skipPopGuardRef = useRef(false)

  whenRef.current = when
  onDiscardRef.current = onDiscard

  const { navigator } = useContext(NavigationContext)

  useBeforeUnload(
    useCallback((event) => {
      if (!whenRef.current) return
      event.preventDefault()
      event.returnValue = ''
    }, []),
  )

  const queueLeave = useCallback((leave: PendingLeave) => {
    pendingLeaveRef.current = leave
    setDiscardOpen(true)
  }, [])

  useEffect(() => {
    const nav = navigator as HistoryNavigator
    const originalPush = nav.push.bind(nav)
    const originalReplace = nav.replace.bind(nav)

    const intercept =
      (original: (...args: unknown[]) => void) =>
      (...args: unknown[]) => {
        if (!whenRef.current) {
          original(...args)
          return
        }
        queueLeave(() => original(...args))
      }

    nav.push = intercept(originalPush) as typeof nav.push
    nav.replace = intercept(originalReplace) as typeof nav.replace

    return () => {
      nav.push = originalPush
      nav.replace = originalReplace
    }
  }, [navigator, queueLeave])

  /** Browser back/forward — use window popstate (not history.listen). */
  useEffect(() => {
    if (!when) return

    const onPopState = () => {
      if (skipPopGuardRef.current) {
        skipPopGuardRef.current = false
        return
      }
      if (!whenRef.current) return

      queueLeave(() => {
        skipPopGuardRef.current = true
        window.history.go(-1)
      })
      skipPopGuardRef.current = true
      window.history.go(1)
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [when, queueLeave])

  const requestLeave = useCallback((leave: PendingLeave) => {
    if (!whenRef.current) {
      leave()
      return
    }
    pendingLeaveRef.current = leave
    setDiscardOpen(true)
  }, [])

  const confirmDiscard = useCallback(() => {
    whenRef.current = false
    onDiscardRef.current()
    setDiscardOpen(false)
    const leave = pendingLeaveRef.current
    pendingLeaveRef.current = null
    leave?.()
  }, [])

  const cancelDiscard = useCallback(() => {
    setDiscardOpen(false)
    pendingLeaveRef.current = null
  }, [])

  return {
    discardOpen,
    setDiscardOpen,
    requestLeave,
    confirmDiscard,
    cancelDiscard,
  }
}
