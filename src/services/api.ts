/**
 * API Client Configuration with Authentication
 *
 * This module provides configured axios instances with:
 * - Automatic JWT token injection (request interceptor)
 * - 401 error handling and auto-logout (response interceptor)
 * - Enhanced error logging
 *
 * Two clients are provided:
 * - apiClient: Base URL without /api prefix
 * - apiClientApi: Base URL with /api/flight prefix
 */

import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// Use environment variable with fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const apiClientApi = axios.create({
  baseURL: `${API_BASE_URL}/api/flight`,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request Interceptor: Attach JWT Token
 *
 * Automatically adds Authorization header with JWT token to all requests
 * Token is read from auth store (which handles cookie/localStorage based on environment)
 */
const requestInterceptor = (config: any) => {
  const authStore = useAuthStore()

  // Initialize token from storage (cookie or localStorage)
  authStore.initializeToken()

  // Attach token to request if it exists
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`

    if (import.meta.env.DEV) {
      console.log(`[API] Attaching JWT to ${config.method?.toUpperCase()} ${config.url}`)
    }
  }

  return config
}

/**
 * Response Interceptor: Error Handling
 *
 * Handles API errors:
 * - 401 Unauthorized: Token expired/invalid → Auto-logout
 * - Other errors: Enhanced logging for debugging
 */
const errorInterceptor = (error: any) => {
  if (error.response) {
    // Server responded with error status
    console.error('API Error Response:', {
      status: error.response.status,
      data: error.response.data,
      url: error.config?.url,
      method: error.config?.method,
    })

    // Handle 401 Unauthorized (token expired or invalid)
    if (error.response.status === 401) {
      console.warn('[API] 401 Unauthorized - Token expired or invalid. Logging out...')

      const authStore = useAuthStore()
      authStore.logout() // Clears token and redirects to login
    }
  } else if (error.request) {
    // Request was made but no response received
    console.error('API No Response:', {
      url: error.config?.url,
      method: error.config?.method,
      message: `No response from server. Is the backend running on ${API_BASE_URL}?`,
    })
  } else {
    // Something else happened
    console.error('API Error:', error.message)
  }
  return Promise.reject(error)
}

// Apply request interceptor (attach JWT token)
apiClient.interceptors.request.use(requestInterceptor, (error) => Promise.reject(error))
apiClientApi.interceptors.request.use(requestInterceptor, (error) => Promise.reject(error))

// Apply response interceptor (error handling)
apiClient.interceptors.response.use((response) => response, errorInterceptor)
apiClientApi.interceptors.response.use((response) => response, errorInterceptor)

export { apiClient, apiClientApi, API_BASE_URL }
