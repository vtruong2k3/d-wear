const express = require("express");
const voucherRouter = express.Router();
const voucherController = require("../controllers/voucher.controller");
const authAdminMiddelware = require("../middlewares/authAdmin.middleware");
const authUserMiddelware = require("../middlewares/auth.middleware");

voucherRouter.post(
  "/voucher",
  authAdminMiddelware,
  voucherController.createVoucher
);
voucherRouter.post(
  "/voucher/check",
  authUserMiddelware,
  voucherController.checkVoucher
);
voucherRouter.get(
  "/voucher",
  authAdminMiddelware,
  voucherController.getAllVouchers
);
voucherRouter.get(
  "/voucher/:id",
  authAdminMiddelware,
  voucherController.getVoucherById
);
voucherRouter.put(
  "/voucher/:id",
  authAdminMiddelware,
  voucherController.updateVoucher
);
voucherRouter.delete(
  "/voucher/:id",
  authAdminMiddelware,
  voucherController.deleteVoucher
);

module.exports = voucherRouter;
