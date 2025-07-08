import { createSlice } from "@reduxjs/toolkit";

import toast from "react-hot-toast";

import type { AuthState } from "../../../types/auth/IAuth";
import { doLogin, doLoginWithGoogle, doRegister } from "./thunks/authUserThunk";

// Lấy từ localStorage
const savedUser = localStorage.getItem("user");
const savedToken = localStorage.getItem("token");

const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken || null,
  isLogin: !!savedUser && !!savedToken,
  loading: false,
  error: null,
};

//  Slice
export const authenSlice = createSlice({
  name: "authen",
  initialState,
  reducers: {
    doLogout: (state) => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      state.user = null;
      state.token = null;
      state.isLogin = false;
      state.error = null;
      state.loading = false;

      toast.success("Đã đăng xuất!");
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(doLoginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(doLoginWithGoogle.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isLogin = true;
          state.loading = false;
        }
      })
      .addCase(doLoginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isLogin = false;
        state.user = null;
        state.token = null;
      });
    builder
      .addCase(doLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(doLogin.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isLogin = true;
          state.loading = false;
        }
      })
      .addCase(doLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isLogin = false;
        state.user = null;
        state.token = null;
      });
    builder
      .addCase(doRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(doRegister.fulfilled, (state, action) => {
        const user = action.payload.user;

        state.user = user;

        state.isLogin = true;
        state.loading = false;

        toast.success("Đăng ký thành công!");
      })
      .addCase(doRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Đăng ký thất bại";
        state.isLogin = false;
        toast.error(state.error);
      });
  },
});

export const { doLogout } = authenSlice.actions;
export default authenSlice.reducer;
