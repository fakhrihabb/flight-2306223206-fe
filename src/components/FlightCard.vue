<template>
  <div class="flight-card">
    <div class="card-header">
      <div class="flight-number">{{ flight.flightNumber }}</div>
      <div class="price">${{ flight.price.toLocaleString() }}</div>
    </div>

    <div class="card-body">
      <div class="route">
        <div class="location">
          <div class="location-name">{{ flight.origin }}</div>
          <div class="location-label">Origin</div>
        </div>
        <div class="route-arrow">
          <Plane :size="24" class="plane-icon" />
        </div>
        <div class="location">
          <div class="location-name">{{ flight.destination }}</div>
          <div class="location-label">Destination</div>
        </div>
      </div>

      <div class="card-info">
        <div class="info-item">
          <span class="label">Available Seats:</span>
          <span class="value" :class="{ 'low-seats': flight.availableSeats < 10 }">
            {{ flight.availableSeats }}
          </span>
        </div>
      </div>
    </div>

    <div class="card-actions">
      <button
        v-if="userRole === 'CUSTOMER' && flight.availableSeats > 0"
        @click="$emit('book', flight)"
        class="btn-book"
      >
        Book Flight
      </button>

      <button
        v-if="userRole === 'FLIGHT_AIRLINE'"
        @click="$emit('edit', flight)"
        class="btn-edit"
      >
        <Edit :size="18" />
        Edit
      </button>

      <button
        v-if="userRole === 'SUPERADMIN'"
        @click="$emit('delete', flight)"
        class="btn-delete"
      >
        <Trash :size="18" />
        Delete
      </button>

      <div v-if="flight.availableSeats === 0" class="sold-out">
        Sold Out
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plane, Edit, Trash } from 'lucide-vue-next';
import type { Flight } from '@/types/flight';

interface Props {
  flight: Flight;
  userRole: string | null;
}

defineProps<Props>();

defineEmits<{
  book: [flight: Flight];
  edit: [flight: Flight];
  delete: [flight: Flight];
}>();
</script>

<style scoped>
.flight-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.flight-card:hover {
  border-color: var(--primary-gold);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(212, 165, 116, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flight-number {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-gold);
  font-family: monospace;
}

.price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.route {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1rem;
  align-items: center;
}

.location {
  text-align: center;
}

.location-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.location-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.route-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
}

.plane-icon {
  color: var(--primary-gold);
  transform: rotate(90deg);
}

.card-info {
  background: var(--bg-dark-secondary);
  border-radius: 8px;
  padding: 1rem;
}

.info-item {
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
  font-size: 1.1rem;
}

.value.low-seats {
  color: #ef4444;
}

.card-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn-book,
.btn-edit,
.btn-delete {
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

.btn-book {
  background: var(--primary-gold);
  color: var(--bg-dark);
  min-width: 100%;
}

.btn-book:hover {
  background: var(--primary-dark-gold);
  transform: translateY(-2px);
}

.btn-edit {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.btn-edit:hover {
  border-color: var(--primary-gold);
  color: var(--primary-gold);
}

.btn-delete {
  background: transparent;
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.btn-delete:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
}

.sold-out {
  flex: 1;
  text-align: center;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #ef4444;
  font-weight: 600;
}

@media (max-width: 768px) {
  .route {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .route-arrow {
    transform: rotate(90deg);
  }

  .plane-icon {
    transform: rotate(180deg);
  }
}
</style>
