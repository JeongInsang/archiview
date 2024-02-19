import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  role: "",
  userId: "",
  profile: "",
  accessToken: "",
};

const userSlice = createSlice({
  name: "user", // 액션 생성 함수의 앞에 부분 'user/NICKNAME' 의 login 부분
  initialState,
  reducers: {
    userLogin: (state, action) => {
      return {
        ...state,
        isLoggedIn: true,
        accessToken: action.payload.accessToken,
        role: action.payload.role,
        userId: action.payload.userId,
        profile: action.payload.profile,
      };
    },
    userLogout: (state) => {
      return {
        ...state,
        isLoggedIn: false,
        accessToken: "",
        profile: "",
        userId: "",
        role: "",
      };
    },
    updateProfile: (state, action) => {
      return { ...state, profile: action.payload.profile };
    },
  },
});
export default userSlice.reducer;
export const { userLogin, userLogout, updateProfile } = userSlice.actions;
