import { createSlice } from "@reduxjs/toolkit";

const listSlice = createSlice({
  name: "list",
  initialState: {
    items: [], // Boş bir liste
  },
  reducers: {
    setList: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { setList } = listSlice.actions;
export default listSlice.reducer;