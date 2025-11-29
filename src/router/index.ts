/**
 * Vue Router Configuration with Authentication Guards
 *
 * This router implements:
 * - Route-level authentication (via meta.requiresAuth)
 * - Automatic token validation before navigation
 * - Token extraction from URL (development mode)
 * - Redirect to login for unauthenticated users
 */

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'
import AUTH_CONFIG from '@/config/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false },
    },
    {
      path: '/my-bookings',
      name: 'my-bookings',
      component: () => import('../views/MyBookingsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/create-flight',
      name: 'create-flight',
      component: () => import('../views/CreateFlightView.vue'),
      meta: { requiresAuth: true, requiresRole: 'FLIGHT_AIRLINE' },
    },
  ],
})

/**
 * Global Navigation Guard
 *
 * Runs before each route navigation to:
 * 1. Extract token from URL if present (development mode)
 * 2. Check if route requires authentication
 * 3. Validate token with backend
 * 4. Check role-based access (if specified)
 * 5. Redirect to login if not authenticated
 */
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Step 1: Extract token from URL if present (development mode)
  // This happens when user is redirected back from auth service with token in URL
  if (to.query.token && typeof to.query.token === 'string') {
    if (import.meta.env.DEV) {
      console.log('[Router Guard] Token found in URL, storing...')
    }

    authStore.setToken(to.query.token)

    // Remove token from URL for security (clean URL)
    const query = { ...to.query }
    delete query.token

    return next({
      path: to.path,
      query,
      replace: true, // Replace history entry (don't add to browser back button)
    })
  }

  // Step 2: Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (import.meta.env.DEV) {
      console.log(`[Router Guard] Route '${to.path}' requires authentication`)
    }

    // Step 3: Validate token
    const isValid = await authStore.validateToken()

    if (!isValid) {
      // Not authenticated - redirect to login
      const currentUrl = encodeURIComponent(window.location.origin + to.fullPath)
      const loginUrl = `${AUTH_CONFIG.authDomain}/login?redirect=${currentUrl}`

      if (import.meta.env.DEV) {
        console.log('[Router Guard] Not authenticated, redirecting to login:', loginUrl)
      }

      // Use window.location.href instead of next() to navigate to external domain
      window.location.href = loginUrl
      return
    }

    // Step 4: Check role-based access (if specified)
    if (to.meta.requiresRole && typeof to.meta.requiresRole === 'string') {
      const requiredRole = to.meta.requiresRole as string

      if (!authStore.hasRole(requiredRole)) {
        console.warn(`[Router Guard] User does not have required role: ${requiredRole}`)

        // User doesn't have required role - show error or redirect
        // For now, redirect to home with error message
        alert(`Access denied. This page requires ${requiredRole} role.`)
        return next({ name: 'home' })
      }
    }

    if (import.meta.env.DEV) {
      console.log('[Router Guard] Authentication successful, proceeding to route')
    }
  }

  // Step 5: Proceed with navigation
  next()
})

export default router
