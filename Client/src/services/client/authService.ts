import axios from "axios";
import type { LoginFormData, RegisterFormData } from "../../types/auth/IAuth";

export const loginWithGoogle = async (accessToken: string) => {
  const response = await axios.post("api/auth/google", {
    access_token: accessToken,
  });
  return response.data;
};
export const registerAPI = async (formData: RegisterFormData) => {
  const res = await axios.post("/api/auth/register", formData);
  return res.data;
};
export const loginAPI = async (payload: LoginFormData) => {
  const res = await axios.post("/api/auth/login", payload);
  return res.data;
};

export const getUserInfo = async () => {
  const res = await axios.get("/api/auth/info");
  return res.data;
};
