const express = require("express");
const colorRouter = express.Router();
const colorController = require("../controllers/color.controller");

// Tạo màu
colorRouter.post("/colors", colorController.createColor);

// Lấy tất cả màu
colorRouter.get("/colors", colorController.getAllColors);

// Lấy màu theo ID
colorRouter.get("/colors/:id", colorController.getColorById);

// Cập nhật màu
colorRouter.put("/colors/:id", colorController.updateColor);

// Xoá màu
colorRouter.delete("/colors/:id", colorController.deleteColor);

module.exports = colorRouter;
