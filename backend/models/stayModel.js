import { stays } from "../data/catalogData.js";

const sortableFields = new Set(["price", "rating", "score", "reviews", "name"]);

export function findAllStays({ minScore, maxPrice, location, sortBy = "score" } = {}) {
  let results = [...stays];

  if (Number.isFinite(minScore)) {
    results = results.filter((stay) => stay.score >= minScore);
  }

  if (Number.isFinite(maxPrice)) {
    results = results.filter((stay) => stay.price <= maxPrice);
  }

  if (location) {
    const normalizedLocation = location.toLowerCase();
    results = results.filter((stay) => stay.location.toLowerCase().includes(normalizedLocation));
  }

  if (sortableFields.has(sortBy)) {
    results.sort((first, second) => {
      if (typeof first[sortBy] === "string") return first[sortBy].localeCompare(second[sortBy]);
      return second[sortBy] - first[sortBy];
    });
  }

  return results;
}

export function findStayById(id) {
  return stays.find((stay) => stay.id === id);
}

export function searchStays(query) {
  const normalizedQuery = query.trim().toLowerCase();

  return stays.filter((stay) =>
    [stay.name, stay.location, stay.tag, stay.description]
      .some((value) => value.toLowerCase().includes(normalizedQuery)),
  );
}

export function createStay(stay) {
  stays.push(stay);
  return stay;
}

export function updateStay(id, updates) {
  const stay = findStayById(id);
  if (!stay) return null;

  Object.assign(stay, updates, { id });
  return stay;
}

export function deleteStay(id) {
  const index = stays.findIndex((stay) => stay.id === id);
  if (index === -1) return false;

  stays.splice(index, 1);
  return true;
}
