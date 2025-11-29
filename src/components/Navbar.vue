<template>
  <nav class="navbar">
    <div class="nav-container">
      <router-link to="/" class="nav-brand">
        <Plane :size="28" class="brand-icon" />
        <span>Flight Booking</span>
      </router-link>

      <div class="nav-links">
        <router-link to="/" class="nav-link">Home</router-link>

        <router-link v-if="authStore.isAuthenticated" to="/my-bookings" class="nav-link">
          My Bookings
        </router-link>

        <router-link
          v-if="authStore.isAuthenticated && authStore.hasRole('FLIGHT_AIRLINE')"
          to="/create-flight"
          class="nav-link"
        >
          Create Flight
        </router-link>
      </div>

      <div class="nav-auth">
        <div v-if="!authStore.isAuthenticated" class="auth-buttons">
          <button @click="handleLogin" class="btn-login">Login</button>
          <button @click="handleRegister" class="btn-register">Register</button>
        </div>

        <div v-else class="profile-dropdown">
          <button @click="toggleDropdown" class="profile-button">
            <User :size="20" />
            <span class="username">{{ authStore.user?.username }}</span>
          </button>

          <div v-if="showDropdown" class="dropdown-menu">
            <div class="dropdown-header">
              <div class="user-name">{{ authStore.user?.username }}</div>
              <div class="user-role">{{ authStore.user?.role }}</div>
            </div>
            <div class="dropdown-divider"></div>
            <button @click="handleLogout" class="dropdown-item logout">
              <LogOut :size="18" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Plane, User, LogOut } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import AUTH_CONFIG from '@/config/auth';

const authStore = useAuthStore();
const showDropdown = ref(false);

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function handleLogin() {
  const currentUrl = encodeURIComponent(window.location.href);
  window.location.href = `${AUTH_CONFIG.authDomain}/login?redirect=${currentUrl}`;
}

function handleRegister() {
  const currentUrl = encodeURIComponent(window.location.href);
  window.location.href = `${AUTH_CONFIG.authDomain}/register?redirect=${currentUrl}`;
}

function handleLogout() {
  authStore.logout();
}

function handleClickOutside(event: MouseEvent) {
  const dropdown = document.querySelector('.profile-dropdown');
  if (dropdown && !dropdown.contains(event.target as Node)) {
    showDropdown.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.navbar {
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  background: rgba(30, 30, 30, 0.95);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--primary-gold);
  font-size: 1.25rem;
  font-weight: 700;
  transition: all 0.2s;
}

.nav-brand:hover {
  transform: translateY(-2px);
}

.brand-icon {
  color: var(--primary-gold);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex: 1;
  justify-content: center;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  position: relative;
}

.nav-link:hover {
  color: var(--primary-gold);
}

.nav-link.router-link-active {
  color: var(--primary-gold);
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--primary-gold);
}

.nav-auth {
  display: flex;
  align-items: center;
}

.auth-buttons {
  display: flex;
  gap: 1rem;
}

.btn-login,
.btn-register {
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-login {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.btn-login:hover {
  border-color: var(--primary-gold);
  color: var(--primary-gold);
}

.btn-register {
  background: var(--primary-gold);
  color: var(--bg-dark);
}

.btn-register:hover {
  background: var(--primary-dark-gold);
  transform: translateY(-2px);
}

.profile-dropdown {
  position: relative;
}

.profile-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--bg-dark-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
}

.profile-button:hover {
  border-color: var(--primary-gold);
}

.username {
  font-weight: 600;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 200px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.dropdown-header {
  padding: 1rem;
  background: var(--bg-dark-secondary);
}

.user-name {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.user-role {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dropdown-divider {
  height: 1px;
  background: var(--border-color);
}

.dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.dropdown-item:hover {
  background: var(--bg-dark-secondary);
  color: var(--text-primary);
}

.dropdown-item.logout {
  color: #ef4444;
}

.dropdown-item.logout:hover {
  background: rgba(220, 38, 38, 0.1);
}

@media (max-width: 768px) {
  .nav-container {
    padding: 1rem;
  }

  .nav-links {
    display: none;
  }

  .nav-brand span {
    display: none;
  }

  .auth-buttons {
    flex-direction: column;
    gap: 0.5rem;
  }

  .btn-login,
  .btn-register {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }

  .username {
    display: none;
  }
}
</style>
