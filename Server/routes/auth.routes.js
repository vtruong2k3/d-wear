const express = require("express");
const rateLimit = require("express-rate-limit");
const authRouter = express.Router();
const authControl = require("../controllers/auth.controller");
const authUserMiddelware = require("../middlewares/auth.middleware");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 10, // Giới hạn 10 request mỗi IP / 15 phút
  message: { message: "Bạn đã thử quá nhiều lần, vui lòng thử lại sau 15 phút." },
});

authRouter.post("/auth/login", authLimiter, authControl.login);
authRouter.post("/auth/register", authLimiter, authControl.register);
authRouter.post("/auth/google", authLimiter, authControl.loginWithGoogle);
authRouter.get("/auth/info", authUserMiddelware, authControl.getUserInfo);
authRouter.post("/auth/forgot-password", authLimiter, authControl.forgotPassword);
authRouter.post("/auth/check-otp", authLimiter, authControl.checkOtp);
authRouter.post("/auth/reset-password", authLimiter, authControl.resetPassword);
authRouter.post("/auth/refresh-token", authControl.refreshToken);
authRouter.post("/auth/logout", authControl.logout);

module.exports = authRouter;
