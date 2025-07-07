const User = require("../models/users");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const authValidate = require("../validate/authValidate");

const axios = require("axios");
const JWT_SECRET = process.env.JWT_SECRET;

exports.login = async (req, res) => {
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

exports.register = async (req, res) => {
  try {
    const { error } = authValidate.register.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }

    const { username, email, password } = req.body;
    // Kiểm tra email đã tồn tại chưa
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    // Mã hóa mật khẩu
    const hashPassword = await bcryptjs.hash(password, 10);

    // Tạo user mới
    const user = await User.create({
      username,
      email,
      password: hashPassword,
    });

    res.status(201).json({
      message: "Đăng ký thành công",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.loginWithGoogle = async (req, res) => {
  try {
    const { access_token } = req.body;
    if (!access_token) {
      return res.status(400).json({ message: "Access token is required" });
    }

    // Gọi API lấy thông tin người dùng từ Google
    const googleRes = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const profile = googleRes.data;

    // Tùy bạn xử lý logic ở đây: tìm user trong DB hoặc tạo mới
    let user = await User.findOne({ email: profile.email });
    if (!user) {
      user = await User.create({
        username: profile.name,
        email: profile.email,
        avatar: profile.picture,
        password: "google_oauth",
        isGoogleAccount: true,
      });
    }

    // Tạo JWT token của bạn
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Đăng nhập Google thành công!",
      user,
      token,
    });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({ message: "Lỗi đăng nhập Google", error });
  }
};
