import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AlignmentResponse,
  FrameworkResponse,
  PagedResponse,
  StandardItemResponse,
  TemplateListParams,
  TemplateResponse,
} from '../api/types'
import {
  alignTemplatesByCode,
  alignTemplatesByGoal,
  fetchFrameworks,
  fetchStandardItems,
  fetchTemplates,
} from '../api/templates'
import { ApiError } from '../api/client'

interface HookState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

const useFetch = <T,>(fetcher: (signal: AbortSignal) => Promise<T>, deps: unknown[]): HookState<T> => {
  const [state, setState] = useState<HookState<T>>({ data: null, loading: true, error: null })

  useEffect(() => {
    console.log('[useFetch] 🔵 useEffect triggered, calling fetcher')
    const controller = new AbortController()
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    let isCompleted = false
    
    // CRITICAL: Force loading to false after 5 seconds maximum
    const MAX_WAIT_TIME = 5000
    timeoutId = setTimeout(() => {
      if (!isCompleted) {
        console.warn('[useFetch] ⏰ Request timeout - returning empty data')
        isCompleted = true
        controller.abort()
        setState((prev) => {
          // Return empty data structure so UI shows "No templates" instead of error
          if (prev.loading) {
            // Check if it's a PagedResponse type
            const emptyData = prev.data === null ? 
              ({ total: 0, page: 1, pageSize: 0, items: [] } as any) : 
              prev.data
            return { 
              data: emptyData, 
              loading: false, 
              error: null // No error - just show empty state
            }
          }
          return prev
        })
      }
    }, MAX_WAIT_TIME)

    console.log('[useFetch] 🟢 Setting loading to true and calling fetcher')
    setState((prev) => ({ ...prev, loading: true, error: null }))

    console.log('[useFetch] 🚀 Calling fetcher function')
    fetcher(controller.signal)
      .then((result) => {
        console.log('[useFetch] ✅ Fetcher resolved with result:', result)
        if (!isCompleted && !controller.signal.aborted) {
          isCompleted = true
          if (timeoutId) clearTimeout(timeoutId)
          console.log('[useFetch] 🟢 Setting state with result')
          setState({ data: result, loading: false, error: null })
        } else {
          console.log('[useFetch] ⚠️ Result received but already completed or aborted')
        }
      })
      .catch((error: unknown) => {
        if (isCompleted || controller.signal.aborted) return
        isCompleted = true
        if (timeoutId) clearTimeout(timeoutId)
        
        let message = 'Unable to load data'
        
        if (error instanceof ApiError) {
          message = error.message
        } else if (error instanceof Error) {
          // Network errors, CORS errors, etc.
          if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            message = 'Unable to connect to server. Please check if the backend is running.'
          } else if (error.message.includes('CORS')) {
            message = 'CORS error: Backend may not be configured to allow requests from this origin.'
          } else if (error.message.includes('timeout') || error.message.includes('AbortError')) {
            // On timeout, return empty data instead of error
            const emptyData = { total: 0, page: 1, pageSize: 0, items: [] } as any
            setState({ data: emptyData, loading: false, error: null })
            return
          } else {
            message = error.message || 'Unable to load data'
          }
        } else if (typeof error === 'string') {
          message = error
        }
        
        console.error('Error loading data:', error)
        // Return empty data structure on error so UI shows "No templates" instead of error
        const emptyData = { total: 0, page: 1, pageSize: 0, items: [] } as any
        setState({ data: emptyData, loading: false, error: null })
      })

    return () => {
      isCompleted = true
      if (timeoutId) clearTimeout(timeoutId)
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}

export const useFrameworks = () => {
  return useFetch<FrameworkResponse[]>(
    (signal) => fetchFrameworks(signal),
    [],
  )
}

export const useTemplatesSearch = (params: TemplateListParams) => {
  const serialized = useMemo(() => JSON.stringify(params ?? {}), [params])

  console.log('[useTemplatesSearch] Called with params:', params)
  console.log('[useTemplatesSearch] Serialized:', serialized)

  return useFetch<PagedResponse<TemplateResponse>>(
    (signal) => {
      console.log('[useTemplatesSearch] 🔵 Starting fetch with signal:', signal)
      const parsedParams = JSON.parse(serialized) as TemplateListParams
      console.log('[useTemplatesSearch] Parsed params:', parsedParams)
      return fetchTemplates(parsedParams, signal)
    },
    [serialized],
  )
}

export const useStandardItems = (frameworkCode?: string | null, subject?: string, grade?: string) => {
  const serialized = useMemo(
    () => ({ frameworkCode, subject: subject || undefined, grade: grade || undefined }),
    [frameworkCode, subject, grade],
  )

  return useFetch<StandardItemResponse[] | null>(
    (signal) => {
      if (!serialized.frameworkCode) {
        return Promise.resolve<StandardItemResponse[]>([])
      }
      return fetchStandardItems(serialized.frameworkCode, { subject: serialized.subject, grade: serialized.grade }, signal)
    },
    [serialized.frameworkCode, serialized.subject, serialized.grade],
  )
}

export const useTemplateAlignment = () => {
  const [state, setState] = useState<HookState<AlignmentResponse>>({ data: null, loading: false, error: null })

  const run = useCallback(async (action: 'goal' | 'code', value: string) => {
    if (!value) return
    setState({ data: null, loading: true, error: null })
    try {
      const result = action === 'goal' ? await alignTemplatesByGoal(value) : await alignTemplatesByCode(value)
      setState({ data: result, loading: false, error: null })
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Unable to complete alignment'
      setState({ data: null, loading: false, error: message })
    }
  }, [])

  return {
    ...state,
    alignGoal: (goal: string) => run('goal', goal),
    alignCode: (code: string) => run('code', code),
  }
}
