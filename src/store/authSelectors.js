// src/store/authSelectors.js
// ─────────────────────────────────────────────────────────
// SELECTORS — accès propre au state Redux dans les composants
//
// Usage :
//   const user  = useSelector(selectUser);
//   const theme = useSelector(selectTheme);
// ─────────────────────────────────────────────────────────

export const selectUser            = (state) => state.auth.user;
export const selectToken           = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectTheme           = (state) => state.auth.theme;
