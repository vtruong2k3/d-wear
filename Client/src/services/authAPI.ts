import axios from "axios";
import type { LoginFormValues } from "../types/auth/IAuth";

export const loginAdminAPI = async (data: LoginFormValues) => {
  const res = await axios.post("/api/admin/auth/login", data);

  return res.data; // { token, message }
};
