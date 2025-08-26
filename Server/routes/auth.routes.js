const express = require("express");
const authRouter = express.Router();
const authControl = require("../controllers/auth.controller");
const authUserMiddelware = require("../middlewares/auth.middleware");

authRouter.post("/auth/login", authControl.login);
authRouter.post("/auth/register", authControl.register);
authRouter.post("/auth/google", authControl.loginWithGoogle);
authRouter.get("/auth/info", authUserMiddelware, authControl.getUserInfo);
authRouter.post("/auth/forgot-password", authControl.forgotPassword);
authRouter.post("/auth/check-otp", authControl.checkOtp);
authRouter.post("/auth/reset-password", authControl.resetPassword);

module.exports = authRouter;
