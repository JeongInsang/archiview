import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./slice/userSlice";
import replyReducer from "./slice/replySlice";
import loadingReducer from "./slice/loadingSlice";
import modalReducer from "./slice/modalSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    reply: replyReducer,
    loading: loadingReducer,
    modal: modalReducer,
  },
  devTools: true,
});
