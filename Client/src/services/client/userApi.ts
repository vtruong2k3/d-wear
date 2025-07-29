import axios from "axios";

export const fetchUpdateUserProfile = async (formData: FormData) => {
  const res = await axios.put("/api/users/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
export const fetchAllUsers = async (page = 1, limit = 10) => {
  const res = await axios.get(`/api/users?page=${page}&limit=${limit}`);
  return res.data.users; // trả về mảng user
};
export const fetchUserById = async (id: string) => {
  const res = await axios.get(`/api/users/${id}`);
  return res.data; // trả về { user, addresses }
};
