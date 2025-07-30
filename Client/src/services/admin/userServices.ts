import axios from "axios";
import type { UserType } from "../../types/IUser";

export const fetchAllUsers = async (page: number, limit: number) => {
  const res = await axios.get(`/api/users?page=${page}&limit=${limit}`);
  return res.data as {
    users: UserType[];
    total: number;
    totalPages: number;
    currentPage: number;
  };
};
export const fetchUserById = async (id: string) => {
  const res = await axios.get(`/api/users/${id}`);
  return res.data; // trả về { user, addresses }
};
