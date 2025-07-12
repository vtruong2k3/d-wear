import axios from "axios";

const apiServiceProduct = {
  getAllProducts: async (params = {}) => {
    return await axios.get(`/api/product`, { params });
  },
  // Lấy chi tiết sản phẩm + biến thể
  getDetailProduct: async (_id: string | undefined) => {
    const res = await axios.get(`/api/product/${_id}`);
    return res; // trả về cả status + data
  },

  // Lấy danh sách sản phẩm cùng category nhưng loại trừ sản phẩm hiện tại
  getProductsByCategory: async (categoryId: string, excludeId: string) => {
    return await axios.get(`/api/product`, {
      params: {
        category_id: categoryId,
        exclude_id: excludeId,
      },
    });
  },
};

export default apiServiceProduct;
