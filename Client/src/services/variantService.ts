import axios from "axios";
import type { IVariants } from "../types/IVariants";
export const fetchAllVariants = async (): Promise<IVariants[]> => {
  const res = await axios.get("/api/variant");
  return Array.isArray(res.data) ? res.data : res.data.variants || [];
};

export const fetchCreateVariant = async (data: IVariants) => {
  return axios.post("/api/variant", data);
};

export const updateVariantById = async (id: string, data: IVariants) => {
  return axios.put(`/api/variant/${id}`, data);
};

export const deleteVariantById = async (id: string) => {
  return axios.delete(`/api/variant/${id}`);
};
