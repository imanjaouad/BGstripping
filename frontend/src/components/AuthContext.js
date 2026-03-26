import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────
// AUTH + THEME CONTEXT  (à placer dans src/context/)
// ─────────────────────────────────────────────────────────
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // ── Thème ──────────────────────────────────────────────
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);          // persiste entre sessions
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  // ── Auth ───────────────────────────────────────────────
  const [user, setUser] = useState(() => {
<<<<<<< HEAD
    // Restaure la session depuis localStorage ou sessionStorage au rechargement
    const saved = localStorage.getItem("user") || sessionStorage.getItem("user");
=======
<<<<<<< HEAD
    // Restaure la session depuis localStorage au rechargement
    const saved = localStorage.getItem("user");
=======
    // Restaure la session depuis localStorage ou sessionStorage au rechargement
    const saved = localStorage.getItem("user") || sessionStorage.getItem("user");
>>>>>>> main
>>>>>>> clean-IMANE
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    // navigate("/login") sera appelé depuis le composant via useAuth
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, theme, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personnalisé
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans <AuthProvider>");
  return ctx;
};
