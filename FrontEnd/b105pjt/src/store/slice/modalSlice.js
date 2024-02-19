import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isModalOpen: false,
  isAlertOpen: false,
  alertMessage: "",
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state) => {
      return { ...state, isModalOpen: true };
    },
    closeModal: (state) => {
      return { ...state, isModalOpen: false };
    },
    openAlert: (state, action) => {
      return {
        ...state,
        isAlertOpen: true,
        alertMessage: action.payload.message,
      };
    },
    closeAlert: (state) => {
      return { ...state, isAlertOpen: false };
    },
  },
});
export default modalSlice.reducer;
export const { openModal, closeModal, openAlert, closeAlert } =
  modalSlice.actions;
