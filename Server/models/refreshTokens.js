const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    tokenHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    revoked: { type: Boolean, default: false },
    userAgent: { type: String },
    ipAddress: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// TTL index để tự động xóa token khi hết hạn
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
refreshTokenSchema.index({ userId: 1 });

const RefreshToken = mongoose.model("refreshTokens", refreshTokenSchema);
module.exports = RefreshToken;
