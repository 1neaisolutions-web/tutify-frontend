import { useCallback, useEffect, useState } from 'react'

export type DemoAsyncState = 'idle' | 'loading' | 'success' | 'error'

export function useDemoAsync<T>(
  loader: () => Promise<T>,
  options?: { delayMs?: number; simulateError?: boolean }
) {
  const [state, setState] = useState<DemoAsyncState>('loading')
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)

  const delayMs = options?.delayMs ?? 600
  const simulateError = options?.simulateError ?? false

  const run = useCallback(async () => {
    setState('loading')
    setError(null)
    try {
      await new Promise((r) => setTimeout(r, delayMs))
      if (simulateError) throw new Error('Demo: simulated failure')
      const result = await loader()
      setData(result)
      setState('success')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setState('error')
    }
  }, [loader, delayMs, simulateError])

  useEffect(() => {
    run()
  }, [run])

  return { state, data, error, retry: run }
}
