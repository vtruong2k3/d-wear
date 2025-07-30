import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type { IAddress } from "../../../types/address/IAddress";
import type { UserType } from "../../../types/IUser";
import { fetchUsers, getUserDetail } from "./thunks/userAdminThunk";

interface UserState {
  users: UserType[];
  loading: boolean;
  selectedUser: UserType | null;
  userAddresses: IAddress[];
  addressLoading: boolean;
  total: number;
  currentPage: number;
  totalPages: number;
}

const initialState: UserState = {
  users: [],
  loading: false,
  selectedUser: null,
  userAddresses: [],
  addressLoading: false,
  total: 0,
  currentPage: 1,
  totalPages: 0,
};

//danh sách user

//
export const softDeleteUser = createAsyncThunk<string, string>(
  "admin/user/softDeleteUser",
  async (userId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    return userId;
  }
);

// ✅ Khôi phục người dùng
export const restoreUser = createAsyncThunk<string, string>(
  "admin/user/restoreUser",
  async (userId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    return userId;
  }
);

const userSlice = createSlice({
  name: "userAdmin",
  initialState,
  reducers: {
    selectUser: (state, action: PayloadAction<UserType>) => {
      state.selectedUser = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
      state.userAddresses = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.total = action.payload.total;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.loading = false;
      })

      // Fetch User Addresses
      .addCase(getUserDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload.user;
        state.userAddresses = action.payload.addresses;
      })
      .addCase(getUserDetail.rejected, (state) => {
        state.loading = false;
      })

      // Soft Delete User
      .addCase(
        softDeleteUser.fulfilled,
        (state, action: PayloadAction<string>) => {
          const userId = action.payload;
          const userIndex = state.users.findIndex(
            (user) => user._id === userId
          );
          if (userIndex !== -1) {
            state.users[userIndex].isDeleted = true;
          }
        }
      )

      // Restore User
      .addCase(
        restoreUser.fulfilled,
        (state, action: PayloadAction<string>) => {
          const userId = action.payload;
          const userIndex = state.users.findIndex(
            (user) => user._id === userId
          );
          if (userIndex !== -1) {
            state.users[userIndex].isDeleted = false;
          }
        }
      );
  },
});

export const { selectUser, clearSelectedUser } = userSlice.actions;
export default userSlice.reducer;
