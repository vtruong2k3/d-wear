import axios from "axios";
import type { IBrand } from "../../types/brand/IBrand";

export const fetchAllBrands = async (): Promise<IBrand[]> => {
  const res = await axios.get("/api/brand");
  return res.data.data;
};
