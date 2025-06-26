const Joi = require("joi");

const variantValidate = {
  create: Joi.object({
    product_id: Joi.string().required().messages({
      "any.required": "Thiếu product_id",
      "string.empty": "Product ID không được để trống",
    }),

    size: Joi.string()
      .valid("XS", "S", "M", "L", "XL", "XXL")
      .required()
      .messages({
        "any.only": "Size không hợp lệ",
        "any.required": "Size là bắt buộc",
        "string.empty": "Size không được để trống",
      }),

    color: Joi.string().required().messages({
      "any.required": "Màu là bắt buộc",
      "string.empty": "Màu không được để trống",
    }),

    stock: Joi.number().integer().min(0).required().messages({
      "number.base": "Tồn kho phải là số",
      "number.min": "Tồn kho không được âm",
      "any.required": "Tồn kho là bắt buộc",
    }),

    price: Joi.number().min(0).required().messages({
      "number.base": "Giá phải là số",
      "number.min": "Giá không được âm",
      "any.required": "Giá là bắt buộc",
    }),

    image: Joi.array().items(Joi.string()).messages({
      "array.base": "Ảnh phải là một mảng đường dẫn",
      "string.base": "Ảnh phải là đường dẫn dạng chuỗi",
    }),
  }),

  update: Joi.object({
    product_id: Joi.string().required().messages({
      "any.required": "Thiếu product_id",
      "string.empty": "Product ID không được để trống",
    }),

    size: Joi.string()
      .valid("XS", "S", "M", "L", "XL", "XXL")
      .required()
      .messages({
        "any.only": "Size không hợp lệ",
        "any.required": "Size là bắt buộc",
        "string.empty": "Size không được để trống",
      }),

    color: Joi.string().required().messages({
      "any.required": "Màu là bắt buộc",
      "string.empty": "Màu không được để trống",
    }),

    stock: Joi.number().integer().min(0).required().messages({
      "number.base": "Tồn kho phải là số",
      "number.min": "Tồn kho không được âm",
      "any.required": "Tồn kho là bắt buộc",
    }),

    price: Joi.number().min(0).required().messages({
      "number.base": "Giá phải là số",
      "number.min": "Giá không được âm",
      "any.required": "Giá là bắt buộc",
    }),

    image: Joi.array().items(Joi.string()).messages({
      "array.base": "Ảnh phải là một mảng đường dẫn",
      "string.base": "Ảnh phải là đường dẫn dạng chuỗi",
    }),
  }),
};

module.exports = variantValidate;
