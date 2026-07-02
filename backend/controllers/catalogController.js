import { asyncHandler } from "../utils/asyncHandler.js";
import { findAllDestinations } from "../models/destinationModel.js";
import { findAllExperiences } from "../models/experienceModel.js";

export const getDestinations = asyncHandler((_request, response) => {
  response.status(200).json(findAllDestinations());
});

export const getExperiences = asyncHandler((request, response) => {
  response.status(200).json(findAllExperiences(request.query.type));
});
