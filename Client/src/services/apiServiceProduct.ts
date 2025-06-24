import axios from "axios";
// @ts-ignore
import {
  API_GET_ALL_PRODUCTS,
  API_GET_DETAIL_PRODUCT,
  API_GET_PRODUCT_BY_A_CATEGORY,
} from "../utils/constants/api";

const apiServiceProduct = {
  getAllProducts: async (params) => {
    return await axios.get(`${API_GET_ALL_PRODUCTS}/search?`, {
      params,
    });
  },
  getDetailProduct: async (id) => {
    return await axios.get(`${API_GET_DETAIL_PRODUCT}/${id}`);
  },
  getProdductsByCategory: async (category) => {
    return await axios.get(`${API_GET_PRODUCT_BY_A_CATEGORY}/${category}`);
  },
};

export default apiServiceProduct;
