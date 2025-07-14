const mongoose = require("mongoose");
const paymentShema = mongoose.Schema(
  {
    order_id: {
      type: String,
      required: true,
    },
    // order_id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "orders",
    //   required: true,
    // },

    // Cổng thanh toán
    method: {
      type: String,
      enum: ["vnpay", "momo", "zalopay"],
      required: true,
    },

    // Số tiền đã thanh toán
    amount: {
      type: Number,
      required: true,
    },

    // Mã giao dịch từ cổng thanh toán (VD: vnp_TxnRef)
    transactionCode: {
      type: String,
      required: true,
      unique: true,
    },

    // Trạng thái giao dịch
    status: {
      type: String,
      enum: ["pending", "success", "failed", "cancelled"],
      default: "pending",
    },

    // Dữ liệu phản hồi từ cổng thanh toán (nếu cần lưu)
    responseData: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Payment = mongoose.model("payments", paymentShema);
module.exports = Payment;
