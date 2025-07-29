const mongoose = require("mongoose");
const variantSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    size: {
      type: String,
      required: true,
      enum: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    color: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: [String],
      required: true,
    },
    isDelete: { type: Boolean, default: false }, //sửa từ isDeleted thành isDelete cho phù hợp với variant.controller
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
// Chống trùng biến thể
variantSchema.index({ product_id: 1, size: 1, color: 1 }, { unique: true });
const Variant = mongoose.model("variants", variantSchema);
module.exports = Variant;
