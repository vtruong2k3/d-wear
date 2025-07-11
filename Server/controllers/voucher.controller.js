const Voucher = require("../models/vouchers");
const voucherValidate = require("../validate/voucherValidate");

// POST /api/voucher/check
exports.checkVoucher = async (req, res) => {
  try {
    const { code, total } = req.body;
    const userId = req.user?.id || req.body.user_id;

    if (!code || typeof total !== "number") {
      return res
        .status(400)
        .json({ message: "Thiếu mã hoặc tổng tiền không hợp lệ" });
    }

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Không xác định được người dùng" });
    }

    const voucher = await Voucher.findOne({ code });

    if (!voucher || !voucher.isActive) {
      return res
        .status(400)
        .json({ message: "Voucher không hợp lệ hoặc bị vô hiệu" });
    }

    const now = new Date();
    if (now < voucher.startDate || now > voucher.endDate) {
      return res.status(400).json({ message: "Voucher đã hết hạn" });
    }

    // ✅ Check nếu user đã từng dùng
    const alreadyUsed = voucher.usedUsers?.some(
      (usedId) => usedId.toString() === userId.toString()
    );

    if (alreadyUsed) {
      return res
        .status(400)
        .json({ message: "Bạn đã sử dụng voucher này rồi" });
    }

    if (voucher.maxUser > 0 && voucher.maxUser <= 0) {
      return res.status(400).json({ message: "Voucher đã hết lượt sử dụng" });
    }

    if (total < voucher.minOrderValue) {
      return res.status(400).json({
        message: `Đơn hàng phải từ ${voucher.minOrderValue.toLocaleString()}₫ để áp dụng voucher`,
      });
    }

    let discount = 0;
    if (voucher.discountType === "percentage") {
      discount = (total * voucher.discountValue) / 100;
      if (voucher.maxDiscountValue > 0) {
        discount = Math.min(discount, voucher.maxDiscountValue);
      }
    } else {
      discount = voucher.discountValue;
    }

    return res.status(200).json({
      message: "Voucher hợp lệ",
      discount,
      discountType: voucher.discountType,
      voucher_id: voucher._id,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server khi kiểm tra voucher",
      error: error.message,
    });
  }
};

exports.createVoucher = async (req, res) => {
  try {
    const { error } = voucherValidate.create.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }
    const {
      code,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscountValue,
      maxUser,
      startDate,
      endDate,
      isActive,
    } = req.body;

    // Kiểm tra trùng mã voucher
    const existVoucher = await Voucher.findOne({ code });
    if (existVoucher) {
      return res.status(400).json({ message: "Mã voucher đã tồn tại." });
    }

    const voucher = await Voucher.create({
      code,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscountValue,
      maxUser,
      startDate,
      endDate,
      isActive,
    });

    return res.status(201).json({
      message: "Thêm voucher thành công",
      voucher,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.getAllVouchers = async (req, res) => {
  try {
    // Mặc định: page = 1, limit = 10
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    // Lấy danh sách voucher + tổng số
    const [vouchers, total] = await Promise.all([
      Voucher.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      Voucher.countDocuments(),
    ]);

    res.status(200).json({
      message: "Lấy voucher thành công",
      vouchers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.getVoucherById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ message: "ID không được để trống" });
    }
    const voucher = await Voucher.findById(id);
    res.status(200).json({
      message: "Lấy Voucher thành công.",
      data: voucher,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.updateVoucher = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "ID không được để trống" });
  }
  try {
    const { error } = voucherValidate.update.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }
    const {
      code,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscountValue,
      maxUser,
      startDate,
      endDate,
      isActive,
    } = req.body;

    // const existVoucher = await Voucher.findOne({ code });
    // if (existVoucher) {
    //   return res.status(400).json({ message: "Voucher đã tồn tại" });
    // }

    const voucher = await Voucher.findByIdAndUpdate(
      id,
      {
        code,
        discountType,
        discountValue,
        minOrderValue,
        maxDiscountValue,
        maxUser,
        startDate,
        endDate,
        isActive,
      },
      { new: true }
    );
    res.status(200).json({
      message: "Update thành công. ",
      voucher,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.deleteVoucher = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "ID không được để trống" });
  }
  try {
    await Voucher.findByIdAndDelete(id);
    res.status(200).json({
      message: "Xoá thành công.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
