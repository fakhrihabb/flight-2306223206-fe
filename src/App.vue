<template>
  <div id="app">
    <Navbar v-if="isInitialized" />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { RouterView } from 'vue-router';
import Navbar from './components/Navbar.vue';
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore();
const isInitialized = ref(false);

async function handleVisibilityChange() {
  if (!document.hidden) {
    // Page became visible, re-validate token (handles SSO redirect case)
    await authStore.validateToken();
  }
}

onMounted(async () => {
  // Initial validation - ensure this completes before showing navbar
  await authStore.validateToken();
  isInitialized.value = true;
  
  // Re-validate when page becomes visible (handles redirect case)
  document.addEventListener('visibilitychange', handleVisibilityChange);
});

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange);
});
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-dark);
}

.main-content {
  flex: 1;
  padding-top: 2rem;
}
</style>
