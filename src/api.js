async function getJson(path, signal) {
  const response = await fetch(path, { signal });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json();
}

export async function fetchCatalog(signal) {
  const [properties, destinations, experiences] = await Promise.all([
    getJson("/api/stays", signal),
    getJson("/api/destinations", signal),
    getJson("/api/experiences", signal),
  ]);

  return { properties, destinations, experiences };
}
