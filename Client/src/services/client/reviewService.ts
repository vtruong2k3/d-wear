import axios from "axios";

export const createReviewProduct = async (formData: FormData) => {
  const res = await axios.post("/api/review", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const fetcheGetRivew = async (id: string | undefined) => {
  const res = await axios.get(`/api/review/${id}`);
  return res.data;
};
