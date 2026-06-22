const Notification = require("../models/notifications");

// Lấy danh sách thông báo
exports.getNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ forAdmin: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Notification.countDocuments({ forAdmin: true });
    const unreadCount = await Notification.countDocuments({ forAdmin: true, isRead: false });

    return res.status(200).json({
      notifications,
      total,
      unreadCount,
    });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Lấy danh sách thông báo (Client)
exports.getClientNotifications = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id; // Từ auth.middleware
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Notification.countDocuments({ userId });
    const unreadCount = await Notification.countDocuments({ userId, isRead: false });

    return res.status(200).json({
      notifications,
      total,
      unreadCount,
    });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Đánh dấu đã đọc (Chung)
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
    return res.status(200).json({ success: true, notification });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Đánh dấu tất cả đã đọc (Admin)
exports.markAllAsReadAdmin = async (req, res) => {
  try {
    await Notification.updateMany({ forAdmin: true, isRead: false }, { isRead: true });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Đánh dấu tất cả đã đọc (Client)
exports.markAllAsReadClient = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Xóa thông báo (Chung)
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
