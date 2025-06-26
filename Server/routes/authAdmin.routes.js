const express = require("express");
const authAmdinRouter = express.Router();
const authAminController = require("../controllers/authAdmin.controller");

authAmdinRouter.post("/admin/auth/login", authAminController.loginAmdin);
module.exports = authAmdinRouter;
