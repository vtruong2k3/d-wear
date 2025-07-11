const mongoose = require("mongoose");
// Import thư viện mongoose để làm việc với MongoDB.

const voucherShema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    // Mã voucher, kiểu chuỗi, bắt buộc, không được trùng lặp.
    usedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    // Loại giảm giá, chỉ nhận giá trị 'percentage' (phần trăm) hoặc 'fixed' (cố định), bắt buộc.

    discountValue: { type: Number, required: true },
    // Giá trị giảm giá, kiểu số, bắt buộc.

    minOrderValue: { type: Number, default: 0 },
    // Giá trị đơn hàng tối thiểu để áp dụng voucher, mặc định là 0.

    maxDiscountValue: { type: Number, default: 0 },
    // Giá trị giảm giá tối đa, mặc định là 0.

    maxUser: { type: Number, default: 0 },
    // Số lượng người dùng tối đa có thể sử dụng voucher, mặc định là 0 (có thể hiểu là không giới hạn).

    startDate: { type: Date, required: true },
    // Ngày bắt đầu hiệu lực của voucher, bắt buộc.

    endDate: { type: Date, required: true },
    // Ngày kết thúc hiệu lực của voucher, bắt buộc.

    isActive: { type: Boolean, default: true },
    // Trạng thái hoạt động của voucher, mặc định là true (đang hoạt động).
  },
  {
    timestamps: true,
    // Tự động thêm hai trường createdAt và updatedAt vào mỗi document.

    versionKey: false,
    // Không thêm trường __v (version) vào document.
  }
);

const Voucher = mongoose.model("vouchers", voucherShema);

module.exports = Voucher;
