const express = require("express");
const colorRouter = express.Router();
const colorController = require("../controllers/color.controller");
const authAdminMiddelware = require("../middlewares/authAdmin.middleware");

// Tạo màu
colorRouter.post("/colors", authAdminMiddelware, colorController.createColor);

// Lấy tất cả màu
colorRouter.get("/colors", colorController.getAllColors);

// Lấy màu theo ID
colorRouter.get("/colors/:id", colorController.getColorById);

// Cập nhật màu
colorRouter.put(
  "/colors/:id",
  authAdminMiddelware,
  colorController.updateColor
);

// Xoá màu
colorRouter.delete(
  "/colors/:id",
  authAdminMiddelware,
  colorController.deleteColor
);

module.exports = colorRouter;
