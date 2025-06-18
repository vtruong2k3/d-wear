const Brand = require("../models/brands");
const brandValidation = require("../validate/brandValidate");

exports.createBrand = async (req, res) => {
  const { brand_name } = req.body;

  // validate req.body
  brandValidation.create.validateAsync(req.body).catch((err) => {
    return res.status(400).json({ message: "Validation Error: ", error: err });
  });
  try {
    // Kiểm tra brand_name đã tồn tại hay chưa
    const existingBrand = await Brand.findOne({ brand_name });
    if (existingBrand) {
      return res.status(400).json({ message: "Brand đã tồn tại" });
    }
    // Tạo mới brand
    const newBrand = await Brand.create({ brand_name });
    res.status(201).json({ message: "Tạo Brand thành công", data: newBrand });
  } catch (error) {
    res.status(500).json({ message: "Server Error: ", error });
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
    res.status(500).json({ message: "Server Error: ", error });
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
    res.status(500).json({ message: "Server Error: ", error });
  }
};

exports.updateBrand = async (req, res) => {
  const { id } = req.params;
  const { brand_name } = req.body;

  brandValidation.update.validateAsync(req.body).catch((err) => {
    return res.status(400).json({ message: "Validation Error: ", error: err });
  });

  try {
    // kiểm tra có id không
    if (!id) {
      return res.status(400).json({ message: "ID không được để trống" });
    }
    // kiểm tra brand_name tồn tại hay không
    const existingBrand = await Brand.findOne({ _id: id });
    if (existingBrand) {
      return res.status(400).json({ message: "Brand đã tồn tại" });
    }
    // upadate brand theo id
    await Brand.findByIdAndUpdate(id, { brand_name }, { new: true });
    res.status(200).json({ message: "Cập nhật Brand thành công", data: brand });
  } catch (error) {
    res.status(500).json({ message: "Server Error: ", error });
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
    res.status(500).json({ message: "Server Error: ", error });
  }
};
