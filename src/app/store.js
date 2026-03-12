import { configureStore } from "@reduxjs/toolkit";
import poussageReducer from "../features/poussageSlice";
import casementReducer from "../features/casementSlice";

export const store = configureStore({
  reducer: {
    poussage: poussageReducer,
    casement :casementReducer,
  }
});