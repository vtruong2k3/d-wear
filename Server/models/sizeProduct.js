const mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema(
  {
    size_name: {
      type: String,
      required: [true, "Tên size là bắt buộc"],
      unique: true,
      trim: true,
      minlength: [2, "Tên size phải có ít nhất 2 ký tự"],
      maxlength: [100, "Tên size không được vượt quá 100 ký tự"],
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
    versionKey: false, // Loại bỏ __v
  }
);

module.exports = mongoose.model("Size", sizeSchema);
