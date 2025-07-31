const Brand = require("../models/brands");
const Category = require("../models/categories");
const Product = require("../models/products");
const Variant = require("../models/variants");
const removeVietnameseTones = require("../utils/search");
const stringSimilarity = require("string-similarity");
const {
  productValidate,
  variantValidate,
} = require("../validate/productValidate");

// Lấy tất cả sản phẩm cùng biến thể
exports.getAllProductWithVariants = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;
    const keyword = req.query.q || "";

    // Bổ sung điều kiện không lấy sản phẩm bị xóa mềm
    const query = {
      isDeleted: { $ne: true },
    };

    if (keyword) {
      query.product_name = { $regex: keyword, $options: "i" };
    }

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

// Lấy chi tiết 1 sản phẩm theo ID cùng với biến thể
exports.getProductWithVariantsById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    const variants = await Variant.find({
      product_id: id,
      isDeleted: { $ne: true },
    });

    return res.status(200).json({ product, variants });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server khi lấy sản phẩm", error: error.message });
  }
};

exports.createProductWithVariants = async (req, res) => {
  try {
    //  Lấy file ảnh sản phẩm
    const productImages = req.files?.productImage || [];

    if (!req.files) {
      return res.status(400).json({
        message: "Thiếu dữ liệu ảnh upload",
      });
    }
    //  Lấy TẤT CẢ key ảnh biến thể (imageVariant_0[], imageVariant_1[], ...)
    const variantImageKeys = Object.keys(req.files).filter((key) =>
      key.startsWith("imageVariant_")
    );

    // Map đường dẫn ảnh sản phẩm
    const imageUrls = productImages.map((file) => file.path);

    if (!imageUrls.length) {
      return res.status(400).json({
        message: "Dữ liệu sản phẩm không hợp lệ",
        errors: ["Phải có ít nhất 1 ảnh sản phẩm."],
      });
    }

    //  Parse JSON biến thể
    let variantsData = [];
    try {
      variantsData = JSON.parse(req.body.variants || "[]");
    } catch (err) {
      return res.status(400).json({
        message: "Dữ liệu biến thể không hợp lệ",
        errors: ["Trường 'variants' phải là chuỗi JSON hợp lệ."],
      });
    }

    //  Gán ảnh vào từng biến thể theo index
    variantsData.forEach((variant, idx) => {
      const key = `imageVariant_${idx}[]`;
      const files = req.files[key] || [];
      variant.image = files.map((file) => file.path);
    });

    //  Validate sản phẩm
    req.body.imageUrls = imageUrls; // gán để pass schema

    const { error: productError } = productValidate.createProduct.validate(
      req.body,
      { abortEarly: false }
    );
    if (productError) {
      const errors = productError.details.map((err) => err.message);
      return res
        .status(400)
        .json({ message: "Dữ liệu sản phẩm không hợp lệ", errors });
    }

    //  Validate từng biến thể
    for (const variant of variantsData) {
      variant.product_id = "temp"; // bypass schema
      const { error: variantError } = variantValidate.create.validate(variant, {
        abortEarly: false,
      });
      if (variantError) {
        const errors = variantError.details.map((err) => err.message);
        return res.status(400).json({
          message: "Dữ liệu biến thể không hợp lệ",
          errors,
        });
      }
    }

    //  Tạo sản phẩm
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

    //  Tạo biến thể
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
    console.error(" Lỗi:", error);
    return res.status(500).json({
      message: "Lỗi server khi tạo sản phẩm và biến thể",
      error: error.message,
    });
  }
};

