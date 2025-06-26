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
    sessionId: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

const Chatbot = mongoose.model("chatbots", chatbotSchema);

module.exports = Chatbot;
