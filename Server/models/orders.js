const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    order_code: { type: String, unique: true, required: true },
    email: { type: String, required: false },
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
    shippingFee: { type: Number, default: 0 },
    paymentMethod: {
      type: String,
      enum: ["cod", "momo"],
      required: true,
    },
    //Tên ngươi nhận hàng
    receiverName: { type: String, required: true },
    shippingAddress: { type: String, required: true },

    phone: { type: String, required: true, maxlength: 20 },
    note: { type: String },
    cancellationReason: { type: String, required: false },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Order = mongoose.model("orders", orderSchema);
module.exports = Order;
