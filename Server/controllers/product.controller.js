const Product = require("../models/products");
const Variant = require("../models/variants");
const productValidate = require("../validate/productValidate");

exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;
    const keyword = req.query.q || "";

    const query = keyword
      ? {
          product_name: { $regex: keyword, $options: "i" }, // tìm không phân biệt hoa thường
        }
      : {};

    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate("brand_id", "brand_name")
      .populate("category_id", "category_name")
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit);

    const productIds = products.map((p) => p._id);
    const variants = await Variant.find({ product_id: { $in: productIds } });

    const productList = products.map((product) => {
      const productVariants = variants.filter(
        (v) => v.product_id.toString() === product._id.toString()
      );

      return {
        ...product.toObject(),
        variants: productVariants,
      };
    });

    return res.status(200).json({
      message: "Lấy danh sách sản phẩm thành công",
      total: totalProducts,
      page,
      limit,
      totalPages: Math.ceil(totalProducts / limit),
      products: productList,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ message: "ID không được để trống" });
    }

    // Tìm sản phẩm theo ID và populate brand_id, category_id
    const product = await Product.findById(id)
      .populate("brand_id", "brand_name")
      .populate("category_id", "category_name");

    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    // Lấy tất cả variants của sản phẩm
    const variants = await Variant.find({ product_id: id });

    return res.status(200).json({
      message: "Lấy sản phẩm thành công",
      product: {
        ...product.toObject(),
        variants,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error: ", error });
  }
};
exports.createProduct = async (req, res) => {
  try {
    // Gán danh sách ảnh sản phẩm vào req.body.imageUrls
    req.body.imageUrls = req.files.productImage
      ? req.files.productImage.map((file) => file.path)
      : [];

    // // Parse variants nếu là chuỗi JSON
    // if (typeof req.body.variants === "string") {
    //   req.body.variants = JSON.parse(req.body.variants);
    // }

    // // Gán ảnh cho từng variant
    // const variantsImages = req.files.variantsImage
    //   ? req.files.variantsImage.map((file) => file.path)
    //   : [];
    // if (Array.isArray(req.body.variants)) {
    //   req.body.variants = req.body.variants.map((variant, idx) => ({
    //     ...variant,
    //     image: variantsImages.length > idx ? [variantsImages[idx]] : [],
    //   }));
    // }

    // Validate dữ liệu đầu vào

    const { error } = productValidate.createProduct.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }

    // Tạo sản phẩm
    const {
      product_name,
      description,
      basePrice,
      imageUrls,
      brand_id,
      category_id,
      gender,
      material,
    } = req.body;

    const product = await Product.create({
      product_name,
      description,
      basePrice,
      imageUrls,
      brand_id,
      category_id,
      gender,
      material,
    });

    // // Tạo variants
    // const variantsWithProductId = variants.map((variant) => ({
    //   ...variant,
    //   product_id: product._id,
    // }));
    // const createdVariants = await Variant.insertMany(variantsWithProductId);

    return res.status(201).json({
      message: "Thêm sản phẩm thành công",
      product,
      // product: {
      //   ...product.toObject(),
      //   variants: createdVariants,
      // },
    });
  } catch (error) {
    return res.status(400).json({ message: error.message || "Server error" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Kiểm tra sản phẩm tồn tại
    const productInDb = await Product.findById(id);
    if (!productInDb) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    // 2. Lấy danh sách ảnh cũ giữ lại (client gửi qua FormData field `existingImageUrls`)
    let existingImageUrls = req.body.existingImageUrls || [];
    if (typeof existingImageUrls === "string") {
      existingImageUrls = [existingImageUrls];
    }

    // 3. Lấy ảnh mới từ form (nếu có)
    const newImages =
      req.files && req.files.productImage
        ? Array.isArray(req.files.productImage)
          ? req.files.productImage.map((file) => file.path)
          : [req.files.productImage.path]
        : [];

    // 4. Gộp ảnh
    req.body.imageUrls = [...existingImageUrls, ...newImages];

    // ❗ Xóa field không mong muốn trước khi validate
    delete req.body.existingImageUrls;

    // 5. Validate schema
    const { error } = productValidate.createProduct.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ",
        errors,
      });
    }

    // 6. Cập nhật DB
    const {
      product_name,
      description,
      basePrice,
      brand_id,
      category_id,
      gender,
      material,
      imageUrls,
    } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        product_name,
        description,
        basePrice,
        imageUrls,
        brand_id,
        category_id,
        gender,
        material,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Cập nhật sản phẩm thành công",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Lỗi cập nhật:", error);
    return res.status(500).json({ message: error.message || "Lỗi server" });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ message: "ID không được để trống" });
    }

    // Xóa sản phẩm
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    // Xóa tất cả variants liên quan đến sản phẩm
    await Variant.deleteMany({ product_id: id });

    return res.status(200).json({
      message: "Xóa sản phẩm thành công",
      product: deletedProduct,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error: ", error });
  }
};
exports.getAllProdutsItem = async (req, res) => {
  try {
    const result = await Product.find({}, "_id product_name"); // chỉ lấy _id và product_name
    return res.status(200).json({
      message: "Lấy sản phẩm thành công",
      products: result,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error });
  }
};
