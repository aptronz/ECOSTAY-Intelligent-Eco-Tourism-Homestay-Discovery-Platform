import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { findReviewById } from "../models/reviewModel.js";

export const getReview = asyncHandler((request, response) => {
  const review = findReviewById(request.params.id);
  if (!review) throw new ApiError(404, "Review not found");

  response.status(200).json(review);
});
