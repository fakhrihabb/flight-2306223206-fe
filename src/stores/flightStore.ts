/**
 * Flight Store
 *
 * Manages flight and booking state across the application
 */

import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Flight, FlightBooking } from '@/types/flight';
import * as flightApi from '@/services/flightApi';

export const useFlightStore = defineStore('flight', () => {
  // State
  const flights = ref<Flight[]>([]);
  const myBookings = ref<FlightBooking[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Fetch all flights
   */
  async function fetchFlights(): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      flights.value = await flightApi.getAllFlights();
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch flights';
      console.error('Error fetching flights:', err);
    } finally {
      loading.value = false;
    }
  }

  /**
   * Fetch user's bookings
   */
  async function fetchMyBookings(): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      myBookings.value = await flightApi.getMyBookings();
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch bookings';
      console.error('Error fetching bookings:', err);
    } finally {
      loading.value = false;
    }
  }

  /**
   * Create a new flight
   */
  async function createFlight(flight: {
    flightNumber: string;
    origin: string;
    destination: string;
    price: number;
    availableSeats: number;
  }): Promise<Flight> {
    loading.value = true;
    error.value = null;
    try {
      const newFlight = await flightApi.createFlight(flight);
      flights.value.unshift(newFlight);
      return newFlight;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create flight';
      console.error('Error creating flight:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Book a flight
   */
  async function bookFlight(flightId: string, numberOfSeats: number): Promise<FlightBooking> {
    loading.value = true;
    error.value = null;
    try {
      const booking = await flightApi.bookFlight(flightId, { numberOfSeats });
      myBookings.value.unshift(booking);

      // Update available seats for the flight
      const flight = flights.value.find((f: Flight) => f.id === flightId);
      if (flight) {
        flight.availableSeats -= numberOfSeats;
      }

      return booking;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to book flight';
      console.error('Error booking flight:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Update a flight
   */
  async function updateFlight(
    flightId: string,
    updates: Partial<{
      flightNumber: string;
      origin: string;
      destination: string;
      price: number;
      availableSeats: number;
    }>
  ): Promise<Flight> {
    loading.value = true;
    error.value = null;
    try {
      const updatedFlight = await flightApi.updateFlight(flightId, updates);
      const index = flights.value.findIndex((f: Flight) => f.id === flightId);
      if (index !== -1) {
        flights.value[index] = updatedFlight;
      }
      return updatedFlight;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update flight';
      console.error('Error updating flight:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Delete a flight
   */
  async function deleteFlight(flightId: string): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      await flightApi.deleteFlight(flightId);
      flights.value = flights.value.filter((f: Flight) => f.id !== flightId);
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete flight';
      console.error('Error deleting flight:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    // State
    flights,
    myBookings,
    loading,
    error,

    // Actions
    fetchFlights,
    fetchMyBookings,
    createFlight,
    bookFlight,
    updateFlight,
    deleteFlight,
  };
});
