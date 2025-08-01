const expess = require("express");
const orderController = require("../controllers/order.controller");
const authUserMiddelware = require("../middlewares/auth.middleware");
const authAdminMiddelware = require("../middlewares/authAdmin.middleware");
const orderRouter = expess.Router();

// lấy giỏ hàng từ của user bên client
orderRouter.get(
  "/orders/items",
  authUserMiddelware,
  orderController.getAllByIdUser
);
// lấy all order bên admin
orderRouter.get("/orders", authAdminMiddelware, orderController.getAllOrder);
orderRouter.post(
  "/order/:id/status",
  authAdminMiddelware,
  orderController.updateOrderStatus
);
orderRouter.post("/orders", authUserMiddelware, orderController.createOrder);
orderRouter.post(
  "/orders/:id/cancel",
  authUserMiddelware,
  orderController.cancelOrder
);

// kiểm tra xem đơn hàng giao thành công chưa để cho binhf luận
orderRouter.get(
  "/order/user-review/:productId",
  authUserMiddelware,
  orderController.getUserProductOrdersForReview
);
orderRouter.get("/orders/:id", orderController.getOrderByIdAdmin);
orderRouter.get(
  "/orders/items/:id",
  authUserMiddelware,
  orderController.getOrderById
);
module.exports = orderRouter;
