// const Product = require("../models/products");
// const Variant = require("../models/variants");
// const productValidate = require("../validate/productValidate");

// exports.getAllProducts = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const sortBy = req.query.sortBy || "createdAt";
//     const order = req.query.order === "asc" ? 1 : -1;
//     const keyword = req.query.q || "";

//     const query = keyword
//       ? {
//           product_name: { $regex: keyword, $options: "i" }, // tìm không phân biệt hoa thường
//         }
//       : {};

//     const totalProducts = await Product.countDocuments(query);

//     const products = await Product.find(query)
//       .populate("brand_id", "brand_name")
//       .populate("category_id", "category_name")
//       .sort({ [sortBy]: order })
//       .skip(skip)
//       .limit(limit);

//     const productIds = products.map((p) => p._id);
//     const variants = await Variant.find({ product_id: { $in: productIds } });

//     const productList = products.map((product) => {
//       const productVariants = variants.filter(
//         (v) => v.product_id.toString() === product._id.toString()
//       );

//       return {
//         ...product.toObject(),
//         variants: productVariants,
//       };
//     });

//     return res.status(200).json({
//       message: "Lấy danh sách sản phẩm thành công",
//       total: totalProducts,
//       page,
//       limit,
//       totalPages: Math.ceil(totalProducts / limit),
//       products: productList,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Server Error",
//       error: error.message,
//     });
//   }
// };

// exports.getProductById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     if (!id) {
//       return res.status(400).json({ message: "ID không được để trống" });
//     }

//     // Tìm sản phẩm theo ID và populate brand_id, category_id
//     const product = await Product.findById(id)
//       .populate("brand_id", "brand_name")
//       .populate("category_id", "category_name");

//     if (!product) {
//       return res.status(404).json({ message: "Sản phẩm không tồn tại" });
//     }

//     // Lấy tất cả variants của sản phẩm
//     const variants = await Variant.find({ product_id: id });

//     return res.status(200).json({
//       message: "Lấy sản phẩm thành công",
//       product: {
//         ...product.toObject(),
//         variants,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({ message: "Server Error: ", error });
//   }
// };
// exports.createProduct = async (req, res) => {
//   try {
//     // Gán danh sách ảnh sản phẩm vào req.body.imageUrls
//     req.body.imageUrls = req.files.productImage
//       ? req.files.productImage.map((file) => file.path)
//       : [];

//     // // Parse variants nếu là chuỗi JSON
//     // if (typeof req.body.variants === "string") {
//     //   req.body.variants = JSON.parse(req.body.variants);
//     // }

//     // // Gán ảnh cho từng variant
//     // const variantsImages = req.files.variantsImage
//     //   ? req.files.variantsImage.map((file) => file.path)
//     //   : [];
//     // if (Array.isArray(req.body.variants)) {
//     //   req.body.variants = req.body.variants.map((variant, idx) => ({
//     //     ...variant,
//     //     image: variantsImages.length > idx ? [variantsImages[idx]] : [],
//     //   }));
//     // }

//     // Validate dữ liệu đầu vào

//     const { error } = productValidate.createProduct.validate(req.body, {
//       abortEarly: false,
//     });
//     if (error) {
//       const errors = error.details.map((err) => err.message);
//       return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
//     }

//     // Tạo sản phẩm
//     const {
//       product_name,
//       description,
//       basePrice,
//       imageUrls,
//       brand_id,
//       category_id,
//       gender,
//       material,
//     } = req.body;

//     const product = await Product.create({
//       product_name,
//       description,
//       basePrice,
//       imageUrls,
//       brand_id,
//       category_id,
//       gender,
//       material,
//     });

//     // // Tạo variants
//     // const variantsWithProductId = variants.map((variant) => ({
//     //   ...variant,
//     //   product_id: product._id,
//     // }));
//     // const createdVariants = await Variant.insertMany(variantsWithProductId);

//     return res.status(201).json({
//       message: "Thêm sản phẩm thành công",
//       product,
//       // product: {
//       //   ...product.toObject(),
//       //   variants: createdVariants,
//       // },
//     });
//   } catch (error) {
//     return res.status(400).json({ message: error.message || "Server error" });
//   }
// };

