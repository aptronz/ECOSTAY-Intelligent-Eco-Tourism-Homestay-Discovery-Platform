import { Router } from "express";
import { getReview } from "../controllers/reviewController.js";

export const reviewRouter = Router();

reviewRouter.get("/:id", getReview);
