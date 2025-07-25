import axios from "axios";

// Lấy tất cả địa chỉ của user
export const getUserAddresses = () => {
  return axios.get("/api/address");
};

// Thêm địa chỉ mới
export const addUserAddress = (data: any) => {
    return axios.post("/api/address", data);
  };