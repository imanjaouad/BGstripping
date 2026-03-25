/**
 * Auth utility — helpers for reading the current user from storage.
 */

export function getCurrentUser() {
  const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Returns true when the logged-in user is an admin */
export function isAdmin() {
  const user = getCurrentUser();
  return user?.role === "admin";
}
