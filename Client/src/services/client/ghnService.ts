import axios from "axios"; // hoặc import trực tiếp axios nếu cần

// Lấy danh sách tỉnh/thành phố
export const getProvinces = () => {
  return axios.get("/api/ghn/provinces");
};

// Lấy danh sách quận/huyện theo tỉnh
export const getDistricts = (provinceId: string) => {
  return axios.get(`/api/ghn/districts/${provinceId}`);
};
// Lấy danh sách phường/xã theo quận
export const getWards = (districtId: string) => {
  return axios.get(`/api/ghn/wards/${districtId}`);
};
