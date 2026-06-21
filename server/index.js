import "dotenv/config";
import cors from "cors";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { connectDatabase, databaseStatus } from "./db.js";
import { bookingRouter } from "./routes/bookings.js";
import { catalogRouter } from "./routes/catalog.js";

const app = express();
const port = Number(process.env.PORT || 5000);
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const distDirectory = path.resolve(currentDirectory, "../dist");

app.use(cors({ origin: clientOrigin }));
app.use(express.json());

app.get("/api/health", (_request, response) => {
  const database = databaseStatus();
  response.status(database.connected ? 200 : 503).json({
    service: "ecostay-api",
    database,
  });
});

app.use("/api", catalogRouter);
app.use("/api/bookings", bookingRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(distDirectory));
  app.get("/{*path}", (_request, response) => {
    response.sendFile(path.join(distDirectory, "index.html"));
  });
}

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ message: "Unexpected server error" });
});

await connectDatabase();

app.listen(port, () => {
  console.log(`[server] ECOSTAY API listening on http://127.0.0.1:${port}`);
});
