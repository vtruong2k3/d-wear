import axios from "axios";
import type { LoginFormValues, LoginResponse } from "../types/auth/IAuth";

export const loginAdminAPI = async (
  data: LoginFormValues
): Promise<LoginResponse> => {
  const res = await axios.post("/api/admin/auth/login", data);

  return res.data; // { token, message }
};
