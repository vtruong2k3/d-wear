const express = require("express");
const brandRouter = require("./brand.routes");
const categoryRouter = require("./category.routes");
const productRouter = require("./product.routes");
const voucherRouter = require("./voucher.routes");
const authRouter = require("./auth.routes");
const variantRouter = require("./variant.routes");
const cartRouter = require("./cart.routes");
const routerManager = express.Router();

routerManager.use("/api", brandRouter);
routerManager.use("/api", categoryRouter);
routerManager.use("/api", productRouter);
routerManager.use("/api", voucherRouter);
routerManager.use("/api", authRouter);
routerManager.use("/api", variantRouter);
routerManager.use("/api", cartRouter);

module.exports = routerManager;
