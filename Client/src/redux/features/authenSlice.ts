// src/redux/features/authenSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import { loginWithGoogle } from "../../services/authService";
import type { ErrorType } from "../../types/error/IError";
import type { AuthState } from "../../types/auth/IAuth";

// Interface người dùng

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

// ✅ AsyncThunk: login với Google bằng access_token
export const doLoginWithGoogle = createAsyncThunk(
  "auth/googleLogin",
  async (accessToken: string, { rejectWithValue }) => {
    try {
      const res = await loginWithGoogle(accessToken);

      const { user, token } = res;
      const message = res.message || "Đăng nhập Google thành công!";

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      toast.success(message);
      return { user, token };
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";

      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// ✅ Slice
export const authenSlice = createSlice({
  name: "authen",
  initialState,
  reducers: {
    doRegister: (
      state,
      action: PayloadAction<{ username: string; email: string }>
    ) => {
      const { username, email } = action.payload;
      const user = { _id: "fake_id", username, email, role: "user" };

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", "fake_token");

      state.user = user;
      state.token = "fake_token";
      state.isLogin = true;
      state.error = null;

      toast.success("Đăng ký thành công!");
    },

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
  },
});

export const { doRegister, doLogout } = authenSlice.actions;
export default authenSlice.reducer;
