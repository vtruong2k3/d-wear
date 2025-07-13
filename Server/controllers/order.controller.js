const OrderItem = require("../models/orderItems");
const Order = require("../models/orders");

const { getIO } = require("../sockets/socketManager");
const Voucher = require("../models/vouchers");
const sendOrderConfirmationEmail = require("../utils/sendEmail");
const { generateOrderCode } = require("../utils/orderCode");
const Cart = require("../models/carts");
const Variant = require("../models/variants");
const { createOrderSchema } = require("../validate/orderValidate");

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status: newStatus } = req.body;

    if (!newStatus) {
      return res.status(400).json({ message: "Trạng thái là bắt buộc" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    const currentStatus = order.status;

    // ✅ Các trạng thái được phép chuyển tiếp
    const validTransitions = {
      pending: ["processing", "cancelled"],
      processing: ["shipped", "cancelled"],
      shipped: ["delivered"],
      delivered: [],
      cancelled: [],
    };

    const allowedStatuses = validTransitions[currentStatus] || [];

    if (!allowedStatuses.includes(newStatus)) {
      return res.status(400).json({
        message: `Không thể chuyển trạng thái từ "${currentStatus}" sang "${newStatus}"`,
      });
    }

    // ✅ Cập nhật trạng thái
    order.status = newStatus;
    await order.save();

    // 🔥 Gửi socket để client cập nhật real-time
    const io = getIO();
    io.to(id).emit("orderStatusUpdate", {
      orderId: id,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });

    return res.json({
      message: "Cập nhật trạng thái đơn hàng thành công",
      orderId: id,
      status: newStatus,
    });
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật trạng thái:", error.message);
    return res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
};

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
exports.getOrderByIdAdmin = async (req, res) => {
  try {
    const orderId = req.params.id;

    // Lấy đơn hàng theo id
    const order = await Order.findById(orderId).lean();

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
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
    const { error } = createOrderSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ",
        details: error.details.map((err) => err.message),
      });
    }

    const {
      user_id,
      items,
      voucher_id,
      paymentMethod,
      receiverName,
      shippingAddress,
      phone,
      note,
      email,
    } = req.body;

    const emailUser = email || req.user?.email;
    const userId = req.user?.id || user_id;

    if (!userId || !items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Thiếu thông tin đơn hàng hoặc người dùng." });
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

      const alreadyUsed = voucher.usedUsers?.some(
        (usedId) => usedId.toString() === userId.toString()
      );
      if (alreadyUsed) {
        return res
          .status(400)
          .json({ message: "Bạn đã sử dụng voucher này rồi." });
      }

      if (voucher.maxUser > 0 && voucher.maxUser <= 0) {
        return res
          .status(400)
          .json({ message: "Voucher đã hết lượt sử dụng." });
      }

      if (total < voucher.minOrderValue) {
        return res.status(400).json({
          message: `Đơn hàng phải đạt tối thiểu ${voucher.minOrderValue.toLocaleString()}₫ để áp dụng voucher.`,
        });
      }

      if (voucher.discountType === "percentage") {
        discount = (total * voucher.discountValue) / 100;
        if (voucher.maxDiscountValue > 0) {
          discount = Math.min(discount, voucher.maxDiscountValue);
        }
      } else {
        discount = voucher.discountValue;
      }

      // Cập nhật voucher
      await Voucher.findByIdAndUpdate(voucher_id, {
        $inc: { maxUser: -1 },
        $addToSet: { usedUsers: userId },
      });
    }

    const finalAmount = total - discount;

    // Tạo Order
    const newOrder = await Order.create({
      user_id: userId,
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

    // Xoá item khỏi giỏ hàng
    await Cart.deleteMany({
      user_id: user_id,
      variant_id: { $in: items.map((item) => item.variant_id) },
    });
    console.log("🗑 Đã xoá các biến thể khỏi giỏ hàng.");

    // Cập nhật tồn kho
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
    console.log("📦 Tồn kho đã được cập nhật.");

    // Gửi email
    try {
      if (emailUser) {
        await sendOrderConfirmationEmail(emailUser, newOrder);
      }
    } catch (emailError) {}

    // Emit socket
    const io = getIO();
    io.to("admin").emit("newOrder", { orders: newOrder });
    io.to("user").emit("newOrder", { orders: newOrder });

    return res.status(201).json({
      message: "Tạo đơn hàng thành công",
      order: newOrder,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
