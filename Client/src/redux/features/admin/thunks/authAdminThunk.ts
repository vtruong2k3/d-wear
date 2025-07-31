import { createAsyncThunk } from "@reduxjs/toolkit";
import type { LoginFormValues } from "../../../../types/auth/IAuth";
import { loginAdminAPI } from "../../../../services/admin/authAPI";

import type { ErrorType } from "../../../../types/error/IError";

import { getUserInfo } from "../../../../services/client/authService";
import { message } from "antd";

export const doLoginAdmin = createAsyncThunk(
  "authAdmin/login",
  async (data: LoginFormValues, { rejectWithValue }) => {
    try {
      const res = await loginAdminAPI(data);

      localStorage.setItem("token", res.token);

      message.success(res.message);

      return res;
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      message.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);
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

      message.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);
