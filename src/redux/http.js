// Library Imports
import axios from 'axios';

// Local Imports
import { baseURL } from './constant';
import { logoutUser } from './features/auth/authSlice';

const axiosInstance = axios.create({
  baseURL,
  timeout: 30000, // 30 seconds timeout - signup can take longer due to multiple DB operations
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store reference for accessing auth token (set after store creation)
let storeRef = null;

// Function to set store reference (called from store.js after store creation)
export const setStoreReference = (store) => {
  storeRef = store;
};

// Helper to check if token is expired (JWT tokens contain exp claim)
function isTokenExpired(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return true; // Invalid token format
    }
    
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    
    if (!payload.exp) {
      return false; // No expiration claim
    }
    
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const bufferTime = 60 * 1000; // 60 seconds buffer
    
    return currentTime >= (expirationTime - bufferTime);
  } catch (error) {
    console.warn('[Axios] Failed to check token expiration:', error);
    return true; // Assume expired if we can't decode
  }
}

// Helper to try refreshing the token (same as client.ts)
async function tryRefreshToken() {
  try {
    if (!storeRef) return false;
    
    const state = storeRef.getState();
    const refreshToken = state?.auth?.user?.refresh_token;
    
    if (!refreshToken) {
      console.warn('[Axios] No refresh token available');
      return false;
    }
    
    // Use centralized config directly
    const { API_BASE_URL } = await import('../config/api')
    const refreshUrl = `${API_BASE_URL}/api/v1/auth/refresh`;
    
    const refreshResponse = await fetch(refreshUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    
    if (!refreshResponse.ok) {
      console.warn('[Axios] Token refresh failed:', refreshResponse.status);
      return false;
    }
    
    const refreshData = await refreshResponse.json();
    
    if (refreshData?.access_token) {
      // Update token in localStorage (redux-persist will sync to Redux on next access)
      try {
        const persistedState = localStorage.getItem('persist:root');
        if (persistedState) {
          const parsed = JSON.parse(persistedState);
          const authState = parsed?.auth ? JSON.parse(parsed.auth) : null;
          
          if (authState?.user) {
            authState.user.token = refreshData.access_token;
            if (refreshData.refresh_token) {
              authState.user.refresh_token = refreshData.refresh_token;
            }
            parsed.auth = JSON.stringify(authState);
            localStorage.setItem('persist:root', JSON.stringify(parsed));
          }
        }
      } catch (e) {
        console.warn('[Axios] Could not update localStorage:', e);
      }
      
      // Update axios default header for future requests
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${refreshData.access_token}`;
      
      console.log('[Axios] ✅ Token refreshed successfully');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('[Axios] Error refreshing token:', error);
    return false;
  }
}

// Request interceptor - auto-include auth token from Redux store with expiration check
axiosInstance.interceptors.request.use(
  async (config) => {
    // Get auth token from Redux store if available
    if (storeRef) {
      try {
        const state = storeRef.getState();
        let token = state?.auth?.user?.token;

        // CRITICAL: Check if token is expired BEFORE making the request
        // This prevents 401 errors by refreshing proactively
        if (token && isTokenExpired(token)) {
          console.warn('[Axios] ⚠️ Token is expired, attempting refresh...');
          const refreshSuccess = await tryRefreshToken();
          
          if (refreshSuccess) {
            // Get new token after refresh
            const newState = storeRef.getState();
            token = newState?.auth?.user?.token;
            console.log('[Axios] ✅ Token refreshed proactively');
          } else {
            console.warn('[Axios] ⚠️ Token refresh failed, using expired token (will fail on 401)');
          }
        }

        // Automatically include auth token if available
        if (token && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        // Handle gracefully if state access fails
        console.warn('[Axios] Could not get auth token from store:', error);
      }
    }

    // Don't override Content-Type for FormData - let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    const fullUrl = config.baseURL 
      ? `${config.baseURL}${config.url.startsWith('/') ? '' : '/'}${config.url}`
      : config.url;
    console.log(`[Axios] ${config.method?.toUpperCase()} ${fullUrl}`);
    console.log(`[Axios] Headers:`, {
      Authorization: config.headers.Authorization ? 'Bearer ***' : 'None',
      'Content-Type': config.headers['Content-Type'] || 'None',
    });
    return config;
  },
  (error) => {
    console.error('[Axios] Request error:', error);
    return Promise.reject(error);
  }
);

export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log('Error from axios:', error);

    // Handle network/connection errors
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      const timeoutError = new Error(
        `Request timeout: The server took longer than ${axiosInstance.defaults.timeout}ms to respond. ` +
        `Please check if the backend is running and accessible at ${baseURL}`
      );
      timeoutError.name = 'TimeoutError';
      console.error('[Axios] ⏰ Request timeout:', timeoutError.message);
      return Promise.reject(timeoutError);
    }

    // Handle network errors (no response received)
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      const networkError = new Error(
        `Network error: Unable to connect to server at ${baseURL}. ` +
        `Please verify:\n1. Backend is running and reachable\n2. CORS is properly configured\n3. No firewall blocking the connection`
      );
      networkError.name = 'NetworkError';
      console.error('[Axios] 🌐 Network error:', networkError.message);
      return Promise.reject(networkError);
    }

    // Handle connection refused errors
    if (error.code === 'ECONNREFUSED' || error.message?.includes('refused')) {
      const connectionError = new Error(
        `Connection refused: The server at ${baseURL} is not accepting connections. ` +
        `Please ensure the backend server is running.`
      );
      connectionError.name = 'ConnectionError';
      console.error('[Axios] 🔌 Connection refused:', connectionError.message);
      return Promise.reject(connectionError);
    }

    // Check for offline status
    if (!navigator.onLine) {
      const offlineError = new Error(
        'No internet connection: Please check your network connection and try again.'
      );
      offlineError.name = 'OfflineError';
      console.error('[Axios] 📴 Offline error:', offlineError.message);
      return Promise.reject(offlineError);
    }

    // Handle 401 Unauthorized - try to refresh token first before logging out
    // Password change endpoint returns 401 for wrong password, which is a validation error, not auth error
    if (error?.response?.status === 401) {
      const requestUrl = error?.config?.url || '';
      
      // Don't logout on password change errors - these are validation errors, not auth errors
      if (requestUrl.includes('/change-password') || requestUrl.includes('/change_password')) {
        // Just reject the error, don't logout
        return Promise.reject(error);
      }
      
      // Don't try refresh on refresh endpoint itself (would cause infinite loop)
      if (requestUrl.includes('/auth/refresh')) {
        // Refresh failed - logout user
        try {
          const storeModule = await import('./store');
          const { store, persistor } = storeModule;
          const dispatch = store.dispatch;
          dispatch(logoutUser());
          persistor.purge();
        } catch (importError) {
          console.error('Failed to import store in error handler:', importError);
        }
        return Promise.reject(error);
      }
      
      // CRITICAL: Try to refresh token before logging out
      // This handles cases where token expired between request and response
      console.warn('[Axios] ⚠️ 401 Unauthorized, attempting token refresh...');
      const refreshSuccess = await tryRefreshToken();
      
      if (refreshSuccess) {
        // Token refreshed - retry the original request with new token
        console.log('[Axios] ✅ Token refreshed, retrying original request...');
        const newState = storeRef.getState();
        const newToken = newState?.auth?.user?.token;
        
        if (newToken && error.config) {
          // Update authorization header and retry
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance.request(error.config);
        }
      }
      
      // Refresh failed or not available - logout user
      console.error('[Axios] ❌ Token refresh failed or unavailable, logging out...');
      try {
        const storeModule = await import('./store');
        const { store, persistor } = storeModule;
        const dispatch = store.dispatch;
        dispatch(logoutUser());
        persistor.purge();
      } catch (importError) {
        console.error('Failed to import store in error handler:', importError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

