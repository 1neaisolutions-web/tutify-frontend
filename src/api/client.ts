import { TemplateListParams } from './types'
import { API_URL } from '../config/api'
import { showSnackbar } from '../redux/features/snackbarSlice/snackbarSlice'

// Use centralized API configuration — API_URL includes `/api` (e.g., http://127.0.0.1:8000/api)
// For building API URLs, we use API_URL which already includes /api
const API_BASE_URL = API_URL.replace(/\/$/, '')

export class ApiError extends Error {
  status: number
  payload: unknown

  constructor(status: number, message: string, payload: unknown) {
    super(message)
    this.status = status
    this.payload = payload
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  query?: Record<string, string | number | boolean | undefined | Array<string | number | boolean>>
  body?: unknown
  timeout?: number // Timeout in milliseconds (default: 30000 = 30 seconds)
}

const toQueryString = (query?: Record<string, string | number | boolean | undefined | Array<string | number | boolean>>) => {
  const params = new URLSearchParams()
  if (!query) return params
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === '' || value === null) return
    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v === undefined || v === '' || v === null) return
        params.append(key, String(v))
      })
      return
    }
    params.append(key, String(value))
  })
  return params
}

const SOURCE_TYPE_LABELS: Record<string, string> = {
  quiz: 'Quiz',
  assignment: 'Assignment',
  worksheet: 'Worksheet',
  exam: 'Exam',
  chatbot_conversation: 'Chatbot conversation',
  pixgen_generation: 'PixGen image',
  youtube_quiz: 'YouTube quiz',
  template_execution: 'Template',
}

// Store reference for accessing auth token from Redux (same as http.js)
let storeRef: any = null

// Function to set store reference (called from store.js after store creation)
export const setStoreReference = (store: any) => {
  storeRef = store
}

// Helper to check if token is expired (JWT tokens contain exp claim)
function isTokenExpired(token: string): boolean {
  try {
    // JWT tokens are base64url encoded with 3 parts: header.payload.signature
    const parts = token.split('.')
    if (parts.length !== 3) {
      return true // Invalid token format
    }
    
    // Decode payload (second part)
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
    
    // Check if token has expiration claim
    if (!payload.exp) {
      return false // No expiration claim - assume valid (shouldn't happen in our system)
    }
    
    // Check if token is expired (exp is in seconds since epoch)
    const expirationTime = payload.exp * 1000 // Convert to milliseconds
    const currentTime = Date.now()
    
    // Add 60 second buffer to refresh before actual expiration
    const bufferTime = 60 * 1000 // 60 seconds
    
    return currentTime >= (expirationTime - bufferTime)
  } catch (error) {
    console.warn('[isTokenExpired] Failed to check token expiration:', error)
    return true // Assume expired if we can't decode
  }
}

