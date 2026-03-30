import { configureStore } from "@reduxjs/toolkit";
import poussageReducer  from "../features/poussageSlice";
import casementReducer  from "../features/casementSlice";
import transportReducer from "../features/transportSlice";
export const store = configureStore({
  reducer: {
    poussage:  poussageReducer,
    casement:  casementReducer,
    transport: transportReducer,
  },
});