const mongoose = require("mongoose");

const colorSchema = new mongoose.Schema(
  {
    color_name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Color", colorSchema);