exports.updateProductWithVariants = async (req, res) => {
  const { id } = req.params;

  try {
    // 1 Kiểm tra sản phẩm tồn tại
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    // 2 Ghép ảnh sản phẩm (cũ + mới)
    const existingImageUrls =
      typeof req.body.existingImageUrls === "string"
        ? [req.body.existingImageUrls]
        : req.body.existingImageUrls || [];

    const newImages = req.files?.productImage?.map((file) => file.path) || [];
    const fullImageUrls = [...existingImageUrls, ...newImages];
    req.body.imageUrls = fullImageUrls;

    //  Validate sản phẩm
    const { error: productError } = productValidate.updateProduct.validate(
      req.body,
      { abortEarly: false }
    );
    if (productError) {
      const errors = productError.details.map((err) => err.message);
      return res
        .status(400)
        .json({ message: "Dữ liệu sản phẩm không hợp lệ", errors });
    }

    //  Parse biến thể
    let variantsData = [];
    try {
      variantsData = JSON.parse(req.body.variants || "[]");
    } catch (err) {
      return res.status(400).json({
        message: "Dữ liệu biến thể không hợp lệ",
        errors: ["Trường 'variants' phải là chuỗi JSON hợp lệ."],
      });
    }

    //  Gán ảnh biến thể từ `imageVariant_${idx}[]`
    variantsData.forEach((variant, idx) => {
      const key = `imageVariant_${idx}[]`;
      const files = req.files[key] || [];

      if (files.length > 0) {
        variant.image = files.map((file) => file.path);
      } else if (Array.isArray(variant.image)) {
        // giữ ảnh cũ
        variant.image = variant.image.map((fileName) =>
          fileName.includes("uploads")
            ? fileName
            : `uploads/products/${fileName}`
        );
      } else {
        variant.image = [];
      }

      variant.product_id = id; // Gán product_id thật
    });

    //  Validate từng biến thể
    for (let i = 0; i < variantsData.length; i++) {
      const variant = variantsData[i];
      const isUpdate = variant._id && typeof variant._id === "string";
      const schema = isUpdate ? variantValidate.update : variantValidate.create;

      if (!schema || typeof schema.validate !== "function") {
        return res
          .status(500)
          .json({ message: "Schema validate cho biến thể không hợp lệ." });
      }

      const { error: variantError } = schema.validate(variant, {
        abortEarly: false,
      });
      if (variantError) {
        const errors = variantError.details.map((err) => err.message);
        return res.status(400).json({
          message: `Dữ liệu biến thể thứ ${i + 1} không hợp lệ`,
          errors,
        });
      }
    }

    //  Cập nhật sản phẩm
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

    //  Cập nhật biến thể
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

    //  Xoá biến thể thừa
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
    console.error(" Lỗi cập nhật:", error);
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

exports.softDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { isDeleted } = req.body; // ✅ đúng tên field

    // Chuyển đổi về boolean nếu là string
    const isDeletedBool = isDeleted === true || isDeleted === "true";

    // Cập nhật sản phẩm
    const product = await Product.findByIdAndUpdate(
      id,
      { isDeleted: isDeletedBool }, //  field chính xác
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    // Cập nhật trạng thái xoá cho các biến thể liên quan
    await Variant.updateMany(
      { product_id: id },
      { isDeleted: isDeletedBool } //  dùng cùng 1 field
    );

    const message = isDeletedBool
      ? "Xoá mềm sản phẩm và biến thể thành công"
      : "Khôi phục sản phẩm và biến thể thành công";

    return res.status(200).json({
      message,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server khi xoá sản phẩm",
      error: error.message,
    });
  }
};

exports.getAllDeletedProductWithVariants = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;
    const keyword = req.query.q || "";

    //  Chỉ lấy sản phẩm đã bị xóa mềm
    const query = {
      isDeleted: true,
    };

    if (keyword) {
      query.product_name = { $regex: keyword, $options: "i" };
    }

    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate("brand_id", "brand_name")
      .populate("category_id", "category_name")
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit);

    //  Lọc sản phẩm có _id hợp lệ
    const validProducts = products.filter((p) => p && p._id);

    const productIds = validProducts.map((p) => p._id);

    let variants = [];
    if (productIds.length > 0) {
      variants = await Variant.find({ product_id: { $in: productIds } });
    }

    const productList = validProducts.map((product) => {
      const productVariants = variants.filter(
        (v) => v.product_id.toString() === product._id.toString()
      );

      return {
        ...product.toObject(),
        variants: productVariants,
      };
    });

    return res.status(200).json({
      message: "Lấy danh sách sản phẩm đã xoá mềm thành công",
      total: totalProducts,
      page,
      limit,
      totalPages: Math.ceil(totalProducts / limit),
      products: productList,
    });
  } catch (error) {
    console.error(" Lỗi server khi lấy sản phẩm đã xoá mềm:", error);
    return res.status(500).json({
      message: "Lỗi server khi lấy danh sách sản phẩm đã xoá mềm",
      error: error.message,
    });
  }
};
exports.getProductByCategoryWithVariants = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;
    const keyword = req.query.q || "";
    const categoryId = req.query.category_id;
    const brandId = req.query.brand_id;

    // Tạo query linh hoạt
    const query = { isDeleted: false };

    if (categoryId) {
      query.category_id = categoryId;
    }

    if (brandId) {
      query.brand_id = brandId;
    }

    if (keyword) {
      query.product_name = { $regex: keyword, $options: "i" };
    }

    // Đếm tổng sản phẩm
    const totalProducts = await Product.countDocuments(query);

    // Lấy sản phẩm theo phân trang
    const products = await Product.find(query)
      .populate("brand_id", "brand_name")
      .populate("category_id", "category_name")
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit);

    const productIds = products.map((p) => p._id);

    // Lấy variants theo product_id
    let variants = [];
    if (productIds.length > 0) {
      variants = await Variant.find({ product_id: { $in: productIds } });
    }

    // Gắn variants vào từng product
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
    console.error("Lỗi khi lọc sản phẩm:", error);
    return res.status(500).json({
      message: "Lỗi server khi lấy sản phẩm",
      error: error.message,
    });
  }
};

