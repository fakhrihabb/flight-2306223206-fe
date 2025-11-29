<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container">
      <div class="modal-header">
        <h2>Book Flight</h2>
        <button @click="$emit('close')" class="btn-close">×</button>
      </div>

      <div class="modal-body">
        <div class="flight-summary">
          <div class="flight-route">
            <Plane :size="20" class="icon" />
            <span class="route-text">
              {{ flight.origin }} → {{ flight.destination }}
            </span>
          </div>
          <div class="flight-details">
            <div class="detail">
              <span class="label">Flight Number:</span>
              <span class="value">{{ flight.flightNumber }}</span>
            </div>
            <div class="detail">
              <span class="label">Price per seat:</span>
              <span class="value price">${{ flight.price }}</span>
            </div>
            <div class="detail">
              <span class="label">Available seats:</span>
              <span class="value">{{ flight.availableSeats }}</span>
            </div>
          </div>
        </div>

        <div class="booking-form">
          <div class="form-group">
            <label for="seats">Number of Seats</label>
            <input
              id="seats"
              v-model.number="numberOfSeats"
              type="number"
              min="1"
              :max="flight.availableSeats"
              @input="calculateTotal"
            />
            <p v-if="seatError" class="error-text">{{ seatError }}</p>
          </div>

          <div class="total-section">
            <div class="total-label">Total Price</div>
            <div class="total-price">${{ totalPrice.toLocaleString() }}</div>
          </div>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="$emit('close')" class="btn-cancel">Cancel</button>
        <button
          @click="handleBooking"
          :disabled="loading || !!seatError || numberOfSeats < 1"
          class="btn-confirm"
        >
          <div v-if="loading" class="spinner-small"></div>
          {{ loading ? 'Booking...' : 'Confirm Booking' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Plane } from 'lucide-vue-next';
import { useFlightStore } from '@/stores/flightStore';
import type { Flight } from '@/types/flight';

interface Props {
  flight: Flight;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  booked: [];
}>();

const flightStore = useFlightStore();

const numberOfSeats = ref(1);
const totalPrice = ref(props.flight.price);
const loading = ref(false);
const error = ref<string | null>(null);

const seatError = computed(() => {
  if (numberOfSeats.value < 1) {
    return 'Must book at least 1 seat';
  }
  if (numberOfSeats.value > props.flight.availableSeats) {
    return `Only ${props.flight.availableSeats} seats available`;
  }
  return null;
});

function calculateTotal() {
  totalPrice.value = numberOfSeats.value * props.flight.price;
}

async function handleBooking() {
  if (seatError.value || numberOfSeats.value < 1) {
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    await flightStore.bookFlight(props.flight.id, numberOfSeats.value);
    emit('booked');
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to book flight';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-gold);
}

.btn-close {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 2rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}

.btn-close:hover {
  background: var(--bg-dark-secondary);
  color: var(--text-primary);
}

.modal-body {
  padding: 1.5rem;
}

.flight-summary {
  background: var(--bg-dark-secondary);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.flight-route {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.flight-route .icon {
  color: var(--primary-gold);
}

.route-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.flight-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail {
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

.booking-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

input {
  background: var(--bg-dark-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.2s;
}

input:focus {
  outline: none;
  border-color: var(--primary-gold);
}

.error-text {
  color: #ef4444;
  font-size: 0.875rem;
}

.total-section {
  background: var(--bg-dark-secondary);
  border: 1px solid var(--primary-gold);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
}

.total-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.total-price {
  color: var(--primary-gold);
  font-size: 2rem;
  font-weight: 700;
}

.error-message {
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 8px;
  padding: 1rem;
  color: #ef4444;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-cancel {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.btn-cancel:hover {
  border-color: var(--primary-gold);
  color: var(--text-primary);
}

.btn-confirm {
  background: var(--primary-gold);
  color: var(--bg-dark);
}

.btn-confirm:hover:not(:disabled) {
  background: var(--primary-dark-gold);
  transform: translateY(-2px);
}

.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner-small {
  width: 20px;
  height: 20px;
  border: 2px solid var(--bg-dark);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
