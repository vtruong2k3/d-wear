import axios from "axios";
import type {
  GetOrdersResponse,
  OrderDetailResponse,
} from "../../types/order/IOrder";
export interface GetOrdersParams {
  page?: number;
  limit?: number;
  q?: string;
  status?: string;
  date?: string; // YYYY-MM-DD
  sort?: string; // "low-to-high" | "high-to-low" | ""
}

export const fetchGetAllOrder = async (
  params: GetOrdersParams = {}
): Promise<GetOrdersResponse> => {
  const res = await axios.get("/api/orders", { params });
  return res.data;
};

export const fetchGetOrderDetail = async (
  id: string | undefined
): Promise<OrderDetailResponse> => {
  const token = localStorage.getItem("token"); // hoặc từ Redux store nếu dùng Redux

  const res = await axios.get(`/api/orders/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const updateOrderStatus = async (orderId: string, newStatus: string) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    `/api/order/${orderId}/status`,
    { status: newStatus },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