// exports.searchProducts = async (req, res) => {
//   try {
//     const { keyword } = req.query;
//     if (!keyword || keyword.trim() === "") {
//       return res
//         .status(400)
//         .json({ message: "Vui lòng nhập từ khóa tìm kiếm." });
//     }

//     const normalizedKeyword = removeVietnameseTones(
//       keyword.trim().toLowerCase()
//     );

//     const [categories, brands, products] = await Promise.all([
//       Category.find().select("_id category_name"),
//       Brand.find().select("_id brand_name"),
//       Product.find({ isDeleted: false })
//         .populate("category_id", "category_name")
//         .populate("brand_id", "brand_name"),
//     ]);

//     // Tìm theo tên, category, brand (gần đúng và không dấu)
//     const matchedProducts = products.filter((p) => {
//       const name = removeVietnameseTones(p.product_name.toLowerCase());
//       const category = removeVietnameseTones(
//         p.category_id?.category_name?.toLowerCase() || ""
//       );
//       const brand = removeVietnameseTones(
//         p.brand_id?.brand_name?.toLowerCase() || ""
//       );

//       const haystack = `${name} ${category} ${brand}`;
//       const similarity = stringSimilarity.compareTwoStrings(
//         normalizedKeyword,
//         haystack
//       );

//       return similarity > 0.3 || haystack.includes(normalizedKeyword);
//     });

//     res.json({ total: matchedProducts.length, products: matchedProducts });
//   } catch (error) {
//     console.error("Lỗi tìm kiếm:", error);
//     res.status(500).json({ message: "Lỗi server khi tìm kiếm sản phẩm." });
//   }
// };

exports.searchProducts = async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword || keyword.trim() === "") {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập từ khóa tìm kiếm." });
    }

    const normalizedKeyword = removeVietnameseTones(
      keyword.trim().toLowerCase()
    );

    const [categories, brands, products] = await Promise.all([
      Category.find().select("_id category_name"),
      Brand.find().select("_id brand_name"),
      Product.find({ isDeleted: false })
        .select("_id product_name imageUrls slug category_id brand_id")
        .populate("category_id", "category_name")
        .populate("brand_id", "brand_name"),
    ]);

    const matchedProducts = products.filter((p) => {
      const name = removeVietnameseTones(p.product_name.toLowerCase());
      const category = removeVietnameseTones(
        p.category_id?.category_name?.toLowerCase() || ""
      );
      const brand = removeVietnameseTones(
        p.brand_id?.brand_name?.toLowerCase() || ""
      );

      const haystack = `${name} ${category} ${brand}`;
      const similarity = stringSimilarity.compareTwoStrings(
        normalizedKeyword,
        haystack
      );

      return similarity > 0.3 || haystack.includes(normalizedKeyword);
    });

    const BASE_URL = `${req.protocol}://${req.get("host")}`;

    const normalizeImageUrl = (url) => {
      if (!url || typeof url !== "string") return "";
    
      try {
        const parsed = new URL(url);
        const pathname = parsed.pathname.replace(/^\/+/, "");
        return `${BASE_URL}/${pathname}`;
      } catch {
        // Nếu không phải URL đầy đủ
        const cleaned = url.replace(/\\/g, "/").replace(/^\/+/, "");
        return `${BASE_URL}/${cleaned}`;
      }
    };
    

    const results = matchedProducts.slice(0, 5).map((p) => ({
      _id: p._id,
      product_name: p.product_name,
      slug: p.slug || p._id,
      image: normalizeImageUrl(p.imageUrls?.[0]),
    }));

    console.log("🟢 Kết quả tìm kiếm:", results);

    res.json({ total: results.length, products: results });
  } catch (error) {
    console.error("❌ Lỗi tìm kiếm:", error);
    res.status(500).json({ message: "Lỗi server khi tìm kiếm sản phẩm." });
  }
};
