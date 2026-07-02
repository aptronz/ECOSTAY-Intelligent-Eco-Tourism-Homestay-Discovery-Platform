import { bookings } from "../data/catalogData.js";

export function createBooking(booking) {
  const savedBooking = {
    id: `booking-${Date.now()}`,
    status: "confirmed",
    createdAt: new Date().toISOString(),
    ...booking,
  };

  bookings.push(savedBooking);
  return savedBooking;
}

export function findAllBookings() {
  return [...bookings].sort((first, second) => second.createdAt.localeCompare(first.createdAt));
}
