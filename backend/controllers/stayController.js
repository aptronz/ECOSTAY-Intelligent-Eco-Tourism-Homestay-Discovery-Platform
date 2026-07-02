import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createStay,
  deleteStay,
  findAllStays,
  findStayById,
  searchStays,
  updateStay,
} from "../models/stayModel.js";

export const getStays = asyncHandler((request, response) => {
  const minScore = request.query.minScore === undefined ? undefined : Number(request.query.minScore);
  const maxPrice = request.query.maxPrice === undefined ? undefined : Number(request.query.maxPrice);

  if ((request.query.minScore !== undefined && !Number.isFinite(minScore)) ||
      (request.query.maxPrice !== undefined && !Number.isFinite(maxPrice))) {
    throw new ApiError(400, "minScore and maxPrice must be valid numbers");
  }

  response.status(200).json(findAllStays({
    minScore,
    maxPrice,
    location: request.query.location,
    sortBy: request.query.sortBy,
  }));
});

export const getStay = asyncHandler((request, response) => {
  const stay = findStayById(request.params.id);
  if (!stay) throw new ApiError(404, "Stay not found");

  response.status(200).json(stay);
});

export const searchStayCatalog = asyncHandler((request, response) => {
  const query = request.query.q;
  if (!query || !query.trim()) throw new ApiError(400, "Search query parameter q is required");

  response.status(200).json(searchStays(query));
});

export const createStayListing = asyncHandler((request, response) => {
  if (findStayById(request.body.id)) {
    throw new ApiError(400, "A stay with this id already exists");
  }

  response.status(201).json(createStay(request.body));
});

export const updateStayListing = asyncHandler((request, response) => {
  const updatedStay = updateStay(request.params.id, request.body);
  if (!updatedStay) throw new ApiError(404, "Stay not found");

  response.status(200).json(updatedStay);
});

export const deleteStayListing = asyncHandler((request, response) => {
  const deleted = deleteStay(request.params.id);
  if (!deleted) throw new ApiError(404, "Stay not found");

  response.status(204).send();
});
