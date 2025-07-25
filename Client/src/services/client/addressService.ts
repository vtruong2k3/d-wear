import axios from "axios";

// Lấy tất cả địa chỉ của user
export const getUserAddresses = () => {
  return axios.get("/api/address");
};

// Thêm địa chỉ mới
export const addUserAddress = (data: any) => {
  return axios.post("/api/address", data);
};

// Cập nhật địa chỉ
export const updateUserAddress = (id: string, data: any) => {
  return axios.put(`/api/address/${id}`, data);
};
