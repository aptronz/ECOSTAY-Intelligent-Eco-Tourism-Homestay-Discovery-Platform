const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

async function requestJson(path, { signal, method = "GET", body } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    signal,
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.message || `API request failed with status ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export async function fetchCatalog(signal) {
  const [properties, destinations, experiences] = await Promise.all([
    requestJson("/api/stays", { signal }),
    requestJson("/api/destinations", { signal }),
    requestJson("/api/experiences", { signal }),
  ]);

  return { properties, destinations, experiences };
}

export function searchStays(query, signal) {
  return requestJson(`/api/stays/search?q=${encodeURIComponent(query)}`, { signal });
}

export function createBooking(booking) {
  return requestJson("/api/bookings", {
    method: "POST",
    body: booking,
  });
}
