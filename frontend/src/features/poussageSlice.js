import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: []
};

const poussageSlice = createSlice({
  name: "poussage",
  initialState,
  reducers: {
    addPoussage: (state, action) => {
      state.list.push(action.payload);
    },
    deletePoussage: (state, action) => {
      state.list.splice(action.payload, 1);
    },
    updatePoussage: (state, action) => {
      const { index, data } = action.payload;
      if (state.list[index]) {
        state.list[index] = data; // met à jour seulement cet élément
      }
    }
  }
});

export const { addPoussage, deletePoussage, updatePoussage } = poussageSlice.actions;
export default poussageSlice.reducer;