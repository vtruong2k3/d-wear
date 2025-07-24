const mongoose = require("mongoose");

const userShema = new mongoose.Schema(
  {
    username: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String },
    avatar: { type: String },
    isGoogleAccount: { type: Boolean, default: false },
    phone: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const User = mongoose.model("users", userShema);
module.exports = User;
