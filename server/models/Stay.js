import mongoose from "mongoose";

const staySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    rating: { type: Number, required: true, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },
    score: { type: Number, required: true, min: 0, max: 100 },
    tag: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

staySchema.set("toJSON", {
  transform: (_document, result) => {
    delete result._id;
    delete result.__v;
    return result;
  },
});

export const Stay = mongoose.model("Stay", staySchema);
