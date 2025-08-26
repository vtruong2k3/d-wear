const User = require("../models/users");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const authValidate = require("../validate/authValidate");

const axios = require("axios");
const { genOtp6, hash } = require("../utils/security");
const PasswordOtp = require("../models/forgotPassword");
const { sendOtpEmail } = require("../utils/sendMaillOtp");
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
    if (user.isActive === false) {
      return res.status(400).json({ message: "Tài khoản đã bị khóa" });
    }
    const isPassword = await bcryptjs.compare(password, user.password);
    if (!isPassword) {
      return res.status(400).json({ message: "Mật khẩu không đúng" });
    }

    const token = await jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    // Ẩn mật khẩu khỏi response
    const {
      password: _v,
      __v,
      createdAt,
      updatedAt,
      isGoogleAccount,
      isActive,
      ...userData
    } = user._doc;

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

    // Gọi API Google lấy profile
    const googleRes = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const profile = googleRes.data;

    // Tìm hoặc tạo user
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
    if (!user.isActive) {
      return res.status(400).json({ message: "Tài khoản đã bị khóa" });
    }
    // Tạo JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Lấy dữ liệu cần trả về (ẩn field nhạy cảm)
    const {
      password,
      __v,
      createdAt,
      updatedAt,
      isGoogleAccount,
      isActive,
      ...userData
    } = user._doc;

    return res.status(200).json({
      message: "Đăng nhập Google thành công!",
      user: userData,
      token,
    });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({ message: "Lỗi đăng nhập Google", error });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "Chưa xác thực" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Lỗi lấy user:", error);
    return res.status(500).json({ message: "Lỗi server", error });
  }
};

// /auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Không tiết lộ tồn tại + chặn tài khoản Google
    if (!user || user.isGoogleAccount) {
      return res.status(200).json({ message: "Tài khoản không hợp lệ" });
    }

    // chống spam resend
    const existing = await PasswordOtp.findOne({
      user_id: user._id,
      type: "reset_password",
      status: "pending",
    });
    const now = new Date();
    if (existing?.resendAvailableAt && existing.resendAvailableAt > now) {
      const wait = Math.ceil((existing.resendAvailableAt - now) / 1000);
      return res
        .status(429)
        .json({ message: `Vui lòng thử lại sau ${wait}s.` });
    }

    const otp = genOtp6();
    await PasswordOtp.findOneAndUpdate(
      { user_id: user._id, type: "reset_password", status: "pending" },
      {
        $set: {
          email,
          otpHash: hash(otp),
          expiresAt: new Date(
            Date.now() + process.env.OTP_TTL_MINUTES * 60 * 1000
          ),
          attempts: 0,
          maxAttempts: process.env.MAX_ATTEMPTS,
          resendAvailableAt: new Date(
            Date.now() + process.env.RESEND_COOLDOWN_SECONDS * 1000
          ),
          status: "pending",
          usedAt: null,
        },
      },
      { upsert: true, new: true }
    );

    await sendOtpEmail(email, otp, {
      appName: "D-Wear",
      minutes: process.env.OTP_TTL_MINUTES,
    });
    return res
      .status(200)
      .json({ message: "Đã gửi mã OTP (nếu email tồn tại)." });
  } catch (err) {
    console.error("forgotPassword error:", err);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

//  /auth/check-otp
exports.checkOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "OTP không hợp lệ." });
    const doc = await PasswordOtp.findOne({
      user_id: user._id,
      type: "reset_password",
      status: "pending",
    });
    if (!doc) return res.status(400).json({ message: "OTP không hợp lệ." });
    if (doc.attempts >= doc.maxAttempts) {
      return res
        .status(429)
        .json({ message: "Vượt quá số lần thử. Vui lòng yêu cầu mã mới." });
    }
    if (doc.expiresAt < new Date()) {
      return res
        .status(400)
        .json({ message: "OTP đã hết hạn. Vui lòng yêu cầu mã mới." });
    }
    if (doc.otpHash !== hash(otp)) {
      await PasswordOtp.updateOne({ _id: doc._id }, { $inc: { attempts: 1 } });
      return res.status(400).json({ message: "OTP không đúng." });
    }
    return res.status(200).json({ ok: true, message: "Mã OTP hợp lệ" });
  } catch (err) {
    console.error("checkOtp error:", err);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

//  /auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "OTP không hợp lệ." });
    const doc = await PasswordOtp.findOne({
      user_id: user._id,
      type: "reset_password",
      status: "pending",
    });
    if (!doc) return res.status(400).json({ message: "OTP không hợp lệ." });
    if (doc.attempts >= doc.maxAttempts) {
      return res
        .status(429)
        .json({ message: "Vượt quá số lần thử. Vui lòng yêu cầu mã mới." });
    }
    if (doc.expiresAt < new Date()) {
      return res
        .status(400)
        .json({ message: "OTP đã hết hạn. Vui lòng yêu cầu mã mới." });
    }
    if (doc.otpHash !== hash(otp)) {
      await PasswordOtp.updateOne({ _id: doc._id }, { $inc: { attempts: 1 } });
      return res.status(400).json({ message: "OTP không đúng." });
    }
    // Đổi mật khẩu
    const hashedPwd = await bcryptjs.hash(password, 10);
    await User.updateOne({ _id: user._id }, { $set: { password: hashedPwd } });
    // Đánh dấu OTP đã dùng
    await PasswordOtp.updateOne(
      { _id: doc._id },
      { $set: { status: "used", usedAt: new Date() } }
    );
    return res
      .status(200)
      .json({ message: "Đặt lại mật khẩu thành công. Vui lòng đăng nhập." });
  } catch (err) {
    console.error("resetPassword error:", err);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
