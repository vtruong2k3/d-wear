import axios from "axios";
import type { IUsers, UserType } from "../../types/IUser";

export interface Meta {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  total: number;
  hasPrev: boolean;
  hasNext: boolean;
  sortBy: string;
  order: "asc" | "desc";
}

export interface Filters {
  q: string | null;
  role: string | null;
  roles: string[] | null;
  status: string | null;
  isActive: boolean | null;
}

export interface UserListResponse {
  meta: Meta;
  filters: Filters;
  data: IUsers[];
}

export const fetchAllUsers = async (
  page: number,
  limit: number,
  options?: {
    q?: string;
    role?: "user" | "admin";
    status?: "active" | "inactive";
    sortBy?: string;
    order?: "asc" | "desc";
  }
): Promise<UserListResponse> => {
  const params: Record<string, string | number | boolean | undefined> = {
    page,
    limit,
  };

  if (options?.q) params.q = options.q.trim();
  if (options?.role) params.role = options.role;
  if (options?.status) params.status = options.status;
  if (options?.sortBy) params.sortBy = options.sortBy;
  if (options?.order) params.order = options.order;

  const res = await axios.get<UserListResponse>("/api/users", { params });
  return res.data;
};

export const fetchUserById = async (id: string) => {
  const res = await axios.get(`/api/users/${id}`);
  return res.data;
};

export async function createUser(formdata: FormData) {
  const { data } = await axios.post<{ message: string; data: UserType }>(
    "/api/users",
    formdata,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
}

export async function updateUser(id: string | undefined, formdata: FormData) {
  const { data } = await axios.put<{ message: string; data: UserType }>(
    `/api/users/${id}`,
    formdata,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
}
