const mongoose = require("mongoose");

const passwordOtpSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    email: { type: String, required: true, lowercase: true, trim: true },
    type: { type: String, enum: ["reset_password"], default: "reset_password" },
    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 5 },
    resendAvailableAt: { type: Date, default: null },
    status: {
      type: String,
      enum: ["pending", "used", "expired", "cancelled"],
      default: "pending",
    },
    usedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Auto xoá khi hết hạn
passwordOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Mỗi user chỉ có 1 OTP "pending"
passwordOtpSchema.index(
  { user_id: 1, type: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "pending" } }
);
const PasswordOtp = mongoose.model("password_otps", passwordOtpSchema);
module.exports = PasswordOtp;
