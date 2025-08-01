const mongoose = require("mongoose");

const chatbotSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    sender: { type: String, enum: ["user", "bot"], required: true },
    message: { type: String, required: true },
    products: {
      type: Array, // Hoặc định nghĩa một schema chi tiết hơn nếu muốn
      default: [],
    },
    sessionId: { type: String, required: true },
    conversationTitle: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);
chatbotSchema.index({ user_id: 1, sessionId: 1 });
const Chatbot = mongoose.model("chatbots", chatbotSchema);

module.exports = Chatbot;
