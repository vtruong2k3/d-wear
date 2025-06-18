const mongoose = require("mongoose");
const oderShema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    orderItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "orderitems",
        required: true,
      },
    ],
    voucher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vouchers",
    },
    total: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      required: true,
    },
    shippingAddress: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const Order = mongoose.model("orders", oderShema);
module.exports = Order;
