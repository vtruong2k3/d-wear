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
    rating: { type: Number, required: true, min: 1, max: 5 },
    images: { type: [String] },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
reviewSchema.index(
  { user_id: 1, product_id: 1, order_id: 1 },
  { unique: true }
);
const Review = mongoose.model("reviews", reviewSchema);
module.exports = Review;
