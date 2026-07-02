import { experiences } from "../data/catalogData.js";

export function findAllExperiences(type) {
  const results = type
    ? experiences.filter((experience) => experience.type.toLowerCase().includes(type.toLowerCase()))
    : experiences;

  return [...results].sort((first, second) => second.rating - first.rating);
}
