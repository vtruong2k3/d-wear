import axios from "axios";
import type { GetSizesResponse, SizeResponse } from "../../types/size/ISize";

/**
 * Lấy danh sách size với phân trang
 */
export const getAllSizes = async (
  page = 1,
  limit = 10
): Promise<GetSizesResponse> => {
  const res = await axios.get<GetSizesResponse>(
    `/api/sizes?page=${page}&limit=${limit}`
  );
  return res.data;
};

/**
 * Thêm mới một size
 */
export const createSize = async (size_name: string): Promise<SizeResponse> => {
  const res = await axios.post(`/api/sizes`, { size_name });
  return res.data;
};

/**
 * Cập nhật size theo ID
 */
export const updateSize = async (
  id: string,
  size: { size_name: string }
): Promise<SizeResponse> => {
  const res = await axios.put(`/api/sizes/${id}`, size);
  return res.data;
};

/**
 * Xoá size theo ID
 */
export const deleteSize = async (id: string): Promise<{ message: string }> => {
  const res = await axios.delete(`/api/sizes/${id}`);
  return res.data;
};
