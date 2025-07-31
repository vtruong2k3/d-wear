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

  // 🔍 Gợi ý tìm kiếm sản phẩm theo từ khóa
  searchProducts: async (params: { keyword: string }) => {
    return await axios.get(`/api/product/search`, { params });
  },

  getProductRelated: async (categoryId?: string, productId?: string) => {
    if (!categoryId) {
      throw new Error("categoryId is required");
    }

    const query = productId ? `?productId=${productId}` : "";

    const res = await axios.get(`/api/product/related/${categoryId}${query}`);
    return res.data;
  },
};

export default apiServiceProduct;
