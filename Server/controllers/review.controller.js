const OrderItem = require("../models/orderItems");
const Order = require("../models/orders");
const Product = require("../models/products");
const Review = require("../models/reviews");
const User = require("../models/users");
const { reviewSchema } = require("../validate/reivewValidate");

exports.reviewOrderProduct = async (req, res) => {
  try {
    const { error } = reviewSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ",
        details: error.details.map((err) => err.message),
      });
    }
    const user_id = req.user.id;
    const { product_id, order_id, rating, comment } = req.body;

    // 1. Kiểm tra đơn hàng có tồn tại và đã giao
    const order = await Order.findOne({ _id: order_id, user_id });
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
    }

    if (order.status !== "delivered") {
      return res.status(400).json({ message: "Đơn hàng chưa được giao." });
    }

    // 2. Kiểm tra sản phẩm có nằm trong đơn hàng (dựa vào orderitems)
    const itemInOrder = await OrderItem.findOne({ order_id, product_id });
    if (!itemInOrder) {
      return res
        .status(400)
        .json({ message: "Sản phẩm không thuộc đơn hàng." });
    }

    // 3. Kiểm tra đã đánh giá sản phẩm này trong đơn hàng này chưa
    const existedReview = await Review.findOne({
      user_id,
      order_id,
      product_id,
    });
    if (existedReview) {
      return res.status(400).json({
        message: "Bạn đã đánh giá sản phẩm này trong đơn hàng này rồi.",
      });
    }

    // 4. Xử lý ảnh
    const images =
      req.files?.reviewImage?.map(
        (file) => `/uploads/review/${file.filename}`
      ) || [];

    // 5. Tạo đánh giá
    const newReview = await Review.create({
      user_id,
      product_id,
      order_id,
      rating,
      comment,
      images,
    });

    return res.status(201).json({
      message: "Đánh giá thành công.",
      review: newReview,
    });
  } catch (error) {
    console.error("Lỗi khi đánh giá:", error.message);
    return res.status(500).json({
      message: "Lỗi server.",
      error: error.message,
    });
  }
};

exports.getAllReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const extingProduct = await Product.findById(productId);
    if (!extingProduct) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }
    const reviews = await Review.find({ product_id: productId })
      .populate("user_id", "username avatar")
      .sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server.",
      error: error.message,
    });
  }
};
