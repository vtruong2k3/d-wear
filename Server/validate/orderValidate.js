const Joi = require("joi");

const createOrderSchema = Joi.object({
  user_id: Joi.string().optional(), // Nếu chưa đăng nhập
  items: Joi.array()
    .items(
      Joi.object({
        product_id: Joi.string().required().messages({
          "string.base": "product_id phải là chuỗi",
          "any.required": "product_id là bắt buộc",
        }),
        variant_id: Joi.string().required().messages({
          "string.base": "variant_id phải là chuỗi",
          "any.required": "variant_id là bắt buộc",
        }),
        quantity: Joi.number().min(1).required().messages({
          "number.base": "quantity phải là số",
          "number.min": "quantity phải ít nhất là 1",
          "any.required": "quantity là bắt buộc",
        }),
        price: Joi.number().min(0).required().messages({
          "number.base": "price phải là số",
          "number.min": "price không được âm",
          "any.required": "price là bắt buộc",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "Phải có ít nhất một sản phẩm trong giỏ hàng",
      "array.base": "items phải là một mảng",
    }),
  voucher_id: Joi.string().allow("", null).optional(),
  paymentMethod: Joi.string().valid("cod", "vnpay").required().messages({
    "any.only": 'paymentMethod phải là "cod" hoặc "vnpay"',
    "any.required": "paymentMethod là bắt buộc",
  }),
  receiverName: Joi.string().required().messages({
    "string.base": "receiverName phải là chuỗi",
    "any.required": "receiverName là bắt buộc",
  }),
  shippingAddress: Joi.string().required().messages({
    "string.base": "shippingAddress phải là chuỗi",
    "any.required": "shippingAddress là bắt buộc",
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{9,11}$/)
    .required()
    .messages({
      "string.pattern.base": "Số điện thoại phải có 9 đến 11 chữ số",
      "any.required": "phone là bắt buộc",
    }),
  note: Joi.string().allow("", null),
  email: Joi.string().email().allow("", null).optional(),
});

module.exports = { createOrderSchema };
