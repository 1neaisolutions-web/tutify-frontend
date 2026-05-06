/**
 * Centralized API Configuration
 * All API URLs should be imported from here
 */

// Local Development Backend URL (match uvicorn --port; align with VITE_PROXY_TARGET default in vite.config.ts)
const LOCAL_BACKEND_URL = 'http://127.0.0.1:8000'

/**
 * Get the backend base URL from environment variables or use defaults
 *
 * Priority:
 * 1. VITE_API_BASE_URL / VITE_API_URL (explicit absolute backend)
 * 2. Vite dev + no explicit URL: same origin (e.g. http://localhost:5173) — `/api` is proxied to FastAPI (see vite.config.ts)
 * 3. VITE_USE_LOCAL=true → LOCAL_BACKEND_URL
 * 4. Production default → Railway
 */
const getBackendBaseUrl = (): string => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')
  }

  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '').replace(/\/$/, '')
  }

  if (import.meta.env.VITE_USE_LOCAL === 'true') {
    return LOCAL_BACKEND_URL
  }

  // Vite dev: call same-origin `/api` so the dev server can proxy to FastAPI (avoids CORS + wrong-port hangs).
  if (import.meta.env.DEV) {
    if (typeof window !== 'undefined' && window.location?.origin) {
      return window.location.origin
    }
    return LOCAL_BACKEND_URL
  }

  // Production should always be configured via env (Vercel/Railway/etc).
  return LOCAL_BACKEND_URL
}

// Base URL (without /api) - for health checks and general use
export const API_BASE_URL = getBackendBaseUrl()

// API URL (with /api) - for API endpoints
export const API_URL = `${API_BASE_URL}/api`

// Health check URL
export const HEALTH_URL = `${API_BASE_URL}/health`

// Export for use in other files
export default {
  API_BASE_URL,
  API_URL,
  HEALTH_URL,
}
