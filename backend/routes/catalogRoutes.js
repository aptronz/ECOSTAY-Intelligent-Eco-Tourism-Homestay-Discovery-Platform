import { Router } from "express";
import { getDestinations, getExperiences } from "../controllers/catalogController.js";

export const catalogRouter = Router();

catalogRouter.get("/destinations", getDestinations);
catalogRouter.get("/experiences", getExperiences);
