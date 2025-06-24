const mongoose = require("mongoose");
const orderItemSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orders",
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
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const OrderItem = mongoose.model("orderitems", orderItemSchema);
module.exports = OrderItem;
