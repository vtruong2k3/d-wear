const express = require("express");
const voucherRouter = express.Router();
const voucherController = require("../controllers/voucher.controller");

voucherRouter.post("/voucher", voucherController.createVoucher);
voucherRouter.get("/voucher", voucherController.getAllVouchers);
voucherRouter.get("/voucher/:id", voucherController.getVoucherById);
voucherRouter.put("/voucher/:id", voucherController.updateVoucher);
voucherRouter.delete("/voucher/:id", voucherController.deleteVoucher);

module.exports = voucherRouter;
