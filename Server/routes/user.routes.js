const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/user.controller");
const authUserMiddelware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/uploadAvt.middleware");
userRouter.put(
  "/users/profile",
  authUserMiddelware,
  upload.single("avatar"),
  userController.updateUserProfile
);
module.exports = userRouter;
