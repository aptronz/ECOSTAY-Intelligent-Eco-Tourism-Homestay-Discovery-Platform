import "dotenv/config";
import cors from "cors";
import express from "express";
import { bookingRouter } from "./routes/bookingRoutes.js";
import { catalogRouter } from "./routes/catalogRoutes.js";
import { reviewRouter } from "./routes/reviewRoutes.js";
import { stayRouter } from "./routes/stayRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();
const port = Number(process.env.PORT || 5000);
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: clientOrigin }));
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.status(200).json({
    success: true,
    service: "ecostay-api",
    storage: "in-memory",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/stays", stayRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api", catalogRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`[backend] ECOSTAY API listening on http://127.0.0.1:${port}`);
});
