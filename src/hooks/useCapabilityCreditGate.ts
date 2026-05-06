import { useState, useCallback } from 'react'
import { parseCreditError, type ParsedCreditError } from '../utils/creditErrors'
import { useRefreshCreditBalance } from './useRefreshCreditBalance'

/**
 * Shared credit-error state for specialist capability pages (executeCapability).
 */
export function useCapabilityCreditGate() {
  const [creditError, setCreditError] = useState<ParsedCreditError | null>(null)
  const refreshBalance = useRefreshCreditBalance()

  const clearCreditError = useCallback(() => setCreditError(null), [])

  /** Returns true if `err` was a 402 credit error (captured). */
  const captureApiError = useCallback((err: unknown): boolean => {
    const p = parseCreditError(err)
    if (p) {
      setCreditError(p)
      return true
    }
    return false
  }, [])

  /**
   * Wraps a credit-charging API call: on success, refreshes Redux credit balance; on 402, captures and returns null.
   */
  const runWithCredits = useCallback(
    async <T,>(promise: Promise<T>): Promise<T | null> => {
      try {
        const r = await promise
        await refreshBalance()
        return r
      } catch (e: unknown) {
        if (captureApiError(e)) return null
        throw e
      }
    },
    [refreshBalance, captureApiError],
  )

  return { creditError, clearCreditError, captureApiError, refreshBalance, runWithCredits }
}
