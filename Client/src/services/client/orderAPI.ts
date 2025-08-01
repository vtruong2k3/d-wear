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
export const cancelOrder = async (id: string | undefined, reason: string) => {
  const response = await axios.post(`/api/orders/${id}/cancel`, {
    reason,
  });
  return response.data;
};

export const checkReviewProduct = async (id: string | undefined) => {
  const res = await axios.get(`/api/order/user-review/${id}`);
  return res.data;
};