// Helper to try refreshing the token
async function tryRefreshToken(): Promise<boolean> {
  try {
    const persistedState = localStorage.getItem('persist:root')
    if (!persistedState) return false
    
    const parsed = JSON.parse(persistedState)
    const authState = parsed?.auth ? JSON.parse(parsed.auth) : null
    const refreshToken = authState?.user?.refresh_token
    
    if (!refreshToken) {
      console.warn('[apiRequest] No refresh token available')
      return false
    }
    
    // API endpoints are mounted at `/api/v1/*` (API_BASE_URL already includes `/api`)
    const refreshUrl = buildUrl('/v1/auth/refresh')
    const refreshResponse = await fetch(refreshUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
    
    if (!refreshResponse.ok) {
      console.warn('[apiRequest] Token refresh failed')
      return false
    }
    
    const refreshData = await refreshResponse.json()
    
    const nextAccessToken = refreshData?.access_token || refreshData?.token || refreshData?.accessToken
    if (nextAccessToken) {
      // Keep legacy/local guard token in sync (PrivateRoutes reads this key).
      try {
        localStorage.setItem('access_token', nextAccessToken)
      } catch (e) {
        console.warn('[apiRequest] Could not persist access_token:', e)
      }

      // Update token in localStorage
      authState.user.token = nextAccessToken
      const nextRefreshToken = refreshData?.refresh_token || refreshData?.refreshToken
      if (nextRefreshToken) {
        authState.user.refresh_token = nextRefreshToken
      }
      parsed.auth = JSON.stringify(authState)
      localStorage.setItem('persist:root', JSON.stringify(parsed))
      // IMPORTANT: Do not mutate Redux state directly (it is read-only in dev).
      // The Redux slice + redux-persist will reconcile from storage on the next rehydrate,
      // and fetch requests use `getAuthToken()` which now also reads `access_token`.
      
      console.log('[apiRequest] ✅ Token refreshed successfully')
      return true
    }
    
    return false
  } catch (error) {
    console.error('[apiRequest] Error refreshing token:', error)
    return false
  }
}

// Helper to get auth token from Redux store (same way as Redux axios does)
export const getAuthToken = (): string | null => {
  // Read both possible sources:
  // - Redux (preferred when up-to-date)
  // - localStorage.access_token (used by route guard + updated during refresh)
  let reduxToken: string | null = null
  let localToken: string | null = null

  if (storeRef) {
    try {
      const state = storeRef.getState()
      reduxToken = state?.auth?.user?.token ?? null
    } catch (error) {
      console.warn('[getAuthToken] Could not get token from Redux store:', error)
    }
  }

  try {
    localToken = localStorage.getItem('access_token')
  } catch (error) {
    console.warn('[getAuthToken] Could not read access_token from localStorage:', error)
  }

  // If localStorage has a token and Redux is missing/stale, prefer localStorage.
  // This matters after refresh: we update localStorage but Redux state may lag.
  if (localToken) {
    if (!reduxToken) return localToken
    if (reduxToken !== localToken && isTokenExpired(reduxToken)) return localToken
  }

  if (reduxToken) return reduxToken
  
  // Fallback: Get from localStorage (for cases where store not yet initialized)
  try {
    const persistedState = localStorage.getItem('persist:root')
    if (persistedState) {
      const parsed = JSON.parse(persistedState)
      const authState = parsed?.auth ? JSON.parse(parsed.auth) : null
      return authState?.user?.token || null
    }
  } catch (error) {
    console.warn('[getAuthToken] Failed to parse persisted state:', error)
  }
  return null
}

export const buildUrl = (
  path: string,
  query?: Record<string, string | number | boolean | undefined | Array<string | number | boolean>>,
): string => {
  const normalizedPath = path.startsWith('http') ? path : `${API_BASE_URL}/${path.replace(/^\//, '')}`
  const url = new URL(normalizedPath)
  const params = toQueryString(query)
  if ([...params.keys()].length > 0) {
    url.search = params.toString()
  }
  return url.toString()
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { query, body, headers, timeout = 30000, signal: providedSignal, ...rest } = options
  const url = buildUrl(path, query)

  console.log('[apiRequest] 🔵 Making request to:', url)
  console.log('[apiRequest] 🔵 Options:', { method: rest.method || 'GET', headers, timeout })

  // Create AbortController for timeout if not already provided
  const abortController = new AbortController()
  const timeoutId = setTimeout(() => {
    console.warn('[apiRequest] ⏰ Request timeout after', timeout, 'ms')
    abortController.abort()
  }, timeout)

  // Combine provided signal with timeout signal
  const combinedSignal = providedSignal 
    ? (() => {
        const combined = new AbortController()
        // If either signal aborts, abort the combined signal
        providedSignal.addEventListener('abort', () => combined.abort())
        abortController.signal.addEventListener('abort', () => combined.abort())
        return combined.signal
      })()
    : abortController.signal

  // Get auth token if available (for authenticated requests)
  let authToken = getAuthToken()
  
  // CRITICAL: Check if token is expired BEFORE making the request
  // This prevents 401 errors by refreshing proactively
  if (authToken && isTokenExpired(authToken)) {
    console.warn('[apiRequest] ⚠️ Token is expired or about to expire, attempting refresh...')
    const refreshSuccess = await tryRefreshToken()
    
    if (refreshSuccess) {
      // Get new token after refresh
      authToken = getAuthToken()
      console.log('[apiRequest] ✅ Token refreshed proactively, new token:', authToken ? authToken.substring(0, 20) + '...' : 'MISSING')
    } else {
      console.warn('[apiRequest] ⚠️ Token refresh failed, will proceed with expired token (will retry on 401)')
      // Continue with expired token - will retry refresh on 401 error
    }
  }
  
  // Debug logging for auth token
  if (!authToken) {
    console.warn('[apiRequest] ⚠️ No auth token found')
    console.warn('[apiRequest] ⚠️ Make sure you are logged in')
  } else {
    console.log('[apiRequest] ✅ Auth token:', authToken.substring(0, 20) + '...')
  }
  
  // Build headers - automatically include Authorization if token exists
  // Custom headers passed in will override these defaults
  const requestHeaders: HeadersInit = {
    Accept: 'application/json',
    ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
    ...headers, // Custom headers override defaults
  }
  
  const headerLog = requestHeaders as Record<string, string>
  console.log('[apiRequest] 📤 Request headers:', {
    'Content-Type': headerLog['Content-Type'],
    'Authorization': authToken ? `${authToken.substring(0, 20)}...` : 'None',
  })

  try {
    const response = await fetch(url, {
      ...rest,
      signal: combinedSignal,
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
    
    // Clear timeout on successful response start
    clearTimeout(timeoutId)
    
    console.log('[apiRequest] 📥 Response status:', response.status, response.statusText)

    // Quota / eviction notice — fires for any endpoint that sets these headers
    try {
      const evictedTitle = response.headers.get('X-History-Eviction-Title')
      const evictedType = response.headers.get('X-History-Eviction-Type')
      const warningLevel = response.headers.get('X-History-Warning-Level')
      const historyCount = response.headers.get('X-History-Count')
      const historyLimit = response.headers.get('X-History-Limit')

      if (evictedTitle && evictedType && storeRef) {
        storeRef.dispatch(
          showSnackbar({
            variant: 'info',
            message: `Your oldest ${SOURCE_TYPE_LABELS[evictedType] ?? evictedType} "${evictedTitle}" was removed to keep your history under the limit.`,
          }),
        )
      }

      if (warningLevel === 'warning' && historyCount && historyLimit && storeRef) {
        storeRef.dispatch(
          showSnackbar({
            variant: 'warning',
            message: `You've used ${historyCount} of your ${historyLimit} ${SOURCE_TYPE_LABELS[evictedType ?? ''] ?? 'history'} slots. Upgrade for more storage.`,
          }),
        )
      }
    } catch {
      // Header processing should never break the request.
    }

    let payload: unknown = null
    const contentType = response.headers.get('content-type')

    if (response.status === 204) {
      payload = null
    } else if (contentType?.includes('application/json')) {
      try {
        payload = await response.json()
      } catch {
        payload = null
      }
    } else {
      payload = (await response.text()) || null
    }

    if (!response.ok) {
      // Handle 404 Not Found - endpoint doesn't exist
      if (response.status === 404) {
        const errorDetail = typeof payload === 'object' && payload !== null && 'detail' in (payload as Record<string, unknown>)
          ? String((payload as Record<string, unknown>).detail)
          : 'Not Found'

        console.error('[apiRequest] ❌ 404 Not Found', { url, payload })

        // Short UI-safe message; full URL + hints stay in the console above.
        const shortMessage =
          errorDetail && errorDetail !== 'Not Found'
            ? errorDetail.length > 180
              ? `${errorDetail.slice(0, 177)}…`
              : errorDetail
            : 'This endpoint was not found (404). Restart the API with the latest code if you just added new routes.'

        throw new ApiError(response.status, shortMessage, payload)
      }
      
      // Handle 401 Unauthorized - token may be expired
      if (response.status === 401) {
        console.error('[apiRequest] ❌ 401 Unauthorized - Authentication failed')
        console.error('[apiRequest] Response:', payload)
        console.error('[apiRequest] Token was:', authToken ? `${authToken.substring(0, 30)}...` : 'MISSING')
        
        // Try to refresh token if refresh_token is available
        const shouldRetry = await tryRefreshToken()
        
        if (shouldRetry) {
          console.log('[apiRequest] 🔄 Token refreshed, retrying request...')
          // Get new token
          const newToken = getAuthToken()
          if (newToken) {
            // Retry the request with new token
            const retryHeaders: HeadersInit = {
              ...requestHeaders,
              'Authorization': `Bearer ${newToken}`
            }
            
            const retryResponse = await fetch(url, {
              ...rest,
              signal: combinedSignal,
              headers: retryHeaders,
              body: body !== undefined ? JSON.stringify(body) : undefined,
            })
            
            clearTimeout(timeoutId)
            
            const retryContentType = retryResponse.headers.get('content-type')
            let retryPayload: unknown
            if (retryResponse.status === 204) {
              retryPayload = null
            } else if (retryContentType?.includes('application/json')) {
              try { retryPayload = await retryResponse.json() } catch { retryPayload = null }
            } else {
              retryPayload = (await retryResponse.text()) || null
            }
            
            if (retryResponse.ok) {
              return retryPayload as T
            } else {
              // Retry failed, use the retry response as the error
              const error = new ApiError(retryResponse.status, `Request failed after token refresh: ${(retryPayload as any)?.detail || retryResponse.statusText}`, retryPayload)
              throw error
            }
          }
        }
        
        // If refresh failed or no refresh token, clear auth and throw error
        try {
          const persistedState = localStorage.getItem('persist:root')
          if (persistedState) {
            const parsed = JSON.parse(persistedState)
            if (parsed?.auth) {
              const authState = JSON.parse(parsed.auth)
              if (authState?.user?.token) {
                // Token is expired/invalid, clear it
                authState.user.token = null
                authState.user = null
                authState.isAuthenticated = false
                parsed.auth = JSON.stringify(authState)
                localStorage.setItem('persist:root', JSON.stringify(parsed))
                console.warn('[apiRequest] ⚠️ Token expired, cleared from storage')
                console.warn('[apiRequest] 💡 Please log in again')
                // Keep Redux in sync with storage (otherwise PrivateRoutes/token state can disagree and confuse login).
                if (storeRef) {
                  try {
                    const [{ logoutUser }, { persistor }] = await Promise.all([
                      import('../redux/features/auth/authSlice'),
                      import('../redux/store'),
                    ])
                    storeRef.dispatch(logoutUser())
                    await persistor.purge()
                  } catch (syncErr) {
                    console.warn('[apiRequest] Could not sync Redux after auth clear:', syncErr)
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error('[apiRequest] Failed to clear expired token:', error)
        }
      }

      if (response.status === 402) {
        const raw = (payload as Record<string, unknown> | null)?.detail
        let msg = 'Insufficient credits'
        if (typeof raw === 'object' && raw !== null && 'message' in raw) {
          msg = String((raw as Record<string, unknown>).message)
        } else if (typeof raw === 'string') {
          msg = raw
        }
        throw new ApiError(response.status, msg, payload)
      }

      if (response.status === 429) {
        const detail = (payload as any)?.detail
        if (detail?.code === 'HISTORY_LIMIT_REACHED') {
          if (storeRef) {
            storeRef.dispatch(
              showSnackbar({
                variant: 'error',
                message:
                  detail?.message ||
                  `You've reached the limit for ${detail?.source_type ?? 'history'} items and all are pinned. Unpin some to make room.`,
              }),
            )
          }
          throw new ApiError(response.status, detail?.message || 'History limit reached', payload)
        }
      }

      // 502 from Vite dev server = proxy could not connect to FastAPI (ECONNREFUSED / wrong port).
      if (response.status === 502) {
        const base =
          typeof payload === 'object' && payload !== null && 'detail' in (payload as Record<string, unknown>)
            ? String((payload as Record<string, unknown>).detail)
            : response.statusText || 'Bad Gateway'
        const devHint = import.meta.env.DEV
          ? ' Start FastAPI on the host/port in VITE_PROXY_TARGET (see vite.config.ts; default http://127.0.0.1:8000), or set VITE_PROXY_TARGET in .env to match uvicorn. Then restart `yarn dev`.'
          : ' Check that the API server behind the gateway is running.'
        throw new ApiError(response.status, `${base}.${devHint}`, payload)
      }

      const message = typeof payload === 'object' && payload !== null && 'detail' in (payload as Record<string, unknown>)
        ? String((payload as Record<string, unknown>).detail)
        : response.statusText || 'Request failed'
      throw new ApiError(response.status, message, payload)
    }

    return payload as T
  } catch (error) {
    // Clear timeout in case of error
    clearTimeout(timeoutId)
    
    // Re-throw ApiError as-is
    if (error instanceof ApiError) {
      throw error
    }
    
    // Handle abort/timeout errors
    if (error instanceof Error && error.name === 'AbortError') {
      if (abortController.signal.aborted && !providedSignal?.aborted) {
        throw new Error(`Request timeout: The request took longer than ${timeout}ms to complete. The server may be slow or unreachable.`)
      }
      throw new Error('Request was cancelled')
    }
    
    // Handle network errors
    if (error instanceof TypeError) {
      if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
        throw new Error(`Network error: Unable to reach server at ${url}. Please check if the backend is running and accessible.`)
      }
      if (error.message.includes('network') || error.message.includes('connection')) {
        throw new Error(`Connection error: Cannot connect to server. Please verify the backend is running and accessible.`)
      }
    }
    
    // Re-throw other errors
    throw error
  }
}

export const normalizeTemplateParams = (params: TemplateListParams): Record<string, string | number> => {
  const query: Record<string, string | number> = {}
  if (params.q) query.q = params.q
  if (params.subject) query.subject = params.subject
  if (params.gradeBand) query.gradeBand = params.gradeBand
  if (params.bloom) query.bloom = params.bloom
  if (params.kind) query.kind = params.kind
  if (params.framework) query.framework = params.framework
  if (params.standardCode) query.standard_code = params.standardCode
  if (params.page) query.page = params.page
  if (params.pageSize) query.page_size = params.pageSize
  if (params.sort) query.sort = params.sort
  return query
}
