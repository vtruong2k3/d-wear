import axios from "axios"; // hoặc import trực tiếp axios nếu cần

// Lấy danh sách tỉnh/thành phố
export const getProvinces = () => {
  return axios.get("/api/ghn/provinces");
};

// Lấy danh sách quận/huyện theo tỉnh
export const getDistricts = (provinceId: number) => {
  return axios.get(`/api/ghn/districts/${provinceId}`);
};
// Lấy danh sách phường/xã theo quận
export const getWards = (districtId: number) => {
  return axios.get(`/api/ghn/wards/${districtId}`);
};
// Tính phí ship
export const calculateShippingFee = (data: {
  to_district_id: number;
  to_ward_code: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  service_type_id: number;
}) => {
  return axios.post("/api/ghn/calculate-fee", data);
};
