// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    // Ajoutez d'autres reducers ici si besoin
    // operations: operationsReducer,
  },
});

export default store;
