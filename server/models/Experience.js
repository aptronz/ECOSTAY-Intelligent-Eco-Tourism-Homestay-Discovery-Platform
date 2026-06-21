import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    place: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    rating: { type: Number, required: true, min: 0, max: 5 },
    image: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

experienceSchema.set("toJSON", {
  transform: (_document, result) => {
    delete result._id;
    delete result.__v;
    delete result.slug;
    return result;
  },
});

export const Experience = mongoose.model("Experience", experienceSchema);
