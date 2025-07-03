
const Joi = require("joi");

const productValidate = {
  createProduct: Joi.object({
    product_name: Joi.string().min(3).max(500).required().messages({
      "string.base": "Tên sản phẩm phải là chuỗi.",
      "string.empty": "Tên sản phẩm không được để trống.",
      "string.min": "Tên sản phẩm phải có ít nhất {#limit} ký tự.",
      "string.max": "Tên sản phẩm không được vượt quá {#limit} ký tự.",
      "any.required": "Tên sản phẩm là bắt buộc.",
    }),
    description: Joi.string().max(5000).required().messages({
      "string.base": "Mô tả phải là chuỗi.",
      "string.empty": "Mô tả không được để trống.",
      "string.max": "Mô tả không được vượt quá {#limit} ký tự.",
      "any.required": "Mô tả là bắt buộc.",
    }),
    basePrice: Joi.number().min(0).required().messages({
      "number.base": "Giá sản phẩm phải là số.",
      "number.min": "Giá sản phẩm không được nhỏ hơn {#limit}.",
      "any.required": "Giá sản phẩm là bắt buộc.",
    }),
    imageUrls: Joi.array()
      .items(
        Joi.string().messages({
          "string.base": "Đường dẫn ảnh phải là chuỗi.",
        })
      )
      .min(1)
      .required()
      .messages({
        "array.base": "Danh sách ảnh phải là một mảng.",
        "array.min": "Phải có ít nhất {#limit} ảnh.",
        "any.required": "Danh sách ảnh là bắt buộc.",
      }),
    brand_id: Joi.string().length(24).required().messages({
      "string.base": "ID thương hiệu phải là chuỗi.",
      "string.length": "ID thương hiệu không hợp lệ.",
      "any.required": "ID thương hiệu là bắt buộc.",
    }),
    category_id: Joi.string().length(24).required().messages({
      "string.base": "ID danh mục phải là chuỗi.",
      "string.length": "ID danh mục không hợp lệ.",
      "any.required": "ID danh mục là bắt buộc.",
    }),
    gender: Joi.string().valid("male", "female", "unisex").messages({
      "string.base": "Giới tính phải là chuỗi.",
      "any.only":
        "Giới tính phải là một trong các giá trị: male, famale, unisex.",
    }),
    material: Joi.string().allow("").messages({
      "string.base": "Chất liệu phải là chuỗi.",
    }),
  }),
};

module.exports = productValidate;

