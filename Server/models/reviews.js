const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orders",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    images: {
      type: [String],
      default: [],
    },
    comment: {
      type: String,
      required: false,
      trim: true,
    },
    is_approved: {
      type: Boolean,
      default: true,
    },
    is_order: {
      type: Boolean,
      default: true,
    },
    helpful: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
reviewSchema.virtual("replies", {
  ref: "reviewreplies", // Tên model sẽ liên kết đến
  localField: "_id", // Trường trong Review Schema (hiện tại)
  foreignField: "review_id", // Trường trong ReviewReply Schema
});

// Mỗi người chỉ được đánh giá 1 sản phẩm duy nhất trong 1 đơn hàng
reviewSchema.index(
  { user_id: 1, product_id: 1, order_id: 1 },
  { unique: true }
);

const Review = mongoose.model("reviews", reviewSchema);

module.exports = Review;
