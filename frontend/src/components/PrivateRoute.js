import { Navigate } from "react-router-dom";

/**
 * PrivateRoute — protège les routes qui nécessitent une authentification.
 * Si aucun token n'est présent, redirige vers /login.
 * Si adminOnly est true, vérifie aussi que le rôle est 'admin'.
 */
export default function PrivateRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");

  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly) {
    try {
      const user = JSON.parse(userStr);
      if (user.role !== "admin") {
        return <Navigate to="/" replace />;
      }
    } catch {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}
