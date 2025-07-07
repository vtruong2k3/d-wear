// src/redux/features/authenSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import toast from "react-hot-toast";

import {
  loginAPI,
  loginWithGoogle,
  registerAPI,
} from "../../services/authService";
import type { ErrorType } from "../../types/error/IError";
import type {
  AuthState,
  LoginFormData,
  RegisterFormData,
  User,
} from "../../types/auth/IAuth";
import type { AppThunkAPI } from "../store";
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
export const doLoginWithGoogle = createAsyncThunk<
  { user: User; token: string },
  { accessToken: string }, // argument type (accessToken)
  {
    extra: AppThunkAPI["extra"]; // 👈 khai báo kiểu extra
    rejectValue: string;
  }
>("auth/googleLogin", async ({ accessToken }, { rejectWithValue, extra }) => {
  try {
    extra.setLoading?.(true);
    const res = await loginWithGoogle(accessToken);

    const { user, token } = res;
    const message = res.message || "Đăng nhập Google thành công!";

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
  } finally {
    extra.setLoading?.(false);
  }
});

// ✅ Async đăng ký
export const doRegister = createAsyncThunk<
  { user: User }, // return
  RegisterFormData, // input
  { rejectValue: string }
>("auth/register", async (formData, { rejectWithValue }) => {
  try {
    const res = await registerAPI(formData);
    return { user: res.data };
  } catch (error) {
    const errorMessage =
      (error as ErrorType).response?.data?.message ||
      (error as ErrorType).message ||
      "Đã xảy ra lỗi, vui lòng thử lại.";

    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});
export const doLogin = createAsyncThunk<
  { user: User; token: string },
  LoginFormData,
  { rejectValue: string }
>("authen/doLogin", async (payload, { rejectWithValue }) => {
  try {
    const res = await loginAPI(payload);
    localStorage.setItem("token", res.token);
    const message = res.message || "Đăng nhập thành công!";
    toast.success(message);
    return {
      user: res.user,
      token: res.token,
    };
  } catch (error) {
    const errorMessage =
      (error as ErrorType).response?.data?.message ||
      (error as ErrorType).message ||
      "Đã xảy ra lỗi, vui lòng thử lại.";

    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});
// ✅ Slice
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
