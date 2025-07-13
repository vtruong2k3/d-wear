const express = require("express");
const sizeRouter = express.Router();

const sizeController = require("../controllers/size.controller");
const authAdminMiddelware = require("../middlewares/authAdmin.middleware");

// Tạo size mới
sizeRouter.post("/sizes", authAdminMiddelware, sizeController.createSize);

// Lấy danh sách tất cả size
sizeRouter.get("/sizes", sizeController.getAllSizes);
sizeRouter.get("/sizes/items", sizeController.getAllSizesItems);
// Lấy chi tiết size theo ID
sizeRouter.get("/sizes/:id", sizeController.getSizeById);

// Cập nhật size
sizeRouter.put("/sizes/:id", authAdminMiddelware, sizeController.updateSize);

// Xoá size
sizeRouter.delete("/sizes/:id", authAdminMiddelware, sizeController.deleteSize);

module.exports = sizeRouter;
