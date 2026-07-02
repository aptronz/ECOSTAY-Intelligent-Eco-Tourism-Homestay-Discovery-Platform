import { destinations } from "../data/catalogData.js";

export function findAllDestinations() {
  return [...destinations].sort((first, second) => first.name.localeCompare(second.name));
}
