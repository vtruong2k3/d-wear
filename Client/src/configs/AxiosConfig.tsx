// src/config/axios.js hoặc axiosConfig.ts
import axios from "axios";

// ✅ Axios instance cho API ngoài (ví dụ demo)
export const api = axios.create({
  baseURL: "https://dummyjson.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Cấu hình axios mặc định cho API backend
export function configAxios() {
  axios.defaults.baseURL = "http://localhost:5000";
  axios.defaults.headers["Content-Type"] = "application/json";

  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        delete config.headers.Authorization;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
}
