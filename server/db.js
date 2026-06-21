import mongoose from "mongoose";

let connectionError = null;

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    connectionError = "MONGODB_URI is not configured";
    console.warn(`[database] ${connectionError}`);
    return false;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    connectionError = null;
    console.log(`[database] connected to ${mongoose.connection.name}`);
    return true;
  } catch (error) {
    connectionError = error.message;
    console.error(`[database] connection failed: ${error.message}`);
    return false;
  }
}

export function databaseStatus() {
  return {
    connected: mongoose.connection.readyState === 1,
    database: mongoose.connection.name || null,
    error: connectionError,
  };
}
