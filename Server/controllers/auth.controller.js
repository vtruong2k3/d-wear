const User = require("../models/users");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const authValidate = require("../validate/authValidate");
const { OAuth2Client } = require("google-auth-library");
exports.login = async (req, res) => {
  try {
    const { error } = authValidate.login.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }
    const { v, password } = req.body;

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
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  try {
    const { id_token } = req.body;
    if (!id_token) return res.status(400).json({ message: "Thiếu id_token" });

    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        username: name,
        email,
        avatar: picture,
        isGoogleAccount: true,
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Đăng nhập thành công",
      token,
      user,
    });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};
