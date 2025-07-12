const express = require("express");
const authRouter = express.Router();
const authControl = require("../controllers/auth.controller");

authRouter.post("/auth/login", authControl.login);
authRouter.post("/auth/register", authControl.register);
authRouter.post("/auth/google", authControl.loginWithGoogle);
module.exports = authRouter;