// exports.updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // 1. Kiểm tra sản phẩm tồn tại
//     const productInDb = await Product.findById(id);
//     if (!productInDb) {
//       return res.status(404).json({ message: "Sản phẩm không tồn tại" });
//     }

//     // 2. Lấy danh sách ảnh cũ giữ lại (client gửi qua FormData field `existingImageUrls`)
//     let existingImageUrls = req.body.existingImageUrls || [];
//     if (typeof existingImageUrls === "string") {
//       existingImageUrls = [existingImageUrls];
//     }

//     // 3. Lấy ảnh mới từ form (nếu có)
//     const newImages =
//       req.files && req.files.productImage
//         ? Array.isArray(req.files.productImage)
//           ? req.files.productImage.map((file) => file.path)
//           : [req.files.productImage.path]
//         : [];

//     // 4. Gộp ảnh
//     req.body.imageUrls = [...existingImageUrls, ...newImages];

//     // ❗ Xóa field không mong muốn trước khi validate
//     delete req.body.existingImageUrls;

//     // 5. Validate schema
//     const { error } = productValidate.createProduct.validate(req.body, {
//       abortEarly: false,
//     });

//     if (error) {
//       const errors = error.details.map((err) => err.message);
//       return res.status(400).json({
//         message: "Dữ liệu không hợp lệ",
//         errors,
//       });
//     }

//     // 6. Cập nhật DB
//     const {
//       product_name,
//       description,
//       basePrice,
//       brand_id,
//       category_id,
//       gender,
//       material,
//       imageUrls,
//     } = req.body;

//     const updatedProduct = await Product.findByIdAndUpdate(
//       id,
//       {
//         product_name,
//         description,
//         basePrice,
//         imageUrls,
//         brand_id,
//         category_id,
//         gender,
//         material,
//       },
//       { new: true }
//     );

//     return res.status(200).json({
//       message: "Cập nhật sản phẩm thành công",
//       product: updatedProduct,
//     });
//   } catch (error) {
//     console.error("Lỗi cập nhật:", error);
//     return res.status(500).json({ message: error.message || "Lỗi server" });
//   }
// };

// exports.deleteProduct = async (req, res) => {
//   const { id } = req.params;

//   try {
//     if (!id) {
//       return res.status(400).json({ message: "ID không được để trống" });
//     }

//     // Xóa sản phẩm
//     const deletedProduct = await Product.findByIdAndDelete(id);
//     if (!deletedProduct) {
//       return res.status(404).json({ message: "Sản phẩm không tồn tại" });
//     }

//     // Xóa tất cả variants liên quan đến sản phẩm
//     await Variant.deleteMany({ product_id: id });

//     return res.status(200).json({
//       message: "Xóa sản phẩm thành công",
//       product: deletedProduct,
//     });
//   } catch (error) {
//     return res.status(500).json({ message: "Server Error: ", error });
//   }
// };

const Product = require("../models/products");
const Variant = require("../models/variants");
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

    //  Debug: kiểm tra file thực sự nhận được
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

    //  Validate sản phẩm
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

    //  Validate từng biến thể
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

    //  1. Validate sản phẩm
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

    //  2. Parse & validate biến thể
    let variantsData = [];
    try {
      variantsData = JSON.parse(req.body.variants || "[]");
    } catch (err) {
      return res.status(400).json({
        message: "Dữ liệu biến thể không hợp lệ",
        errors: ["Trường 'variants' phải là chuỗi JSON hợp lệ."],
      });
    }

    const variantImages = req.files?.imageVariant || [];

    // Validate từng biến thể
    for (let i = 0; i < variantsData.length; i++) {
      const variant = variantsData[i];

      //  Gán ảnh đúng
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

      //  Debug biến thể đang validate
      console.log(`🧩 Đang validate biến thể thứ ${i + 1}:`);
      console.log("▶️ Dữ liệu biến thể:", variant);

      const { error: variantError } = schema.validate(variant, {
        abortEarly: false,
      });

      if (variantError) {
        console.log(" Lỗi validate biến thể:", variantError.details);
        const errors = variantError.details.map((err) => err.message);
        return res.status(400).json({
          message: `Dữ liệu biến thể thứ ${i + 1} không hợp lệ`,
          errors,
        });
      }
    }

    //  3. Nếu hợp lệ → cập nhật DB

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
