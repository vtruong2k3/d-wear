
const express = require("express");
const cartRouter = express.Router();
const cartController = require("../controllers/cart.controller");
const authUserMiddelware = require("../middlewares/auth.middleware");
cartRouter.get("/cart", authUserMiddelware, cartController.getAllCart);
cartRouter.post("/cart/items", authUserMiddelware, cartController.addToCart);
cartRouter.put(
  "/cart/items",
  authUserMiddelware,
  cartController.updateCartQuantity
);

cartRouter.delete(
  "/cart/items/:id",
  authUserMiddelware,
  cartController.deleteProductCart
);
cartRouter.delete("/cart", authUserMiddelware, cartController.deleteAllCart);

module.exports = cartRouter;

