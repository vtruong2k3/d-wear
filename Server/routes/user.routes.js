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
userRouter.post(
  "/users",
  authAdminMiddelware,
  upload.single("avatar"),
  userController.createUser
);
userRouter.put(
  "/users/:id",
  authAdminMiddelware,
  upload.single("avatar"),
  userController.updateUser
);
userRouter.delete("/users/:id", authAdminMiddelware, userController.deleteUser);
userRouter.get("/users", authAdminMiddelware, userController.getUsers);
userRouter.get("/users/:id", authAdminMiddelware, userController.getUserById);
module.exports = userRouter;
