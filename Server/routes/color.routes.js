const express = require("express");
const router = express.Router();
const colorController = require("../controllers/color.controller");

// Tạo màu
router.post("/", colorController.createColor);

// Lấy tất cả màu
router.get("/", colorController.getAllColors);

// Lấy màu theo ID
router.get("/:id", colorController.getColorById);

// Cập nhật màu
router.put("/:id", colorController.updateColor);

// Xoá màu
router.delete("/:id", colorController.deleteColor);

module.exports = router;
