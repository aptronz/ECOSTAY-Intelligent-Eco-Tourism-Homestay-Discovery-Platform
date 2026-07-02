import { ApiError } from "../utils/ApiError.js";

export function validateStayPayload(requireAllFields = true) {
  return (request, _response, next) => {
    const requiredFields = ["id", "name", "location", "price", "rating", "reviews", "score", "tag", "image", "description"];
    const errors = [];

    if (requireAllFields) {
      for (const field of requiredFields) {
        if (request.body[field] === undefined || request.body[field] === "") errors.push(`${field} is required`);
      }
    }

    for (const numberField of ["price", "rating", "reviews", "score"]) {
      if (request.body[numberField] !== undefined && !Number.isFinite(Number(request.body[numberField]))) {
        errors.push(`${numberField} must be a number`);
      }
    }

    if (request.body.score !== undefined) {
      const score = Number(request.body.score);
      if (score < 0 || score > 100) errors.push("score must be between 0 and 100");
    }

    if (errors.length) return next(new ApiError(400, "Invalid stay payload", errors));

    for (const numberField of ["price", "rating", "reviews", "score"]) {
      if (request.body[numberField] !== undefined) request.body[numberField] = Number(request.body[numberField]);
    }

    next();
  };
}

export function validateBookingPayload(request, _response, next) {
  const { stayId, guestName, guestEmail, checkIn, checkOut, guests } = request.body;
  const errors = [];

  if (!stayId) errors.push("stayId is required");
  if (!guestName) errors.push("guestName is required");
  if (!guestEmail || !guestEmail.includes("@")) errors.push("a valid guestEmail is required");
  if (!checkIn) errors.push("checkIn is required");
  if (!checkOut) errors.push("checkOut is required");
  if (!Number.isInteger(Number(guests)) || Number(guests) < 1) errors.push("guests must be at least 1");
  if (checkIn && checkOut && new Date(checkOut) <= new Date(checkIn)) {
    errors.push("checkOut must be after checkIn");
  }

  if (errors.length) return next(new ApiError(400, "Invalid booking payload", errors));

  request.body.guests = Number(guests);
  next();
}
