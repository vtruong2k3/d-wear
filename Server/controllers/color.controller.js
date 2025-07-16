const Color = require("../models/colorProduct");
const colorValidate = require("../validate/colorValidate");

// Tạo màu
exports.createColor = async (req, res) => {
  try {
    // Validate dữ liệu
    const { error } = colorValidate.create.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }

    // Chuẩn hoá tên màu
    const color_name = req.body.color_name.trim();

    // Kiểm tra trùng (không phân biệt hoa thường)
    const existingColor = await Color.findOne({
      color_name: { $regex: new RegExp(`^${color_name}$`, "i") },
    });
    if (existingColor) {
      return res.status(400).json({ message: "Color đã tồn tại" });
    }

    // Tạo mới
    const newColor = await Color.create({ color_name });

    return res.status(201).json({
      message: "Tạo Color thành công",
      data: newColor,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
};
exports.getAllColorItems = async (req, res) => {
  try {
    const colors = await Color.find();
    return res.status(200).json({
      message: "Lấy danh sách Color thành công",
      data: colors,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};
exports.getAllColors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [colors, total] = await Promise.all([
      Color.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      Color.countDocuments(),
    ]);

    return res.status(200).json({
      message: "Lấy danh sách Color thành công",
      color: colors,
      pagination: {
        total,
        page,
        limit,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

// Lấy màu theo ID
exports.getColorById = async (req, res) => {
  const { id } = req.params;
  try {
    const color = await Color.findById(id);
    if (!color) {
      return res.status(404).json({ message: "Color không tồn tại" });
    }
    return res
      .status(200)
      .json({ message: "Lấy Color thành công", data: color });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

// Cập nhật màu
exports.updateColor = async (req, res) => {
  const { id } = req.params;
  try {
    // Validate đầu vào
    const { error } = colorValidate.update.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }

    // Chuẩn hoá tên màu
    const color_name = req.body.color_name.trim();

    // Kiểm tra trùng tên (loại trừ chính nó)
    const existingColor = await Color.findOne({
      color_name: { $regex: new RegExp(`^${color_name}$`, "i") },
    });

    if (existingColor && existingColor._id.toString() !== id) {
      return res.status(400).json({ message: "Color đã tồn tại" });
    }

    // Cập nhật
    const updatedColor = await Color.findByIdAndUpdate(
      id,
      { color_name },
      { new: true }
    );

    if (!updatedColor) {
      return res.status(404).json({ message: "Color không tồn tại" });
    }

    return res
      .status(200)
      .json({ message: "Cập nhật Color thành công", data: updatedColor });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

// Xoá màu
exports.deleteColor = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedColor = await Color.findByIdAndDelete(id);
    if (!deletedColor) {
      return res.status(404).json({ message: "Color không tồn tại" });
    }
    return res
      .status(200)
      .json({ message: "Xoá Color thành công", data: deletedColor });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};
