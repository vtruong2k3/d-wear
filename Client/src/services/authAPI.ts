import axios from "axios";

export const loginAdminAPI = async (email: string, password: string) => {
  const res = await axios.post("/api/admin/auth/login", {
    email,
    password,
  });
  return res.data;
};
