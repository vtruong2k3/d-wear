const express = require("express");
const sizeRouter = express.Router();

const sizeController = require("../controllers/size.controller");

// Tạo size mới
sizeRouter.post("/sizes", sizeController.createSize);

// Lấy danh sách tất cả size
sizeRouter.get("/sizes", sizeController.getAllSizes);

// Lấy chi tiết size theo ID
sizeRouter.get("/sizes/:id", sizeController.getSizeById);

// Cập nhật size
sizeRouter.put("/sizes/:id", sizeController.updateSize);

// Xoá size
sizeRouter.delete("/sizes/:id", sizeController.deleteSize);

module.exports = sizeRouter;
