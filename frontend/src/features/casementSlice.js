import { createSlice } from "@reduxjs/toolkit";

const casementSlice = createSlice({
  name: "casement",
  initialState: {
    list: [],
  },
  reducers: {
    addCasement: (state, action) => {
      state.list.push(action.payload);
    },
    updateCasement: (state, action) => {
      const { index, data } = action.payload;
      state.list[index] = data;
    },
    deleteCasement: (state, action) => {
      state.list.splice(action.payload, 1);
    },
  },
});

export const { addCasement, updateCasement, deleteCasement } = casementSlice.actions;
export default casementSlice.reducer;
