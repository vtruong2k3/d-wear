const Product = require("../models/products");
const Variant = require("../models/variants");
const {
  productValidate,
  variantValidate,
} = require("../validate/productValidate");

// Lấy tất cả sản phẩm cùng biến thể
exports.getAllProductWithVariants = async (req, res) => {
  try {
    const products = await Product.find();
    const result = [];

    for (const product of products) {
      const variants = await Variant.find({ product_id: product._id });
      result.push({ product, variants });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server khi lấy danh sách sản phẩm",
      error: error.message,
    });
  }
};

// Lấy chi tiết 1 sản phẩm theo ID cùng với biến thể
exports.getProductWithVariantsById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    const variants = await Variant.find({ product_id: id });

    return res.status(200).json({ product, variants });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server khi lấy sản phẩm", error: error.message });
  }
};

// Tạo sản phẩm cùng với các biến thể
// Tạo sản phẩm cùng với các biến thể
exports.createProductWithVariants = async (req, res) => {
  try {
    // Lấy file ảnh
    const productImages = req.files?.productImage || [];
    const variantImages = req.files?.imageVariant || [];

    // Map đường dẫn ảnh
    const imageUrls = productImages.map((file) => file.path);

    // ✅ Debug: kiểm tra file thực sự nhận được
    console.log("FILES:", req.files);
    console.log("imageUrls:", imageUrls);

    // Nếu không có ảnh thì báo lỗi ngay
    if (!imageUrls || imageUrls.length === 0) {
      return res.status(400).json({
        message: "Dữ liệu sản phẩm không hợp lệ",
        errors: ["Phải có ít nhất 1 ảnh."],
      });
    }

    // Lấy dữ liệu biến thể từ req.body
    let variantsData = [];
    try {
      variantsData = JSON.parse(req.body.variants || "[]");
    } catch (err) {
      return res.status(400).json({
        message: "Dữ liệu biến thể không hợp lệ",
        errors: ["Trường 'variants' phải là chuỗi JSON hợp lệ."],
      });
    }

    // Gán ảnh vào từng biến thể
    variantsData.forEach((variant, idx) => {
      variant.image = variantImages[idx] ? [variantImages[idx].path] : [];
    });

    // Gán imageUrls vào body để validate
    req.body.imageUrls = imageUrls;

    // ✅ Validate sản phẩm
    const { error: productError } = productValidate.createProduct.validate(
      req.body,
      {
        abortEarly: false,
      }
    );
    if (productError) {
      const errors = productError.details.map((err) => err.message);
      return res
        .status(400)
        .json({ message: "Dữ liệu sản phẩm không hợp lệ", errors });
    }

    // ✅ Validate từng biến thể
    for (const variant of variantsData) {
      // Thêm product_id tạm để pass validation
      variant.product_id = "temp";

      const { error: variantError } = variantValidate.create.validate(variant, {
        abortEarly: false,
      });
      if (variantError) {
        const errors = variantError.details.map((err) => err.message);
        return res
          .status(400)
          .json({ message: "Dữ liệu biến thể không hợp lệ", errors });
      }
    }

    // Tạo sản phẩm
    const {
      product_name,
      description,
      basePrice,
      brand_id,
      category_id,
      gender,
      material,
    } = req.body;

    const newProduct = await Product.create({
      product_name,
      description,
      basePrice,
      imageUrls,
      brand_id,
      category_id,
      gender,
      material,
    });

    // Tạo biến thể (gán product_id thật)
    const variantsWithProductId = variantsData.map((variant) => ({
      ...variant,
      product_id: newProduct._id,
    }));

    const createdVariants = await Variant.insertMany(variantsWithProductId);

    return res.status(201).json({
      message: "Tạo sản phẩm và biến thể thành công",
      product: newProduct,
      variants: createdVariants,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server khi tạo sản phẩm và biến thể",
      error: error.message,
    });
  }
};
// Cập nhật sản phẩm cùng với biến thể
exports.updateProductWithVariants = async (req, res) => {
  const { id } = req.params;

  try {
    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    // Gộp ảnh cũ và mới của sản phẩm
    const existingImageUrls =
      typeof req.body.existingImageUrls === "string"
        ? [req.body.existingImageUrls]
        : req.body.existingImageUrls || [];

    const newImages = req.files?.productImage?.map((file) => file.path) || [];
    const fullImageUrls = [...existingImageUrls, ...newImages];
    req.body.imageUrls = fullImageUrls;

    // ✅ 1. Validate sản phẩm
    const { error: productError } = productValidate.updateProduct.validate(
      req.body,
      {
        abortEarly: false,
      }
    );
    if (productError) {
      const errors = productError.details.map((err) => err.message);
      return res
        .status(400)
        .json({ message: "Dữ liệu sản phẩm không hợp lệ", errors });
    }

    // ✅ 2. Parse & validate biến thể
    let variantsData = [];
    try {
      variantsData = JSON.parse(req.body.variants || "[]");
    } catch (err) {
      return res.status(400).json({
        message: "Dữ liệu biến thể không hợp lệ",
        errors: ["Trường 'variants' phải là chuỗi JSON hợp lệ."],
      });
    }

    console.log("📦 Danh sách biến thể gửi lên:", variantsData);

    const variantImages = req.files?.imageVariant || [];

    // Validate từng biến thể
    for (let i = 0; i < variantsData.length; i++) {
      const variant = variantsData[i];

      // ✅ Gán ảnh đúng
      if (Array.isArray(variantImages) && variantImages[i]) {
        variant.image = [variantImages[i].path]; // ảnh mới
      } else if (Array.isArray(variant.image)) {
        variant.image = variant.image.map((fileName) =>
          fileName.includes("uploads")
            ? fileName
            : `uploads/products/${fileName}`
        ); // giữ ảnh cũ
      } else {
        variant.image = [];
      }

      variant.product_id = id;

      const isUpdate = variant._id && typeof variant._id === "string";
      const schema = isUpdate ? variantValidate.update : variantValidate.create;

      if (!schema || typeof schema.validate !== "function") {
        return res.status(500).json({
          message: "Schema validate cho biến thể không hợp lệ.",
        });
      }

      // ✅ Debug biến thể đang validate
      console.log(`🧩 Đang validate biến thể thứ ${i + 1}:`);
      console.log("▶️ Dữ liệu biến thể:", variant);

      const { error: variantError } = schema.validate(variant, {
        abortEarly: false,
      });

      if (variantError) {
        console.log("❌ Lỗi validate biến thể:", variantError.details);
        const errors = variantError.details.map((err) => err.message);
        return res.status(400).json({
          message: `Dữ liệu biến thể thứ ${i + 1} không hợp lệ`,
          errors,
        });
      }
    }

    // ✅ 3. Nếu hợp lệ → cập nhật DB

    // 3.1 Update sản phẩm
    const {
      product_name,
      description,
      basePrice,
      brand_id,
      category_id,
      gender,
      material,
    } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        product_name,
        description,
        basePrice,
        imageUrls: fullImageUrls,
        brand_id,
        category_id,
        gender,
        material,
      },
      { new: true }
    );

    // 3.2 Update biến thể
    const incomingVariantIds = [];

    for (let i = 0; i < variantsData.length; i++) {
      const variant = variantsData[i];
      const isUpdate = variant._id && typeof variant._id === "string";

      if (isUpdate) {
        await Variant.findByIdAndUpdate(variant._id, variant);
        incomingVariantIds.push(variant._id);
      } else {
        const exists = await Variant.findOne({
          product_id: id,
          size: variant.size,
          color: variant.color,
        });

        if (exists) {
          incomingVariantIds.push(exists._id);
          continue;
        }

        const created = await Variant.create({ ...variant, product_id: id });
        incomingVariantIds.push(created._id);
      }
    }

    // 3.3 Xoá biến thể không còn trong danh sách mới
    await Variant.deleteMany({
      product_id: id,
      _id: { $nin: incomingVariantIds },
    });

    const updatedVariants = await Variant.find({ product_id: id });

    return res.status(200).json({
      message: "Cập nhật sản phẩm và biến thể thành công",
      product: updatedProduct,
      variants: updatedVariants,
    });
  } catch (error) {
    console.error("❌ Lỗi cập nhật:", error);
    return res.status(500).json({
      message: "Lỗi server khi cập nhật sản phẩm và biến thể",
      error: error.message,
    });
  }
};

// Xoá sản phẩm cùng biến thể
exports.deleteProductWithVariants = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    await Variant.deleteMany({ product_id: id });

    return res.status(200).json({
      message: "Xoá sản phẩm và toàn bộ biến thể thành công",
      product: deletedProduct,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server khi xoá", error: error.message });
  }
};
