const mongoose = require("mongoose");
const brandSheama = new mongoose.Schema(
  {
    brand_name: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const Brand = mongoose.model("brands", brandSheama);
module.exports = Brand;
