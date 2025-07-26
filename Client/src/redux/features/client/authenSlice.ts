import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import type { AuthState } from "../../../types/auth/IAuth";
import {
  doLogin,
  doLoginWithGoogle,
  doRegister,
  fetchUserProfile,
} from "./thunks/authUserThunk";

// Lấy token từ localStorage, user sẽ được fetch sau
const savedToken = localStorage.getItem("token");

const initialState: AuthState = {
  user: null,
  token: savedToken || null,
  isLogin: !!savedToken,
  loading: false,
  error: null,
};

export const authenSlice = createSlice({
  name: "authen",
  initialState,
  reducers: {
    doLogout: (state) => {
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
      // Đăng nhập Google
      .addCase(doLoginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(doLoginWithGoogle.fulfilled, (state, action) => {
        const { token } = action.payload;
        localStorage.setItem("token", token);
        state.token = token;
        state.user = action.payload.user;
        state.isLogin = true;
        state.loading = false;
      })
      .addCase(doLoginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.token = null;
        state.user = null;
        state.isLogin = false;
        localStorage.removeItem("token");
      });

    builder
      // Đăng nhập thường
      .addCase(doLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(doLogin.fulfilled, (state, action) => {
        const { token } = action.payload;
        localStorage.setItem("token", token);
        state.token = token;
        state.user = action.payload.user;
        state.isLogin = true;
        state.loading = false;
      })
      .addCase(doLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.token = null;
        state.user = null;
        state.isLogin = false;
        localStorage.removeItem("token");
      });

    builder
      // Đăng ký
      .addCase(doRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(doRegister.fulfilled, (state, action) => {
        const { user } = action.payload;

        state.user = user;
        state.isLogin = true;
        state.loading = false;
      })
      .addCase(doRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Đăng ký thất bại";
        state.isLogin = false;
        toast.error(state.error);
        localStorage.removeItem("token");
      });

    builder
      // Lấy profile từ token
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;

        state.isLogin = true;
        state.loading = false;
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isLogin = false;
        localStorage.removeItem("token");
      });
  },
});

export const { doLogout } = authenSlice.actions;
export default authenSlice.reducer;
