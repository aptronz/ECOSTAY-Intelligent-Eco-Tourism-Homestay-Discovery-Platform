import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createBooking, findAllBookings } from "../models/bookingModel.js";
import { findStayById } from "../models/stayModel.js";

export const getBookings = asyncHandler((_request, response) => {
  response.status(200).json(findAllBookings());
});

export const reserveStay = asyncHandler((request, response) => {
  if (!findStayById(request.body.stayId)) {
    throw new ApiError(404, "Stay not found");
  }

  response.status(201).json(createBooking(request.body));
});
