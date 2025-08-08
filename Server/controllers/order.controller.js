const OrderItem = require("../models/orderItems");
const Order = require("../models/orders");
const dayjs = require("dayjs");
const { getIO } = require("../sockets/socketManager");
const Voucher = require("../models/vouchers");
const sendOrderConfirmationEmail = require("../utils/sendEmail");
const { generateOrderCode } = require("../utils/orderCode");
const Cart = require("../models/carts");
const Variant = require("../models/variants");
const { createOrderSchema } = require("../validate/orderValidate");
const sendOrderCancellationEmail = require("../utils/sendOrderCancellationEmail");
const sendOrderStatusUpdateEmail = require("../utils/updateSendEmail");
const Review = require("../models/reviews");
const User = require("../models/users");

exports.adminCancelOrder = async (req, res) => {
  try {
    const order_id = req.params.id;
    const { reason } = req.body;

    // Lấy thông tin đơn hàng
    const order = await Order.findById(order_id).lean();
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Nếu đơn hàng đã giao hoặc đã huỷ thì không cho huỷ nữa
    if (["delivered", "cancelled"].includes(order.status)) {
      return res.status(400).json({
        message: "Đơn hàng này không thể huỷ",
      });
    }

    // Cập nhật trạng thái đơn hàng
    const updatedOrder = await Order.findByIdAndUpdate(
      order_id,
      {
        status: "cancelled",
        cancellationReason: reason || "Admin huỷ đơn hàng",
      },
      { new: true }
    ).lean();

    // Lấy danh sách sản phẩm từ OrderItem
    const orderItems = await OrderItem.find({ order_id })
      .populate("product_id", "product_name")
      .populate("variant_id", "size color image")
      .lean();

    // Chuẩn hoá danh sách item
    const items = orderItems.map((item) => {
      const variant = item.variant_id;
      const product = item.product_id;

      const rawImage = Array.isArray(variant?.image)
        ? variant.image[0]
        : variant?.image;
      const imagePath = rawImage?.replace(/\\/g, "/");
      const fullImageUrl = imagePath
        ? `https://a85ff2e29d03.ngrok-free.app/${imagePath}`
        : "";

      return {
        name: product?.product_name || "Sản phẩm",
        image: fullImageUrl,
        color: variant?.color || "-",
        size: variant?.size || "-",
        quantity: item.quantity,
        price: item.price,
      };
    });

    // Emit socket để client cập nhật real-time
    const io = getIO();
    io.to(order_id).emit("cancelOrder", {
      orderId: order_id,
      order_code: updatedOrder.order_code,
      status: updatedOrder.status,
      cancellationReason: updatedOrder.cancellationReason,
      updatedAt: updatedOrder.updatedAt,
    });

    // Gửi email thông báo cho khách hàng
    const email =
      order.email ||
      (order.user_id &&
        (await User.findById(order.user_id).select("email")).email);
    if (email) {
      try {
        await sendOrderCancellationEmail(email, {
          ...updatedOrder,
          items,
          receiverName: order.receiverName,
          phone: order.phone,
          shippingAddress: order.shippingAddress,
          paymentMethod: order.paymentMethod,
          finalAmount: order.finalAmount,
          createdAt: order.createdAt,
        });
      } catch (mailErr) {
        console.error("Lỗi khi gửi email huỷ đơn hàng:", mailErr.message);
      }
    }

    res.status(200).json({
      message: "Admin huỷ đơn hàng thành công",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Lỗi khi admin huỷ đơn hàng:", error.message);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order_id = req.params.id;
    const userId = req.user.id;
    const { reason } = req.body;

    const order = await Order.findById(order_id).lean();

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    if (order.user_id.toString() !== userId) {
      return res.status(403).json({
        message: "Bạn không có quyền hủy đơn hàng này",
      });
    }

    // Cập nhật trạng thái đơn hàng
    const updatedOrder = await Order.findByIdAndUpdate(
      order_id,
      {
        status: "cancelled",
        cancellationReason: reason,
        updatedAt: new Date(),
      },
      { new: true }
    ).lean();

    // 🔍 Lấy danh sách sản phẩm từ OrderItem
    const orderItems = await OrderItem.find({ order_id })
      .populate("product_id", "product_name")
      .populate("variant_id", "size color image")
      .lean();

    // 🛠 Chuẩn hoá danh sách item để gửi email
    const items = orderItems.map((item) => {
      const variant = item.variant_id;
      const product = item.product_id;

      const rawImage = Array.isArray(variant?.image)
        ? variant.image[0]
        : variant?.image;
      const imagePath = rawImage?.replace(/\\/g, "/");
      const fullImageUrl = imagePath
        ? `https://a85ff2e29d03.ngrok-free.app/${imagePath}`
        : "";

      return {
        name: product?.product_name || "Sản phẩm",
        image: fullImageUrl,
        color: variant?.color || "-",
        size: variant?.size || "-",
        quantity: item.quantity,
        price: item.price,
      };
    });
    // Emit socket
    const io = getIO();
    io.to(order_id).emit("cancelOrder", {
      orderId: order_id,
      order_code: updatedOrder.order_code,
      status: updatedOrder.status,
      cancellationReason: updatedOrder.cancellationReason,
      updatedAt: updatedOrder.updatedAt,
    });

    const email = order.email || req.user.email;

    // 📨 Gửi email huỷ đơn hàng
    try {
      await sendOrderCancellationEmail(email, {
        ...updatedOrder,
        items, // danh sách sản phẩm từ OrderItem
        receiverName: order.receiverName,
        phone: order.phone,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        finalAmount: order.finalAmount,
        createdAt: order.createdAt,
      });
    } catch (mailErr) {
      console.error("Lỗi khi gửi email huỷ đơn hàng:", mailErr.message);
    }

    res.status(200).json({
      message: "Hủy đơn hàng thành công",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Lỗi khi hủy đơn hàng:", error.message);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

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

    // Nếu là "delivered", cập nhật cả paymentStatus
    const updateFields = {
      status: newStatus,
    };
    if (newStatus === "delivered") {
      updateFields.paymentStatus = "paid";
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    // Gửi email cập nhật trạng thái
    await sendOrderStatusUpdateEmail(updatedOrder.email, updatedOrder);

    // Gửi socket thông báo
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
    console.error(" Lỗi khi cập nhật trạng thái:", error.message);
    return res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
};

exports.getAllOrder = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const keyword = req.query.q?.trim() || "";
    const status = req.query.status || "";
    const date = req.query.date || "";
    const sortQuery = req.query.sort || "";

    const filter = {};
    console.log("timkiem", keyword);

    // Tìm kiếm theo mã đơn hàng hoặc tên người nhận
    if (keyword) {
      filter.$or = [
        { order_code: { $regex: keyword, $options: "i" } },
        { receiverName: { $regex: keyword, $options: "i" } },
        { phone: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
      ];
    }

    // Lọc theo trạng thái đơn hàng
    if (status) {
      filter.status = status;
    }

    // Lọc theo ngày tạo đơn hàng
    if (date) {
      const parsedDate = dayjs(date, "DD/MM/YYYY");
      const startOfDay = parsedDate.startOf("day").toDate();
      const endOfDay = parsedDate.endOf("day").toDate();

      filter.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    // Sắp xếp
    let sort = { createdAt: -1 }; // mặc định: mới nhất
    if (sortQuery === "low-to-high") {
      sort = { finalAmount: 1 };
    } else if (sortQuery === "high-to-low") {
      sort = { finalAmount: -1 };
    }

    // Đếm tổng số đơn hàng
    const total = await Order.countDocuments(filter);

    // Lấy danh sách đơn hàng
    const orders = await Order.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      message: "Lấy danh sách đơn hàng thành công",
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      orders,
    });
  } catch (error) {
    console.error("Lỗi khi lấy tất cả đơn hàng:", error);
    return res.status(500).json({
      message: "Lỗi server",
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
    const orderItems = await OrderItem.find({ order_id: orderId }).lean();

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
    const user = await User.findById(order.user_id);

    // Lấy chi tiết sản phẩm trong đơn
    const orderItems = await OrderItem.find({ order_id: orderId }).lean();

    return res.status(200).json({
      message: "Lấy chi tiết đơn hàng thành công",
      order,
      orderItems,
      user,
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
      shippingFee,
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

      await Voucher.findByIdAndUpdate(voucher_id, {
        $inc: { maxUser: -1 },
        $addToSet: { usedUsers: userId },
      });
    }

    const finalAmount = total - discount + shippingFee;

    if (finalAmount < 0) {
      return res.status(400).json({
        message: "Giá trị đơn hàng không hợp lệ.",
      });
    }
    // Tạo đơn hàng
    const newOrder = await Order.create({
      user_id: userId,
      order_code: generateOrderCode(),
      voucher_id: voucher_id || null,
      total,
      email: emailUser,
      discount,
      finalAmount,
      paymentMethod,
      receiverName,
      shippingAddress,
      phone,
      note,
      shippingFee,
    });

    // Tạo các item
    const orderItemIds = [];
    await Promise.all(
      items.map(async (item) => {
        const orderItem = await OrderItem.create({
          order_id: newOrder._id,
          product_id: item.product_id,
          product_name: item.product_name,
          product_image: item.product_image,
          variant_id: item.variant_id,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.price,
        });
        orderItemIds.push(orderItem._id);
      })
    );

    newOrder.orderItems = orderItemIds;
    await newOrder.save();

    // Xoá giỏ hàng
    await Cart.deleteMany({
      user_id: userId,
      variant_id: { $in: items.map((item) => item.variant_id) },
    });

    // Trừ tồn kho
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

    // Gửi email xác nhận đơn hàng
    try {
      if (emailUser && newOrder?.paymentMethod === "cod") {
        const orderItems = await OrderItem.find({
          order_id: newOrder._id,
        });

        const populatedItems = orderItems.map((item) => {
          let fullImageUrl = "";

          if (item.product_image?.startsWith("http")) {
            // Trường hợp đã là full URL (ví dụ: http://localhost:5000/...)
            fullImageUrl = item.product_image;
          } else if (item.product_image) {
            // Trường hợp là đường dẫn tương đối (ví dụ: uploads/products/...)
            const imagePath = item.product_image.replace(/\\/g, "/");
            fullImageUrl = `${process.env.BASE_URL}/${imagePath}`;
          }

          return {
            name: item.product_name || "Sản phẩm",
            image: fullImageUrl,
            color: item.color || "-",
            size: item.size || "-",
            quantity: item.quantity,
            price: item.price,
          };
        });

        await sendOrderConfirmationEmail(emailUser, {
          ...newOrder.toObject(),
          items: populatedItems,
        });
      }
    } catch (emailError) {
      console.error("Gửi email thất bại:", emailError.message);
    }

    // Emit socket
    const io = getIO();

    io.to("admin").emit("newOrder", { orders: newOrder });

    io.to("user").emit("newOrder", { orders: newOrder });

    return res.status(201).json({
      message: "Đặt hàng thành công - Chờ xác nhận",
      order_id: newOrder._id,
      finalAmount: newOrder.finalAmount,
      paymentMethod: newOrder.paymentMethod,
    });
  } catch (error) {
    console.error("Lỗi tạo đơn hàng:", error.message);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.getUserProductOrdersForReview = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { productId } = req.params;

    // 1. Lấy các đơn hàng đã giao thành công của user
    const deliveredOrders = await Order.find({ user_id, status: "delivered" });
    const deliveredOrderIds = deliveredOrders.map((order) => order._id);

    if (deliveredOrderIds.length === 0) {
      return res.json({
        canReview: false,
        order_id: null,
      });
    }

    // 2. Lấy các OrderItem chứa productId trong các đơn hàng đã giao
    const relatedOrderItems = await OrderItem.find({
      order_id: { $in: deliveredOrderIds },
      product_id: productId,
    });

    if (relatedOrderItems.length === 0) {
      return res.json({
        canReview: false,
        order_id: null,
      });
    }

    const orderIdsWithProduct = relatedOrderItems.map((item) =>
      item.order_id.toString()
    );

    // 3. Tìm các review đã viết theo từng đơn hàng cho sản phẩm đó
    const existingReviews = await Review.find({
      user_id,
      product_id: productId,
      order_id: { $in: orderIdsWithProduct },
    });

    const reviewedOrderIds = existingReviews.map((r) => r.order_id.toString());

    // 4. Lọc ra các đơn chưa review sản phẩm này
    const notYetReviewedOrderIds = orderIdsWithProduct.filter(
      (id) => !reviewedOrderIds.includes(id)
    );

    return res.json({
      canReview: notYetReviewedOrderIds.length > 0,
      order_id: notYetReviewedOrderIds[0] || null,
    });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};
