const Brand = require("../models/brands");
const brandValidation = require("../validate/brandValidate");

exports.createBrand = async (req, res) => {
  try {
    // validate req.body
    const { error } = brandValidation.create.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }

    const { brand_name } = req.body;
    // Kiểm tra brand_name đã tồn tại hay chưa
    const existingBrand = await Brand.findOne({ brand_name });
    if (existingBrand) {
      return res.status(400).json({ message: "Brand đã tồn tại" });
    }
    // Tạo mới brand
    const newBrand = await Brand.create({ brand_name });
    res.status(201).json({ message: "Tạo Brand thành công", data: newBrand });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.getAllBrands = async (req, res) => {
  try {
    // lấy danh sách tất cả các brand
    const brands = await Brand.find();
    res
      .status(200)
      .json({ message: "Lấy danh sách Brand thành công", data: brands });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.getBrandById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({ message: "ID không được để trống" });
    }
    // Lấy brand theo id
    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ message: "Brand không tồn tại" });
    }
    res.status(200).json({ message: "Lấy Brand thành công", data: brand });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.updateBrand = async (req, res) => {
  const { id } = req.params;

  try {
    // validate req.body
    const { error } = brandValidation.update.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }

    const { brand_name } = req.body;
    // kiểm tra có id không
    if (!id) {
      return res.status(400).json({ message: "ID không được để trống" });
    }
    // kiểm tra brand_name tồn tại hay không

    const existingBrand = await Brand.findOne({ brand_name });
    if (existingBrand) {
      return res.status(400).json({ message: "Brand đã tồn tại" });
    }
    // upadate brand theo id
    const brand = await Brand.findByIdAndUpdate(
      id,
      { brand_name },
      { new: true }
    );
    res.status(200).json({ message: "Cập nhật Brand thành công", data: brand });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.deleteBrand = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({ message: "ID không được để trống" });
    }
    // xoá brand theo id
    await Brand.findByIdAndDelete(id);
    res.status(200).json({ message: "Xoá Brand thành công" });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
