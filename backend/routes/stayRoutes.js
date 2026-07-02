import { Router } from "express";
import {
  createStayListing,
  deleteStayListing,
  getStay,
  getStays,
  searchStayCatalog,
  updateStayListing,
} from "../controllers/stayController.js";
import { validateStayPayload } from "../middleware/validate.js";

export const stayRouter = Router();

stayRouter.get("/", getStays);
stayRouter.get("/search", searchStayCatalog);
stayRouter.get("/:id", getStay);
stayRouter.post("/", validateStayPayload(true), createStayListing);
stayRouter.patch("/:id", validateStayPayload(false), updateStayListing);
stayRouter.delete("/:id", deleteStayListing);
