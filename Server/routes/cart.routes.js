const express = require("express");
const cartRouter = express.Router();
const cartController = require("../controllers/cart.controller");

cartRouter.post("/cart", cartController.addToCart);
cartRouter.put("/cart/update-quantity", cartController.updateCartQuantity);

module.exports = cartRouter;
