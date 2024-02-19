import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setLoading: (state) => {
      return { ...state, isLoading: true };
    },
    unSetLoading: (state) => {
      return { ...state, isLoading: false };
    },
  },
});
export default loadingSlice.reducer;
export const { setLoading, unSetLoading } = loadingSlice.actions;
