const Category = require("../models/categories");
const categoryValidate = require("../validate/categoryValidate");

exports.createCategory = async (req, res) => {
  try {
    await categoryValidate.create.validateAsync(req.body);
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
    res.status(500).json({ message: "Server Error: ", error });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res
      .status(200)
      .json({ message: "Lấy danh sách Category thành công", data: categories });
  } catch (error) {
    res.status(500).json({ message: "Server Error: ", error });
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
    res.status(500).json({ message: "Server Error: ", error });
  }
};
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  categoryValidate.update.validateAsync(req.body);
  const { category_name } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID không được để trống" });
  }

  try {
    await categoryValidate.update.validateAsync(req.body);
    const { category_name } = req.body;
    // Kiểm tra category_name đã tồn tại hay chưa
    const existingCategory = await Category.findOne({ category_name });
    if (existingCategory && existingCategory._id.toString() !== id) {
      return res.status(400).json({ message: "Category đã tồn tại" });
    }
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { category_name },
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category không tồn tại" });
    }
    res
      .status(200)
      .json({ message: "Cập nhật Category thành công", data: updatedCategory });
  } catch (error) {
    res.status(500).json({ message: "Server Error: ", error });
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
    res.status(500).json({ message: "Server Error: ", error });
  }
};
