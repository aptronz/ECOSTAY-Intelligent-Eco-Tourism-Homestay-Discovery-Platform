import { Router } from "express";
import { getBookings, reserveStay } from "../controllers/bookingController.js";
import { validateBookingPayload } from "../middleware/validate.js";

export const bookingRouter = Router();

bookingRouter.get("/", getBookings);
bookingRouter.post("/", validateBookingPayload, reserveStay);
