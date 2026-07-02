import "dotenv/config";
import mongoose from "mongoose";
import { destinations, experiences, stays as properties } from "../backend/data/catalogData.js";
import { connectDatabase } from "./db.js";
import { Destination } from "./models/Destination.js";
import { Experience } from "./models/Experience.js";
import { Stay } from "./models/Stay.js";

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const connected = await connectDatabase();
if (!connected) {
  console.error("[seed] Set MONGODB_URI in .env before seeding");
  process.exitCode = 1;
} else {
  await Promise.all([
    Stay.bulkWrite(
      properties.map((stay) => ({
        updateOne: {
          filter: { id: stay.id },
          update: { $set: stay },
          upsert: true,
        },
      })),
    ),
    Destination.bulkWrite(
      destinations.map((destination) => ({
        updateOne: {
          filter: { name: destination.name },
          update: { $set: destination },
          upsert: true,
        },
      })),
    ),
    Experience.bulkWrite(
      experiences.map((experience) => ({
        updateOne: {
          filter: { slug: slugify(experience.title) },
          update: { $set: { ...experience, slug: slugify(experience.title) } },
          upsert: true,
        },
      })),
    ),
  ]);

  console.log(
    `[seed] loaded ${properties.length} stays, ${destinations.length} destinations, and ${experiences.length} experiences`,
  );
  await mongoose.disconnect();
}
