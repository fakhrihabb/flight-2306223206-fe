/**
 * Authentication Store
 *
 * Manages authentication state across the application.
 * Supports both cookie-based (production) and localStorage-based (development) token storage.
 *
 * Key Functions:
 * - initializeToken(): Load token from storage (cookie or localStorage)
 * - setToken(token): Store token in appropriate storage
 * - validateToken(): Verify token with backend and load user info
 * - logout(): Clear token and redirect to login
 *
 * State:
 * - token: JWT token string
 * - user: User information (userId, username, email, role, name)
 * - isAuthenticated: Boolean indicating if user is logged in
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import AUTH_CONFIG from '@/config/auth';

/**
 * User information returned from backend
 */
export interface User {
  userId: string;
  username: string;
  email: string;
  role: string;
  name: string;
}

/**
 * Response structure from /api/auth/validate endpoint
 */
interface AuthResponse {
  status: number;
  message: string;
  data: User;
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref<string | null>(null);
  const user = ref<User | null>(null);

  // Computed
  const isAuthenticated = computed(() => !!token.value && !!user.value);

  /**
   * Get token from cookie
   * Used in production (*.fakhrihabb.dev)
   */
  function getTokenFromCookie(): string | null {
    const match = document.cookie.match(new RegExp('(^| )jwt_token=([^;]+)'));
    return match ? (match[2] || null) : null;
  }

  /**
   * Get token from localStorage
   * Used in development (localhost)
   */
  function getTokenFromLocalStorage(): string | null {
    return localStorage.getItem('jwt_token') || null;
  }

  /**
   * Initialize token from storage based on environment configuration
   * Production: Reads from cookie
   * Development: Reads from localStorage
   *
   * @returns The token if found, null otherwise
   */
  function initializeToken(): string | null {
    if (AUTH_CONFIG.useCookieAuth) {
      // Production: Read from cookie
      token.value = getTokenFromCookie();
      if (import.meta.env.DEV) {
        console.log('[Auth Store] Initialized token from cookie:', token.value ? 'Found' : 'Not found');
      }
    } else {
      // Development: Read from localStorage
      token.value = getTokenFromLocalStorage();
      if (import.meta.env.DEV) {
        console.log('[Auth Store] Initialized token from localStorage:', token.value ? 'Found' : 'Not found');
      }
    }

    return token.value;
  }

  /**
   * Store token in appropriate storage based on environment configuration
   * Production: Stores in cookie with Domain=.fakhrihabb.dev
   * Development: Stores in localStorage
   *
   * @param newToken JWT token to store
   */
  function setToken(newToken: string): void {
    token.value = newToken;

    if (AUTH_CONFIG.useCookieAuth) {
      // Production: Store in cookie (shared across subdomains)
      const cookieString = [
        `jwt_token=${newToken}`,
        `Domain=${AUTH_CONFIG.cookieDomain}`,
        'Path=/',
        'SameSite=Lax',
        'Secure',
        'Max-Age=86400', // 24 hours (matches JWT expiration)
      ].join('; ');

      document.cookie = cookieString;

      if (import.meta.env.DEV) {
        console.log('[Auth Store] Stored token in cookie:', cookieString);
      }
    } else {
      // Development: Store in localStorage
      localStorage.setItem('jwt_token', newToken);

      if (import.meta.env.DEV) {
        console.log('[Auth Store] Stored token in localStorage');
      }
    }
  }

  /**
   * Clear token from storage
   * Used during logout
   */
  function clearToken(): void {
    token.value = null;

    if (AUTH_CONFIG.useCookieAuth) {
      // Production: Delete cookie
      document.cookie = `jwt_token=; Domain=${AUTH_CONFIG.cookieDomain}; Path=/; Secure; Max-Age=0`;

      if (import.meta.env.DEV) {
        console.log('[Auth Store] Cleared token from cookie');
      }
    } else {
      // Development: Clear localStorage
      localStorage.removeItem('jwt_token');

      if (import.meta.env.DEV) {
        console.log('[Auth Store] Cleared token from localStorage');
      }
    }
  }

  /**
   * Validate token with backend and load user information
   *
   * Flow:
   * 1. Initialize token from storage
   * 2. If no token exists, return false
   * 3. Call backend /api/auth/validate endpoint with token
   * 4. If valid, store user info and return true
   * 5. If invalid (401, expired, etc.), logout and return false
   *
   * @returns Promise<boolean> true if token is valid, false otherwise
   */
  async function validateToken(): Promise<boolean> {
    // Ensure token is loaded from storage
    initializeToken();

    if (!token.value) {
      if (import.meta.env.DEV) {
        console.log('[Auth Store] No token to validate');
      }
      return false;
    }

    try {
      if (import.meta.env.DEV) {
        console.log('[Auth Store] Validating token with backend...');
      }

      const response = await axios.post<AuthResponse>(
        `${AUTH_CONFIG.apiUrl}/api/auth/validate`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        }
      );

      if (response.data.status === 200 && response.data.data) {
        const userData = response.data.data;
        // Map backend response to user object
        user.value = {
          userId: userData.userId,
          username: userData.username,
          name: userData.username, // Use username as name if name field doesn't exist
          email: userData.email,
          role: userData.role,
        };

        if (import.meta.env.DEV) {
          console.log('[Auth Store] Token validated successfully. User:', user.value);
        }

        return true;
      } else {
        if (import.meta.env.DEV) {
          console.warn('[Auth Store] Token validation returned unexpected response:', response.data);
        }
        logout();
        return false;
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('[Auth Store] Token validation failed:', error);
      }

      // Don't call logout here if validation endpoint is unreachable
      // Only logout if it's a 401 (unauthorized)
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        logout();
      }

      return false;
    }
  }

  /**
   * Logout user
   *
   * Flow:
   * 1. Clear user state
   * 2. Clear token from storage
   * 3. Redirect to login page with return URL
   */
  function logout(): void {
    if (import.meta.env.DEV) {
      console.log('[Auth Store] Logging out...');
    }

    user.value = null;
    clearToken();

    // Redirect to login with current URL as return destination
    const currentUrl = encodeURIComponent(window.location.href);
    const loginUrl = `${AUTH_CONFIG.authDomain}/login?redirect=${currentUrl}`;

    if (import.meta.env.DEV) {
      console.log('[Auth Store] Redirecting to login:', loginUrl);
    }

    window.location.href = loginUrl;
  }

  /**
   * Check if user has a specific role
   *
   * @param requiredRole Role to check (e.g., 'CUSTOMER', 'FLIGHT_AIRLINE')
   * @returns true if user has the role, false otherwise
   */
  function hasRole(requiredRole: string): boolean {
    return user.value?.role === requiredRole;
  }

  /**
   * Check if user has any of the specified roles
   *
   * @param roles Array of roles to check
   * @returns true if user has any of the roles, false otherwise
   */
  function hasAnyRole(roles: string[]): boolean {
    return roles.some((role) => hasRole(role));
  }

  return {
    // State
    token,
    user,

    // Computed
    isAuthenticated,

    // Actions
    initializeToken,
    setToken,
    validateToken,
    logout,
    hasRole,
    hasAnyRole,
  };
});
