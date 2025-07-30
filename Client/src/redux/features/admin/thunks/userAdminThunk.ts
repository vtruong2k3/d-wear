import { createAsyncThunk } from "@reduxjs/toolkit";
import type { UserType } from "../../../../types/IUser";
import {
  fetchAllUsers,
  fetchUserById,
} from "../../../../services/admin/userServices";
interface FetchUsersParams {
  page: number;
  limit: number;
}

interface FetchUsersResponse {
  users: UserType[];
  total: number;
  totalPages: number;
  currentPage: number;
}
export const fetchUsers = createAsyncThunk<
  FetchUsersResponse,
  FetchUsersParams
>("admin/user/fetchUsers", async ({ page, limit }) => {
  const response = await fetchAllUsers(page, limit);
  return response;
});

export const getUserDetail = createAsyncThunk(
  "admin/user/getUserDetail",
  async (userId: string) => {
    const res = await fetchUserById(userId);
    return res; // { user, addresses }
  }
);
