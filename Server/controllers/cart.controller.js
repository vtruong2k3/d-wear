const Cart = require("../models/carts");
const Product = require("../models/products");
const Variant = require("../models/variants");
const cartValidate = require("../validate/cartValidate");

exports.addToCart = async (req, res) => {
  try {
    // validate req.body
    const { error } = cartValidate.addTocart.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }
    const { user_id, product_id, variant_id, quantity } = req.body;

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
      user_id,
      variant_id,
    });
    if (exsitingCart) {
      // Update sản phẩm nếu có sản phẩm
      const updated = await Cart.findOneAndUpdate(
        { user_id, variant_id },
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
        user_id,
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
    // validate req.body
    const { error } = cartValidate.addTocart.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }
    const { user_id, product_id, variant_id, quantity } = req.body;

    // Nếu số lượng nhỏ hơn 1 thì xoá luôn
    if (quantity < 1) {
      await Cart.deleteOne({ user_id, variant_id });
      return res.status(200).json({ message: "Đã xoá sản phẩm khỏi giỏ hàng" });
    }

    const updated = await Cart.findOneAndUpdate(
      { user_id, variant_id },
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
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
