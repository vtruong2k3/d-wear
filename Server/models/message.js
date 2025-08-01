const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
    content: {
      type: String,
      required: true,
    },
    chatRoomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chatrooms",
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const Message = mongoose.model("message", messageSchema);
module.exports = Message;
