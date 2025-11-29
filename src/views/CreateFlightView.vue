<template>
  <div class="create-flight-view">
    <div class="header">
      <h1>Create New Flight</h1>
      <p>Add a new flight to your airline's catalog</p>
    </div>

    <div class="form-container">
      <form @submit.prevent="handleSubmit" class="flight-form">
        <div class="form-group">
          <label for="flightNumber">Flight Number</label>
          <input
            id="flightNumber"
            v-model="form.flightNumber"
            type="text"
            placeholder="e.g., AA123"
            required
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="origin">Origin</label>
            <input
              id="origin"
              v-model="form.origin"
              type="text"
              placeholder="e.g., New York (JFK)"
              required
            />
          </div>

          <div class="form-group">
            <label for="destination">Destination</label>
            <input
              id="destination"
              v-model="form.destination"
              type="text"
              placeholder="e.g., Los Angeles (LAX)"
              required
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="price">Price (USD)</label>
            <input
              id="price"
              v-model.number="form.price"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g., 299.99"
              required
            />
          </div>

          <div class="form-group">
            <label for="availableSeats">Available Seats</label>
            <input
              id="availableSeats"
              v-model.number="form.availableSeats"
              type="number"
              min="1"
              placeholder="e.g., 150"
              required
            />
          </div>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="form-actions">
          <button type="button" @click="handleCancel" class="btn-secondary">
            Cancel
          </button>
          <button type="submit" :disabled="loading" class="btn-primary">
            <Plus v-if="!loading" :size="20" />
            <div v-else class="spinner-small"></div>
            {{ loading ? 'Creating...' : 'Create Flight' }}
          </button>
        </div>
      </form>

      <div class="preview-card">
        <h3>Preview</h3>
        <div class="preview-content">
          <div class="preview-route">
            <span>{{ form.origin || 'Origin' }}</span>
            <Plane :size="20" class="icon" />
            <span>{{ form.destination || 'Destination' }}</span>
          </div>
          <div class="preview-details">
            <div class="preview-item">
              <span class="label">Flight:</span>
              <span class="value">{{ form.flightNumber || 'N/A' }}</span>
            </div>
            <div class="preview-item">
              <span class="label">Price:</span>
              <span class="value price">${{ form.price || 0 }}</span>
            </div>
            <div class="preview-item">
              <span class="label">Seats:</span>
              <span class="value">{{ form.availableSeats || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Plus, Plane } from 'lucide-vue-next';
import { useFlightStore } from '@/stores/flightStore';

const router = useRouter();
const flightStore = useFlightStore();

const form = ref({
  flightNumber: '',
  origin: '',
  destination: '',
  price: 0,
  availableSeats: 0,
});

const loading = ref(false);
const error = ref<string | null>(null);

async function handleSubmit() {
  loading.value = true;
  error.value = null;

  try {
    await flightStore.createFlight({
      flightNumber: form.value.flightNumber,
      origin: form.value.origin,
      destination: form.value.destination,
      price: form.value.price,
      availableSeats: form.value.availableSeats,
    });

    // Success - redirect to home
    router.push('/');
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to create flight';
  } finally {
    loading.value = false;
  }
}

function handleCancel() {
  router.push('/');
}
</script>

<style scoped>
.create-flight-view {
  max-width: 1200px;
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

.form-container {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  align-items: start;
}

.flight-form {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

label {
  display: block;
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

input {
  width: 100%;
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
  background: var(--bg-dark);
}

input::placeholder {
  color: var(--text-secondary);
  opacity: 0.5;
}

.error-message {
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 8px;
  padding: 1rem;
  color: #ef4444;
  margin-bottom: 1.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn-primary,
.btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background: var(--primary-gold);
  color: var(--bg-dark);
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-dark-gold);
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  border-color: var(--primary-gold);
  color: var(--text-primary);
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

.preview-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2rem;
  position: sticky;
  top: 2rem;
}

.preview-card h3 {
  color: var(--primary-gold);
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.preview-content {
  background: var(--bg-dark-secondary);
  border-radius: 8px;
  padding: 1.5rem;
}

.preview-route {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.preview-route .icon {
  color: var(--primary-gold);
}

.preview-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preview-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-item .label {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.preview-item .value {
  color: var(--text-primary);
  font-weight: 600;
}

.preview-item .value.price {
  color: var(--primary-gold);
  font-size: 1.25rem;
}

@media (max-width: 1024px) {
  .form-container {
    grid-template-columns: 1fr;
  }

  .preview-card {
    position: static;
  }
}

@media (max-width: 768px) {
  .create-flight-view {
    padding: 1rem;
  }

  .header h1 {
    font-size: 2rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}
</style>
