import axios from "axios";

const apiServiceProduct = {
  getAllProducts: async (params = {}) => {
    return await axios.get(`/api/product`, { params });
  },
  getDetailProduct: async (_id: string) => {
    return await axios.get(`/api/product/${_id}`);
  },
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
