import axios from "axios";
import type {
  GetOrdersResponse,
  OrderDetailResponse,
} from "../../types/order/IOrder";

export const getOrders = async (): Promise<GetOrdersResponse> => {
  const res = await axios.get("/api/orders/items");
  return res.data;
};

export const getOrderDetail = async (
  orderId: string | undefined
): Promise<OrderDetailResponse> => {
  const res = await axios.get(`/api/orders/${orderId}`);
  return res.data;
};
