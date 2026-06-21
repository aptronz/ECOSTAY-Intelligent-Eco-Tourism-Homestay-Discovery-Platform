import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    meta: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

destinationSchema.set("toJSON", {
  transform: (_document, result) => {
    delete result._id;
    delete result.__v;
    return result;
  },
});

export const Destination = mongoose.model("Destination", destinationSchema);
