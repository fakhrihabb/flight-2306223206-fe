<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container">
      <div class="modal-header">
        <h2>Edit Flight</h2>
        <button @click="$emit('close')" class="btn-close">×</button>
      </div>

      <div class="modal-body">
        <form @submit.prevent="handleUpdate" class="edit-form">
          <div class="form-group">
            <label for="flightNumber">Flight Number</label>
            <input
              id="flightNumber"
              v-model="form.flightNumber"
              type="text"
              required
            />
          </div>

          <div class="form-group">
            <label for="origin">Origin</label>
            <input id="origin" v-model="form.origin" type="text" required />
          </div>

          <div class="form-group">
            <label for="destination">Destination</label>
            <input
              id="destination"
              v-model="form.destination"
              type="text"
              required
            />
          </div>

          <div class="form-group">
            <label for="price">Price (USD)</label>
            <input
              id="price"
              v-model.number="form.price"
              type="number"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div class="form-group">
            <label for="availableSeats">Available Seats</label>
            <input
              id="availableSeats"
              v-model.number="form.availableSeats"
              type="number"
              min="0"
              required
            />
          </div>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <button @click="$emit('close')" class="btn-cancel">Cancel</button>
        <button
          @click="handleUpdate"
          :disabled="loading"
          class="btn-confirm"
        >
          <Edit v-if="!loading" :size="18" />
          <div v-else class="spinner-small"></div>
          {{ loading ? 'Updating...' : 'Update Flight' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Edit } from 'lucide-vue-next';
import { useFlightStore } from '@/stores/flightStore';
import type { Flight } from '@/types/flight';

interface Props {
  flight: Flight;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  updated: [];
}>();

const flightStore = useFlightStore();

const form = ref({
  flightNumber: props.flight.flightNumber,
  origin: props.flight.origin,
  destination: props.flight.destination,
  price: props.flight.price,
  availableSeats: props.flight.availableSeats,
});

const loading = ref(false);
const error = ref<string | null>(null);

async function handleUpdate() {
  loading.value = true;
  error.value = null;

  try {
    await flightStore.updateFlight(props.flight.id, {
      flightNumber: form.value.flightNumber,
      origin: form.value.origin,
      destination: form.value.destination,
      price: form.value.price,
      availableSeats: form.value.availableSeats,
    });
    emit('updated');
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to update flight';
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

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
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
  width: 18px;
  height: 18px;
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
