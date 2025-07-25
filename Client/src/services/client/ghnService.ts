import axios from "axios"; // hoặc import trực tiếp axios nếu cần

// Lấy danh sách tỉnh/thành phố
export const getProvinces = () => {
  return axios.get("/api/ghn/provinces");
};