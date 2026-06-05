import { useCallback, useEffect, useRef } from 'react'

/**
 * Tracks whether the current form snapshot differs from the baseline captured once `isReady` is true.
 * Re-capture baseline after a successful discard reset via `resetBaseline()`.
 */
export function useTeacherToolsDirtyBaseline(snapshot: string, isReady: boolean) {
  const baselineRef = useRef<string | null>(null)

  useEffect(() => {
    if (!isReady) return
    if (baselineRef.current === null) {
      baselineRef.current = snapshot
    }
  }, [isReady, snapshot])

  const resetBaseline = useCallback(() => {
    baselineRef.current = snapshot
  }, [snapshot])

  const clearBaseline = useCallback(() => {
    baselineRef.current = null
  }, [])

  const isDirty =
    isReady && baselineRef.current !== null && snapshot !== baselineRef.current

  return { isDirty, resetBaseline, clearBaseline }
}
