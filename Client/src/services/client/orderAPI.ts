import axios from "axios";
import type {
  GetOrdersResponse,
  OrderData,
  OrderDetailResponse,
} from "../../types/order/IOrder";

export const getOrders = async (): Promise<GetOrdersResponse> => {
  const res = await axios.get("/api/orders/items");
  return res.data;
};

export const getOrderDetail = async (
  orderId: string | undefined
): Promise<OrderDetailResponse> => {
  const res = await axios.get(`/api/orders/items/${orderId}`);
  return res.data;
};

export const createOrder = async (orderData: OrderData) => {
  const res = await axios.post("/api/orders", orderData);
  return res;
};
