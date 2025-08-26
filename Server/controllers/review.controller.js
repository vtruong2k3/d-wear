const OrderItem = require("../models/orderItems");
const Order = require("../models/orders");
const Product = require("../models/products");
const ReviewReply = require("../models/reviewReply");
const Review = require("../models/reviews");
const User = require("../models/users");
const { reviewSchema } = require("../validate/reivewValidate");
const dayjs = require("dayjs");
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
    const { productId } = req.params;
    const extingProduct = await Product.findById(productId);
    if (!extingProduct) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    const reviews = await Review.find({
      product_id: productId,
      is_approved: true,
    })
      .populate("user_id", "username avatar") // Giữ nguyên populate cho user của review
      .sort({ createdAt: -1 })
      // THÊM POPULATE CHO TRƯỜNG ẢO 'replies'
      .populate({
        path: "replies",
        // Populate lồng để lấy thông tin user cho mỗi reply
        populate: {
          path: "user_id",
          select: "username avatar", // Lấy các trường bạn muốn
        },
      });

    res.status(200).json(reviews);
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server.",
      error: error.message,
    });
  }
};

exports.getAllReviewAdmin = async (req, res) => {
  try {
    // 0) Paging & query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const {
      is_approved, // "true" | "false"
      rating, // số nguyên
      hasReply, // "true" | "false"
      startDate, // YYYY-MM-DD
      endDate, // YYYY-MM-DD
      keyword, // tìm theo comment OR user.username OR product.product_name
    } = req.query;

    // 1) Điều kiện match ban đầu (chỉ field thuộc review)
    const matchConditions = {};
    if (is_approved !== undefined)
      matchConditions.is_approved = is_approved === "true";
    if (rating) matchConditions.rating = Number(rating);
    if (startDate && endDate) {
      matchConditions.createdAt = {
        $gte: dayjs(startDate).startOf("day").toDate(),
        $lte: dayjs(endDate).endOf("day").toDate(),
      };
    }

    // 2) Pipeline
    const pipeline = [
      { $match: matchConditions },

      // user: username, avatar
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
          pipeline: [{ $project: { username: 1, avatar: 1, _id: 1 } }],
        },
      },
      { $unwind: "$user" },

      // product: product_name, imageUrls
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "product",
          pipeline: [{ $project: { product_name: 1, imageUrls: 1, _id: 1 } }],
        },
      },
      { $unwind: "$product" },

      // orderitems: lấy variant đã mua (size/color/price)
      {
        $lookup: {
          from: "orderitems",
          let: { oid: "$order_id", pid: "$product_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$order_id", "$$oid"] },
                    { $eq: ["$product_id", "$$pid"] },
                  ],
                },
              },
            },
            // nếu 1 đơn có nhiều item cùng product (khác variant), lấy item mới nhất
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
            {
              $project: {
                size: 1,
                color: 1,
                price: 1,
                quantity: 1,
                variant_id: 1,
                order_id: 1,
              },
            },
          ],
          as: "orderItem",
        },
      },
      { $unwind: { path: "$orderItem", preserveNullAndEmptyArrays: true } },

      // replies + hasReply flag
      {
        $lookup: {
          from: "reviewreplies", // đổi thành "review_replies" nếu DB đặt tên như vậy
          let: { rid: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$review_id", "$$rid"] } } },
            { $sort: { createdAt: 1 } }, // cũ -> mới (đổi -1 nếu muốn mới -> cũ)
            {
              $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "user",
                pipeline: [{ $project: { _id: 1, username: 1, avatar: 1 } }],
              },
            },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: false } },
            {
              $project: {
                _id: 1,
                comment: 1,

                createdAt: 1,
                user: 1, // => { _id, username, avatar }
              },
            },
          ],
          as: "replies",
        },
      },
      { $addFields: { hasReply: { $gt: [{ $size: "$replies" }, 0] } } },

      // lọc hasReply nếu có
      ...(hasReply !== undefined
        ? [{ $match: { hasReply: hasReply === "true" } }]
        : []),

      // ---- keyword tổng hợp: comment OR user.username OR product.product_name ----
      ...(keyword
        ? [
            {
              $match: {
                $or: [
                  { comment: { $regex: keyword, $options: "i" } },
                  { "user.username": { $regex: keyword, $options: "i" } },
                  {
                    "product.product_name": { $regex: keyword, $options: "i" },
                  },
                ],
              },
            },
          ]
        : []),

      // 3) Phân trang + thống kê
      {
        $facet: {
          data: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                _id: 1,
                comment: 1,
                user_id: 1,
                product_id: 1,
                order_id: 1,
                rating: 1,
                is_approved: 1,
                createdAt: 1,
                helpful: 1,

                user: { username: 1, avatar: 1 },
                product: { product_name: 1, imageUrls: 1 },

                // thông tin variant đã mua (đúng lúc đặt hàng)
                variant: {
                  size: "$orderItem.size",
                  color: "$orderItem.color",
                  price: "$orderItem.price",
                  quantity: "$orderItem.quantity",
                },

                // giá gợi ý hiển thị: ưu tiên giá lúc mua -> salePrice -> price
                finalPrice: {
                  $ifNull: [
                    "$orderItem.price",
                    { $ifNull: ["$variant.salePrice", "$variant.price"] },
                  ],
                },

                hasReply: 1,
                repliesCount: { $size: "$replies" },
                replies: 1,
              },
            },
          ],
          stats: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                approved: {
                  $sum: { $cond: [{ $eq: ["$is_approved", true] }, 1, 0] },
                },
                notApproved: {
                  $sum: { $cond: [{ $eq: ["$is_approved", false] }, 1, 0] },
                },
                withReply: {
                  $sum: { $cond: [{ $eq: ["$hasReply", true] }, 1, 0] },
                },
                avgRating: { $avg: "$rating" },
              },
            },
            {
              $project: {
                total: 1,
                approved: 1,
                notApproved: 1,
                withReply: 1,
                avgRating: { $round: ["$avgRating", 2] },
              },
            },
          ],
        },
      },
    ];

    // 4) Thực thi
    const result = await Review.aggregate(pipeline);
    const reviews = result[0]?.data || [];
    const stats = result[0]?.stats?.[0] || {
      total: 0,
      approved: 0,
      notApproved: 0,
      withReply: 0,
      avgRating: 0,
    };

    return res.status(200).json({
      page,
      limit,
      total: stats.total,
      totalPages: Math.ceil((stats.total || 0) / limit),
      stats,
      reviews,
    });
  } catch (error) {
    console.error("Lỗi khi lấy review admin:", error);
    return res
      .status(500)
      .json({ message: "Lỗi server.", error: error.message });
  }
};

