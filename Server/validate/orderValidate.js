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
        product_name: Joi.string().required().messages({
          "string.base": "product_name phải là chuỗi",
          "any.required": "product_name là bắt buộc",
        }),
        product_image: Joi.string().required().messages({
          "string.base": "product_image phải là chuỗi",
          "any.required": "product_image là bắt buộc",
        }),
        variant_id: Joi.string().required().messages({
          "string.base": "variant_id phải là chuỗi",
          "any.required": "variant_id là bắt buộc",
        }),
        size: Joi.string().required().messages({
          "string.base": "size phải là chuỗi",
          "any.required": "size là bắt buộc",
        }),
        color: Joi.string().required().messages({
          "string.base": "color phải là chuỗi",
          "any.required": "color là bắt buộc",
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
  paymentMethod: Joi.string()
    .valid("cod", "vnpay", "momo")
    .required()
    .messages({
      "any.only": 'paymentMethod phải là "cod" hoặc "vnpay","momo"',
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
  email: Joi.string().email().allow("", null).optional().messages({
    "string.email": "email không hợp lệ",
  }),
  shippingFee: Joi.number().min(0).default(0).messages({
    "number.base": "shippingFee phải là số",
    "number.min": "shippingFee không được âm",
  }),
});

module.exports = { createOrderSchema };
