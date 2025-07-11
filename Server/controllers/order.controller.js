const OrderItem = require("../models/orderItems");
const Order = require("../models/orders");

const { getIO } = require("../sockets/socketManager");
const Voucher = require("../models/vouchers");
const sendOrderConfirmationEmail = require("../utils/sendEmail");
const { generateOrderCode } = require("../utils/orderCode");
const Cart = require("../models/carts");
const Variant = require("../models/variants");

exports.getAllOrder = async (req, res) => {
  try {
    const result = await Order.find().sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      message: "Lấy tất cả đơn hàng thành công",
      orders: result,
    });
  } catch (error) {
    console.error("❌ Lỗi khi lấy tất cả đơn hàng:", error.message);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;

    // Lấy đơn hàng theo id
    const order = await Order.findById(orderId).lean();

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Nếu là user thì không được xem đơn hàng của người khác
    if (order.user_id.toString() !== userId && !req.user.isAdmin) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    // Lấy chi tiết sản phẩm trong đơn
    const orderItems = await OrderItem.find({ order_id: orderId })
      .populate("product_id", "product_name imageUrls")
      .populate("variant_id", "size color")
      .lean();

    return res.status(200).json({
      message: "Lấy chi tiết đơn hàng thành công",
      order,
      orderItems,
    });
  } catch (error) {
    console.error("❌ Lỗi getOrderById:", error.message);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
exports.getAllByIdUser = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "Không có User" });
    }
    const result = await Order.find({ user_id: userId })
      .sort({
        createdAt: -1,
      })
      .lean();
    return res.status(200).json({
      message: "Lấy đơn hàng thành công",
      orders: result,
    });
  } catch (error) {
    console.error("❌ Lỗi khi tạo đơn hàng:", error.message);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const {
      user_id,
      items,
      voucher_id,
      paymentMethod,
      receiverName,
      shippingAddress,
      phone,
      note,
      email, //  Nếu chưa dùng auth thì lấy email từ req.body
    } = req.body;

    const emailUser = req.user?.email || email; //  Ưu tiên từ JWT, fallback qua body

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Không có sản phẩm trong đơn hàng" });
    }

    // Tính tổng giá trị đơn hàng
    let total = 0;
    items.forEach((item) => {
      total += item.price * item.quantity;
    });

    let discount = 0;

    if (voucher_id) {
      const voucher = await Voucher.findById(voucher_id);

      if (!voucher || !voucher.isActive) {
        return res
          .status(400)
          .json({ message: "Voucher không hợp lệ hoặc đã bị vô hiệu hóa." });
      }

      const now = new Date();

      if (now < voucher.startDate || now > voucher.endDate) {
        return res
          .status(400)
          .json({ message: "Voucher hiện không còn hiệu lực." });
      }

      if (voucher.maxUser > 0 && voucher.maxUser <= 0) {
        return res
          .status(400)
          .json({ message: "Voucher đã hết lượt sử dụng." });
      }

      if (total < voucher.minOrderValue) {
        return res.status(400).json({
          message: `Đơn hàng phải đạt tối thiểu ${voucher.minOrderValue} để sử dụng voucher này.`,
        });
      }

      if (voucher.discountType === "percentage") {
        discount = (total * voucher.discountValue) / 100;
        if (voucher.maxDiscountValue > 0) {
          discount = Math.min(discount, voucher.maxDiscountValue);
        }
      } else if (voucher.discountType === "fixed") {
        discount = voucher.discountValue;
      }

      // Giảm số lượt sử dụng nếu cần
      if (voucher.maxUser > 0) {
        voucher.maxUser -= 1;
        await voucher.save();
      }
    }

    const finalAmount = total - discount;

    // Tạo Order
    const newOrder = await Order.create({
      user_id,
      order_code: generateOrderCode(),
      voucher_id: voucher_id || null,
      total,
      discount,
      finalAmount,
      paymentMethod,
      receiverName,
      shippingAddress,
      phone,
      note,
    });

    // Tạo OrderItems
    const orderItemIds = [];

    await Promise.all(
      items.map(async (item) => {
        const orderItem = await OrderItem.create({
          order_id: newOrder._id,
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          price: item.price,
        });
        orderItemIds.push(orderItem._id);
      })
    );

    newOrder.orderItems = orderItemIds;
    await newOrder.save();
    //  Xoá item khỏi giỏ hàng
    await Cart.deleteMany({
      user_id: user_id,
      variant_id: { $in: items.map((item) => item.variant_id) },
    });

    //  Cập nhật tồn kho
    await Promise.all(
      items.map(async (item) => {
        const updated = await Variant.findOneAndUpdate(
          { _id: item.variant_id, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } }
        );

        if (!updated) {
          throw new Error(
            `Biến thể sản phẩm ${item.variant_id} không đủ tồn kho`
          );
        }
      })
    );
    // Gửi email
    try {
      if (emailUser) {
        await sendOrderConfirmationEmail(emailUser, newOrder);
      }
    } catch (emailError) {
      console.error("❌ Lỗi khi gửi email xác nhận:", emailError.message);
    }

    // Emit socket
    const io = getIO();
    io.to("admin").emit("newOrder", { orders: newOrder });

    return res.status(201).json({
      message: "Tạo đơn hàng thành công",
      order: newOrder,
    });
  } catch (error) {
    console.error("❌ Lỗi khi tạo đơn hàng:", error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
