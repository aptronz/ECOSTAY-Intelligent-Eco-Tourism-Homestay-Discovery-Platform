import { reviews } from "../data/reviewsData.js";

export function findReviewById(id) {
  return reviews.find((review) => review.id === id);
}
