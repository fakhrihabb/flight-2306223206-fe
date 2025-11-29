/**
 * Flight API Service
 *
 * Provides methods for interacting with the flight backend API
 */

import { apiClientApi } from './api';
import type {
  Flight,
  FlightBooking,
  CreateFlightRequest,
  BookFlightRequest,
  BaseResponse,
} from '@/types/flight';

/**
 * Get all flights
 */
export const getAllFlights = async (): Promise<Flight[]> => {
  const response = await apiClientApi.get<BaseResponse<Flight[]>>('/list');
  return response.data.data;
};

/**
 * Get user's flight bookings
 */
export const getMyBookings = async (): Promise<FlightBooking[]> => {
  const response = await apiClientApi.get<BaseResponse<FlightBooking[]>>('/my-bookings');
  return response.data.data;
};

/**
 * Create a new flight (FLIGHT_AIRLINE only)
 */
export const createFlight = async (flight: CreateFlightRequest): Promise<Flight> => {
  const response = await apiClientApi.post<BaseResponse<Flight>>('/create', flight);
  return response.data.data;
};

/**
 * Book a flight (CUSTOMER only)
 */
export const bookFlight = async (
  flightId: string,
  booking: BookFlightRequest
): Promise<FlightBooking> => {
  const response = await apiClientApi.post<BaseResponse<FlightBooking>>(
    `/${flightId}/book`,
    booking
  );
  return response.data.data;
};

/**
 * Update a flight (FLIGHT_AIRLINE only, own flights)
 */
export const updateFlight = async (
  flightId: string,
  flight: Partial<CreateFlightRequest>
): Promise<Flight> => {
  const response = await apiClientApi.put<BaseResponse<Flight>>(`/${flightId}`, flight);
  return response.data.data;
};

/**
 * Delete a flight (SUPERADMIN only)
 */
export const deleteFlight = async (flightId: string): Promise<void> => {
  await apiClientApi.delete(`/${flightId}`);
};
