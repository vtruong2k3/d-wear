// controllers/size.controller.js
const Size = require("../models/sizeProduct");
const sizeValidate = require("../validate/sizeValidate");

exports.createSize = async (req, res) => {
  try {
    console.log(req.body);
    // Validate dữ liệu
    const { error } = sizeValidate.create.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }

    // Chuẩn hoá tên size (loại khoảng trắng)
    const size_name = req.body.size_name.trim();

    // Kiểm tra trùng
    const existing = await Size.findOne({
      size_name: { $regex: new RegExp(`^${size_name}$`, "i") },
    });
    if (existing) {
      return res.status(400).json({ message: "Size đã tồn tại" });
    }

    // Tạo mới
    const newSize = await Size.create({ size_name });

    return res
      .status(201)
      .json({ message: "Tạo size thành công", data: newSize });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

exports.getAllSizes = async (req, res) => {
  try {
    // Lấy page và limit từ query, nếu không có thì mặc định
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const [sizes, total] = await Promise.all([
      Size.find().skip(skip).limit(limit),
      Size.countDocuments(),
    ]);

    return res.status(200).json({
      message: "Lấy danh sách size thành công",
      size: sizes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

exports.getSizeById = async (req, res) => {
  const { id } = req.params;
  try {
    const size = await Size.findById(id);
    if (!size) {
      return res.status(404).json({ message: "Size không tồn tại" });
    }
    return res.status(200).json({ message: "Lấy size thành công", data: size });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

exports.updateSize = async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = sizeValidate.update.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }

    const { size_name } = req.body;
    const existing = await Size.findOne({ size_name: size_name.trim() });

    if (existing && existing._id.toString() !== id) {
      return res.status(400).json({ message: "Size đã tồn tại" });
    }

    const updated = await Size.findByIdAndUpdate(
      id,
      { size_name: size_name.trim() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Size không tồn tại" });
    }

    return res
      .status(200)
      .json({ message: "Cập nhật size thành công", data: updated });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

exports.deleteSize = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Size.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Size không tồn tại" });
    }
    return res
      .status(200)
      .json({ message: "Xoá size thành công", data: deleted });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};
