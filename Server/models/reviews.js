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
      type: [String], // URL ảnh sau khi upload
      default: [],
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    is_approved: {
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
  }
);

// Mỗi người chỉ được đánh giá 1 sản phẩm duy nhất trong 1 đơn hàng
reviewSchema.index(
  { user_id: 1, product_id: 1, order_id: 1 },
  { unique: true }
);

const Review = mongoose.model("reviews", reviewSchema);

module.exports = Review;
