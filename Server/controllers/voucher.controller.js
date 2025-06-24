const Voucher = require("../models/vouchers");
const voucherValidate = require("../validate/voucherValidate");

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
    const vouchers = await Voucher.find();
    res.status(200).json({
      message: "Lấy voucher thành công",
      data: vouchers,
    });
  } catch (error) {
    return res.status(500).json({
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

    const existVoucher = await Voucher.findOne({ code });
    if (existVoucher) {
      return res.status(400).json({ message: "Voucher đã tồn tại" });
    }

    const vouher = await Voucher.findByIdAndUpdate(
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
      data: vouher,
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
