import axios from "axios";

// Lấy tất cả địa chỉ của user
export const getUserAddresses = () => {
  return axios.get("/api/address");
};