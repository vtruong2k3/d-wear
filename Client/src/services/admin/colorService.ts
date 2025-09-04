import axios from "axios";
import type { ColorRespone, GetColorsResponse } from "../../types/color/IColor";

//  Lấy danh sách màu sắc có phân trang
export const getAllColors = async (
  page = 1,
  limit = 10
): Promise<GetColorsResponse> => {
  const res = await axios.get<GetColorsResponse>(
    `/api/colors?page=${page}&limit=${limit}`
  );
  return res.data;
};
export const getColors = async () => {
  const res = await axios.get("/api/colors/items");
  return res.data; // trả về danh sách color
};
//  Thêm màu sắc mới
export const createColor = async (
  color_name: string
): Promise<ColorRespone> => {
  const res = await axios.post(`/api/colors`, { color_name });
  return res.data;
};

// ✅ Cập nhật màu sắc
export const updateColor = async (
  id: string,
  color: { color_name: string }
): Promise<ColorRespone> => {
  const res = await axios.put(`/api/colors/${id}`, color);
  return res.data;
};

// ✅ Xoá màu sắc
export const deleteColor = async (id: string) => {
  const res = await axios.delete(`/api/colors/${id}`);
  return res.data;
};
