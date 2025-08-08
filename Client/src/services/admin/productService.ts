import axios from "axios";
import type { ProductDetailResponse } from "../../types/IProducts";

export const getDetailProduct = async (_id: string | undefined) => {
  const res = await axios.get(`/api/product/${_id}`);
  return res.data;
};
export const updateProduct = async (
  id: string | undefined,
  formData: FormData
) => {
  const { data } = await axios.put(`/api/product/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const createProduct = async (formData: FormData) => {
  const { data } = await axios.post("/api/product", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};
//xóa mềm
export const softDeleteProduct = async (id: string) => {
  const { data } = await axios.put(`/api/product/${id}/soft-delete`, {
    isDeleted: true,
  });
  return data;
};

//khôi phục sản phẩm xóa mềm
export const restoreProduct = async (id: string) => {
  const { data } = await axios.put(`/api/product/${id}/soft-delete`, {
    isdeleted: false,
  });
  return data;
};
// lấy danh sách xóa mềm
export const getDeletedProducts = async (params = {}) => {
  const { data } = await axios.get("/api/product/deleted", { params });
  return data;
};

export const getDetailProductAdmin = async (
  id: string | undefined,
  limit: number,
  page: number
): Promise<ProductDetailResponse> => {
  const res = await axios.get(`/api/product/${id}`, {
    params: { limit, page },
  });
  return res.data;
};
