import { configureStore } from "@reduxjs/toolkit";
import listReducer from "./Slices/listSlice";

const store = configureStore({
  reducer: listReducer,
});

export default store;