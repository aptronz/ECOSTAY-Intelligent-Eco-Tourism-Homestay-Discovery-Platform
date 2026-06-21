import { Router } from "express";
import { databaseStatus } from "../db.js";
import { Destination } from "../models/Destination.js";
import { Experience } from "../models/Experience.js";
import { Stay } from "../models/Stay.js";

export const catalogRouter = Router();

function requireDatabase(_request, response, next) {
  if (!databaseStatus().connected) {
    return response.status(503).json({
      message: "Database is unavailable",
      database: databaseStatus(),
    });
  }

  next();
}

catalogRouter.use(requireDatabase);

catalogRouter.get("/stays", async (request, response, next) => {
  try {
    const minimumScore = Number(request.query.minScore || 0);
    const query = Number.isFinite(minimumScore) ? { score: { $gte: minimumScore } } : {};
    const stays = await Stay.find(query).sort({ score: -1, rating: -1 }).lean();
    response.json(stays.map(({ _id, __v, ...stay }) => stay));
  } catch (error) {
    next(error);
  }
});

catalogRouter.get("/stays/:id", async (request, response, next) => {
  try {
    const stay = await Stay.findOne({ id: request.params.id }).lean();
    if (!stay) return response.status(404).json({ message: "Stay not found" });
    const { _id, __v, ...result } = stay;
    response.json(result);
  } catch (error) {
    next(error);
  }
});

catalogRouter.get("/destinations", async (_request, response, next) => {
  try {
    const destinations = await Destination.find().sort({ name: 1 }).lean();
    response.json(destinations.map(({ _id, __v, ...destination }) => destination));
  } catch (error) {
    next(error);
  }
});

catalogRouter.get("/experiences", async (_request, response, next) => {
  try {
    const experiences = await Experience.find().sort({ rating: -1 }).lean();
    response.json(experiences.map(({ _id, __v, slug, ...experience }) => experience));
  } catch (error) {
    next(error);
  }
});
