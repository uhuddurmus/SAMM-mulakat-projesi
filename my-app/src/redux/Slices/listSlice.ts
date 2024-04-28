import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getList = createAsyncThunk("getList", async () => {
  const { data } = await axios.get("https://localhost:7009/api/Points");
  return data;
});

export const deleteItem = createAsyncThunk("deletePoint", async (itemId) => {
  const response = await axios.delete(
    `https://localhost:7009/api/Points/${itemId}`,
    {
      headers: {
        accept: "*/*",
      },
    }
  );
  return response.data;
});

export const addItem = createAsyncThunk("addPoint", async (requestData) => {
  const response = await axios.post(
    "https://localhost:7009/api/Points",
    requestData,
    {
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
    }
  );
  return response.data;
});

const listSlice = createSlice({
  name: "list",
  initialState: {
    items: [], // Boş bir liste
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getList.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.items = action.payload;
      })

  },
});

export default listSlice.reducer;
