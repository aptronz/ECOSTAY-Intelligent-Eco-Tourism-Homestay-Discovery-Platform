import { Router } from "express";
import { databaseStatus } from "../db.js";
import { Booking } from "../models/Booking.js";
import { Stay } from "../models/Stay.js";

export const bookingRouter = Router();

bookingRouter.post("/", async (request, response, next) => {
  try {
    if (!databaseStatus().connected) {
      return response.status(503).json({ message: "Database is unavailable" });
    }

    const { stayId, guestName, guestEmail, checkIn, checkOut, guests } = request.body;
    if (!stayId || !guestName || !guestEmail || !checkIn || !checkOut || !guests) {
      return response.status(400).json({ message: "All booking fields are required" });
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      return response.status(400).json({ message: "Check-out must be after check-in" });
    }

    const stayExists = await Stay.exists({ id: stayId });
    if (!stayExists) return response.status(404).json({ message: "Stay not found" });

    const booking = await Booking.create({
      stayId,
      guestName,
      guestEmail,
      checkIn,
      checkOut,
      guests,
    });

    response.status(201).json(booking);
  } catch (error) {
    next(error);
  }
});
