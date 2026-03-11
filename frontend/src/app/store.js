import { configureStore } from "@reduxjs/toolkit";
import poussageReducer from "../features/poussageSlice";

export const store = configureStore({
  reducer: {
    poussage: poussageReducer
  }
});