import axios from "axios";
import type { ICategory } from "../../types/category/ICategory";

export const fetchGetAllCategory = async (): Promise<ICategory[]> => {
  const res = await axios.get("/api/category");
  return res.data.data; // <- nếu dữ liệu nằm trong "data"
};
