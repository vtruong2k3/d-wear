import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";


// ✅ Định nghĩa kiểu UserType với isDeleted
export interface UserType {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "banned";
  createdAt: string;
  phone?: string;
  isDeleted?: boolean; // Thêm field xóa mềm
}

// ✅ Định nghĩa kiểu AddressType
interface AddressType {
  _id: string;
  user_id: string;
  name: string;
  phone: string;
  provinceName: string;
  districtName: string;
  wardName: string;
  detailAddress: string;
  fullAddress: string;
  isDefault: boolean;
  createdAt: string;
}

interface UserState {
  users: UserType[];
  loading: boolean;
  selectedUser: UserType | null;
  userAddresses: AddressType[];
  addressLoading: boolean;
}

const initialState: UserState = {
  users: [],
  loading: false,
  selectedUser: null,
  userAddresses: [],
  addressLoading: false,
};

// ✅ MOCK DATA có kiểu trả về rõ ràng với isDeleted
export const fetchUsers = createAsyncThunk<UserType[]>(
  "admin/user/fetchUsers",
  async () => {
    return [
      {
        _id: "1",
        name: "Nguyễn văn A",
        email: "a@gmail.com",
        role: "user",
        status: "active",
        createdAt: new Date().toISOString(),
        phone: "0909123456",
        isDeleted: false,
      },
      {
        _id: "2",
        name: "Trần Thị B",
        email: "b@gmail.com",
        role: "admin",
        status: "banned",
        createdAt: new Date().toISOString(),
        phone: "0908765432",
        isDeleted: false,
      },
      {
        _id: "3",
        name: "Lê Văn C",
        email: "c@gmail.com",
        role: "user",
        status: "active",
        createdAt: new Date().toISOString(),
        phone: "0907654321",
        isDeleted: true, // User đã bị xóa mềm
      },
    ];
  }
);

// ✅ Fetch địa chỉ của user
export const fetchUserAddresses = createAsyncThunk<AddressType[], string>(
  "admin/user/fetchUserAddresses",
  async (userId: string) => {
    // Mock địa chỉ
    const mockAddresses: AddressType[] = [
      {
        _id: "addr1",
        user_id: "1",
        name: "Nguyễn Văn A",
        phone: "0909123456",
        provinceName: "Hà Nội",
        districtName: "Ba Đình",
        wardName: "Phúc Xá",
        detailAddress: "123 Đường ABC",
        fullAddress: "123 Đường ABC, Phúc Xá, Ba Đình, Hà Nội",
        isDefault: true,
        createdAt: new Date().toISOString(),
      },
      {
        _id: "addr2",
        user_id: "1",
        name: "Nguyễn Văn A (Công ty)",
        phone: "0909123456",
        provinceName: "Hà Nội",
        districtName: "Hoàn Kiếm",
        wardName: "Tràng Tiền",
        detailAddress: "456 Phố Tràng Tiền",
        fullAddress: "456 Phố Tràng Tiền, Tràng Tiền, Hoàn Kiếm, Hà Nội",
        isDefault: false,
        createdAt: new Date().toISOString(),
      },
      {
        _id: "addr3",
        user_id: "2",
        name: "Trần Thị B",
        phone: "0908765432",
        provinceName: "TP. Hồ Chí Minh",
        districtName: "Quận 1",
        wardName: "Phường Bến Nghé",
        detailAddress: "789 Nguyễn Huệ",
        fullAddress: "789 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
        isDefault: true,
        createdAt: new Date().toISOString(),
      },
    ];
    
    // Lọc địa chỉ theo user_id
    return mockAddresses.filter(addr => addr.user_id === userId);
  }
);

// ✅ Xóa mềm người dùng
export const softDeleteUser = createAsyncThunk<string, string>(
  "admin/user/softDeleteUser",
  async (userId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return userId;
  }
);

// ✅ Khôi phục người dùng
export const restoreUser = createAsyncThunk<string, string>(
  "admin/user/restoreUser",
  async (userId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
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
      .addCase(
        fetchUsers.fulfilled,
        (state, action: PayloadAction<UserType[]>) => {
          state.loading = false;
          state.users = action.payload;
        }
      )
      .addCase(fetchUsers.rejected, (state) => {
        state.loading = false;
      })
      
      // Fetch User Addresses
      .addCase(fetchUserAddresses.pending, (state) => {
        state.addressLoading = true;
      })
      .addCase(
        fetchUserAddresses.fulfilled,
        (state, action: PayloadAction<AddressType[]>) => {
          state.addressLoading = false;
          state.userAddresses = action.payload;
        }
      )
      .addCase(fetchUserAddresses.rejected, (state) => {
        state.addressLoading = false;
      })
      
      // Soft Delete User
      .addCase(
        softDeleteUser.fulfilled,
        (state, action: PayloadAction<string>) => {
          const userId = action.payload;
          const userIndex = state.users.findIndex(user => user._id === userId);
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
          const userIndex = state.users.findIndex(user => user._id === userId);
          if (userIndex !== -1) {
            state.users[userIndex].isDeleted = false;
          }
        }
      );
  },
});

export const { selectUser, clearSelectedUser } = userSlice.actions;
export default userSlice.reducer;