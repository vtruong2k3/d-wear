const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    order_code: { type: String, unique: true, required: true },

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
    //Tên ngươi nhận hàng
    receiverName: { type: String, required: true },
    shippingAddress: { type: String, required: true },
    phone: { type: String, required: true, maxlength: 20 },
    note: { type: String },
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    // Đơn hàng đã thanh toán hay chưa
    isPaid: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Order = mongoose.model("orders", orderSchema);
module.exports = Order;
