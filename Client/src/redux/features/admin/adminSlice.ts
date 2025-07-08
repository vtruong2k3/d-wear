import { createSlice } from "@reduxjs/toolkit";
import type { AuthState } from "../../../types/auth/IAuth";

import { doLoginAdmin } from "./thunks/authAdminThunk";
import { toast } from "react-toastify";

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

const authAdminSlice = createSlice({
  name: "authAdmin",
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      state.user = null;
      state.token = null;
      state.isLogin = false;
      state.error = null;
      state.loading = false;

      toast.success("Đăng suất thành công");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(doLoginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(doLoginAdmin.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isLogin = true;
          state.loading = false;
        }
      })
      .addCase(doLoginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isLogin = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { logout } = authAdminSlice.actions;
export default authAdminSlice.reducer;
