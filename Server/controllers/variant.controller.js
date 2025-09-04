const Product = require("../models/products");
const Variant = require("../models/variants");
const variantValidate = require("../validate/variantValidate");

const removeAccents = require("remove-accents");

exports.getAllVariant = async (req, res) => {
  try {
    // 1) Chuẩn hóa phân trang
    const pageNum = Math.max(1, Number(req.query.page) || 1);
    const limitNum = Math.max(1, Number(req.query.limit) || 10);
    const skip = (pageNum - 1) * limitNum;

    // 2) Chuẩn hóa search
    const rawSearch = (req.query.search || "").trim();
    const normalizedSearch = removeAccents(rawSearch).toLowerCase(); // dùng cho so khớp không dấu
    const keywords = normalizedSearch.split(" ").filter(Boolean);

    // 3) Nếu có search, tìm product_id khớp tên (không dấu)
    let matchedProductIds = [];
    if (keywords.length) {
      const allProducts = await Product.find().select("_id product_name");
      matchedProductIds = allProducts
        .filter((p) => {
          const nameNoAccent = removeAccents(p.product_name).toLowerCase();
          // match nếu TẤT CẢ từ khóa đều có trong tên (độ chính xác cao hơn some)
          return keywords.every((kw) => nameNoAccent.includes(kw));
        })
        .map((p) => p._id);
    }

    // 4) Tạo filter cho Variant
    const variantFilter = { isDeleted: { $ne: true } };

    if (keywords.length) {
      variantFilter.$or = [
        { product_id: { $in: matchedProductIds } },
        { color: { $regex: rawSearch, $options: "i" } },
        { size: { $regex: rawSearch, $options: "i" } },
      ];
    }

    const total = await Variant.countDocuments(variantFilter);

    const variants = await Variant.find(variantFilter)
      .populate({ path: "product_id", select: "product_name" })
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Lấy danh sách biến thể thành công",
      total,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      variants,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
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

  //  Chỉ gán image nếu có ảnh mới
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

exports.softDeleteVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const { isDeleted } = req.body;
    // lấy từ body
    const isDeleteBool = isDeleted === true || isDeleted === "true";
    const variant = await Variant.findByIdAndUpdate(
      id,
      { isDeleted: isDeleted },
      { new: true }
    );

    if (!variant) {
      return res.status(404).json({ message: "Không tìm thấy biến thể" });
    }

    const message = isDeleteBool
      ? "Xoá mềm biến thể thành công"
      : "Khôi phục biến thể thành công";

    return res.status(200).json({
      message,
      variant,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server khi cập nhật trạng thái biến thể",
      error: error.message,
    });
  }
};

exports.getSoftDeletedVariants = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [variants, total] = await Promise.all([
      Variant.find({ isDeleted: true })
        .populate({
          path: "product_id",
          select: "product_name", // chỉ lấy trường name từ product
        })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),

      Variant.countDocuments({ isDelete: true }),
    ]);

    const totalPages = Math.ceil(total / limit);

    const formattedVariants = variants.map((v) => ({
      ...v._doc,
      product_name: v.product_id?.name || "Không xác định",
    }));

    return res.status(200).json({
      message: "Danh sách biến thể đã xoá mềm",
      page,
      totalPages,
      total,
      variants: formattedVariants,
    });
  } catch (error) {
    console.error("Lỗi getSoftDeletedVariants:", error);
    return res.status(500).json({
      message: "Lỗi server khi lấy biến thể đã xoá mềm",
      error: error.message,
    });
  }
};

exports.createVariantBulk = async (req, res) => {
  console.log("Data biến thể", req.body);
  const { productId } = req.params;
  const { variants } = req.body;

  if (!mongoose.isValidObjectId(productId)) {
    return res.status(400).json({ message: "productId không hợp lệ" });
  }
  if (!Array.isArray(variants) || variants.length === 0) {
    return res
      .status(400)
      .json({ message: "variants phải là mảng và không rỗng" });
  }

  // Chuẩn hóa và lọc dữ liệu
  const docs = variants
    .map((v) => ({
      product_id: productId,
      size: (v.size ?? "").trim(),
      color: (v.color ?? "").trim(),
      price: Number(v.price ?? 0),
      stock: Number(v.stock ?? 0),
      image: Array.isArray(v.image) ? v.image : v.image ? [v.image] : [],
    }))
    .filter((v) => v.size && v.color && v.price >= 0 && v.stock >= 0);

  if (docs.length === 0) {
    return res.status(400).json({ message: "Dữ liệu biến thể không hợp lệ" });
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    // Lấy những biến thể đã tồn tại để loại trùng
    const existed = await Variant.find(
      {
        product_id: productId,
        $or: docs.map((d) => ({
          size: new RegExp(`^${d.size}$`, "i"),
          color: new RegExp(`^${d.color}$`, "i"),
        })),
      },
      { size: 1, color: 1 },
      { session }
    );

    const existedSet = new Set(
      existed.map((e) => `${normalize(e.size)}|${normalize(e.color)}`)
    );

    const toInsert = docs.filter(
      (d) => !existedSet.has(`${normalize(d.size)}|${normalize(d.color)}`)
    );

    let inserted = [];
    if (toInsert.length > 0) {
      inserted = await Variant.insertMany(toInsert, {
        session,
        ordered: false,
      });
    }

    await session.commitTransaction();
    session.endSession();

    return res.json({
      message: "Tạo biến thể hoàn tất",
      requested: docs.length,
      inserted: inserted.length,
      skipped: docs.length - inserted.length,
      variants: inserted,
    });
  } catch (error) {
    console.error("Lỗi khi thêm biến thể:", error);
    return res.status(500).json({
      message: "Lỗi server khi lấy biến thể đã xoá mềm",
      error: error.message,
    });
  }
};
