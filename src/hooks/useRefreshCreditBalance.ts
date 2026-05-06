import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { getCreditBalance } from '../api/subscriptions'
import { setBalance } from '../redux/features/subscription/subscriptionSlice'

/**
 * Fetches the latest credit balance and updates Redux so the header / subscription UI stay in sync
 * after a successful paid action (server-side debit).
 */
export function useRefreshCreditBalance() {
  const dispatch = useDispatch()
  return useCallback(async () => {
    try {
      const bal = await getCreditBalance()
      dispatch(setBalance(bal))
    } catch {
      // best-effort: do not break the main flow
    }
  }, [dispatch])
}
