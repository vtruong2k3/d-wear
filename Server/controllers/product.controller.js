const Product = require("../models/products");
const Variant = require("../models/variants");
const productValidate = require("../validate/productValidate");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("brand_id", "brand_name") // Lấy brandName từ bảng brand
      .populate("category_id", "category_name") // Lấy categoryName từ bảng category
      .sort({ createdAt: -1 }); // Sắp xếp sản phẩm mới nhất lên đầu

    // Lấy danh sách _id của các sản phẩm để truy vấn variants
    const productIds = products.map((p) => p._id);

    // Lấy tất cả biến thể liên quan đến các sản phẩm đó
    const variants = await Variant.find({
      product_id: { $in: productIds },
    });

    // Gộp biến thể tương ứng vào từng sản phẩm
    const productList = products.map((product) => {
      const productVariants = variants.filter(
        (v) => v.product_id.toString() === product._id.toString()
      );

      return {
        ...product.toObject(),
        variants: productVariants,
      };
    });

    // Trả kết quả về client
    return res.status(200).json({
      message: "Lấy danh sách sản phẩm thành công",
      products: productList,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error: ", error });
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

    // Parse variants nếu là chuỗi JSON
    if (typeof req.body.variants === "string") {
      req.body.variants = JSON.parse(req.body.variants);
    }

    // Gán ảnh cho từng variant
    const variantsImages = req.files.variantsImage
      ? req.files.variantsImage.map((file) => file.path)
      : [];
    if (Array.isArray(req.body.variants)) {
      req.body.variants = req.body.variants.map((variant, idx) => ({
        ...variant,
        image: variantsImages.length > idx ? [variantsImages[idx]] : [],
      }));
    }

    // Validate dữ liệu đầu vào
    await productValidate.createProduct.validateAsync(req.body);

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
      variants,
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

    // Tạo variants
    const variantsWithProductId = variants.map((variant) => ({
      ...variant,
      product_id: product._id,
    }));
    const createdVariants = await Variant.insertMany(variantsWithProductId);

    return res.status(201).json({
      message: "Thêm sản phẩm thành công",
      product: {
        ...product.toObject(),
        variants: createdVariants,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: error.message || "Server error" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Nếu có upload ảnh mới thì gán lại imageUrls, không thì giữ nguyên
    if (req.files && req.files.productImage) {
      req.body.imageUrls = req.files.productImage.map((file) => file.path);
    }

    // Parse variants nếu là chuỗi JSON
    if (typeof req.body.variants === "string") {
      req.body.variants = JSON.parse(req.body.variants);
    }

    // Nếu có upload ảnh variants mới thì gán vào từng variant
    let variantsImages = [];
    if (req.files && req.files.variantsImage) {
      variantsImages = req.files.variantsImage.map((file) => file.path);
    }
    if (Array.isArray(req.body.variants)) {
      req.body.variants = req.body.variants.map((variant, idx) => ({
        ...variant,
        image: variantsImages.length > idx ? [variantsImages[idx]] : [],
      }));
    }

    // Validate dữ liệu đầu vào
    await productValidate.createProduct.validateAsync(req.body);

    // Cập nhật sản phẩm
    const {
      product_name,
      description,
      basePrice,
      imageUrls,
      brand_id,
      category_id,
      gender,
      material,
      variants,
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

    if (!updatedProduct) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    // Chỉ xử lý variants nếu client gửi trường variants
    let updatedVariants = await Variant.find({ product_id: id });
    if (req.body.variants !== undefined) {
      // Xóa hết variants cũ
      await Variant.deleteMany({ product_id: id });

      // Nếu mảng variants mới không rỗng thì thêm mới
      if (Array.isArray(variants) && variants.length > 0) {
        const variantsWithProductId = variants.map((variant) => ({
          ...variant,
          product_id: id,
        }));
        updatedVariants = await Variant.insertMany(variantsWithProductId);
      } else {
        updatedVariants = [];
      }
    }

    return res.status(200).json({
      message: "Cập nhật sản phẩm thành công",
      product: {
        ...updatedProduct.toObject(),
        variants: updatedVariants,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: error.message || "Server error" });
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
