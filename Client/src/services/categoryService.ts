import axios from "axios";
import type { ICategory } from "../types/category/ICategory";

export const fetchGetAllCategory = async (): Promise<ICategory[]> => {
  const res = await axios.get("/api/category");
  return res.data.data; // <- nếu dữ liệu nằm trong "data"
};

export const deleteCategoryById = async (id: string) => {
  return axios.delete(`/api/category/${id}`);
};
export const fetchCreateCategory = async (data: { category_name: string }) => {
  return axios.post("/api/category", data);
};
export const updateCategoryById = async (
  id: string,
  data: { category_name: string }
) => {
  return axios.put(`/api/category/${id}`, data);
};
