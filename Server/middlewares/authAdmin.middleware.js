// middlewares/authAdmin.js
const jwt = require("jsonwebtoken");
const User = require("../models/users");

const authAdminMiddelware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Bạn chưa đăng nhập" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await User.findById(decoded.id);

    if (!admin) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    if (admin.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền truy cập admin" });
    }

    req.user = admin;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

module.exports = authAdminMiddelware;
