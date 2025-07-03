const User = require("../models/users");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authValidate = require("../validate/authValidate");
exports.loginAmdin = async (req, res) => {
  try {
    const { error } = authValidate.login.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }
    const { email, password } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User không tồn tại" });
    }

    //kiếm tra role
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Không có quyền truy cập admin" });
    }

    //kiểm tra mật khẩu
    const isPassword = await bcryptjs.compare(password, user.password);
    if (!isPassword) {
      return res.status(400).json({ message: "Mật khẩu không đúng" });
    }

    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // Ẩn mật khẩu khỏi response
    const { password: _, ...userData } = user._doc;
    // Đăng nhập thành công
    res
      .status(200)
      .json({ message: "Đăng nhập thành công", token, user: userData });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
