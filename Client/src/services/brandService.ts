import axios from "axios";
import type { IBrand } from "../types/brand/IBrand";
export const fetchAllBrands = async (): Promise<IBrand[]> => {
  const res = await axios.get("/api/brand");
  return Array.isArray(res.data) ? res.data : res.data.data || [];
};

export const fetchCreateBrand = async (data: { brand_name: string }) => {
  return axios.post("/api/brand", data);
};

export const updateBrandById = async (
  id: string,
  data: { brand_name: string }
) => {
  return axios.put(`/api/brand/${id}`, data);
};

export const deleteBrandById = async (id: string) => {
  return axios.delete(`/api/brand/${id}`);
};
