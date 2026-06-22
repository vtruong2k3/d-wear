// src/config/axios.js hoặc axiosConfig.ts
import axios from "axios";

import toast from "react-hot-toast";

// ✅ Axios instance cho API ngoài (ví dụ demo)
export const api = axios.create({
  baseURL: "https://dummyjson.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

// MEMORY STORAGE CHO ACCESS TOKEN (OWASP)
let inMemoryAccessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  inMemoryAccessToken = token;
};


let isInterceptorConfigured = false;
let isRefreshing = false;
let failedQueue: any[] = [];

export function getAccessToken() {
  return inMemoryAccessToken;
}

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export function configAxios() {
  axios.defaults.baseURL = "http://localhost:5000";
  axios.defaults.headers["Content-Type"] = "application/json";
  axios.defaults.withCredentials = true; // BẮT BUỘC ĐỂ GỬI COOKIE

  if (!isInterceptorConfigured) {
    axios.interceptors.request.use(
      (config) => {
        if (inMemoryAccessToken) {
          config.headers.Authorization = `Bearer ${inMemoryAccessToken}`;
        } else {
          delete config.headers.Authorization;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Global response error handler
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          // Bỏ qua endpoint refresh và login để không lặp vô hạn
          if (originalRequest.url === "/api/auth/refresh-token" || originalRequest.url === "/api/auth/login") {
            return Promise.reject(error);
          }

          if (isRefreshing) {
            // Đang refresh thì đưa các request khác vào hàng chờ
            return new Promise(function (resolve, reject) {
              failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return axios(originalRequest);
              })
              .catch((err) => {
                // Return promise rỗng để không chạy vào catch của component, chặn toast
                return new Promise(() => {});
              });
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            // Gọi api cấp lại token, tự động gửi cookie chứa refreshToken
            const res = await axios.post("/api/auth/refresh-token", {}, { withCredentials: true });
            const newAccessToken = res.data.token;
            
            // Lưu token mới vào RAM
            setAccessToken(newAccessToken);
            
            // Cập nhật header cho request ban đầu
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            
            // Giải phóng hàng chờ
            processQueue(null, newAccessToken);
            
            // Gọi lại request ban đầu
            return axios(originalRequest);
          } catch (refreshError) {
            // Nếu refresh thất bại (hết hạn, ko hợp lệ)
            processQueue(refreshError, null);
            setAccessToken(null);
            localStorage.removeItem("user");
            
            // CHỐNG SPAM TOAST: Gán id cố định để đè lên nhau, chỉ hiện 1 lần
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", {
              id: "session_expired_toast",
              duration: 5000,
            });

            // Redirect về login sau 1.5s
            setTimeout(() => {
              window.location.href = "/login";
            }, 1500);

            // Chặn đứng hoàn toàn promise chain để không spam toast từ catch block
            return new Promise(() => {});
          } finally {
            isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );

    isInterceptorConfigured = true;
  }
}

