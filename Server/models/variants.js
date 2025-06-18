const mongoose = require("mongoose");
const variantSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    size: { type: String, required: true },
    color: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true },
    image: { type: [String], required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const Variant = mongoose.model("variants", variantSchema);
module.exports = Variant;
