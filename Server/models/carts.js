const mongoose = require("mongoose");
const cartShema = new mongoose.Schema(
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
    variant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "variants",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: [1, "Quantity must be at least 1"],
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price must be >= 0"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
cartShema.index({ user_id: 1, variant_id: 1 }, { unique: true });
const Cart = mongoose.model("carts", cartShema);
module.exports = Cart;
