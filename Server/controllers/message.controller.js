const { default: mongoose } = require("mongoose");
const ChatRoom = require("../models/chatRoom");
const Message = require("../models/message");
const { getIO } = require("../sockets/socketManager");

// Tạo phòng chat khi khách bắt đầu (chỉ có userId)
exports.createChatRoomForCustomer = async (req, res) => {
  const { userId } = req.body;
  console.log("user_id", userId);

  if (!userId) {
    return res.status(400).json({ message: "Thiếu userId" });
  }

  try {
    //  Phần này bạn đã làm đúng: Tìm phòng có chứa userId
    let room = await ChatRoom.findOne({ members: userId });

    if (!room) {
      // Chỉ tạo phòng mới nếu thực sự không tìm thấy
      room = await ChatRoom.create({ members: [userId] });

      //  Thêm phần này: Gửi thông báo real-time đến các admin
      const newRoomData = await ChatRoom.findById(room._id).populate(
        "members",
        "username avatar"
      );
      getIO().to("admin_room").emit("newRoom", newRoomData);
    }

    res.status(200).json(room);
  } catch (err) {
    console.error("Create chat room error:", err);
    res.status(500).json({ message: "Lỗi tạo phòng chat" });
  }
};

exports.getAdminChatRooms = async (req, res) => {
  try {
    // Lấy adminId từ request (sau khi qua middleware xác thực)
    const { adminId } = req.query;

    const rooms = await ChatRoom.find({
      // Sử dụng toán tử $or để kết hợp 2 điều kiện
      $or: [
        // 1. Lấy các phòng đang chờ (chưa có admin nào tham gia)
        { "members.1": { $exists: false } },

        // 2. Lấy các phòng mà admin này đã tham gia
        { members: adminId },
      ],
    })
      .populate("members", "username avatar")
      .sort({ updatedAt: -1 });

    // Phần logic lấy tin nhắn cuối và trả về response giữ nguyên như cũ...
    const roomIds = rooms.map((r) => r._id);
    const lastMessages = await Message.aggregate([
      { $match: { chatRoomId: { $in: roomIds } } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$chatRoomId",
          lastMessage: { $first: "$content" },
          lastActive: { $first: "$createdAt" },
        },
      },
    ]);

    const lastMessagesMap = new Map(
      lastMessages.map((msg) => [msg._id.toString(), msg])
    );

    const results = rooms.map((room) => {
      const lastMsg = lastMessagesMap.get(room._id.toString());
      return {
        ...room.toObject(),
        lastMessage: lastMsg?.lastMessage || "...",
        lastActive: lastMsg?.lastActive || room.updatedAt,
      };
    });

    res.json(results);
  } catch (err) {
    console.error("Get admin chat rooms error:", err);
    res.status(500).json({ message: "Lỗi lấy danh sách phòng chat" });
  }
};

// Admin join vào phòng (nhận hỗ trợ khách)
exports.joinChatRoom = async (req, res) => {
  const { adminId } = req.body;
  const { roomId } = req.params;

  if (!adminId || !roomId) {
    return res.status(400).json({ message: "Thiếu dữ liệu join phòng" });
  }

  try {
    const room = await ChatRoom.findById(roomId);
    if (!room) return res.status(404).json({ message: "Không tìm thấy phòng" });

    if (!room.members.includes(adminId)) {
      room.members.push(adminId);
      await room.save();
    }

    res.json(room);
  } catch (err) {
    console.error("Join room error:", err);
    res.status(500).json({ message: "Lỗi khi join phòng chat" });
  }
};

// Gửi tin nhắn
exports.sendMessage = async (req, res) => {
  const { sender, content, chatRoomId } = req.body;

  if (!sender || !content || !chatRoomId) {
    return res.status(400).json({ message: "Thiếu dữ liệu gửi tin nhắn" });
  }

  try {
    const newMessage = new Message({ sender, content, chatRoomId });
    await newMessage.save();

    // Populate thông tin người gửi
    const message = await Message.findById(newMessage._id).populate(
      "sender",
      "username avatar"
    );

    // Cập nhật thời gian hoạt động cuối của phòng chat
    await ChatRoom.findByIdAndUpdate(chatRoomId, { updatedAt: Date.now() });

    // Gửi tin nhắn đến các thành viên trong phòng (client và admin đang xem)
    getIO().to(chatRoomId).emit("receive-message", message);

    getIO().to("admin_room").emit("updateRoomList", message);

    res.status(201).json(message);
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ message: "Lỗi gửi tin nhắn" });
  }
};

// Lấy tin nhắn trong phòng
exports.getMessages = async (req, res) => {
  const { chatRoomId } = req.params;

  try {
    const messages = await Message.find({ chatRoomId })
      .populate("sender", "username avatar")
      .populate("receiver", "username avatar")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).json({ message: "Lỗi lấy tin nhắn" });
  }
};

// Lấy danh sách phòng chat theo user (cho khách hoặc admin)
exports.getUserChatRooms = async (req, res) => {
  const { userId } = req.params;

  try {
    const rooms = await ChatRoom.find({ members: userId }).populate(
      "members",
      "username avatar"
    );

    res.json(rooms);
  } catch (err) {
    console.error("Get chat rooms error:", err);
    res.status(500).json({ message: "Lỗi lấy danh sách phòng chat" });
  }
};
