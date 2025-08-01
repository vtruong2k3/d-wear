const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/user.controller");
const authUserMiddelware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/uploadAvt.middleware");
const authAdminMiddelware = require("../middlewares/authAdmin.middleware");
userRouter.put(
  "/users/profile",
  authUserMiddelware,
  upload.single("avatar"),
  userController.updateUserProfile
);
userRouter.get("/users", authAdminMiddelware, userController.getAllUsers);
userRouter.get("/users/:id", authAdminMiddelware, userController.getUserById);
module.exports = userRouter;
