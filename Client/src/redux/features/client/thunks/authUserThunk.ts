import toast from "react-hot-toast";
import type { ErrorType } from "../../../../types/error/IError";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  LoginFormData,
  RegisterFormData,
  User,
} from "../../../../types/auth/IAuth";
import {
  getUserInfo,
  loginAPI,
  loginWithGoogle,
  registerAPI,
} from "../../../../services/client/authService";
import type { AppThunkAPI } from "../../../store";

//  AsyncThunk: login với Google bằng access_token
export const doLoginWithGoogle = createAsyncThunk<
  { user: User; token: string },
  { accessToken: string }, // argument type (accessToken)
  {
    extra: AppThunkAPI["extra"];
    rejectValue: string;
  }
>("auth/googleLogin", async ({ accessToken }, { rejectWithValue, extra }) => {
  try {
    extra.setLoading?.(true);
    const res = await loginWithGoogle(accessToken);

    const { user, token } = res;

    localStorage.setItem("token", token);

    const message = res.message || "Đăng nhập Google thành công!";

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

//  Async đăng ký
export const doRegister = createAsyncThunk<
  { user: User },
  RegisterFormData,
  { rejectValue: string }
>("auth/register", async (formData, { rejectWithValue }) => {
  try {
    const res = await registerAPI(formData);
    toast.success(res.message);
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
// Lấy user từ token
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUserInfo();
      return res.user;
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
