import { createSlice, type ActionReducerMapBuilder, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthStateAdmin } from "../../../types/auth/IAuth";
import { doLoginAdmin, fetchUserProfile } from "./thunks/authAdminThunk";
import { message } from "antd";
import { setAccessToken } from "../../../configs/AxiosConfig";



const initialState: AuthStateAdmin = {
  user: null,
  token: null,
  isLogin: false,
  loading: false,
  error: null,
  isInitialized: false, // 👈 NEW
};

const authAdminSlice = createSlice({
  name: "authAdmin",
  initialState,
  reducers: {
    logout(state) {
      setAccessToken(null);
      state.user = null;
      state.token = null;
      state.isLogin = false;
      state.error = null;
      state.loading = false;
      state.isInitialized = true; //  Đánh dấu đã xử lý
      message.success("Đăng xuất thành công");
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<AuthStateAdmin>) => {
    builder
      // Đăng nhập
      .addCase(doLoginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(doLoginAdmin.fulfilled, (state, action) => {
        const token = action.payload.token;
        state.token = token;
        state.isLogin = true;
        state.loading = false;
      })
      .addCase(doLoginAdmin.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload as string;
        state.token = null;
        state.user = null;
        state.isLogin = false;
      });

    // Lấy thông tin user
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLogin = true;
        state.loading = false;
        state.isInitialized = true; //  đánh dấu đã init
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        setAccessToken(null);
        state.token = null;
        state.user = null;
        state.isLogin = false;
        state.loading = false;
        state.isInitialized = true;
      });
  },
});

export const { logout } = authAdminSlice.actions;
export default authAdminSlice.reducer;
