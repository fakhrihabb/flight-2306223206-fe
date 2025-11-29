/**
 * Flight and Booking Type Definitions
 */

export interface Flight {
  id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  price: number;
  availableSeats: number;
  airlineId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FlightBooking {
  id: string;
  flightId: string;
  userId: string;
  numberOfSeats: number;
  totalPrice: number;
  bookingStatus: string;
  createdAt: string;
  updatedAt: string;
  flight?: Flight;
}

export interface CreateFlightRequest {
  flightNumber: string;
  origin: string;
  destination: string;
  price: number;
  availableSeats: number;
}

export interface BookFlightRequest {
  numberOfSeats: number;
}

export interface BaseResponse<T> {
  status: number;
  message: string;
  data: T;
}
