const Category = require("../models/categories");
const categoryValidate = require("../validate/categoryValidate");

exports.createCategory = async (req, res) => {
  try {
    // validate req.body
    const { error } = categoryValidate.create.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }
    const { category_name } = req.body;
    // Kiểm tra category_name đã tồn tại hay chưa
    const existingCategory = await Category.findOne({ category_name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category đã tồn tại" });
    }
    // Tạo mới category
    const newCategory = await Category.create({ category_name });
    res
      .status(201)
      .json({ message: "Tạo Category thành công", data: newCategory });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res
      .status(200)
      .json({ message: "Lấy danh sách Category thành công", data: categories });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({ message: "ID không được để trống" });
    }
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category không tồn tại" });
    }
    res
      .status(200)
      .json({ message: "Lấy Category thành công", data: category });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
exports.updateCategory = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "ID không được để trống" });
  }

  try {
    // Validate đầu vào
    const { error } = categoryValidate.update.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }

    const { category_name } = req.body;

    // Kiểm tra trùng tên category (ngoại trừ chính nó)
    const existingCategory = await Category.findOne({ category_name });

    if (existingCategory && existingCategory._id.toString() !== id) {
      return res.status(400).json({ message: "Category đã tồn tại" });
    }

    // Cập nhật
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { category_name },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category không tồn tại" });
    }

    res.status(200).json({
      message: "Cập nhật Category thành công",
      data: updatedCategory,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({ message: "ID không được để trống" });
    }
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category không tồn tại" });
    }
    res
      .status(200)
      .json({ message: "Xoá Category thành công", data: deletedCategory });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
