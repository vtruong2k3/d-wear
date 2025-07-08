import axios from "axios";

const apiServiceProduct = {
  getAllProducts: async (params = {}) => {
    return await axios.get(`/api/product`, { params });
  },
  getDetailProduct: async (_id: string | undefined) => {
    const res = await axios.get(`/api/product/${_id}`);
    return res.data;
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
