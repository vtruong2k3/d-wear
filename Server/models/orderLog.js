const mongoose = require("mongoose");

const orderLogSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orders",
      required: true,
    },
    action: { type: String, required: true },
    message: { type: String },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("orderlogs", orderLogSchema);
