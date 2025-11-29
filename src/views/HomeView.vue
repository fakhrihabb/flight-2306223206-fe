<template>
  <div class="home-view">
    <div class="header">
      <h1>Flight Booking Service</h1>
      <p>Browse and book flights from our extensive catalog</p>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading flights...</p>
    </div>

    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="fetchFlights" class="btn-retry">Retry</button>
    </div>

    <div v-else-if="flights.length === 0" class="no-flights">
      <Plane :size="64" class="icon" />
      <p>No flights available at the moment</p>
    </div>

    <div v-else class="flights-grid">
      <FlightCard
        v-for="flight in flights"
        :key="flight.id"
        :flight="flight"
        :user-role="authStore.user?.role || null"
        @book="handleBookFlight"
        @edit="handleEditFlight"
        @delete="handleDeleteFlight"
      />
    </div>

    <BookingModal
      v-if="showBookingModal"
      :flight="selectedFlight!"
      @close="showBookingModal = false"
      @booked="handleBookingSuccess"
    />

    <EditFlightModal
      v-if="showEditModal"
      :flight="selectedFlight!"
      @close="showEditModal = false"
      @updated="handleUpdateSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Plane } from 'lucide-vue-next';
import { useFlightStore } from '@/stores/flightStore';
import { useAuthStore } from '@/stores/auth';
import FlightCard from '@/components/FlightCard.vue';
import BookingModal from '@/components/BookingModal.vue';
import EditFlightModal from '@/components/EditFlightModal.vue';
import type { Flight } from '@/types/flight';

const flightStore = useFlightStore();
const authStore = useAuthStore();

const flights = ref<Flight[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const showBookingModal = ref(false);
const showEditModal = ref(false);
const selectedFlight = ref<Flight | null>(null);

onMounted(async () => {
  await fetchFlights();
});

async function fetchFlights() {
  loading.value = true;
  error.value = null;
  try {
    await flightStore.fetchFlights();
    flights.value = flightStore.flights;
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load flights';
  } finally {
    loading.value = false;
  }
}

function handleBookFlight(flight: Flight) {
  selectedFlight.value = flight;
  showBookingModal.value = true;
}

function handleEditFlight(flight: Flight) {
  selectedFlight.value = flight;
  showEditModal.value = true;
}

async function handleDeleteFlight(flight: Flight) {
  if (!confirm(`Are you sure you want to delete flight ${flight.flightNumber}?`)) {
    return;
  }

  try {
    await flightStore.deleteFlight(flight.id);
    flights.value = flightStore.flights;
  } catch (err: any) {
    alert(err.response?.data?.message || 'Failed to delete flight');
  }
}

function handleBookingSuccess() {
  showBookingModal.value = false;
  fetchFlights(); // Refresh to update available seats
}

function handleUpdateSuccess() {
  showEditModal.value = false;
  fetchFlights(); // Refresh to show updated data
}
</script>

<style scoped>
.home-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-gold);
  margin-bottom: 0.5rem;
}

.header p {
  font-size: 1.1rem;
  color: var(--text-secondary);
}

.loading,
.no-flights {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--border-color);
  border-top-color: var(--primary-gold);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading p,
.no-flights p {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.no-flights .icon {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.error-message {
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  margin-bottom: 2rem;
}

.error-message p {
  color: #ef4444;
  margin-bottom: 1rem;
}

.btn-retry {
  background: var(--primary-gold);
  color: var(--bg-dark);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-retry:hover {
  background: var(--primary-dark-gold);
  transform: translateY(-2px);
}

.flights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

@media (max-width: 768px) {
  .home-view {
    padding: 1rem;
  }

  .header h1 {
    font-size: 2rem;
  }

  .flights-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
