const express = require("express");
const brandRouter = require("./brand.routes");
const categoryRouter = require("./category.routes");
const productRouter = require("./product.routes");
const voucherRouter = require("./voucher.routes");
const routerManager = express.Router();

routerManager.use("/api", brandRouter);
routerManager.use("/api", categoryRouter);
routerManager.use("/api", productRouter);
routerManager.use("/api", voucherRouter);
module.exports = routerManager;
