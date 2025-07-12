const Cart = require("../models/carts");
const Product = require("../models/products");
const Variant = require("../models/variants");
const cartValidate = require("../validate/cartValidate");

exports.getAllCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await Cart.find({ user_id: userId })
      .populate("product_id", "product_name imageUrls")
      .populate("variant_id", "size color")
      .sort({ createdAt: -1 })
      .lean();

    if (result.length === 0) {
      return res.status(404).json({
        message: "Giỏ hàng trống",
      });
    }

    // Tính tổng tiền từng item
    const carts = result.map((item) => ({
      ...item,
      totalPrice: item.quantity * item.price,
    }));

    // Tính tổng tiền toàn bộ giỏ hàng (tuỳ chọn)
    const totalAmount = carts.reduce((sum, item) => sum + item.totalPrice, 0);

    res.status(200).json({
      message: "Lấy giỏ hàng thành công",
      carts,
      totalAmount,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, variant_id, quantity } = req.body;

    const { error } = cartValidate.addTocart.validate(
      { product_id, variant_id, quantity },
      { abortEarly: false }
    );
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }

    const exsitingProduct = await Product.findById(product_id);
    if (!exsitingProduct) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    const exsitingVariant = await Variant.findOne({
      _id: variant_id,
      product_id: product_id,
    });

    if (!exsitingVariant) {
      return res.status(404).json({ message: "Biến thể không tồn tại" });
    }

    // Kiểm tra sản phẩm có trong giỏ hàng chưa
    const exsitingCart = await Cart.findOne({
      user_id: userId,
      variant_id,
    });

    // ✅ Kiểm tra tồn kho
    if (exsitingCart) {
      const totalQuantity = exsitingCart.quantity + quantity;
      if (totalQuantity > exsitingVariant.stock) {
        return res.status(400).json({
          message: `Số lượng vượt quá tồn kho (${exsitingVariant.stock})`,
        });
      }

      // ✅ Update số lượng nếu hợp lệ
      const updated = await Cart.findOneAndUpdate(
        { user_id: userId, variant_id },
        { $inc: { quantity: quantity } },
        { new: true }
      );
      return res.status(200).json({
        message: "Cập nhật số lượng vào giỏ hàng thành công",
        data: updated,
      });
    } else {
      if (quantity > exsitingVariant.stock) {
        return res.status(400).json({
          message: `Số lượng vượt quá tồn kho (${exsitingVariant.stock})`,
        });
      }

      const cart = await Cart.create({
        user_id: userId,
        product_id,
        variant_id,
        quantity,
        price: exsitingVariant.price,
      });
      return res.status(201).json({
        message: "Thêm sản phẩm vào giỏ hàng thành công",
        data: cart,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.updateCartQuantity = async (req, res) => {
  try {
    const { product_id, variant_id, quantity } = req.body;
    const userId = req.user.id || req.body.user_id;
    console.log("dư liệu vào: ", req.body);

    // Validate dữ liệu đầu vào
    const { error } = cartValidate.addTocart.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }

    // Nếu số lượng nhỏ hơn 1 thì xoá sản phẩm khỏi giỏ hàng
    if (quantity < 1) {
      await Cart.deleteOne({ user_id: userId, variant_id });
      return res.status(200).json({ message: "Đã xoá sản phẩm khỏi giỏ hàng" });
    }

    // Tìm biến thể sản phẩm để kiểm tra tồn kho
    const variant = await Variant.findOne({
      _id: variant_id,
      product_id,
    });

    if (!variant) {
      return res.status(404).json({ message: "Biến thể không tồn tại" });
    }

    if (quantity > variant.stock) {
      return res.status(400).json({
        message: `Số lượng vượt quá tồn kho. Chỉ còn ${variant.stock} sản phẩm.`,
      });
    }

    const updated = await Cart.findOneAndUpdate(
      { user_id: userId, variant_id },
      { $set: { quantity } },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm trong giỏ" });
    }

    return res.status(200).json({
      message: "Cập nhật số lượng thành công",
      cart: updated,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.deleteProductCart = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const deleted = await Cart.findOneAndDelete({ _id: id, user_id: userId });
    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy item trong giỏ hàng" });
    }

    res.status(200).json({ message: "Xoá sản phẩm khỏi giỏ hàng thành công" });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
exports.deleteAllCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await Cart.deleteMany({ user_id: userId });
    res.status(200).json({
      message: "Xoá tất cả sản phẩm khỏi giỏ hàng thành công",
      deleteCount: result.deletedCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
