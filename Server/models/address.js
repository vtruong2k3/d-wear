const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    provinceId: {
      type: String,
      required: true,
    },
    provinceName: {
      type: String,
      required: true,
    },
    districtId: {
      type: String,
      required: true,
    },
    districtName: {
      type: String,
      required: true,
    },
    wardId: {
      type: String,
      required: true,
    },
    wardName: {
      type: String,
      required: true,
    },
    // số nhà và tên đường
    detailAddress: {
      type: String,
      required: true,
    },
    // địa chỉ đầy đủ
    fullAddress: {
      type: String,
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("address", addressSchema);
