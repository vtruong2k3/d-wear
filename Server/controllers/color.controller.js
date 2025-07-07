const Color = require("../models/colorProduct");
const colorValidate = require("../validate/colorValidate");

// Tạo màu
exports.createColor = async (req, res) => {
  try {
    const { error } = colorValidate.create.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map(err => err.message);
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }

    const { color_name } = req.body;

    const existingColor = await Color.findOne({ color_name });
    if (existingColor) {
      return res.status(400).json({ message: "Color đã tồn tại" });
    }

    const newColor = await Color.create({ color_name });
    return res.status(201).json({ message: "Tạo Color thành công", data: newColor });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Lấy tất cả màu
exports.getAllColors = async (req, res) => {
  try {
    const colors = await Color.find();
    return res.status(200).json({ message: "Lấy danh sách Color thành công", data: colors });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
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
    return res.status(200).json({ message: "Lấy Color thành công", data: color });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Cập nhật màu
exports.updateColor = async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = colorValidate.update.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map(err => err.message);
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }

    const { color_name } = req.body;

    const existingColor = await Color.findOne({ color_name });
    if (existingColor && existingColor._id.toString() !== id) {
      return res.status(400).json({ message: "Color đã tồn tại" });
    }

    const updatedColor = await Color.findByIdAndUpdate(id, { color_name }, { new: true });
    if (!updatedColor) {
      return res.status(404).json({ message: "Color không tồn tại" });
    }

    return res.status(200).json({ message: "Cập nhật Color thành công", data: updatedColor });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
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
    return res.status(200).json({ message: "Xoá Color thành công", data: deletedColor });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