exports.reviewRely = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;
    const { comment } = req.body;
    console.log("reviewId: ", reviewId);
    console.log("comment", comment);

    const extingUser = await User.findById(userId).select("role");
    if (extingUser.role !== "admin") {
      return res.status(403).json({
        message: "Bạn không có quyền amdin để trả lời bình luận",
      });
    }
    const extingReview = await Review.findById(reviewId);
    if (!extingReview) {
      return res.status(404).json({
        message: "Bình luận không tồn tại",
      });
    }
    const reply = await ReviewReply.create({
      review_id: reviewId,
      user_id: userId,
      comment: comment.trim(),
    });
    const populated = await reply.populate({
      path: "user_id",
      select: "username avatar",
    });
    res.status(201).json({
      message: "Trả lời bình luận thành công",
      reviewReply: populated,
    });
  } catch (error) {
    console.error("Lỗi khi trả lời bình luận", error);
    return res
      .status(500)
      .json({ message: "Lỗi server.", error: error.message });
  }
};

exports.updateAppoved = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { isApproved } = req.body;
    const extingReview = await Review.findById(reviewId).select("_id");
    if (!extingReview) {
      return res.status(404).json({
        message: "Bình luận không tồn tại",
      });
    }
    await Review.findByIdAndUpdate(reviewId, {
      is_approved: isApproved,
    });
    const resMessage = isApproved
      ? "Hiện bình luận thành công"
      : "Ẩn bình luận thành công";
    res.status(200).json({ message: resMessage });
  } catch (error) {
    console.error("Lỗi khi ẩn", error);
    return res
      .status(500)
      .json({ message: "Lỗi server.", error: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const extingReview = await Review.findById(reviewId).select("_id");
    if (!extingReview) {
      return res.status(404).json({
        message: "Bình luận không tồn tại",
      });
    }
    // Xoá tất cả reply liên quan đến review này
    await ReviewReply.deleteMany({ review_id: reviewId });
    // Xoá review
    await Review.findByIdAndDelete(reviewId);
    res.status(200).json({ message: "Xoá bình luận thành công" });
  } catch (error) {
    console.error("Lỗi khi xoá", error);
    return res
      .status(500)
      .json({ message: "Lỗi server.", error: error.message });
  }
};
