const Voucher = require("../models/vouchers");
const voucherValidate = require("../validate/voucherValidate");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

// POST /api/voucher/check
exports.checkVoucher = async (req, res) => {
  try {
    const { code, total } = req.body;
    const userId = req.user?.id || req.body.user_id;

    if (!code || typeof code !== "string") {
      return res.status(400).json({ message: "Mã voucher không hợp lệ" });
    }

    if (typeof total !== "number" || total <= 0) {
      return res.status(400).json({ message: "Tổng tiền không hợp lệ" });
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
        .json({ message: "Voucher không tồn tại hoặc đã bị vô hiệu hóa" });
    }

    //  Thời gian hiện tại theo Việt Nam
    const nowVN = dayjs().tz("Asia/Ho_Chi_Minh");

    const startVN = dayjs(voucher.startDate).tz("Asia/Ho_Chi_Minh");
    const endVN = dayjs(voucher.endDate).tz("Asia/Ho_Chi_Minh");

    if (nowVN.isBefore(startVN)) {
      return res.status(400).json({ message: "Voucher chưa bắt đầu áp dụng" });
    }

    if (nowVN.isAfter(endVN)) {
      return res.status(400).json({ message: "Voucher đã hết hạn" });
    }

    //  Kiểm tra đã dùng chưa
    const alreadyUsed = voucher.usedUsers?.some(
      (usedId) => usedId.toString() === userId.toString()
    );

    if (alreadyUsed) {
      return res
        .status(400)
        .json({ message: "Bạn đã sử dụng voucher này rồi" });
    }

    //  Kiểm tra số lượt tối đa
    if (typeof voucher.maxUser === "number" && voucher.maxUser > 0) {
      const usedCount = voucher.usedUsers?.length || 0;
      if (usedCount >= voucher.maxUser) {
        return res.status(400).json({ message: "Voucher đã hết lượt sử dụng" });
      }
    }

    // Kiểm tra giá trị tối thiểu
    if (total < voucher.minOrderValue) {
      const formattedMin = new Intl.NumberFormat("vi-VN").format(
        voucher.minOrderValue
      );
      return res.status(400).json({
        message: `Đơn hàng phải từ ${formattedMin}₫ để áp dụng voucher`,
      });
    }

    //  Tính giảm giá
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
      startDate: dayjs(req.body.startDate)
        .tz("Asia/Ho_Chi_Minh")
        .utc()
        .toDate(),
      endDate: dayjs(req.body.endDate).tz("Asia/Ho_Chi_Minh").utc().toDate(),
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object từ query params
    const filter = {};

    // Tìm kiếm theo mã voucher
    if (req.query.keyword && req.query.keyword.trim()) {
      filter.code = { $regex: req.query.keyword.trim(), $options: "i" };
    }

    // Lọc theo loại giảm giá
    if (req.query.discountType && req.query.discountType !== "all") {
      filter.discountType = req.query.discountType;
    }

    // Lọc theo trạng thái
    if (req.query.isActive !== undefined && req.query.isActive !== "all") {
      filter.isActive = req.query.isActive === "true";
    }

    // Lấy danh sách voucher + tổng số (đã filter)
    const [vouchers, total] = await Promise.all([
      Voucher.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Voucher.countDocuments(filter),
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

    // Kiểm tra trùng mã voucher (loại trừ chính voucher đang sửa)
    if (code) {
      const existVoucher = await Voucher.findOne({ code, _id: { $ne: id } });
      if (existVoucher) {
        return res.status(400).json({ message: "Mã voucher đã tồn tại" });
      }
    }

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

    if (!voucher) {
      return res.status(404).json({ message: "Voucher không tồn tại" });
    }

    res.status(200).json({
      message: "Cập nhật voucher thành công",
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
    const deleted = await Voucher.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Voucher không tồn tại" });
    }
    res.status(200).json({
      message: "Xoá voucher thành công",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// GET /api/voucher/stats
exports.getVoucherStats = async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const [total, active, inactive, expired, expiringSoon] = await Promise.all([
      Voucher.countDocuments(),
      Voucher.countDocuments({ isActive: true, endDate: { $gte: now } }),
      Voucher.countDocuments({ isActive: false }),
      Voucher.countDocuments({ endDate: { $lt: now } }),
      Voucher.countDocuments({
        isActive: true,
        endDate: { $gte: now, $lte: sevenDaysLater },
      }),
    ]);

    res.status(200).json({
      total,
      active,
      inactive,
      expired,
      expiringSoon,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
