import axios from "axios";
import type {
  DailyDataResponse,
  LatestOrdersResponse,
  OrderStatusResponse,
  SummaryResponse,
  TopProductsResponse,
} from "../../types/static/IStatic";

// Lấy tổng doanh thu, đơn hàng, khách hàng, đơn đang giao hôm nay
// Lấy tổng quan: doanh thu, đơn hàng, khách hàng mới, đơn đang giao hôm nay
export const getSummary = async (): Promise<SummaryResponse> => {
  try {
    const res = await axios.get("/api/statistics/summary");
    return res.data;
  } catch (error) {
    console.error("Lỗi khi gọi getSummary:", error);
    throw error;
  }
};

// Lấy thống kê theo ngày (30 ngày gần nhất)
export const getDailyData = async (): Promise<DailyDataResponse> => {
  try {
    const res = await axios.get("/api/statistics/daily");
    return res.data;
  } catch (error) {
    console.error("Lỗi khi gọi getDailyData:", error);
    throw error;
  }
};

// Lấy danh sách đơn hàng mới nhất
export const getLatestOrders = async (): Promise<LatestOrdersResponse> => {
  try {
    const res = await axios.get("/api/statistics/new-orders");
    return res.data;
  } catch (error) {
    console.error("Lỗi khi gọi getLatestOrders:", error);
    throw error;
  }
};

// Lấy top sản phẩm bán chạy
export const getTopProducts = async (): Promise<TopProductsResponse> => {
  try {
    const res = await axios.get("/api/statistics/top-products");
    return res.data;
  } catch (error) {
    console.error("Lỗi khi gọi getTopProducts:", error);
    throw error;
  }
};

// Lấy thống kê trạng thái đơn hàng
export const getOrderStatus = async (): Promise<OrderStatusResponse> => {
  try {
    const res = await axios.get("/api/statistics/order-status");
    return res.data;
  } catch (error) {
    console.error("Lỗi khi gọi getOrderStatus:", error);
    throw error;
  }
};

// Lọc thống kê theo khoảng ngày
export const filterByDate = async (startDate: string, endDate: string) => {
  try {
    const res = await axios.post("/api/statistics/filter", {
      startDate,
      endDate,
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi gọi filterByDate:", error);
    throw error;
  }
};
