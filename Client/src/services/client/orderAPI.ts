import axios from "axios";
import { configAxios } from "../../configs/AxiosConfig";

configAxios();

export const getOrders = () => {
  return axios.get("/orders");
};

export const getOrderDetail = (orderId: string) => {
  return axios.get(`/orders/${orderId}`);
};
