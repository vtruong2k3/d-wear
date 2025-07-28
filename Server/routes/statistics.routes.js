const express = require("express");

const statisticRouter = express.Router();
const statisticController = require("../controllers/statistics.controller");
// Lấy số liệu tổng quan trong ngày hiện tại: tổng doanh thu, tổng đơn hàng, tổng khách hàng mới
statisticRouter.get("/statistics/summary", statisticController.getSummary);

// Lấy dữ liệu thống kê theo ngày (mặc định 30 ngày gần nhất): doanh thu, số đơn hàng, số khách hàng mỗi ngày
statisticRouter.get("/statistics/daily", statisticController.getDailyData);

// Lấy danh sách các đơn hàng mới nhất (mặc định lấy 8 đơn gần nhất)
statisticRouter.get(
  "/statistics/new-orders",
  statisticController.getLatestOrders
);

// Lấy danh sách các sản phẩm bán chạy nhất (dựa vào số lượng bán được)
statisticRouter.get(
  "/statistics/top-products",
  statisticController.getTopProducts
);

// Thống kê số lượng đơn hàng theo từng trạng thái: chờ xử lý, đang xử lý, đã giao, đã hủy,...
statisticRouter.get(
  "/statistics/order-status",
  statisticController.getOrderStatus
);

// Lọc thống kê theo khoảng ngày do người dùng chọn (gửi ngày bắt đầu và kết thúc từ frontend)
statisticRouter.post("/statistics/filter", statisticController.filterByDate);

//  Thống kê theo năm
statisticRouter.get(
  "/statistics/by-year/:year",
  statisticController.summaryByYear
);

//  (Tùy chọn) Thống kê theo tuần
statisticRouter.post(
  "/statistics/by-week/:year/:week",
  statisticController.summaryByWeek
);

statisticRouter.post(
  "/statistics/top-products-by-date",

  statisticController.getTopProductsByDate
);
module.exports = statisticRouter;
