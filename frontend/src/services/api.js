// ─── API Service ─────────────────────────────────────────────────────────────
// Centralized fetch wrapper for communicating with the Laravel backend.
// Base URL matches the `php artisan serve` default.

const BASE_URL = "http://127.0.0.1:8000/api";

function getAuthToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const token = getAuthToken();
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  // Parse JSON body (even for errors, Laravel returns JSON validation messages)
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.message || data?.error || `Erreur HTTP ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ─── Poussages ────────────────────────────────────────────────────────────────

export function fetchPoussagesAPI() {
  return request("/poussages");
}

export function createPoussageAPI(payload) {
  return request("/poussages", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updatePoussageAPI(id, payload) {
  return request(`/poussages/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deletePoussageAPI(id) {
  return request(`/poussages/${id}`, {
    method: "DELETE",
  });
}

// ─── Casements ────────────────────────────────────────────────────────────────

export function fetchCasementsAPI() {
  return request("/casements");
}

export function createCasementAPI(payload) {
  return request("/casements", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateCasementAPI(id, payload) {
  return request(`/casements/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteCasementAPI(id) {
  return request(`/casements/${id}`, {
    method: "DELETE",
  });
}

// ─── Machines ─────────────────────────────────────────────────────────────────

export function fetchMachinesAPI() {
  return request("/machines");
}

export function createMachineAPI(payload) {
  return request("/machines", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ─── Transport Journaliers ─────────────────────────────────────────────────────

export function fetchTransportJournaliersAPI(date = null) {
  const qs = date ? `?date=${date}` : "";
  return request(`/transport-journaliers${qs}`);
}

export function createTransportJournalierAPI(payload) {
  return request("/transport-journaliers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateTransportJournalierAPI(id, payload) {
  return request(`/transport-journaliers/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteTransportJournalierAPI(id) {
  return request(`/transport-journaliers/${id}`, {
    method: "DELETE",
  });
}


