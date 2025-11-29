<template>
  <div class="my-bookings-view">
    <div class="header">
      <h1>My Bookings</h1>
      <p>View and manage your flight bookings</p>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading your bookings...</p>
    </div>

    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="fetchBookings" class="btn-retry">Retry</button>
    </div>

    <div v-else-if="bookings.length === 0" class="no-bookings">
      <Calendar :size="64" class="icon" />
      <p>You haven't made any bookings yet</p>
      <router-link to="/" class="btn-primary">Browse Flights</router-link>
    </div>

    <div v-else class="bookings-list">
      <div v-for="booking in bookings" :key="booking.id" class="booking-card">
        <div class="booking-header">
          <div class="booking-status" :class="`status-${booking.bookingStatus.toLowerCase()}`">
            {{ booking.bookingStatus }}
          </div>
          <div class="booking-date">
            {{ formatDate(booking.createdAt) }}
          </div>
        </div>

        <div class="booking-body">
          <div class="flight-info">
            <Plane :size="24" class="icon" />
            <div class="route">
              <span class="location">{{ booking.flight?.origin || 'N/A' }}</span>
              <span class="arrow">→</span>
              <span class="location">{{ booking.flight?.destination || 'N/A' }}</span>
            </div>
          </div>

          <div class="booking-details">
            <div class="detail-item">
              <span class="label">Flight Number:</span>
              <span class="value">{{ booking.flight?.flightNumber || 'N/A' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Seats:</span>
              <span class="value">{{ booking.numberOfSeats }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Total Price:</span>
              <span class="value price">${{ booking.totalPrice.toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <div class="booking-id">
          Booking ID: {{ booking.id }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Calendar, Plane } from 'lucide-vue-next';
import { useFlightStore } from '@/stores/flightStore';
import type { FlightBooking } from '@/types/flight';

const flightStore = useFlightStore();

const bookings = ref<FlightBooking[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

onMounted(async () => {
  await fetchBookings();
});

async function fetchBookings() {
  loading.value = true;
  error.value = null;
  try {
    await flightStore.fetchMyBookings();
    bookings.value = flightStore.myBookings;
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load bookings';
  } finally {
    loading.value = false;
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
</script>

<style scoped>
.my-bookings-view {
  max-width: 1000px;
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
.no-bookings {
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
.no-bookings p {
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.no-bookings .icon {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.btn-primary {
  display: inline-block;
  background: var(--primary-gold);
  color: var(--bg-dark);
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: var(--primary-dark-gold);
  transform: translateY(-2px);
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

.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.booking-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s;
}

.booking-card:hover {
  border-color: var(--primary-gold);
  transform: translateY(-2px);
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.booking-status {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-confirmed {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.status-pending {
  background: rgba(234, 179, 8, 0.2);
  color: #eab308;
}

.status-cancelled {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.booking-date {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.booking-body {
  margin-bottom: 1rem;
}

.flight-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.flight-info .icon {
  color: var(--primary-gold);
}

.route {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.location {
  color: var(--text-primary);
}

.arrow {
  color: var(--text-secondary);
}

.booking-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  background: var(--bg-dark-secondary);
  padding: 1rem;
  border-radius: 8px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.value {
  color: var(--text-primary);
  font-weight: 600;
}

.value.price {
  color: var(--primary-gold);
  font-size: 1.1rem;
}

.booking-id {
  color: var(--text-secondary);
  font-size: 0.75rem;
  font-family: monospace;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  .my-bookings-view {
    padding: 1rem;
  }

  .header h1 {
    font-size: 2rem;
  }

  .route {
    font-size: 1rem;
  }

  .booking-details {
    grid-template-columns: 1fr;
  }
}
</style>
