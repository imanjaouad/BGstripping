// src/store/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

// ─────────────────────────────────────────────────────────
// STATE INITIAL
// ─────────────────────────────────────────────────────────
const initialState = {
  // Auth
  user:  JSON.parse(localStorage.getItem("user"))  || null,
  token: localStorage.getItem("token")             || null,
  isAuthenticated: !!localStorage.getItem("token"),

  // Thème
  theme: localStorage.getItem("theme") || "dark",
};

// ─────────────────────────────────────────────────────────
// SLICE
// ─────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    // ── Login ──────────────────────────────────────────────
    loginSuccess: (state, action) => {
      const { user, token } = action.payload;
      state.user            = user;
      state.token           = token;
      state.isAuthenticated = true;

      // Persistance localStorage
      localStorage.setItem("user",  JSON.stringify(user));
      localStorage.setItem("token", token);
    },

    // ── Logout ─────────────────────────────────────────────
    logoutSuccess: (state) => {
      state.user            = null;
      state.token           = null;
      state.isAuthenticated = false;

      // Nettoyage localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },

    // ── Thème ──────────────────────────────────────────────
    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";

      // Persistance + application immédiate sur <html>
      localStorage.setItem("theme", state.theme);
      document.documentElement.setAttribute("data-theme", state.theme);
    },

    // Initialiser le thème au démarrage (appelé dans index.js)
    initTheme: (state) => {
      document.documentElement.setAttribute("data-theme", state.theme);
    },
  },
});

export const { loginSuccess, logoutSuccess, toggleTheme, initTheme } =
  authSlice.actions;

export default authSlice.reducer;
