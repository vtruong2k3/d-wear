import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
// ✅ Định nghĩa kiểu UserType
export interface UserType {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "banned";
  createdAt: string;
  phone?: string;
}

interface UserState {
  users: UserType[];
  loading: boolean;
  selectedUser: UserType | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  selectedUser: null,
};

// ✅ MOCK DATA có kiểu trả về rõ ràng để tránh lỗi type
export const fetchUsers = createAsyncThunk<UserType[]>(
  "admin/user/fetchUsers",
  async () => {
    return [
      {
        _id: "1",
        name: "Nguyễn văn A",
        email: "a@gmail.com",
        role: "user",
        status: "active", // đúng kiểu
        createdAt: new Date().toISOString(),
        phone: "0909123456",
      },
      {
        _id: "2",
        name: "Trần Thị B",
        email: "b@gmail.com",
        role: "admin",
        status: "banned", // đúng kiểu
        createdAt: new Date().toISOString(),
      },
    ];
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchUsers.fulfilled,
        (state, action: PayloadAction<UserType[]>) => {
          state.loading = false;
          state.users = action.payload;
        }
      )
      .addCase(fetchUsers.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { selectUser, clearSelectedUser } = userSlice.actions;
export default userSlice.reducer;
