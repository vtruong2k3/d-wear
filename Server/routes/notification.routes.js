const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");
const authUserMiddelware = require("../middlewares/auth.middleware");
const authAdminMiddelware = require("../middlewares/authAdmin.middleware");

// Routes cho Admin
router.get("/admin", authAdminMiddelware, notificationController.getNotifications);
router.patch("/admin/read-all", authAdminMiddelware, notificationController.markAllAsReadAdmin);

// Routes cho Client
router.get("/client", authUserMiddelware, notificationController.getClientNotifications);
router.patch("/client/read-all", authUserMiddelware, notificationController.markAllAsReadClient);

// Routes chung
router.patch("/:id/read", authUserMiddelware, notificationController.markAsRead);
router.delete("/:id", authUserMiddelware, notificationController.deleteNotification);

module.exports = router;
