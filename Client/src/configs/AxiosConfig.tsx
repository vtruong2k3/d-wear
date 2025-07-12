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
let isInterceptorConfigured = false;

export function configAxios() {
  axios.defaults.baseURL = "http://localhost:5000";
  axios.defaults.headers["Content-Type"] = "application/json";

  if (!isInterceptorConfigured) {
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

    // Optional: Global response error handler
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // ví dụ: nếu lỗi 401 thì redirect login
        if (error.response?.status === 401) {
          console.warn("Unauthorized - maybe redirect to login");
          // window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );

    isInterceptorConfigured = true;
  }
}

