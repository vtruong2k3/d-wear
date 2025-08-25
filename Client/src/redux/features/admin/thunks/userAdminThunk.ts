import { createAsyncThunk } from "@reduxjs/toolkit";

import { fetchUserById } from "../../../../services/admin/userServices";

export const getUserDetail = createAsyncThunk(
  "admin/user/getUserDetail",
  async (userId: string) => {
    const res = await fetchUserById(userId);
    return res; // { user, addresses }
  }
);
