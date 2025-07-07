const express = require("express");
const router = express.Router();

const sizeController = require("../controllers/size.controller");

// Tạo size mới
router.post("/", sizeController.createSize);

// Lấy danh sách tất cả size
router.get("/", sizeController.getAllSizes);

// Lấy chi tiết size theo ID
router.get("/:id", sizeController.getSizeById);

// Cập nhật size
router.put("/:id", sizeController.updateSize);

// Xoá size
router.delete("/:id", sizeController.deleteSize);

module.exports = router;
