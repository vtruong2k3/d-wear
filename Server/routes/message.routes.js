const express = require("express");
const messageRouter = express.Router();
const messageController = require("../controllers/message.controller");
// 1. Tạo phòng chat mới khi khách mở chat (chỉ chứa userId)
messageRouter.post("/chat-rooms", messageController.createChatRoomForCustomer);

// 2. Lấy danh sách các phòng chờ (chỉ có 1 user - dành cho admin)
messageRouter.get("/chat-rooms/waiting", messageController.getAdminChatRooms);

// 3. Admin join vào 1 phòng chat cụ thể
messageRouter.patch("/chat-rooms/:roomId/join", messageController.joinChatRoom);

// 4. Gửi tin nhắn
messageRouter.post("/messages", messageController.sendMessage);

// 5. Lấy tin nhắn trong phòng
messageRouter.get("/messages/:chatRoomId", messageController.getMessages);

// 6. Lấy danh sách phòng chat của 1 user
messageRouter.get(
  "/chat-rooms/user/:userId",
  messageController.getUserChatRooms
);

module.exports = messageRouter;
