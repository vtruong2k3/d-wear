import axios from "axios";

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
