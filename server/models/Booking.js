import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    stayId: { type: String, required: true, index: true },
    guestName: { type: String, required: true, trim: true },
    guestEmail: { type: String, required: true, lowercase: true, trim: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true, min: 1, max: 20 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export const Booking = mongoose.model("Booking", bookingSchema);
