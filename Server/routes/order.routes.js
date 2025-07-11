const expess = require("express");
const orderController = require("../controllers/order.controller");
const authUserMiddelware = require("../middlewares/auth.middleware");
const orderRouter = expess.Router();

orderRouter.post("/orders", authUserMiddelware, orderController.createOrder);

// lấy giỏ hàng từ của user bên client
orderRouter.get(
  "/orders/items",
  authUserMiddelware,
  orderController.getAllByIdUser
);
// lấy all order bên admin
orderRouter.get("/orders", orderController.getAllOrder);

orderRouter.get(
  "/orders/:id",
  authUserMiddelware,
  orderController.getOrderById
);
module.exports = orderRouter;
