const Variant = require("../models/variants");
const variantValidate = require("../validate/variantValidate");

exports.getAllVariant = async (req, res) => {
  try {
    const variants = await Variant.find().populate({
      path: "product_id",
      select: "product_name", // chỉ lấy tên sản phẩm
    });
    res.status(200).json({
      message: "Lấy tất cả sản phẩm thành công",
      variants,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.getIdVariant = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({ message: "ID không được để trống" });
    }
    const variant = await Variant.findById(id);
    res.status(200).json({
      message: "Lấy biến thể thành công",
      variant,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
exports.getIdProductVariant = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({ message: "ID không được để trống" });
    }
    const variants = await Variant.find({ product_id: id });

    if (variants.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy biến thể nào cho sản phẩm này.",
      });
    }
    res.status(200).json({
      message: "Lấy danh sách biến thể thành công",
      total: variants.length,
      variants,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
exports.createVariant = async (req, res) => {
  req.body.image = req.files.imageVariant
    ? req.files.imageVariant.map((file) => file.path)
    : [];

  try {
    //Validate
    const { error } = variantValidate.create.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }

    const { product_id, size, color, stock, price, image } = req.body;
    // Kiểm tra trùng size + color cho product_id đó
    const existingVariant = await Variant.findOne({
      product_id,
      size,
      color,
    });

    if (existingVariant) {
      return res.status(400).json({
        message: "Biến thể với size và màu này đã tồn tại cho sản phẩm",
      });
    }

    // Tạo variant mới
    const newVariant = await Variant.create({
      product_id,
      size,
      color,
      stock,
      price,
      image,
    });

    res.status(201).json({
      message: "Thêm biến thể thành công",
      data: newVariant,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.updateVariant = async (req, res) => {
  const { id } = req.params;

  // ✅ Chỉ gán image nếu có ảnh mới
  if (req.files?.imageVariant && req.files.imageVariant.length > 0) {
    req.body.image = req.files.imageVariant.map((file) => file.path);
  } else {
    delete req.body.image; // Không gửi field image => giữ ảnh cũ
  }

  try {
    if (!id) {
      return res.status(400).json({ message: "ID không được để trống" });
    }

    //  Validate dữ liệu đầu vào
    const { error } = variantValidate.update.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }

    const { product_id, size, color, stock, price, image } = req.body;

    //  Có thể bỏ phần kiểm tra trùng size-color nếu đang sửa chính nó

    const updateFields = { product_id, size, color, stock, price };

    if (image) {
      updateFields.image = image; //  Chỉ thêm nếu có ảnh mới
    }

    const updateVariant = await Variant.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    if (!updateVariant) {
      return res.status(404).json({ message: "Không tìm thấy biến thể" });
    }

    res.status(200).json({
      message: "Cập nhật biến thể thành công",
      variant: updateVariant,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.deleteVariant = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({ message: "ID không được để trống" });
    }
    const variant = await Variant.findByIdAndDelete(id);
    res.status(200).json({
      message: "Xoá biến thể thành công",
      variant,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
exports.deleteIdProductVariant = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({ message: "ID không được để trống" });
    }
    // Xoá tất cả các biến thể của product_id
    const result = await Variant.deleteMany({ product_id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "Không tìm thấy biến thể nào để xoá.",
      });
    }

    return res.status(200).json({
      message: "Xoá tất cả biến thể thành công",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
