const mongoose = require("mongoose");

const reviewReplySchema = new mongoose.Schema(
  {
    review_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "reviews",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const ReviewReply = mongoose.model("reviewreplies", reviewReplySchema);
module.exports = ReviewReply;
