import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedCompany: {
    id: 0,
    name: "",
  },
};

const replySlice = createSlice({
  name: "reply",
  initialState,
  reducers: {
    updateCompany: (state, action) => {
      return { ...state, selectedCompany: action.payload.selectedCompany };
    },
  },
});
export default replySlice.reducer;
export const { updateCompany } = replySlice.actions;
