const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
  },
  { timestamps: true }
);
const ChatRoom = mongoose.model("chatrooms", chatRoomSchema);
module.exports = ChatRoom;
