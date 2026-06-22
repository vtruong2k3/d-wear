const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'controllers/order.controller.js');
let content = fs.readFileSync(file, 'utf8');

// Add mongoose import if missing
if (!content.includes('const mongoose = require("mongoose");')) {
    content = 'const mongoose = require("mongoose");\n' + content;
}

// Refactor createOrder
// Add session
content = content.replace(/exports\.createOrder = async \(req, res\) => \{\n\s*try \{/g, `exports.createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {`);

content = content.replace(/await Voucher\.findByIdAndUpdate\(voucher_id, \{/g, `await Voucher.findByIdAndUpdate(voucher_id, {`); // no change yet

// Order create
content = content.replace(/const newOrder = await Order\.create\(\{([\s\S]*?)\}\);/g, `const newOrderArray = await Order.create([{ $1 }], { session });\n    const newOrder = newOrderArray[0];`);

// OrderItem create
content = content.replace(/const orderItem = await OrderItem\.create\(\{([\s\S]*?)\}\);/g, `const orderItemArray = await OrderItem.create([{ $1 }], { session });\n        const orderItem = orderItemArray[0];`);

// newOrder.save
content = content.replace(/await newOrder\.save\(\);/g, `await newOrder.save({ session });`);

// Cart deleteMany
content = content.replace(/await Cart\.deleteMany\(\{([\s\S]*?)\}\);/g, `await Cart.deleteMany({ $1 }, { session });`);

// Variant update
content = content.replace(/const updated = await Variant\.findOneAndUpdate\(\n\s*\{ _id: item\.variant_id, stock: \{ \$gte: item\.quantity \} \},\n\s*\{ \$inc: \{ stock: -item\.quantity \} \}\n\s*\);/g, `const updated = await Variant.findOneAndUpdate(
          { _id: item.variant_id, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { session }
        );`);

// End session on success
content = content.replace(/return res\.status\(201\)\.json\(\{([\s\S]*?)\}\);/g, `await session.commitTransaction();\n    session.endSession();\n    return res.status(201).json({$1});`);

// End session on error inside try
content = content.replace(/return res\n\s*\.status\(400\)/g, `await session.abortTransaction();\n        session.endSession();\n        return res.status(400)`);
content = content.replace(/return res\.status\(400\)\.json/g, `await session.abortTransaction();\n      session.endSession();\n      return res.status(400).json`);

// Catch error
content = content.replace(/catch \(error\) \{\n\s*console\.error\("Lỗi tạo đơn hàng:"/g, `catch (error) {\n    await session.abortTransaction();\n    session.endSession();\n    console.error("Lỗi tạo đơn hàng:"`);

fs.writeFileSync(file, content);
console.log("Refactored createOrder");
