const mongoose = require("mongoose");

// Schema cho từng biến thể
const variantSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
    trim: true,
  },
  color: {
    type: String,
    required: true,
    trim: true,
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
    default: [],
  },
}, { _id: false }); // Không tạo _id riêng cho từng variant nếu không cần

// Schema cho sản phẩm có chứa mảng biến thể
const productWithVariantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  desc: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    min: 0,
  },
  image: {
    type: [String],
    default: [],
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: false,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: false,
  },
  variants: {
    type: [variantSchema], // Nhúng mảng biến thể vào sản phẩm
    default: [],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("ProductWithVariant", productWithVariantSchema);
