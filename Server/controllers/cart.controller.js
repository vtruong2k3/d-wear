const Cart = require("../models/carts");
const Product = require("../models/products");
const Variant = require("../models/variants");
const cartValidate = require("../validate/cartValidate");

exports.getAllCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await Cart.find({ user_id: userId })
      .populate("product_id", "product_name imageUrls ")
      .populate("variant_id", "size color")
      .lean();

    if (!result) {
      return res.status(404).json({
        message: "Giỏ hàng trống",
      });
    }
    res.status(200).json({
      message: "Lấy giỏ hàng thành công",
      carts: result,
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
    // validate req.body
    const { error } = cartValidate.addTocart.validate(
      { product_id, variant_id, quantity },
      {
        abortEarly: false,
      }
    );
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }

    // Kiểm tra sản phẩm có tồn tại hay không
    const exsitingProduct = await Product.findById(product_id);
    if (!exsitingProduct) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    // kiếm tra biến thể có tồn tại hay không

    const exsitingVariant = await Variant.findOne({
      _id: variant_id,
      product_id: product_id,
    });

    if (!exsitingVariant) {
      return res.status(404).json({ message: "Biến thể không tồn tại" });
    }

    // Kiểm tra sản phẩm có  trong giỏ hàng hay chưa
    const exsitingCart = await Cart.findOne({
      user_id: userId,
      variant_id,
    });
    if (exsitingCart) {
      // Update sản phẩm nếu có sản phẩm
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
      // thêm mới nếu chưa có sản phẩm
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
    const userId = req.user.id;
    const { product_id, variant_id, quantity } = req.body;
    // validate req.body
    const { error } = cartValidate.addTocart.validate(
      { product_id, variant_id, quantity },
      {
        abortEarly: false,
      }
    );
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }

    // Nếu số lượng nhỏ hơn 1 thì xoá luôn
    if (quantity < 1) {
      await Cart.deleteOne({ user_id: userId, variant_id });
      return res.status(200).json({ message: "Đã xoá sản phẩm khỏi giỏ hàng" });
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
    res
      .status(200)
      .json({
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
