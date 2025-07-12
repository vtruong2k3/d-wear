import { createAsyncThunk } from "@reduxjs/toolkit";
import type { LoginFormValues } from "../../../../types/auth/IAuth";
import { loginAdminAPI } from "../../../../services/admin/authAPI";

import type { ErrorType } from "../../../../types/error/IError";
import { toast } from "react-toastify";

export const doLoginAdmin = createAsyncThunk(
  "authAdmin/login",
  async (data: LoginFormValues, { rejectWithValue }) => {
    try {
      const res = await loginAdminAPI(data);

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      toast.success(res.message);

      return res;
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
